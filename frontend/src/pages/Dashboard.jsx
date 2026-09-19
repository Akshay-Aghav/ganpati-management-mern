import { useEffect, useState } from "react";
import api from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [participants, setParticipants] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        participantsRes,
        contributionsRes,
        expensesRes,
      ] = await Promise.all([
        api.get("/participants"),
        api.get("/contributions"),
        api.get("/expenses"),
      ]);

      setParticipants(
        Array.isArray(participantsRes.data)
          ? participantsRes.data
          : participantsRes.data.participants || []
      );

      setContributions(
        Array.isArray(contributionsRes.data)
          ? contributionsRes.data
          : contributionsRes.data.contributions || []
      );

      setExpenses(
        Array.isArray(expensesRes.data)
          ? expensesRes.data
          : expensesRes.data.expenses || []
      );
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GENERAL CALCULATIONS
  ========================= */

  const totalParticipants = participants.length;

  const totalContributions = contributions.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  const remainingBalance =
    totalContributions - totalExpenses;

  /* =========================
     CONTRIBUTION STATUS
  ========================= */

  const pendingContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "pending"
  ).length;

  const approvedContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "approved"
  ).length;

  const rejectedContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "rejected"
  ).length;

  /* =========================
     T-SHIRT CALCULATIONS
  ========================= */

  const tshirtParticipants = participants.filter(
    (participant) =>
      participant.tshirtRequired === true
  );

  const totalTShirts = tshirtParticipants.length;

  const totalTShirtAmount =
    tshirtParticipants.reduce(
      (total, participant) =>
        total +
        Number(participant.tshirtAmount || 0),
      0
    );

  const approvedTShirts =
    tshirtParticipants.filter(
      (participant) =>
        String(participant.status || "").toLowerCase() ===
        "approved"
    ).length;

  const pendingTShirts =
    tshirtParticipants.filter(
      (participant) =>
        String(participant.status || "").toLowerCase() ===
        "pending"
    ).length;

  const rejectedTShirts =
    tshirtParticipants.filter(
      (participant) =>
        String(participant.status || "").toLowerCase() ===
        "rejected"
    ).length;

  /* =========================
     T-SHIRT SIZE CALCULATIONS
  ========================= */

  const tShirtSizes = {
    S: tshirtParticipants.filter(
      (participant) =>
        participant.tshirtSize === "S"
    ).length,

    M: tshirtParticipants.filter(
      (participant) =>
        participant.tshirtSize === "M"
    ).length,

    L: tshirtParticipants.filter(
      (participant) =>
        participant.tshirtSize === "L"
    ).length,

    XL: tshirtParticipants.filter(
      (participant) =>
        participant.tshirtSize === "XL"
    ).length,

    XXL: tshirtParticipants.filter(
      (participant) =>
        participant.tshirtSize === "XXL"
    ).length,
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>

        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome to the Ganpati Management System
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadDashboard}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          ⚠️ {error}
        </div>
      )}

      {/* MAIN CARDS */}

      <div className="dashboard-grid">

        <div className="dashboard-card participants-card">
          <div className="card-icon">👥</div>

          <div>
            <p>Total Participants</p>

            <h2>{totalParticipants}</h2>
          </div>
        </div>

        <div className="dashboard-card contribution-card">
          <div className="card-icon">💰</div>

          <div>
            <p>Total Contributions</p>

            <h2>
              ₹{totalContributions.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="dashboard-card expense-card">
          <div className="card-icon">💸</div>

          <div>
            <p>Total Expenses</p>

            <h2>
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="dashboard-card balance-card">
          <div className="card-icon">💵</div>

          <div>
            <p>Remaining Balance</p>

            <h2>
              ₹{remainingBalance.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </div>

      {/* T-SHIRT SUMMARY */}

      <div className="section-title">
        <h2>👕 T-Shirt Summary</h2>
      </div>

      <div className="tshirt-dashboard-grid">

        <div className="tshirt-dashboard-card total">
          <span className="tshirt-dashboard-icon">
            👕
          </span>

          <div>
            <p>Total T-Shirts</p>

            <h3>{totalTShirts}</h3>
          </div>
        </div>

        <div className="tshirt-dashboard-card amount">
          <span className="tshirt-dashboard-icon">
            💰
          </span>

          <div>
            <p>T-Shirt Collection</p>

            <h3>
              ₹{totalTShirtAmount.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="tshirt-dashboard-card approved">
          <span className="tshirt-dashboard-icon">
            ✓
          </span>

          <div>
            <p>Approved</p>

            <h3>{approvedTShirts}</h3>
          </div>
        </div>

        <div className="tshirt-dashboard-card pending">
          <span className="tshirt-dashboard-icon">
            ⏳
          </span>

          <div>
            <p>Pending</p>

            <h3>{pendingTShirts}</h3>
          </div>
        </div>

        <div className="tshirt-dashboard-card rejected">
          <span className="tshirt-dashboard-icon">
            ✕
          </span>

          <div>
            <p>Rejected</p>

            <h3>{rejectedTShirts}</h3>
          </div>
        </div>

      </div>

      {/* T-SHIRT SIZE SUMMARY */}

      <div className="section-title">
        <h2>📏 T-Shirt Size Summary</h2>
      </div>

      <div className="size-summary-grid">

        <div className="size-card">
          <span>S</span>
          <p>Small</p>
          <strong>{tShirtSizes.S}</strong>
        </div>

        <div className="size-card">
          <span>M</span>
          <p>Medium</p>
          <strong>{tShirtSizes.M}</strong>
        </div>

        <div className="size-card">
          <span>L</span>
          <p>Large</p>
          <strong>{tShirtSizes.L}</strong>
        </div>

        <div className="size-card">
          <span>XL</span>
          <p>Extra Large</p>
          <strong>{tShirtSizes.XL}</strong>
        </div>

        <div className="size-card">
          <span>XXL</span>
          <p>Double XL</p>
          <strong>{tShirtSizes.XXL}</strong>
        </div>

      </div>

      {/* CONTRIBUTION STATUS */}

      <div className="section-title">
        <h2>Contribution Overview</h2>
      </div>

      <div className="status-grid">

        <div className="status-card">
          <span className="status-icon pending">
            ⏳
          </span>

          <div>
            <p>Pending</p>
            <h3>{pendingContributions}</h3>
          </div>
        </div>

        <div className="status-card">
          <span className="status-icon approved">
            ✓
          </span>

          <div>
            <p>Approved</p>
            <h3>{approvedContributions}</h3>
          </div>
        </div>

        <div className="status-card">
          <span className="status-icon rejected">
            ✕
          </span>

          <div>
            <p>Rejected</p>
            <h3>{rejectedContributions}</h3>
          </div>
        </div>

      </div>

      {/* FINANCIAL SUMMARY */}

      <div className="section-title">
        <h2>Financial Summary</h2>
      </div>

      <div className="financial-card">

        <div className="financial-row">
          <span>Total Contributions</span>

          <strong className="income">
            ₹{totalContributions.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="financial-row">
          <span>Total Expenses</span>

          <strong className="expense">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="financial-divider"></div>

        <div className="financial-row balance-row">
          <span>Available Balance</span>

          <strong>
            ₹{remainingBalance.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="section-title">
        <h2>Quick Actions</h2>
      </div>

      <div className="quick-actions">

        <a
          href="/register"
          className="action-btn"
        >
          👤 Register Participant
        </a>

        <a
          href="/participants"
          className="action-btn"
        >
          👥 View Participants
        </a>

        <a
          href="/contributions"
          className="action-btn"
        >
          💰 Manage Contributions
        </a>

        <a
          href="/expenses"
          className="action-btn"
        >
          💸 Manage Expenses
        </a>

        <a
          href="/gallery"
          className="action-btn"
        >
          🖼️ Manage Gallery
        </a>

      </div>

    </div>
  );
}