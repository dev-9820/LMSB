const User = require("../models/userModel");
const Course = require("../models/courses")
// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password }); // NOTE: Hash password in a real-world app
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      // NOTE: Use hashed password comparison in real-world apps
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id).populate({
      path: "enrolledCourses.course",
      populate: {
        path: "quizes", // This assumes that 'quizes' is a field in your course schema.
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const user = await User.find().populate("enrolledCourses.course");
    return res.status(200).send({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    console.log(req.body);
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already enrolled in the course
    const isAlreadyEnrolled = user.enrolledCourses.some(
      (course) => course.course.toString() === courseId
    );
    if (isAlreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    // Add course to enrolled courses
    user.enrolledCourses.push({
      course: courseId, // Reference to the course ID
    });

    // Save the updated user
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "User enrolled successfully" });
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update user progress for a course
const updateProgress = async (req, res) => {
  try {
    const { userId, courseId, completedModules, currentModule, timeSpent } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate completion percentage if modules data is provided
    let completedPercentage = 0;
    if (completedModules) {
      const course = await Course.findById(courseId);
      if (course && course.modules) {
        completedPercentage = Math.round((completedModules.length / course.modules.length) * 100);
      }
    }

    const updateData = {
      completed: completedPercentage,
      completedModules,
      currentModule,
      timeSpent
    };

    const updatedProgress = await user.updateCourseProgress(courseId, updateData);

    res.status(200).json({
      message: "Progress updated successfully",
      progress: {
        completed: updatedProgress.completed,
        completedModules: updatedProgress.completedModules,
        currentModule: updatedProgress.currentModule,
        timeSpent: updatedProgress.timeSpent
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the course from the enrolledCourses array
    const updatedCourses = user.enrolledCourses.filter(
      (course) => course.course.toString() !== courseId
    );

    if (updatedCourses.length === user.enrolledCourses.length) {
      return res
        .status(404)
        .json({ message: "User is not enrolled in the specified course" });
    }

    // Update the user's enrolledCourses
    user.enrolledCourses = updatedCourses;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Enrollment removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId).select('enrolledCourses');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courseProgress = user.enrolledCourses.find(
      course => course.course.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(404).json({ message: "Course not found in user's enrolled courses" });
    }

    res.status(200).json({
      completed: courseProgress.completed,
      completedModules: courseProgress.completedModules || [],
      currentModule: courseProgress.currentModule || 0,
      timeSpent: courseProgress.timeSpent || 0,
      lastAccessed: courseProgress.lastAccessed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getSingleUser,
  getAllUser,
  removeEnrollment,
  enrollUser,
  updateProgress,
  getProgress
};
