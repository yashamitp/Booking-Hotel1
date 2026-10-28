import React, { useState, useEffect, useMemo } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axiosClient from "../api/axiosClient";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function MyBooking() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { formatPrice } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedVoucher, setCopiedVoucher] = useState(false);

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
      (b) => (b.status || "confirmed").toLowerCase() === activeFilter
    );
  }, [bookings, activeFilter]);

  const getStatusBadge = (status) => {
    const s = (status || "confirmed").toLowerCase();
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

  const handleCopyVoucher = () => {
    if (!selectedReceipt) return;
    const details = `QuickStay Booking Voucher\nProperty: ${selectedReceipt.hotel?.name}\nDates: ${new Date(selectedReceipt.checkInDate).toLocaleDateString()} to ${new Date(selectedReceipt.checkOutDate).toLocaleDateString()}\nRef: #${selectedReceipt._id}\nTotal: ₹${selectedReceipt.totalPrice}`;
    navigator.clipboard.writeText(details);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  return (
    <div className="py-28 md:py-32 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto min-h-[75vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <Title
          title="My Reservations"
          subTitle="View your upcoming getaways, view official vouchers, or manage your bookings."
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
          <p className="text-gray-500 text-xs sm:text-sm mt-1 mb-6">
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
                className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition gap-6"
              >
                {/* Hotel & Room Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={firstImg}
                    alt=""
                    className="w-24 h-24 md:w-32 md:h-28 rounded-2xl object-cover shrink-0 bg-gray-100"
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

                    {booking.addOns && booking.addOns.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md truncate">
                          + {booking.addOns.length} add-on service(s)
                        </span>
                      </div>
                    )}
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
                      {formatPrice(booking.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                  {getStatusBadge(booking.status)}

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedReceipt(booking)}
                      className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Receipt
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
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

      {/* ── Receipt / Voucher Modal ── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg p-2 cursor-pointer"
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

            <div className="py-4 space-y-2.5 text-xs border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Reference:</span>
                <span className="font-mono font-bold text-gray-900 uppercase">
                  #{selectedReceipt._id?.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guest Name:</span>
                <span className="font-semibold text-gray-900">
                  {selectedReceipt.userName || "Valued Guest"}
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
                  {selectedReceipt.guests} Guest(s)
                </span>
              </div>

              {selectedReceipt.addOns && selectedReceipt.addOns.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 block mb-1">Add-ons:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedReceipt.addOns.map((add, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {add}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedReceipt.specialRequests && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 block">Special Requests:</span>
                  <p className="text-[11px] text-gray-700 italic mt-0.5">
                    "{selectedReceipt.specialRequests}"
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold uppercase text-emerald-600">
                  {selectedReceipt.status || "Confirmed"}
                </span>
              </div>
            </div>

            <div className="py-3 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Total Amount:</span>
              <span className="text-lg text-emerald-600">
                {formatPrice(selectedReceipt.totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  `Stay at ${selectedReceipt.hotel?.name}`
                )}&dates=${new Date(selectedReceipt.checkInDate)
                  .toISOString()
                  .replace(/-|:|\.\d\d\d/g, "")}/${new Date(selectedReceipt.checkOutDate)
                  .toISOString()
                  .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
                  `Booking Ref: #${selectedReceipt._id}\nRoom: ${selectedReceipt.room?.roomType}`
                )}&location=${encodeURIComponent(selectedReceipt.hotel?.address || "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition text-center cursor-pointer"
              >
                📅 Add to Calendar
              </a>

              <button
                onClick={handleCopyVoucher}
                className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                {copiedVoucher ? "✓ Copied" : "Copy"}
              </button>

              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;
