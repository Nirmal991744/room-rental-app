import React, { useState } from "react";
import AllRooms from "./AllRooms";

function Home() {
  const [filters, setfilters] = useState({
    location: "",
    budget: "",
    roomType: "",
    moveInDate: "",
  });

  const handleChange = (e) => {
    setfilters({ ...filters, [e.target.id]: e.target.value });
  };
  return (
    <div className="flex flex-col items-center w-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen">
      {/* Hero Section */}
      <div className="text-center px-4 mt-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Find Your Perfect Room
        </h1>
        <p className="text-sm md:text-base">
          Discover comfortable, affordable rooms in your desired location
        </p>
      </div>

      {/* Search Box */}
      <div className="w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-2xl bg-white text-gray-900 p-6 md:p-10 flex flex-col items-center mt-10">
        <h1 className="font-medium text-xl md:text-2xl text-center">
          Search Rooms
        </h1>

        {/* Form Inputs */}
        <div className="flex flex-col md:flex-row flex-wrap gap-5 mt-6 w-full justify-center items-center">
          {/* Location */}
          <div className="flex flex-col w-full md:w-[45%] lg:w-auto">
            <label htmlFor="location" className="mb-1 text-sm font-medium">
              Location
            </label>
            <input
              className="px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none transition w-full"
              type="text"
              id="location"
              placeholder="Enter city or area"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col w-full md:w-[45%] lg:w-auto">
            <label htmlFor="budget" className="mb-1 text-sm font-medium">
              Max Budget
            </label>
            <select
              className="px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none transition w-full"
              id="budget"
              value={filters.budget}
              onChange={handleChange}
            >
              <option value="">Select budget range</option>
              <option value="0-500">₹2000 - ₹4000</option>
              <option value="500-1000">₹4000 - ₹6000</option>
              <option value="1000-1500">₹6000 - ₹9000</option>
              <option value="1500+">₹9000+</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="flex flex-col w-full md:w-[45%] lg:w-auto">
            <label htmlFor="roomType" className="mb-1 text-sm font-medium">
              Room Type
            </label>
            <select
              className="px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none transition w-full"
              id="roomType"
              value={filters.roomType}
              onChange={handleChange}
            >
              <option value="">Select room type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          {/* Move-In-Date */}
          <div className="flex flex-col w-full md:w-[45%] lg:w-auto">
            <label htmlFor="moveInDate" className="mb-1 text-sm font-medium">
              Move-In Date
            </label>
            <input
              type="date"
              id="moveInDate"
              className="px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none transition w-full"
              value={filters.moveInDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Search Button */}
        <button className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition shadow-md">
          🔍 Search Rooms
        </button>
      </div>
      <AllRooms filters={filters}></AllRooms>
    </div>
  );
}

export default Home;
