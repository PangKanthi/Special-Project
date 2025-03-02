import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded?.role;

    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
