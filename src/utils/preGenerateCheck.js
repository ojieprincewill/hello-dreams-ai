import { getMyProfile } from "../api/professionalProfileService";

/**
 * Checks whether enough user data exists to generate a meaningful document.
 *
 * Returns { ok: true } when the conversation already has user messages OR the
 * professional profile has a name / extracted CV data saved from a previous session.
 *
 * Returns { ok: false, reason } when neither condition is met, so the caller can
 * show an in-chat guidance message instead of hitting the generate endpoint.
 *
 * @param {Array} messages - current conversation messages (shape: { sender, content, ... })
 */
export const preGenerateCheck = async (messages = []) => {
  // If the user has already typed anything in this conversation → proceed.
  const hasUserMessages = messages.some((m) => m.sender === "user");
  if (hasUserMessages) return { ok: true };

  // No chat messages — check whether a professional profile exists from a previous session.
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

  return {
    ok: false,
    reason:
      "I don't have enough information about you yet. Please tell me about yourself in the chat above — your name, work experience, and target role — and I'll build a personalised document for you.",
  };
};
