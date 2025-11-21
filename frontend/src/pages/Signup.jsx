import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { getCSRFToken } from "../utils/csrf";
import axiosInstance from "../axiosfile/axios";
// adjust path if needed

const Signup = () =>
{
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axiosInstance.post(
      "/signup/",
      formData,
      {
        headers: {
          "X-CSRFToken": getCSRFToken(),   // ✔ send csrf
        },
        withCredentials: true,              // ✔ send cookies (sessionid + csrftoken)
      }
    );

    navigate("/login");

  } catch (error) {
    if (error.response) {
      setErrors(error.response.data);
    } else {
      setErrors({ general: "Signup failed. Try again later." });
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <UserPlus className="mx-auto text-blue-600 w-14 h-14 mb-3" />
          <h2 className="text-3xl font-extrabold text-blue-900">Create Account</h2>
          <p className="text-sm text-blue-600 mt-1">Join us to manage your loans</p>
        </div>

        {errors.general &&
(
          <div className="text-red-600 text-sm text-center font-medium mb-5">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "First Name", name: "first_name", type: "text" },
            { label: "Last Name", name: "last_name", type: "text" },
            { label: "Password", name: "password1", type: "password" },
            { label: "Confirm Password", name: "password2", type: "password" },
          ].map(({ label, name, type }) =>
(
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-blue-800 font-medium text-sm mb-2"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-lg border border-blue-300 placeholder-blue-400 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-400 transition"
                placeholder={`Enter your ${label.toLowerCase()}`}
                autoComplete={name === "email" ? "email" : "off"}
                spellCheck="false"
              />
              {errors[name] &&
(
                <p className="text-red-600 text-xs mt-1 font-semibold">{errors[name]}</p>
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 transition"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center text-sm text-blue-700 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
