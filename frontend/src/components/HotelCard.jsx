import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

function HotelCard({ room, index = 0 }) {
  const {
    toggleWishlist,
    isWishlisted,
    formatPrice,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useAppContext();

  const wishlisted = isWishlisted(room?._id);
  const inCompare = isInCompare(room?._id);

  const fallbackImg =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";
  const imageSrc =
    room?.images && room.images.length > 0 ? room.images[0] : fallbackImg;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (room?._id) {
      toggleWishlist(room._id);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(room._id);
    } else {
      addToCompare(room);
    }
  };

  const badgeText =
    index % 3 === 0
      ? "✨ Top Rated"
      : index % 3 === 1
      ? "🔥 Best Seller"
      : "💎 Luxury Pick";

  const rating = (4.7 + ((index * 7) % 3) * 0.1).toFixed(1);

  return (
    <Link
      to={`/rooms/${room?._id}`}
      onClick={() => scrollTo(0, 0)}
      className="group relative flex flex-col w-full max-w-[320px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Image with Zoom & Badges ── */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={room?.hotel?.name || "Hotel"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-60 pointer-events-none" />

        {/* Dynamic Badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-white/95 backdrop-blur-md text-gray-800 rounded-full shadow-sm">
          {badgeText}
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-gray-700 hover:text-red-500"
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
        </button>

        {/* Room Type Tag on Image Bottom */}
        <span className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-0.5 bg-black/60 backdrop-blur-sm text-white rounded-md">
          {room?.roomType || "Standard Room"}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-blue-600">
              {room?.hotel?.city || "Destination"}
            </p>
            <h3 className="font-playfair text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors mt-0.5">
              {room?.hotel?.name || "Luxury Stay"}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
            <span className="text-amber-500">★</span>
            <span>{rating}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-1 mt-1.5 flex items-center gap-1">
          <img src={assets.locationIcon} alt="" className="w-3.5 h-3.5 opacity-70 shrink-0" />
          <span>{room?.hotel?.address || "Address"}</span>
        </p>

        {/* Amenities preview tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
          {(room?.amenities || []).slice(0, 3).map((amenity, i) => (
            <span
              key={i}
              className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md"
            >
              {amenity}
            </span>
          ))}
          {(room?.amenities || []).length > 3 && (
            <span className="text-[11px] text-gray-400 self-center">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price & Compare & Action */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400">Starting from</span>
            <p className="text-base font-bold text-gray-900">
              {formatPrice(room?.pricePerNight || 0)}
              <span className="text-xs font-normal text-gray-500"> / night</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareClick}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                inCompare
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-white"
              }`}
            >
              {inCompare ? "✓ Compare" : "+ Compare"}
            </button>

            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              Book
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
