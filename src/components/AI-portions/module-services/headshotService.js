import { apiFetch } from "../../../auth/apiClient";

const BASE = "https://hello-dreams-ai.onrender.com/headshot-generator";

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
      style: styleId,
      persona: personaId,
      imageId,
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
