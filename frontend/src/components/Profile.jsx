import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import toast from "react-hot-toast";

function Profile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar (click to open/close profile menu) */}
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-gray-800 font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p>{user.role}</p>
            </div>
          </div>

          <hr className="my-3" />

          <button
            onClick={logout}
            className="w-full cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
