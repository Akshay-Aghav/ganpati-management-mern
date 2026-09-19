import { useEffect, useState } from "react";

const API_URL =
  "https://ganpati-management-backend.onrender.com/api/participants";

function Participants() {
  const [participants, setParticipants] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    village: "",
    age: "",
    gender: "Male",
    tshirtRequired: false,
    tshirtSize: "",
    tshirtAmount: "",
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        setParticipants(data);
      } else {
        setMessage(data.message || "Failed to fetch participants");
      }
    } catch (error) {
      setMessage("Backend server is not running");
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const participantData = {
      ...formData,
      age: formData.age ? Number(formData.age) : null,

      tshirtAmount: formData.tshirtRequired
        ? Number(formData.tshirtAmount || 0)
        : 0,

      tshirtSize: formData.tshirtRequired
        ? formData.tshirtSize
        : "",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(participantData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Participant added successfully");

        setFormData({
          name: "",
          mobile: "",
          village: "",
          age: "",
          gender: "Male",
          tshirtRequired: false,
          tshirtSize: "",
          tshirtAmount: "",
        });

        fetchParticipants();
      } else {
        setMessage(data.message || "Failed to add participant");
      }
    } catch (error) {
      setMessage("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Participant status changed to ${status}`);
        fetchParticipants();
      } else {
        setMessage(data.message || "Failed to update status");
      }
    } catch (error) {
      setMessage("Unable to update status");
    }
  };

  const deleteParticipant = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this participant?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Participant deleted successfully");
        fetchParticipants();
      } else {
        setMessage(data.message || "Failed to delete participant");
      }
    } catch (error) {
      setMessage("Unable to delete participant");
    }
  };

  const filteredParticipants =
    statusFilter === "All"
      ? participants
      : participants.filter(
          (participant) => participant.status === statusFilter
        );

  const pendingCount = participants.filter(
    (participant) => participant.status === "Pending"
  ).length;

  const approvedCount = participants.filter(
    (participant) => participant.status === "Approved"
  ).length;

  const rejectedCount = participants.filter(
    (participant) => participant.status === "Rejected"
  ).length;

  const tshirtCount = participants.filter(
    (participant) => participant.tshirtRequired === true
  ).length;

  const totalTshirtAmount = participants.reduce(
    (total, participant) =>
      total + Number(participant.tshirtAmount || 0),
    0
  );

  return (
    <div className="participants-page">
      <h1>Participants Management</h1>

      <p className="page-description">
        Register participants and manage T-shirt details and approval status.
      </p>

      {message && <div className="message">{message}</div>}

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Participants</h3>
          <p>{participants.length}</p>
        </div>

        <div className="summary-card pending-card">
          <h3>Pending</h3>
          <p>{pendingCount}</p>
        </div>

        <div className="summary-card approved-card">
          <h3>Approved</h3>
          <p>{approvedCount}</p>
        </div>

        <div className="summary-card rejected-card">
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>

        <div className="summary-card tshirt-card">
          <h3>T-Shirts</h3>
          <p>{tshirtCount}</p>
        </div>

        <div className="summary-card amount-card">
          <h3>T-Shirt Amount</h3>
          <p>₹{totalTshirtAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* REGISTRATION FORM */}
      <div className="form-card">
        <h2>Register Participant</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="form-group">
              <label>Village</label>

              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter village"
              />
            </div>

            <div className="form-group">
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* T-SHIRT */}
          <div className="tshirt-section">
            <h3>T-Shirt Details</h3>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tshirtRequired"
                checked={formData.tshirtRequired}
                onChange={handleChange}
              />

              Participant requires T-shirt
            </label>

            {formData.tshirtRequired && (
              <div className="tshirt-fields">
                <div className="form-group">
                  <label>T-Shirt Size</label>

                  <select
                    name="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>T-Shirt Amount</label>

                  <input
                    type="number"
                    name="tshirtAmount"
                    value={formData.tshirtAmount}
                    onChange={handleChange}
                    placeholder="Enter T-shirt amount"
                    min="0"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Register Participant"}
          </button>
        </form>
      </div>

      {/* PARTICIPANT LIST */}
      <div className="list-card">
        <div className="list-header">
          <h2>Participant List</h2>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Village</th>
                <th>Gender</th>
                <th>T-Shirt</th>
                <th>Size</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-message">
                    No participants found
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((participant) => (
                  <tr key={participant._id}>
                    <td>{participant.name}</td>

                    <td>{participant.mobile}</td>

                    <td>{participant.village || "-"}</td>

                    <td>{participant.gender}</td>

                    <td>
                      {participant.tshirtRequired ? "Yes" : "No"}
                    </td>

                    <td>
                      {participant.tshirtRequired
                        ? participant.tshirtSize || "-"
                        : "-"}
                    </td>

                    <td>
                      {participant.tshirtRequired
                        ? `₹${Number(
                            participant.tshirtAmount || 0
                          ).toLocaleString("en-IN")}`
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          participant.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {participant.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="approve-button"
                          onClick={() =>
                            updateStatus(
                              participant._id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-button"
                          onClick={() =>
                            updateStatus(
                              participant._id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>

                        <button
                          className="pending-button"
                          onClick={() =>
                            updateStatus(
                              participant._id,
                              "Pending"
                            )
                          }
                        >
                          Pending
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteParticipant(participant._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Participants;