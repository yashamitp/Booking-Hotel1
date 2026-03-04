import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import axiosClient from "../../api/axiosClient";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosClient.get("/booking/api");
        const allBookings = response.data;

        const totalRev = allBookings.reduce(
          (sum, current) => sum + current.totalPrice,
          0
        );

        setStats({
          totalBookings: allBookings.length,
          totalRevenue: totalRev,
        });

        setBookings(allBookings.reverse().slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axiosClient.patch(`/booking/api/${bookingId}/status`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert("Could not update status. Please try again.");
    }
  };

  const statusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 w-full md:w-[calc(100%-16rem)] px-4">
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue all in one place."
      />
      <div className="flex flex-col sm:flex-row gap-6 my-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg flex p-5 pr-8 min-w-[250px] items-center">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="h-12 w-12 object-contain bg-blue-50 p-2 rounded-full hidden sm:block"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Total Bookings
            </p>
            <p className="text-gray-900 text-2xl font-bold mt-1">
              {stats.totalBookings}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg flex p-5 pr-8 min-w-[250px] items-center">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="h-12 w-12 object-contain bg-green-50 p-2 rounded-full hidden sm:block"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Total Revenue
            </p>
            <p className="text-gray-900 text-2xl font-bold mt-1">
              ₹ {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-lg text-gray-800 font-semibold mb-4">
        Recent Bookings
      </h2>
      <div className="w-full text-left bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto mb-10 shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">
                User Name
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">
                Hotel
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">
                Room
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">
                Total Price
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No bookings available.
                </td>
              </tr>
            ) : (
              bookings.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {item.userName || "Guest"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.hotel?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.room?.roomType || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium text-center">
                    ₹ {item.totalPrice}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {/* Status dropdown — admin can change status */}
                    <select
                      value={item.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className={`text-xs font-medium rounded-full py-1 px-3 border-none outline-none cursor-pointer ${statusColor(
                        item.status
                      )}`}
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
