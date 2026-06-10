import React from "react";
import AdminCard from "./primitives/AdminCard";
import AdminSkeleton from "./primitives/AdminSkeleton";

const StatCard = ({ label, value, subtext, loading }) => {
  if (loading) {
    return (
      <AdminCard>
        <AdminSkeleton className="h-4 w-24 mb-3" />
        <AdminSkeleton className="h-8 w-16" />
      </AdminCard>
    );
  }

  return (
    <AdminCard>
      <p
        className="text-[14px] text-[#667085] dark:text-[#aaa] mb-1"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {label}
      </p>
      <p
        className="text-[28px] font-bold text-[#010413] dark:text-[#f7f7f7]"
        style={{ fontFamily: "Darker Grotesque, sans-serif" }}
      >
        {value}
      </p>
      {subtext && (
        <p className="text-[12px] text-[#999] mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
          {subtext}
        </p>
      )}
    </AdminCard>
  );
};

export default StatCard;
