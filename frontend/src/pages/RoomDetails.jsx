import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomCommonData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import axiosClient from "../api/axiosClient";
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axiosClient.get(`/rooms/api/${id}`);
        setRoom(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };
    fetchRoomDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      openSignIn();
      return;
    }

    if (!checkInDate || !checkOutDate || !guests) {
      alert("Please fill in all booking fields.");
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    setBookingLoading(true);
    try {
      await axiosClient.post("/booking/api", {
        hotel: room.hotel?._id,
        room: room._id,
        userId: user.id,
        userName: user.fullName || user.firstName || "Guest",
        email: user.primaryEmailAddress?.emailAddress || "",
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        totalPrice,
      });
      alert(`Booking confirmed! Total: ₹${totalPrice} for ${nights} night(s).`);
      setCheckInDate("");
      setCheckOutDate("");
      setGuests(1);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel ? room.hotel.name : "Unassigned"} {" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20%OFF
          </p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img className="" src={assets.locationIcon} alt="" />
          <span>{room.hotel ? room.hotel.address : ""}</span>
        </div>
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage || assets.roomImg1}
              alt=""
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images &&
              room.images.length > 1 &&
              room.images.map((images, index) => (
                <img
                  src={images}
                  key={index}
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === images && "outline-3 outline-orange-500"
                  }`}
                  onClick={() => setMainImage(images)}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like never before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities &&
                room.amenities.map((items, index) => (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100"
                    key={index}
                  >
                    <img
                      src={facilityIcons[items] || assets.freeWifiIcon}
                      alt=""
                      className="w-5 h-5 "
                    />
                    <p className="text-xs">{items}</p>
                  </div>
                ))}
            </div>
          </div>
          <p className="text-2xl font-medium">₹{room.pricePerNight}</p>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleBooking}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col ">
              <label className=" font-medium" htmlFor="checkInDate">
                Check-in
              </label>
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label className="font-medium" htmlFor="checkOutDate">
                Check-out
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-1.5 md:mt-6">
              <label className=" font-medium " htmlFor="guests">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mt-1.5 outline-none"
                placeholder="0"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
          </div>
          <button
            type="submit"
            disabled={bookingLoading}
            className="bg-primary hover:bg-primary-dull active:scale-95
     transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-15 py-3 md:py-4 text-base cursor-pointer disabled:opacity-60"
          >
            {bookingLoading ? "Booking..." : "Check availability"}
          </button>
        </form>

        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2 ">
              <img src={spec.icon} alt="" className="w-6" />
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guest will be allocated on the ground floor according to
            availability. Special requests cannot be guaranteed, but the hotel
            will do its best to accommodate them, subject to availability at
            check-in. Please note that the hotel may charge a fee for this
            service. The price shown is for 1 room per night for the selected
            number of guests. Extra person charges may apply and vary depending
            on the hotel's policy. Please check the hotel's website or contact
            the hotel for more information.
          </p>
        </div>

        {/* {hosted by} */}

        <div className="flex flex-col items-start gap-4 ">
          <div className="flex gap-4">
            <img
              src={
                room.hotel?.owner?.image ||
                "https://images.unsplash.com/photo-1597065758344-313ad541ca7a?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="owner"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted By {room.hotel?.name} </p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2"> 200+ Reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact now
          </button>
        </div>
      </div>
    )
  );
}

export default RoomDetails;
