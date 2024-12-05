import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { ECommentJobNames, TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectCls, InjectRepositories } from "@helpers";
import { ArticlesEntity, CommentsEntity } from "@entities";
import { ArticlesHelper } from "@modules/articles/helpers/articles.helper";
import { myQueue, queueEvents } from "@configs";
import { CommentQueue } from "./queues/comments.queue";
import { AddArticleCommentDto, GetCommentsOnArticleDto } from "./dto";

export class CommentsController extends BaseController {
  @InitRepository(ArticlesEntity)
  articlesRepository: Repository<ArticlesEntity>;

  @InitRepository(CommentsEntity)
  commentsRepository: Repository<CommentsEntity>;

  @InjectCls(CommentQueue)
  private commentQueue: CommentQueue;

  @InjectCls(ArticlesHelper)
  private articlesHelper: ArticlesHelper;

  constructor() {
    super();
    InjectRepositories(this);
  }

  public handleComment = async (req: TRequest<AddArticleCommentDto>, res: TResponse) => {
    const { articleId, nickname, parentCommentId, comment } = req.dto as AddArticleCommentDto;

    try {
      const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
      if (!article) return res.status(400).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });

      if (parentCommentId) {
        const parentComment = await this.commentsRepository.findOne({ where: { id: parentCommentId } });
        if (!parentComment) return res.status(404).json({ error: l10n.t("ERR_COMMENT_ADDITION_FAILED"), message: l10n.t("ERR_PARENT_COMMENT_NOT_FOUND") });
      }

      // Add the job to the queue
      const job = await myQueue.add(ECommentJobNames.AddComment, { articleId, nickname, parentCommentId, comment });

      // Wait for the job to finish and retrieve the result
      const addCommentResult = await job.waitUntilFinished(queueEvents);  // This will return the result of the job once it's completed

      return res.status(201).json({
        message: l10n.t("COMMENT_CREATED_SUCCESSFULLY"),
        data: addCommentResult,
      });
    } catch (error) {
      return res.status(500).json({
        message: l10n.t("ERR_FAILED_COMMENT_JOB"),
        error: error.message,
      });
    }
  };

  // Method to get all comments for a specific article
  public getAllCommentsOnArticle = async (req: TRequest<GetCommentsOnArticleDto>, res: TResponse) => {
    const { articleId } = req.dto as GetCommentsOnArticleDto;

    const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
    if (!article) {
      return res.status(400).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });
    }

    const comments = await this.commentsRepository.find({ where: { articleId }, order: { createdAt: "DESC", id: "DESC" } });
    return res.status(200).json({ comments });
  };
}
