import React from "react";

function AllRooms() {
  return <div>AllRooms</div>;
}

export default AllRooms;

// // AllRooms.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AllRooms({ filters = {} }) {
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);

//   // Fetch all rooms once
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(
//           "https://room-rental-app-0ap9.onrender.com/api/rooms",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (res.data.success) {
//           setRooms(res.data.rooms || []);
//           setFilteredRooms(res.data.rooms || []);
//         } else {
//           setRooms([]);
//           setFilteredRooms([]);
//         }
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//         setRooms([]);
//         setFilteredRooms([]);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // Apply filters when filters change
//   // Apply filters when filters change
//   useEffect(() => {
//     // If no filters are applied, just show all rooms
//     if (
//       !filters.location &&
//       !filters.budget &&
//       !filters.roomType &&
//       !filters.moveInDate
//     ) {
//       setFilteredRooms(rooms);
//       return;
//     }

//     // Otherwise, apply filters
//     let result = rooms;

//     // Location filter
//     if (filters.location) {
//       result = result.filter(
//         (room) =>
//           room.location &&
//           room.location.toLowerCase().includes(filters.location.toLowerCase())
//       );
//     }

//     // Budget filter
//     if (filters.budget) {
//       if (filters.budget === "12000+") {
//         result = result.filter((room) => room.price >= 12000);
//       } else {
//         const [min, max] = filters.budget.split("-").map(Number);
//         result = result.filter(
//           (room) => room.price >= min && room.price <= max
//         );
//       }
//     }

//     // Room Type filter
//     if (filters.roomType) {
//       result = result.filter((room) => room.roomType === filters.roomType);
//     }

//     // Move-in date
//     if (filters.moveInDate) {
//       result = result.filter(
//         (room) =>
//           room.availableFrom &&
//           new Date(room.availableFrom) >= new Date(filters.moveInDate)
//       );
//     }

//     setFilteredRooms(result);
//   }, [filters, rooms]);

//   return (
//     <div className="p-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-center">Available Rooms</h1>
//       {filteredRooms.length === 0 ? (
//         <p className="text-center text-gray-200">No rooms found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredRooms.map((room) => (
//             <div
//               key={room._id}
//               className="border-2 border-blue-500 rounded-lg shadow-md overflow-hidden bg-white"
//             >
//               <img
//                 src={room.imageUrl || "https://via.placeholder.com/400"}
//                 alt="Room"
//                 className="h-48 w-full object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="font-semibold text-lg text-indigo-600">
//                   {room.location}
//                 </h2>

//                 <p className="text-gray-700">
//                   <span className="font-medium">Price:</span> ₹{room.price}
//                 </p>
//                 <p className="text-gray-700 capitalize">
//                   <span className="font-medium">Type:</span> {room.roomType}
//                 </p>
//                 {room.owner && (
//                   <div className="mt-2 p-2 bg-gray-50 rounded">
//                     <p className="text-gray-800 font-medium">
//                       Owner: {room.owner.name}
//                     </p>
//                     <p className="text-gray-600 text-sm">
//                       Phone: {room.owner.phone || "N/A"}
//                     </p>
//                   </div>
//                 )}
//                 <p className="text-sm text-gray-500 mt-2">
//                   Added on {new Date(room.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AllRooms;
