"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { api, extractError } from "@/lib/api";

export default function ReportModal({ open, onClose, campaignId }) {
  if (!open) return null;
  return <ReportDialog campaignId={campaignId} onClose={onClose} />;
}

function ReportDialog({ onClose, campaignId }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reason.trim().length < 10) return;
    setSubmitting(true);
    try {
      await api.post(`/api/campaigns/${campaignId}/report`, { reason });
      onClose();
      router.push("/campaigns");
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Report this campaign"
      size="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={reason.trim().length < 10 || submitting}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Spinner className="w-4 h-4" color="text-current" />}
            Submit report
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-600 mb-4">
        Help keep Fundora trustworthy. Tell our moderation team why this campaign should be
        reviewed. Reports are confidential.
      </p>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Reason for reporting
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={5}
        placeholder="e.g. The campaign appears to be misusing funds or making false claims..."
        className="mt-2 w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
      />
      <p className="mt-2 text-xs text-slate-400">
        {reason.trim().length < 10 ? "Minimum 10 characters required." : "Thank you for helping us keep the community safe."}
      </p>
    </Modal>
  );
}
