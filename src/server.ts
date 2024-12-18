import { json, urlencoded } from "body-parser";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import methodOverride from "method-override";
import * as l10n from "jm-ez-l10n";
import { ArticlesEntity, CommentsEntity } from "@entities";
import { DB, env } from "@configs";
import { destructPager } from "@middlewares";
import { Cors, EnvValidator, HandleUnhandledPromise, Log } from "@helpers";
import "reflect-metadata";
import { QueueWorker } from "configs/queue/worker";
import Routes from "./routes";

dotenv.config();

class App {
  protected app: express.Application;

  private logger = Log.getLogger();

  public init() {
    // init DB.
    DB.init({
      type: "mysql",
      host: env.dbHost,
      port: 3307,
      username: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      entities: [ArticlesEntity, CommentsEntity],
    });

    // Handle Unhandled Promise Rejections
    new HandleUnhandledPromise().init();

    // Validate ENV file
    EnvValidator.validate(env);

    // Init Express
    this.app = express();

    // Security
    Cors.enable(this.app);
    this.app.use(helmet());
    this.app.use(morgan("tiny"));
    this.app.use(compression());

    // Enable DELETE and PUT
    this.app.use(methodOverride());

    // Translation
    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    this.app.use(l10n.enableL10NExpress);

    // Body Parsing
    this.app.use(json({ limit: "50mb" }));
    this.app.use(urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

    // Destruct Pager from query string and typecast to numbers
    this.app.use(destructPager);

    // Routing
    const routes = new Routes();
    this.app.use("/", routes.configure());

    // Start server
    this.app.listen(process.env.PORT, () => {
      // Initialize the worker
      const commentWorker = new QueueWorker();

      // Graceful shutdown of queue worker
      process.on("SIGINT", async () => {
        this.logger.info("Shutting down...");
        await commentWorker.shutdown();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        this.logger.info("Shutting down...");
        await commentWorker.shutdown();
        process.exit(0);
      });

      this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
    });
  }

  public getExpressApp() {
    return this.app;
  }
}

export default new App;