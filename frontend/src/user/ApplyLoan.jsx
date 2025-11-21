import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../axiosfile/axios";

const ApplyLoan = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    reason: "",
    amount: "",
    term_years: "",
  });
  const [message, setMessage] = useState("");

  // Fetch loan categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/loan-categories/");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axiosInstance.post("/apply-loan/", formData);
      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Loan request submitted successfully!");
        setFormData({ category: "", reason: "", amount: "", term_years: "" });
      } else {
        setMessage("❌ Failed to submit loan request.");
      }
    } catch (err) {
      console.error("Error submitting loan request:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`❌ ${err.response.data.error}`);
      } else {
        setMessage("❌ Failed to submit loan request.");
      }
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
          {/* Category */}
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
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
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
                setFormData({ ...formData, reason: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Amount */}
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
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Term */}
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
                setFormData({ ...formData, term_years: e.target.value })
              }
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

          {message && (
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
