const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    contact: { type: String, required: true },
    ownerId: { type: String, required: false, default: "admin" },
    ownerEmail: { type: String, required: false, default: "" },
    images: [{ type: String }],
    // Registration workflow: pending → approved / rejected
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // seeded/admin hotels start approved
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const hotelModel = mongoose.model("Hotel", hotelSchema);
module.exports = hotelModel;
