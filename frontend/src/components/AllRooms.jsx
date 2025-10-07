import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  User,
  Home,
  Navigation,
  AlertCircle,
} from "lucide-react";

function AllRooms({ filters = null }) {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          "https://room-rental-app-0ap9.onrender.com/api/rooms",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setRooms(res.data.rooms);
          setFilteredRooms(res.data.rooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setLocationError(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError(true);
    }
  }, []);

  // Apply filters when filters or rooms change
  useEffect(() => {
    if (!filters) {
      setFilteredRooms(rooms);
      return;
    }

    let result = rooms;

    if (filters.location) {
      result = result.filter((room) =>
        room.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.budget) {
      if (filters.budget === "1500+") {
        result = result.filter((room) => room.price >= 9000);
      } else {
        const [min, max] = filters.budget.split("-").map(Number);
        result = result.filter(
          (room) => room.price >= min * 10 && room.price <= max * 10
        );
      }
    }

    if (filters.roomType) {
      result = result.filter((room) => room.roomType === filters.roomType);
    }

    if (filters.moveInDate) {
      result = result.filter(
        (room) =>
          room.availableFrom &&
          new Date(room.availableFrom) >= new Date(filters.moveInDate)
      );
    }

    setFilteredRooms(result);
  }, [filters, rooms]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const openMap = (lat, lng) => {
    if (!lat || !lng) {
      alert("Location coordinates not available for this room!");
      return;
    }

    const baseUrl = "https://www.google.com/maps";
    const url = userLocation
      ? `${baseUrl}/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`
      : `${baseUrl}/search/?api=1&query=${lat},${lng}`;

    window.open(url, "_blank");
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Please enable location access in your browser settings.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {locationError && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-0.5" size={20} />
          <div>
            <p className="text-amber-800 font-medium">
              Location access disabled
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Enable location to see distances and get directions to rooms.
            </p>
            <button
              onClick={requestLocation}
              className="mt-2 text-sm text-amber-900 underline hover:text-amber-700"
            >
              Enable location access
            </button>
          </div>
        </div>
      )}

      {filteredRooms.length === 0 ? (
        <div className="text-center py-20">
          <Home className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No rooms available
          </h2>
          <p className="text-gray-500">Try changing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const roomLat = room.owner?.location?.lat;
            const roomLng = room.owner?.location?.lng;

            const distance =
              userLocation &&
              roomLat &&
              roomLng &&
              calculateDistance(
                userLocation.lat,
                userLocation.lng,
                roomLat,
                roomLng
              );

            return (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-md overflow-hidden group"
              >
                <div className="relative h-56 bg-gray-200">
                  <img
                    src={
                      room.imageUrl ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"
                    }
                    alt="Room"
                    className="w-full h-full object-cover"
                  />
                  {distance && (
                    <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full shadow-lg text-sm font-semibold text-indigo-600">
                      {distance} km
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-xl font-bold">₹{room.price}</span>
                    <span className="text-xs ml-1 opacity-90">/month</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Home className="text-indigo-600" size={18} />
                    <span className="font-semibold text-gray-800 capitalize">
                      {room.roomType || "Room"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-500 mt-0.5" size={18} />
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {room.address || "Address not available"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="text-gray-500" size={16} />
                      <span className="text-sm text-gray-600">
                        Owner:{" "}
                        <span className="font-medium text-gray-800">
                          {room.owner?.name || "N/A"}
                        </span>
                      </span>
                    </div>
                    {room.owner?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="text-gray-500" size={16} />
                        <a
                          href={`tel:${room.owner.phone}`}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          {room.owner.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openMap(roomLat, roomLng)}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Navigation size={18} />
                    View on Map
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllRooms;
