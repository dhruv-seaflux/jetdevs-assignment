import request from 'supertest';
import app from "../../server";

let expect: any; // Declare `expect` outside of the describe

before(async () => {
  const chai = await import('chai'); // Use dynamic import here
  expect = chai.expect; // Assign `expect` from `chai`
});

describe('Test suite #1', () => {
  it('should return hello world!', async () => {
    const res = await request(app).get('/hc');

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("OK");
  });
});
