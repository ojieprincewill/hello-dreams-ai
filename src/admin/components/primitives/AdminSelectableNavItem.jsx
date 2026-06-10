import React from "react";
import { Link } from "react-router-dom";

const AdminSelectableNavItem = ({ to, isActive, icon: Icon, label, onClick }) => {
  const inner = (
    <>
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </>
  );

  const contentClasses = `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
    isActive
      ? "bg-[#efefef] dark:bg-[#181818]"
      : "bg-[#efefef] dark:bg-[#181818] hover:bg-[#dfdfdf] dark:hover:bg-[#151515]"
  }`;

  if (to) {
    return (
      <div
        className={`relative transition-colors duration-300 ${
          isActive
            ? "bg-gradient-to-br from-[#1342ff] to-[#ff00e6] p-[2px] rounded-md"
            : "border border-[#eaecf0] dark:border-[#2d2d2d] rounded-md"
        }`}
      >
        <Link
          to={to}
          className={`${contentClasses} text-[#010413] dark:text-[#f7f7f7]`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {inner}
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border border-[#eaecf0] dark:border-[#2d2d2d] rounded-md ${contentClasses} text-[#010413] dark:text-[#f7f7f7]`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {inner}
    </button>
  );
};

export default AdminSelectableNavItem;
