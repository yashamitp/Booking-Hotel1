import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import PhotoLightbox from "../components/PhotoLightbox";
import axiosClient from "../api/axiosClient";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const AVAILABLE_ADDONS = [
  { id: "airport_pickup", label: "Private Airport Chauffeur Transfer", price: 1500 },
  { id: "early_checkin", label: "Guaranteed Early Check-in (11:00 AM)", price: 800 },
  { id: "celebration", label: "Honeymoon & Anniversary Champagne Setup", price: 2000 },
  { id: "quiet_room", label: "Quiet High-Floor Suite Preference", price: 0 },
];

const HOTEL_FAQS = [
  {
    q: "What are the standard check-in and check-out timings?",
    a: "Standard check-in begins at 2:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out can be requested via our add-ons or by notifying the concierge.",
  },
  {
    q: "Is high-speed wireless internet complimentary?",
    a: "Yes, all our luxury rooms include complimentary high-speed fiber-optic WiFi throughout the suite and common resort areas.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "You can cancel your booking for a full refund up to 48 hours prior to your scheduled check-in date directly from your reservations dashboard.",
  },
  {
    q: "Are pets permitted on the property?",
    a: "Select suites are pet-friendly upon advance notice. Please mention your pet details in the special requests section when booking.",
  },
];

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    toggleWishlist,
    isWishlisted,
    formatPrice,
    addToCompare,
    removeFromCompare,
    isInCompare,
    addRecentlyViewed,
  } = useAppContext();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Review state
  const [reviews, setReviews] = useState([
    {
      name: "Aarav Sharma",
      date: "2 weeks ago",
      rating: 5,
      comment:
        "Absolutely breathtaking experience! The hospitality was unmatched and the view from the balcony was unforgettable.",
    },
    {
      name: "Sophia Chen",
      date: "1 month ago",
      rating: 5,
      comment:
        "Super seamless check-in and world-class amenities. The infinity pool and breakfast buffet were top tier.",
    },
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const wishlisted = isWishlisted(room?._id);
  const inCompare = isInCompare(room?._id);

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
        // Save to Recently Viewed
        if (response.data) {
          addRecentlyViewed(response.data);
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

  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calculate nights, addons, and price
  const priceCalculations = useMemo(() => {
    if (!checkInDate || !checkOutDate || !room?.pricePerNight) {
      return {
        nights: 0,
        basePrice: 0,
        discount: 0,
        taxes: 0,
        addonTotal: 0,
        total: 0,
      };
    }
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut - checkIn;
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (nights <= 0) {
      return {
        nights: 0,
        basePrice: 0,
        discount: 0,
        taxes: 0,
        addonTotal: 0,
        total: 0,
      };
    }

    const basePrice = nights * room.pricePerNight;
    const discount = Math.round((basePrice * appliedDiscount) / 100);
    const taxableAmount = basePrice - discount;
    const taxes = Math.round(taxableAmount * 0.12); // 12% GST/fee

    const addonTotal = selectedAddons.reduce((sum, addId) => {
      const item = AVAILABLE_ADDONS.find((a) => a.id === addId);
      return sum + (item ? item.price : 0);
    }, 0);

    const total = taxableAmount + taxes + addonTotal;

    return { nights, basePrice, discount, taxes, addonTotal, total };
  }, [checkInDate, checkOutDate, room?.pricePerNight, appliedDiscount, selectedAddons]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${room.hotel?.name} - QuickStay`,
          text: `Check out ${room.hotel?.name} (${room.roomType}) in ${room.hotel?.city}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
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
      const chosenAddonsLabels = selectedAddons.map((id) => {
        const item = AVAILABLE_ADDONS.find((a) => a.id === id);
        return item ? item.label : id;
      });

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
        status: "confirmed",
        specialRequests: specialRequests.trim(),
        addOns: chosenAddonsLabels,
      });

      setConfirmedBooking(response.data);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(
        err.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
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

  const allImages = useMemo(() => {
    if (room?.images && room.images.length > 0) return room.images;
    return [assets.roomImg1];
  }, [room]);

  if (loading) {
    return (
      <div className="py-44 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Loading luxury stay details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="py-44 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-lg text-gray-700">{error || "Room not found"}</p>
        <button
          onClick={() => navigate("/rooms")}
          className="mt-2 px-6 py-2.5 text-sm bg-gray-900 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
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

        {/* Action Buttons: Compare, Share, Wishlist */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {/* Compare Button */}
          <button
            onClick={() => (inCompare ? removeFromCompare(room._id) : addToCompare(room))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
              inCompare
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            {inCompare ? "✓ Compared" : "+ Compare Stay"}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:border-gray-400 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{shareFeedback ? "Link Copied!" : "Share"}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(room._id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
              wishlisted
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${
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
            <span>{wishlisted ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* ── Photo Gallery with Lightbox Trigger ── */}
      <div className="mt-8 relative rounded-3xl overflow-hidden shadow-lg bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            onClick={() => {
              setLightboxIndex(0);
              setIsLightboxOpen(true);
            }}
            className="lg:col-span-2 aspect-[16/10] overflow-hidden bg-gray-200 cursor-pointer group relative"
          >
            <img
              src={mainImage || assets.roomImg1}
              alt={room.roomType}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
              <span>🔍 Click to view full screen</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 p-4 lg:p-0 overflow-y-auto max-h-[500px]">
            {allImages.map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setMainImage(img);
                  setLightboxIndex(index);
                }}
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

        {/* View All Photos Pill */}
        <button
          onClick={() => {
            setLightboxIndex(0);
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:bg-white transition cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>View All {allImages.length} Photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={(idx) => {
          setLightboxIndex(idx);
          setMainImage(allImages[idx]);
        }}
      />

      {/* ── Main Layout: Content on Left, Sticky Booking Widget on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900">
              About This Luxury Sanctuary
            </h2>
            <p className="text-gray-600 leading-relaxed mt-3 text-sm md:text-base">
              Immerse yourself in world-class refinement at {room.hotel?.name}. Each suite is
              architecturally crafted to blend authentic regional heritage with ultra-modern
              five-star conveniences, including personalized butler service, serene vistas,
              plush Egyptian cotton linens, and state-of-the-art acoustic soundproofing.
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

          {/* Stay Highlights */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">QuickStay Privileges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomCommonData.map((spec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70">
                  <img src={spec.icon} alt="" className="w-5 h-5 mt-0.5 opacity-80 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{spec.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{spec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Policies Card */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">House Rules & Policies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium">Check-in</span>
                <span className="font-bold text-gray-800 text-sm mt-0.5 block">2:00 PM</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium">Check-out</span>
                <span className="font-bold text-gray-800 text-sm mt-0.5 block">11:00 AM</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium">Cancellation</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">Free 48h</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block font-medium">Smoking</span>
                <span className="font-bold text-gray-800 text-sm mt-0.5 block">100% Smoke-Free</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {HOTEL_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-gray-800 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-base text-gray-400 ml-2">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Guest Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                <span>★ 4.9 out of 5 · Superb</span>
              </div>
            </div>

            {/* Leave a review */}
            <form
              onSubmit={handleAddReview}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Leave a Verified Review
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
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-blue-500 resize-none"
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
                    <span className="font-semibold text-xs sm:text-sm text-gray-800">
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
                  {formatPrice(room.pricePerNight)}
                </span>
                <span className="text-xs text-gray-500 font-normal"> / night</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
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
                <div className="border-l border-gray-200 pl-2">
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
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-medium text-gray-800 outline-none focus:border-blue-500 bg-white"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Guests (Family)</option>
                </select>
              </div>

              {/* Bespoke Add-ons */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-800 block mb-2">
                  Enhance Your Stay (Add-ons)
                </label>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const checked = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                          checked
                            ? "bg-blue-50/50 border-blue-300 text-blue-900"
                            : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleAddonToggle(addon.id)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{addon.label}</p>
                          <p className="text-[10px] text-gray-500 font-semibold">
                            {addon.price === 0 ? "Complimentary" : `+ ${formatPrice(addon.price)}`}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests Textarea */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Special Requests / Arrival Notes
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Quiet room, late arrival, dietary preferences"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. QUICKSTAY20"
                    className="flex-1 uppercase font-mono text-xs rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[11px] font-medium text-emerald-600 mt-1">
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Live Price Breakdown */}
              {priceCalculations.nights > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      {formatPrice(room.pricePerNight)} × {priceCalculations.nights} nights
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(priceCalculations.basePrice)}
                    </span>
                  </div>

                  {priceCalculations.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedDiscount}%)</span>
                      <span>- {formatPrice(priceCalculations.discount)}</span>
                    </div>
                  )}

                  {priceCalculations.addonTotal > 0 && (
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Selected Add-ons</span>
                      <span>+ {formatPrice(priceCalculations.addonTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxes & Luxury Resort Fees (12%)</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(priceCalculations.taxes)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-gray-900">
                    <span>Total Estimated Due</span>
                    <span className="text-lg text-blue-600 font-extrabold">
                      {formatPrice(priceCalculations.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <button
                type="submit"
                disabled={bookingLoading || room.availableRooms <= 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                {bookingLoading
                  ? "Confirming Reservation..."
                  : room.availableRooms <= 0
                  ? "Sold Out"
                  : "Reserve Now"}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                🔒 You won't be charged until check-in. Instant confirmation.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ── Booking Confirmation Voucher Modal ── */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold animate-bounce">
              ✓
            </div>

            <h3 className="font-playfair text-2xl font-bold text-gray-900">
              Reservation Confirmed!
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your stay has been officially secured.
            </p>

            {/* Voucher Box */}
            <div className="my-6 p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Booking Ref:</span>
                <span className="font-mono font-bold text-gray-900 uppercase">
                  #{confirmedBooking._id?.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property:</span>
                <span className="font-semibold text-gray-800">{room.hotel?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Type:</span>
                <span className="font-medium text-gray-800">{room.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates:</span>
                <span className="font-medium text-gray-800">
                  {checkInDate} → {checkOutDate} ({priceCalculations.nights} nights)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guests:</span>
                <span className="font-medium text-gray-800">{guests} Guest(s)</span>
              </div>

              {selectedAddons.length > 0 && (
                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-blue-700">
                  <span>Add-ons:</span>
                  <span className="font-medium">{selectedAddons.length} selected</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatPrice(confirmedBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Google Calendar Link */}
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  `Stay at ${room.hotel?.name}`
                )}&dates=${new Date(checkInDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(
                  checkOutDate
                ).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
                  `Booking Ref: #${confirmedBooking._id}\nRoom: ${room.roomType}`
                )}&location=${encodeURIComponent(room.hotel?.address || "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                📅 Add to Calendar
              </a>

              <button
                onClick={() => navigate("/my-bookings")}
                className="flex-1 py-2.5 bg-gray-900 hover:bg-blue-600 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                My Reservations →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
