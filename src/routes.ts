import { ArticlesRouter } from "@modules/articles/articles.routes";
import { CommentsRouter } from "@modules/comments/comments.routes";
import { Router } from "express";
import * as l10n from "jm-ez-l10n";

export default class Routes {
  public configure() {
    const router = Router();
    router.get("/health-check", (_, res) => res.status(200).json({ message: "OK" }))
    router.use("/articles", new ArticlesRouter().router);
    router.use("/comments", new CommentsRouter().router);
    
    router.all("/*", (req,res) =>
      res.status(404).json({
        error: l10n.t("ERR_URL_NOT_FOUND"),
      }),
    );
    return router;
  }
}
