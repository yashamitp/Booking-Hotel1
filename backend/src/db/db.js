const mongoose = require("mongoose");

async function connectDb() {
  if (!process.env.MONGO_URI) {
    console.error("DB Connection Failed: MONGO_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("DB Connection Failed:", error?.message || error);
    console.error("Please verify that your MONGO_URI in .env (and on Render) is valid and the MongoDB Atlas cluster is active and reachable.");
  }
}

module.exports = connectDb;

