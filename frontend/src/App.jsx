import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import CreateRoom from "./components/CreateRoom";
import AllRooms from "./components/AllRooms";
import MyRooms from "./components/MyRooms";
import { Toaster } from "react-hot-toast";
import ContactUs from "./components/ContactUs";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/my-rooms" element={<MyRooms />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
App;
