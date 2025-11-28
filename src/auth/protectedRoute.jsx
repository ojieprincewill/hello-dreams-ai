import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import LoadingSpinner from "../components/loading-spinner/loading-spinner.component";

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Block access if either token or user is missing
  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
