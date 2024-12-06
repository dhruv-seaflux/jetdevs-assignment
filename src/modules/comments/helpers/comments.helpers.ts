import { Job } from "bullmq";
import path from 'path';
import { InitRepository, InjectRepositories, Log } from '@helpers';
import { CommentsEntity } from "@entities";
import { Repository } from "typeorm";
import { AddArticleCommentDto } from "../dto";

/**
 * Helper class for handling comment-related logic, such as adding a comment to the database.
 * This class processes jobs related to comment creation, interacting with the database and logging the operations.
 */
export class CommentHelper {
  public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

  @InitRepository(CommentsEntity)
  private commentRepository: Repository<CommentsEntity>;

  constructor() {
    InjectRepositories(this);
  }

  /**
   * Handles the process of adding a new comment for an article.
   * This method is used as a BullMQ job processor.
   * It validates the job data, creates a new comment entity, and saves it to the database.
   * 
   * @param {Job} job The BullMQ job containing the comment data to be processed.
   * @returns {Promise<CommentsEntity>} The saved comment object after it is inserted into the database.
   * @throws {Error} If required data is missing or an error occurs during the comment creation process.
   */
  public addComment = async (job: Job): Promise<CommentsEntity> => {
    const { articleId, nickname, parentCommentId, comment } = job.data as AddArticleCommentDto;

    try {
      // Validate required fields
      if (!articleId || !comment) {
        throw new Error('Invalid job data: Missing articleId or comment');
      }

      // Create a new comment entity
      const newComment = await this.commentRepository.create({
        articleId,
        nickname,
        parentCommentId,
        content: comment,
        createdAt: new Date(),
      });

      // Save the new comment to the database
      const newCommentResponse = await this.commentRepository.save(newComment);

      // Log success message
      this.logger.info(`Comment saved successfully for article ID: ${articleId}`);

      return newCommentResponse;
    } catch (error) {
      // Log error message and rethrow the error
      this.logger.error(`Error processing job ID ${job.id}:`, error.message);
      throw error;
    }
  };
}
