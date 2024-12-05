import { InjectCls, JDRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { destructPager } from "@middlewares";
import { ArticlesController } from "./articles.controller";
import { CreateArticleDto, GetArticleContentDto } from "./dto";

export class ArticlesRouter extends JDRouter implements RouterDelegates {
  @InjectCls(ArticlesController)
  private articlesController: ArticlesController;

  initRoutes(): void {
    this.router.post("/", Validator.validate(CreateArticleDto), this.articlesController.createArticles);
    this.router.get("/", destructPager, this.articlesController.getAllArticles);
    this.router.get("/content/:articleId", Validator.validate(GetArticleContentDto), this.articlesController.getArticleContent);
  }
}