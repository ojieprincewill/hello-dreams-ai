import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import MessageInputField from "./message-input.component";

const ChatLayout = ({ messages, renderMessage, inputProps }) => {
  const messageRefs = useRef({});

  useEffect(() => {
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
    const node = lastMsg ? messageRefs.current[lastMsg.id] : null;
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col h-full min-h-0 overflow-x-hidden">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto py-4 md:py-6 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} ref={(el) => (messageRefs.current[msg.id] = el)}>
            {renderMessage(msg)}
          </div>
        ))}
      </div>

      {/* Fixed input pinned at bottom */}
      <div className="mt-auto z-10 py-3 md:py-4 lg:py-5">
        <MessageInputField
          value={inputProps.value}
          onChange={inputProps.handleChange}
          onKeyDown={inputProps.handleKeyPress}
          onSend={inputProps.handleSendMessage}
          onVoice={inputProps.handleVoiceMessage}
          placeholder={inputProps.placeholder || "Type your response"}
        />
      </div>
    </div>
  );
};

ChatLayout.propTypes = {
  messages: PropTypes.array.isRequired,
  renderMessage: PropTypes.func.isRequired,
  inputProps: PropTypes.object,
};

export default ChatLayout;
