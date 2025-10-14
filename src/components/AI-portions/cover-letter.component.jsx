import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import MessageInputField from "./components/message-input.component";

const CoverLetter = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content:
        "Hello! 👋 I'm here to help you create professional cover letters and personal statements. Which would you like to create today?  Type 'cover letter' for a job application cover letter, or 'personal statement' for academic/professional applications.",
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
            "Great, let us get started on a professional cover letter that highlights your determination and values.",
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
          <h2 className="text-[24px] font-extrabold ">
            Cover Letter & Professional Statement Builder
          </h2>
          <p className="text-[20px]">
            Let's create compelling documents tailored to your needs
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

export default CoverLetter;
