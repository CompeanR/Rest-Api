'use strict';
// Load modules
const express = require('express');
const { authenticateUser } = require('../middleware/auth-user')
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  // Filtering createAt and  updatedAt columns.
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    userId: user.id
  });
  
}));

// Route that create a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/').status(201).json()
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