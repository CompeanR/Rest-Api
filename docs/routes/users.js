'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll()


  res.json(users);
}));

router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" })
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error
    }
  }

}))

module.exports = router;