import React, { useState, useMemo, useEffect } from "react";
import Title from "../components/Title";
import { assets, facilityIcons, cities } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected, onChange }) => (
  <label className="flex items-center gap-2.5 mt-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 select-none">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
    <span>{label}</span>
  </label>
);

const RadioButton = ({ label, selected, onChange }) => (
  <label className="flex items-center gap-2.5 mt-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 select-none">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
    <span className="capitalize">{label}</span>
  </label>
);

function AllRooms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toggleWishlist, isWishlisted } = useAppContext();

  // Read hero search params from URL
  const cityFromUrl = searchParams.get("city") || "";
  const checkInFromUrl = searchParams.get("checkIn") || "";
  const checkOutFromUrl = searchParams.get("checkOut") || "";
  const guestsFromUrl = searchParams.get("guests") || "";

  const [searchKeyword, setSearchKeyword] = useState(cityFromUrl);
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomtypes = [
    "Single Bed",
    "Double Bed",
    "Luxury room",
    "Family Suite",
    "Villa",
    "Suite",
  ];

  const priceRanges = [
    "Under ₹10,000",
    "₹10,000 to ₹25,000",
    "₹25,000 to ₹50,000",
    "Above ₹50,000",
  ];

  const amenitiesList = [
    "Free WiFi",
    "Swimming Pool",
    "Spa & Wellness",
    "Free Breakfast",
    "Air Conditioning",
    "Butler Service",
  ];

  const sortOptions = [
    "price low to high",
    "price high to low",
    "newest first",
  ];

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/rooms/api");
      setRoomsData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Unable to load rooms. The server may be waking up, please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (cityFromUrl) {
      setSearchKeyword(cityFromUrl);
    }
  }, [cityFromUrl]);

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

  const handleAmenityChange = (checked, label) => {
    setSelectedAmenities((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const filteredRooms = useMemo(() => {
    let data = [...roomsData];

    // Filter by keyword (city, hotel name, address)
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      data = data.filter(
        (room) =>
          room.hotel?.city?.toLowerCase().includes(q) ||
          room.hotel?.name?.toLowerCase().includes(q) ||
          room.hotel?.address?.toLowerCase().includes(q) ||
          room.roomType?.toLowerCase().includes(q)
      );
    }

    // Filter by room type
    if (selectedRoomTypes.length) {
      data = data.filter((room) =>
        selectedRoomTypes.some((t) =>
          room.roomType?.toLowerCase().includes(t.toLowerCase())
        )
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length) {
      data = data.filter((room) =>
        selectedPriceRanges.some((range) => {
          const price = Number(room.pricePerNight) || 0;
          if (range === "Under ₹10,000") return price < 10000;
          if (range === "₹10,000 to ₹25,000") return price >= 10000 && price <= 25000;
          if (range === "₹25,000 to ₹50,000") return price > 25000 && price <= 50000;
          if (range === "Above ₹50,000") return price > 50000;
          return true;
        })
      );
    }

    // Filter by amenities
    if (selectedAmenities.length) {
      data = data.filter((room) =>
        selectedAmenities.every((amenity) =>
          (room.amenities || []).some(
            (a) => a.toLowerCase() === amenity.toLowerCase()
          )
        )
      );
    }

    // Sort
    if (sortBy === "price low to high") {
      data.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price high to low") {
      data.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "newest first") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [
    roomsData,
    searchKeyword,
    selectedRoomTypes,
    selectedPriceRanges,
    selectedAmenities,
    sortBy,
  ]);

  const hasActiveFilters =
    searchKeyword ||
    selectedRoomTypes.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedAmenities.length > 0 ||
    sortBy;

  const clearAllFilters = () => {
    setSearchKeyword("");
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedAmenities([]);
    setSortBy("");
    navigate("/rooms");
  };

  return (
    <div className="py-28 md:py-32 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <Title
          title="Explore Luxury Accommodations"
          subTitle="Discover handpicked suites, overwater villas, and heritage palace retreats worldwide."
          align="left"
        />

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by hotel, city..."
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-blue-500 transition"
          />
          <img
            src={assets.searchIcon}
            alt=""
            className="w-4 h-4 absolute left-3.5 top-3 text-gray-400"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Destination Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 mt-2 text-xs no-scrollbar">
        <span className="font-semibold text-gray-500 shrink-0">Popular:</span>
        {cities.slice(0, 8).map((c) => (
          <button
            key={c}
            onClick={() => setSearchKeyword(c)}
            className={`px-3 py-1 rounded-full shrink-0 transition border cursor-pointer ${
              searchKeyword.toLowerCase() === c.toLowerCase()
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between border-b pb-4">
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
          >
            <span>{openFilters ? "Hide Filters" : "Show Filters"}</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {filteredRooms.length}
            </span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 font-medium underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* ── Left Sidebar Filters ── */}
        <aside
          className={`w-full lg:w-72 shrink-0 ${
            openFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Filter Stays</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <p className="font-semibold text-sm text-gray-800 mb-2">Price per Night</p>
              {priceRanges.map((range, i) => (
                <CheckBox
                  key={i}
                  label={range}
                  selected={selectedPriceRanges.includes(range)}
                  onChange={handlePriceChange}
                />
              ))}
            </div>

            {/* Amenities Filter */}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-sm text-gray-800 mb-2">Amenities</p>
              {amenitiesList.map((amenity, i) => (
                <CheckBox
                  key={i}
                  label={amenity}
                  selected={selectedAmenities.includes(amenity)}
                  onChange={handleAmenityChange}
                />
              ))}
            </div>

            {/* Room Type */}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-sm text-gray-800 mb-2">Room Type</p>
              {roomtypes.map((room, i) => (
                <CheckBox
                  key={i}
                  label={room}
                  selected={selectedRoomTypes.includes(room)}
                  onChange={handleRoomTypeChange}
                />
              ))}
            </div>

            {/* Sort Options */}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-sm text-gray-800 mb-2">Sort By</p>
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
        </aside>

        {/* ── Right Content: Room Listings ── */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900 font-bold">{filteredRooms.length}</span> luxury stay{filteredRooms.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm font-medium">Curating extraordinary stays...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center bg-gray-50 rounded-2xl p-8 border">
              <p className="text-gray-700 font-medium">{error}</p>
              <button
                onClick={fetchRooms}
                className="mt-4 px-5 py-2 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-blue-600 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="py-20 text-center bg-gray-50/70 border border-dashed border-gray-200 rounded-3xl p-8">
              <p className="text-xl font-bold text-gray-800">No rooms match your criteria</p>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Try clearing some filters or searching for another destination.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-blue-600 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredRooms.map((room, idx) => {
                const wishlisted = isWishlisted(room._id);
                const firstImg =
                  room.images && room.images.length > 0
                    ? room.images[0]
                    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

                return (
                  <div
                    key={room._id}
                    className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Image Column */}
                    <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
                      <img
                        src={firstImg}
                        alt={room.hotel?.name || "Hotel"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => navigate(`/rooms/${room._id}`)}
                      />
                      <button
                        onClick={() => toggleWishlist(room._id)}
                        aria-label="Wishlist"
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow hover:scale-110 active:scale-95 transition cursor-pointer"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            wishlisted
                              ? "fill-red-500 text-red-500"
                              : "fill-transparent text-gray-700"
                          }`}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                      </button>
                      <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white rounded-md">
                        {room.roomType}
                      </span>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
                              {room.hotel?.city || "Destination"}
                            </span>
                            <h2
                              onClick={() => navigate(`/rooms/${room._id}`)}
                              className="text-2xl font-playfair font-bold text-gray-900 group-hover:text-blue-600 transition cursor-pointer mt-0.5"
                            >
                              {room.hotel?.name || "Hotel"}
                            </h2>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-md">
                            <span className="text-amber-500">★</span>
                            <span>{(4.8 + ((idx * 3) % 3) * 0.1).toFixed(1)}</span>
                            <span className="text-gray-400 font-normal">
                              ({120 + idx * 25})
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <img src={assets.locationIcon} alt="" className="w-3.5 h-3.5 opacity-70" />
                          <span>{room.hotel?.address}</span>
                        </p>

                        {/* Amenities Chips */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {(room.amenities || []).map((amenity, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-100"
                            >
                              <img
                                src={facilityIcons[amenity] || assets.freeWifiIcon}
                                alt=""
                                className="w-3.5 h-3.5 opacity-75"
                              />
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Book Action */}
                      <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-xs text-emerald-600 font-medium block">
                            ✓ Free cancellation · Breakfast included
                          </span>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            ₹{Number(room.pricePerNight).toLocaleString()}
                            <span className="text-xs font-normal text-gray-500">
                              {" "}
                              / night
                            </span>
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/rooms/${room._id}`)}
                          className="px-6 py-2.5 bg-gray-950 hover:bg-blue-600 text-white font-medium text-sm rounded-xl transition shadow-sm hover:shadow-md cursor-pointer"
                        >
                          View Details & Book →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllRooms;
