"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ClipboardCheck, Check, X, Eye } from "lucide-react";
import { api, extractError } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { Spinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { formatCredits, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CampaignApproval() {
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/admin/campaigns/pending");
        if (!cancelled) setCampaigns(res.data.campaigns || []);
      } catch {
        if (!cancelled) setCampaigns([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleApprove = async (campaign) => {
    setBusyId(campaign._id);
    try {
      await api.patch(`/api/admin/campaigns/${campaign._id}/review`, { status: "approved" });
      toast.success(`"${campaign.title}" approved and is now live`);
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    setBusyId(rejectTarget._id);
    try {
      await api.patch(`/api/admin/campaigns/${rejectTarget._id}/review`, {
        status: "rejected",
        reason: reason.trim(),
      });
      toast.success("Campaign rejected and creator notified");
      setRejectTarget(null);
      setReason("");
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campaign Approval</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review newly submitted campaigns and approve or reject them.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : campaigns?.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="w-8 h-8" />}
          title="No campaigns awaiting review"
          description="Campaigns submitted by creators will appear here for your approval."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="relative h-44">
                <Image src={c.image} alt={c.title} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                  Pending review
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 leading-snug">{c.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  by {c.creatorName} • {c.creatorEmail}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                    {c.category}
                  </span>
                  <span className="text-slate-500 font-medium">
                    Goal: {formatCredits(c.fundingGoal)} credits
                  </span>
                  <span className="text-slate-500 font-medium">Deadline: {formatDate(c.deadline)}</span>
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{c.story}</p>

                <div className="mt-4 flex items-center gap-2.5">
                  <button
                    onClick={() => handleApprove(c)}
                    disabled={busyId === c._id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                  >
                    {busyId === c._id ? <Spinner className="w-4 h-4" color="text-current" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectTarget(c)}
                    disabled={busyId === c._id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition disabled:opacity-60"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!rejectTarget}
        onClose={() => {
          setRejectTarget(null);
          setReason("");
        }}
        title="Reject this campaign?"
        size="max-w-md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setRejectTarget(null);
                setReason("");
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={reason.trim().length < 5}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition disabled:opacity-50"
            >
              Reject campaign
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 mb-4">
          The creator will be notified with this reason. They can edit and resubmit their campaign.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. The story lacks clear detail about how the funds will be used..."
          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
        />
      </Modal>
    </div>
  );
}
