import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function AddHotel() {
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [hotelData, setHotelData] = useState({
    name: "",
    city: "",
    address: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  // Add newly selected files to the existing list (don't replace)
  const handleImageAdd = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        const filtered = newFiles.filter((f) => !existing.has(f.name));
        return [...prev, ...filtered].slice(0, 10); // max 10
      });
      e.target.value = "";
    }
  };

  // Remove a single image by index
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHotel = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrls = [];

    if (images.length > 0) {
      try {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        const uploadResponse = await axiosClient.post("/upload/api", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (uploadResponse.data.success) {
          uploadedUrls = uploadResponse.data.imageUrls;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        alert("Image upload failed");
        setLoading(false);
        return;
      }
    }

    try {
      await axiosClient.post("/hotels/api", {
        ...hotelData,
        images: uploadedUrls,
        ownerId: user?.id || "admin",
      });
      alert("Hotel Added Successfully");
      navigate("/owner/list-hotel");
    } catch (error) {
      console.error("Hotel creation failed", error);
      alert("Failed to add Hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 w-full md:w-[calc(100%-16rem)] px-4 sm:px-8">
      <Title
        title="Add Hotel"
        subTitle="Register a new Hotel Property"
        align="left"
        font="outfit"
      />
      <div className="md:w-3/4 mx-auto w-full my-10 bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
        <form onSubmit={submitHotel} className="flex flex-col gap-6">
          {/* ── Image Picker ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700 text-sm">
                Hotel Images{" "}
                <span className="font-normal text-gray-400">
                  ({images.length}/10)
                </span>
              </p>
              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-start">
              {/* Previews */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group h-24 w-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="object-cover h-full w-full"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-[9px] text-center py-0.5 truncate px-1">
                    {idx === 0 ? "Cover" : `Photo ${idx + 1}`}
                  </div>
                </div>
              ))}

              {/* Add more button (hidden if at limit) */}
              {images.length < 10 && (
                <label
                  htmlFor="hotel_images"
                  className="h-24 w-24 flex flex-col items-center justify-center bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                >
                  <img
                    src={assets.uploadArea}
                    alt="upload"
                    className="w-7 opacity-60 mb-1"
                  />
                  <span className="text-[10px] text-blue-600 font-medium">
                    Add Photos
                  </span>
                  <input
                    id="hotel_images"
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageAdd}
                  />
                </label>
              )}
            </div>

            {images.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                First image will be used as the cover photo. Up to 10 photos
                allowed.
              </p>
            )}
          </div>

          {/* ── Text Fields ── */}
          <div className="w-full">
            <p className="text-gray-700 font-medium text-sm mb-2">Hotel Name</p>
            <input
              required
              type="text"
              name="name"
              onChange={handleInput}
              placeholder="e.g. Grand Plaza Hotel"
              className="w-full sm:w-80 px-4 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-blue-500 transition shadow-sm text-gray-800"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full">
              <p className="text-gray-700 font-medium text-sm mb-2">City</p>
              <input
                required
                type="text"
                name="city"
                onChange={handleInput}
                placeholder="Mumbai"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-blue-500 transition shadow-sm text-gray-800"
              />
            </div>
            <div className="w-full">
              <p className="text-gray-700 font-medium text-sm mb-2">Contact</p>
              <input
                required
                type="text"
                name="contact"
                onChange={handleInput}
                placeholder="+91 99999 99999"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-blue-500 transition shadow-sm text-gray-800"
              />
            </div>
          </div>

          <div className="w-full">
            <p className="text-gray-700 font-medium text-sm mb-2">
              Full Address
            </p>
            <textarea
              required
              name="address"
              onChange={handleInput}
              placeholder="123 Example Street, Mumbai"
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded p-4 outline-none focus:border-blue-500 transition shadow-sm text-gray-800 resize-none"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition shadow-md mt-2 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddHotel;
