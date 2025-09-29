const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { auth, isOwner } = require("../middleware/auth.js");
const Room = require("../models/Room.js");
const upload = require("../config/multerConfig.js"); // ✅ clean import

const router = express.Router();

router.post(
  "/create",
  auth,
  isOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const { price, location, roomType } = req.body;

      if (!price || !location || !roomType || !req.file) {
        return res.status(400).json({
          success: false,
          message: "price, location, image, and roomType are required",
        });
      }

      const newRoom = await Room.create({
        price,
        location,
        roomType,
        imageUrl: req.file.path, // ✅ Cloudinary URL
        owner: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: "Room created",
        room: newRoom,
      });
    } catch (error) {
      console.error("Room creation error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error during room creation" });
    }
  }
);

router.get("/my-rooms", auth, isOwner, async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id })
      .populate("owner", "name email") // optional: show owner info
      .sort({ createdAt: -1 }); // latest first

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
    console.error("Resgistration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during deleting room",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("owner", "name image phone");

    console.log(rooms);

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "no room founds",
      });
    }
    res.status(201).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
