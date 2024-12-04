import { Router } from "express";
import * as l10n from "jm-ez-l10n";

export default class Routes {
  public configure() {
    const router = Router();
    router.get("/hc", (_, res) => res.status(200).json({ message: "OK" }))
    
    router.all("/*", (req,res) =>
      res.status(404).json({
        error: l10n.t("ERR_URL_NOT_FOUND"),
      }),
    );
    return router;
  }
}
