// Import dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const resultRoutes = require("./routes/resultRoutes")
const domainRoutes = require("./routes/domainRoutes")
const gencourseRoutes = require("./routes/gencourseRoutes");
const connectDB = require("./config/db");

// Initialize the app
const app = express();

connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json());
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/results", resultRoutes);
app.use("/domains", domainRoutes);
app.use("/gencourse", gencourseRoutes);
// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
