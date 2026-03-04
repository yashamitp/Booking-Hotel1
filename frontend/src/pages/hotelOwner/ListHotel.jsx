import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axiosClient from "../../api/axiosClient";

function ListHotel() {
  const [hotels, setHotels] = useState([]);
  
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
    try {
      await axiosClient.delete(`/hotels/api/${id}`);
      setHotels(hotels.filter(h => h._id !== id));
      alert("Hotel deleted successfully.");
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  }

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 px-4 w-full md:w-[calc(100%-16rem)]">
      <Title
        align="left"
        font="outfit"
        title="Hotel Listings"
        subTitle="View, edit, or manage all listed hotels."
      />
      <div className="w-full text-left bg-white border border-gray-200 rounded-lg overflow-y-auto mb-10 shadow-sm mt-8">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">Hotel Name</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-left">City</th>
              <th className="py-3 px-4 text-gray-600 font-medium text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {hotels.length === 0 ? (
               <tr>
                 <td colSpan="3" className="py-8 text-center text-gray-500">No hotels found.</td>
               </tr>
            ) : hotels.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-gray-800">{item.name}</td>
                <td className="py-3 px-4 text-gray-600">{item.city}</td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button onClick={() => deleteHotel(item._id)} className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-100 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListHotel;
