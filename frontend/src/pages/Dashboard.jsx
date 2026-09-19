import { useEffect, useState } from "react";
import api from "../api";
import "./Dashboard.css";
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

      const [participantsRes, contributionsRes, expensesRes] =
        await Promise.all([
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
     CALCULATIONS
  ========================= */

  const totalParticipants = participants.length;

  const totalContributions = contributions.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const remainingBalance =
    totalContributions - totalExpenses;

  const pendingContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "pending"
  ).length;

  const approvedContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "approved"
  ).length;

  const rejectedContributions = contributions.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "rejected"
  ).length;

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
          <div className="card-icon">
            👥
          </div>

          <div>
            <p>Total Participants</p>
            <h2>{totalParticipants}</h2>
          </div>
        </div>


        <div className="dashboard-card contribution-card">
          <div className="card-icon">
            💰
          </div>

          <div>
            <p>Total Contributions</p>
            <h2>
              ₹{totalContributions.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>


        <div className="dashboard-card expense-card">
          <div className="card-icon">
            💸
          </div>

          <div>
            <p>Total Expenses</p>
            <h2>
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>


        <div className="dashboard-card balance-card">
          <div className="card-icon">
            💵
          </div>

          <div>
            <p>Remaining Balance</p>
            <h2>
              ₹{remainingBalance.toLocaleString("en-IN")}
            </h2>
          </div>
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

        <a href="/register" className="action-btn">
          👤 Register Participant
        </a>

        <a href="/participants" className="action-btn">
          👥 View Participants
        </a>

        <a href="/contributions" className="action-btn">
          💰 Manage Contributions
        </a>

        <a href="/expenses" className="action-btn">
          💸 Manage Expenses
        </a>

        <a href="/gallery" className="action-btn">
          🖼️ Manage Gallery
        </a>

      </div>

    </div>
  );
}