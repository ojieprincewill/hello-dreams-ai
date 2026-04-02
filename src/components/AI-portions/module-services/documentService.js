import { apiFetch } from "../../../auth/apiClient";

const BASE_URL = "https://hello-dreams-ai.onrender.com/document-generator";

// Get all conversations
export const getConversations = async () => {
  try {
    const data = await apiFetch(`${BASE_URL}/conversations`, {
      method: "GET",
    });

    return data || [];
  } catch (err) {
    console.error("Document Service - getConversations error:", err);
    return [];
  }
};

// Create new conversation (cover letter / personal statement)
export const createConversation = async (payload) => {
  return await apiFetch(`${BASE_URL}/conversations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Load messages for a conversation
export const loadMessages = async (conversationId) => {
  return await apiFetch(`${BASE_URL}/conversations/${conversationId}`, {
    method: "GET",
  });
};

// Send message
export const sendMessage = async (conversationId, content) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
};

// Update conversation
export const updateConversation = async (id, updates) => {
  return await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

// Delete conversation
export const deleteConversation = async (id) => {
  await apiFetch(`${BASE_URL}/conversations/${id}`, {
    method: "DELETE",
  });

  return true;
};

// =====================
// Document Endpoints
// =====================

// Generate document (cover letter / personal statement)
export const generateDocument = async (conversationId) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/generate`,
    {
      method: "POST",
    },
  );
};

// Get document
export const getDocument = async (conversationId) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/document`,
    {
      method: "GET",
    },
  );
};

// Replace document (full update)
export const updateDocument = async (conversationId, payload) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/document`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
};

// Patch document (partial update)
export const patchDocument = async (conversationId, partialUpdates) => {
  return await apiFetch(
    `${BASE_URL}/conversations/${conversationId}/document`,
    {
      method: "PATCH",
      body: JSON.stringify(partialUpdates),
    },
  );
};

// Delete document
export const deleteDocument = async (conversationId) => {
  await apiFetch(`${BASE_URL}/conversations/${conversationId}/document`, {
    method: "DELETE",
  });

  return true;
};
