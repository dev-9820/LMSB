const Result = require('../models/results')

// Controller to save quiz result
const saveResult = async (req, res) => {
    const { title, score, timeTaken, userId } = req.body;
  
  
    try {
      // Create a new result
      const newResult = new Result({
        title,
        score,
        timeTaken,
        userId,
      });
  
      // Save the result in the database
      await newResult.save();
      res.status(201).json({ message: "Result saved successfully.", result: newResult });
    } catch (error) {
      res.status(500).json({ message: "Failed to save result.", error: error.message });
    }
  };

  // Controller to get results for a specific user
const getUserResults = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find results for the given userId
    const userResults = await Result.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(userResults);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user results.", error: error.message });
  }
};
  
  module.exports = { saveResult, getUserResults };