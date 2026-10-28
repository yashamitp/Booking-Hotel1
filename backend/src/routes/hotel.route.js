const hotelModel = require("../models/hotelModel");
const express = require("express");
const router = express.Router();
const { requireClerkAuth } = require("../middleware/requireAuth");

const ADMIN_EMAIL = "yashprajapati.9769@gmail.com";

// Helper: check if the auth'd user is the platform admin
const isAdminUser = (auth) => {
  if (!auth) return false;
  // Clerk stores email claims in different places depending on version
  const email =
    auth.sessionClaims?.email ||
    auth.sessionClaims?.["email_address"] ||
    auth.sessionClaims?.primary_email_address_id ||
    "";
  const role = auth.sessionClaims?.publicMetadata?.role;
  return role === "admin" || email === ADMIN_EMAIL;
};

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
    if (!isAdminUser(req.auth)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    const hotels = await hotelModel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET hotels for a specific owner
router.get("/owner/:ownerId", requireClerkAuth, async (req, res) => {
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
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Please log in to register a hotel." });
    }

    // Admin-submitted hotels get approved immediately
    const adminSubmit = isAdminUser(req.auth);

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
    if (!isAdminUser(req.auth)) {
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
    const userId = req.auth?.userId;
    if (!isAdminUser(req.auth) && hotel.ownerId !== userId) {
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
