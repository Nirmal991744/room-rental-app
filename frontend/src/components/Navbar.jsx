import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Profile from "./Profile";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const seekerLinks = [
    { name: "Search", path: "/" },
    { name: "Featured", path: "/featured" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contactus" },
  ];

  const ownerLinks = [
    { name: "My Rooms", path: "/my-rooms" },
    { name: "Create Room", path: "/create-room" },
    { name: "All Rooms", path: "/rooms" },
  ];

  const navLinks = user?.role === "owner" ? ownerLinks : seekerLinks;

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-gray-800 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            🏠 <span className="text-indigo-600">RoomFinder</span>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium text-base"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Profile />
            ) : (
              <>
                <button
                  className="px-4 py-2 text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 transition-all font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all font-medium shadow-sm"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="py-4 space-y-6 border-t border-gray-100">
            {/* Mobile Navigation Links */}
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth/Profile Section */}
            <div className="pt-4 px-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-4">
                  {/* Profile Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-indigo-600">{user.role}</p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    className="w-full px-6 py-3 text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 transition-all font-medium"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all font-medium shadow-sm"
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
