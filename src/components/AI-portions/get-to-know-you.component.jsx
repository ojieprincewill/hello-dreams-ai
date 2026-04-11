import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/outline";
import ChatLayout from "./reusable-components/chat-layout.component";
import AnimatedMessage from "./reusable-components/animated-message.component";
import AiTypingIndicator from "./reusable-customs/ai-typing-indicator.component";
import toast from "react-hot-toast";
import {
  useCareerProfileConversations,
  useCareerProfileConversation,
  useCreateCareerProfileConversation,
  useSendCareerProfileMessage,
} from "../../hooks/ai/useCareerProfile";

const GetToKnowYou = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content:
        "Hi Dreamer 👋 Let's shape your future! First, I'd love to get to know you. Tell me a bit about your professional background and what you've been working on lately.",
      timestamp: "13:02:07",
    },
  ]);
  // const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const conversationsQuery = useCareerProfileConversations();
  const conversationQuery = useCareerProfileConversation(conversationId);
  const createConversationMutation = useCreateCareerProfileConversation();
  const sendMessageMutation = useSendCareerProfileMessage();

  const initializedRef = useRef(false);

  // Save conversationId whenever it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("careerConversationId", conversationId);
    }
  }, [conversationId]);

  // Restore conversationId from localStorage for session continuity
  useEffect(() => {
    const savedId = localStorage.getItem("careerConversationId");
    if (savedId) {
      setConversationId(savedId);
    }
  }, []);

  // Keep messages in sync with backend conversation data
  useEffect(() => {
    if (
      conversationQuery.data?.messages &&
      Array.isArray(conversationQuery.data.messages)
    ) {
      setMessages(
        conversationQuery.data.messages.map((m, i) => ({
          id: i + 1,
          sender: m.role === "user" ? "user" : "ai",
          content: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        })),
      );
    }
  }, [conversationQuery.data]);

  // Create or restore conversation once when component mounts
  useEffect(() => {
    const run = async () => {
      if (initializedRef.current) return;
      if (!conversationsQuery.isSuccess) return;
      initializedRef.current = true;

      try {
        const data = conversationsQuery.data;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );
          const latest = sorted[0];
          setConversationId(latest.id);
        } else {
          const newConv = await createConversationMutation.mutateAsync({
            title: "Career Discovery",
          });
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
              })),
            );
          }
        }
      } catch (err) {
        console.error("Error initializing Career Profile:", err);
        toast.error("Failed to initialize your career conversation.");
      }
    };

    run();
  }, [
    conversationsQuery.isSuccess,
    conversationsQuery.data,
    createConversationMutation,
  ]);

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

      // Update conversations list with new updatedAt
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
      toast.error("Error sending message.");
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

  const displayMessages = sendMessageMutation.isPending
    ? [
        ...messages,
        { id: "typing", sender: "ai", typing: true, content: "" },
      ]
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

  return (
    <div className="px-[5%] pt-10 pb-5">
      {/* Header Section */}
      <div className="text-center py-5">
        <h1 className="text-[32px] font-extrabold mb-4">Your career Journey</h1>
        <p className="text-[20px] mb-8">
          Discover, embody and launch your professional transformation
        </p>

        {/* Journey Steps */}
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
            <ArrowRight className="w-6 h-6 " />
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

      {/* Chat Section */}
      <div className="max-w-4xl mx-auto ">
        <div className="flex items-center space-x-3 mb-6">
          <UserIcon className="h-6 w-6" />
          <h2 className="text-[24px] font-semibold ">Getting to know you</h2>
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

        {/* Chat Messages */}
        <ChatLayout
          messages={displayMessages}
          renderMessage={renderMessage}
          inputProps={{
            value: userInput,
            handleChange: handleChange,
            handleKeyPress: handleKeyPress,
            handleSendMessage: handleSendMessage,
          }}
        />
      </div>
    </div>
  );
};

export default GetToKnowYou;
