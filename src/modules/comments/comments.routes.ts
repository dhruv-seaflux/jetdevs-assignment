import { InjectCls, JDRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { CommentsController } from "./comments.controller";
import { AddArticleCommentDto, GetCommentsOnArticleDto } from "./dto";

export class CommentsRouter extends JDRouter implements RouterDelegates {
  @InjectCls(CommentsController)
  private commentsController: CommentsController;

  initRoutes(): void {
    this.router.post("/", Validator.validate(AddArticleCommentDto), this.commentsController.handleComment);
    this.router.get("/article/:articleId", Validator.validate(GetCommentsOnArticleDto), this.commentsController.getAllCommentsOnArticle);
  }
}
