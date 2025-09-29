const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true, min: 0 },
    location: {
      type: String,
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
