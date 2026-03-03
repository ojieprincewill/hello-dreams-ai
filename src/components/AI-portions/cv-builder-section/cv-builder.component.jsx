import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { UserIcon } from "@heroicons/react/24/outline";
import { apiFetch } from "../../../auth/apiClient";
import ChatLayout from "../reusable-customs/chat-layout.component";
import AnimatedMessage from "../reusable-customs/animated-message.component";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";
import CVPreview from "./cv-preview.component";

const CvBuilder = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content:
        "Hello! 👋 Welcome to Hello Dreams AI. I'm here to help you create an amazing CV. Let's start with the basics - what's your full name?",
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
  ]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingConvId, setEditingConvId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [resume, setResume] = useState(null);

  // Save conversationId whenever it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("cvConversationId", conversationId);
    }
  }, [conversationId]);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("cvMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Restore from localStorage first
  useEffect(() => {
    const savedId = localStorage.getItem("cvConversationId");
    const savedMessages = localStorage.getItem("cvMessages");

    if (savedId) {
      setConversationId(savedId);
      loadMessages(savedId); // reload from backend for freshness
    } else if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Create or restore conversation once when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        const res = await apiFetch(
          "https://hello-dreams-ai.onrender.com/resume-builder/conversations",
          { method: "GET" },
        );

        if (!res.ok) {
          toast.error("Failed to load conversations");
          return;
        }

        const data = await res.json();

        if (data.length > 0) {
          // Sort conversations by updatedAt (descending)
          const sorted = data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );

          // setConversations(sorted);

          // Pick the most recent conversation
          const latest = sorted[0];
          await loadMessages(latest.id);
        } else {
          // No conversations → create one
          const createRes = await apiFetch(
            "https://hello-dreams-ai.onrender.com/resume-builder/conversations",
            {
              method: "POST",
              body: JSON.stringify({
                title: "My Resume",
                targetJobTitle: "Software Engineer",
                targetIndustry: "Technology",
              }),
            },
          );
          const newConv = await createRes.json();
          setConversationId(newConv.id);

          // ✅ Inform the user
          toast.success("Starting a new CV conversation");

          // If backend returns messages, hydrate them
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
        }
      } catch (err) {
        console.error("Error initializing CvBuilder:", err);
        toast.error(err.message || "Failed to create conversation");
      }
    };

    init();
  }, []);

  // Load messages for a selected conversation
  const loadMessages = async (id) => {
    try {
      // Show loading indicator
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}`,
        { method: "GET" },
      );

      // ✅ Handle failed requests gracefully
      if (!res.ok) {
        toast.error("Failed to load conversation");
        return;
      }

      const data = await res.json();
      console.log("Conversation from backend:", data);

      if (data.messages && Array.isArray(data.messages)) {
        setConversationId(id);

        if (data.messages.length === 0) {
          // ✅ Empty state UX
          toast("This conversation has no messages yet");
        }

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
        console.warn("No messages array found in conversation:", data);
        toast.error("No messages found in this conversation");
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
      toast.error("Error loading conversation");
    } finally {
      // ✅ Always clear loading state
      setLoading(false);
    }
  };

  // Send message (same as before, but using apiFetch)
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

    // ✅ Optimistically add user message
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: newMessage.content }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to send message");
        return;
      }

      const data = await res.json();
      let aiContent = "AI response not available";

      if (data.content) {
        aiContent = data.content;
      } else if (data.messages?.length) {
        const aiMsg = data.messages.find((m) => m.role !== "user");
        aiContent = aiMsg
          ? aiMsg.content
          : data.messages[data.messages.length - 1].content;
      }

      // ✅ Append AI response
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
      console.error("Error sending message:", err);
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  // Update a selected conversation
  const updateConversation = async (id, updates) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to update conversation");
        return null;
      }

      const updatedConv = await res.json();
      toast.success("Conversation updated successfully");

      // ✅ If you’re keeping a conversations list, update it in state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, ...updatedConv } : conv,
        ),
      );

      return updatedConv;
    } catch (err) {
      console.error("Error updating conversation:", err);
      toast.error("Error updating conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a selected conversation
  const deleteConversation = async (id) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to delete conversation");
        return false;
      }

      toast.success("Conversation deleted successfully");

      // ✅ Remove from conversations list in state
      setConversations((prev) => prev.filter((conv) => conv.id !== id));

      // ✅ If the deleted conversation was active, clear messages
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }

      return true;
    } catch (err) {
      console.error("Error deleting conversation:", err);
      toast.error("Error deleting conversation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Generate resume for a conversation
  const generateResume = async (id) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}/generate`,
        { method: "POST" },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to generate resume");
        return null;
      }

      const resumeData = await res.json();
      toast.success("Resume generated successfully");

      // ✅ Store resume in state for preview
      setResume(resumeData);

      return resumeData;
    } catch (err) {
      console.error("Error generating resume:", err);
      toast.error("Error generating resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get generated resume for a conversation
  const getGeneratedResume = async (id) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}/resume`,
        { method: "GET" },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to fetch generated resume");
        return null;
      }

      const resumeData = await res.json();
      toast.success("Resume fetched successfully");

      // ✅ You can store resume in state for rendering
      setResume(resumeData);

      return resumeData;
    } catch (err) {
      console.error("Error fetching resume:", err);
      toast.error("Error fetching resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update resume for a conversation
  const updateResume = async (id, updatedResume) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}/resume`,
        {
          method: "PUT",
          body: JSON.stringify(updatedResume),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to update resume");
        return null;
      }

      const newResume = await res.json();
      toast.success("Resume updated successfully");

      // ✅ Update local state so UI reflects changes immediately
      setResume(newResume);

      return newResume;
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error("Error updating resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update section of a resume for a conversation
  const patchResume = async (id, partialUpdates) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}/resume`,
        {
          method: "PATCH",
          body: JSON.stringify(partialUpdates),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to update resume");
        return null;
      }

      const updatedResume = await res.json();
      toast.success("Resume updated successfully");

      // ✅ Merge updated fields into local state
      setResume((prev) => ({ ...prev, ...updatedResume }));

      return updatedResume;
    } catch (err) {
      console.error("Error patching resume:", err);
      toast.error("Error patching resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete resume for a conversation
  const deleteResume = async (id) => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}/resume`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to delete resume");
        return false;
      }

      toast.success("Resume deleted successfully");

      // ✅ Clear resume state so UI updates immediately
      setResume(null);

      return true;
    } catch (err) {
      console.error("Error deleting resume:", err);
      toast.error("Error deleting resume");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const renderMessage = (message) => (
    <AnimatedMessage key={message.id}>
      {message.sender === "ai" ? (
        <div className="w-max bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
          <p className="w-[453px] text-[20px] leading-relaxed">
            {message.content}
          </p>
          <p className="text-[#444] dark:text-[#bfb5b5] text-[16px] mt-2">
            {message.timestamp}
          </p>
        </div>
      ) : (
        <div className="flex justify-end my-5">
          <div className="w-max bg-[#e2e2e2] dark:bg-[#151515] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
            <p className="w-[453px] text-[20px] leading-relaxed">
              {message.content}
            </p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[16px] mt-2 text-right">
              {message.timestamp}
            </p>
          </div>
        </div>
      )}
    </AnimatedMessage>
  );

  if (loading) return <LoadingSpinner />;

  if (resume)
    return (
      <div className="mt-10 p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-3">Generated Resume</h3>
        <CVPreview data={resume} />

        <div className="flex justify-end mt-4">
          <button
            onClick={() =>
              patchResume(conversationId, { summary: "New summary text here" })
            }
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Update Summary
          </button>
          <button
            onClick={() =>
              patchResume(conversationId, {
                skills: [...resume.skills, "TypeScript"],
              })
            }
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Skill
          </button>
          <button
            onClick={() => updateResume(conversationId, resume)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Resume
          </button>
          <button
            onClick={() => deleteResume(conversationId)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Resume
          </button>
        </div>
      </div>
    );

  return (
    <div className="px-[5%] pt-10 pb-5">
      <div className="flex items-center space-x-3 mb-10 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold ">CV Builder</h2>
          <p className="text-[20px]">
            Let's have a conversation to build you the perfect CV
          </p>
        </div>
      </div>

      {/* Conversation selector */}
      {conversations.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold">Your Conversations</h3>
          <ul>
            {conversations.map((conv) => (
              <li key={conv.id} className="flex items-center space-x-3">
                {editingConvId === conv.id ? (
                  <>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter new title"
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={async () => {
                        await updateConversation(conv.id, { title: newTitle });
                        setEditingConvId(null);
                        setNewTitle("");
                      }}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingConvId(null);
                        setNewTitle("");
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => loadMessages(conv.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {conv.title}
                    </button>
                    <button
                      onClick={() => {
                        setEditingConvId(conv.id);
                        setNewTitle(conv.title);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => generateResume(conversationId)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Generate Resume
                    </button>
                    <button
                      onClick={() => getGeneratedResume(conversationId)}
                      className="text-sm text-blue-600 hover:text-blue-800 ml-3"
                    >
                      View Resume
                    </button>

                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ChatLayout
        messages={messages}
        renderMessage={renderMessage}
        inputProps={{
          value: userInput,
          onChange: handleChange,
          onKeyDown: handleKeyPress,
          onSend: handleSendMessage,
        }}
      />
    </div>
  );
};

export default CvBuilder;
