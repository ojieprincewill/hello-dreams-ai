import React from "react";

const AdminCard = ({ children, className = "", padding = "p-6" }) => (
  <div
    className={`bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl ${padding} ${className}`}
  >
    {children}
  </div>
);

export default AdminCard;
