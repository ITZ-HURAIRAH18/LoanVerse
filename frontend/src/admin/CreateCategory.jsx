import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../axiosfile/axios";

const CreateCategory = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axiosInstance.post(

      "/create-category/",
      formData,
      {
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),   // ✔ CSRF for Django
        }
      }
    );

    setMessage("✅ Category created successfully!");
    setFormData({ name: "", description: "" });

  } catch (err) {
    if (err.response) {
      setMessage(err.response.data.error || "Something went wrong.");
    } else {
      setMessage("Error connecting to the server.");
    }
  }
};

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
          Create New Loan Category
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-indigo-800 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="name"
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
            <label htmlFor="description" className="block text-sm font-medium text-indigo-800 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description (optional)"
              className="w-full px-5 py-3 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-lg tracking-wide transition-shadow shadow-md hover:shadow-lg"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Create Category
          </motion.button>

          {message && (
            <motion.p
              className={`mt-4 text-center text-sm select-none ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCategory;
