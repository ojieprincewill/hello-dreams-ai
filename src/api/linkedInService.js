import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = {}) => {
  if (res.status === 204) return fallback;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  try {
    return await res.json();
  } catch {
    const err = new Error("Invalid JSON response from server");
    err.kind = "INVALID_RESPONSE";
    throw err;
  }
};

/** Generate LinkedIn profile from the user's existing resume data. */
export const generateLinkedInProfile = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/generate`,
    { method: "POST" },
  );
  return parseResponseBody(res);
};

/** Get the current user's generated LinkedIn profile. */
export const getLinkedInProfile = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/profile`,
    { method: "GET" },
  );
  return parseResponseBody(res, null);
};

/** Replace the entire LinkedIn profile. */
export const replaceLinkedInProfile = async (data) => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/profile`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
  return parseResponseBody(res);
};

/** Partially update the LinkedIn profile (only supplied fields change). */
export const patchLinkedInProfile = async (data) => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
  return parseResponseBody(res);
};

/** Update a specific section of the LinkedIn profile. */
export const updateLinkedInSection = async (section, data) => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/profile/${section}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
  return parseResponseBody(res);
};

/** Delete the LinkedIn profile. */
export const deleteLinkedInProfile = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/linkedin-optimization/profile`,
    { method: "DELETE" },
  );
  return parseResponseBody(res, { ok: true });
};
