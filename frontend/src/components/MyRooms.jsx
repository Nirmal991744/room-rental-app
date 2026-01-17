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
      const res = await axios.get("http://localhost:5000/api/rooms/my-rooms", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        setRooms(res.data.rooms || []);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const handleConfirmBooking = async (roomId, requestId) => {
    if (!window.confirm("Are you sure you want to confirm this booking?"))
      return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/confirm-booking/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        toast.success("Booking confirmed! Room is now booked.");
        fetchRooms(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    }
  };

  const handleRejectBooking = async (roomId, requestId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/reject-booking/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        toast.success("Booking request rejected");
        fetchRooms(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject booking");
    }
  };

  const handleCancelBooking = async (roomId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking and make the room available again?"
      )
    )
      return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/cancel-booking`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        toast.success("Booking cancelled. Room is now available.");
        fetchRooms();
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">My Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-200">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              <img
                src={room.imageUrl || "https://via.placeholder.com/400"}
                alt="Room"
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-lg text-indigo-600">
                    {room.address}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      room.status === "booked"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {room.status === "booked" ? "Booked" : "Available"}
                  </span>
                </div>

                <p className="text-gray-700">
                  <span className="font-medium">Price:</span> ₹{room.price}
                </p>
                <p className="text-gray-700 capitalize">
                  <span className="font-medium">Type:</span> {room.roomType}
                </p>

                {room.bookedBy && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Booked by:</span>{" "}
                      {room.bookedBy.name}
                    </p>
                    {room.bookedBy.phone && (
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Phone:</span>{" "}
                        {room.bookedBy.phone}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Added on {new Date(room.createdAt).toLocaleDateString()}
                </p>

                {/* Booking Requests Section */}
                {room.bookingRequests && room.bookingRequests.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Booking Requests (
                      {
                        room.bookingRequests.filter(
                          (req) => req.status === "pending"
                        ).length
                      }{" "}
                      pending)
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {room.bookingRequests
                        .filter((req) => req.status === "pending")
                        .map((request) => (
                          <div
                            key={request._id}
                            className="bg-amber-50 p-2 rounded text-sm"
                          >
                            <p className="text-gray-800 font-medium">
                              {request.user?.name || "User"}
                            </p>
                            {request.user?.phone && (
                              <p className="text-gray-600 text-xs">
                                {request.user.phone}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(
                                request.requestedAt
                              ).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() =>
                                  handleConfirmBooking(room._id, request._id)
                                }
                                className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectBooking(room._id, request._id)
                                }
                                className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  {room.status === "booked" ? (
                    <button
                      onClick={() => handleCancelBooking(room._id)}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRooms;
