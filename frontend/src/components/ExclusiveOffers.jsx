import React, { useState } from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const couponMap = {
  1: "QUICKSTAY20",
  2: "FIRSTSTAY",
  3: "LUXURY10",
};

function ExclusiveOffers() {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCoupon = (id, code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-gradient-to-b from-white to-gray-50/50">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Member Offers"
          subTitle="Take advantage of our limited-time luxury packages and seasonal promotions to elevate your next retreat."
        />
        <button
          onClick={() => {
            navigate("/rooms");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-2 font-semibold text-sm text-gray-800 hover:text-blue-600 transition cursor-pointer max-md:mt-6"
        >
          <span>View All Stays</span>
          <img
            src={assets.arrowIcon}
            alt="arrow"
            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
        {exclusiveOffers.map((item) => {
          const promoCode = couponMap[item._id] || "QUICKSTAY20";
          const isCopied = copiedId === item._id;

          return (
            <div
              key={item._id}
              onClick={() => {
                navigate("/rooms");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl text-white bg-cover bg-center overflow-hidden min-h-[360px] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover:opacity-90 transition-opacity" />

              {/* Discount Badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-3.5 py-1 text-xs font-bold bg-white text-gray-900 rounded-full shadow-md uppercase tracking-wider">
                  {item.priceOff}% OFF
                </span>
                <span className="text-[11px] text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                  Expires {item.expiryDate}
                </span>
              </div>

              {/* Offer Details & Promo Code Box */}
              <div className="relative z-10 mt-auto pt-6">
                <h3 className="text-2xl font-bold font-playfair leading-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Promo Code Pill with Copy Action */}
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between gap-2">
                  <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                    <span className="text-[10px] text-gray-300 font-mono uppercase">
                      Code:
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider text-yellow-300">
                      {promoCode}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleCopyCoupon(item._id, promoCode, e)}
                    className="px-3 py-1.5 rounded-xl bg-white text-gray-900 hover:bg-yellow-400 hover:text-gray-900 text-xs font-semibold shadow transition cursor-pointer"
                  >
                    {isCopied ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ExclusiveOffers;
