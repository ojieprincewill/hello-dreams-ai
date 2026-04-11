import { getMyProfile } from "../api/professionalProfileService";
import { getUser } from "../auth/authStorage";

/**
 * Checks whether enough user data exists to generate a meaningful document.
 *
 * Returns { ok: true } when any of the following is true:
 * - The current conversation already has user messages
 * - The professional profile has a name / extracted CV data
 * - The authenticated user has a name (always true after sign-in)
 * - The user has previously chatted in the CV builder (resume conversations exist)
 * - The user has a previously generated resume
 *
 * Returns { ok: false, reason } only when none of the above is met.
 *
 * @param {Array} messages - current conversation messages (shape: { sender, content, ... })
 */
export const preGenerateCheck = async (messages = []) => {
  // If the user has already typed anything in this conversation → proceed.
  const hasUserMessages = messages.some((m) => m.sender === "user");
  if (hasUserMessages) return { ok: true };

  // Auth user is always present after sign-in — name + email are guaranteed.
  const authUser = getUser();
  const authName =
    authUser?.name ||
    [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") ||
    "";
  if (authName) return { ok: true };

  // No auth user in cache — fall back to profile checks.
  try {
    const profile = await getMyProfile();
    const hasName = !!profile?.basicInfo?.name;
    const hasExtracted =
      !!profile?.extractedData &&
      Object.keys(profile.extractedData).length > 0;

    if (hasName || hasExtracted) return { ok: true };
  } catch {
    // Profile fetch failed (network / server error).
    // Let the generate call proceed — backend will handle it gracefully.
    return { ok: true };
  }

  // Check if the user has previously chatted in the CV builder.
  try {
    const { listResumeConversations } = await import("../api/resumeBuilderService");
    const convs = await listResumeConversations();
    if (
      Array.isArray(convs) &&
      convs.some((c) => (c.messages || []).some((m) => m.role === "user"))
    ) {
      return { ok: true };
    }
  } catch {
    // Non-fatal — continue to next check.
  }

  // Check if the user has a previously generated resume.
  try {
    const savedCvId = localStorage.getItem("cvConversationId");
    if (savedCvId) {
      const { getGeneratedResume } = await import("../api/resumeBuilderService");
      const resume = await getGeneratedResume(savedCvId);
      if (resume) return { ok: true };
    }
  } catch {
    // Non-fatal.
  }

  return {
    ok: false,
    reason:
      "I don't have enough information about you yet. Please tell me about yourself in the chat above — your name, work experience, and target role — and I'll build a personalised document for you.",
  };
};
