const hotelRoutes = require("./routes/hotel.route");
const bookingRoutes = require("./routes/booking.route");
const roomRoutes = require("./routes/room.route");
const uploadRoutes = require("./routes/upload.route");
const express = require("express");
const path = require("path");
const { clerkMiddleware } = require("@clerk/express");

const cors = require("cors");
const app = express();

const arr = [1, 2, 2, 2, 3, 41, 4, 5, 6, 7, 8, 9, 10];
function removeDuplicates(arr) {
  const uniqueSet = new Set(arr);
  // let strin=un
  return Array.from(uniqueSet);
}
const uniqueNums = removeDuplicates(arr);

// Clerk SDK global middleware — parses & verifies the Authorization header
// on every request so req.auth is available downstream.
app.use(clerkMiddleware());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local development
      "https://bookhotels-git-main-yashamitps-projects.vercel.app/", // your deployed frontend
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/hotels/api", hotelRoutes);
app.use("/rooms/api", roomRoutes);
app.use("/booking/api", bookingRoutes);
app.use("/upload/api", uploadRoutes);

module.exports = app;
