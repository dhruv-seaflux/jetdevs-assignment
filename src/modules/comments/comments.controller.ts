import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { ECommentJobNames, TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectCls, InjectRepositories, Log } from "@helpers";
import { ArticlesEntity, CommentsEntity } from "@entities";
import { ArticlesHelper } from "@modules/articles/helpers/articles.helper";
import { commentQueue, queueEvents } from "configs/queue/queue";
import path from "path";
import { AddArticleCommentDto, GetCommentsOnArticleDto } from "./dto";

/**
 * Controller class to handle all comment-related actions, such as adding a comment to an article
 * and retrieving all comments for a specific article. It interacts with the `ArticlesEntity`
 * and `CommentsEntity` repositories, and uses a job queue for processing comment creation.
 */
export class CommentsController extends BaseController {
  public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

  @InitRepository(ArticlesEntity)
  articlesRepository: Repository<ArticlesEntity>;

  @InitRepository(CommentsEntity)
  commentsRepository: Repository<CommentsEntity>;

  @InjectCls(ArticlesHelper)
  private articlesHelper: ArticlesHelper;

  constructor() {
    super();
    InjectRepositories(this);
  }

  /**
   * Handles the request to add a comment to an article.
   * 
   * This method validates if the article exists, checks if the parent comment exists (if provided),
   * and then adds the comment job to a queue for processing. It waits for the job to complete 
   * before sending the response back to the client.
   *
   * @route POST / - Add a new comment to an article.
   * @param {TRequest<AddArticleCommentDto>} req The request object containing the article and comment details.
   * @param {TResponse} res The response object to send back the result or error.
   * @returns {Promise<TResponse>} A response with the result of the comment creation or error message.
   */
  public handleComment = async (req: TRequest<AddArticleCommentDto>, res: TResponse): Promise<TResponse> => {
    const { articleId, nickname, parentCommentId, comment } = req.dto as AddArticleCommentDto;

    try {
      const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
      if (!article) return res.status(400).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });

      if (parentCommentId) {
        const parentComment = await this.commentsRepository.findOne({ where: { id: parentCommentId } });
        if (!parentComment) return res.status(404).json({ error: l10n.t("ERR_COMMENT_ADDITION_FAILED"), message: l10n.t("ERR_PARENT_COMMENT_NOT_FOUND") });
      }

      // Add the job to the queue
      const job = await commentQueue.add(ECommentJobNames.AddComment, { articleId, nickname, parentCommentId, comment });
      this.logger.info(`Comment job added to the queue. Job ID: ${job.id}`);

      // Wait for the job to finish and retrieve the result
      const addCommentResult = await job.waitUntilFinished(queueEvents);  // This will return the result of the job once it's completed

      return res.status(201).json({
        message: l10n.t("COMMENT_CREATED_SUCCESSFULLY"),
        data: addCommentResult.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: l10n.t("ERR_FAILED_COMMENT_JOB"),
        error: error.message,
      });
    }
  };

  /**
   * Retrieves all comments for a specific article.
   *
   * This method checks if the article exists, and if it does, it fetches all associated comments
   * and returns them sorted by creation date in descending order.
   *
   * @route GET /article/:articleId - Get all comments for a specific article.
   * @param {TRequest<GetCommentsOnArticleDto>} req The request object containing the articleId.
   * @param {TResponse} res The response object to send back the comments.
   * @returns {Promise<TResponse>} A response with the list of comments for the specified article.
   */
  public getAllCommentsOnArticle = async (req: TRequest<GetCommentsOnArticleDto>, res: TResponse): Promise<TResponse> => {
    const { articleId } = req.dto as GetCommentsOnArticleDto;

    const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
    if (!article) {
      return res.status(400).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });
    }

    const comments = await this.commentsRepository.find({ where: { articleId }, order: { createdAt: "DESC", id: "DESC" } });
    return res.status(200).json({ comments });
  };
}
