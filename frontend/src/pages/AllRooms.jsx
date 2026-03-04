import React, { useState, useEffect, useMemo } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import axiosClient from "../api/axiosClient";

/* =======================
   Reusable Components
======================= */

const CheckBox = ({ label, selected = false, onChange }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

/* =======================
        Main Page
======================= */

function AllRooms() {
  const navigate = useNavigate();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [roomsData, setRoomsData] = useState([]);

  const roomtypes = ["Single Bed", "Double Bed", "Luxury room", "Family Suite"];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "price low to high",
    "price high to low",
    "newest first",
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosClient.get("/rooms/api");
        setRoomsData(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  /* =======================
        Handlers
======================= */

  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handlePriceChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  /* =======================
      Filter + Sort Logic
======================= */

  const filteredRooms = useMemo(() => {
    let data = [...roomsData];

    // Filter by room type
    if (selectedRoomTypes.length) {
      data = data.filter((room) =>
        selectedRoomTypes.includes(room.roomType)
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length) {
      data = data.filter((room) =>
        selectedPriceRanges.some((range) => {
          const [min, max] = range.split(" to ").map(Number);
          return room.pricePerNight >= min && room.pricePerNight <= max;
        })
      );
    }

    // Sorting
    if (sortBy === "price low to high") {
      data.sort((a, b) => a.pricePerNight - b.pricePerNight);
    }

    if (sortBy === "price high to low") {
      data.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    if (sortBy === "newest first") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [selectedRoomTypes, selectedPriceRanges, sortBy, roomsData]);

  /* =======================
          UI
======================= */

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24">

      {/* ROOMS LIST */}
      <div className="flex-1">
        <h1 className="font-playfair text-4xl md:text-[48px]">
          Hotel Rooms
        </h1>

        {filteredRooms.length === 0 ? <p className="mt-8">No rooms found.</p> : filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row gap-6 py-10 border-b"
          >
            <img
              src={room.images && room.images.length > 0 ? room.images[0] : assets.roomImg1}
              alt=""
              className="md:w-1/2 rounded-xl cursor-pointer object-cover"
              onClick={() => navigate(`/rooms/${room._id}`)}
              style={{maxHeight: '300px'}}
            />

            <div className="md:w-1/2">
              <p className="text-gray-500">{room.hotel?.city || "Unknown City"}</p>

              <p
                className="text-3xl font-playfair cursor-pointer"
                onClick={() => navigate(`/rooms/${room._id}`)}
              >
                {room.hotel?.name || "Unassigned Hotel"}
              </p>

              <div className="flex items-center mt-1">
                <StarRating />
                <span className="ml-2">200+ reviews</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {room.amenities && room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F5F5FF] px-3 py-2 rounded-lg"
                  >
                    <img
                      src={facilityIcons[item] || assets.freeWifiIcon}
                      alt=""
                      className="w-5 h-5"
                    />
                    <span className="text-xs">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-xl font-medium mt-4">
                ₹{room.pricePerNight}/night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER SIDEBAR */}
      <div className="w-80 border border-gray-300 bg-white mb-8 lg:mt-16">
        <div className="flex justify-between px-5 py-3 border-b">
          <p>FILTERS</p>
          <span
            className="cursor-pointer lg:hidden"
            onClick={() => setOpenFilters(!openFilters)}
          >
            {openFilters ? "HIDE" : "SHOW"}
          </span>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all`}
        >
          <div className="px-5 pt-4">
            <p className="font-medium">Room Type</p>
            {roomtypes.map((room, i) => (
              <CheckBox
                key={i}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium">Price Range</p>
            {priceRanges.map((range, i) => (
              <CheckBox
                key={i}
                label={range}
                selected={selectedPriceRanges.includes(range)}
                onChange={handlePriceChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-6">
            <p className="font-medium">Sort By</p>
            {sortOptions.map((option, i) => (
              <RadioButton
                key={i}
                label={option}
                selected={sortBy === option}
                onChange={setSortBy}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllRooms;
