import { InjectCls, JDRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { CommentsController } from "./comments.controller";
import { AddArticleCommentDto, GetCommentsOnArticleDto } from "./dto";

/**
 * CommentsRouter class is responsible for handling routes related to comments.
 * It sets up endpoints for adding comments and retrieving comments for articles.
 * Extends `JDRouter` and implements `RouterDelegates` for consistent routing structure.
 */
export class CommentsRouter extends JDRouter implements RouterDelegates {

  @InjectCls(CommentsController)
  private commentsController: CommentsController;

  initRoutes(): void {
    /**
     * POST / - Endpoint to add a new comment to an article.
     * @route POST /
     * @middleware Validator.validate(AddArticleCommentDto) Validates the request body against AddArticleCommentDto schema.
     * @handler CommentsController.handleComment Handles the addition of a new comment to an article.
     */
    this.router.post(
      "/",
      Validator.validate(AddArticleCommentDto),
      this.commentsController.handleComment
    );

    /**
     * GET /article/:articleId - Endpoint to retrieve all comments for a specific article.
     * @route GET /article/:articleId
     * @param {string} articleId Path parameter representing the ID of the article.
     * @middleware Validator.validate(GetCommentsOnArticleDto) Validates the request parameters against GetCommentsOnArticleDto schema.
     * @handler CommentsController.getAllCommentsOnArticle Fetches all comments associated with the specified article.
     */
    this.router.get(
      "/article/:articleId",
      Validator.validate(GetCommentsOnArticleDto),
      this.commentsController.getAllCommentsOnArticle
    );
  }
}
