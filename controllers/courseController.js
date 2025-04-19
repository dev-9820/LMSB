const Course = require("../models/courses");
const Quiz = require("../models/quiz");
const Question = require("../models/question");

// Create a Course
const createCourse = async (req, res) => {
  try {
    const { courseName, description, image,modules } = req.body;

    const newCourse = new Course({
      courseName,
      description,
      image,
      modules
    });
    await newCourse.save();

    return res.status(201).send({
      message: "Course created successfully",
      success: true,
      course: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Add a Quiz to a Course
const addQuizToCourse = async (req, res) => {
  try {
    const { courseId, quizName } = req.body;

    const newQuiz = new Quiz({ quizName });
    await newQuiz.save();

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { quizes: newQuiz._id } },
      { new: true }
    ).populate("quizes");

    if (!course) {
      return res.status(404).send({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Quiz added to course successfully",
      success: true,
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Add Questions to a Quiz
const addQuestionToQuiz = async (req, res) => {
  try {
    const { quizId, question, option, correctAns } = req.body;

    const newQuestion = new Question({ question, option, correctAns });
    await newQuestion.save();

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: newQuestion._id } },
      { new: true }
    ).populate("questions");

    if (!quiz) {
      return res.status(404).send({
        message: "Quiz not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Question added to quiz successfully",
      success: true,
      quiz,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: "quizes",
        populate: {
          path: "questions",
        },
      });
    return res.status(200).send({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get Course with Quizzes and Questions
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId).populate({
      path: "quizes",
      populate: {
        path: "questions",
      },
    });

    if (!course) {
      return res.status(404).send({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Course details fetched successfully",
      success: true,
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete a Question
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;

    const question = await Question.findByIdAndDelete(questionId);

    if (!question) {
      return res.status(404).send({
        message: "Question not found",
        success: false,
      });
    }

    // Remove the question from quizzes
    await Quiz.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    return res.status(200).send({
      message: "Question deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete a Quiz
const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      return res.status(404).send({
        message: "Quiz not found",
        success: false,
      });
    }

    // Remove the quiz from courses
    await Course.updateMany({ quizes: quizId }, { $pull: { quizes: quizId } });

    return res.status(200).send({
      message: "Quiz deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete a Course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).send({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

const getSingleQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const quiz = await Quiz.findById(quizId).populate("questions");
    return res.status(200).send({ quiz });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  createCourse,
  addQuizToCourse,
  addQuestionToQuiz,
  getCourseDetails,
  deleteQuestion,
  deleteQuiz,
  deleteCourse,
  allCourses,
  getSingleQuiz,
};
