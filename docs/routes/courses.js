'use strict';
// Load modules
const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course,  User } = require('../models');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of Courses.
router.get('/courses', asyncHandler(async (req, res) => {

  const courses = await Course.findAll({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });

  res.json(courses);
}));

// Route that will return the corresponding course.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  
  const course = await Course.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  
  if (course) {

    // Filtering createAt and  updatedAt columns.
    res.json(course)

  } else {
    const err = new Error();
    err.status = 404;
    next(err);
  };

}));

// Route that create a new Course.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.location(`/courses/${course.id}`).status(201).json();
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

  // Store errors
  const errors = [];

  try {
    course = await Course.findByPk(req.params.id);

    // Ensure that the currently authenticated user is the owner of the requested course.
    if (req.currentUser.id === course.userId) {
      if (!req.body.title) {
        errors.push('A title is required');
      };
  
      if (!req.body.description) {
        errors.push('A description is required');
      };
  
      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        await course.update(req.body);
        res.status(204).json();
      };
    } else {
      res.status(403).json({ message: 'Authenticated user is not the owner of the requested course'});
    };

  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
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

      // Ensure that the currently authenticated user is the owner of the requested course.
      if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).json();
      } else {
        res.status(403).json({ message: "Authenticated user is not the owner of the requested course"});
      };

    } else {
      const err = new Error();
      err.message = 'This course is not available';
      err.status = 404;
      next(err);
    };
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    };
  };

}));

module.exports = router;