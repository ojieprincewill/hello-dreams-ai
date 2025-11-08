import React from "react";

const SelectableCard = ({ isSelected, onClick, children, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-br from-[#1342ff] to-[#ff00e6] p-[2px] rounded-md"
          : "border border-[#2d2d2d] rounded-md"
      } ${className}`}
    >
      <div className="bg-[#181818] rounded-md p-4 hover:bg-[#151515] transition-all duration-200">
        {children}
      </div>
    </div>
  );
};

export default SelectableCard;
