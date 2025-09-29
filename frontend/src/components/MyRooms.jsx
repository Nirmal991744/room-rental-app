import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MyRooms() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    fetchRooms();
  }, []);
  const fetchRooms = async () => {
    try {
      const res = await axios.get(
        "https://room-rental-app-0ap9.onrender.com/api/rooms/my-rooms",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Handle the response properly
      if (res.data.success) {
        setRooms(res.data.rooms || []);
      } else {
        console.error("API returned success: false");
        setRooms([]);
      }
    } catch (error) {
      console.error(
        "Error fetching rooms:",
        error.response?.data || error.message
      );
      setRooms([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(
        `https://room-rental-app-0ap9.onrender.com/api/rooms/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Remove deleted room from state
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));
      toast.success("Room deleted successfully", { duration: 2500 });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room", { duration: 2500 });
    }
  };
  return (
    <div className="p-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Rooms</h1>
      {rooms.length === 0 ? (
        <p className="text-center text-gray-200">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              {/* Room Image */}
              <img
                src={room.imageUrl || "https://via.placeholder.com/400"}
                alt="Room"
                className="h-48 w-full object-cover"
              />

              {/* Room Info */}
              <div className="p-4">
                <h2 className="font-semibold text-lg text-indigo-600">
                  {room.location}
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Price:</span> ₹{room.price}
                </p>
                <p className="text-gray-700 capitalize">
                  <span className="font-medium">Type:</span> {room.roomType}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Added on {new Date(room.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRooms;
