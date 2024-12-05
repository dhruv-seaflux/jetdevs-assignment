import { InjectCls, SFRouter } from "@helpers";
import { RouterDelegates } from "@types";
import { ArticlesController } from "./articles.controller";

export class ArticlesRouter extends SFRouter implements RouterDelegates {
    @InjectCls(ArticlesController)
    private articlesController: ArticlesController;

    initRoutes(): void {
      this.router.get("/", this.articlesController.getAllArticles);
    }
}
