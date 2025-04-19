const express = require("express");
const { saveResult,getUserResults } = require("../controllers/resultController"); // Adjust path to controller
const router = express.Router();

// Route to save a quiz result
router.post("/save", saveResult);
router.get("/user/:userId", getUserResults);
module.exports = router;
