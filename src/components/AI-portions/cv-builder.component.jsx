import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import MessageInputField from "./reusable-customs/message-input.component";
import { apiFetch } from "../../auth/apiClient";
import ChatLayout from "./reusable-customs/chat-layout.component";
import AnimatedMessage from "./reusable-customs/animated-message.component";

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
  // const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

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
          { method: "GET" }
        );
        const data = await res.json();

        if (data.length > 0) {
          // Sort conversations by updatedAt (descending)
          const sorted = data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
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
            }
          );
          const newConv = await createRes.json();
          setConversationId(newConv.id);

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
              }))
            );
          }
        }
      } catch (err) {
        console.error("Error initializing CvBuilder:", err);
      }
    };

    init();
  }, []);

  // Load messages for a selected conversation
  const loadMessages = async (id) => {
    try {
      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${id}`,
        { method: "GET" }
      );
      const data = await res.json();
      console.log("Conversation from backend:", data);

      if (data.messages && Array.isArray(data.messages)) {
        setConversationId(id);
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
          }))
        );
      } else {
        console.warn("No messages array found in conversation:", data);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
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

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      const res = await apiFetch(
        `https://hello-dreams-ai.onrender.com/resume-builder/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: newMessage.content }),
        }
      );

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

      // Append AI response
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

      // // Update conversations list with new updatedAt
      // setConversations((prev) => {
      //   const updated = prev.map((conv) =>
      //     conv.id === conversationId
      //       ? { ...conv, updatedAt: new Date().toISOString() }
      //       : conv
      //   );
      //   return updated.sort(
      //     (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      //   );
      // });
    } catch (err) {
      console.error("Error sending message:", err);
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
        <div className="w-max bg-[#2d2d2d] border border-[#2d2d2d] rounded-lg p-4">
          <p className="w-[453px] text-[20px] leading-relaxed">
            {message.content}
          </p>
          <p className="text-[#bfb5b5] text-[16px] mt-2">{message.timestamp}</p>
        </div>
      ) : (
        <div className="flex justify-end my-5">
          <div className="w-max bg-[#151515] border border-[#2d2d2d] rounded-lg p-4">
            <p className="w-[453px] text-white text-[20px] leading-relaxed">
              {message.content}
            </p>
            <p className="text-[#bfb5b5] text-[16px] mt-2 text-right">
              {message.timestamp}
            </p>
          </div>
        </div>
      )}
    </AnimatedMessage>
  );

  return (
    <div className="px-[5%] pt-10 pb-5">
      <div className="flex items-center space-x-3 mb-10 p-5 border-b border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold ">CV Builder</h2>
          <p className="text-[20px]">
            Let's have a conversation to build you the perfect CV
          </p>
        </div>
      </div>

      {/* Conversation selector */}
      {/* {conversations.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold">Your Conversations</h3>
          <ul>
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => loadMessages(conv.id)}
                  className="text-blue-600 hover:underline"
                >
                  {conv.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )} */}

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
