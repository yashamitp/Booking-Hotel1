import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function FeaturedDestination() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axiosClient.get("/rooms/api");
        // Get up to 4 rooms
        setRooms(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured rooms", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col items-center px-6  md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover Our handpicked selection of exceptional properties around the world , offering unparalleled luxury and unforgettable experiences."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {rooms.length === 0 ? (
           <p className="text-gray-500">No rooms available yet.</p>
        ) : rooms.map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}} className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer">
        View All Destination
      </button>
    </div>
  );
}

export default FeaturedDestination;
