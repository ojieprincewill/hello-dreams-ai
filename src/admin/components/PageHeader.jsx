import React from "react";

const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1
        className="text-[28px] font-bold text-[#010413] dark:text-[#f7f7f7]"
        style={{ fontFamily: "Darker Grotesque, sans-serif" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="text-[14px] text-[#667085] dark:text-[#aaa] mt-1"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
  </div>
);

export default PageHeader;
