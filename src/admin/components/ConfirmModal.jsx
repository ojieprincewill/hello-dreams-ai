import React from "react";
import AdminModal from "./primitives/AdminModal";
import AdminButton from "./primitives/AdminButton";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "primary",
  loading = false,
  children,
}) => (
  <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
    {message && (
      <p
        className="text-[14px] text-[#555] dark:text-[#aaa] mb-4"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {message}
      </p>
    )}
    {children}
    <div className="flex justify-end gap-3 mt-4">
      <AdminButton variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </AdminButton>
      <AdminButton
        variant={variant}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Processing…" : confirmLabel}
      </AdminButton>
    </div>
  </AdminModal>
);

export default ConfirmModal;
