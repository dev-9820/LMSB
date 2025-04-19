const mongoose = require('mongoose');

// Define the schema
const gencourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  units: [
    {
      unitTitle: {
        type: String,
        required: true,
      },
      youtube_video_url: {
        type: String,
        required: false,
      },
      detailedContent: {
        topicContents: [
          {
            topic: {
              type: String,
              required: true,
            },
            content: {
              type: String,
              required: true,
            },
            examples: [String], // Array of strings
            exercises: [String], // Array of strings
          },
        ],
      },
    },
  ],
});

// Create the model
const genCourse = mongoose.model('genCourse', gencourseSchema);

module.exports = genCourse;