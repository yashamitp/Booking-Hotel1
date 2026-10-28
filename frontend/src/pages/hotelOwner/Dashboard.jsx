import React, { useState, useEffect, useCallback } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import axiosClient from "../../api/axiosClient";
import { useAppContext } from "../../context/AppContext";

function Dashboard() {
  const { isAdmin, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, totalHotels: 0, pendingHotels: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user.id;
      const [bookingRes, hotelRes] = await Promise.all([
        isAdmin
          ? axiosClient.get("/booking/api")
          : axiosClient.get(`/booking/api/owner/${userId}`),
        isAdmin
          ? axiosClient.get("/hotels/api/admin/all")
          : axiosClient.get(`/hotels/api/owner/${userId}`),
      ]);

      const allBookings = Array.isArray(bookingRes.data) ? bookingRes.data : [];
      const allHotels = Array.isArray(hotelRes.data) ? hotelRes.data : [];

      const totalRev = allBookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
      const pendingCount = allHotels.filter((h) => h.status === "pending").length;

      setStats({
        totalBookings: allBookings.length,
        totalRevenue: totalRev,
        totalHotels: allHotels.length,
        pendingHotels: pendingCount,
      });

      setBookings([...allBookings].slice(0, 10));
      setHotels(allHotels);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axiosClient.patch(`/booking/api/${bookingId}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert("Could not update status. Please try again.");
    }
  };

  const handleHotelStatusChange = async (hotelId, newStatus) => {
    try {
      await axiosClient.patch(`/hotels/api/${hotelId}/status`, { status: newStatus });
      setHotels((prev) => {
        const updated = prev.map((h) =>
          h._id === hotelId ? { ...h, status: newStatus } : h
        );
        setStats((s) => ({
          ...s,
          pendingHotels: updated.filter((h) => h.status === "pending").length,
        }));
        return updated;
      });
    } catch (error) {
      console.error("Failed to update hotel status:", error);
      alert("Could not update hotel status.");
    }
  };

  const statusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const hotelStatusBadge = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700 border border-green-200";
    if (status === "rejected") return "bg-red-100 text-red-700 border border-red-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const pendingHotels = hotels.filter((h) => h.status === "pending");

  if (!user) return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 w-full md:w-[calc(100%-16rem)] px-4 flex items-center justify-center py-20">
      <p className="text-gray-500">Please sign in to view your dashboard.</p>
    </div>
  );

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 w-full md:w-[calc(100%-16rem)] px-4">
      <Title
        align="left"
        font="outfit"
        title={isAdmin ? "Admin Dashboard" : "My Dashboard"}
        subTitle={isAdmin ? "Monitor all hotels, bookings, revenue and manage hotel approvals." : "Track your hotel listings, bookings and revenue."}
      />

      {/* ── Stat Cards ── */}
      <div className="flex flex-wrap gap-4 my-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl flex p-5 pr-8 min-w-[200px] items-center gap-4">
          <img src={assets.totalBookingIcon} alt="" className="h-12 w-12 object-contain bg-blue-50 p-2 rounded-full hidden sm:block" />
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Total Bookings</p>
            <p className="text-gray-900 text-2xl font-bold mt-1">{loading ? "—" : stats.totalBookings}</p>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl flex p-5 pr-8 min-w-[200px] items-center gap-4">
          <img src={assets.totalRevenueIcon} alt="" className="h-12 w-12 object-contain bg-green-50 p-2 rounded-full hidden sm:block" />
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Total Revenue</p>
            <p className="text-gray-900 text-2xl font-bold mt-1">{loading ? "—" : `₹ ${stats.totalRevenue.toLocaleString()}`}</p>
          </div>
        </div>
        {isAdmin && (
          <>
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl flex p-5 pr-8 min-w-[200px] items-center gap-4">
              <div className="h-12 w-12 bg-purple-50 p-2 rounded-full hidden sm:flex items-center justify-center text-2xl">🏨</div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Total Hotels</p>
                <p className="text-gray-900 text-2xl font-bold mt-1">{loading ? "—" : stats.totalHotels}</p>
              </div>
            </div>
            <div className="bg-white shadow-sm border border-orange-100 rounded-xl flex p-5 pr-8 min-w-[200px] items-center gap-4">
              <div className="h-12 w-12 bg-orange-50 p-2 rounded-full hidden sm:flex items-center justify-center text-2xl">⏳</div>
              <div>
                <p className="text-orange-600 text-xs uppercase tracking-wide font-semibold">Pending Approvals</p>
                <p className="text-orange-700 text-2xl font-bold mt-1">{loading ? "—" : stats.pendingHotels}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Pending Hotel Approvals (Admin Only) ── */}
      {isAdmin && pendingHotels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg text-gray-800 font-semibold mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse inline-block"></span>
            Pending Hotel Approvals ({pendingHotels.length})
          </h2>
          <div className="bg-white border border-orange-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full whitespace-nowrap text-sm">
              <thead className="bg-orange-50 border-b border-orange-100">
                <tr>
                  <th className="py-3 px-4 text-gray-600 font-medium text-left">Hotel Name</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-left">City</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-left hidden sm:table-cell">Owner Email</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingHotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-orange-50/30 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">{hotel.name}</td>
                    <td className="py-3 px-4 text-gray-600">{hotel.city}</td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{hotel.ownerEmail || "—"}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleHotelStatusChange(hotel._id, "approved")}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleHotelStatusChange(hotel._id, "rejected")}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer"
                      >
                        ✗ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── All Hotels (owner's view) ── */}
      {!isAdmin && hotels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg text-gray-800 font-semibold mb-3">My Hotels ({hotels.length})</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full whitespace-nowrap text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-gray-600 font-medium text-left">Hotel Name</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-left">City</th>
                  <th className="py-3 px-4 text-gray-600 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">{hotel.name}</td>
                    <td className="py-3 px-4 text-gray-600">{hotel.city}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${hotelStatusBadge(hotel.status)}`}>
                        {hotel.status ? hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1) : "Approved"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Recent Bookings ── */}
      <h2 className="text-lg text-gray-800 font-semibold mb-4">Recent Bookings</h2>
      <div className="w-full text-left bg-white border border-gray-200 rounded-xl max-h-96 overflow-y-auto mb-10 shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">User Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">Hotel</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">Room</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">Total Price</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-gray-500">No bookings yet.</td></tr>
            ) : (
              bookings.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4 text-gray-800 font-medium">{item.userName || "Guest"}</td>
                  <td className="py-3 px-4 text-gray-600">{item.hotel?.name || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-600">{item.room?.roomType || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium text-center">₹ {item.totalPrice}</td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={item.status || "pending"}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      disabled={!isAdmin}
                      className={`text-xs font-medium rounded-full py-1 px-3 border-none outline-none ${isAdmin ? "cursor-pointer" : "cursor-default"} ${statusColor(item.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
