'use strict';

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');

class Jobs {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { id, title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ id, title, salary, equity, company_handle }) {
    const duplicateCheck = await db.query(
      `SELECT id
           FROM jobs
           WHERE id = $1`,
      [id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${id}`);

    const result = await db.query(
      `INSERT INTO jobs
           (id, title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, salary, equity, company_handle`,
      [id, title, salary, equity, company_handle]
    );
    const job = result.rows[0];

    return job;
  }

  // Find all jobs.
  static async findAll(searchFilters = {}) {
    let query = `SELECT
            id,
             title,
             salary,
             equity,
             company_handle
      FROM jobs`;

    let whereExpressions = [];
    let queryValues = [];

    const { title, minSalary, hasEquity } = searchFilters;
    if (title) {
      whereExpressions.push('title ILIKE $1');
      queryValues.push(`%${title}%`);
    }
    if (minSalary) {
      whereExpressions.push('salary >= $1');
      queryValues.push(minSalary);
    }
    if (hasEquity) {
      whereExpressions.push('equity > 0');
    }
    if (whereExpressions.length > 0) {
      query += ' WHERE ' + whereExpressions.join(' AND ');
    }
    query += ' ORDER BY title';
    const jobs = await db.query(query, queryValues);
    return jobs.rows;
  }

  // Find job by id.
  static async findById(id) {
    const jobRes = await db.query(
      `SELECT
            id,
              title,
              salary,
              equity,
              company_handle
      FROM jobs
      WHERE id = $1`,
      [id]
    );
    if (jobRes.rows[0]) return jobRes.rows[0];
    throw new NotFoundError(`Job not found: ${id}`);
  }

  static async findByCompany(company_handle) {
    const jobRes = await db.query(
      `SELECT
            id,
              title,
              salary,
              equity,
              company_handle
      FROM jobs
      WHERE company_handle = $1`,
      [company_handle]
    );
    let allCompanyJobs = [];

    for (let i = 0; i < jobRes.rows.length; i++) {
      allCompanyJobs.push(jobRes.rows[i]);
    }
    return allCompanyJobs;
  }

  static async findById(id) {
    const jobRes = await db.query(
      `SELECT
            id,
              title,
              salary,
              equity,
              company_handle FROM jobs
      WHERE id = $1`,
      [id]
    );
    if (jobRes.rows[0]) return jobRes.rows[0];
    throw new NotFoundError(`Job not found: ${id}`);
  }

  // static async findAll({ minSalary, hasEquity, title } = {}) {
  //   let query = `SELECT j.id,
  //                       j.title,
  //                       j.salary,
  //                       j.equity,
  //                       j.company_handle AS "companyHandle",
  //                       c.name AS "companyName"
  //                FROM jobs j
  //                  LEFT JOIN companies AS c ON c.handle = j.company_handle`;
  //   let whereExpressions = [];
  //   let queryValues = [];

  //   // For each possible search term, add to whereExpressions and
  //   // queryValues so we can generate the right SQL

  //   if (minSalary !== undefined) {
  //     queryValues.push(minSalary);
  //     whereExpressions.push(`salary >= $${queryValues.length}`);
  //   }

  //   if (hasEquity === true) {
  //     whereExpressions.push(`equity > 0`);
  //   }

  //   if (title !== undefined) {
  //     queryValues.push(`%${title}%`);
  //     whereExpressions.push(`title ILIKE $${queryValues.length}`);
  //   }

  //   if (whereExpressions.length > 0) {
  //     query += ' WHERE ' + whereExpressions.join(' AND ');
  //   }

  //   // Finalize query and return results

  //   query += ' ORDER BY title';
  //   const jobsRes = await db.query(query, queryValues);
  //   return jobsRes.rows;
  // }

  // static async get(id) {
  //   const jobRes = await db.query(
  //     `SELECT id,
  //              title,
  //              salary,
  //              equity,
  //              company_handle
  //       FROM jobs
  //       WHERE id = $1`,
  //     [id]
  //   );
  //   return jobRes.rows[0];
  // }

  static async add() {
    const result = await db.query(
      `INSERT INTO jobs
            (id, title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, salary, equity, company_handle`,
      [id, title, salary, equity, company_handle]
    );
    return result.rows[0];
  }

  static async update(id, { title, salary, equity, company_handle }) {
    const result = await db.query(
      `UPDATE jobs
           SET title = $1,
               salary = $2,
               equity = $3,
               company_handle = $4
           WHERE id = $5
           RETURNING id, title, salary, equity, company_handle`,
      [title, salary, equity, company_handle, id]
    );
    const job = result.rows[0];

    return job;
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM jobs
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Jobs;
