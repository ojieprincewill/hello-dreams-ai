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

// Frontend persona IDs → backend enum values
const PERSONA_MAP = {
  confident: "confident-leader",
  approachable: "approachable-expert",
  innovative: "innovative-thinker",
  trustworthy: "trustworthy-professional",
};

/**
 * Step 1 — Upload the user's photo.
 * Returns { imageUrl: string }
 */
export const uploadHeadshotPhoto = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch(`${API_BASE_URL}/headshot-generator/upload`, {
    method: "POST",
    body: formData,
  });
  return parseResponseBody(res);
};

/**
 * Step 2 — Request AI generation.
 * Returns { id, generatedImages: string[], status }
 */
export const generateHeadshot = async ({ originalImageUrl, style, personaId }) => {
  const res = await apiFetch(`${API_BASE_URL}/headshot-generator/generate`, {
    method: "POST",
    body: JSON.stringify({
      originalImageUrl,
      style,
      personaType: PERSONA_MAP[personaId] ?? personaId,
    }),
  });
  return parseResponseBody(res);
};

/**
 * Step 3 — Poll for completion.
 * Returns { id, generatedImages: string[], status }
 */
export const getHeadshotGeneration = async (generationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/headshot-generator/generations/${generationId}`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};
