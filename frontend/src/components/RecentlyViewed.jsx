import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

function RecentlyViewed() {
  const { recentlyViewed, formatPrice, toggleWishlist, isWishlisted } = useAppContext();

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 bg-gray-50/60 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600 block">
            Your Travel History
          </span>
          <h2 className="text-2xl font-playfair font-bold text-gray-900 mt-0.5">
            Recently Viewed Stays
          </h2>
        </div>
        <Link
          to="/rooms"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          Explore All Stays →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentlyViewed.map((room) => {
          const img =
            room.images && room.images.length > 0 ? room.images[0] : assets.roomImg1;
          const wishlisted = isWishlisted(room._id);

          return (
            <div
              key={room._id}
              className="group relative bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={img}
                  alt={room.hotel?.name || "Stay"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(room._id);
                  }}
                  aria-label="Wishlist"
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow-sm hover:scale-110 transition cursor-pointer"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${
                      wishlisted ? "fill-red-500 text-red-500" : "fill-transparent text-gray-700"
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
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                    {room.hotel?.city || "Destination"}
                  </span>
                  <h3 className="font-playfair font-bold text-sm text-gray-900 line-clamp-1 mt-0.5">
                    {room.hotel?.name || "Luxury Stay"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{room.roomType}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(room.pricePerNight)}
                    <span className="text-[11px] font-normal text-gray-500"> / night</span>
                  </span>
                  <Link
                    to={`/rooms/${room._id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecentlyViewed;
