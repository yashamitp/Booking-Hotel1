const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("DB Connection Failed:", error);
    process.exit(1);
  }
}

module.exports = connectDb;
