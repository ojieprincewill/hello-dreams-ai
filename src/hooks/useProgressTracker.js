import { useQueries } from "@tanstack/react-query";
import { listCareerProfileConversations } from "../api/careerProfileService";
import { listResumeConversations, getGeneratedResume } from "../api/resumeBuilderService";
import { listDocumentConversations } from "../api/documentGeneratorService";
import { fetchPersona } from "../api/personaBuilderService";
import { getLinkedInProfile } from "../api/linkedInService";
import { getMyProfile } from "../api/professionalProfileService";
import { getAllGenerations } from "../components/AI-portions/module-services/headshotService";
import { getUser } from "../auth/authStorage";

/**
 * Safe fetch wrappers — return null instead of throwing so a single failed
 * endpoint never zeros-out the entire progress calculation.
 */
const safe = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch {
    return null;
  }
};

const safeListResumeConversations = safe(listResumeConversations);
const safeListCareerConversations = safe(listCareerProfileConversations);
const safeListDocConversations = safe(listDocumentConversations);
const safeFetchPersona = safe(fetchPersona);
const safeGetLinkedIn = safe(getLinkedInProfile);
const safeGetMyProfile = safe(getMyProfile);
const safeGetResume = safe(getGeneratedResume);
const safeGetAllGenerations = safe(getAllGenerations);

