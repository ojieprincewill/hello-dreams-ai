import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UserIcon, CheckCircleIcon, SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { isNetworkError } from "../../../utils/networkError";
import ChatLayout from "../reusable-components/chat-layout.component";
import AnimatedMessage from "../reusable-components/animated-message.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";
import {
  useCareerConversations,
  useCareerConversation,
  useCreateCareerConversation,
  useSendCareerMessage,
  useGenerateCareerSummary,
  useCompleteCareerConversation,
} from "../custom-hooks/useCareerProfile";

// ── Profile summary card ──────────────────────────────────────────────────────

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[#eaecf0] dark:border-[#2d2d2d] last:border-0">
      <span className="text-xs font-medium text-[#667085] dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#010413] dark:text-white">{value}</span>
    </div>
  );
};

const ProfileSummaryView = ({ summary, onRegenerate, onComplete, isCompleting }) => {
  const basic = summary?.basicInfo ?? {};
  const target = summary?.targetJob ?? {};
  const extracted = summary?.extractedData ?? {};

  const locationParts = [basic.city, basic.state, basic.country].filter(Boolean);

  return (
    <div className="px-[5%] pt-10 pb-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="w-10 h-10 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center shrink-0">
          <SparklesIcon className="w-5 h-5 text-[#1342ff]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#010413] dark:text-white">Your Career Profile</h2>
          <p className="text-sm text-[#667085] dark:text-gray-400">Review what we've captured about you</p>
        </div>
      </div>

      {/* Contact info */}
      {(basic.name || basic.email || basic.phone || locationParts.length > 0 || basic.linkedIn) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">Contact Information</h3>
          <InfoRow label="Full name" value={basic.name} />
          <InfoRow label="Email" value={basic.email} />
          <InfoRow label="Phone" value={basic.phone} />
          {locationParts.length > 0 && <InfoRow label="Location" value={locationParts.join(", ")} />}
          <InfoRow label="LinkedIn" value={basic.linkedIn} />
        </div>
      )}

      {/* Career goals */}
      {(target.targetJobTitle || target.careerGoal || target.salaryExpectation) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">Career Goals</h3>
          <InfoRow label="Target role" value={target.targetJobTitle} />
          <InfoRow label="Career goal" value={target.careerGoal} />
          <InfoRow label="Salary expectation" value={target.salaryExpectation} />
        </div>
      )}

      {/* Background */}
      {(extracted.background || extracted.experience || extracted.education) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">Professional Background</h3>
          <InfoRow label="Background" value={extracted.background} />
          <InfoRow label="Experience" value={extracted.experience} />
          <InfoRow label="Education" value={extracted.education} />
        </div>
      )}

      {/* Skills */}
      {Array.isArray(extracted.skills) && extracted.skills.length > 0 && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {extracted.skills.map((skill, i) => (
              <span key={i} className="text-xs px-3 py-1 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] text-sm font-medium text-[#667085] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Back to Chat
        </button>
        <button
          onClick={onComplete}
          disabled={isCompleting}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1342ff] hover:bg-[#0f35d9] text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <CheckCircleIcon className="w-4 h-4" />
          {isCompleting ? "Saving…" : "Confirm & Complete"}
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const GetToKnowYou = ({ requestedConversationId, onConversationLoaded }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [completed, setCompleted] = useState(false);

  const initializedRef = useRef(false);

  const conversationsQuery = useCareerConversations();
  const conversationQuery = useCareerConversation(conversationId);
  const createConversationMutation = useCreateCareerConversation();
  const sendMessageMutation = useSendCareerMessage();
  const generateSummaryMutation = useGenerateCareerSummary();
  const completeConversationMutation = useCompleteCareerConversation();

  const isUuid = (v) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      String(v ?? ""),
    );

  const conversationIdIsValid = isUuid(conversationId);
  const hasUserMessages = messages.some((m) => m.sender === "user");

  // Persist conversationId across refreshes
  useEffect(() => {
    if (conversationId) localStorage.setItem("careerConversationId", conversationId);
  }, [conversationId]);

  // Load a specific conversation when navigated from history
  useEffect(() => {
    if (!requestedConversationId) return;
    setConversationId(requestedConversationId);
    onConversationLoaded?.();
  }, [requestedConversationId]); // eslint-disable-line

  // Create or restore conversation on mount
  useEffect(() => {
    const run = async () => {
      if (initializedRef.current) return;
      if (!conversationsQuery.isSuccess) return;
      initializedRef.current = true;

      try {
        const data = conversationsQuery.data;

        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          const savedId = localStorage.getItem("careerConversationId");
          const target = (savedId ? sorted.find((c) => c.id === savedId) : null) ?? sorted[0];
          setConversationId(target.id);
        } else {
          const newConv = await createConversationMutation.mutateAsync({ title: "Career Profile" });
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
        console.error("Error initializing career profile:", err);
        if (!isNetworkError(err)) toast.error(err.message || "Failed to load career profile");
      }
    };

    run();
  }, [conversationsQuery.isSuccess, conversationsQuery.data]); // eslint-disable-line

  // Sync messages when conversation data loads
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

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!conversationIdIsValid) {
      toast.error("Please wait for the conversation to initialize.");
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      setLoading(true);
      const data = await sendMessageMutation.mutateAsync({ conversationId, content: newMessage.content });
      const aiContent = data?.content || "I'm here, keep going!";
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id + 1,
          sender: "ai",
          content: aiContent,
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      if (!isNetworkError(err)) toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!conversationIdIsValid) {
      toast.error("Please wait for the conversation to initialize.");
      return;
    }
    try {
      setLoading(true);
      const data = await generateSummaryMutation.mutateAsync(conversationId);
      setSummary(data?.summary ?? data);
    } catch (err) {
      console.error("Error generating summary:", err);
      if (!isNetworkError(err)) toast.error("Failed to generate profile summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await completeConversationMutation.mutateAsync(conversationId);
      setCompleted(true);
      toast.success("Career profile complete! Your progress has been updated.");
    } catch (err) {
      console.error("Error completing profile:", err);
      if (!isNetworkError(err)) toast.error("Failed to save completion. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e) => setUserInput(e.target.value);

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
            <p className="max-w-[453px] w-full text-[20px] leading-relaxed">{message.content}</p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[16px] mt-2">{message.timestamp}</p>
          </div>
        )
      ) : (
        <div className="flex justify-end my-5">
          <div className="w-max bg-[#e2e2e2] dark:bg-[#151515] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
            <p className="max-w-[453px] w-full text-[20px] leading-relaxed">{message.content}</p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[16px] mt-2 text-right">{message.timestamp}</p>
          </div>
        </div>
      )}
    </AnimatedMessage>
  );

  // ── Completed state ──────────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-[5%]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#010413] dark:text-white mb-2">Profile Complete!</h2>
        <p className="text-[#667085] dark:text-gray-400 text-base max-w-md">
          Your career profile has been saved. The rest of your modules will use this context to personalise your experience.
        </p>
      </div>
    );
  }

  // ── Summary view ─────────────────────────────────────────────────────────────
  if (summary) {
    return (
      <ProfileSummaryView
        summary={summary}
        onRegenerate={() => setSummary(null)}
        onComplete={handleComplete}
        isCompleting={completeConversationMutation.isPending}
      />
    );
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  const isInitializing = conversationsQuery.isLoading && !conversationId;
  if (isInitializing) {
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
  }

  // ── Chat view ────────────────────────────────────────────────────────────────
  return (
    <div className="px-[5%] pt-10 pb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-6 w-6" />
          <div>
            <h2 className="text-[24px] font-extrabold">Getting to Know You</h2>
            <p className="text-[18px] text-[#667085] dark:text-gray-400">
              Chat naturally — the AI will guide you through building your career profile
            </p>
          </div>
        </div>

        {hasUserMessages && (
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1342ff] hover:bg-[#0f35d9] text-white text-sm font-semibold transition-colors disabled:opacity-60 shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            {loading ? "Generating…" : "Generate Profile Summary"}
          </button>
        )}
      </div>

      {/* Chat */}
      <ChatLayout
        messages={displayMessages}
        renderMessage={renderMessage}
        inputProps={{
          value: userInput,
          handleChange,
          handleKeyPress,
          handleSendMessage,
          placeholder: "Tell me about yourself…",
        }}
      />
    </div>
  );
};

export default GetToKnowYou;
