// useCvBuilder.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as cvService from "../module-services/cvService";

export const useCvBuilder = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [editingConvId, setEditingConvId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // Restore conversationId/messages from localStorage
  useEffect(() => {
    const savedId = localStorage.getItem("cvConversationId");
    const savedMessages = localStorage.getItem("cvMessages");

    if (savedId) {
      setConversationId(savedId);
      handleLoadMessages(savedId);
    } else if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (conversationId)
      localStorage.setItem("cvConversationId", conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (messages.length)
      localStorage.setItem("cvMessages", JSON.stringify(messages));
  }, [messages]);

  // Initialize conversations
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const convs = await cvService.getConversations();
        if (convs.length) {
          // sort by updatedAt descending
          const sorted = convs.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
          setConversations(sorted);
          await handleLoadMessages(sorted[0].id);
        } else {
          const newConv = await cvService.createConversation({
            title: "My Resume",
            targetJobTitle: "Software Engineer",
            targetIndustry: "Technology",
          });
          setConversationId(newConv.id);
          setConversations([newConv]);
          if (newConv.messages?.length) {
            setMessages(
              newConv.messages.map((m, i) => ({
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
          }
          toast.success("Starting a new CV conversation");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to initialize CV Builder");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Handlers
  const handleLoadMessages = async (id) => {
    setLoading(true);
    try {
      const data = await cvService.loadMessages(id);
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
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    setLoading(true);
    try {
      const data = await cvService.sendMessage(
        conversationId,
        newMessage.content,
      );
      let aiContent =
        data.content ||
        data.messages?.find((m) => m.role !== "user")?.content ||
        "AI response not available";

      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id + 1,
          sender: "ai",
          content: aiContent,
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Resume operations
  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      const data = await cvService.generateResume(conversationId);
      setResume(data);
      toast.success("Resume generated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

  const handleGetResume = async () => {
    setLoading(true);
    try {
      const data = await cvService.getResume(conversationId);
      setResume(data);
      toast.success("Resume fetched successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to fetch resume");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResume = async (payload) => {
    setLoading(true);
    try {
      const updated = await cvService.updateResume(conversationId, payload);
      setResume(updated);
      toast.success("Resume updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update resume");
    } finally {
      setLoading(false);
    }
  };

  const handlePatchResume = async (payload) => {
    setLoading(true);
    try {
      const updated = await cvService.patchResume(conversationId, payload);
      setResume((prev) => ({ ...prev, ...updated }));
      toast.success("Resume updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to patch resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    setLoading(true);
    try {
      await cvService.deleteResume(conversationId);
      setResume(null);
      toast.success("Resume deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete resume");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    conversations,
    conversationId,
    resume,
    loading,
    userInput,
    setUserInput,
    editingConvId,
    setEditingConvId,
    newTitle,
    setNewTitle,
    handleChange: (e) => setUserInput(e.target.value),
    handleKeyPress: (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    handleSendMessage,
    handleLoadMessages,
    updateConversation: cvService.updateConversation,
    deleteConversation: cvService.deleteConversation,
    handleGenerateResume,
    handleGetResume,
    handleUpdateResume,
    handlePatchResume,
    handleDeleteResume,
  };
};
