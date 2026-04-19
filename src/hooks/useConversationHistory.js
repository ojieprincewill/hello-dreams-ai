import { useQueries } from "@tanstack/react-query";
import { listCareerProfileConversations } from "../api/careerProfileService";
import { listResumeConversations } from "../api/resumeBuilderService";
import { listDocumentConversations } from "../api/documentGeneratorService";

const safe = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch {
    return [];
  }
};

const safeListCareer = safe(listCareerProfileConversations);
const safeListResume = safe(listResumeConversations);
const safeListDoc = safe(listDocumentConversations);

// Resume builder returns paginated { data: [], meta: {} } — handle both shapes
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export function useConversationHistory() {
  const [careerQuery, resumeQuery, docQuery] = useQueries({
    queries: [
      {
        queryKey: ["careerProfileConversations"],
        queryFn: safeListCareer,
        staleTime: 30_000,
      },
      {
        queryKey: ["resumeBuilder", "conversations"],
        queryFn: safeListResume,
        staleTime: 30_000,
      },
      {
        queryKey: ["documentConversations"],
        queryFn: safeListDoc,
        staleTime: 30_000,
      },
    ],
  });

  const all = [
    ...extractArray(careerQuery.data).map((c) => ({
      ...c,
      moduleId: "get-to-know",
      moduleLabel: "Career Profile",
    })),
    ...extractArray(resumeQuery.data).map((c) => ({
      ...c,
      moduleId: "cv-builder",
      moduleLabel: "CV Builder",
    })),
    ...extractArray(docQuery.data).map((c) => ({
      ...c,
      moduleId: "cover-letter",
      moduleLabel: "Cover Letter",
    })),
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return {
    conversations: all,
    isLoading:
      careerQuery.isLoading || resumeQuery.isLoading || docQuery.isLoading,
  };
}
