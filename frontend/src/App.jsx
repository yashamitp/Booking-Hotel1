import React from "react";
import NavBar from "./components/NavBar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBooking from "./pages/MyBooking";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import AddHotel from "./pages/hotelOwner/AddHotel";
import ListHotel from "./pages/hotelOwner/ListHotel";
import { AppProvider } from "./context/AppContext";

function App() {
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <AppProvider>
    <div>
      {/* Show Navbar only on user side */}
      {!isOwnerPath && <NavBar />}

      {/* Temporary condition (remove if not needed) */}
      {false && <HotelReg />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBooking />} />

          {/* Owner Routes (Nested Routing) */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-hotel" element={<AddHotel />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="list-hotel" element={<ListHotel />} />
          </Route>
        </Routes>
      </div>

      {/* Hide Footer on Owner Panel */}
      {!isOwnerPath && (
        <div className="mt-40">
          <Footer />
        </div>
      )}
    </div>
    </AppProvider>
  );
}

export default App;