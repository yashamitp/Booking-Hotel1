const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  ownerId: { type: String, required: false, default: "admin" },
  images: [{ type: String }],
}, { timestamps: true });

const hotelModel = mongoose.model("Hotel", hotelSchema);
module.exports = hotelModel;
