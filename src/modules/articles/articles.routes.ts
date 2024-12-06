import { InjectCls, JDRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { destructPager } from "@middlewares";
import { ArticlesController } from "./articles.controller";
import { CreateArticleDto, GetArticleContentDto } from "./dto";

/**
 * ArticlesRouter class is responsible for handling routes related to articles.
 * It sets up endpoints for creating articles, retrieving all articles, and fetching article content.
 * Extends `JDRouter` and implements `RouterDelegates` for consistent routing structure.
 */
export class ArticlesRouter extends JDRouter implements RouterDelegates {
  
  @InjectCls(ArticlesController)
  private articlesController: ArticlesController;

  initRoutes(): void {
    /**
     * POST / - Endpoint to create a new article.
     * @route POST /
     * @middleware Validator.validate(CreateArticleDto) Validates the request body against CreateArticleDto schema.
     * @handler ArticlesController.createArticles Handles the creation of an article.
     */
    this.router.post(
      "/",
      Validator.validate(CreateArticleDto),
      this.articlesController.createArticles
    );

    /**
     * GET / - Endpoint to retrieve all articles.
     * @route GET /
     * @middleware destructPager Parses pagination parameters from the request.
     * @handler ArticlesController.getAllArticles Fetches a list of all articles.
     */
    this.router.get("/", destructPager, this.articlesController.getAllArticles);

    /**
     * GET /content/:articleId - Endpoint to fetch the content of a specific article.
     * @route GET /content/:articleId
     * @param {string} articleId Path parameter representing the ID of the article.
     * @middleware Validator.validate(GetArticleContentDto) Validates the request parameters against GetArticleContentDto schema.
     * @handler ArticlesController.getArticleContent Fetches the content of the specified article.
     */
    this.router.get(
      "/content/:articleId",
      Validator.validate(GetArticleContentDto),
      this.articlesController.getArticleContent
    );
  }
}
