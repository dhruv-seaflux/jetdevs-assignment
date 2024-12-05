import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectRepositories } from "@helpers";
import { ArticlesEntity } from "@entities";
import { GetAllArticlesDto, CreateArticleDto, GetArticleContentDto } from "./dto";

export class ArticlesController extends BaseController {
  @InitRepository(ArticlesEntity)
  articlesRepository: Repository<ArticlesEntity>;

  constructor() {
    super();
    InjectRepositories(this);
  }

  public createArticles = async (req: TRequest<CreateArticleDto>, res: TResponse) => {
    const { content, nickname, title } = req.dto as CreateArticleDto;

    const insertData = await this.articlesRepository.save({ content, nickname, title });
    return res.status(201).json({ message: l10n.t("SUCCESS"), data: insertData });
  }

  public getAllArticles = async (req: TRequest<GetAllArticlesDto>, res: TResponse) => {
    const { page, limit } = req.dto as GetAllArticlesDto;

    const pageCount = Number(page) || 1;
    const limitCount = Number(limit) || 20;
    const offset = (pageCount - 1) * limitCount;

    const articles = await this.articlesRepository.find({ take: limitCount, skip: offset });
    return res.status(200).json({ message: l10n.t("SUCCESS"), data: articles });
  }

  public getArticleContent = async (req: TRequest<GetArticleContentDto>, res: TResponse) => {
    const { articleId } = req.dto as GetArticleContentDto;

    const article = await this.articlesRepository.findOne({ where: { id: articleId }, select: ["content"] }) as Partial<ArticlesEntity>;
    if (!article) return res.status(404).json({ message: l10n.t("ARTICLE_NOT_FOUND") });

    return res.status(200).json({ content: article.content });
  }
}
