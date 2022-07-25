'use strict';

/** Routes for companies. */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureAdmin } = require('../middleware/auth');
const { sqlForPartialUpdate } = require('../helpers/sql');

const Job = require('../models/jobs');

const newJobSchema = require('../schemas/jobNew.json');
const updateJobSchema = require('../schemas/jobUpdate.json');
const searchJobSchema = require('../schemas/jobSearch.json');
const { query } = require('express');

const router = new express.Router();

router.get('/', async function (req, res, next) {
  const q = req.query;
  if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
  try {
    const jobs = await Job.findAll(q);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get('/:handle', async function (req, res, next) {
  try {
    const job = await Job.findByCompany(req.params.handle);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.post('/', ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newJobSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, updateJobSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const job = await Job.update(req.params.id, req.body);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', ensureAdmin, async function (req, res, next) {
  try {
    const job = await Job.delete(req.params.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
