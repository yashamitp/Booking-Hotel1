const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  totalRooms: { type: Number, default: 1, min: 1 },      
  availableRooms: { type: Number, default: 1, min: 0 },  
}, { timestamps: true });

const roomModel = mongoose.model("Room", roomSchema);
module.exports = roomModel;
