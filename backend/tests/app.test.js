const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
  it('should return 200 OK from /health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint-12345');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
});
