import { ArticlesEntity } from "@entities";
import { InitRepository, InjectRepositories, Log } from "@helpers";
import path from "path";
import { Repository } from "typeorm";

/**
 * Helper class for handling article-related logic.
 * Provides methods to interact with the ArticlesEntity repository, such as retrieving article details.
 */
export class ArticlesHelper {
  public logger = Log.getLogger(`${path.relative(process.cwd(), __dirname)}/${this.constructor.name}`);

  @InitRepository(ArticlesEntity)
  articlesRepository: Repository<ArticlesEntity>;

  constructor() {
    InjectRepositories(this);
  }

  /**
   * Retrieves the details of an article by its ID.
   * 
   * This method queries the `ArticlesEntity` repository to fetch an article based on the provided `articleId`.
   * If the article is not found, it returns `null`.
   * 
   * @param {number} articleId The ID of the article to retrieve.
   * @returns {Promise<ArticlesEntity | null>} The article details if found, or `null` if not.
   */
  public articleDetails = async (articleId: number): Promise<ArticlesEntity | null> => {
    // Fetch the article from the repository
    const article = await this.articlesRepository.findOne({ where: { id: articleId } });
    
    // If the article is not found, return null
    if (!article) {
      return null;
    }

    // Return the found article
    return article;
  };
}
