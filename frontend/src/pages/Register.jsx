import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/participants";

const initialFormData = {
  name: "",
  mobile: "",
};

function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [participants, setParticipants] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Fetch registered participants
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
      setMessage("Unable to connect to backend");
    }
  };

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Register or update participant
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editingId
            ? "Participant updated successfully"
            : "Participant registered successfully"
        );

        setFormData(initialFormData);
        setEditingId(null);
        fetchParticipants();
      } else {
        setMessage(data.message || "Operation failed");
      }
    } catch (error) {
      setMessage("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // Edit participant
  const handleEdit = (participant) => {
    setEditingId(participant._id);

    setFormData({
      name: participant.name || "",
      mobile: participant.mobile || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setMessage("");
  };

  // Delete participant
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this participant?"
    );

    if (!confirmed) {
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

  return (
    <div className="register-page">
      {/* Registration Form */}
      <div className="registration-card">
        <h1>
          {editingId
            ? "Update Participant Registration"
            : "Participant Registration"}
        </h1>

        {message && <p className="register-message">{message}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <div className="register-buttons">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                ? "Update"
                : "Register"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Registered Participants Table */}
      <div className="registered-table-card">
        <h2>Registered Participants</h2>

        <div className="table-wrapper">
          <table className="registered-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Full Name</th>
                <th>Mobile Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No participants registered yet
                  </td>
                </tr>
              ) : (
                participants.map((participant, index) => (
                  <tr key={participant._id}>
                    <td>{index + 1}</td>
                    <td>{participant.name}</td>
                    <td>{participant.mobile}</td>
                    <td>
                      <span
                        className={`status-badge ${(
                          participant.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {participant.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(participant)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(participant._id)
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

export default Register;