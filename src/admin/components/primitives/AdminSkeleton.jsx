import React from "react";

const AdminSkeleton = ({ className = "h-20", ...props }) => (
  <div
    className={`animate-pulse bg-[#e5e5e5] dark:bg-[#2d2d2d] rounded-lg ${className}`}
    {...props}
  />
);

export default AdminSkeleton;
