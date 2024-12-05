import { Worker, Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Constants, env } from '@configs';
import { InitRepository, InjectRepositories, Log } from '@helpers';
import { CommentsEntity } from '@entities';
import { ECommentJobNames } from '@types';
import path from 'path';
import { AddArticleCommentDto } from '../dto';

export class CommentsWorker {
  public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

  @InitRepository(CommentsEntity)
  private commentRepository: Repository<CommentsEntity>;

  private worker: Worker;

  constructor() {
    InjectRepositories(this);

    // Log when the worker is being initialized
    this.logger.info('Initializing CommentsWorker and connecting to the queue...');

    this.worker = new Worker(
      Constants.COMMENT_QUEUE,
      this.commentsJob,
      {
        connection: {
          host: env.redisHost,
          port: env.redisPort,
        },
      }
    );

    // Log successful initialization
    this.logger.info('CommentsWorker initialized and connected to the queue.');

    this.initializeEvents();
  }

  private commentsJob = async (job: Job) => {
    if (job.name === ECommentJobNames.AddComment) {
      const result = await this.addComment(job);
      return result; // Return the processed data
    }
  };

  private addComment = async (job: Job) => {
    const { articleId, nickname, parentCommentId, comment } = job.data as AddArticleCommentDto;
    try {
      // Validate input data
      if (!articleId || !comment) {
        throw new Error('Invalid job data: Missing articleId or comment');
      }

      // Save comment to the database
      const newComment = this.commentRepository.create({
        articleId,
        nickname,
        parentCommentId,
        content: comment,
        createdAt: new Date(),
      });

      const newCommentResponse = await this.commentRepository.save(newComment);

      this.logger.info(`Comment saved successfully for article ID: ${articleId}`);

      return newCommentResponse;
    } catch (error) {
      this.logger.error(`Error processing job ID ${job.id}:`, error.message);
      throw error; // Allow retry or failure handling based on queue configuration
    }
  };

  private initializeEvents() {
    this.worker.on('completed', (job: Job) => {
      this.logger.info(`Job completed successfully: ${job.id}`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job failed: ${job.id}`, err.message);
    });
  }
}

export default new CommentsWorker();