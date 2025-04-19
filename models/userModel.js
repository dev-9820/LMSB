const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  grade:{type:String},
  gender:{type:String},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  enrolledCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      completed: {
        type: Number, // Changed from String to Number for percentage
        default: 0,
      },
      completedModules: [{  // Track which modules are completed
        type: Number,
      }],
      currentModule: {  // Track the current module index
        type: Number,
        default: 0,
      },
      lastAccessed: {  // Track when user last accessed the course
        type: Date,
        default: Date.now,
      },
      timeSpent: {  // Track total time spent on course (in minutes)
        type: Number,
        default: 0,
      }
    }
  ],
}, {
  timestamps: true,
});

// Add instance method to update progress
userSchema.methods.updateCourseProgress = async function(courseId, updateData) {
  const courseIndex = this.enrolledCourses.findIndex(
    course => course.course.toString() === courseId
  );
  
  if (courseIndex === -1) {
    throw new Error("User is not enrolled in this course");
  }

  // Update the fields that were provided
  if (updateData.completed !== undefined) {
    this.enrolledCourses[courseIndex].completed = updateData.completed;
  }
  if (updateData.completedModules !== undefined) {
    this.enrolledCourses[courseIndex].completedModules = updateData.completedModules;
  }
  if (updateData.currentModule !== undefined) {
    this.enrolledCourses[courseIndex].currentModule = updateData.currentModule;
  }
  if (updateData.timeSpent !== undefined) {
    this.enrolledCourses[courseIndex].timeSpent = updateData.timeSpent;
  }

  // Always update lastAccessed
  this.enrolledCourses[courseIndex].lastAccessed = Date.now();

  await this.save();
  return this.enrolledCourses[courseIndex];
};

module.exports = mongoose.model("User", userSchema);