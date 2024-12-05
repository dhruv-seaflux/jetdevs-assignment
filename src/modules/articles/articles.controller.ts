import { Repository } from "typeorm";
import * as l10n from "jm-ez-l10n";
import { TRequest, TResponse } from "@types";
import { BaseController } from "@modules/base.controller";
import { InitRepository, InjectRepositories } from "@helpers";
import { ArticleEntity } from "@entities";

export class ArticlesController extends BaseController {
  @InitRepository(ArticleEntity)
  articlesRepository: Repository<ArticleEntity>;

  constructor() {
    super();
    InjectRepositories(this);
  }

  public getAllArticles = async (req: TRequest, res: TResponse) => res.status(200).json({message : l10n.t("SUCCESS")});
}