export function useProgressTracker() {
  const [
    careerQuery,
    resumeListQuery,
    docListQuery,
    personaQuery,
    linkedInQuery,
    profileQuery,
    headshotGenerationsQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["careerProfileConversations"],
        queryFn: safeListCareerConversations,
        staleTime: 60_000,
      },
      {
        queryKey: ["resumeBuilder", "conversations"],
        queryFn: safeListResumeConversations,
        staleTime: 60_000,
      },
      {
        queryKey: ["documentConversations"],
        queryFn: safeListDocConversations,
        staleTime: 60_000,
      },
      {
        queryKey: ["personaBuilder", "persona"],
        queryFn: safeFetchPersona,
        staleTime: 60_000,
      },
      {
        queryKey: ["linkedInProfile"],
        queryFn: safeGetLinkedIn,
        staleTime: 60_000,
      },
      {
        queryKey: ["professionalProfile", "me"],
        queryFn: safeGetMyProfile,
        staleTime: 0,
      },
      {
        queryKey: ["headshotGenerator", "generations"],
        queryFn: safeGetAllGenerations,
        staleTime: 0,
      },
    ],
  });

  // ── Pick the best conversation ID to check for a generated resume ──────────
  // The CV builder saves the user's active conversation to localStorage.
  // Prefer that over the most-recently-updated one — clicking "+ New Chat"
  // creates a newer empty conversation but the resume lives in the older one.
  // listResumeConversations returns a paginated { data: [], meta: {} } shape.
  // Handle both the paginated shape and a raw array for backward compatibility.
  const rawResumeList = resumeListQuery.data;
  const resumeConversations = (
    Array.isArray(rawResumeList)
      ? rawResumeList
      : Array.isArray(rawResumeList?.data)
      ? rawResumeList.data
      : []
  ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const savedCvId = localStorage.getItem("cvConversationId");
  const preferredConv = savedCvId
    ? resumeConversations.find((c) => c.id === savedCvId)
    : null;
  const resumeConvId = (preferredConv ?? resumeConversations[0])?.id ?? null;

  const [resumeContentQuery] = useQueries({
    queries: [
      {
        queryKey: ["resumeBuilder", "resume", resumeConvId],
        queryFn: () => safeGetResume(resumeConvId),
        enabled: !!resumeConvId,
        staleTime: 60_000,
      },
    ],
  });

  // ── Pull data safely ───────────────────────────────────────────────────────
  // Fall back to the latest resume cached in localStorage (written by ResumeContext
  // after login and after generation) when the per-conversation query is unavailable.
  const storedLatestResume = (() => {
    try { return JSON.parse(localStorage.getItem("latestResume") || "null"); }
    catch { return null; }
  })();
  const resumeContent =
    resumeContentQuery.data?.content ?? storedLatestResume?.content ?? null;

  const profile = profileQuery.data ?? {};
  const basicInfo = profile.basicInfo ?? {};
  const cvMeta = profile.cvMetadata ?? {};
  const extracted = profile.extractedData ?? {};
  const profilePersona = profile.persona ?? {};
  const completed = profile.completedSections ?? {};

  // Auth user cached in localStorage — always has name + email on sign-in.
  // This is the most reliable source for basic contact info.
  const authUser = getUser() ?? {};
  const authName =
    authUser.name ||
    [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") ||
    "";
  const authEmail = authUser.email || "";

  // True if any resume conversation already has at least one user message,
  // meaning the user has provided info in the CV builder (even without generating).
  const hasResumeWithUserMessages = resumeConversations.some(
    (c) => Array.isArray(c.messages) && c.messages.some((m) => m.role === "user"),
  );

  // ── Information fields ─────────────────────────────────────────────────────
  // Priority order:
  // 1. Generated resume content (most accurate, post-generation)
  // 2. Professional profile fields (populated by backend from various modules)
  // 3. Auth user (always available on sign-in — name/email guaranteed)
  // 4. Resume conversations with user messages (user has chatted in CV builder)

  const hasContact =
    !!(resumeContent?.contact?.fullName && resumeContent?.contact?.email) ||
    !!(basicInfo.name && basicInfo.email) ||
    !!(authName && authEmail);

  const hasWorkExperience =
    (Array.isArray(resumeContent?.workExperience) && resumeContent.workExperience.length > 0) ||
    (Array.isArray(cvMeta.workHistory) && cvMeta.workHistory.length > 0) ||
    !!extracted.experience?.trim() ||
    hasResumeWithUserMessages;

  const hasEducation =
    (Array.isArray(resumeContent?.education) && resumeContent.education.length > 0) ||
    !!extracted.education?.trim() ||
    hasResumeWithUserMessages;

  const hasSkills =
    !!(
      resumeContent?.skills &&
      Object.values(resumeContent.skills).some((v) => Array.isArray(v) && v.length > 0)
    ) ||
    (Array.isArray(extracted.skills) && extracted.skills.length > 0) ||
    hasResumeWithUserMessages;

  // Summary only exists after "Generate Resume"
  const hasSummary = !!resumeContent?.summary?.trim();

  // ── Module completion ──────────────────────────────────────────────────────

  const careerConvs = Array.isArray(careerQuery.data) ? careerQuery.data : [];
  const getToKnowDone =
    careerConvs.some((c) => c.messages?.length > 1) ||
    !!completed.careerProfile ||
    hasWorkExperience;

  const personaDone =
    !!personaQuery.data ||
    !!completed.persona ||
    !!(
      profilePersona.communicationStyle ||
      profilePersona.tone ||
      profilePersona.professionalVoice ||
      profilePersona.writingStyle ||
      (Array.isArray(profilePersona.personalityTraits) && profilePersona.personalityTraits.length > 0)
    );

  // CV Builder: has at least one conversation OR a resume was successfully fetched
  const hasResume =
    resumeConversations.length > 0 ||
    !!resumeContentQuery.data;

  const hasDocument =
    Array.isArray(docListQuery.data) && docListQuery.data.length > 0;

  const linkedInDone =
    !!completed.linkedin ||
    !!(linkedInQuery.data && Object.keys(linkedInQuery.data).length > 0);

  const headshotGenerations = Array.isArray(headshotGenerationsQuery.data)
    ? headshotGenerationsQuery.data
    : [];
  const headshotDone =
    !!completed.headshot ||
    headshotGenerations.some((g) => g.status === "completed");

  // ── Items ──────────────────────────────────────────────────────────────────
  const items = [
    { id: "contact",              label: "Contact information",    category: "information", done: hasContact },
    { id: "work-experience",      label: "Work experience",        category: "information", done: hasWorkExperience },
    { id: "education",            label: "Education",              category: "information", done: hasEducation },
    { id: "skills",               label: "Skills",                 category: "information", done: hasSkills },
    { id: "summary",              label: "Professional summary",   category: "information", done: hasSummary },
    { id: "get-to-know",          label: "Get to know you",        category: "module",      done: getToKnowDone },
    { id: "build-persona",        label: "Build your Persona",     category: "module",      done: personaDone },
    { id: "cv-builder",           label: "CV & Resume Builder",    category: "module",      done: hasResume },
    { id: "cover-letter",         label: "Cover Letter",           category: "module",      done: hasDocument },
    { id: "linkedin-optimizer",   label: "LinkedIn Optimiser",     category: "module",      done: linkedInDone },
    { id: "professional-headshot",label: "Professional Headshot",  category: "module",      done: headshotDone },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const percentage = Math.round((doneCount / items.length) * 100);

  const isLoading =
    careerQuery.isLoading ||
    resumeListQuery.isLoading ||
    docListQuery.isLoading;

  return { percentage, items, isLoading };
}
