import { ArticlesEntity } from "@entities";
import { InitRepository, InjectRepositories, Log } from "@helpers";
import path from "path";
import { Repository } from "typeorm";

export class ArticlesHelper {
    public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

    @InitRepository(ArticlesEntity)
    articlesRepository: Repository<ArticlesEntity>;

    constructor() {
      InjectRepositories(this);
    }

    public articleDetails = async (articleId: number): Promise<ArticlesEntity | null> => {
      const article = await this.articlesRepository.findOne({ where: { id: articleId } });
      if (!article) {
        return null;
      }
      return article;
    };

}
