const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure that every result has a quiz title
  },
  score: {
    type: Number,
    required: true, // Ensure that every result has a score
    min: 0,         // Scores cannot be negative
  },
  timeTaken: {
    type: Number,    // Storing time in seconds (or another consistent unit)
    required: true,  // Ensure timeTaken is always recorded
    min: 0,          // Time taken cannot be negative
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Link results to a specific user
    ref: "User",                          // Assuming you have a User model
    required: true,
  },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps automatically

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
