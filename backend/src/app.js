const hotelRoutes = require("./routes/hotel.route");
const bookingRoutes = require("./routes/booking.route");
const roomRoutes = require("./routes/room.route");
const uploadRoutes = require("./routes/upload.route");
const express = require("express");
const path = require("path");

const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local development
      "https://booking-hotel1-9snz.vercel.app" // your deployed frontend
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/hotels/api", hotelRoutes);
app.use("/rooms/api", roomRoutes);
app.use("/booking/api", bookingRoutes);
app.use("/upload/api", uploadRoutes);

module.exports = app;
