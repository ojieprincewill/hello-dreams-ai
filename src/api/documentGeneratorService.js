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

export const listDocumentConversations = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations`,
    { method: "GET" },
  );
  return parseResponseBody(res, []);
};

export const createDocumentConversation = async (payload) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return parseResponseBody(res);
};

export const getDocumentConversation = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};

export const updateDocumentConversation = async (conversationId, updates) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
  );
  return parseResponseBody(res);
};

export const deleteDocumentConversation = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}`,
    { method: "DELETE" },
  );
  return parseResponseBody(res, { ok: true });
};

export const sendDocumentMessage = async (conversationId, content) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  return parseResponseBody(res);
};

export const generateDocument = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/generate`,
    { method: "POST" },
  );
  return parseResponseBody(res);
};

export const getDocument = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/document`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};

export const updateDocument = async (conversationId, payload) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/document`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  return parseResponseBody(res);
};

export const patchDocument = async (conversationId, partialUpdates) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/document`,
    {
      method: "PATCH",
      body: JSON.stringify(partialUpdates),
    },
  );
  return parseResponseBody(res, { ok: true });
};

export const deleteDocument = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/document-generator/conversations/${conversationId}/document`,
    { method: "DELETE" },
  );
  return parseResponseBody(res, { ok: true });
};
