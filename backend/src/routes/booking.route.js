const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");
const hotelModel = require("../models/hotelModel");
const express = require("express");
const router = express.Router();
const { requireClerkAuth } = require("../middleware/requireAuth");

const ADMIN_EMAIL = "yashprajapati.9769@gmail.com";

const isAdminUser = (auth) => {
  if (!auth) return false;
  const email =
    auth.sessionClaims?.email ||
    auth.sessionClaims?.["email_address"] ||
    "";
  const role = auth.sessionClaims?.publicMetadata?.role;
  return role === "admin" || email === ADMIN_EMAIL;
};

// GET all bookings — admin only
router.get("/", requireClerkAuth, async (req, res) => {
  try {
    if (!isAdminUser(req.auth)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const bookings = await bookingModel
      .find()
      .populate("hotel")
      .populate("room")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET bookings for hotels owned by a specific owner
router.get("/owner/:ownerId", requireClerkAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!isAdminUser(req.auth) && userId !== req.params.ownerId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find all hotels owned by this owner
    const ownerHotels = await hotelModel.find({ ownerId: req.params.ownerId }).select("_id");
    const hotelIds = ownerHotels.map((h) => h._id);

    const bookings = await bookingModel
      .find({ hotel: { $in: hotelIds } })
      .populate("hotel")
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET bookings for a specific end user (guest)
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ userId: req.params.userId })
      .populate("hotel")
      .populate("room")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("hotel")
      .populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a booking — decrements availableRooms on the room (protected)
router.post("/", requireClerkAuth, async (req, res) => {
  try {
    const { room: roomId } = req.body;

    // Check the room exists and has availability
    const room = await roomModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.availableRooms <= 0) {
      return res
        .status(400)
        .json({ message: "No rooms available for this listing" });
    }

    // Create the booking
    const booking = await bookingModel.create(req.body);

    // Decrement available count; mark unavailable if it hits 0
    const newAvailable = room.availableRooms - 1;
    await roomModel.findByIdAndUpdate(roomId, {
      availableRooms: newAvailable,
      isAvailable: newAvailable > 0,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status — restores availability if cancelled (protected)
router.patch("/:id/status", requireClerkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await bookingModel.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const prevStatus = booking.status;
    booking.status = status;
    await booking.save();

    // If cancelling a confirmed/pending booking, restore availability
    if (status === "cancelled" && prevStatus !== "cancelled" && booking.room) {
      const room = await roomModel.findById(booking.room._id);
      if (room) {
        const newAvailable = Math.min(room.availableRooms + 1, room.totalRooms);
        await roomModel.findByIdAndUpdate(room._id, {
          availableRooms: newAvailable,
          isAvailable: true,
        });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
