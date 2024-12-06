import request from "supertest";
import chai from "chai";
import { CommentsEntity } from "@entities";
import * as l10n from "jm-ez-l10n";
import { Constants } from "test/constants";
import App from "../../server";

const { expect } = chai;

describe("Comments Module", () => {
  let commentId: number;
  let articleId: number; 

  it("1. It should add comment in article", async () => {
    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ARTICLE_DATA);
    const { nickname } = Constants.ARTICLE_DATA

    const commentResponse = await request(App.getExpressApp()).post(`/comments`).send({
      articleId: response.body.data.id,
      nickname,
      comment: "This is a comment"
    });

    expect(response.status).to.equal(201);

    expect(commentResponse.status).to.equal(201);

    expect(commentResponse.body.message).to.equal(l10n.t("COMMENT_CREATED_SUCCESSFULLY"));
    commentId = commentResponse.body.data.id;
    articleId = commentResponse.body.data.articleId;
  });

  it("2. It should add reply for comment in article", async () => {
    const { nickname } = Constants.ARTICLE_DATA

    const response = await request(App.getExpressApp()).post(`/comments`).send({
      articleId,
      nickname,
      parentCommentId: commentId,
      comment: "This is a reply comment"
    });

    expect(response.status).to.equal(201);

    expect(response.body.message).to.equal(l10n.t("COMMENT_CREATED_SUCCESSFULLY"));
  });

  it("3. It should get all article's comments by ID", async () => {
    const response = await request(App.getExpressApp()).get(`/comments/article/${articleId}`);

    expect(response.status).to.equal(200);

    expect(response.body.comments).to.be.an("array")

    // Check that the array contains objects with the expected properties
    response.body.comments.forEach((comment: CommentsEntity) => {
      expect(comment).to.have.property("articleId").that.is.a("number");
      expect(comment).to.have.property("nickname").that.is.a("string");
      expect(comment).to.have.property("content").that.is.a("string");

      expect(comment).to.have.property("parentCommentId")
        .that.satisfies((val: any) => val === null || typeof val === "number");

    });
  });

});