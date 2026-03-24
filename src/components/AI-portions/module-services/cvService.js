// cvService.js
import { apiFetch } from "../../../auth/apiClient";

const BASE_URL = "https://hello-dreams-ai.onrender.com/resume-builder";

export const getConversations = async () => {
  const res = await apiFetch(`${BASE_URL}/conversations`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};

export const createConversation = async (payload) => {
  const res = await apiFetch(`${BASE_URL}/conversations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
};

export const loadMessages = async (conversationId) => {
  const res = await apiFetch(`${BASE_URL}/conversations/${conversationId}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
};

export const sendMessage = async (conversationId, content) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

export const updateConversation = async (id, updates) => {
  const res = await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update conversation");
  return res.json();
};

export const deleteConversation = async (id) => {
  const res = await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
  return true;
};

// Resume endpoints
export const generateResume = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/generate`,
    {
      method: "POST",
    },
  );
  if (!res.ok) throw new Error("Failed to generate resume");
  return res.json();
};

export const getResume = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/resume`,
    {
      method: "GET",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
};

export const updateResume = async (conversationId, payload) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/resume`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error("Failed to update resume");
  return res.json();
};

export const patchResume = async (conversationId, partialUpdates) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/resume`,
    {
      method: "PATCH",
      body: JSON.stringify(partialUpdates),
    },
  );
  if (!res.ok) throw new Error("Failed to patch resume");
  return res.json();
};

export const deleteResume = async (conversationId) => {
  const res = await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/resume`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) throw new Error("Failed to delete resume");
  return true;
};
