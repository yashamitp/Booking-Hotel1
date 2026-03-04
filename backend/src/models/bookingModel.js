const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" }
}, { timestamps: true });

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;
