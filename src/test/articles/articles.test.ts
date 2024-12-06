import request from "supertest";
import chai from "chai";
import * as l10n from "jm-ez-l10n";
import { Constants } from "test/constants";
import App from "../../server";

const { expect } = chai;

// Initialize the application
App.init();

/**
 * Test suite for the Articles module.
 * Contains tests for creating articles, fetching articles, and handling article-related errors.
 */
describe("Articles Module - CRUD Operations and Error Handling", () => {
  let newArticleId: number;

  /**
   * Test case for successfully creating an article with all required parameters.
   * This test checks the ability to create an article when all required fields are provided.
   */
  it("1. It should create an article, as all parameters required are provided", async () => {
    // Wait for a short period to ensure any asynchronous operations can complete
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    // Send POST request to create a new article
    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ARTICLE_DATA);

    // Assert that the response status is 201 (created) and the article ID is returned
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(l10n.t("SUCCESS"));
    expect(response.body.data.id).to.be.a('number');

    // Store the newly created article ID for later use in other tests
    newArticleId = response.body.data.id;
  });

  /**
   * Test case for attempting to create an article without all required parameters.
   * This test checks the server's response when mandatory parameters are missing.
   */
  it("2. It should create an article, as all parameters required are not provided", async () => {
    // Send POST request with missing required parameters (invalid data)
    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ERROR_ARTICLE_DATA);

    // Assert that the response status is 400 (bad request) due to missing parameters
    expect(response.status).to.equal(400);
  });

  /**
   * Test case for fetching all articles with pagination.
   * This test checks the ability to retrieve a list of articles with pagination support.
   */
  it("3. It should get all articles with pagination", async () => {
    // Send GET request to fetch articles with pagination
    const response = await request(App.getExpressApp()).get(`/articles?page=1&limit=10`);

    // Assert that the response status is 200 (OK) and data is an array
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(l10n.t("SUCCESS"));
    expect(response.body.data).to.be.an("array");
  });

  /**
   * Test case for fetching a specific article's content by its ID.
   * This test checks the ability to fetch article content by providing the article's ID.
   */
  it("4. It should get article data", async () => {
    // Send GET request to fetch the content of the newly created article using its ID
    const response = await request(App.getExpressApp()).get(`/articles/content/${newArticleId}`);

    // Assert that the response status is 200 (OK) and the content matches the data sent when creating the article
    expect(response.status).to.equal(200);
    expect(response.body.content).to.equal(Constants.ARTICLE_DATA.content);
  });

  /**
   * Test case for attempting to fetch article content for an article that does not exist.
   * This test checks how the system handles the scenario where the article ID is not found.
   */
  it("5. It should not get article data, as article not present", async () => {
    // Send GET request for an article that does not exist (article ID = 9999)
    const response = await request(App.getExpressApp()).get(`/articles/content/9999`);

    // Assert that the response status is 400 (bad request) and the appropriate error message is returned
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(l10n.t("ERR_ARTICLE_NOT_FOUND"));
  });
});
