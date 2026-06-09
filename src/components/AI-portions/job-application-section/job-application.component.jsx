import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useJobApplication } from "../custom-hooks/useJobApplication";
import JobSearch from "./job-search.component";
import JobBoard from "./job-board.component";
import JobDetailsPanel from "./job-details-panel.component";
import ApplicationTracker from "./application-tracker.component";
import GenerateDocumentsModal from "./generate-documents-modal.component";
import JobDocumentsViewer from "./job-documents-viewer.component";

class JobApplicationErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-red-600 dark:text-red-400 font-mono text-sm whitespace-pre-wrap">
          <strong>Job Application error:</strong>
          {"\n"}
          {this.state.error?.stack ??
            this.state.error?.message ??
            String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

const JobApplication = () => {
  const {
    activeTab,
    setActiveTab,
    searchFilters,
    committedFilters,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    searchResults,
    searchMeta,
    isSearching,
    searchError,
    selectedJob,
    setSelectedJob,
    applications,
    isLoadingApplications,
    applicationStatusFilter,
    setApplicationStatusFilter,
    saveJob,
    isSaving,
    isSavedJob,
    getApplicationForJob,
    updateStatus,
    removeApplication,
    showGenerateModal,
    setShowGenerateModal,
    handleGenerateDocuments,
    isGenerating,
    viewingApplication,
    setViewingApplication,
    applyToJob,
    isApplying,
  } = useJobApplication();

  const [generateResult, setGenerateResult] = useState(null);
  const [generatingAppId, setGeneratingAppId] = useState(null);

  const hasSearched = !!committedFilters;

  const handleSaveJob = async (job) => {
    try {
      await saveJob({
        jobData: {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          salary: job.salary,
          jobType: job.jobType,
          isRemote: job.isRemote ?? false,
          country: job.country,
          source: job.source,
          sourceUrl: job.sourceUrl,
          externalId: job.externalId,
          experienceLevel: job.experienceLevel,
          skills: job.skills ?? [],
          atsType: job.atsType,
          applicationUrl: job.applicationUrl,
        },
      });
    } catch {
      // error already shown via onError toast in the mutation
    }
  };

  const handleGenerateForApplication = async (applicationId) => {
    setGeneratingAppId(applicationId);
    setGenerateResult(null);
    setShowGenerateModal(true);
    try {
      const result = await handleGenerateDocuments(applicationId);
      setGenerateResult(result);

      // Build a viewing object immediately from the mutation result —
      // don't rely on the React Query cache (stale closure) which won't
      // have the new JSONB content yet at this point.
      const currentApp = applications.find((a) => a.id === applicationId) ?? {};
      const appWithDocs = {
        ...currentApp,
        id: applicationId,
        generatedResumeContent: result?.resume ?? null,
        generatedCoverLetterContent: result?.coverLetter ?? null,
        hasGeneratedDocuments: true,
      };

      setTimeout(() => {
        setShowGenerateModal(false);
        setViewingApplication(appWithDocs);
      }, 1200);
    } catch {
      setShowGenerateModal(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full overflow-x-hidden bg-[#efefef] dark:bg-[#121212]"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white dark:bg-[#212121] border-b border-[#eaecf0] dark:border-[#2d2d2d] px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#010413] dark:text-white">
          Job Application
        </h1>

        <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 mt-1">
          Find jobs, generate tailored documents, and track your applications
        </p>

        {/* Tabs */}
        <div className="mt-4">
          <div className="flex gap-2 sm:gap-1 bg-[#f9f9f9] dark:bg-[#181818] rounded-xl p-1 w-full sm:w-fit overflow-x-auto sm:overflow-visible">
            {/* Find Jobs */}
            <button
              onClick={() => setActiveTab("find")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "find"
                  ? "bg-white dark:bg-[#2a2a2a] text-[#010413] dark:text-white shadow-sm"
                  : "text-[#667085] dark:text-gray-400 hover:text-[#010413] dark:hover:text-white"
              }`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Find Jobs
            </button>

            {/* Tracker */}
            <button
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "tracker"
                  ? "bg-white dark:bg-[#2a2a2a] text-[#010413] dark:text-white shadow-sm"
                  : "text-[#667085] dark:text-gray-400 hover:text-[#010413] dark:hover:text-white"
              }`}
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />

              <span>My Applications</span>

              {applications.length > 0 && (
                <span className="bg-[#1342ff] text-white text-[10px] sm:text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {applications.length > 99 ? "99+" : applications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === "find" && (
          <>
            {/* Search controls */}
            <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
              <JobSearch
                filters={searchFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                isSearching={isSearching}
              />
            </div>

            {/* Search error */}
            {searchError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 break-words">
                <strong>Search error:</strong>{" "}
                {searchError?.message ?? JSON.stringify(searchError)}
              </div>
            )}

            {/* Results */}
            <div className="w-full">
              <JobBoard
                jobs={searchResults}
                meta={searchMeta}
                isSearching={isSearching}
                onSelectJob={setSelectedJob}
                onSaveJob={handleSaveJob}
                isSaving={isSaving}
                isSavedJob={(id) => isSavedJob(id)}
                onPageChange={handlePageChange}
                hasSearched={hasSearched}
              />
            </div>
          </>
        )}

        {activeTab === "tracker" && (
          <div className="w-full overflow-x-hidden">
            <ApplicationTracker
              applications={applications}
              isLoading={isLoadingApplications}
              statusFilter={applicationStatusFilter}
              onStatusFilterChange={setApplicationStatusFilter}
              onUpdateStatus={updateStatus}
              onDelete={removeApplication}
              onGenerateDocuments={handleGenerateForApplication}
              isGenerating={isGenerating && generatingAppId !== null}
              onApply={applyToJob}
              isApplying={isApplying}
              onViewDocuments={setViewingApplication}
            />
          </div>
        )}
      </div>

      {/* Job Details Panel (slide-out) */}
      {selectedJob && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]"
            onClick={() => setSelectedJob(null)}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex justify-end">
            <JobDetailsPanel
              job={selectedJob}
              isSaved={isSavedJob(selectedJob.id)}
              savedApplication={getApplicationForJob(selectedJob.id)}
              onClose={() => setSelectedJob(null)}
              onSave={handleSaveJob}
              isSaving={isSaving}
              onGenerateDocuments={handleGenerateForApplication}
              isGenerating={isGenerating}
              onApply={applyToJob}
              isApplying={isApplying}
            />
          </div>
        </>
      )}

      {/* Generate Documents Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50">
          <GenerateDocumentsModal
            isOpen={showGenerateModal}
            isGenerating={isGenerating}
            onClose={() => {
              setShowGenerateModal(false);
              setGenerateResult(null);
              setGeneratingAppId(null);
            }}
            result={generateResult}
          />
        </div>
      )}

      {/* Documents Viewer */}
      {viewingApplication && (
        <div className="fixed inset-0 z-50">
          <JobDocumentsViewer
            application={viewingApplication}
            onClose={() => setViewingApplication(null)}
          />
        </div>
      )}
    </div>
  );
};

const JobApplicationWithBoundary = (props) => (
  <JobApplicationErrorBoundary>
    <JobApplication {...props} />
  </JobApplicationErrorBoundary>
);

export default JobApplicationWithBoundary;
