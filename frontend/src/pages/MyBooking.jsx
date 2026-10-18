import React, { useState, useEffect, useMemo } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axiosClient from "../api/axiosClient";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function MyBooking() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(`/booking/api/user/${user.id}`);
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchBookings();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking? This will restore room availability."
    );
    if (!confirmed) return;

    setCancellingId(bookingId);
    try {
      await axiosClient.patch(`/booking/api/${bookingId}/status`, {
        status: "cancelled",
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Unable to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter(
      (b) => (b.status || "pending").toLowerCase() === activeFilter
    );
  }, [bookings, activeFilter]);

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Confirmed
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Pending
      </span>
    );
  };

  return (
    <div className="py-28 md:py-32 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto min-h-[75vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <Title
          title="My Reservations"
          subTitle="View your upcoming getaways, view receipts, or manage your bookings."
          align="left"
        />

        {/* Status Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {["all", "confirmed", "pending", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                  activeFilter === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading your reservations...</p>
        </div>
      ) : !user ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed rounded-3xl p-8 mt-8">
          <p className="text-lg font-bold text-gray-800">Please sign in to view your bookings</p>
          <p className="text-gray-500 text-sm mt-1">
            Sign in with your account to access all your travel reservations.
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/70 border border-dashed border-gray-200 rounded-3xl p-8 mt-8">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-800">No bookings found</p>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            You don't have any {activeFilter !== "all" ? activeFilter : ""} reservations yet.
          </p>
          <button
            onClick={() => {
              navigate("/rooms");
              scrollTo(0, 0);
            }}
            className="px-6 py-2.5 bg-gray-950 hover:bg-blue-600 text-white font-medium text-xs rounded-full transition shadow cursor-pointer"
          >
            Browse Luxury Stays
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredBookings.map((booking) => {
            const firstImg =
              booking.room?.images?.[0] ||
              booking.hotel?.images?.[0] ||
              assets.roomImg1;
            const isCancelled = booking.status === "cancelled";

            return (
              <div
                key={booking._id}
                className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition gap-6"
              >
                {/* Hotel & Room Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={firstImg}
                    alt=""
                    className="w-24 h-24 md:w-32 md:h-28 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-gray-400 block uppercase">
                      Ref: #{booking._id?.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="font-playfair font-bold text-lg text-gray-900 truncate">
                      {booking.hotel?.name || "Luxury Stay"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {booking.room?.roomType || "Standard Room"} · {booking.guests} Guest(s)
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <img src={assets.locationIcon} alt="" className="w-3 h-3 opacity-70 shrink-0" />
                      <span className="truncate">{booking.hotel?.address}</span>
                    </p>
                  </div>
                </div>

                {/* Dates & Price */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-xs shrink-0 md:px-6 md:border-x border-gray-100">
                  <div>
                    <span className="text-gray-400 block font-medium">Check-in</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Check-out</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block font-medium">Total Paid</span>
                    <span className="font-bold text-base text-gray-900">
                      ₹{Number(booking.totalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                  {getStatusBadge(booking.status)}

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedReceipt(booking)}
                      className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Receipt
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Receipt Modal ── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg p-2"
            >
              ✕
            </button>

            <div className="text-center pb-4 border-b border-gray-100">
              <span className="text-xs uppercase tracking-widest font-bold text-blue-600">
                Official Booking Voucher
              </span>
              <h3 className="text-xl font-playfair font-bold text-gray-900 mt-1">
                {selectedReceipt.hotel?.name}
              </h3>
              <p className="text-xs text-gray-500">{selectedReceipt.hotel?.address}</p>
            </div>

            <div className="py-4 space-y-3 text-xs border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Reference:</span>
                <span className="font-mono font-bold text-gray-900">
                  #{selectedReceipt._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guest Name:</span>
                <span className="font-semibold text-gray-900">
                  {selectedReceipt.userName || "Valued Guest"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guest Email:</span>
                <span className="font-semibold text-gray-900">
                  {selectedReceipt.email || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Type:</span>
                <span className="font-semibold text-gray-900">
                  {selectedReceipt.room?.roomType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stay Dates:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(selectedReceipt.checkInDate).toLocaleDateString()} →{" "}
                  {new Date(selectedReceipt.checkOutDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Guests:</span>
                <span className="font-semibold text-gray-900">
                  {selectedReceipt.guests}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Status:</span>
                <span className="font-bold uppercase text-emerald-600">
                  {selectedReceipt.status || "Confirmed"}
                </span>
              </div>
            </div>

            <div className="py-3 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Total Amount:</span>
              <span className="text-lg text-emerald-600">
                ₹{Number(selectedReceipt.totalPrice).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-3 bg-gray-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Print / Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;
