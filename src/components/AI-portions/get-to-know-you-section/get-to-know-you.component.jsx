import React from "react";
import { ArrowRight } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/outline";
import ChatLayout from "../reusable-components/chat-layout.component";
import AnimatedMessage from "../reusable-components/animated-message.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";
import { useCareerProfile } from "../custom-hooks/useCareerProfile";

const GetToKnowYou = () => {
  const {
    messages,
    conversations,
    conversationId,
    userInput,
    loading,
    isTyping,
    summary,
    isComplete,
    currentQuestion,
    confirmation,
    uploading,
    uploadProgress,

    handleSendMessage,
    handleLoadMessages,
    handleGenerateSummary,
    handleGetConfirmation,
    handleVoiceMessage,
    handleUploadCV,

    handleKeyPress,
    handleChange,
  } = useCareerProfile();

  const displayMessages = isTyping
    ? [...messages, { id: "typing", sender: "ai", typing: true, content: "" }]
    : messages;

  const renderMessage = (message) => (
    <AnimatedMessage key={message.id}>
      {message.sender === "ai" ? (
        message.typing ? (
          <AiTypingIndicator />
        ) : (
          <div className="w-max bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
            <p className="w-[453px] text-[20px] leading-relaxed">
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

  // ✅ If summary exists → show profile result
  if (summary) {
    return (
      <div className="mt-10 p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-3">Your Career Profile</h3>

        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(summary, null, 2)}
        </pre>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleGenerateSummary}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Regenerate
          </button>

          <button
            onClick={handleGetConfirmation}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Data
          </button>
        </div>

        {confirmation && (
          <div className="mt-6 p-4 border rounded bg-green-50 dark:bg-[#162d1a]">
            <h4 className="font-bold mb-2">Confirmation</h4>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(confirmation, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-[5%] pt-10 pb-5">
      {/* Header */}
      <div className="text-center py-5">
        <h1 className="text-[32px] font-extrabold mb-4">Your Career Journey</h1>
        <p className="text-[20px] mb-8">
          Discover, embody and launch your professional transformation
        </p>

        {/* Steps */}
        <div className="flex justify-between items-center p-10 my-12 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-6 w-6" />
            <span className="text-[24px] font-semibold">Discover you</span>
            <ArrowRight className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1342ff] to-[#ff00e6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <span className="text-[24px] font-semibold">
              Embody your persona
            </span>
            <ArrowRight className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1342ff] to-[#ff00e6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <span className="text-[24px] font-semibold">
              Launch Confidently
            </span>
          </div>
        </div>
      </div>

      {/* Conversations */}
      {conversations?.length > 0 && (
        <div className="mb-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-2">Your Conversations</h3>
          <ul className="space-y-2">
            {conversations.map((conv, i) => (
              <li key={conv.id || i}>
                <button
                  onClick={() => handleLoadMessages(conv.id)}
                  className={`text-left w-full px-4 py-2 rounded-lg border ${
                    conv.id === conversationId
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 dark:hover:bg-[#1f1f1f]"
                  }`}
                >
                  {conv.title || "Untitled"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <UserIcon className="h-6 w-6" />
          <h2 className="text-[24px] font-semibold">Getting to know you</h2>
        </div>

        <ChatLayout
          messages={displayMessages}
          renderMessage={renderMessage}
          inputProps={{
            value: userInput,
            handleChange,
            handleKeyPress,
            handleSendMessage,
            handleVoiceMessage,
          }}
        />

        {currentQuestion?.field === "cvUpload" && (
          <div className="flex flex-col justify-start mt-4 space-y-2">
            <label className="cursor-pointer px-4 py-2 bg-[#e2e2e2] dark:bg-[#151515] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg hover:bg-[#d6d6d6] transition">
              📄 Upload your CV
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleUploadCV(file);
                }}
              />
            </label>

            {uploading && (
              <div className="w-full h-3 bg-gray-200 dark:bg-[#2d2d2d] rounded-lg overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {isComplete && !summary && (
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={handleGenerateSummary}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetToKnowYou;
