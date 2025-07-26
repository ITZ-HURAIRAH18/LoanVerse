import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}/`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch category");

        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
        });
      } catch (err) {
        setError("⚠️ Failed to load category data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/categories/${id}/`, {
        method: "POST", // Your Django view accepts POST
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ Category updated successfully!");
      setTimeout(() => navigate("/categories"), 1500);
    } catch (err) {
      setError("⚠️ Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-indigo-500 font-medium mt-10">
        Loading category...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 py-12 px-4 flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-indigo-900 mb-8 text-center drop-shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Edit Loan Category
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-indigo-800 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              placeholder="Enter category name"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-indigo-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description"
              className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`w-full ${
              saving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-3 rounded-lg font-semibold text-lg tracking-wide transition-shadow shadow-md hover:shadow-lg`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>

          {message && (
            <motion.p
              className="mt-4 text-center text-green-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}

          {error && (
            <motion.p
              className="mt-4 text-center text-red-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default EditCategory;
