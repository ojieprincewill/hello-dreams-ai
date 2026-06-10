import React from "react";
import { motion, AnimatePresence } from "motion/react";

const AdminModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] ${maxWidth} bg-[#f9f9f9] dark:bg-[#1c1c1c] border border-[#eaecf0] dark:border-[#565757] rounded-xl shadow-xl px-6 py-6`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          {title && (
            <h2
              id="admin-modal-title"
              className="text-[20px] font-bold text-[#010413] dark:text-[#f7f7f7] mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {title}
            </h2>
          )}
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default AdminModal;
