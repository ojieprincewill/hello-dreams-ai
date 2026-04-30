import React from "react";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

const SOURCE_COLORS = {
  serpapi: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  careerjet: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  jsearch: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  remotive: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

const SOURCE_LABELS = {
  serpapi: "Google Jobs",
  careerjet: "Careerjet",
  jsearch: "LinkedIn/Indeed",
  remotive: "Remotive",
};

const timeAgo = (date) => {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const JobCard = ({ job, isSaved, onSelect, onSave, isSaving }) => {
  const sourceLabel = SOURCE_LABELS[job.source] ?? job.source;
  const sourceColor = SOURCE_COLORS[job.source] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  const posted = timeAgo(job.postedDate);

  return (
    <div
      className="bg-white dark:bg-[#2a2a2a] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl p-5 cursor-pointer hover:border-[#1342ff] dark:hover:border-[#4d6bff] hover:shadow-md transition-all duration-200"
      onClick={() => onSelect(job)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#010413] dark:text-white text-base leading-snug line-clamp-2">
            {job.title}
          </h3>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-0.5 truncate">
            {job.company ?? "Company not listed"}
          </p>
        </div>
        <button
          className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3d3d3d] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSave(job);
          }}
          disabled={isSaving}
          title={isSaved ? "Saved" : "Save job"}
        >
          {isSaved ? (
            <BookmarkSolid className="w-5 h-5 text-[#1342ff]" />
          ) : (
            <BookmarkIcon className="w-5 h-5 text-[#667085] dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3">
        {job.location && (
          <span className="flex items-center gap-1 text-xs text-[#667085] dark:text-gray-400">
            <MapPinIcon className="w-3.5 h-3.5" />
            {job.location}
          </span>
        )}
        {job.jobType && (
          <span className="flex items-center gap-1 text-xs text-[#667085] dark:text-gray-400">
            <BriefcaseIcon className="w-3.5 h-3.5" />
            {job.jobType}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1 text-xs text-[#667085] dark:text-gray-400">
            <CurrencyDollarIcon className="w-3.5 h-3.5" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-[#667085] dark:text-gray-400">+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColor}`}>
            {sourceLabel}
          </span>
          {job.isRemote && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium">
              Remote
            </span>
          )}
        </div>
        {posted && (
          <span className="flex items-center gap-1 text-xs text-[#667085] dark:text-gray-500">
            <ClockIcon className="w-3.5 h-3.5" />
            {posted}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
