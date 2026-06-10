import React from "react";

const AdminButton = ({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const base =
    "text-[14px] font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "px-5 py-2 text-white bg-gradient-to-b from-[#1342ff] to-[#ff00e6] rounded-xl font-bold",
    secondary:
      "px-5 py-2 border border-[#ccc] dark:border-[#2d2d2d] rounded-md text-[#010413] dark:text-[#f7f7f7] hover:bg-[#efefef] dark:hover:bg-[#252525]",
    danger:
      "px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default AdminButton;
