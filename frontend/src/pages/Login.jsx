import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const Login = () =>
{
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
{
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCookie = (name) =>
{
    let cookieValue = null;
    if (document.cookie &&
document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleLogin = async (e) =>
{
    e.preventDefault();
    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate(data.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 font-inter">
      <motion.div
        className="bg-white shadow-lg rounded-3xl w-full max-w-md p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <LogIn
            className="mx-auto text-blue-600 w-12 h-12 mb-3 stroke-1"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          />
          <h2 className="text-3xl font-semibold text-blue-900">Welcome Back</h2>
          <p className="text-sm text-blue-500 mt-1">Log in to your account</p>
        </div>

        {error &&
(
          <p className="text-red-600 text-center font-medium mb-6 select-none">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-blue-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-sm text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-2xl font-semibold shadow-md transition duration-300"
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm text-center text-blue-600 mt-8 select-none">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold hover:underline hover:text-blue-700">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
