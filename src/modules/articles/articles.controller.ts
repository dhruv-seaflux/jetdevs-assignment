import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectRepositories } from "@helpers";
import { ArticlesEntity } from "@entities";
import { CreateArticleDto, GetArticleContentDto } from "./dto";

/**
 * Controller for managing articles. Provides methods to create articles,
 * retrieve all articles, and fetch the content of a specific article.
 * Extends the `BaseController` class for consistent structure and functionality.
 */
export class ArticlesController extends BaseController {

  @InitRepository(ArticlesEntity)
  articlesRepository: Repository<ArticlesEntity>;

  constructor() {
    super();
    InjectRepositories(this);
  }

  /**
   * Creates a new article.
   * @async
   * @function
   * @param {TRequest<CreateArticleDto>} req - The request object containing article details in the body.
   * @param {TResponse} res - The response object to send the result of the operation.
   * @returns {Promise<TResponse>} Responds with the created article data or an error message.
   * @example
   * POST /articles
   * Body: { "title": "Sample Title", "content": "Sample Content", "nickname": "AuthorName" }
   */
  public createArticles = async (req: TRequest<CreateArticleDto>, res: TResponse): Promise<TResponse> => {
    try {
      const { content, nickname, title } = req.dto as CreateArticleDto;

      const insertData = await this.articlesRepository.save({ content, nickname, title });
      return res.status(201).json({ message: l10n.t("SUCCESS"), data: insertData });

    } catch (error) {
      return res.status(500).json({ error: l10n.t("SOMETHING_WENT_WRONG"), message: error.message });
    }
  };

  /**
   * Retrieves all articles with pagination.
   * @async
   * @function
   * @param {TRequest} req - The request object containing pagination parameters.
   * @param {TResponse} res - The response object to send the list of articles.
   * @returns {Promise<TResponse>} Responds with a list of articles or an error message.
   * @example
   * GET /articles?page=1&limit=20
   */
  public getAllArticles = async (req: TRequest, res: TResponse): Promise<TResponse> => {
    const { page, limit } = req.pager;

    const pageCount = Number(page) || 1;
    const limitCount = Number(limit) || 20;
    const offset = (pageCount - 1) * limitCount;

    const articles = await this.articlesRepository.find({ take: limitCount, skip: offset });
    return res.status(200).json({ message: l10n.t("SUCCESS"), data: articles });
  };

  /**
   * Retrieves the content of a specific article by its ID.
   * @async
   * @function
   * @param {TRequest<GetArticleContentDto>} req - The request object containing the article ID.
   * @param {TResponse} res - The response object to send the article content.
   * @returns {Promise<TResponse>} Responds with the article content or an error message.
   * @example
   * GET /articles/content/:articleId
   * Params: { "articleId": "123" }
   */
  public getArticleContent = async (req: TRequest<GetArticleContentDto>, res: TResponse): Promise<TResponse> => {
    const { articleId } = req.dto as GetArticleContentDto;

    const article = await this.articlesRepository.findOne({ where: { id: articleId }, select: ["content"] }) as Partial<ArticlesEntity>;
    if (!article) return res.status(400).json({ message: l10n.t("ERR_ARTICLE_NOT_FOUND") });

    return res.status(200).json({ content: article.content });
  };
}
