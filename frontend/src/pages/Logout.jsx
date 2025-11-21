// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosfile/axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axiosInstance.post("/logout/");

        // Optional: Clear any localStorage or state here
        localStorage.removeItem("user");

        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-xl animate-pulse">Logging out...</h2>
    </div>
  );
};

export default Logout;
