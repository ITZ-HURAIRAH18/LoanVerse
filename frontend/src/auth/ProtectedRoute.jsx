import { Navigate } from "react-router-dom";

const getUser = () => {
  // Replace this with actual API auth logic
  return JSON.parse(localStorage.getItem("user")); // { username: "...", is_staff: true/false }
};

const ProtectedRoute = ({ role, children }) => {
  const user = getUser();

  if (!user) return <Navigate to="/" />;
  if (role === "admin" && !user.is_staff) return <Navigate to="/user-dashboard" />;
  if (role === "user" && user.is_staff) return <Navigate to="/admin-dashboard" />;

  return children;
};

export default ProtectedRoute;
