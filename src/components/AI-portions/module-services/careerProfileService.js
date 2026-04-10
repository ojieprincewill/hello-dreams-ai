// careerProfileService.js
import { apiFetch } from "../../../auth/apiClient";

const BASE_URL = "https://hello-dreams-ai.onrender.com/career-profile";

// =====================
// Conversations
// =====================

export const getConversations = async () => {
  try {
    const data = await apiFetch(`${BASE_URL}/conversations`, {
      method: "GET",
    });
    return data || [];
  } catch (err) {
    console.error("Career Profile - getConversations:", err);
    return [];
  }
};

export const createConversation = async (payload) => {
  return await apiFetch(`${BASE_URL}/conversations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getConversation = async (id) => {
  return await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "GET",
  });
};

export const updateConversation = async (id, updates) => {
  return await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteConversation = async (id) => {
  await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "DELETE",
  });
  return true;
};

// =====================
// Messaging
// =====================

export const sendMessage = async (conversationId, content) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
};

// =====================
// Profile Intelligence
// =====================

export const getSummary = async (conversationId) => {
  return await apiFetch(`${BASE_URL}/conversations/${conversationId}/summary`, {
    method: "GET",
  });
};

export const getConfirmation = async (conversationId) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/confirmation`,
    { method: "GET" },
  );
};

// =====================
// CV Upload
// =====================

export const uploadCV = async (conversationId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/upload-cv`,
    {
      method: "POST",
      body: formData,
      headers: {}, // IMPORTANT: let browser set multipart
    },
  );
};

// =====================
// Voice Message
// =====================

export const sendVoiceMessage = async (conversationId, audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob);

  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/voice-message`,
    {
      method: "POST",
      body: formData,
      headers: {},
    },
  );
};
