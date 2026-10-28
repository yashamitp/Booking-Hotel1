import React from "react";
import NavBar from "./components/NavBar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBooking from "./pages/MyBooking";
import Wishlist from "./pages/Wishlist";
import HotelReg from "./components/HotelReg";
import CompareBar from "./components/CompareBar";
import CompareModal from "./components/CompareModal";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import AddHotel from "./pages/hotelOwner/AddHotel";
import ListHotel from "./pages/hotelOwner/ListHotel";
import { AppProvider } from "./context/AppContext";

function AppContent() {
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Show Navbar only on user side */}
      {!isOwnerPath && <NavBar />}

      <main className="flex-1">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Owner Routes (Nested Routing) */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-hotel" element={<AddHotel />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="list-hotel" element={<ListHotel />} />
          </Route>
        </Routes>
      </main>

      {/* Global Modals & Bars */}
      {!isOwnerPath && (
        <>
          <HotelReg />
          <CompareBar />
          <CompareModal />
        </>
      )}

      {/* Hide Footer on Owner Panel */}
      {!isOwnerPath && (
        <div className="mt-24">
          <Footer />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
