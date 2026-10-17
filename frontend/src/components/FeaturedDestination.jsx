import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function FeaturedDestination() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.get("/rooms/api");
      // Get up to 4 rooms
      setRooms(Array.isArray(data) ? data.slice(0, 4) : []);
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

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover Our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 min-h-[160px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Loading destinations...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={fetchFeatured}
              className="px-4 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition"
            >
              Retry
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500">No rooms available yet.</p>
        ) : (
          rooms.map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))
        )}
      </div>
      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destinations
      </button>
    </div>
  );
}

export default FeaturedDestination;
