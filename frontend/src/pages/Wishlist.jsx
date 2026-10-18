import React, { useEffect, useState, useMemo } from "react";
import Title from "../components/Title";
import HotelCard from "../components/HotelCard";
import { useAppContext } from "../context/AppContext";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist } = useAppContext();
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/rooms/api");
        setAllRooms(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch rooms for wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const savedRooms = useMemo(() => {
    return allRooms.filter((room) => wishlist.includes(room._id));
  }, [allRooms, wishlist]);

  return (
    <div className="py-28 md:py-32 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto min-h-[75vh]">
      <Title
        title="Saved Luxury Stays"
        subTitle="Your personal wishlist of dream escapes, boutique villas, and royal palace retreats."
        align="left"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your saved stays...</p>
        </div>
      ) : savedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/70 border border-dashed border-gray-200 rounded-3xl mt-8 p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-400">
            <svg className="w-8 h-8 fill-red-400" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Your wishlist is empty</h3>
          <p className="text-gray-500 text-sm max-w-md mt-1 mb-6">
            Explore our handpicked collection of world-class properties and click the heart icon on any stay to save it for later.
          </p>
          <button
            onClick={() => {
              navigate("/rooms");
              scrollTo(0, 0);
            }}
            className="px-6 py-2.5 bg-gray-900 hover:bg-blue-600 text-white font-medium text-sm rounded-full shadow transition-all cursor-pointer"
          >
            Explore Hotels
          </button>
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-sm font-medium text-gray-500 mb-6">
            Showing {savedRooms.length} saved stay{savedRooms.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
            {savedRooms.map((room, index) => (
              <HotelCard key={room._id} room={room} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
