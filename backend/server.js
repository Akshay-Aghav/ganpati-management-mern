require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Ganpati Management API running",
  });
});

app.use(
  "/api/participants",
  require("./routes/participantRoutes")
);

app.use(
  "/api/contributions",
  require("./routes/contributionRoutes")
);

app.use(
  "/api/expenses",
  require("./routes/expenseRoutes")
);

app.use(
  "/api/summary",
  require("./routes/summaryRoutes")
);

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});