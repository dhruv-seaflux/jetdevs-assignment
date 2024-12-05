import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectCls, InjectRepositories } from "@helpers";
import { ArticlesEntity, CommentsEntity } from "@entities";
import { ArticlesHelper } from "@modules/articles/helpers/articles.helper";
import { CommentQueue } from "./queues/comments.queue";
import { AddArticleCommentDto, GetCommentsOnArticleDto, ReplyArticleCommentDto } from "./dto";

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

  public addCommentToArticle = async (req: TRequest<AddArticleCommentDto>, res: TResponse) => {
    const { articleId, nickname, parentCommentId, comment } = req.dto as AddArticleCommentDto;

    const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
    if (!article) return res.status(404).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });

    try {
      const addCommentResult = await this.commentQueue.addCommentToArticle(articleId, nickname, parentCommentId, comment);

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

  public replyCommentToArticle = async (req: TRequest<ReplyArticleCommentDto>, res: TResponse) => {
    const { nickname, parentCommentId, comment } = req.dto as ReplyArticleCommentDto;

    const parentComment = await this.commentsRepository.findOne({ where: { id: parentCommentId } }) as CommentsEntity;
    if (!parentComment) return res.status(404).json({ error: l10n.t("ERR_COMMENT_NOT_FOUND") });

    try {
      const replyCommentResult = await this.commentQueue.replyCommentToArticle(parentComment.articleId, nickname, parentCommentId, comment);

      return res.status(201).json({
        message: l10n.t("COMMENT_REPLIED_SUCCESSFULLY"),
        data: replyCommentResult,
      });
    } catch (error) {
      return res.status(500).json({
        message: l10n.t("ERR_FAILED_COMMENT_JOB"),
        error: error.message,
      });
    }
  };

  public getAllCommentsOnArticle = async (req: TRequest<GetCommentsOnArticleDto>, res: TResponse) => {
    const { articleId } = req.dto as GetCommentsOnArticleDto;

    const article = await this.articlesHelper.articleDetails(articleId) as ArticlesEntity | null;
    if (!article) return res.status(404).json({ error: l10n.t("ERR_ARTICLE_NOT_FOUND") });

    const comments = await this.commentsRepository.find({ where: { articleId }, order: { createdAt: "DESC" } });
    return res.status(200).json({ comments });
  }
}
