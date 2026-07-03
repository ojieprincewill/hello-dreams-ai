import React from "react";
import PropTypes from "prop-types";
import MarkdownContent from "./markdown-content.component";
import AiTypingIndicator from "../reusable-customs/ai-typing-indicator.component";

const AssistantMessage = ({ content, typing }) => {
  if (typing) {
    return (
      <div className="py-4 md:py-6">
        <AiTypingIndicator />
      </div>
    );
  }

  return (
    <div className="w-full py-5 md:py-8">
      <MarkdownContent content={content} />
    </div>
  );
};

AssistantMessage.propTypes = {
  content: PropTypes.string,
  typing: PropTypes.bool,
};

export default AssistantMessage;
