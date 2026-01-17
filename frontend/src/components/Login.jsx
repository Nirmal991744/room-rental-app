import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import toast from "react-hot-toast";
import { Spinner } from "flowbite-react";
function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful", { duration: 2500 });
        console.log("Login successful:", data);
        login(data.user, data.token);
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed", { duration: 2500 });
      }
    } catch (error) {
      console.log("signup error", error.message);
      toast.error("Something went wrong, try again! ❌", { duration: 2500 });
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

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        RoomFinder Authentication
      </h1>
      <div className="bg-white w-full max-w-md flex flex-col items-center rounded-lg shadow-lg p-8">
        <div className="text-2xl font-medium mb-2">🏠 RoomFinder</div>

        <h2 className="mt-5 text-xl text-gray-700 mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
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
              className="w-full bg-green-500 hover:bg-green-600 py-3 px-5 rounded-lg text-white font-medium transition-colors mt-6"
            >
              Login
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?
          <button
            className="ml-2 text-blue-500 hover:text-blue-600 underline cursor-pointer"
            onClick={goToSignup}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
