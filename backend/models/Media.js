const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    uploaderName: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Media", mediaSchema);