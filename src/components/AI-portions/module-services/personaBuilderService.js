import { apiFetch } from "../../../auth/apiClient";

const BASE_URL = "https://hello-dreams-ai.onrender.com/persona-builder";

export const getQuestions = async () => {
  const res = await apiFetch(`${BASE_URL}/questions`, { method: "GET" });
  return res.json();
};

export const submitAnswers = async (answers) => {
  const res = await apiFetch(`${BASE_URL}/answers`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  return res;
};

export const generatePersona = async () => {
  const res = await apiFetch(`${BASE_URL}/generate`, {
    method: "POST",
  });
  return res;
};

export const getPersona = async () => {
  const res = await apiFetch(`${BASE_URL}/persona`, {
    method: "GET",
  });
  return res.json();
};

export const applyPersona = async () => {
  const res = await apiFetch(`${BASE_URL}/apply`, {
    method: "POST",
  });
  return res;
};

export const restartPersona = async () => {
  const res = await apiFetch(`${BASE_URL}/restart`, {
    method: "POST",
  });
  return res;
};
