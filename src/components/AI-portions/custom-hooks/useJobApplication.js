import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  searchJobs,
  listApplications,
  saveJob,
  updateApplication,
  deleteApplication,
  generateDocuments,
  getDocuments,
  applyToJob,
} from "../../../api/jobApplicationService";
import { usePaywall } from "../../../context/paywallContext";

const DEFAULT_FILTERS = {
  q: "",
  location: "",
  country: "NG",
  jobType: "",
  experienceLevel: "",
  remote: false,
  page: 1,
  limit: 20,
};

export const useJobApplication = () => {
  const queryClient = useQueryClient();
  const { showPaywall } = usePaywall();

  const [activeTab, setActiveTab] = useState("find"); // 'find' | 'tracker'
  const [searchFilters, setSearchFilters] = useState(DEFAULT_FILTERS);
  const [committedFilters, setCommittedFilters] = useState(null); // only search on explicit submit
  const [selectedJob, setSelectedJob] = useState(null); // JobListingResponseDto
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [viewingApplication, setViewingApplication] = useState(null);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("");

  // ── Search ─────────────────────────────────────────────────────────────

  const {
    data: searchResults,
    isFetching: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["jobSearch", committedFilters],
    queryFn: () => searchJobs(committedFilters),
    enabled: !!committedFilters,
    staleTime: 30 * 60 * 1000,
    retry: 1,
    placeholderData: { data: [], meta: null },
  });

  const handleSearch = useCallback(() => {
    setCommittedFilters({ ...searchFilters });
  }, [searchFilters]);

  const handleFilterChange = useCallback((field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setCommittedFilters((prev) => ({ ...prev, page }));
    setSearchFilters((prev) => ({ ...prev, page }));
  }, []);

  // ── Applications ────────────────────────────────────────────────────────

  const { data: applicationsResult, isLoading: isLoadingApplications } = useQuery({
    queryKey: ["jobApplications", applicationStatusFilter],
    queryFn: () =>
      listApplications(applicationStatusFilter ? { status: applicationStatusFilter } : {}),
    staleTime: 60_000,
  });

  const applications = applicationsResult?.data ?? [];

  const saveJobMutation = useMutation({
    mutationFn: saveJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.success("Job saved to your applications");
      return data;
    },
    onError: (err) => toast.error(err?.message ?? "Failed to save job"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => updateApplication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: (err) => toast.error(err?.message ?? "Failed to update status"),
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.success("Application removed");
    },
    onError: (err) => toast.error(err?.message ?? "Failed to remove application"),
  });

  // ── Document Generation ─────────────────────────────────────────────────

  const generateDocumentsMutation = useMutation({
    mutationFn: generateDocuments,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      queryClient.invalidateQueries({ queryKey: ["applicationDocs", selectedApplication?.id] });
      toast.success("Documents generated successfully");
      return data;
    },
    onError: (err) => {
      if (err?.status === 403 && err?.body?.code === "CREDIT_LIMIT_REACHED") {
        showPaywall(err.body);
      } else {
        toast.error(err?.message ?? "Document generation failed");
      }
    },
  });

  const handleGenerateDocuments = useCallback(
    async (applicationId) => {
      setShowGenerateModal(true);
      try {
        const result = await generateDocumentsMutation.mutateAsync(applicationId);
        return result;
      } finally {
        setShowGenerateModal(false);
      }
    },
    [generateDocumentsMutation],
  );

  // ── Apply ───────────────────────────────────────────────────────────────

  const applyMutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      if (data.method === "redirect" && data.applyUrl) {
        window.open(data.applyUrl, "_blank", "noopener,noreferrer");
        toast.success("Opened job application — application marked as Applied");
      } else if (data.method === "api") {
        toast.success("Application submitted successfully!");
      }
    },
    onError: (err) => toast.error(err?.message ?? "Failed to apply"),
  });

  // ── Helpers ─────────────────────────────────────────────────────────────

  const isSavedJob = useCallback(
    (jobListingId) => applications.some((a) => a.jobListingId === jobListingId),
    [applications],
  );

  const getApplicationForJob = useCallback(
    (jobListingId) => applications.find((a) => a.jobListingId === jobListingId),
    [applications],
  );

  return {
    // Tabs
    activeTab,
    setActiveTab,

    // Search
    searchFilters,
    committedFilters,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    searchResults: searchResults?.data ?? [],
    searchMeta: searchResults?.meta ?? null,
    isSearching,
    searchError,

    // Selected job (details panel)
    selectedJob,
    setSelectedJob,

    // Applications
    applications,
    isLoadingApplications,
    applicationStatusFilter,
    setApplicationStatusFilter,
    selectedApplication,
    setSelectedApplication,

    // Actions
    saveJob: saveJobMutation.mutateAsync,
    isSaving: saveJobMutation.isPending,
    isSavedJob,
    getApplicationForJob,
    updateStatus: updateStatusMutation.mutateAsync,
    removeApplication: deleteApplicationMutation.mutateAsync,

    // Documents
    showGenerateModal,
    setShowGenerateModal,
    handleGenerateDocuments,
    isGenerating: generateDocumentsMutation.isPending,
    viewingApplication,
    setViewingApplication,

    // Apply
    applyToJob: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
  };
};
