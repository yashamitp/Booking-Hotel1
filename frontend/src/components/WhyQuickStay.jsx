import React from "react";
import { useAppContext } from "../context/AppContext";

function WhyQuickStay() {
  const { openHotelReg } = useAppContext();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Best Rate Guarantee",
      description: "Direct luxury tier pricing with zero hidden booking surcharges.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "24/7 Dedicated Concierge",
      description: "Round-the-clock bespoke assistance for transfers, itineraries, and requests.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Flexible Cancellation",
      description: "Plans change effortlessly with one-click free cancellation windows.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "100% Verified Luxury",
      description: "Handpicked properties inspected for architectural splendor and comfort.",
    },
  ];

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 bg-white">
      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100/80 hover:border-gray-200 hover:shadow-md transition flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h4 className="font-playfair font-bold text-lg text-gray-900 mb-1">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Partner Banner */}
      <div className="mt-14 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-blue-950 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl text-center md:text-left">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
            For Hoteliers & Property Owners
          </span>
          <h3 className="text-2xl sm:text-3xl font-playfair font-bold mt-1">
            Partner with QuickStay Luxury Network
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            List your luxury resort, heritage villa, or boutique hotel and connect with thousands of premium guests worldwide.
          </p>
        </div>

        <button
          onClick={openHotelReg}
          className="px-6 py-3 bg-white text-gray-900 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition shrink-0 cursor-pointer"
        >
          List Your Property →
        </button>
      </div>
    </section>
  );
}

export default WhyQuickStay;
