'use strict';

const request = require('supertest');

const app = require('../app');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  adminToken,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('testing job routes', function () {
  test('GET /jobs', async function () {
    const resp = await request(app)
      .get('/jobs')
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(testJobIds);
  });
  test('GET /jobs/:id', async function () {
    const resp = await request(app)
      .get('/jobs/1')
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: 1,
      title: 'Software Engineer',
      salary: 50000,
      equity: 0.1,
    });
  });
  test('POST /jobs', async function () {
    const newJob = {
      title: 'New',
      salary: 50000,
      equity: 0.1,
    };
    const resp = await request(app)
      .post('/jobs')
      .send(newJob)
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: newJob,
    });
  });
  test('GET job by handle', async function () {
    const resp = await request(app)
      .get('/jobs/new')
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: 2,
      title: 'New',
      salary: 50000,
      equity: 0.1,
    });
  });
  test('PATCH /jobs/:id', async function () {
    const resp = await request(app)
      .patch('/jobs/1')
      .send({
        title: 'New',
        salary: 50000,
        equity: 0.1,
      })
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: 1,
      title: 'New',
      salary: 50000,
      equity: 0.1,
    });
  });
  test('DELETE /jobs/:id', async function () {
    const resp = await request(app)
      .delete('/jobs/1')
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(204);
  });
});

describe('testing job applications routes', function () {
  test('GET /jobs/:id/applications', async function () {
    const resp = await request(app)
      .get('/jobs/1/applications')
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([
      {
        id: 1,
        jobId: 1,
        userId: 1,
        status: 'applied',
      },
    ]);
  });
});
