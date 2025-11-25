import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import LoadingSpinner from "../components/loading-spinner/loading-spinner.component";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  let content;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (!token) {
    content = <Navigate to="/signin" replace />;
  } else {
    content = children;
  }

  return content;
};

export default ProtectedRoute;
