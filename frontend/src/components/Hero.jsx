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

  // Compute today's date string for date input min attributes
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px]">
        Discover Your perfect Gateway Destination
      </h1>
      <p className="max-w-130 mt-2  text-sm md:text-base">
        Unparalleled luxury and comfort await at the world's most exclusive
        hotels and resorts. Start your journey today
      </p>

      <form
        onSubmit={handleSearch}
        className="bg-white text-gray-500 mt-8 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto"
      >
        {/* Destination */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.locationIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            list="destinations"
            id="destinationInput"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Where to?"
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        {/* Check In */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              // If check-out is before new check-in, reset it
              if (checkOut && e.target.value > checkOut) setCheckOut("");
            }}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Check Out */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Guests */}
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={10}
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="1"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-2 hover:bg-gray-800 transition"
        >
          <img src={assets.searchIcon} alt="search" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default Hero;
