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

  const res = await apiFetch(`${BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const generateHeadshots = async ({ styleId, personaId, imageId }) => {
  const res = await apiFetch(`${BASE}/generate`, {
    method: "POST",
    body: JSON.stringify({
      originalImageUrl: imageId,
      style: styleId,
      personaType: PERSONA_MAP[personaId] ?? personaId,
    }),
  });
  return res.json();
};

export const getGeneration = async (id) => {
  const res = await apiFetch(`${BASE}/generations/${id}`, {
    method: "GET",
  });
  return res.json();
};

export const getAllGenerations = async () => {
  const res = await apiFetch(`${BASE}/generations`, {
    method: "GET",
  });
  return res.json();
};
