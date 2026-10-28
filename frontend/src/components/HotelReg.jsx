import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axiosClient from "../api/axiosClient";
import { useClerk } from "@clerk/clerk-react";

function HotelReg() {
  const {
    isHotelRegOpen,
    closeHotelReg,
    user,
    isAdmin,
    userEmail,
    checkHotelPermission,
  } = useAppContext();
  const { openSignIn } = useClerk();

  const [hotelName, setHotelName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [amenities, setAmenities] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isHotelRegOpen) return null;

  // Unauthenticated guests must sign in first
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
        <div className="relative flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full">
          <button
            onClick={closeHotelReg}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            ✕
          </button>
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-4">
            🏨
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please sign in to register and list your property on QuickStay.
          </p>
          <button
            onClick={() => {
              closeHotelReg();
              openSignIn();
            }}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition text-sm cursor-pointer shadow-md"
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

      const parsedAmenities = amenities
        ? amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : ["Free WiFi", "Air Conditioning", "24/7 Front Desk"];

      const payload = {
        name: hotelName.trim(),
        contact: contact.trim(),
        address: address.trim(),
        city: city.trim(),
        propertyType: propertyType.trim() || "Luxury Hotel",
        pricePerNight: Number(pricePerNight) || 3500,
        amenities: parsedAmenities,
        description: description.trim(),
        ownerId: user.id,
        ownerEmail: userEmail || user.primaryEmailAddress?.emailAddress || "",
        images: [defaultImg],
      };

      await axiosClient.post("/hotels/api", payload);

      // Re-check hotel permissions so dashboard updates if immediately approved
      try {
        if (checkHotelPermission) {
          await checkHotelPermission();
        }
      } catch (checkErr) {
        console.warn("Permission refresh warning:", checkErr);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeHotelReg();
        // Reset form
        setHotelName("");
        setContact("");
        setAddress("");
        setCity("");
        setPropertyType("");
        setPricePerNight("");
        setAmenities("");
        setDescription("");
        setImageUrl("");
      }, 2500);
    } catch (err) {
      console.error("Failed to register hotel:", err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit hotel registration. Please try again.";
      setErrorMsg(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden max-md:flex-col">
        {/* LEFT IMAGE / BRANDING */}
        <div className="relative hidden md:flex w-5/12 bg-gray-900 text-white p-8 flex-col justify-between">
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
              List Any Property
            </h3>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Register any destination, resort, villa, or boutique stay of your
              choice. Submissions are reviewed by our platform admin.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 text-xs text-gray-300 space-y-2.5">
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Free choice of destination & city
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Admin approval ensures high stay quality
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Instant private dashboard upon approval
            </p>
          </div>
        </div>

        {/* RIGHT FORM (SCROLLABLE) */}
        <div className="relative flex flex-col w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
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
            List Your Property
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-5">
            Provide your property details. Once approved by the platform admin, your owner dashboard will be activated.
          </p>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-3 animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isAdmin ? "Property Published!" : "Registration Submitted!"}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mt-2 leading-relaxed">
                {isAdmin
                  ? "Your property has been approved and is now active across QuickStay."
                  : "Your registration is awaiting admin review and approval. Once approved, your owner dashboard will appear in the navigation bar!"}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g. The Grand Palace Resort & Spa"
                  required
                />
              </div>

              {/* PLACE / CITY (FREE TEXT INPUT, NO DROPDOWN) & CONTACT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Place / City of Your Choice *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="e.g. Manali, Udaipur, Bali, London..."
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Full Street Address / Location *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g. Sunset Road, Near Candolim Beach"
                  required
                />
              </div>

              {/* PROPERTY TYPE & PRICE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Property Type
                  </label>
                  <input
                    type="text"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="e.g. Luxury Resort, Villa, Boutique Hotel..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Starting Price / Night (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    placeholder="e.g. 4500"
                  />
                </div>
              </div>

              {/* AMENITIES */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Amenities & Highlights <span className="font-normal text-gray-400">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="e.g. Swimming Pool, Free Breakfast, Spa, Ocean View, WiFi"
                />
              </div>

              {/* IMAGE URL */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Cover Photo Image URL <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  About Your Stay <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  placeholder="Tell guests about your property's experience, views, and specialties..."
                ></textarea>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-gray-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
              >
                {submitting ? "Submitting Registration..." : "Submit Property for Approval"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelReg;
