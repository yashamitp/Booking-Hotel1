const hotelRoutes = require("./routes/hotel.route");
const bookingRoutes = require("./routes/booking.route");
const roomRoutes = require("./routes/room.route");
const uploadRoutes = require("./routes/upload.route");
const express = require("express");
const path = require("path");
const { clerkMiddleware } = require("@clerk/express");

const cors = require("cors");
const app = express();

// Clerk SDK global middleware — parses & verifies the Authorization header
// on every request so req.auth is available downstream.
// Ensure Clerk credentials exist for middleware execution
if (!process.env.CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = "pk_test_aW5ub2NlbnQta29hbGEtNzUuY2xlcmsuYWNjb3VudHMuZGV2JA==";
}
if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = "sk_test_22nGpyjXexWd9HWWDqvFIBbt8haBqzQdWO3i6dXuB2";
}

try {
  app.use(clerkMiddleware());
} catch (e) {
  console.warn("Clerk middleware init warning:", e.message);
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://booking-hotel1-self.vercel.app",
  "https://booking-hotel1-9snz.vercel.app",
  "https://bookhotels-git-main-yashamitps-projects.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ""));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id",
      "x-user-email",
      "X-User-Id",
      "X-User-Email",
      "Accept",
      "Origin",
    ],
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Root & Health check endpoints
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "QuickStay Hotel Booking API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/hotels/api", hotelRoutes);
app.use("/hotel/api", hotelRoutes);
app.use("/rooms/api", roomRoutes);
app.use("/booking/api", bookingRoutes);
app.use("/upload/api", uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
