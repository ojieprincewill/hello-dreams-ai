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

export const listResumeConversations = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations`,
    { method: "GET" },
  );
  return parseResponseBody(res, []);
};

export const createResumeConversation = async (payload) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return parseResponseBody(res);
};

export const getResumeConversation = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};

export const updateResumeConversation = async (conversationId, updates) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
  );
  return parseResponseBody(res);
};

export const deleteResumeConversation = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}`,
    { method: "DELETE" },
  );
  // Backend response shape varies; preserve fallback when body is empty.
  return parseResponseBody(res, { ok: true });
};

export const sendResumeMessage = async (conversationId, content) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  return parseResponseBody(res);
};

export const generateResume = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/generate`,
    { method: "POST" },
  );
  return parseResponseBody(res);
};

export const getGeneratedResume = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/resume`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};

export const updateResume = async (conversationId, updatedResume) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/resume`,
    {
      method: "PUT",
      body: JSON.stringify(updatedResume),
    },
  );
  return parseResponseBody(res);
};

export const patchResume = async (conversationId, partialUpdates) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/resume`,
    {
      method: "PATCH",
      body: JSON.stringify(partialUpdates),
    },
  );
  return parseResponseBody(res, { ok: true });
};

export const deleteResume = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/resume-builder/conversations/${conversationId}/resume`,
    { method: "DELETE" },
  );
  return res.json().catch(() => ({ ok: true }));
};

