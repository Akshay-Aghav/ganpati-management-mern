const express = require("express");
const router = express.Router();

const Contribution = require("../models/Contribution");

// Get all contributions
router.get("/", async (req, res) => {
    try {
        const contributions = await Contribution.find().sort({
            createdAt: -1,
        });

        res.json(contributions);
    } catch (error) {
        console.error("Fetch contributions error:", error.message);

        res.status(500).json({
            message: "Failed to fetch contributions",
            error: error.message,
        });
    }
});

// Add contribution
router.post("/", async (req, res) => {
    try {
        const {
            name,
            mobile,
            amount,
            paymentMode,
            note,
            date,
        } = req.body;

        if (!name || amount === undefined || amount === "") {
            return res.status(400).json({
                message: "Name and amount are required",
            });
        }

        const contribution = new Contribution({
            name,
            mobile: mobile || "",
            amount: Number(amount),
            paymentMode: paymentMode || "Cash",
            note: note || "",
            status: "Pending",
            date: date || Date.now(),
        });

        const savedContribution = await contribution.save();

        res.status(201).json({
            message: "Contribution added successfully",
            contribution: savedContribution,
        });
    } catch (error) {
        console.error("Add contribution error:", error.message);

        res.status(500).json({
            message: "Failed to add contribution",
            error: error.message,
        });
    }
});

// Update contribution
router.put("/:id", async (req, res) => {
    try {
        const {
            name,
            mobile,
            amount,
            paymentMode,
            note,
            date,
        } = req.body;

        const contribution =
            await Contribution.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    mobile: mobile || "",
                    amount: Number(amount),
                    paymentMode: paymentMode || "Cash",
                    note: note || "",
                    date: date || Date.now(),
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!contribution) {
            return res.status(404).json({
                message: "Contribution not found",
            });
        }

        res.json({
            message: "Contribution updated successfully",
            contribution,
        });
    } catch (error) {
        console.error("Update contribution error:", error.message);

        res.status(500).json({
            message: "Failed to update contribution",
            error: error.message,
        });
    }
});

// Delete contribution
router.delete("/:id", async (req, res) => {
    try {
        const contribution = await Contribution.findByIdAndDelete(
            req.params.id
        );

        if (!contribution) {
            return res.status(404).json({
                message: "Contribution not found",
            });
        }

        res.json({
            message: "Contribution deleted successfully",
        });
    } catch (error) {
        console.error("Delete contribution error:", error.message);

        res.status(500).json({
            message: "Failed to delete contribution",
            error: error.message,
        });
    }
});
// PATCH - update contribution status
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

        const contribution =
            await Contribution.findByIdAndUpdate(
                req.params.id,
                { status },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!contribution) {
            return res.status(404).json({
                message: "Contribution not found",
            });
        }

        res.status(200).json({
            message: `Contribution ${status.toLowerCase()} successfully`,
            contribution,
        });
    } catch (error) {
        console.error(
            "Update contribution status error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update contribution status",
            error: error.message,
        });
    }
});

module.exports = router;