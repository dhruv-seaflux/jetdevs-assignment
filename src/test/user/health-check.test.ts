import request from 'supertest';
import App from "../../server";

let expect: any;

App.init();
before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

describe('Test suite #1', () => {
  it('should return hello world!', async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    const res = await request(App.getApp()).post('/comments').send({ articleId: 1, nickname: "test nickname", parentCommentId: null, comment: "test comment" });

    expect(res.status).to.equal(201);
    expect(res.body.data.success).to.equal(true);
  });
});
