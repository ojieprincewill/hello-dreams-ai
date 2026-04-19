import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
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
import AnimatedMessage from "../reusable-components/animated-message.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";
import CVPreview from "./cv-preview.component";
import { useDashboardActions } from "../../../context/DashboardActionsContext";
import { preGenerateCheck } from "../../../utils/preGenerateCheck";

const CvBuilder = ({ requestedConversationId, onConversationLoaded }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const initializedRef = useRef(false);
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
    if (conversationId) localStorage.setItem("cvConversationId", conversationId);
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
          const savedConv = savedId ? sorted.find((c) => c.id === savedId) : null;
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
            setMessages(
              newConv.messages.map((m, i) => ({
                id: i + 1,
                sender: m.role === "user" ? "user" : "ai",
                content: m.content,
                timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
                  hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
                }),
              })),
            );
          }
        }
      } catch (err) {
        console.error("Error initializing CvBuilder:", err);
        if (!isNetworkError(err)) toast.error(err.message || "Failed to create conversation");
      }
    };

    run();
  }, [conversationsQuery.isSuccess, conversationsQuery.data]); // eslint-disable-line

  // Sync messages when a conversation loads
  useEffect(() => {
    if (!conversationQuery.data?.messages) return;
    setMessages(
      conversationQuery.data.messages.map((m, i) => ({
        id: i + 1,
        sender: m.role === "user" ? "user" : "ai",
        content: m.content,
        timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
          hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
        }),
      })),
    );
  }, [conversationQuery.data]);

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
      if (!isNetworkError(err)) toast.error("Error sending message");
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
        dates: [job.startDate, job.endDate || "Present"].filter(Boolean).join(" – "),
        bullets: [
          ...(job.achievements || []),
          ...(job.responsibilities || []),
          ...(job.highlights || []),
        ],
      })),
      education: (content.education || []).map((edu) =>
        [edu.degree, edu.institution, edu.graduationYear].filter(Boolean).join(" — ")
      ),
      // Senior template: object of category → string[]
      toolsSkills: Object.fromEntries(
        Object.entries({
          "Core Skills": content.skills?.core,
          Technical: content.skills?.technical,
          Tools: content.skills?.tools,
          "Soft Skills": content.skills?.soft,
          Languages: content.skills?.languages,
        }).filter(([, v]) => Array.isArray(v) && v.length > 0)
      ),
      // Junior template: flat array
      skills: [
        ...(content.skills?.core || []),
        ...(content.skills?.technical || []),
        ...(content.skills?.soft || []),
        ...(content.skills?.tools || []),
      ],
      achievements: (content.achievements || []).map((a) =>
        [a.title, a.description].filter(Boolean).join(": ")
      ),
      certifications: content.certifications || [],
      projects: content.projects || [],
      level: resumeDto.level || "junior",
    };
  };

  const handleGenerateResume = async () => {
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
      setMessages(
        (newConv.messages || []).map((m, i) => ({
          id: i + 1,
          sender: m.role === "user" ? "user" : "ai",
          content: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
            hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
          }),
        })),
      );
      setResume(null);
    } catch (err) {
      if (!isNetworkError(err)) toast.error(err.message || "Failed to create new chat");
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

  const renderMessage = (message) => (
    <AnimatedMessage key={message.id}>
      {message.sender === "ai" ? (
        message.typing ? (
          <AiTypingIndicator />
        ) : (
          <div className="w-max bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
            <p className="max-w-[453px] w-full text-[20px] leading-relaxed">
              {message.content}
            </p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[16px] mt-2">
              {message.timestamp}
            </p>
          </div>
        )
      ) : (
        <div className="flex justify-end my-5">
          <div className="w-max bg-[#e2e2e2] dark:bg-[#151515] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
            <p className="max-w-[453px] w-full text-[20px] leading-relaxed">
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

  const isInitializing = conversationsQuery.isLoading && !conversationId;

  if (isInitializing)
    return (
      <div className="px-[5%] pt-10 pb-5 animate-pulse">
        <div className="h-16 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl mb-10" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (resume)
    return (
      <div className="mt-10 p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Generated Resume</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setResume(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-[#2d2d2d] text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3d3d3d]"
            >
              ← Back to Chat
            </button>
            <button
              onClick={handleDeleteResume}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Resume
            </button>
          </div>
        </div>
        <CVPreview data={resume} />
      </div>
    );

  return (
    <div className="px-[5%] pt-10 pb-5">
      <div className="flex items-center space-x-3 mb-10 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold">CV Builder</h2>
          <p className="text-[20px]">
            Let's have a conversation to build you the perfect CV
          </p>
        </div>
      </div>

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

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleGenerateResume}
          disabled={loading || !conversationIdIsValid}
          className="px-8 py-3 bg-indigo-600 text-white text-[18px] font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating…" : "Generate Resume"}
        </button>
      </div>
    </div>
  );
};

export default CvBuilder;
