import React from "react";
import AdminInput from "./primitives/AdminInput";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "week", label: "7D" },
  { key: "month", label: "30D" },
  { key: "year", label: "1Y" },
];

const TimeRangePicker = ({ value, onChange, customStart, customEnd, onCustomChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    {RANGES.map((r) => {
      const isActive = value === r.key;
      return (
        <div
          key={r.key}
          className={`relative cursor-pointer transition-colors duration-300 ${
            isActive
              ? "bg-gradient-to-br from-[#1342ff] to-[#ff00e6] p-[2px] rounded-md"
              : "border border-[#eaecf0] dark:border-[#2d2d2d] rounded-md"
          }`}
        >
          <button
            type="button"
            onClick={() => onChange(r.key)}
            className="px-4 py-1.5 text-[14px] bg-[#efefef] dark:bg-[#181818] rounded-md text-[#010413] dark:text-[#f7f7f7] hover:bg-[#dfdfdf] dark:hover:bg-[#151515] transition-colors duration-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {r.label}
          </button>
        </div>
      );
    })}
    <div className="flex items-center gap-2 ml-2">
      <AdminInput
        type="date"
        value={customStart || ""}
        onChange={(e) => onCustomChange?.({ start: e.target.value, end: customEnd })}
        className="w-auto text-sm"
        aria-label="Start date"
      />
      <span className="text-[#999]">–</span>
      <AdminInput
        type="date"
        value={customEnd || ""}
        onChange={(e) => onCustomChange?.({ start: customStart, end: e.target.value })}
        className="w-auto text-sm"
        aria-label="End date"
      />
    </div>
  </div>
);

export default TimeRangePicker;
