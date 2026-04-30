import React from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "global", label: "Remote / Global" },
];

const JOB_TYPES = [
  { value: "", label: "All types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
  { value: "", label: "Any level" },
  { value: "entry", label: "Entry level" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
];

const selectClass =
  "text-sm px-3 py-2 rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] bg-white dark:bg-[#2a2a2a] text-[#010413] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff]";

const JobSearch = ({ filters, onFilterChange, onSearch, isSearching }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="space-y-3">
      {/* Main search row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] dark:text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Job title, keywords, or company..."
            value={filters.q}
            onChange={(e) => onFilterChange("q", e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#eaecf0] dark:border-[#3d3d3d] bg-white dark:bg-[#2a2a2a] text-[#010413] dark:text-white placeholder-[#667085] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff]"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="City or region"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-40 px-3 py-2.5 text-sm rounded-xl border border-[#eaecf0] dark:border-[#3d3d3d] bg-white dark:bg-[#2a2a2a] text-[#010413] dark:text-white placeholder-[#667085] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff]"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={isSearching}
          className="px-5 py-2.5 bg-[#1342ff] hover:bg-[#0f35d9] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shrink-0"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <AdjustmentsHorizontalIcon className="w-4 h-4 text-[#667085] dark:text-gray-400 shrink-0" />

        <select
          value={filters.country}
          onChange={(e) => onFilterChange("country", e.target.value)}
          className={selectClass}
        >
          {COUNTRIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={filters.jobType}
          onChange={(e) => onFilterChange("jobType", e.target.value)}
          className={selectClass}
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={filters.experienceLevel}
          onChange={(e) => onFilterChange("experienceLevel", e.target.value)}
          className={selectClass}
        >
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-[#010413] dark:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => onFilterChange("remote", e.target.checked)}
            className="w-4 h-4 rounded accent-[#1342ff]"
          />
          Remote only
        </label>
      </div>
    </div>
  );
};

export default JobSearch;
