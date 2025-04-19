const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
