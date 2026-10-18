import React, { useState, useEffect, useMemo } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function FeaturedDestination() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.get("/rooms/api");
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching featured rooms", err);
      setError("Unable to load destinations. The server may be waking up, please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const cities = useMemo(() => {
    const list = new Set(rooms.map((r) => r.hotel?.city).filter(Boolean));
    return ["All", ...Array.from(list).slice(0, 6)];
  }, [rooms]);

  const displayedRooms = useMemo(() => {
    const filtered =
      selectedCity === "All"
        ? rooms
        : rooms.filter((r) => r.hotel?.city === selectedCity);
    return filtered.slice(0, 8);
  }, [rooms, selectedCity]);

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-20 bg-slate-50 py-24">
      <Title
        title="Featured Luxury Destinations"
        subTitle="Handpicked sanctuaries across the globe — from private beach villas in Goa to high-rise onsens in Tokyo."
      />

      {/* ── City Quick-Filter Pills ── */}
      {cities.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mt-10 max-w-2xl">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-gray-900 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* ── Hotel Grid ── */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 w-full max-w-7xl min-h-[220px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Discovering exceptional stays...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={fetchFeatured}
              className="px-5 py-2 text-xs font-semibold text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
            >
              Retry Connection
            </button>
          </div>
        ) : displayedRooms.length === 0 ? (
          <p className="text-gray-500 py-10">No rooms available in {selectedCity}.</p>
        ) : (
          displayedRooms.map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))
        )}
      </div>

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="mt-14 px-7 py-3 text-sm font-semibold border-2 border-gray-900 rounded-full bg-transparent hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        Explore All {rooms.length} Stays →
      </button>
    </div>
  );
}

export default FeaturedDestination;
