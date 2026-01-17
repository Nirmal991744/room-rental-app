const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { auth, isOwner } = require("../middleware/auth.js");
const Room = require("../models/Room.js");
const upload = require("../config/multerConfig.js");

const router = express.Router();

// Create room
router.post(
  "/create",
  auth,
  isOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const { price, roomType, address } = req.body;

      if (!price || !address || !roomType || !req.file) {
        return res.status(400).json({
          success: false,
          message: "price, address, image, and roomType are required",
        });
      }

      const newRoom = await Room.create({
        price,
        address,
        roomType,
        imageUrl: req.file.path,
        owner: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: "Room created",
        room: newRoom,
      });
    } catch (error) {
      console.error("❌ Room creation error:", error.stack || error);
      return res.status(500).json({
        success: false,
        message: "Server error during room creation",
        error: error.message,
      });
    }
  }
);

// Get owner's rooms with booking requests
router.get("/my-rooms", auth, isOwner, async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id })
      .populate("owner", "name email")
      .populate("bookingRequests.user", "name email phone")
      .populate("bookedBy", "name email phone")
      .sort({ createdAt: -1 });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found for this owner",
      });
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get owner rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching owner rooms",
    });
  }
});

// Delete room
router.delete("/:id", auth, isOwner, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "rooms id is required",
      });
    }
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this room",
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during deleting room",
    });
  }
});

// Request to book a room (for users) - FIXED
router.post("/:id/request-booking", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Owner cannot book their own room
    if (room.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot book your own room",
      });
    }

    // Room must be available
    if (room.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Room already booked",
      });
    }

    // Check if user already has a pending request
    // FIXED: Changed variable name from 'req' to 'bookingReq' to avoid conflict
    const existingRequest = room.bookingRequests.find(
      (bookingReq) =>
        bookingReq.user.toString() === req.user._id.toString() &&
        bookingReq.status === "pending"
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending booking request for this room",
      });
    }

    // Add booking request
    room.bookingRequests.push({
      user: req.user._id,
      status: "pending",
    });

    await room.save();

    res.status(200).json({
      success: true,
      message: "Booking request sent successfully",
      room,
    });
  } catch (error) {
    console.error("Booking request error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during booking request",
      error: error.message, // Added error message for debugging
    });
  }
});

// Confirm booking request (for owners)
router.post(
  "/:roomId/confirm-booking/:requestId",
  auth,
  isOwner,
  async (req, res) => {
    try {
      const { roomId, requestId } = req.params;

      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      // Check if user is the owner
      if (room.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to confirm bookings for this room",
        });
      }

      // Find the booking request
      const bookingRequest = room.bookingRequests.id(requestId);

      if (!bookingRequest) {
        return res.status(404).json({
          success: false,
          message: "Booking request not found",
        });
      }

      if (bookingRequest.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "This request has already been processed",
        });
      }

      // Confirm the booking
      bookingRequest.status = "confirmed";
      room.status = "booked";
      room.bookedBy = bookingRequest.user;

      // Reject all other pending requests
      // FIXED: Changed variable name to avoid conflict
      room.bookingRequests.forEach((bookingReq) => {
        if (
          bookingReq._id.toString() !== requestId &&
          bookingReq.status === "pending"
        ) {
          bookingReq.status = "rejected";
        }
      });

      await room.save();

      res.status(200).json({
        success: true,
        message: "Booking confirmed successfully",
        room,
      });
    } catch (error) {
      console.error("Confirm booking error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during booking confirmation",
      });
    }
  }
);

// Reject booking request (for owners)
router.post(
  "/:roomId/reject-booking/:requestId",
  auth,
  isOwner,
  async (req, res) => {
    try {
      const { roomId, requestId } = req.params;

      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      // Check if user is the owner
      if (room.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to reject bookings for this room",
        });
      }

      // Find the booking request
      const bookingRequest = room.bookingRequests.id(requestId);

      if (!bookingRequest) {
        return res.status(404).json({
          success: false,
          message: "Booking request not found",
        });
      }

      if (bookingRequest.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "This request has already been processed",
        });
      }

      bookingRequest.status = "rejected";
      await room.save();

      res.status(200).json({
        success: true,
        message: "Booking request rejected",
        room,
      });
    } catch (error) {
      console.error("Reject booking error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during booking rejection",
      });
    }
  }
);

// Cancel booking (make room available again)
router.post("/:id/cancel-booking", auth, isOwner, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is the owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (room.status === "available") {
      return res.status(400).json({
        success: false,
        message: "Room is not booked",
      });
    }

    room.status = "available";
    room.bookedBy = null;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled, room is now available",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
    });
  }
});

// Get all rooms
router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate("owner", "name phone email role location")
      .populate("bookedBy", "name email phone")
      .sort({ createdAt: -1 });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "no room founds",
      });
    }
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get all rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get nearby rooms
router.get("/nearby", auth, async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query;

    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: distance,
        },
      },
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Nearby rooms error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
