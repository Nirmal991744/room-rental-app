import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Request location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success("Location access granted ✓", { duration: 2000 });
        },
        (error) => {
          setLocationError(true);
          toast.error(
            "Location permission denied. Please enable location access.",
            {
              duration: 4000,
            }
          );
        }
      );
    } else {
      setLocationError(true);
      toast.error("Geolocation is not supported by your browser", {
        duration: 4000,
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Location access is required for signup", { duration: 3000 });
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      phone: formData.phone,
      lat: location.latitude,
      lng: location.longitude,
    };

    try {
      const res = await fetch(
        "https://room-rental-app-0ap9.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful", { duration: 2500 });
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed", { duration: 2500 });
      }
    } catch (err) {
      toast.error("Something went wrong during signup", { duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const requestLocationAgain = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(false);
        toast.success("Location access granted ✓", { duration: 2000 });
      },
      (error) => {
        toast.error("Location permission denied", { duration: 3000 });
      }
    );
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        RoomFinder Authentication
      </h1>
      <div className="bg-white w-full max-w-md flex flex-col items-center rounded-lg shadow-lg p-8">
        <div className="text-2xl font-medium mb-2">🏠 RoomFinder</div>

        <h2 className="mt-5 text-xl text-gray-700 mb-6">Create Your Account</h2>

        {/* Location status indicator */}
        {locationError && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 mb-2">
              📍 Location access is required for signup
            </p>
            <button
              type="button"
              onClick={requestLocationAgain}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Request location access again
            </button>
          </div>
        )}

        {location && (
          <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">✓ Location access granted</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 hover:border-green-400 focus:border-green-500 focus:outline-none p-3"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 hover:border-green-400 focus:border-green-500 focus:outline-none p-3"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 hover:border-green-400 focus:border-green-500 focus:outline-none p-3"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange("password")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="seeker"
                  checked={role === "seeker"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                  required
                />
                <span>Room Seeker</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                  required
                />
                <span>Room Owner</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 hover:border-green-400 focus:border-green-500 focus:outline-none p-3"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              required
            />
          </div>

          {loading ? (
            <div className="py-2 px-5 flex justify-center">
              <Spinner
                className="bg-indigo-600"
                color="red"
                aria-label="Success spinner example"
              />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!location}
              className={`w-full py-3 px-5 rounded-lg text-white font-medium transition-colors mt-6 ${
                location
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Sign Up
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <button
            className="ml-2 text-blue-500 hover:text-blue-600 underline cursor-pointer"
            onClick={goToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
