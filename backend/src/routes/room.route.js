const roomModel = require("../models/roomModel");
const express = require("express");
const router = express.Router();
const { requireClerkAuth } = require("../middleware/requireAuth");

// ── Public Routes ─────────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const rooms = await roomModel.find().populate("hotel");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await roomModel.findById(req.params.id).populate("hotel");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Protected Routes ──────────────────────────────────────────────────────────

router.post("/", requireClerkAuth, async (req, res) => {
  try {
    const room = await roomModel.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireClerkAuth, async (req, res) => {
  try {
    const room = await roomModel.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", requireClerkAuth, async (req, res) => {
  try {
    const room = await roomModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
