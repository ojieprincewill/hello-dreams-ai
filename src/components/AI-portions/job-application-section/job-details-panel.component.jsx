import React, { useState } from "react";
import {
  XMarkIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BookmarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  SparklesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

const JobDetailsPanel = ({
  job,
  isSaved,
  savedApplication,
  onClose,
  onSave,
  isSaving,
  onGenerateDocuments,
  isGenerating,
  onApply,
  isApplying,
}) => {
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  if (!job) return null;

  const hasDocuments = savedApplication?.hasGeneratedDocuments;

  const handleGenerateClick = () => {
    if (!isSaved) {
      setShowSavePrompt(true);
      setTimeout(() => setShowSavePrompt(false), 3000);
      return;
    }
    onGenerateDocuments(savedApplication.id);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-[#1e1e1e] border-l border-[#eaecf0] dark:border-[#3d3d3d] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-[#eaecf0] dark:border-[#3d3d3d] shrink-0">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-lg font-bold text-[#010413] dark:text-white leading-tight">
            {job.title}
          </h2>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-1">
            {job.company ?? "Company not listed"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors shrink-0"
        >
          <XMarkIcon className="w-5 h-5 text-[#667085] dark:text-gray-400" />
        </button>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-[#eaecf0] dark:border-[#3d3d3d] shrink-0">
        {job.location && (
          <span className="flex items-center gap-1.5 text-sm text-[#667085] dark:text-gray-400">
            <MapPinIcon className="w-4 h-4" /> {job.location}
          </span>
        )}
        {job.jobType && (
          <span className="flex items-center gap-1.5 text-sm text-[#667085] dark:text-gray-400">
            <BriefcaseIcon className="w-4 h-4" /> {job.jobType}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1.5 text-sm text-[#667085] dark:text-gray-400">
            <CurrencyDollarIcon className="w-4 h-4" /> {job.salary}
          </span>
        )}
        {job.isRemote && (
          <span className="text-sm px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium">
            Remote
          </span>
        )}
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {job.skills?.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wider mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.description && (
          <div>
            <h4 className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wider mb-2">
              Job Description
            </h4>
            <div
              className="text-sm text-[#010413] dark:text-gray-200 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, "<br/>") }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-[#eaecf0] dark:border-[#3d3d3d] space-y-3 shrink-0">

        {/* Save */}
        {!isSaved && (
          <button
            onClick={() => onSave(job)}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#eaecf0] dark:border-[#3d3d3d] rounded-xl text-sm font-medium text-[#010413] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <><BookmarkIcon className="w-4 h-4" /> Save Job</>
            )}
          </button>
        )}

        {/* Generate Documents — always visible */}
        <div className="space-y-1">
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || isSaving}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              isSaved
                ? "border border-[#1342ff] dark:border-[#4d6bff] text-[#1342ff] dark:text-[#7b96ff] hover:bg-[#f0f4ff] dark:hover:bg-[#1a2040]"
                : "border border-[#eaecf0] dark:border-[#3d3d3d] text-[#667085] dark:text-gray-500 cursor-pointer"
            }`}
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                {hasDocuments ? "Re-generate Documents" : "Generate Documents"}
              </>
            )}
          </button>
          {showSavePrompt && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 px-1">
              <InformationCircleIcon className="w-3.5 h-3.5 shrink-0" />
              Save this job first to generate tailored documents
            </p>
          )}
        </div>

        {/* Apply */}
        <button
          onClick={() => {
            if (isSaved) {
              onApply(savedApplication.id);
            } else if (job.sourceUrl) {
              window.open(job.sourceUrl, "_blank", "noopener,noreferrer");
            }
          }}
          disabled={isApplying}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1342ff] hover:bg-[#0f35d9] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {isApplying ? (
            <span className="animate-pulse">Applying...</span>
          ) : (
            <><ArrowTopRightOnSquareIcon className="w-4 h-4" /> Apply Now</>
          )}
        </button>

        {hasDocuments && (
          <p className="text-center text-xs text-[#667085] dark:text-gray-400 flex items-center justify-center gap-1">
            <DocumentTextIcon className="w-3.5 h-3.5" />
            Tailored resume + cover letter ready
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPanel;
