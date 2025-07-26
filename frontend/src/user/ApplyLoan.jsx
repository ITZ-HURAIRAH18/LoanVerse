import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ApplyLoan = () =>
{
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    reason: "",
    amount: "",
    term_years: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() =>
{
    fetch("/api/loan-categories/")
      .then((res) =>
res.json())
      .then((data) =>
setCategories(data))
      .catch((err) =>
console.error("Failed to load categories:", err));
  }, []);

  const getCookie = (name) =>
{
    let cookieValue = null;
    if (document.cookie &&
document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        if (cookie.trim().startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.trim().substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e) =>
{
    e.preventDefault();

    const res = await fetch("/apply-loan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage("✅ Loan request submitted successfully!");
      setFormData({ category: "", reason: "", amount: "", term_years: "" });
    } else {
      setMessage("❌ Failed to submit loan request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6 select-none">
          Apply for a New Loan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-blue-800 mb-1 select-none"
            >
              Loan Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) =>
(
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-blue-800 mb-1 select-none"
            >
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={(e) =>
setFormData({ ...formData, reason: e.target.value })}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-blue-800 mb-1 select-none"
            >
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="term_years"
              className="block text-sm font-medium text-blue-800 mb-1 select-none"
            >
              Loan Term (Years)
            </label>
            <input
              type="number"
              id="term_years"
              name="term_years"
              value={formData.term_years}
              onChange={(e) =>
setFormData({ ...formData, term_years: e.target.value })}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-shadow"
          >
            Submit Loan Request
          </button>

          {message &&
(
            <p
              className={`text-center text-sm mt-4 select-none ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ApplyLoan;
