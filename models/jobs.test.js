'use strict';

const { NotFoundError, BadRequestError } = require('../expressError');
const db = require('../db.js');
const Job = require('./job.js');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** findAll */
describe('findAll', function () {
  test('works', async function () {
    const jobs = await Job.findAll();
    expect(jobs).toEqual(testJobIds);
  });
  test('works with filters', async function () {
    const jobs = await Job.findAll({
      where: {
        title: 'Software Engineer',
      },
    });
    expect(jobs).toEqual([1]);
  });
  test('works with order', async function () {
    const jobs = await Job.findAll({
      order: 'title DESC',
    });
    expect(jobs).toEqual([3, 2, 1]);
  });
  test('works with limit', async function () {
    const jobs = await Job.findAll({
      limit: 2,
    });
    expect(jobs).toEqual([3, 2]);
  });
  test('find by id method', async function () {
    const job = await Job.findById(1);
    expect(job).toEqual({
      id: 1,
      title: 'Software Engineer',
      salary: 50000,
      equity: 0.1,
    });
    test('find by Company method', async function () {
      const job = await Job.findByCompany(1);
      expect(job).toEqual([
        {
          id: 1,
          title: 'Software Engineer',
          salary: 50000,
          equity: 0.1,
        },
      ]);
    });
  });
  test('add a job', async function () {
    const job = await Job.create({
      title: 'Software Engineer',
      salary: 50000,
      equity: 0.1,
    });
    expect(job).toEqual({
      id: 4,
      title: 'Software Engineer',
      salary: 50000,
      equity: 0.1,
    });
  });
});
