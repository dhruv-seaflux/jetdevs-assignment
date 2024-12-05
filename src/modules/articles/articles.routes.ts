import { InjectCls, SFRouter, Validator } from "@helpers";
import { RouterDelegates } from "@types";
import { ArticlesController } from "./articles.controller";
import { GetAllArticlesDto, CreateArticleDto, GetArticleContentDto } from "./dto";

export class ArticlesRouter extends SFRouter implements RouterDelegates {
    @InjectCls(ArticlesController)
    private articlesController: ArticlesController;

    initRoutes(): void {
      this.router.post("/",Validator.validate(CreateArticleDto), this.articlesController.createArticles);
      this.router.get("/",Validator.validate(GetAllArticlesDto), this.articlesController.getAllArticles);
      this.router.get("/content/:articleId",Validator.validate(GetArticleContentDto), this.articlesController.getArticleContent);
    }
}
