const request = require('supertest');

const app = require('../../src/app');

describe('404 Habdler test', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/404');
    expect(res.statusCode).toBe(404);
  });
});
