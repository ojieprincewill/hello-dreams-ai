import React, { useEffect, useRef } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ChatLayout from "../reusable-components/chat-layout.component";
import AnimatedMessage from "../reusable-components/animated-message.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";
import { useDocumentBuilder } from "../custom-hooks/useDocumentBuilder";
import { useDashboardActions } from "../../../context/DashboardActionsContext";
import { useResume } from "../../../context/ResumeContext";
import CoverLetterPreview from "./cover-letter-preview.component";

const CoverLetter = ({ requestedConversationId, onConversationLoaded }) => {
  const {
    messages,
    userInput,
    document,
    setDocument,

    isSending,
    isGenerating,
    isInitializing,

    handleKeyPress,
    handleChange,
    handleSendMessage,
    handleNewChat,
    loadConversation,

    handleGenerateDocument,
    handleDeleteDocument,
  } = useDocumentBuilder();

  // Register "New Chat" with the dashboard top bar
  const { registerNewChat, navigateToConversation } = useDashboardActions();
  useEffect(() => {
    registerNewChat(handleNewChat);
    return () => registerNewChat(null);
  }, []); // handleNewChat is stable — defined once in the hook

  // Load a specific conversation when navigated from history
  useEffect(() => {
    if (!requestedConversationId) return;
    loadConversation(requestedConversationId);
    onConversationLoaded?.();
  }, [requestedConversationId]); // eslint-disable-line

  // Show a one-time toast if user has no resume
  const {
    resume,
    isLoading: resumeLoading,
    refresh: refreshResume,
  } = useResume();
  const resumeToastShown = useRef(false);
  useEffect(() => {
    refreshResume();
  }, []); // eslint-disable-line
  useEffect(() => {
    if (resumeLoading || resumeToastShown.current) return;
    if (!resume) {
      resumeToastShown.current = true;
      toast(
        "Complete your CV Builder first so your cover letter can be generated from your actual resume.",
        {
          icon: "ℹ️",
          duration: 6000,
        },
      );
    }
  }, [resume, resumeLoading]);

  // Enable generate only when the AI has signalled it has enough information.
  // The system prompt instructs the AI to say "I have everything I need" or
  // "I have what I need" when it's ready — we detect that signal here.
  const aiSignalledReady = messages.some(
    (m) =>
      m.sender === "ai" &&
      (m.content.includes("I have everything I need") ||
        m.content.includes("I have what I need")),
  );

  const displayMessages = isSending
    ? [...messages, { id: "typing", sender: "ai", typing: true, content: "" }]
    : messages;

  const renderMessage = (message) => (
    <AnimatedMessage key={message.id}>
      {message.sender === "ai" ? (
        message.typing ? (
          <AiTypingIndicator />
        ) : (
          <div className="w-fit max-w-[85%] md:max-w-[70%] bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-3 md:p-4">
            <p className="text-[14px] md:text-[18px] leading-relaxed break-words">
              {message.content}
            </p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[11px] md:text-[14px] mt-2">
              {message.timestamp}
            </p>
          </div>
        )
      ) : (
        <div className="flex justify-end my-4 md:my-5">
          <div className="w-fit max-w-[85%] md:max-w-[70%] bg-[#e2e2e2] dark:bg-[#151515] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-3 md:p-4">
            <p className="text-[14px] md:text-[18px] leading-relaxed break-words">
              {message.content}
            </p>
            <p className="text-[#444] dark:text-[#bfb5b5] text-[11px] md:text-[14px] mt-2 text-right">
              {message.timestamp}
            </p>
          </div>
        </div>
      )}
    </AnimatedMessage>
  );

  // Full-screen skeleton while initializing
  if (isInitializing)
    return (
      <div className="px-[5%] py-6 md:pt-10 md:pb-5 animate-pulse min-h-[60vh]">
        <div className="h-12 md:h-16 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl mb-6 md:mb-10" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 md:h-20 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl"
            />
          ))}
        </div>
      </div>
    );

  // Document preview view
  if (document)
    return (
      <div className="mt-6 md:mt-10 p-4 md:p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a] max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h3 className="text-base md:text-lg font-bold">Generated Document</h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setDocument(null)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-[#2d2d2d] text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3d3d3d]"
            >
              ← Back to Chat
            </button>
            <button
              onClick={handleDeleteDocument}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
        <CoverLetterPreview document={document} />
      </div>
    );

  return (
    <div className="px-4 md:px-[5%] pt-6 md:pt-10 pb-5 h-full flex flex-col">
      {/* Header — no New Chat button here; it lives in the top navbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-8 md:mb-10 pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-6 w-6" />
          <div>
            <h2 className="text-[20px] md:text-[24px] font-extrabold">
              Cover Letter & Professional Statement Builder
            </h2>
            <p className="text-sm md:text-[18px] text-[#667085] dark:text-gray-400">
              Let's create compelling documents tailored to your needs
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
        <button
          onClick={handleGenerateDocument}
          disabled={isGenerating || !aiSignalledReady}
          className="px-4 md:px-8 py-2 md:py-3 bg-indigo-600 text-white text-[18px] font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "Generating…" : "Generate Document"}
        </button>
        {!aiSignalledReady && (
          <p className="text-sm text-[#667085] dark:text-gray-400 text-center">
            Continue the conversation — the AI will let you know when it has
            enough to write your document.
          </p>
        )}
      </div>
    </div>
  );
};

export default CoverLetter;
