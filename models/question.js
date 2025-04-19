const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  option: [
    {
      type: String,
    },
  ],
  correctAns: {
    type: String,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
