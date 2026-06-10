import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { isSuperuser } from "./roleUtils";
import AdminRoute from "./adminRoute";

const SuperuserRoute = ({ children }) => {
  const { user } = useAuth();

  return (
    <AdminRoute>
      {isSuperuser(user) ? children : <Navigate to="/admin/overview" replace />}
    </AdminRoute>
  );
};

export default SuperuserRoute;
