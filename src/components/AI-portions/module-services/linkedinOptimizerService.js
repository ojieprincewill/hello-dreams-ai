import { apiFetch } from "../../../auth/apiClient";

const BASE_URL = "https://hello-dreams-ai.onrender.com/linkedin-optimization";

export const generateProfile = async () => {
  const res = await apiFetch(`${BASE_URL}/generate`, {
    method: "POST",
  });
  return res.json();
};

export const getProfile = async () => {
  const res = await apiFetch(`${BASE_URL}/profile`, {
    method: "GET",
  });
  return res.json();
};

export const replaceProfile = async (payload) => {
  const res = await apiFetch(`${BASE_URL}/profile`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res;
};

export const updateProfile = async (payload) => {
  const res = await apiFetch(`${BASE_URL}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res;
};

export const deleteProfile = async () => {
  const res = await apiFetch(`${BASE_URL}/profile`, {
    method: "DELETE",
  });
  return res;
};

export const updateSection = async (section, payload) => {
  const res = await apiFetch(`${BASE_URL}/profile/${section}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res;
};
