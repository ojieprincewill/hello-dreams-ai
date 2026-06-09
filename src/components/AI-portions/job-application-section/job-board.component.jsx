import React from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import JobCard from "./job-card.component";

const JobBoard = ({
  jobs,
  meta,
  isSearching,
  onSelectJob,
  onSaveJob,
  isSaving,
  isSavedJob,
  onPageChange,
  hasSearched,
}) => {
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-14 sm:py-20 px-4 text-center">
        {/* Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#1342ff]" />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-[#010413] dark:text-white mb-2">
          Search for your next opportunity
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 max-w-xs sm:max-w-sm leading-relaxed">
          Enter a job title or keyword and select a country to find relevant
          jobs from multiple sources including Google Jobs, Careerjet, LinkedIn,
          and more.
        </p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#2a2a2a] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl p-4 sm:p-5 animate-pulse"
          >
            {/* Title */}
            <div className="h-5 bg-gray-200 dark:bg-[#3d3d3d] rounded w-3/4 mb-2" />

            {/* Company */}
            <div className="h-4 bg-gray-200 dark:bg-[#3d3d3d] rounded w-1/2 mb-4" />

            {/* Meta */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-3 bg-gray-200 dark:bg-[#3d3d3d] rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-[#3d3d3d] rounded w-20" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <div className="h-5 bg-gray-200 dark:bg-[#3d3d3d] rounded-full w-16" />
              <div className="h-5 bg-gray-200 dark:bg-[#3d3d3d] rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
        {/* Icon */}
        <MagnifyingGlassIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#667085] dark:text-gray-500 mb-3" />

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-[#010413] dark:text-white mb-1">
          No jobs found
        </h3>

        {/* Main message */}
        <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 mb-2 max-w-xs sm:max-w-sm leading-relaxed">
          Try different keywords, switch to <strong>Remote / Global</strong>, or
          broaden your filters.
        </p>

        {/* Secondary note */}
        <p className="text-[11px] sm:text-xs text-[#667085] dark:text-gray-500 max-w-xs sm:max-w-sm leading-relaxed">
          Full Nigerian coverage unlocks once API keys are configured
          (Careerjet, SerpApi, JSearch).
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      {meta?.total > 0 && (
        <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 mb-3 sm:mb-4">
          Showing {jobs.length} of {meta.total} results
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={isSavedJob(job.id)}
            onSelect={onSelectJob}
            onSave={onSaveJob}
            isSaving={isSaving}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3">
          <button
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.hasPrevious}
            className="flex items-center justify-center gap-1 px-4 py-2 text-xs sm:text-sm rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors w-full sm:w-auto"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 text-center">
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.hasNext}
            className="flex items-center justify-center gap-1 px-4 py-2 text-xs sm:text-sm rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors w-full sm:w-auto"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
