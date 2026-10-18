import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import axiosClient from "../api/axiosClient";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useAppContext();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Review state
  const [reviews, setReviews] = useState([
    {
      name: "Aarav Sharma",
      date: "2 weeks ago",
      rating: 5,
      comment: "Absolutely breathtaking experience! The hospitality was unmatched and the view from the balcony was unforgettable.",
    },
    {
      name: "Sophia Chen",
      date: "1 month ago",
      rating: 5,
      comment: "Super seamless check-in and world-class amenities. The infinity pool and breakfast buffet were top tier.",
    },
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const wishlisted = isWishlisted(room?._id);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/rooms/api/${id}`);
        setRoom(response.data);
        if (response.data?.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        }
      } catch (err) {
        console.error("Failed to fetch room details:", err);
        setError(
          "Failed to load room details. The listing may not exist or the server may be waking up."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id]);

  const today = new Date().toISOString().split("T")[0];

  // Calculate nights and price
  const priceCalculations = useMemo(() => {
    if (!checkInDate || !checkOutDate || !room?.pricePerNight) {
      return { nights: 0, basePrice: 0, discount: 0, taxes: 0, total: 0 };
    }
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut - checkIn;
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (nights <= 0) {
      return { nights: 0, basePrice: 0, discount: 0, taxes: 0, total: 0 };
    }

    const basePrice = nights * room.pricePerNight;
    const discount = Math.round((basePrice * appliedDiscount) / 100);
    const taxableAmount = basePrice - discount;
    const taxes = Math.round(taxableAmount * 0.12); // 12% GST/fee
    const total = taxableAmount + taxes;

    return { nights, basePrice, discount, taxes, total };
  }, [checkInDate, checkOutDate, room?.pricePerNight, appliedDiscount]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "QUICKSTAY20") {
      setAppliedDiscount(20);
      setCouponMessage("🎉 20% discount applied!");
    } else if (code === "FIRSTSTAY") {
      setAppliedDiscount(15);
      setCouponMessage("🎉 15% discount applied!");
    } else if (code === "LUXURY10") {
      setAppliedDiscount(10);
      setCouponMessage("🎉 10% discount applied!");
    } else {
      setAppliedDiscount(0);
      setCouponMessage("❌ Invalid coupon code");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      openSignIn();
      return;
    }

    if (!checkInDate || !checkOutDate || !guests) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (priceCalculations.nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await axiosClient.post("/booking/api", {
        hotel: room.hotel?._id,
        room: room._id,
        userId: user.id,
        userName: user.fullName || user.firstName || "Valued Guest",
        email: user.primaryEmailAddress?.emailAddress || "",
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        totalPrice: priceCalculations.total,
      });

      setConfirmedBooking(response.data);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const reviewObj = {
      name: user?.fullName || user?.firstName || "Verified Guest",
      date: "Just now",
      rating: newRating,
      comment: newReviewText.trim(),
    };
    setReviews([reviewObj, ...reviews]);
    setNewReviewText("");
  };

  if (loading) {
    return (
      <div className="py-44 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="py-44 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-lg text-gray-700">{error || "Room not found"}</p>
        <button
          onClick={() => navigate("/rooms")}
          className="mt-2 px-6 py-2.5 text-sm bg-gray-900 text-white rounded-full hover:bg-blue-600 transition"
        >
          Back to all rooms
        </button>
      </div>
    );
  }

  return (
    <div className="py-28 md:py-32 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
              {room.hotel?.city || "Destination"}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
              ✓ Instant Confirmation
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-1">
            {room.hotel ? room.hotel.name : "Unassigned Stay"}{" "}
            <span className="font-sans font-normal text-xl text-gray-500">
              ({room.roomType})
            </span>
          </h1>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <StarRating />
              <span className="font-semibold text-gray-900 ml-1">4.9</span>
              <span className="text-gray-400">({reviews.length * 45}+ reviews)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <img src={assets.locationIcon} alt="" className="w-3.5 h-3.5 opacity-70" />
              <span>{room.hotel?.address}</span>
            </div>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(room._id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition cursor-pointer self-start md:self-auto ${
            wishlisted
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
          }`}
        >
          <svg
            className={`w-4 h-4 ${
              wishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-600"
            }`}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <span>{wishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
        </button>
      </div>

      {/* ── Photo Gallery ── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-lg bg-gray-100">
        <div className="lg:col-span-2 aspect-[16/10] overflow-hidden bg-gray-200">
          <img
            src={mainImage || assets.roomImg1}
            alt={room.roomType}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 p-4 lg:p-0 overflow-y-auto max-h-[500px]">
          {(room.images && room.images.length > 0
            ? room.images
            : [assets.roomImg1]
          ).map((img, index) => (
            <div
              key={index}
              onClick={() => setMainImage(img)}
              className={`aspect-[16/10] overflow-hidden rounded-xl cursor-pointer border-2 transition ${
                mainImage === img
                  ? "border-blue-600 shadow-md scale-[1.02]"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Description on Left, Booking Box on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Left: Info, Amenities, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900">
              About This Experience
            </h2>
            <p className="text-gray-600 leading-relaxed mt-3 text-sm md:text-base">
              Immerse yourself in world-class luxury at {room.hotel?.name}. Each room is
              architecturally designed to blend local heritage with modern five-star
              conveniences, offering tailored butler service, serene views, and plush
              linens.
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Premium Amenities Included
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(room.amenities || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <img
                    src={facilityIcons[item] || assets.freeWifiIcon}
                    alt=""
                    className="w-5 h-5 opacity-80"
                  />
                  <span className="text-xs font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Specs */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Stay Highlights</h3>
            {roomCommonData.map((spec, index) => (
              <div key={index} className="flex items-start gap-3">
                <img src={spec.icon} alt="" className="w-5 h-5 mt-0.5 opacity-80" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{spec.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{spec.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Reviews Section ── */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Guest Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1.5 text-sm font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                <span>★ 4.9 out of 5</span>
              </div>
            </div>

            {/* Leave a review */}
            <form
              onSubmit={handleAddReview}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Leave a review
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`text-lg cursor-pointer transition ${
                      star <= newRating ? "text-amber-500 scale-110" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                rows={2}
                placeholder="Share your stay experience..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newReviewText.trim()}
                  className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 disabled:opacity-40 transition cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-800">
                      {rev.name}
                    </span>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <div className="text-amber-500 text-xs mt-0.5">
                    {"★".repeat(rev.rating)}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Sticky Booking Widget ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{Number(room.pricePerNight).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-normal"> / night</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Available: {room.availableRooms} left
              </span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Dates grid */}
              <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 block">
                    Check-in
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      if (checkOutDate && e.target.value >= checkOutDate) {
                        setCheckOutDate("");
                      }
                    }}
                    className="w-full bg-transparent text-xs font-semibold text-gray-800 outline-none mt-1 cursor-pointer"
                    required
                  />
                </div>
                <div className="border-l pl-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500 block">
                    Check-out
                  </label>
                  <input
                    type="date"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-gray-800 outline-none mt-1 cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50/50 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Guests</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-16 bg-white border border-gray-200 rounded text-center text-sm font-semibold outline-none py-1"
                />
              </div>

              {/* Coupon Code Section */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon (e.g. QUICKSTAY20)"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] font-medium mt-1 ${
                      appliedDiscount > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Live Price Breakdown */}
              {priceCalculations.nights > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      ₹{room.pricePerNight.toLocaleString()} × {priceCalculations.nights}{" "}
                      night{priceCalculations.nights > 1 ? "s" : ""}
                    </span>
                    <span>₹{priceCalculations.basePrice.toLocaleString()}</span>
                  </div>

                  {priceCalculations.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount ({appliedDiscount}%)</span>
                      <span>-₹{priceCalculations.discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Taxes & Fees (12%)</span>
                    <span>₹{priceCalculations.taxes.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Payable</span>
                    <span>₹{priceCalculations.total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                type="submit"
                disabled={bookingLoading || room.availableRooms <= 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {bookingLoading
                  ? "Confirming Booking..."
                  : room.availableRooms <= 0
                  ? "Sold Out"
                  : priceCalculations.nights > 0
                  ? `Confirm Booking · ₹${priceCalculations.total.toLocaleString()}`
                  : "Reserve Now"}
              </button>
            </form>

            <p className="text-[11px] text-center text-gray-400">
              🔒 You won't be charged yet · 100% Secure reservation
            </p>
          </div>
        </div>
      </div>

      {/* ── Booking Confirmation Modal ── */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h3 className="text-2xl font-playfair font-bold text-gray-900">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your reservation has been securely saved and emailed.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 my-6 text-left text-xs space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-mono font-bold text-gray-900">
                  {confirmedBooking._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hotel:</span>
                <span className="font-semibold text-gray-900">
                  {room.hotel?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Type:</span>
                <span className="font-semibold text-gray-900">
                  {room.roomType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(checkInDate).toLocaleDateString()} →{" "}
                  {new Date(checkOutDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm text-gray-900">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">
                  ₹{Number(confirmedBooking.totalPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full py-3 bg-gray-950 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Go to My Bookings
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
