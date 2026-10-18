import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    navigate(`/rooms?${params.toString()}`);
  };

  const handleQuickDestination = (city) => {
    setDestination(city);
    navigate(`/rooms?city=${encodeURIComponent(city)}`);
  };

  const today = new Date().toISOString().split("T")[0];

  const popularPills = ["Goa", "Dubai", "Bali", "Paris", "Tokyo", "Jaipur", "Maldives"];

  return (
    <div className='relative flex flex-col items-center justify-center min-h-[92vh] px-4 md:px-12 lg:px-24 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center overflow-hidden'>
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-24 md:pt-28">
        {/* Pill Badge */}
        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wide border border-white/25 shadow-lg mb-4 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Curated Luxury Stays Across 50+ Countries
        </span>

        {/* Hero Headline */}
        <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
          Discover Your Next <span className="italic font-normal text-amber-200">Extraordinary</span> Escape
        </h1>

        <p className="max-w-2xl mt-4 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-light">
          From private villas in Bali to royal palaces in Rajasthan. Unmatched luxury, best rate guarantees, and personalized hospitality.
        </p>

        {/* Search Container (Glassmorphism) */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white/95 backdrop-blur-xl text-gray-700 mt-8 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3 border border-white/50 text-left"
        >
          {/* Destination */}
          <div className="flex-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition border border-transparent focus-within:border-blue-400">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <img src={assets.locationIcon} alt="" className="h-3.5 w-3.5 opacity-80" />
              <span>Destination</span>
            </div>
            <input
              list="destinations"
              id="destinationInput"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent font-medium text-gray-900 text-sm mt-1 outline-none placeholder:text-gray-400"
              placeholder="e.g. Goa, Dubai, Paris..."
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Check In */}
          <div className="flex-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition border border-transparent focus-within:border-blue-400">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <img src={assets.calenderIcon} alt="" className="h-3.5 w-3.5 opacity-80" />
              <span>Check-in</span>
            </div>
            <input
              id="checkIn"
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value > checkOut) setCheckOut("");
              }}
              className="w-full bg-transparent font-medium text-gray-900 text-sm mt-1 outline-none cursor-pointer"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Check Out */}
          <div className="flex-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition border border-transparent focus-within:border-blue-400">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <img src={assets.calenderIcon} alt="" className="h-3.5 w-3.5 opacity-80" />
              <span>Check-out</span>
            </div>
            <input
              id="checkOut"
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent font-medium text-gray-900 text-sm mt-1 outline-none cursor-pointer"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Guests */}
          <div className="w-full md:w-28 px-3 py-2 rounded-xl hover:bg-gray-50 transition border border-transparent focus-within:border-blue-400">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <img src={assets.guestsIcon} alt="" className="h-3.5 w-3.5 opacity-80" />
              <span>Guests</span>
            </div>
            <input
              min={1}
              max={10}
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent font-medium text-gray-900 text-sm mt-1 outline-none"
            />
          </div>

          {/* Search CTA */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <img src={assets.searchIcon} alt="" className="h-4 w-4 invert brightness-0" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Trending Tags */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-5 text-xs text-white/80">
          <span className="font-medium text-white/90">🔥 Trending Stays:</span>
          {popularPills.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleQuickDestination(city)}
              className="bg-white/15 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white transition border border-white/20 cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
