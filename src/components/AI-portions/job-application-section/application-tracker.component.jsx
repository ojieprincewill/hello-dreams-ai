import React from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import ApplicationCard from "./application-card.component";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
];

const ApplicationTracker = ({
  applications,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onUpdateStatus,
  onDelete,
  onGenerateDocuments,
  isGenerating,
  onApply,
  isApplying,
  onViewDocuments,
}) => {
  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onStatusFilterChange(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? "bg-[#1342ff] text-white"
                : "bg-[#f9f9f9] dark:bg-[#2a2a2a] text-[#667085] dark:text-gray-400 hover:bg-[#f0f4ff] dark:hover:bg-[#1a2040] border border-[#eaecf0] dark:border-[#3d3d3d]"
            }`}
          >
            {f.label}
            {f.value === "" && applications.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">{applications.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#2a2a2a] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl p-5 animate-pulse"
            >
              <div className="h-5 bg-gray-200 dark:bg-[#3d3d3d] rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-[#3d3d3d] rounded w-1/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-7 bg-gray-200 dark:bg-[#3d3d3d] rounded-lg w-28" />
                <div className="h-7 bg-gray-200 dark:bg-[#3d3d3d] rounded-lg w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center mb-4">
            <ClipboardDocumentListIcon className="w-7 h-7 text-[#1342ff]" />
          </div>
          <h3 className="text-base font-semibold text-[#010413] dark:text-white mb-1">
            No applications yet
          </h3>
          <p className="text-sm text-[#667085] dark:text-gray-400">
            Save jobs from the Find Jobs tab to track them here.
          </p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              onGenerateDocuments={onGenerateDocuments}
              isGenerating={isGenerating}
              onApply={onApply}
              isApplying={isApplying}
              onViewDocuments={onViewDocuments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
