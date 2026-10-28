import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axiosClient from "../api/axiosClient";
import { useClerk } from "@clerk/clerk-react";

function HotelReg() {
  const { isHotelRegOpen, closeHotelReg, user, isAdmin, userEmail } = useAppContext();
  const { openSignIn } = useClerk();

  const [hotelName, setHotelName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Goa");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isHotelRegOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
        <div className="relative flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full">
          <button onClick={closeHotelReg} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer">✕</button>
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-4">🏨</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-sm text-gray-500 mb-6">Please sign in to list your property on QuickStay.</p>
          <button
            onClick={() => { closeHotelReg(); openSignIn(); }}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const defaultImg =
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

      await axiosClient.post("/hotels/api", {
        name: hotelName.trim(),
        contact: contact.trim(),
        address: address.trim(),
        city: city.trim(),
        ownerId: user?.id || "partner",
        ownerEmail: userEmail || user?.primaryEmailAddress?.emailAddress || "",
        images: [defaultImg],
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeHotelReg();
        // Reset form
        setHotelName("");
        setContact("");
        setAddress("");
      }, 2000);
    } catch (err) {
      console.error("Failed to register hotel:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to submit hotel registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-md:flex-col">
        {/* LEFT IMAGE / BRANDING */}
        <div className="relative hidden md:block w-5/12 bg-gray-900 text-white p-8 flex flex-col justify-between">
          <img
            src={assets.regImage}
            alt="Hotel"
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          />
          <div className="relative z-10">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
              QuickStay Partner Network
            </span>
            <h3 className="text-3xl font-playfair font-bold mt-2">
              Grow Your Hospitality Brand
            </h3>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Connect with discerning travelers from across the globe looking for
              authentic, boutique, and five-star luxury experiences.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 text-xs text-gray-300 space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Zero onboarding fees
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Real-time reservations & inventory
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> 24/7 dedicated partner assistance
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="relative flex flex-col w-full md:w-7/12 p-6 sm:p-10">
          {/* CLOSE BUTTON */}
          <button
            onClick={closeHotelReg}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            ✕
          </button>

          <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
            Partner Registration
          </span>
          <h2 className="text-2xl font-playfair font-bold text-gray-900 mt-1">
            List Your Hotel
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-6">
            Enter your property details below to get listed on QuickStay.
          </p>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-3 animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hotel Registered!</h3>
              <p className="text-xs text-gray-500 mt-1">
                {isAdmin
                  ? "Your property has been approved and is now live on QuickStay!"
                  : "Registration submitted! Our team will review your property within 24 hours and notify you via email."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* HOTEL NAME */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Hotel / Property Name *
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g. The Grand Palace Resort & Spa"
                  required
                />
              </div>

              {/* CONTACT PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {/* CITY */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    City / Destination *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                    required
                  >
                    {cities.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g. Sunset Boulevard, Candolim Beach"
                  required
                />
              </div>

              {/* IMAGE URL (OPTIONAL) */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Cover Photo URL <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-gray-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
              >
                {submitting ? "Submitting Registration..." : "Complete Hotel Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelReg;
