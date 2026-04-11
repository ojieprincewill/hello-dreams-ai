import React from "react";

const AiTypingIndicator = () => {
  return (
    <div className="w-max bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg p-4">
      <div className="flex items-center space-x-2" aria-hidden="true">
        <span
          className="inline-block w-2 h-2 bg-[#444] dark:bg-[#bfb5b5] rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="inline-block w-2 h-2 bg-[#444] dark:bg-[#bfb5b5] rounded-full animate-bounce"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="inline-block w-2 h-2 bg-[#444] dark:bg-[#bfb5b5] rounded-full animate-bounce"
          style={{ animationDelay: "240ms" }}
        />
      </div>
      <span className="sr-only">AI is typing</span>
    </div>
  );
};

export default AiTypingIndicator;

