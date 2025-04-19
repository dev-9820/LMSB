const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://username:username@cluster22.y1gvx.mongodb.net/learning"
    );
    console.log("Connected to database!!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
