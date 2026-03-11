const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");
const express = require("express");
const router = express.Router();
const { requireClerkAuth } = require("../middleware/requireAuth");

// GET all bookings — admin only (protected)
router.get("/", requireClerkAuth, async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .populate("hotel")
      .populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ userId: req.params.userId })
      .populate("hotel")
      .populate("room");
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

// Create a booking — also decrements availableRooms on the room (protected)
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
