import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { isAdmin } from "./roleUtils";
import ProtectedRoute from "./protectedRoute";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin(user) ? children : <Navigate to="/ai-dashboard" replace />}
    </ProtectedRoute>
  );
};

export default AdminRoute;
