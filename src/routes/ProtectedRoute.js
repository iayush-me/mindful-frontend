import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>;

  return children;
};

export default ProtectedRoute;
