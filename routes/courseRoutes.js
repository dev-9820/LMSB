const express = require("express");
const {
  createCourse,
  addQuizToCourse,
  addQuestionToQuiz,
  getCourseDetails,
  deleteQuestion,
  deleteQuiz,
  deleteCourse,
  allCourses,
  getSingleQuiz,
} = require("../controllers/courseController");

const router = express.Router();

// Routes for Course
router.post("/createCourse", createCourse); // Create a course
router.post("/singleCourse", getCourseDetails); // Get course details (with quizzes and questions)
router.post("/delete", deleteCourse); // Delete a course
router.get("/allCourses", allCourses); // Delete a course

// Routes for Quiz
router.post("/createQuiz", addQuizToCourse); // Add a quiz to a course
router.post("/singleQuiz", getSingleQuiz); // Add a quiz to a course
router.post("/deleteQuiz", deleteQuiz); // Delete a quiz

// Routes for Question
router.post("/addQuestion", addQuestionToQuiz); // Add a question to a quiz
router.post("/deleteQuestion", deleteQuestion); // Delete a question

module.exports = router;
