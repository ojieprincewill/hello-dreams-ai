import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const PaywallModal = ({ isOpen, onClose, used = 5, limit = 5, resetsAt }) => {
  const navigate = useNavigate();

  const formattedResetTime = resetsAt
    ? new Date(resetsAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "midnight UTC";

  const barWidth = limit > 0 ? `${Math.min((used / limit) * 100, 100)}%` : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-[90vw] max-w-[400px]
                       bg-[#f9f9f9] dark:bg-[#1c1c1c]
                       border border-[#eaecf0] dark:border-[#565757]
                       rounded-xl shadow-xl px-6 py-6"
          >
            {/* Header */}
            <div className="text-center mb-5">
              <p className="text-4xl mb-3">🔒</p>
              <h2
                className="text-[20px] font-bold text-[#010413] dark:text-[#f7f7f7]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Daily Limit Reached
              </h2>
              <p
                className="text-[14px] text-[#555] dark:text-[#aaa] mt-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                You've used all {limit} AI credits for today.
                <br />
                Your credits reset at {formattedResetTime}.
              </p>
            </div>

            {/* Credit bar */}
            <div className="bg-[#efefef] dark:bg-[#272725] rounded-lg px-3 py-3 mb-5">
              <div className="flex justify-between items-center mb-2">
                <p
                  className="text-[14px] text-[#010413] dark:text-[#f7f7f7]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Credits used today
                </p>
                <span className="bg-[#fff] dark:bg-[#1c1c1c] border border-[#e0e0e0] dark:border-[#565757] rounded-xl px-2 py-0.5 text-[#1342ff] text-[12px] font-bold">
                  {used}/{limit}
                </span>
              </div>
              <div className="w-full h-[8px] bg-[#e0e0e0] dark:bg-[#444] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1342ff] rounded-full transition-all"
                  style={{ width: barWidth }}
                />
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-col gap-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <button
                onClick={() => {
                  navigate("/userprofile", { state: { active: "subscription" } });
                  onClose();
                }}
                className="w-full bg-[#6b88fa] dark:bg-[#1342ff]
                           border border-[#1342ff] dark:border-[#eaecf0]
                           rounded-md py-2 px-4
                           text-[#fff] text-[13px] font-medium
                           cursor-pointer"
              >
                Upgrade for unlimited access
              </button>
              <button
                onClick={onClose}
                className="w-full bg-transparent
                           border border-[#eaecf0] dark:border-[#565757]
                           rounded-md py-2 px-4
                           text-[14px] text-[#010413] dark:text-[#f7f7f7] font-medium
                           cursor-pointer"
              >
                Come back tomorrow
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaywallModal;
