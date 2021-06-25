'use strict';
// Load modules
const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user')
const { Course } = require('../models');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of Courses.
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();

  res.json(courses);
}));

// Route that will return the corresponding course.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  
  const course = await Course.findByPk(req.params.id);
  
  if (course) {
    res.json(course);
  } else {
    const err = new Error();
    err.status = 404;
    next(err);
  };

}));

// Route that create a new Course.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201).json({ "message": "Course successfully created!" })
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    };
  };

}));

// Route that update a new Course.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  let course;
  try {
    course = await Course.findByPk(req.params.id);

    if (!req.body.title) {
      res.status(400).json({ error: 'A title is required' });
    } 
    
    else if (!req.body.description) {
      res.status(400).json({ error: 'A description is required' })
    }
    
    else {
      await course.update(req.body);
      res.status(204).json()
    };

  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }) ;
    } else {
      throw error;
    };
  };

})); 

// Delete the corresponding course.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204).json();
    } else {
      const err = new Error();
      err.message = 'This course is not available';
      err.status = 404;
      next(err);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors }) ;
    } else {
      throw error;
    };
  };

}));

module.exports = router;