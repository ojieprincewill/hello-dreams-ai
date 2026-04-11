import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = null) => {
  if (res.status === 204) return fallback;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  try {
    return await res.json();
  } catch {
    return fallback;
  }
};

/**
 * Returns the current user's ProfessionalProfile from the DB.
 * Includes: basicInfo, cvMetadata, extractedData, persona, completedSections.
 * Creates an empty profile automatically if one does not exist yet.
 */
export const getMyProfile = async () => {
  const res = await apiFetch(`${API_BASE_URL}/professional-profile/me`, {
    method: "GET",
  });
  return parseResponseBody(res, null);
};
