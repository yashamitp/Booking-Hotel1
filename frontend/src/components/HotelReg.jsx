import React from "react";
import { assets, cities } from "../assets/assets";

function HotelReg() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form className="relative flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-md:mx-4">

        {/* LEFT IMAGE */}
        <img
          src={assets.regImage}
          alt="Hotel"
          className="hidden md:block w-1/2 object-cover"
        />

        {/* RIGHT FORM */}
        <div className="relative flex flex-col w-full md:w-1/2 p-8 md:p-10">

          {/* CLOSE BUTTON */}
          <img
            src={assets.closeIcon}
            alt="close"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100 transition"
          />

          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Register Your Hotel
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            List your hotel and start receiving bookings
          </p>

          {/* HOTEL NAME */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium text-gray-600">
              Hotel Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Grand Palace Hotel"
              required
            />
          </div>

          {/* PHONE */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="+91 9876543210"
              required
            />
          </div>

          {/* ADDRESS */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Street, Area"
              required
            />
          </div>

          {/* CITY */}
          <div className="w-full mb-6">
            <label className="text-sm font-medium text-gray-600">
              City
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="">Select city</option>
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-auto bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Register Hotel 
          </button>
        </div>
      </form>
    </div>
  );
}

export default HotelReg;
