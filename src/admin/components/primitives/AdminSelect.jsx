import React from "react";

const AdminSelect = ({ children, className = "", ...props }) => (
  <select
    className={`global-select w-full px-3 py-2 border border-[#eaecf0] dark:border-[#2d2d2d] rounded-md bg-white dark:bg-[#181818] dark:text-[#f7f7f7] ${className}`}
    style={{ fontFamily: "Inter, sans-serif" }}
    {...props}
  >
    {children}
  </select>
);

export default AdminSelect;
