import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import ChatLayout from "../reusable-components/chat-layout.component";
import CVPreview from "./cv-preview.component";
import AnimatedMessage from "../reusable-customs/animated-message.component";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";
import { useCvBuilder } from "../custom-hooks/useCvBuilder";

const CvBuilder = () => {
  const {
    messages,
    conversations,
    resume,
    loading,
    userInput,
    editingConvId,
    newTitle,
    handleChange,
    handleKeyPress,
    handleSendMessage,
    handleLoadMessages,
    updateConversation,
    deleteConversation,
    handleGenerateResume,
    handleGetResume,
    handleUpdateResume,
    handlePatchResume,
    handleDeleteResume,
    setEditingConvId,
    setNewTitle,
  } = useCvBuilder();

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
        <CVPreview data={{ ...resume, level: resume.level || "junior" }} />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() =>
              handlePatchResume({ summary: "New summary text here" })
            }
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Update Summary
          </button>
          <button
            onClick={() =>
              handlePatchResume({ skills: [...resume.skills, "TypeScript"] })
            }
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Skill
          </button>
          <button
            onClick={() => handleUpdateResume(resume)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Resume
          </button>
          <button
            onClick={handleDeleteResume}
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
                      onClick={() => handleLoadMessages(conv.id)}
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
                      onClick={handleGenerateResume}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Generate Resume
                    </button>
                    <button
                      onClick={handleGetResume}
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
