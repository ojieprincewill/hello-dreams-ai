import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import ChatLayout from "../reusable-components/chat-layout.component";
import AnimatedMessage from "../reusable-components/animated-message.component";
import { useDocumentBuilder } from "../custom-hooks/useDocumentBuilder";
import DocumentPreview from "./documentPreview.component";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";

const CoverLetter = () => {
  const {
    messages,
    conversations,
    conversationId,
    userInput,
    document,
    loading,

    // convo controls
    editingConvId,
    setEditingConvId,
    newTitle,
    setNewTitle,
    updateConversation,
    deleteConversation,

    // message
    handleKeyPress,
    handleChange,
    handleSendMessage,
    handleLoadMessages,

    // document
    handleGenerateDocument,
    handleGetDocument,
    handleUpdateDocument,
    handlePatchDocument,
    handleDeleteDocument,
  } = useDocumentBuilder();

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

  // ✅ If document exists → show preview ONLY
  if (document) {
    return (
      <div className="mt-10 p-5 border rounded bg-gray-50 dark:bg-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-3">Generated Document</h3>

        <DocumentPreview
          document={document}
          onGenerate={handleGenerateDocument}
          onRefresh={handleGetDocument}
          onUpdate={handleUpdateDocument}
          onPatch={handlePatchDocument}
          onDelete={handleDeleteDocument}
        />
      </div>
    );
  }

  return (
    <div className="px-[5%] py-10">
      {/* Header */}
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

      {/* Conversations */}
      {conversations?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Your Conversations</h3>

          <ul className="space-y-2">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="flex items-center justify-between border rounded-lg px-3 py-2"
              >
                {editingConvId === conv.id ? (
                  <>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 mr-2 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={async () => {
                        await updateConversation(conv.id, {
                          title: newTitle,
                        });
                        setEditingConvId(null);
                        setNewTitle("");
                      }}
                      className="text-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingConvId(null);
                        setNewTitle("");
                      }}
                      className="text-red-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleLoadMessages(conv.id)}
                      className={`flex-1 text-left ${
                        conv.id === conversationId ? "font-bold" : ""
                      }`}
                    >
                      {conv.title || "Untitled"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingConvId(conv.id);
                          setNewTitle(conv.title || "");
                        }}
                        className="text-sm text-gray-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={handleGenerateDocument}
                        className="text-sm text-indigo-600"
                      >
                        Generate
                      </button>

                      <button
                        onClick={handleGetDocument}
                        className="text-sm text-blue-600"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Layout */}

      <ChatLayout
        messages={messages}
        renderMessage={renderMessage}
        inputProps={{
          value: userInput,
          handleChange: handleChange,
          handleKeyPress: handleKeyPress,
          handleSendMessage: handleSendMessage,
        }}
      />
    </div>
  );
};

export default CoverLetter;
