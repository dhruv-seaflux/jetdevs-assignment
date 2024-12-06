import request from "supertest";
import chai from "chai";
import { CommentsEntity } from "@entities";
import * as l10n from "jm-ez-l10n";
import { Constants } from "test/constants";
import App from "../../server";

const { expect } = chai;

/**
 * Test suite for the Comments module.
 * This suite contains tests for adding comments, replying to comments,
 * and fetching comments for a specific article.
 */
describe("Comments Module - Comment Creation, Replying, and Fetching", () => {
  let commentId: number;
  let articleId: number;

  /**
   * Test case for adding a comment to an article.
   * This test checks the creation of a comment for an article, given that the article already exists.
   */
  it("1. It should add comment in article", async () => {
    // Create a new article to comment on
    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ARTICLE_DATA);
    const { nickname } = Constants.ARTICLE_DATA;

    // Create a comment on the newly created article
    const commentResponse = await request(App.getExpressApp()).post(`/comments`).send({
      articleId: response.body.data.id,
      nickname,
      comment: "This is a comment",
    });

    // Assert that the article creation was successful
    expect(response.status).to.equal(201);

    // Assert that the comment creation was successful
    expect(commentResponse.status).to.equal(201);
    expect(commentResponse.body.message).to.equal(l10n.t("COMMENT_CREATED_SUCCESSFULLY"));

    // Store the comment ID and article ID for further tests
    commentId = commentResponse.body.data.id;
    articleId = commentResponse.body.data.articleId;
  });

  /**
   * Test case for adding a reply to a comment.
   * This test checks if a reply can be added to an existing comment under an article.
   */
  it("2. It should add reply for comment in article", async () => {
    const { nickname } = Constants.ARTICLE_DATA;

    // Add a reply to the previously created comment
    const response = await request(App.getExpressApp()).post(`/comments`).send({
      articleId,
      nickname,
      parentCommentId: commentId, // Replying to the existing comment
      comment: "This is a reply comment",
    });

    // Assert that the reply was successfully created
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(l10n.t("COMMENT_CREATED_SUCCESSFULLY"));
  });

  /**
   * Test case for retrieving all comments associated with an article.
   * This test checks the ability to fetch all comments for an article by its ID.
   */
  it("3. It should get all article's comments by ID", async () => {
    // Send GET request to fetch all comments for the article
    const response = await request(App.getExpressApp()).get(`/comments/article/${articleId}`);

    // Assert that the response status is 200 (OK) and that the response contains an array of comments
    expect(response.status).to.equal(200);
    expect(response.body.comments).to.be.an("array");

    // Assert that each comment in the array has the expected properties
    response.body.comments.forEach((comment: CommentsEntity) => {
      expect(comment).to.have.property("articleId").that.is.a("number");
      expect(comment).to.have.property("nickname").that.is.a("string");
      expect(comment).to.have.property("content").that.is.a("string");

      // Assert that the parentCommentId is either null or a number (for replies)
      expect(comment).to.have.property("parentCommentId")
        .that.satisfies((val: any) => val === null || typeof val === "number");
    });
  });

});
