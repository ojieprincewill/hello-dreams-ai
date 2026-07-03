import React from "react";
import PropTypes from "prop-types";
import AnimatedMessage from "./animated-message.component";
import AssistantMessage from "./assistant-message.component";
import UserMessage from "./user-message.component";

const ChatMessageRenderer = ({ message }) => (
  <AnimatedMessage key={message.id}>
    {message.sender === "ai" ? (
      <AssistantMessage content={message.content} typing={message.typing} />
    ) : (
      <UserMessage content={message.content} timestamp={message.timestamp} />
    )}
  </AnimatedMessage>
);

ChatMessageRenderer.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender: PropTypes.oneOf(["ai", "user"]).isRequired,
    content: PropTypes.string,
    timestamp: PropTypes.string,
    typing: PropTypes.bool,
  }).isRequired,
};

export default ChatMessageRenderer;
