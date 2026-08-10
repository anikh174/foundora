"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Spinner } from "./Spinner";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading: externalLoading,
}) {
  const [localLoading, setLocalLoading] = useState(false);
  const loading = externalLoading !== undefined ? externalLoading : localLoading;

  const handleConfirm = async () => {
    if (externalLoading !== undefined) {
      await onConfirm();
      return;
    }
    setLocalLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLocalLoading(false);
    }
  };

  const variantStyles = {
    danger: "bg-rose-600 hover:bg-rose-700",
    success: "bg-emerald-600 hover:bg-emerald-700",
    warning: "bg-amber-500 hover:bg-amber-600",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 flex items-center gap-2 ${variantStyles[variant]}`}
          >
            {loading && <Spinner className="w-4 h-4" color="text-current" />}
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
    </Modal>
  );
}
