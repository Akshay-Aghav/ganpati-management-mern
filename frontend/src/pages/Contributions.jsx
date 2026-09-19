import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ganpati-management-backend.onrender.com/api/contributions";
function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
  name: "",
  amount: "",
  paymentMode: "",
  note: "",
});
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch all contributions
  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.contributions || [];

      setContributions(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load contributions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Add contribution
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.amount || !form.paymentMode) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.post(API_URL, {
  name: form.name,
  amount: Number(form.amount),
  paymentMode: form.paymentMode,
  note: form.note,
});

      setMessage("Contribution added successfully");

      setForm({
  name: "",
  amount: "",
  paymentMode: "Cash",
  note: "",
});

      fetchContributions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add contribution"
      );
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      setError("");
      setMessage("");

      await axios.patch(`${API_URL}/${id}/status`, {
        status,
      });

      setMessage(`Contribution marked as ${status}`);
      fetchContributions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update status"
      );
    }
  };

  // Approve contribution
  const approveContribution = async (id) => {
    await updateStatus(id, "Approved");
  };

  // Reject contribution
  const rejectContribution = async (id) => {
    await updateStatus(id, "Rejected");
  };

  // Move contribution back to pending
  const markPending = async (id) => {
    await updateStatus(id, "Pending");
  };

  // Delete contribution
  const deleteContribution = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contribution?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_URL}/${id}`);

      setMessage("Contribution deleted successfully");
      fetchContributions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete contribution"
      );
    }
  };

  // Filter contributions
  const filteredContributions =
    filterStatus === "All"
      ? contributions
      : contributions.filter(
          (item) => item.status === filterStatus
        );

  // Total calculations
  const totalAmount = contributions.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const approvedAmount = contributions
    .filter((item) => item.status === "Approved")
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

  const pendingAmount = contributions
    .filter((item) => item.status === "Pending")
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

  const rejectedAmount = contributions
    .filter((item) => item.status === "Rejected")
    .reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

  return (
    <div className="page-container">
      <h1>Contribution Management</h1>
      <p>Manage Ganpati festival contributions.</p>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Contributions</h3>
          <p>{contributions.length}</p>
        </div>

        <div className="summary-card">
          <h3>Total Amount</h3>
          <p>₹{totalAmount}</p>
        </div>

        <div className="summary-card approved-card">
          <h3>Approved Amount</h3>
          <p>₹{approvedAmount}</p>
        </div>

        <div className="summary-card pending-card">
          <h3>Pending Amount</h3>
          <p>₹{pendingAmount}</p>
        </div>

        <div className="summary-card rejected-card">
          <h3>Rejected Amount</h3>
          <p>₹{rejectedAmount}</p>
        </div>
      </div>

      {/* Add contribution form */}
      <div className="form-card">
        <h2>Add Contribution</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Contributor Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter contributor name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                min="1"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Payment Method *</label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">
                  Bank Transfer
                </option>
                <option value="Online">Online</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Note</label>
              <input
                type="text"
                name="note"
                placeholder="Optional note"
                value={form.note}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="primary-button">
            Add Contribution
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="filter-container">
        <label>Filter by Status:</label>

        <select
          value={filterStatus}
          onChange={(event) =>
            setFilterStatus(event.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Contributions table */}
      <div className="table-card">
        <h2>All Contributions</h2>

        {loading ? (
          <p>Loading contributions...</p>
        ) : filteredContributions.length === 0 ? (
          <p>No contributions found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredContributions.map(
                  (contribution, index) => (
                    <tr key={contribution._id}>
                      <td>{index + 1}</td>
                      <td>{contribution.name}</td>
                      <td>₹{contribution.amount}</td>
                      <td>{contribution.paymentMode || "Cash"}</td>
                      <td>{contribution.note || "-"}</td>

                      <td>
                        <span
                          className={`status-badge ${contribution.status?.toLowerCase()}`}
                        >
                          {contribution.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          {contribution.status !==
                            "Approved" && (
                            <button
                              className="approve-button"
                              onClick={() =>
                                approveContribution(
                                  contribution._id
                                )
                              }
                            >
                              Approve
                            </button>
                          )}

                          {contribution.status !==
                            "Rejected" && (
                            <button
                              className="reject-button"
                              onClick={() =>
                                rejectContribution(
                                  contribution._id
                                )
                              }
                            >
                              Reject
                            </button>
                          )}

                          {contribution.status !==
                            "Pending" && (
                            <button
                              className="pending-button"
                              onClick={() =>
                                markPending(
                                  contribution._id
                                )
                              }
                            >
                              Pending
                            </button>
                          )}

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteContribution(
                                contribution._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contributions;