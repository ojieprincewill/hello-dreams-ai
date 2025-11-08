import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import MessageInputField from "./reusable-customs/message-input.component";

const CvBuilder = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content:
        "Hello! 👋 Welcome to Hello Dreams AI. I'm here to help you create an amazing CV. Let's start with the basics - what's your full name?",
      timestamp: "13:02:07",
    },
  ]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
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

      setMessages([...messages, newMessage]);
      setUserInput("");

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content:
            "Awesome! It is very nice to meet you. Can you tell me more about yourself, your career and what kind of role you're looking for?",
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 2000);
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
  return (
    <div className="px-[5%] py-10">
      <div className="flex items-center space-x-3 mb-6 p-5 border-b border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold ">CV Builder</h2>
          <p className="text-[20px]">
            Let's have a conversation to build you the perfect CV
          </p>
        </div>
      </div>

      <div className="mb-25">
        {messages.map((message) => (
          <div key={message.id}>
            {message.sender === "ai" ? (
              <div className="w-max bg-[#2d2d2d] border border-[#2d2d2d] rounded-lg p-4">
                <p className="w-[453px] text-[20px] leading-relaxed">
                  {message.content}
                </p>
                <p className="text-[#bfb5b5] text-[16px] mt-2">
                  {message.timestamp}
                </p>
              </div>
            ) : (
              <div className="flex justify-end my-5">
                <div className="w-max bg-[#151515] border border-[#2d2d2d] rounded-lg p-4">
                  <p className="w-[453px] text-white text-[16px] leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-[#bfb5b5] text-[16px] mt-2 text-right">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInputField
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default CvBuilder;
