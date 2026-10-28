import React from "react";
import Title from "./Title";
import { testimonials } from "../assets/assets";

function Testimonial() {
  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-gray-50/70 border-t border-gray-100">
      <Title
        title="What Our Discerning Guests Say"
        subTitle="Discover why travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5">
                <img
                  className="w-13 h-13 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h4 className="font-playfair text-lg font-bold text-gray-900 leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500">{testimonial.address}</p>
                </div>
              </div>

              {/* Star Rating & Verified Pill */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center text-amber-500 text-sm">
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)}
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ✓ Verified Stay
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed italic">
                "{testimonial.review}"
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-50 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Booked on QuickStay</span>
              <span>5-Star Luxury</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonial;
