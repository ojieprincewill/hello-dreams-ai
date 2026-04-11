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

export const listCareerProfileConversations = async () => {
  const res = await apiFetch(
    `${API_BASE_URL}/career-profile/conversations`,
    { method: "GET" },
  );
  return parseResponseBody(res, []);
};

export const createCareerProfileConversation = async (title) => {
  const res = await apiFetch(
    `${API_BASE_URL}/career-profile/conversations`,
    {
      method: "POST",
      body: JSON.stringify({ title }),
    },
  );
  return parseResponseBody(res);
};

export const getCareerProfileConversation = async (conversationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/career-profile/conversations/${conversationId}`,
    { method: "GET" },
  );
  return parseResponseBody(res);
};

export const sendCareerProfileMessage = async (conversationId, content) => {
  const res = await apiFetch(
    `${API_BASE_URL}/career-profile/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  return parseResponseBody(res);
};

