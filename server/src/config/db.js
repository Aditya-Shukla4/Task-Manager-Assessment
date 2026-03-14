const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // got the URI from the env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // If DB fails no need to keep the server
    process.exit(1);
  }
};

module.exports = connectDB;
