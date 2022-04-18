// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');

describe('GET /v1/fragments/:id', () => {
  // Using a valid username/password pair with wrong id
  test('authenticated users get a fragments array', async () => {
    var id = 1;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
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
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(data.toString());
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later

  // Using a valid username/password pair with incorrect fragment id
  test('authenticated users get a fragments array', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = 1;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(404);
    //expect(getRes.text).toBe(data.toString());
  });

  // Using a valid username/password pair with incorrect extension
  test('authenticated users get a fragments array', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(415);
    //expect(getRes.text).toBe(data.toString());
  });
  // Using a valid username/password pair with correct extension
  test('authenticated users get a fragments array', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/markdown')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user3@email.com', 'password3');
    expect(getRes.statusCode).toBe(200);
    //expect(getRes.text).toBe(data.toString());
  });
});
