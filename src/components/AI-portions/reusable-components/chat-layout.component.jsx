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
        <MessageInputField
          value={inputProps.value} // explicitly pass value
          onChange={inputProps.handleChange} // match naming
          onKeyDown={inputProps.handleKeyPress}
          onSend={inputProps.handleSendMessage}
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
