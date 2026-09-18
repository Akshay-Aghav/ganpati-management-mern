const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      createdAt: -1,
    });

    res.json(expenses);
  } catch (error) {
    console.error("Fetch expenses error:", error.message);

    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
});

// Add expense
router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      description,
      paidBy,
      date,
    } = req.body;

    if (!title || amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Title and amount are required",
      });
    }

    const expense = new Expense({
      title,
      category: category || "Other",
      amount: Number(amount),
      description: description || "",
      paidBy: paidBy || "",
      date: date || Date.now(),
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense,
    });
  } catch (error) {
    console.error("Add expense error:", error.message);

    res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
  }
});

// Update expense
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        amount: Number(req.body.amount),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update expense error:", error.message);

    res.status(500).json({
      message: "Failed to update expense",
      error: error.message,
    });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(
      req.params.id
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error.message);

    res.status(500).json({
      message: "Failed to delete expense",
      error: error.message,
    });
  }
});

module.exports = router;