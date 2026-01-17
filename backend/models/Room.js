const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true, min: 0 },
    address: { type: String, required: true },
    roomType: {
      type: String,
      enum: ["single", "double", "shared"],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    bookingRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "rejected"],
          default: "pending",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
