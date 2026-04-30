import React, { useState } from "react";
import {
  MapPinIcon,
  TrashIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const STATUS_CONFIG = {
  saved: { label: "Saved", bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-300" },
  applied: { label: "Applied", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  interviewing: { label: "Interviewing", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  offered: { label: "Offered 🎉", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  rejected: { label: "Rejected", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
  withdrawn: { label: "Withdrawn", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
};

const ALL_STATUSES = ["saved", "applied", "interviewing", "offered", "rejected", "withdrawn"];

const ApplicationCard = ({
  application,
  onUpdateStatus,
  onDelete,
  onGenerateDocuments,
  isGenerating,
  onApply,
  isApplying,
  onViewDocuments,
}) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const job = application.jobListing;
  const statusCfg = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.saved;

  const timeAgo = (date) => {
    if (!date) return null;
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="bg-white dark:bg-[#2a2a2a] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#010413] dark:text-white text-base leading-snug line-clamp-1">
            {job?.title ?? "Unknown role"}
          </h3>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-0.5 truncate">
            {job?.company ?? "Company not listed"}
          </p>
        </div>

        {/* Status badge + dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setStatusOpen((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}
          >
            {statusCfg.label}
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {statusOpen && (
            <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#1e1e1e] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl shadow-xl py-1 min-w-[140px]">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onUpdateStatus({ id: application.id, payload: { status: s } });
                      setStatusOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium ${cfg.text} hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors ${application.status === s ? "opacity-50 cursor-default" : ""}`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-4">
        {job?.location && (
          <span className="flex items-center gap-1 text-xs text-[#667085] dark:text-gray-400">
            <MapPinIcon className="w-3.5 h-3.5" /> {job.location}
          </span>
        )}
        {application.appliedAt && (
          <span className="text-xs text-[#667085] dark:text-gray-400">
            Applied {timeAgo(application.appliedAt)}
          </span>
        )}
        {!application.appliedAt && application.createdAt && (
          <span className="text-xs text-[#667085] dark:text-gray-400">
            Saved {timeAgo(application.createdAt)}
          </span>
        )}
        {application.hasGeneratedDocuments && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Docs ready
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenerateDocuments(application.id)}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1342ff] dark:border-[#4d6bff] text-[#1342ff] dark:text-[#7b96ff] hover:bg-[#f0f4ff] dark:hover:bg-[#1a2040] transition-colors disabled:opacity-50"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          {application.hasGeneratedDocuments ? "Re-generate" : "Generate Docs"}
        </button>

        {application.status === "saved" && (
          <button
            onClick={() => onApply(application.id)}
            disabled={isApplying}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1342ff] hover:bg-[#0f35d9] text-white transition-colors disabled:opacity-50"
          >
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            Apply
          </button>
        )}

        {application.hasGeneratedDocuments && (
          <button
            onClick={() => onViewDocuments(application)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            View Docs
          </button>
        )}

        <button
          onClick={() => onDelete(application.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] text-[#667085] dark:text-gray-400 hover:border-red-300 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-auto"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
