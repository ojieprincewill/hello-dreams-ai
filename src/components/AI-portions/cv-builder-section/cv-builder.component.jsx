import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
import { isCreditLimitError } from "../../../utils/creditErrors";
import { UserIcon } from "@heroicons/react/24/outline";
import { useResume } from "../../../context/ResumeContext";
import {
  useCreateResumeConversation,
  useDeleteResume,
  useFetchGeneratedResume,
  useGenerateResume,
  useResumeConversations,
  useResumeConversation,
  useSendResumeMessage,
} from "../../../hooks/ai/useResumeBuilder";
import ChatLayout from "../reusable-components/chat-layout.component";
import ChatMessageRenderer from "../reusable-components/chat-message-renderer.component";
import CVPreview from "./cv-preview.component";
import { useDashboardActions } from "../../../context/DashboardActionsContext";
import { getResumeConversation } from "../../../api/resumeBuilderService";

const mapApiMessages = (apiMessages) =>
  apiMessages.map((m, i) => ({
    id: i + 1,
    sender: m.role === "user" ? "user" : "ai",
    content: m.content,
    timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

const CvBuilder = ({ requestedConversationId, onConversationLoaded }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const initializedRef = useRef(false);
  const recoveringEmptyRef = useRef(false);
  const { registerNewChat } = useDashboardActions();
  const { refresh: refreshResume } = useResume();

  const conversationsQuery = useResumeConversations();
  const conversationQuery = useResumeConversation(conversationId);

  const createConversationMutation = useCreateResumeConversation();
  const sendMessageMutation = useSendResumeMessage();
  const generateResumeMutation = useGenerateResume();
  const fetchGeneratedResumeMutation = useFetchGeneratedResume();
  const deleteResumeMutation = useDeleteResume();

  const isUuid = (value) => {
    const v = String(value ?? "");
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      v,
    );
  };

  const conversationIdIsValid = isUuid(conversationId);

  // Persist conversationId across refreshes
  useEffect(() => {
    if (conversationId)
      localStorage.setItem("cvConversationId", conversationId);
  }, [conversationId]);

  // Load a specific conversation when navigated from history
  useEffect(() => {
    if (!requestedConversationId) return;
    setConversationId(requestedConversationId);
    onConversationLoaded?.();
  }, [requestedConversationId]); // eslint-disable-line

  // Create or restore conversation once when component mounts
  useEffect(() => {
    const run = async () => {
      if (initializedRef.current) return;
      if (!conversationsQuery.isSuccess) return;
      initializedRef.current = true;

      try {
        const data = conversationsQuery.data;

        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
          // Prefer the conversation the user was last working on
          const savedId = localStorage.getItem("cvConversationId");
          const savedConv = savedId
            ? sorted.find((c) => c.id === savedId)
            : null;
          const target = savedConv || sorted[0];
          setConversationId(target.id);
        } else {
          const newConv = await createConversationMutation.mutateAsync({
            payload: {
              title: "My Resume",
              targetJobTitle: "Software Engineer",
              targetIndustry: "Technology",
            },
          });
          setConversationId(newConv.id);
          if (newConv.messages?.length) {
            setMessages(mapApiMessages(newConv.messages));
          }
        }
      } catch (err) {
        console.error("Error initializing CvBuilder:", err);
        if (!isNetworkError(err))
          toast.error(err.message || "Failed to create conversation");
      }
    };

    run();
  }, [conversationsQuery.isSuccess, conversationsQuery.data]); // eslint-disable-line

  // Sync messages when a conversation loads; recover empty conversations
  useEffect(() => {
    const run = async () => {
      if (!conversationQuery.data || conversationQuery.isLoading) return;
      const apiMessages = conversationQuery.data.messages;
      if (apiMessages?.length) {
        setMessages(mapApiMessages(apiMessages));
        return;
      }
      if (recoveringEmptyRef.current || !conversationId) return;
      recoveringEmptyRef.current = true;
      localStorage.removeItem("cvConversationId");
      try {
        const newConv = await createConversationMutation.mutateAsync({
          payload: {
            title: "My Resume",
            targetJobTitle: "Software Engineer",
            targetIndustry: "Technology",
          },
        });
        setConversationId(newConv.id);
        if (newConv.messages?.length) {
          setMessages(mapApiMessages(newConv.messages));
          return;
        }
        const loaded = await getResumeConversation(newConv.id);
        if (loaded.messages?.length) {
          setMessages(mapApiMessages(loaded.messages));
        }
      } catch (err) {
        if (!isNetworkError(err))
          toast.error(err.message || "Failed to start a new conversation");
      } finally {
        recoveringEmptyRef.current = false;
      }
    };
    run();
  }, [conversationQuery.data, conversationQuery.isLoading, conversationId]); // eslint-disable-line

  // Send message (same as before, but using apiFetch)
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!conversationIdIsValid) {
      toast.error("Please wait for the CV conversation to initialize.");
      return;
    }

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
      const data = await sendMessageMutation.mutateAsync({
        conversationId,
        content: newMessage.content,
      });
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
      if (!isNetworkError(err) && !isCreditLimitError(err)) toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  // Generate resume for a conversation
  const generateResume = async (id) => {
    try {
      setLoading(true);
      if (!isUuid(id)) {
        toast.error("Please wait for the CV conversation to initialize.");
        return null;
      }
      const resumeData = await generateResumeMutation.mutateAsync({
        conversationId: id,
      });
      toast.success("Resume generated successfully");

      // ✅ Store resume in state for preview (mapped to template shape)
      setResume(mapResumeToTemplateData(resumeData));
      refreshResume(); // update cross-module resume context

      return resumeData;
    } catch (err) {
      console.error("Error generating resume:", err);
      if (!isNetworkError(err)) toast.error("Error generating resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get generated resume for a conversation
  const getGeneratedResume = async (id) => {
    try {
      setLoading(true);
      if (!isUuid(id)) {
        toast.error("Please wait for the CV conversation to initialize.");
        return null;
      }

      const resumeData = await fetchGeneratedResumeMutation.mutateAsync({
        conversationId: id,
      });
      toast.success("Resume fetched successfully");

      // ✅ Store mapped resume so the template receives the right shape
      setResume(mapResumeToTemplateData(resumeData));

      return resumeData;
    } catch (err) {
      console.error("Error fetching resume:", err);
      if (!isNetworkError(err)) toast.error("Error fetching resume");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete resume for a conversation
  const deleteResume = async (id) => {
    try {
      setLoading(true);
      if (!isUuid(id)) {
        toast.error("Please wait for the CV conversation to initialize.");
        return false;
      }
      await deleteResumeMutation.mutateAsync({ conversationId: id });

      toast.success("Resume deleted successfully");

      // ✅ Clear resume state so UI updates immediately
      setResume(null);

      return true;
    } catch (err) {
      console.error("Error deleting resume:", err);
      if (!isNetworkError(err)) toast.error("Error deleting resume");
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

  // Transform the backend ResumeDto { content: ResumeJson, ... } into the flat
  // shape the CV templates expect.
  const mapResumeToTemplateData = (resumeDto) => {
    const content = resumeDto?.content || {};
    const contact = content.contact || {};
    const links = contact.links || {};

    return {
      name: contact.fullName || "",
      title: content.targetJobTitle || "",
      contact: {
        phone: contact.phone || "",
        email: contact.email || "",
        location: contact.location || "",
        linkedin: links.linkedIn || "",
        portfolio: links.portfolio || "",
        behance: links.other?.[0] || "",
      },
      summary: content.summary || "",
      experience: (content.workExperience || []).map((job) => ({
        company: job.company || "",
        title: job.jobTitle || "",
        dates: [job.startDate, job.endDate || "Present"]
          .filter(Boolean)
          .join(" – "),
        bullets: [
          ...(job.achievements || []),
          ...(job.responsibilities || []),
          ...(job.highlights || []),
        ],
      })),
      education: (content.education || []).map((edu) =>
        [edu.degree, edu.institution, edu.graduationYear]
          .filter(Boolean)
          .join(" — "),
      ),
      // Senior template: object of category → string[]
      toolsSkills: Object.fromEntries(
        Object.entries({
          "Core Skills": content.skills?.core,
          Technical: content.skills?.technical,
          Tools: content.skills?.tools,
          "Soft Skills": content.skills?.soft,
          Languages: content.skills?.languages,
        }).filter(([, v]) => Array.isArray(v) && v.length > 0),
      ),
      // Junior template: flat array
      skills: [
        ...(content.skills?.core || []),
        ...(content.skills?.technical || []),
        ...(content.skills?.soft || []),
        ...(content.skills?.tools || []),
      ],
      achievements: (content.achievements || []).map((a) =>
        [a.title, a.description].filter(Boolean).join(": "),
      ),
      certifications: content.certifications || [],
      projects: content.projects || [],
      level: resumeDto.level || "junior",
    };
  };

  const handleGenerateResume = async () => {
    const hasUserMessages = messages.some((m) => m.sender === "user");

    if (!hasUserMessages) {
      // If the user hasn't chatted, show their existing resume from localStorage
      // instead of generating dummy content from an empty conversation.
      try {
        const stored = localStorage.getItem("latestResume");
        if (stored) {
          const latest = JSON.parse(stored);
          if (latest?.content) {
            setResume(mapResumeToTemplateData(latest));
            return;
          }
        }
      } catch {}

      // No stored resume — prompt the user to chat first
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "ai",
          content:
            "I don't have enough information about you yet. Please tell me about yourself in the chat above — your name, work experience, and target role — and I'll build a personalised resume for you.",
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

    generateResume(conversationId);
  };
  const handleGetResume = () => getGeneratedResume(conversationId);
  const handleDeleteResume = () => deleteResume(conversationId);

  const handleNewChat = async () => {
    try {
      setLoading(true);
      const newConv = await createConversationMutation.mutateAsync({
        payload: {
          title: "My Resume",
          targetJobTitle: "Software Engineer",
          targetIndustry: "Technology",
        },
      });
      setConversationId(newConv.id);
      if (newConv.messages?.length) {
        setMessages(mapApiMessages(newConv.messages));
      } else {
        const loaded = await getResumeConversation(newConv.id);
        setMessages(mapApiMessages(loaded.messages || []));
      }
      setResume(null);
    } catch (err) {
      if (!isNetworkError(err))
        toast.error(err.message || "Failed to create new chat");
    } finally {
      setLoading(false);
    }
  };

  // Register "New Chat" with the dashboard top bar
  useEffect(() => {
    registerNewChat(handleNewChat);
    return () => registerNewChat(null);
  }, []); // eslint-disable-line

  const displayMessages = sendMessageMutation.isPending
    ? [...messages, { id: "typing", sender: "ai", typing: true, content: "" }]
    : messages;

  const renderMessage = (message) => <ChatMessageRenderer message={message} />;

  // Allow generate if the AI has signalled readiness OR the user already has a
  // stored resume from a previous session (so returning users can view it).
  const hasStoredResume = (() => {
    try {
      const raw = localStorage.getItem("latestResume");
      return raw ? !!JSON.parse(raw)?.content : false;
    } catch {
      return false;
    }
  })();
  const aiSignalledReady = messages.some(
    (m) => m.sender === "ai" && m.content.includes("Generate Resume"),
  );
  const canGenerate = aiSignalledReady || hasStoredResume;

  const isInitializing = conversationsQuery.isLoading && !conversationId;

  if (isInitializing)
    return (
      <div className="px-[5%] py-6 md:pt-10 md:pb-5 animate-pulse min-h-[60vh]">
        <div className="h-12 md:h-16 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl mb-6 md:mb-10" />
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="h-24 md:h-32 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl" />
          <div className="flex justify-end">
            <div className="w-[60%] h-14 md:h-16 bg-[#e2e2e2] dark:bg-[#151515] rounded-2xl" />
          </div>
          <div className="h-20 md:h-24 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl" />
        </div>
      </div>
    );

  if (resume)
    return (
      <div className="mt-6 md:mt-10 p-4 md:p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a] max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h3 className="text-base md:text-lg font-bold">Generated Resume</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setResume(null)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-[#2d2d2d] text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3d3d3d]"
            >
              ← Back to Chat
            </button>
            <button
              onClick={handleDeleteResume}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Resume
            </button>
          </div>
        </div>
        <CVPreview data={resume} />
      </div>
    );

  return (
    <div className="px-4 md:px-[5%] pt-6 md:pt-10 pb-5 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-8 md:mb-10 pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
          <div>
            <h2 className="text-[20px] md:text-[24px] font-extrabold">
              CV Builder
            </h2>
            <p className="text-sm md:text-[18px] text-[#667085] dark:text-gray-400">
              Let's have a conversation to build you the perfect CV
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatLayout
          messages={displayMessages}
          renderMessage={renderMessage}
          inputProps={{
            value: userInput,
            handleChange,
            handleKeyPress,
            handleSendMessage,
          }}
        />
      </div>

      <div className="mt-2 md:mt-4 flex flex-col items-center gap-2">
        {canGenerate && (
          <button
            onClick={handleGenerateResume}
            disabled={loading || !conversationIdIsValid || !canGenerate}
            className="px-4 md:px-8 py-2 md:py-3 bg-indigo-600 text-white text-[14px] md:text-[16px] lg:text-[18px] font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating…" : "Generate Resume"}
          </button>
        )}
        {!canGenerate && (
          <p className="text-sm text-[#667085] dark:text-gray-400 text-center">
            Continue the conversation — the AI will let you know when it has
            enough to build your resume.
          </p>
        )}
      </div>
    </div>
  );
};

export default CvBuilder;
