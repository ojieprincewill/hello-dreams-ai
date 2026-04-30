import { apiFetch } from "../../../auth/apiClient";
import { API_BASE_URL } from "../../../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/career-profile`;

const parseJson = async (res) => {
  if (res.status === 204) return null;
  return res.json();
};

// ── Conversations ─────────────────────────────────────────────────────────────

export const getConversations = async () => {
  const res = await apiFetch(`${BASE_URL}/conversations`, { method: "GET" });
  return parseJson(res);
};

export const createConversation = async (payload) => {
  const res = await apiFetch(`${BASE_URL}/conversations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseJson(res);
};

export const getConversation = async (id) => {
  const res = await apiFetch(`${BASE_URL}/conversations/${id}`, { method: "GET" });
  return parseJson(res);
};

export const updateConversation = async (id, updates) => {
  const res = await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return parseJson(res);
};

export const deleteConversation = async (id) => {
  await apiFetch(`${BASE_URL}/conversations/${id}`, { method: "DELETE" });
  return true;
};

// ── Messaging ─────────────────────────────────────────────────────────────────

export const sendMessage = async (conversationId, content) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    { method: "POST", body: JSON.stringify({ content }) },
  );
  return parseJson(res);
};

// ── Profile Intelligence ──────────────────────────────────────────────────────

export const getSummary = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/summary`,
    { method: "GET" },
  );
  return parseJson(res);
};

export const getConfirmation = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/confirmation`,
    { method: "GET" },
  );
  return parseJson(res);
};

export const completeConversation = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/complete`,
    { method: "POST" },
  );
  return res.status === 204 ? null : parseJson(res);
};

// ── CV Upload ─────────────────────────────────────────────────────────────────

export const uploadCV = async (conversationId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/upload-cv`,
    { method: "POST", body: formData, headers: {} },
  );
  return parseJson(res);
};

// ── Voice Message ─────────────────────────────────────────────────────────────

export const sendVoiceMessage = async (conversationId, audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/voice-message`,
    { method: "POST", body: formData, headers: {} },
  );
  return parseJson(res);
};
