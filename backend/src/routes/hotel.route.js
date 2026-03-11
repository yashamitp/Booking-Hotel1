const hotelModel = require("../models/hotelModel");
const express = require("express");
const router = express.Router();
const { requireClerkAuth } = require("../middleware/requireAuth");

// ── Public Routes (no auth needed — guests can browse) ──────────────────────

router.get("/", async (req, res) => {
  try {
    const hotel = await hotelModel.find();
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// ── Protected Routes (owner/admin must be logged in) ─────────────────────────

router.post("/", requireClerkAuth, async (req, res) => {
  try {
    const hotel = await hotelModel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireClerkAuth, async (req, res) => {
  try {
    const hotelId = await hotelModel.findById(req.params.id);
    if (hotelId) {
      await hotelModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "hotel deleted successfully" });
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", requireClerkAuth, async (req, res) => {
  try {
    const hotel = await hotelModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
