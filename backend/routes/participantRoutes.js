const express = require("express");
const router = express.Router();

const Participant = require("../models/Participant");

// =====================================
// GET: Get all participants
// URL: /api/participants
// =====================================
router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find().sort({
      createdAt: -1,
    });

    res.json(participants);
  } catch (error) {
    console.error("Fetch participants error:", error.message);

    res.status(500).json({
      message: "Failed to fetch participants",
      error: error.message,
    });
  }
});

// =====================================
// POST: Add new participant
// URL: /api/participants
// =====================================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      mobile,
      village,
      age,
      gender,
      tshirtRequired,
      tshirtSize,
      tshirtAmount,
    } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        message: "Name and mobile number are required",
      });
    }

    const participant = new Participant({
      name,
      mobile,
      village: village || "",
      age: age || null,
      gender: gender || "Male",

      tshirtRequired: tshirtRequired === true,

      tshirtSize: tshirtRequired
        ? tshirtSize || ""
        : "",

      tshirtAmount: tshirtRequired
        ? Number(tshirtAmount || 0)
        : 0,

      status: "Pending",
    });

    const savedParticipant = await participant.save();

    res.status(201).json({
      message: "Participant added successfully",
      participant: savedParticipant,
    });
  } catch (error) {
    console.error("Add participant error:", error.message);

    res.status(500).json({
      message: "Failed to add participant",
      error: error.message,
    });
  }
});

// =====================================
// PATCH: Update participant status
// URL: /api/participants/:id/status
// =====================================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.json({
      message: "Status updated successfully",
      participant,
    });
  } catch (error) {
    console.error("Update status error:", error.message);

    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
});

// =====================================
// PUT: Update complete participant
// URL: /api/participants/:id
// =====================================
router.put("/:id", async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.json({
      message: "Participant updated successfully",
      participant,
    });
  } catch (error) {
    console.error("Update participant error:", error.message);

    res.status(500).json({
      message: "Failed to update participant",
      error: error.message,
    });
  }
});

// =====================================
// DELETE: Delete participant
// URL: /api/participants/:id
// =====================================
router.delete("/:id", async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(
      req.params.id
    );

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.json({
      message: "Participant deleted successfully",
    });
  } catch (error) {
    console.error("Delete participant error:", error.message);

    res.status(500).json({
      message: "Failed to delete participant",
      error: error.message,
    });
  }
});

module.exports = router;