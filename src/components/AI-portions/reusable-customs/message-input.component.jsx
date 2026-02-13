import React, { useRef, useEffect } from "react";
import { Mic, Send } from "lucide-react";

const MessageInputField = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  placeholder = "Type your response",
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea height with max cap
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px"; // cap at 200px
    }
  }, [value]);

  return (
    <div className="bg-[#efefef] dark:bg-[#303030] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-5">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none bg-transparent text-[#010413] dark:text-white text-[20px] font-medium placeholder:text-[#333] dark:placeholder:text-white focus:outline-none overflow-y-auto max-h-[200px] transition-all duration-200 ease-in-out custom-scrollbar"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-[#dfdfdf] dark:hover:bg-[#2d2d2d] rounded-lg transition-colors cursor-pointer">
            <Mic size={24} className="text-[#333] dark:text-[#eaecf0]" />
          </button>
          <button
            onClick={onSend}
            className="w-12 h-12 flex justify-center items-center bg-[#dfdfdf] dark:bg-white dark:hover:bg-[#eaecf0] rounded-full transition-colors cursor-pointer"
          >
            <Send size={20} className=" dark:text-[#303030]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInputField;
