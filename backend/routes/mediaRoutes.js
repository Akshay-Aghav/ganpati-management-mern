const express = require("express");
const streamifier = require("streamifier");

const Media = require("../models/Media");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC - UPLOAD PHOTO / VIDEO
// =====================================================

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { uploaderName, caption } = req.body;

    if (!uploaderName) {
      return res.status(400).json({
        message: "Uploader name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a photo or video",
      });
    }

    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ganpati-memories",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const media = await Media.create({
      uploaderName,
      caption,
      mediaType,
      mediaUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      status: "Pending",
    });

    res.status(201).json({
      message: "Memory uploaded successfully. Waiting for admin approval.",
      media,
    });

  } catch (error) {
    console.error("Media upload error:", error);

    res.status(500).json({
      message: "Failed to upload media",
      error: error.message,
    });
  }
});


// =====================================================
// PUBLIC - GET APPROVED MEDIA
// =====================================================

router.get("/", async (req, res) => {
  try {
    const media = await Media.find({
      status: "Approved",
    }).sort({
      createdAt: -1,
    });

    res.json(media);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch gallery",
    });
  }
});


// =====================================================
// ADMIN - GET ALL MEDIA
// =====================================================

router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const media = await Media.find().sort({
      createdAt: -1,
    });

    res.json(media);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch media",
    });
  }
});


// =====================================================
// ADMIN - APPROVE / REJECT
// =====================================================

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    res.json({
      message: `Media ${status.toLowerCase()} successfully`,
      media,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update media status",
    });
  }
});


// =====================================================
// ADMIN - DELETE MEDIA
// =====================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found",
      });
    }

    await cloudinary.uploader.destroy(
      media.publicId,
      {
        resource_type:
          media.mediaType === "video"
            ? "video"
            : "image",
      }
    );

    await Media.findByIdAndDelete(req.params.id);

    res.json({
      message: "Media deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete media",
    });
  }
});


module.exports = router;