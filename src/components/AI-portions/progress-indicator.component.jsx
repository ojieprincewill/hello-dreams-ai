import React, { useState, useRef, useEffect } from "react";
import { useProgressTracker } from "../../hooks/useProgressTracker";

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-green-500 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CircleIcon = () => (
  <svg
    className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
  </svg>
);

const ProgressIndicator = () => {
  const { percentage, items, isLoading } = useProgressTracker();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const infoItems = items.filter((i) => i.category === "information");
  const moduleItems = items.filter((i) => i.category === "module");

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[20px] text-[#222] dark:text-white font-extrabold hover:opacity-75 transition-opacity focus:outline-none"
        aria-expanded={open}
      >
        {isLoading ? "Progress: —" : `Progress: ${percentage}%`}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Progress bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex justify-between text-sm font-semibold mb-1.5">
              <span className="text-[#010413] dark:text-white">Your Progress</span>
              <span className="text-[#1342ff]">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-[#2d2d2d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1342ff] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="border-t border-[#eaecf0] dark:border-[#2d2d2d]" />

          {/* Information supplied */}
          <div className="px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Information supplied
            </p>
            <ul className="space-y-1.5">
              {infoItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm text-[#010413] dark:text-[#e0e0e0]">
                  {item.done ? <CheckIcon /> : <CircleIcon />}
                  <span className={item.done ? "" : "opacity-60"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#eaecf0] dark:border-[#2d2d2d]" />

          {/* Modules completed */}
          <div className="px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Modules completed
            </p>
            <ul className="space-y-1.5">
              {moduleItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm text-[#010413] dark:text-[#e0e0e0]">
                  {item.done ? <CheckIcon /> : <CircleIcon />}
                  <span className={item.done ? "" : "opacity-60"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
