import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // ✅ Import
import { Spinner } from "flowbite-react";
function CreateRoom() {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    location: "",
    roomType: "",
    image: null,
  });

  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("roomType", formData.roomType);
      data.append("image", formData.image);

      const res = await axios.post(
        "http://localhost:5000/api/rooms/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 || res.data.success) {
        console.log("Form Data Submitted:", formData);
        toast.success("Room created successfully", { duration: 2500 });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(res.data.message || "Error creating room", {
          duration: 2500,
        });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room", { duration: 2500 });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Create a New Room
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Price */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price in rupees"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter room location"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Room Type */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Room Type</label>
            <div className="flex gap-6">
              {["single", "double", "shared"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                    formData.roomType === type
                      ? "bg-indigo-100 border-indigo-400"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="roomType"
                    value={type}
                    checked={formData.roomType === type}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Room Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file:border-0 file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer hover:file:bg-indigo-700"
              required
            />
          </div>
          {/* Submit Button */}
          {loader ? (
            <div className="py-2 px-5 flex justify-center">
              <Spinner
                className="bg-indigo-600"
                color="red"
                aria-label="Success spinner example"
              />
            </div>
          ) : (
            <button
              disabled={loader}
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 py-3 px-5 rounded-lg text-white font-medium transition-colors mt-6"
            >
              Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
