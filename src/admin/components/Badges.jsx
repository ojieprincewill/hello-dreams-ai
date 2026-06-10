import React from "react";
import AdminBadge from "./primitives/AdminBadge";

const ROLE_VARIANTS = {
  user: "user",
  admin: "admin",
  superuser: "superuser",
};

export const RoleBadge = ({ role }) => (
  <AdminBadge variant={ROLE_VARIANTS[role] || "default"}>
    {role}
  </AdminBadge>
);

export const StatusBadge = ({ isActive }) => (
  <AdminBadge variant={isActive ? "active" : "inactive"}>
    {isActive ? "Active" : "Inactive"}
  </AdminBadge>
);

export const PaymentStatusBadge = ({ status }) => (
  <AdminBadge
    variant={
      status === "success" ? "success" : status === "pending" ? "pending" : "failed"
    }
  >
    {status}
  </AdminBadge>
);
