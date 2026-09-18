const express = require("express");
const router = express.Router();

const Contribution = require("../models/Contribution");
const Expense = require("../models/Expense");

router.get("/", async (req, res) => {
  try {
    const contributionResult = await Contribution.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const expenseResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalContribution =
      contributionResult.length > 0
        ? contributionResult[0].total
        : 0;

    const totalExpenses =
      expenseResult.length > 0
        ? expenseResult[0].total
        : 0;

    const remainingAmount =
      totalContribution - totalExpenses;

    res.json({
      totalContribution,
      totalExpenses,
      remainingAmount,
    });
  } catch (error) {
    console.error("Summary error:", error);

    res.status(500).json({
      message: "Failed to fetch financial summary",
      error: error.message,
    });
  }
});

module.exports = router;