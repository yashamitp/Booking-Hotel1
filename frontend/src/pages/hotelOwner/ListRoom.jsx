import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axiosClient from "../../api/axiosClient";

function ListRoom() {
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Fetch all rooms (could be modified to fetch only logged-in owner's rooms based on logic)
        const response = await axiosClient.get("/rooms/api");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleToggleAvailability = async (roomId, currentValue) => {
    try {
      await axiosClient.put(`/rooms/api/${roomId}`, {
        isAvailable: !currentValue,
      });
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, isAvailable: !currentValue } : room
        )
      );
    } catch (error) {
      console.error("Failed to update room availability:", error);
      alert("Could not update availability. Please try again.");
    }
  };

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms . Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium ">
                Price /night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.length === 0 ? (
               <tr>
                 <td colSpan="4" className="py-3 px-4 text-center">No rooms found.</td>
               </tr>
            ) : rooms.map((item, index) => (
              <tr key={item._id || index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities ? item.amenities.join(",") : ""}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 ">
                  ₹{item.pricePerNight}
                </td>
                <td className="py-3 px-4 text-center border-t border-gray-300 text-sm">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable ?? true}
                      onChange={() => handleToggleAvailability(item._id, item.isAvailable)}
                    />
                    <div className="w-12 h-7 bg-slate-400 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListRoom;
