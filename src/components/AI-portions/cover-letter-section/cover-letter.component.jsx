import React, { useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import ChatLayout from "../reusable-components/chat-layout.component";
import AnimatedMessage from "../reusable-components/animated-message.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";
import { useDocumentBuilder } from "../custom-hooks/useDocumentBuilder";
import { useDashboardActions } from "../../../context/DashboardActionsContext";

/**
 * Converts a StructuredDocumentJson object (returned by the backend) into a
 * readable string. Falls back gracefully for plain-string or unknown shapes.
 */
const renderDocumentContent = (doc) => {
  const content = doc?.content;
  if (!content) return JSON.stringify(doc, null, 2);
  if (typeof content === "string") return content;
  // StructuredDocumentJson: { sections: [{ heading, paragraphs, bullets }] }
  if (Array.isArray(content.sections)) {
    return content.sections
      .flatMap((s) => {
        const parts = [];
        if (s.heading) {
          parts.push(`${s.heading.toUpperCase()}`);
          parts.push("─".repeat(Math.min(s.heading.length, 40)));
        }
        (s.paragraphs || []).forEach((p) => parts.push(p));
        (s.bullets || []).forEach((b) => parts.push(`• ${b}`));
        return parts;
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return JSON.stringify(content, null, 2);
};

const CoverLetter = () => {
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

    handleGenerateDocument,
    handleDeleteDocument,
  } = useDocumentBuilder();

  // Register "New Chat" with the dashboard top bar
  const { registerNewChat } = useDashboardActions();
  useEffect(() => {
    registerNewChat(handleNewChat);
    return () => registerNewChat(null);
  }, []); // handleNewChat is stable — defined once in the hook

  const displayMessages = isSending
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

  // Full-screen skeleton while initializing
  if (isInitializing)
    return (
      <div className="px-[5%] pt-10 pb-5 min-h-screen animate-pulse">
        <div className="h-16 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl mb-10" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl" />
          ))}
        </div>
      </div>
    );

  // Document preview view
  if (document)
    return (
      <div className="mt-10 p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Generated Document</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setDocument(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-[#2d2d2d] text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3d3d3d]"
            >
              ← Back to Chat
            </button>
            <button
              onClick={handleDeleteDocument}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="border rounded p-6 bg-white dark:bg-[#121212] overflow-y-auto max-h-[70vh]">
          <pre className="whitespace-pre-wrap text-[15px] leading-relaxed font-sans">
            {renderDocumentContent(document)}
          </pre>
        </div>
      </div>
    );

  return (
    <div className="px-[5%] py-10">
      {/* Header — no New Chat button here; it lives in the top navbar */}
      <div className="flex items-center space-x-3 mb-6 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold">
            Cover Letter & Professional Statement Builder
          </h2>
          <p className="text-[20px]">
            Let's create compelling documents tailored to your needs
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
          onClick={handleGenerateDocument}
          disabled={isGenerating}
          className="px-8 py-3 bg-indigo-600 text-white text-[18px] font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "Generating…" : "Generate Document"}
        </button>
      </div>
    </div>
  );
};

export default CoverLetter;
