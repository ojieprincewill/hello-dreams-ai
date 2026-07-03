import React from "react";
import PropTypes from "prop-types";

const UserMessage = ({ content }) => (
  <div className="flex justify-end py-2 md:py-3">
    <div className="w-fit max-w-[80%] bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-2xl px-4 py-3">
      <p className="text-[15px] md:text-[16px] leading-relaxed break-words text-[#010413] dark:text-white">
        {content}
      </p>
    </div>
  </div>
);

UserMessage.propTypes = {
  content: PropTypes.string.isRequired,
};

export default UserMessage;
