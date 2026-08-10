"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { api, extractError } from "@/lib/api";
import toast from "react-hot-toast";

export default function EditCampaignModal({ open, onClose, campaign, onSaved }) {
  if (!open || !campaign) return null;
  return (
    <EditCampaignDialog
      key={campaign._id}
      campaign={campaign}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function EditCampaignDialog({ campaign, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: campaign.title,
    story: campaign.story,
    reward: campaign.reward || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 10 || form.story.trim().length < 50) {
      toast.error("Title and story must be long enough (title 10+, story 50+ characters)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.patch(`/api/campaigns/${campaign._id}`, {
        title: form.title.trim(),
        story: form.story.trim(),
        reward: form.reward.trim(),
      });
      toast.success("Campaign updated successfully");
      onClose();
      if (onSaved) onSaved(res.data.campaign);
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition bg-white";

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit campaign"
      size="max-w-2xl"
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
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && <Spinner className="w-4 h-4" color="text-current" />}
            Save changes
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`${inputBase} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Story</label>
          <textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            rows={6}
            className={`${inputBase} mt-1.5 resize-none`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rewards</label>
          <textarea
            value={form.reward}
            onChange={(e) => setForm({ ...form, reward: e.target.value })}
            rows={3}
            className={`${inputBase} mt-1.5 resize-none`}
          />
        </div>
      </div>
    </Modal>
  );
}
