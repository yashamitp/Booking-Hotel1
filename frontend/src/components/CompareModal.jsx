import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const ALL_AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Spa & Wellness",
  "Free Breakfast",
  "Air Conditioning",
  "Butler Service",
];

function CompareModal() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    formatPrice,
  } = useAppContext();

  if (!isCompareModalOpen || !compareList || compareList.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Side-by-Side Comparison
            </span>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mt-0.5">
              Compare Luxury Stays
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-gray-500 hover:text-red-600 transition font-medium cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="overflow-x-auto flex-1 mt-6">
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${compareList.length}, minmax(220px, 1fr))` }}>
            {/* ROW: Header / Image / Title */}
            <div className="p-3 font-semibold text-xs text-gray-400 uppercase tracking-wider flex items-center">
              Property
            </div>
            {compareList.map((room) => {
              const img =
                room.images && room.images.length > 0 ? room.images[0] : assets.roomImg1;
              return (
                <div key={room._id} className="p-3 border-l border-gray-100 text-center relative group">
                  <button
                    onClick={() => removeFromCompare(room._id)}
                    aria-label="Remove"
                    className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-white/90 shadow text-xs font-bold text-gray-700 hover:bg-red-500 hover:text-white transition flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                  <img
                    src={img}
                    alt=""
                    className="w-full aspect-[16/10] object-cover rounded-xl shadow-sm mb-3"
                  />
                  <h3 className="font-playfair font-bold text-base text-gray-900 line-clamp-1">
                    {room.hotel?.name || "Luxury Stay"}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium">
                    {room.hotel?.city || "Destination"}
                  </p>
                </div>
              );
            })}

            {/* ROW: Price */}
            <div className="p-4 bg-gray-50 font-semibold text-xs text-gray-500 border-t border-gray-100 flex items-center">
              Price / Night
            </div>
            {compareList.map((room) => (
              <div
                key={room._id}
                className="p-4 bg-gray-50 border-t border-l border-gray-100 text-center"
              >
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(room.pricePerNight)}
                </span>
                <span className="text-[11px] text-gray-500 block">+ 12% taxes</span>
              </div>
            ))}

            {/* ROW: Room Type */}
            <div className="p-4 font-semibold text-xs text-gray-500 border-t border-gray-100 flex items-center">
              Room Type
            </div>
            {compareList.map((room) => (
              <div
                key={room._id}
                className="p-4 border-t border-l border-gray-100 text-center text-xs font-semibold text-gray-800"
              >
                {room.roomType || "Standard"}
              </div>
            ))}

            {/* ROW: Availability */}
            <div className="p-4 bg-gray-50 font-semibold text-xs text-gray-500 border-t border-gray-100 flex items-center">
              Availability
            </div>
            {compareList.map((room) => (
              <div
                key={room._id}
                className="p-4 bg-gray-50 border-t border-l border-gray-100 text-center"
              >
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    room.availableRooms > 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {room.availableRooms > 0
                    ? `${room.availableRooms} rooms left`
                    : "Sold out"}
                </span>
              </div>
            ))}

            {/* ROW: Amenities Header */}
            <div className="col-span-full py-2 px-3 bg-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-600 mt-2">
              Amenities Comparison
            </div>

            {/* AMENITIES ROWS */}
            {ALL_AMENITIES.map((amenity) => (
              <React.Fragment key={amenity}>
                <div className="p-3 text-xs font-medium text-gray-600 border-b border-gray-100 flex items-center">
                  {amenity}
                </div>
                {compareList.map((room) => {
                  const hasAmenity = (room.amenities || []).some(
                    (a) => a.toLowerCase().includes(amenity.toLowerCase()) || amenity.toLowerCase().includes(a.toLowerCase())
                  );
                  return (
                    <div
                      key={room._id}
                      className="p-3 border-l border-b border-gray-100 text-center flex items-center justify-center"
                    >
                      {hasAmenity ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">─</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* ROW: Direct Action */}
            <div className="p-4 font-semibold text-xs text-gray-500 border-t border-gray-100 flex items-center">
              Action
            </div>
            {compareList.map((room) => (
              <div
                key={room._id}
                className="p-4 border-t border-l border-gray-100 text-center"
              >
                <Link
                  to={`/rooms/${room._id}`}
                  onClick={() => setIsCompareModalOpen(false)}
                  className="inline-block w-full py-2.5 px-4 bg-gray-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition shadow"
                >
                  View & Book
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareModal;
