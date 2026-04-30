import React from "react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="w-8 h-8 text-[#1342ff]" />
        </div>
        <h3 className="text-lg font-semibold text-[#010413] dark:text-white mb-2">
          Search for your next opportunity
        </h3>
        <p className="text-sm text-[#667085] dark:text-gray-400 max-w-sm">
          Enter a job title or keyword and select a country to find relevant jobs from multiple sources including Google Jobs, Careerjet, LinkedIn, and more.
        </p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#2a2a2a] border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl p-5 animate-pulse"
          >
            <div className="h-5 bg-gray-200 dark:bg-[#3d3d3d] rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-[#3d3d3d] rounded w-1/2 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-3 bg-gray-200 dark:bg-[#3d3d3d] rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-[#3d3d3d] rounded w-20" />
            </div>
            <div className="flex gap-2">
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MagnifyingGlassIcon className="w-10 h-10 text-[#667085] dark:text-gray-500 mb-3" />
        <h3 className="text-base font-semibold text-[#010413] dark:text-white mb-1">
          No jobs found
        </h3>
        <p className="text-sm text-[#667085] dark:text-gray-400 mb-1">
          Try different keywords, switch to <strong>Remote / Global</strong>, or broaden your filters.
        </p>
        <p className="text-xs text-[#667085] dark:text-gray-500">
          Full Nigerian coverage unlocks once API keys are configured (Careerjet, SerpApi, JSearch).
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      {meta?.total > 0 && (
        <p className="text-sm text-[#667085] dark:text-gray-400 mb-4">
          Showing {jobs.length} of {meta.total} results
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.hasPrevious}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-[#667085] dark:text-gray-400">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.hasNext}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
          >
            Next <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
