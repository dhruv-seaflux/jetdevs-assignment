import { InjectCls, SFRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { CommentsController } from "./comments.controller";
import { AddArticleCommentDto, GetCommentsOnArticleDto, ReplyArticleCommentDto } from "./dto";

export class CommentsRouter extends SFRouter implements RouterDelegates {
  @InjectCls(CommentsController)
  private commentsController: CommentsController;

  initRoutes(): void {
    this.router.post("/", Validator.validate(AddArticleCommentDto), this.commentsController.addCommentToArticle);
    this.router.post("/reply", Validator.validate(ReplyArticleCommentDto), this.commentsController.replyCommentToArticle);
    this.router.get("/comment/:articleId", Validator.validate(GetCommentsOnArticleDto), this.commentsController.getAllCommentsOnArticle);
  }
}
