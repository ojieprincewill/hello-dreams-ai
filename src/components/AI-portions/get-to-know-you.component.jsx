import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/outline";
import MessageInputField from "./components/message-input.component";

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
            "That's great! I can see you have valuable experience. Can you tell me more about your career goals and what kind of role you're looking for?",
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
    <div className="min-h-screen px-[5%] py-10">
      {/* Header Section */}
      <div className="text-center py-5">
        <h1 className="text-[32px] font-extrabold mb-4">Your career Journey</h1>
        <p className="text-[20px] mb-8">
          Discover, embody and launch your professional transformation
        </p>

        {/* Journey Steps */}
        <div className="flex justify-between items-center p-10 my-12 border-b border-[#2d2d2d]">
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

        {/* Chat Messages */}
        <div className="mb-15">
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

        {/* Input Section */}
        <MessageInputField
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default GetToKnowYou;
