const hotelModel = require("../models/hotelModel");
const express = require("express");
const router = express.Router();
const {
  requireClerkAuth,
  isAdminUser,
  getRequestAuth,
  ADMIN_EMAIL,
} = require("../middleware/requireAuth");

// ── Public Routes ──────────────────────────────────────────────────────────────

// GET all APPROVED hotels (public browsing)
router.get("/", async (req, res) => {
  try {
    const hotels = await hotelModel.find({
      $or: [{ status: "approved" }, { status: { $exists: false } }],
    });
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET all hotels for admin (all statuses) — used by owner dashboard
router.get("/admin/all", requireClerkAuth, async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const hotels = await hotelModel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET hotels for a specific owner (to check permission and load owner dashboard)
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const hotels = await hotelModel
      .find({ ownerId: req.params.ownerId })
      .sort({ createdAt: -1 });
    res.json(hotels);
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

// ── Protected Routes ──────────────────────────────────────────────────────────

// POST: Register a hotel — requires login; starts as "pending" for approval
router.post("/", requireClerkAuth, async (req, res) => {
  try {
    const auth = getRequestAuth(req);
    const userId = auth?.userId || req.body?.ownerId;
    if (!userId) {
      return res.status(401).json({ message: "Please log in to register a hotel." });
    }

    // Admin-submitted hotels get approved immediately; partner registrations start pending
    const adminSubmit = isAdminUser(req);

    const hotel = await hotelModel.create({
      ...req.body,
      ownerId: userId,
      status: adminSubmit ? "approved" : "pending",
    });
    res.status(201).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH: Approve or reject a hotel (admin only)
router.patch("/:id/status", requireClerkAuth, async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const hotel = await hotelModel.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: rejectionReason || "" },
      { new: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireClerkAuth, async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Only admin or the hotel's owner can delete
    const auth = getRequestAuth(req);
    const userId = auth?.userId;
    if (!isAdminUser(req) && hotel.ownerId !== userId) {
      return res.status(403).json({ message: "Not authorised to delete this hotel." });
    }

    await hotelModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hotel deleted successfully" });
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
