import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axiosClient from "../api/axiosClient";
import { useUser } from "@clerk/clerk-react";

function MyBooking() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const response = await axiosClient.get(`/booking/api/user/${user.id}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
  }, [user]);

  return (
    <div className="py-28 md:pb-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Booking"
        subTitle="View and manage your bookings here. Keep track of your accommodations and make changes if needed.
        Plan your trip seamlessly with just a few clicks."
        align="left"
      />
      {/* Add booking management functionality here */}
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>
        {bookings.length === 0 ? (
          <p className="text-gray-500 mt-8">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className=" grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-4 md:py-6 text-gray-700"
            >
              {/* {Hotel details} */}
              <div className="flex flex-col md:flex-row ">
                <img
                  src={booking.room?.images?.[0] || assets.roomImg1}
                  alt=""
                  className="md:w-44 rounded shadow object-cover"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="font-playfair text-2xl">
                    {booking.hotel?.name}
                    <span className="font-inter text-sm">
                      ({booking.room?.roomType})
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={assets.locationIcon} alt="" />
                    <span>{booking.hotel?.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={assets.guestsIcon} alt="" />
                    <span>Guests : {booking.guests}</span>
                  </div>
                  <p className="text-base">Total :₹ {booking.totalPrice} </p>
                </div>
              </div>
              {/* {Date &  Timings} */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>
              {/* {Payment details} */}
              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-500"
                        : booking.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <p
                    className={`text-sm rounded-full ${
                      booking.status === "confirmed"
                        ? "text-green-500"
                        : booking.status === "cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {booking.status
                      ? booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)
                      : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBooking;
