// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');

describe('GET /v1/fragments/:id/info', () => {
  // Using a valid username/password pair with wrong id
  test('authenticated users get a fragments array', async () => {
    var id = 1;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(404);
  });

  // Using a valid username/password pair with correct fragment id
  test('authenticated users get a fragments array', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragments.id;
    var correct = JSON.parse(postRes.text).fragments;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(200);
    //console.log(JSON.parse(getRes.text).fragments);
    var result = JSON.parse(getRes.text).fragments;
    expect(result).toStrictEqual(correct);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
