import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as documentService from "../../../api/documentGeneratorService";
import { sanitizeMessage } from "../utils/sanitize";
import { isNetworkError } from "../../../utils/networkError";
import { preGenerateCheck } from "../../../utils/preGenerateCheck";

const isUuid = (value) => {
  const v = String(value ?? "");
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);
};

const toMessageShape = (m, i) => ({
  id: i + 1,
  sender: m.role === "user" ? "user" : "ai",
  content: m.content,
  timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
});

export const useDocumentBuilder = () => {
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [document, setDocument] = useState(null);
  const [userInput, setUserInput] = useState("");
  const initializedRef = useRef(false);

  // ── Queries ────────────────────────────────────────────────────────────────

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useQuery({
    queryKey: ["documentConversations"],
    queryFn: documentService.listDocumentConversations,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createConversationMutation = useMutation({
    mutationFn: documentService.createDocumentConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documentConversations"] });
      setConversationId(data.id);
      localStorage.setItem("docConversationId", data.id);
      // Messages are fetched separately (backend adds greeting after saving the entity,
      // so the creation response doesn't include it). The caller chains loadMessages.
    },
    onError: (err) => {
      if (isNetworkError(err)) return;
      toast.error(err.message || "Failed to create conversation");
    },
  });

  const loadMessagesMutation = useMutation({
    mutationFn: documentService.getDocumentConversation,
    onSuccess: (data) => {
      setConversationId(data.id);
      localStorage.setItem("docConversationId", data.id);
      setMessages(data.messages?.length ? data.messages.map(toMessageShape) : []);
    },
    onError: (err) => {
      if (isNetworkError(err)) return;
      toast.error(err.message || "Failed to load messages");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId: convId, content }) =>
      documentService.sendDocumentMessage(convId, content),
    onSuccess: (data) => {
      const aiContent =
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
      if (isNetworkError(err)) return;
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
      if (isNetworkError(err)) return;
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
      if (isNetworkError(err)) return;
      toast.error(err.message || "Failed to fetch document");
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentService.deleteDocument,
    onSuccess: () => {
      setDocument(null);
      toast.success("Document deleted successfully");
    },
    onError: (err) => {
      if (isNetworkError(err)) return;
      toast.error(err.message || "Failed to delete document");
    },
  });

  // ── Init logic ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (initializedRef.current) return;
    if (conversationsLoading) return;
    initializedRef.current = true;

    if (conversationsError) {
      console.error(conversationsError);
      if (!isNetworkError(conversationsError)) {
        toast.error("Failed to fetch conversations");
      }
      return;
    }

    if (!conversations.length) {
      // Create a new conversation then load its messages (the greeting isn't in
      // the create response — it's added server-side after the entity is saved).
      createConversationMutation
        .mutateAsync({ title: "Cover Letter", documentType: "cover-letter" })
        .then((data) => loadMessagesMutation.mutate(data.id))
        .catch(() => {}); // errors surfaced by onError toasts
    } else {
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
      const savedId = localStorage.getItem("docConversationId");
      const savedConv = savedId ? sorted.find((c) => c.id === savedId) : null;
      const target = savedConv || sorted[0];
      loadMessagesMutation.mutate(target.id);
    }
  }, [conversations, conversationsLoading, conversationsError]); // eslint-disable-line

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSendMessage = () => {
    if (!userInput.trim() || !conversationId) return;
    const sanitized = sanitizeMessage(userInput);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        content: sanitized,
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      },
    ]);
    setUserInput("");
    sendMessageMutation.mutate({ conversationId, content: sanitized });
  };

  const handleChange = (e) => setUserInput(e.target.value);

  const handleNewChat = () => {
    setDocument(null);
    createConversationMutation
      .mutateAsync({ title: "Cover Letter", documentType: "cover-letter" })
      .then((data) => loadMessagesMutation.mutate(data.id))
      .catch(() => {});
  };

  // ── Exported ───────────────────────────────────────────────────────────────

  return {
    messages,
    conversationId,
    userInput,
    document,
    setDocument,

    isSending: sendMessageMutation.isPending,
    isGenerating: generateDocumentMutation.isPending,
    // Show skeleton while: loading conversations list, creating, or loading messages
    isInitializing:
      conversationsLoading ||
      createConversationMutation.isPending ||
      loadMessagesMutation.isPending,

    handleSendMessage,
    handleChange,
    handleNewChat,

    handleKeyPress: (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },

    handleGenerateDocument: () => {
      // Inner async so the returned handler keeps a synchronous signature
      const run = async () => {
        if (!isUuid(conversationId)) {
          toast.error("Please wait for the conversation to initialize.");
          return;
        }
        const check = await preGenerateCheck(messages);
        if (!check.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "ai",
              content: check.reason,
              timestamp: new Date().toLocaleTimeString("en-GB", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            },
          ]);
          return;
        }
        generateDocumentMutation.mutate(conversationId);
      };
      run();
    },
    handleGetDocument: () => {
      if (!isUuid(conversationId)) {
        toast.error("Please wait for the conversation to initialize.");
        return;
      }
      getDocumentMutation.mutate(conversationId);
    },
    handleDeleteDocument: () => deleteDocumentMutation.mutate(conversationId),

    conversationsError,
  };
};
