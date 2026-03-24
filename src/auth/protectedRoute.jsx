import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import LoadingSpinner from "../components/loading-spinner/loading-spinner.component";

const ProtectedRoute = ({ children }) => {
  const { token, user, loading, initializing, isAuthenticated } = useAuth();

  if (initializing || loading) {
    return <LoadingSpinner />;
  }

  // 🚫 Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // ⏳ Token exists but user not loaded yet (edge case)
  if (token && !user) {
    return <LoadingSpinner />;
  }

  // ✅ Fully authenticated
  return children;
};

export default ProtectedRoute;
