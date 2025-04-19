const express = require('express');
const router = express.Router();
const genCourse = require('../models/gencourse'); // Adjust the path as necessary

// Create a new course
router.post('/add', async (req, res) => {
  const { userId, courseTitle, units } = req.body;

  try {
    const course = new genCourse({
      userId,
      courseTitle,
      units,
    });

    const savedCourse = await course.save();
    res.status(201).json({ success: true, course: savedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save course', error: error.message });
  }
});

// Get courses by userId
router.get('/all/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const courses = await genCourse.find({ userId });
      res.status(200).json({ success: true, courses });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
    }
  });

module.exports = router;