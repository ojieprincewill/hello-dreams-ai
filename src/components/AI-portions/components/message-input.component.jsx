import React from "react";
import { Mic, Send } from "lucide-react";

const MessageInputField = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  placeholder = "Type your response",
}) => {
  return (
    <div className="bg-[#303030] border border-[#2d2d2d] rounded-lg p-5">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-white text-[20px] font-medium placeholder:text-white focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors cursor-pointer">
            <Mic size={24} className="text-[#eaecf0]" />
          </button>
          <button
            onClick={onSend}
            className="w-12 h-12 flex justify-center items-center bg-white hover:bg-[#eaecf0] rounded-full transition-colors cursor-pointer"
          >
            <Send size={20} className="text-[#303030]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInputField;
