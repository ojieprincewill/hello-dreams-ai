import React, { useRef, useEffect } from "react";
import MessageInputField from "./message-input.component";

const ChatLayout = ({ messages, renderMessage, inputProps }) => {
  const messageRefs = useRef({});

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const node = messageRefs.current[lastMsg.id];
      if (node) {
        // Always scroll so the top of the new bubble is visible
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages]);

  return (
    <div className="relative h-screen flex flex-col">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto py-6 pb-[140px] scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} ref={(el) => (messageRefs.current[msg.id] = el)}>
            {renderMessage(msg)}
          </div>
        ))}
      </div>

      {/* Fixed input pinned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-5">
        <MessageInputField {...inputProps} />
      </div>
    </div>
  );
};

export default ChatLayout;
