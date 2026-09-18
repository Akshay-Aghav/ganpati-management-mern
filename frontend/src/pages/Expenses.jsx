import { useEffect, useState } from "react";

const EXPENSE_API = "http://localhost:5000/api/expenses";
const SUMMARY_API = "http://localhost:5000/api/summary";

const initialFormData = {
  title: "",
  category: "Other",
  amount: "",
  description: "",
  paidBy: "",
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalContribution: 0,
    totalExpenses: 0,
    remainingAmount: 0,
    contributionCount: 0,
    expenseCount: 0,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch(EXPENSE_API);
      const data = await response.json();

      if (response.ok) {
        setExpenses(data);
      } else {
        setMessage(data.message || "Failed to fetch expenses");
      }
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // Fetch financial summary
  const fetchSummary = async () => {
    try {
      const response = await fetch(SUMMARY_API);
      const data = await response.json();

      if (response.ok) {
        setSummary(data);
      } else {
        setMessage(
          data.message || "Failed to fetch financial summary"
        );
      }
    } catch (error) {
      setMessage("Unable to fetch financial summary");
    }
  };

  // Refresh expenses and summary together
  const refreshData = () => {
    fetchExpenses();
    fetchSummary();
  };

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Add or update expense
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${EXPENSE_API}/${editingId}`
        : EXPENSE_API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editingId
            ? "Expense updated successfully"
            : "Expense added successfully"
        );

        setFormData(initialFormData);
        setEditingId(null);
        refreshData();
      } else {
        setMessage(data.message || "Operation failed");
      }
    } catch (error) {
      setMessage("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // Edit expense
  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      title: expense.title || "",
      category: expense.category || "Other",
      amount: expense.amount || "",
      description: expense.description || "",
      paidBy: expense.paidBy || "",
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
  };

  // Delete expense
  const deleteExpense = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${EXPENSE_API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Expense deleted successfully");
        refreshData();
      } else {
        setMessage(data.message || "Failed to delete expense");
      }
    } catch (error) {
      setMessage("Unable to delete expense");
    }
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="expenses-page">
      <h1>Financial Management</h1>

      <p className="page-description">
        View contributions, expenses, and remaining festival funds.
      </p>

      {message && (
        <div className="expense-message">
          {message}
        </div>
      )}

      {/* Financial Summary */}
      <div className="finance-summary">
        <div className="finance-card contribution-card">
          <div className="finance-icon">₹</div>
          <div>
            <h3>Total Contributions</h3>
            <p>₹{formatAmount(summary.totalContribution)}</p>
            <small>
              {summary.contributionCount} contribution records
            </small>
          </div>
        </div>

        <div className="finance-card expense-total-card">
          <div className="finance-icon">−</div>
          <div>
            <h3>Total Expenses</h3>
            <p>₹{formatAmount(summary.totalExpenses)}</p>
            <small>
              {summary.expenseCount} expense records
            </small>
          </div>
        </div>

        <div
          className={`finance-card ${
            summary.remainingAmount >= 0
              ? "remaining-card"
              : "negative-card"
          }`}
        >
          <div className="finance-icon">=</div>
          <div>
            <h3>Remaining Amount</h3>
            <p>₹{formatAmount(summary.remainingAmount)}</p>
            <small>
              Contributions − Expenses
            </small>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="expense-form-card">
        <h2>
          {editingId ? "Update Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="expense-form-grid">
            <div className="expense-form-group">
              <label>Expense Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Decoration"
                required
              />
            </div>

            <div className="expense-form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Decoration">Decoration</option>
                <option value="Food">Food</option>
                <option value="Sound">Sound</option>
                <option value="Lighting">Lighting</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Pooja">Pooja</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="expense-form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <div className="expense-form-group">
              <label>Paid By</label>
              <input
                type="text"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                placeholder="Enter payer name"
              />
            </div>

            <div className="expense-form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter expense description"
              ></textarea>
            </div>
          </div>

          <div className="expense-form-buttons">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                ? "Update Expense"
                : "Add Expense"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-expense-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Expense Table */}
      <div className="expense-list-card">
        <h2>Expense Records</h2>

        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Paid By</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-expense">
                    No expenses added yet
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr key={expense._id}>
                    <td>{index + 1}</td>
                    <td>{expense.title}</td>
                    <td>{expense.category}</td>
                    <td>
                      ₹{formatAmount(expense.amount)}
                    </td>
                    <td>{expense.paidBy || "-"}</td>
                    <td>{expense.description || "-"}</td>
                    <td>
                      <div className="expense-actions">
                        <button
                          className="edit-expense-button"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-expense-button"
                          onClick={() =>
                            deleteExpense(expense._id)
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

export default Expenses;