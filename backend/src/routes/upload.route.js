const express = require("express");
const router = express.Router();
const multer = require("multer");
require("dotenv").config();
const { default: ImageKit, toFile } = require("@imagekit/nodejs");
const { requireClerkAuth } = require("../middleware/requireAuth");

// ── ImageKit client (v1 API: only privateKey in constructor) ─────────────────
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ── Multer: keep files in memory so we can forward the buffer to ImageKit ────
const upload = multer({ storage: multer.memoryStorage() });

// ── POST /upload/api ─────────────────────────────────────────────────────────
router.post(
  "/",
  requireClerkAuth,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No files uploaded" });
      }

      // Upload each file buffer to ImageKit in parallel
      // toFile() wraps a Buffer so the SDK can send it correctly
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `hotel_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
        const fileObj = await toFile(file.buffer, fileName, {
          type: file.mimetype,
        });

        return imagekit.files.upload({
          file: fileObj,
          fileName,
          folder: "/hotels",
          useUniqueFileName: true,
        });
      });

      const results = await Promise.all(uploadPromises);

      // Each result contains a `url` field with the permanent CDN URL
      const imageUrls = results.map((r) => r.url);

      res.status(200).json({ success: true, imageUrls });
    } catch (error) {
      console.error("ImageKit upload error:", error?.message || error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error?.message,
      });
    }
  },
);

module.exports = router;
