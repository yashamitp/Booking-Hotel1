import React, { useEffect } from "react";

function PhotoLightbox({ images = [], currentIndex = 0, isOpen, onClose, onSelectIndex }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onSelectIndex((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        onSelectIndex((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-white max-w-6xl py-2">
        <span className="text-sm font-medium text-gray-300">
          Photo {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition text-lg font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Main View Area with Left/Right Arrows */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center min-h-0 my-2">
        {images.length > 1 && (
          <button
            onClick={() =>
              onSelectIndex((currentIndex - 1 + images.length) % images.length)
            }
            className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-200"
        />

        {images.length > 1 && (
          <button
            onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
            className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
            aria-label="Next photo"
          >
            ›
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                idx === currentIndex
                  ? "border-blue-500 scale-105 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoLightbox;
