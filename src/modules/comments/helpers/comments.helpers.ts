import { Job } from "bullmq";
import path from 'path';
import { InitRepository, InjectRepositories, Log } from '@helpers';
import { CommentsEntity } from "@entities";
import { Repository } from "typeorm";
import { AddArticleCommentDto } from "../dto";

export class CommentHelper {
  public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

  @InitRepository(CommentsEntity)
  private commentRepository: Repository<CommentsEntity>;

  constructor() {
    InjectRepositories(this);
  }

  public addComment = async (job: Job) => {
    const { articleId, nickname, parentCommentId, comment } = job.data as AddArticleCommentDto;
    try {
      // Validate input data
      if (!articleId || !comment) {
        throw new Error('Invalid job data: Missing articleId or comment');
      }

      // Save comment to the database
      const newComment = await this.commentRepository.create({
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
}