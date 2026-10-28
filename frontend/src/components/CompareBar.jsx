import React from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, setIsCompareModalOpen, formatPrice } =
    useAppContext();

  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 animate-fade-in">
      {/* Left: Info & Thumbnails */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-1">
        <div className="shrink-0">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-400 block">
            Compare Stays
          </span>
          <span className="text-xs text-gray-300 font-medium">
            {compareList.length} of 4 selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {compareList.map((room) => {
            const img =
              room.images && room.images.length > 0 ? room.images[0] : assets.roomImg1;
            return (
              <div
                key={room._id}
                className="relative group shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-gray-800"
              >
                <img
                  src={img}
                  alt={room.hotel?.name || "Stay"}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromCompare(room._id)}
                  aria-label="Remove"
                  className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        <button
          onClick={clearCompare}
          className="text-xs text-gray-400 hover:text-white px-2 py-1 transition cursor-pointer"
        >
          Clear
        </button>

        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-blue-500/30 transition cursor-pointer"
        >
          <span>Compare Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CompareBar;
