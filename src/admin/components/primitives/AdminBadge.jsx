import React from "react";

const VARIANTS = {
  default: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  admin: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  superuser: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  user: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  active: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  inactive: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  success: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  failed: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

const AdminBadge = ({ children, variant = "default", className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium ${VARIANTS[variant] || VARIANTS.default} ${className}`}
  >
    {children}
  </span>
);

export default AdminBadge;
