// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');

describe('PUT /v1/fragments/:id', () => {
  // Using a valid username/password pair with correct fragment id
  test('authenticated users update a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('UPD:This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data2);
    expect(putRes.statusCode).toBe(200);
    //expect(deleteRes.text).toBe(data.toString());
  });

  test('unauthenticated users updates a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('UPD: This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Content-Type', 'text/plain')
      .send(data2);
    expect(putRes.statusCode).toBe(401);
    //expect(deleteRes.text).toBe(data.toString());
  });
  test('authenticated users updates an nonexisting fragment', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = 1;
    const data2 = Buffer.from('UPD: This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Content-Type', 'text/plain')
      .auth('user3@email.com', 'password3')
      .send(data2);
    expect(putRes.statusCode).toBe(404);
    //expect(deleteRes.text).toBe(data.toString());
  });
  // Using a valid username/password pair with correct fragment id but incorrect type
  test('authenticated users update a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('# UPD:This is fragment');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user3@email.com', 'password3')
      .set('Content-Type', 'text/markdown')
      .send(data2);
    expect(putRes.statusCode).toBe(400);
    //expect(deleteRes.text).toBe(data.toString());
  });
});
