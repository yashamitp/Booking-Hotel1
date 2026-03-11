import React, { useEffect, useState, useMemo } from "react";
import Title from "../../components/Title";
import axiosClient from "../../api/axiosClient";

function ListHotel() {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchHotels = async () => {
    try {
      const response = await axiosClient.get("/hotels/api");
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const deleteHotel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await axiosClient.delete(`/hotels/api/${id}`);
      setHotels(hotels.filter((h) => h._id !== id));
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Failed to delete hotel.");
    }
  };

  // Derive unique cities for the filter dropdown
  const uniqueCities = useMemo(() => {
    const set = new Set(hotels.map((h) => h.city).filter(Boolean));
    return [...set].sort();
  }, [hotels]);

  // Apply name search + city filter
  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const matchesSearch =
        !searchQuery ||
        h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = !cityFilter || h.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [hotels, searchQuery, cityFilter]);

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 px-4 w-full md:w-[calc(100%-16rem)]">
      <Title
        align="left"
        font="outfit"
        title="Hotel Listings"
        subTitle="View, manage, or delete all listed hotels."
      />

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
        <input
          type="text"
          placeholder="Search by name or address…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400 transition shadow-sm"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400 transition shadow-sm bg-white"
        >
          <option value="">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {(searchQuery || cityFilter) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCityFilter("");
            }}
            className="text-xs text-red-500 hover:text-red-700 transition px-3 py-2 border border-red-200 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="w-full text-left bg-white border border-gray-200 rounded-lg overflow-y-auto mb-10 shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">Hotel Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">City</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left hidden sm:table-cell">Address</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredHotels.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  {hotels.length === 0 ? "No hotels found." : "No hotels match your search."}
                </td>
              </tr>
            ) : (
              filteredHotels.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.city}</td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell truncate max-w-[200px]">
                    {item.address || "—"}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => deleteHotel(item._id)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Result count */}
      {hotels.length > 0 && (
        <p className="text-xs text-gray-400 -mt-8 mb-6">
          Showing {filteredHotels.length} of {hotels.length} hotel{hotels.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default ListHotel;
