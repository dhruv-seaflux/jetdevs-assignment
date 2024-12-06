import request from "supertest";
import chai from "chai";
import * as l10n from "jm-ez-l10n";
import { Constants } from "test/constants";
import App from "../../server";

const { expect } = chai;

App.init();

describe("Articles Module", () => {
  let newArticleId: number;

  it("1. It should create an article, as all parameters required are provided", async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ARTICLE_DATA);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(l10n.t("SUCCESS"));
    expect(response.body.data.id).to.be.a('number');

    newArticleId = response.body.data.id;
  });

  it("2. It should create an article, as all parameters required are not provided", async () => {
    const response = await request(App.getExpressApp()).post(`/articles`).send(Constants.ERROR_ARTICLE_DATA);
    expect(response.status).to.equal(400);
  });

  it("3. It should get all articles with pagination", async () => {
    const response = await request(App.getExpressApp()).get(`/articles?page=1&limit=10`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(l10n.t("SUCCESS"));
    expect(response.body.data).to.be.an("array")
  });

  it("4. It should get article data ", async () => {
    const response = await request(App.getExpressApp()).get(`/articles/content/${newArticleId}`);

    expect(response.status).to.equal(200);
    expect(response.body.content).to.equal(Constants.ARTICLE_DATA.content);
  });
});

