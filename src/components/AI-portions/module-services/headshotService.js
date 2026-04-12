import { apiFetch } from "../../../auth/apiClient";

const BASE = "https://hello-dreams-ai.onrender.com/headshot-generator";

/** Map short frontend persona IDs to the full values the backend expects */
const PERSONA_MAP = {
  confident: "confident-leader",
  approachable: "approachable-expert",
  innovative: "innovative-thinker",
  trustworthy: "trustworthy-professional",
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiFetch(`${BASE}/upload`, {
    method: "POST",
    body: formData,
  });
};

export const generateHeadshots = async ({ styleId, personaId, imageId }) => {
  return apiFetch(`${BASE}/generate`, {
    method: "POST",
    body: JSON.stringify({
      originalImageUrl: imageId,
      style: styleId,
      personaType: PERSONA_MAP[personaId] ?? personaId,
    }),
  });
};

export const getGeneration = async (id) => {
  return apiFetch(`${BASE}/generations/${id}`, {
    method: "GET",
  });
};

export const getAllGenerations = async () => {
  return apiFetch(`${BASE}/generations`, {
    method: "GET",
  });
};
