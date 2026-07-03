import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  UserIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { isNetworkError } from "../../../utils/networkError";
import { isCreditLimitError } from "../../../utils/creditErrors";
import ChatLayout from "../reusable-components/chat-layout.component";
import ChatMessageRenderer from "../reusable-components/chat-message-renderer.component";
import {
  useCareerConversations,
  useCareerConversation,
  useCreateCareerConversation,
  useSendCareerMessage,
  useGenerateCareerSummary,
  useCompleteCareerConversation,
} from "../custom-hooks/useCareerProfile";
import * as careerProfileService from "../module-services/careerProfileService";

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

// ── Profile summary card ──────────────────────────────────────────────────────

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[#eaecf0] dark:border-[#2d2d2d] last:border-0">
      <span className="text-xs font-medium text-[#667085] dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-[#010413] dark:text-white">{value}</span>
    </div>
  );
};

const ProfileSummaryView = ({
  summary,
  onRegenerate,
  onComplete,
  isCompleting,
}) => {
  const basic = summary?.basicInfo ?? {};
  const target = summary?.targetJob ?? {};
  const extracted = summary?.extractedData ?? {};

  const locationParts = [basic.city, basic.state, basic.country].filter(
    Boolean,
  );

  return (
    <div className="px-4 sm:px-[5%] pt-6 sm:pt-10 pb-6 sm:pb-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 mb-4 md:mb-6 pb-4 sm:pb-5 border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="w-10 h-10 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center shrink-0">
          <SparklesIcon className="w-5 h-5 text-[#1342ff]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#010413] dark:text-white">
            Your Career Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] dark:text-gray-400 leading-relaxed">
            Review what we've captured about you
          </p>
        </div>
      </div>

      {/* Contact info */}
      {(basic.name ||
        basic.email ||
        basic.phone ||
        locationParts.length > 0 ||
        basic.linkedIn) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-4 sm:p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">
            Contact Information
          </h3>
          <InfoRow label="Full name" value={basic.name} />
          <InfoRow label="Email" value={basic.email} />
          <InfoRow label="Phone" value={basic.phone} />
          {locationParts.length > 0 && (
            <InfoRow label="Location" value={locationParts.join(", ")} />
          )}
          <InfoRow label="LinkedIn" value={basic.linkedIn} />
        </div>
      )}

      {/* Career goals */}
      {(target.targetJobTitle ||
        target.careerGoal ||
        target.salaryExpectation) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-4 sm:p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">
            Career Goals
          </h3>
          <InfoRow label="Target role" value={target.targetJobTitle} />
          <InfoRow label="Career goal" value={target.careerGoal} />
          <InfoRow
            label="Salary expectation"
            value={target.salaryExpectation}
          />
        </div>
      )}

      {/* Background */}
      {(extracted.background ||
        extracted.experience ||
        extracted.education) && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-4 sm:p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">
            Professional Background
          </h3>
          <InfoRow label="Background" value={extracted.background} />
          <InfoRow label="Experience" value={extracted.experience} />
          <InfoRow label="Education" value={extracted.education} />
        </div>
      )}

      {/* Skills */}
      {Array.isArray(extracted.skills) && extracted.skills.length > 0 && (
        <div className="bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-2xl p-4 sm:p-5 mb-6">
          <h3 className="text-sm font-semibold text-[#010413] dark:text-white mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {extracted.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={onRegenerate}
          className="
  flex items-center justify-center gap-2
  w-full sm:w-auto
  px-4 py-2
  rounded-xl
  border border-[#eaecf0]
  dark:border-[#2d2d2d]
  text-sm font-medium
  text-[#667085] dark:text-gray-400
  hover:bg-gray-50 dark:hover:bg-[#2d2d2d]
  transition-colors
"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Back to Chat
        </button>
        <button
          onClick={onComplete}
          disabled={isCompleting}
          className="
  flex items-center justify-center gap-2
  w-full sm:w-auto
  px-4 sm:px-5 py-2
  rounded-xl
  bg-[#1342ff] hover:bg-[#0f35d9]
  text-white text-sm font-semibold
  transition-colors
  disabled:opacity-60
"
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
  const recoveringEmptyRef = useRef(false);

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
    if (conversationId)
      localStorage.setItem("careerConversationId", conversationId);
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
          const sorted = [...data].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
          const savedId = localStorage.getItem("careerConversationId");
          const target =
            (savedId ? sorted.find((c) => c.id === savedId) : null) ??
            sorted[0];
          setConversationId(target.id);
        } else {
          const newConv = await createConversationMutation.mutateAsync({
            title: "Career Profile",
          });
          setConversationId(newConv.id);
          if (newConv.messages?.length) {
            setMessages(mapApiMessages(newConv.messages));
          }
        }
      } catch (err) {
        console.error("Error initializing career profile:", err);
        if (!isNetworkError(err))
          toast.error(err.message || "Failed to load career profile");
      }
    };

    run();
  }, [conversationsQuery.isSuccess, conversationsQuery.data]); // eslint-disable-line

  // Sync messages when conversation data loads; recover empty conversations
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
      localStorage.removeItem("careerConversationId");
      try {
        const newConv = await createConversationMutation.mutateAsync({
          title: "Career Profile",
        });
        setConversationId(newConv.id);
        if (newConv.messages?.length) {
          setMessages(mapApiMessages(newConv.messages));
          return;
        }
        const loaded = await careerProfileService.getConversation(newConv.id);
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
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      setLoading(true);
      const data = await sendMessageMutation.mutateAsync({
        conversationId,
        content: newMessage.content,
      });
      const aiContent = data?.content || "I'm here, keep going!";
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
      if (!isNetworkError(err) && !isCreditLimitError(err)) toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceMessage = async () => {
    if (!conversationIdIsValid) {
      toast.error("Please wait for the conversation to initialize.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        try {
          setLoading(true);
          const data = await careerProfileService.sendVoiceMessage(
            conversationId,
            blob,
          );
          const userText = data?.userMessage?.content || data?.transcription;
          if (userText) {
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                sender: "user",
                content: userText,
                timestamp: new Date().toLocaleTimeString("en-GB", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
              },
            ]);
          }
          if (data?.content) {
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 2,
                sender: "ai",
                content: data.content,
                timestamp: new Date().toLocaleTimeString("en-GB", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
              },
            ]);
          }
        } catch (err) {
          if (!isNetworkError(err))
            toast.error(err.message || "Voice message failed");
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      toast.success("Recording… speak now (auto-stops in 15s)");
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 15000);
    } catch {
      toast.error("Microphone access denied or unavailable.");
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !conversationIdIsValid) return;
    try {
      setLoading(true);
      await careerProfileService.uploadCV(conversationId, file);
      toast.success("CV uploaded successfully");
    } catch (err) {
      if (!isNetworkError(err))
        toast.error(err.message || "CV upload failed");
    } finally {
      setLoading(false);
      e.target.value = "";
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
      if (!isNetworkError(err))
        toast.error("Failed to generate profile summary. Please try again.");
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
      if (!isNetworkError(err))
        toast.error("Failed to save completion. Please try again.");
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

  const renderMessage = (message) => <ChatMessageRenderer message={message} />;

  // ── Completed state ──────────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] md:min-h-[60vh] text-center px-4 sm:px-[5%]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#010413] dark:text-white mb-2">
          Profile Complete!
        </h2>

        <p className="text-sm sm:text-base leading-relaxed text-[#667085] dark:text-gray-400 max-w-md w-full">
          Your career profile has been saved. The rest of your modules will use
          this context to personalise your experience.
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
  }

  // ── Chat view ────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 md:px-[5%] pt-6 md:pt-10 pb-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-8 md:mb-10 pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
          <div>
            <h2 className="text-[20px] md:text-[24px] font-extrabold">
              Getting to Know You
            </h2>
            <p className="text-sm md:text-[18px] text-[#667085] dark:text-gray-400">
              Chat naturally — the AI will guide you through building your
              career profile
            </p>
          </div>
        </div>

        {hasUserMessages && (
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex justify-center items-center gap-2 px-3 md:px-5 py-2 rounded-xl bg-[#1342ff] hover:bg-[#0f35d9] text-white text-xs md:text-sm font-semibold transition-colors disabled:opacity-60 shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            {loading ? "Generating…" : "Generate Profile Summary"}
          </button>
        )}
        <label className="flex justify-center items-center gap-2 px-3 md:px-5 py-2 rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] text-xs md:text-sm font-semibold cursor-pointer shrink-0">
          Upload CV
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleCvUpload}
          />
        </label>
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatLayout
          messages={displayMessages}
          renderMessage={renderMessage}
          inputProps={{
            value: userInput,
            handleChange,
            handleKeyPress,
            handleSendMessage,
            handleVoiceMessage,
            placeholder: "Tell me about yourself…",
          }}
        />
      </div>
    </div>
  );
};

export default GetToKnowYou;
