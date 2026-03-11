import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import axiosClient from "../../api/axiosClient";

function AddRoom() {
  const [hotels, setHotels] = useState([]);
  const [images, setImages] = useState([]);
  const [inputs, setInputs] = useState({
    hotelId: "",
    roomType: "",
    pricePerNight: "",
    totalRooms: 1,
    amenities: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all hotels to populate the dropdown
    const fetchHotels = async () => {
      try {
        const response = await axiosClient.get("/hotels/api");
        setHotels(response.data);
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      }
    };
    fetchHotels();
  }, []);

  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setInputs((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      if (isSelected) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  // Add images incrementally — don't replace existing ones
  const handleImageAdd = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        const filtered = newFiles.filter((f) => !existing.has(f.name));
        return [...prev, ...filtered].slice(0, 10);
      });
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrls = [];

    // Push files to upload route first if selected
    if (images.length > 0) {
      try {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));

        const uploadResponse = await axiosClient.post("/upload/api", formData, {
           headers: { "Content-Type": "multipart/form-data" }
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
      const payload = {
        hotel: inputs.hotelId,
        roomType: inputs.roomType,
        pricePerNight: Number(inputs.pricePerNight),
        totalRooms: Number(inputs.totalRooms),
        availableRooms: Number(inputs.totalRooms),
        amenities: inputs.amenities,
        images: uploadedUrls,
      };

      const response = await axiosClient.post("/rooms/api", payload);
      alert("Room Added Successfully!");
      setInputs({ hotelId: "", roomType: "", pricePerNight: "", totalRooms: 1, amenities: [] });
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("Failed to add Room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 ml-15 mt-20 md:ml-64 w-full md:w-[calc(100%-16rem)] px-4 sm:px-8">
      <form onSubmit={handleSubmit} className="w-full md:w-3/4 mx-auto my-10 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <Title
          align="left"
          font="outfit"
          title="Add Room"
          subTitle="Assign a new room to an existing hotel property."
        />

        <div className="w-full flex gap-4 mt-6">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700 text-sm">
                Room Images <span className="font-normal text-gray-400">({images.length}/10)</span>
              </p>
              {images.length > 0 && (
                <button type="button" onClick={() => setImages([])} className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
              )}
            </div>
            <div className="flex flex-wrap gap-3 items-start">
              {images.map((img, idx) => (
                <div key={idx} className="relative group h-24 w-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img src={URL.createObjectURL(img)} alt="preview" className="object-cover h-full w-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >✕</button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-[9px] text-center py-0.5">
                    {idx === 0 ? "Cover" : `Photo ${idx + 1}`}
                  </div>
                </div>
              ))}
              {images.length < 10 && (
                <label htmlFor="upload_images" className="h-24 w-24 flex flex-col items-center justify-center bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <img src={assets.uploadArea} alt="upload" className="w-7 opacity-60 mb-1" />
                  <span className="text-[10px] text-blue-600 font-medium">Add Photos</span>
                  <input id="upload_images" type="file" multiple accept="image/*" hidden onChange={handleImageAdd} />
                </label>
              )}
            </div>
            {images.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">First image will be used as the cover. Up to 10 photos.</p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <p className="text-gray-800 font-medium mb-2">Select Hotel</p>
              <select
                name="hotelId"
                required
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-blue-500 transition"
                value={inputs.hotelId}
                onChange={handleInput}
              >
                <option value="">-- Choose Hotel --</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name} - {hotel.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <p className="text-gray-800 font-medium mb-2">Room Type</p>
              <input
                type="text"
                name="roomType"
                required
                placeholder="e.g. Deluxe Suite"
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-blue-500 transition"
                value={inputs.roomType}
                onChange={handleInput}
              />
            </div>

            <div className="w-full">
              <p className="text-gray-800 font-medium mb-2">Price per Night</p>
              <input
                type="number"
                name="pricePerNight"
                required
                placeholder="e.g. 5000"
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-blue-500 transition"
                value={inputs.pricePerNight}
                onChange={handleInput}
              />
            </div>

            <div className="w-full">
              <p className="text-gray-800 font-medium mb-2">Total Rooms Available</p>
              <input
                type="number"
                name="totalRooms"
                required
                min={1}
                placeholder="e.g. 5"
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-blue-500 transition"
                value={inputs.totalRooms}
                onChange={handleInput}
              />
            </div>

          </div>

          <div>
            <p className="text-gray-800 font-medium mb-4 mt-2">Amenities</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Wifi", "AC", "Pool", "Parking", "TV", "Gym"].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-100 p-2 rounded hover:bg-blue-50/50 transition">
                  <input
                    type="checkbox"
                    className="accent-blue-600 w-4 h-4"
                    checked={inputs.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full md:w-48 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded mt-8 transition shadow active:scale-95">
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
}

export default AddRoom;
