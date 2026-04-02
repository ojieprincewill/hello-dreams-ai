// useDocumentBuilder.js
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as documentService from "../module-services/documentService";
import { sanitizeMessage } from "../utils/sanitize";

const DEFAULT_MESSAGE = {
  id: 1,
  sender: "ai",
  content:
    "Hello! 👋 I'm here to help you create professional cover letters and personal statements. What would you like to create today?",
  timestamp: new Date().toLocaleTimeString("en-GB"),
};

export const useDocumentBuilder = () => {
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [document, setDocument] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [editingConvId, setEditingConvId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!messages || messages.length === 0) {
      setMessages([DEFAULT_MESSAGE]);
    }
  }, [messages]);

  // =====================
  // Queries
  // =====================

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useQuery({
    queryKey: ["documentConversations"],
    queryFn: documentService.getConversations,
  });

  // =====================
  // Mutations
  // =====================

  const createConversationMutation = useMutation({
    mutationFn: documentService.createConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["documentConversations"]);
      setConversationId(data.id);
      setMessages([]);
      toast.success("New document conversation started");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create conversation");
    },
  });

  const loadMessagesMutation = useMutation({
    mutationFn: documentService.loadMessages,
    onSuccess: (data, id) => {
      setConversationId(id);

      if (data.messages?.length) {
        setMessages(
          data.messages.map((m, i) => ({
            id: i + 1,
            sender: m.role === "user" ? "user" : "ai",
            content: m.content,
            timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          })),
        );
      } else {
        setMessages([]);
        toast("This conversation has no messages yet");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to load messages");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }) =>
      documentService.sendMessage(conversationId, content),
    onSuccess: (data) => {
      let aiContent =
        data.content ||
        data.messages?.find((m) => m.role !== "user")?.content ||
        "AI response not available";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "ai",
          content: aiContent,
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
        },
      ]);
    },

    onError: (err) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  const generateDocumentMutation = useMutation({
    mutationFn: documentService.generateDocument,
    onSuccess: (data) => {
      setDocument(data);
      toast.success("Document generated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate document");
    },
  });

  const getDocumentMutation = useMutation({
    mutationFn: documentService.getDocument,
    onSuccess: (data) => {
      setDocument(data);
      toast.success("Document fetched successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to fetch document");
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: ({ conversationId, payload }) =>
      documentService.updateDocument(conversationId, payload),
    onSuccess: (data) => {
      setDocument(data);
      toast.success("Document updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update document");
    },
  });

  const patchDocumentMutation = useMutation({
    mutationFn: ({ conversationId, payload }) =>
      documentService.patchDocument(conversationId, payload),
    onSuccess: (data) => {
      setDocument((prev) => ({ ...prev, ...data }));
      toast.success("Document updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update document");
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentService.deleteDocument,
    onSuccess: () => {
      setDocument(null);
      toast.success("Document deleted successfully");
    },
  });

  /* =========================
     EXTRACT STABLE MUTATE FUNCTIONS
  ========================= */

  const { mutate: createConversation } = createConversationMutation;
  const { mutate: loadMessages } = loadMessagesMutation;

  // =====================
  // Init logic
  // =====================

  useEffect(() => {
    if (conversationsError) {
      console.error(conversationsError);
      toast.error("Failed to fetch conversations");
      return;
    }

    if (!conversations.length) {
      createConversation({
        title: "Cover Letter for Software Engineer",
        documentType: "cover-letter",
        targetJobTitle: "Software Engineer",
        targetCompany: "Tech Corp",
      });
    } else {
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );

      loadMessages(sorted[0].id);
    }
  }, [conversations, conversationsError, createConversation, loadMessages]);

  // =====================
  // Handlers
  // =====================

  const handleSendMessage = () => {
    if (!userInput.trim() || !conversationId) return;

    const sanitized = sanitizeMessage(userInput);

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      content: sanitized,
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    sendMessageMutation.mutate({
      conversationId,
      content: sanitized,
    });
  };

  const handleLoadMessages = (id) => {
    loadMessages(id);
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  // =====================
  // Return
  // =====================

  return {
    // state
    messages,
    conversations,
    conversationId,
    userInput,
    document,

    // loading
    loading:
      conversationsLoading ||
      sendMessageMutation.isPending ||
      createConversationMutation.isPending,

    // setters
    setUserInput,
    setConversationId,
    editingConvId,
    setEditingConvId,
    newTitle,
    setNewTitle,

    // handlers
    handleSendMessage,
    handleLoadMessages,

    updateConversation: documentService.updateConversation,
    deleteConversation: documentService.deleteConversation,

    handleChange,

    // keypress
    handleKeyPress: (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },

    handleGenerateDocument: () =>
      generateDocumentMutation.mutate(conversationId),

    handleGetDocument: () => getDocumentMutation.mutate(conversationId),

    handleUpdateDocument: (payload) =>
      updateDocumentMutation.mutate({ id: conversationId, payload }),

    handlePatchDocument: (payload) =>
      patchDocumentMutation.mutate({ id: conversationId, payload }),

    handleDeleteDocument: () => deleteDocumentMutation.mutate(conversationId),

    // expose error if needed
    conversationsError,
  };
};
