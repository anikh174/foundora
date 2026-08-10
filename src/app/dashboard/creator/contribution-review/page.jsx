"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Check, X, Eye } from "lucide-react";
import { api, extractError } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, Avatar } from "@/components/ui/Misc";
import { Spinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { formatCredits, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ContributionReview() {
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/campaigns/pending-contributions");
        if (!cancelled) setContributions(res.data.contributions || []);
      } catch {
        if (!cancelled) setContributions([]);
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

  const handleAction = async (contribution, action) => {
    setProcessingId(contribution._id);
    try {
      await api.patch(`/api/contributions/${contribution._id}/${action}`);
      toast.success(
        action === "approve"
          ? "Contribution approved and added to the campaign"
          : "Contribution rejected and credits refunded"
      );
      if (viewTarget?._id === contribution._id) setViewTarget(null);
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Contribution Review</h1>
        <p className="mt-1 text-sm text-slate-500">
          Approve or reject pending contributions from your supporters.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : contributions?.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="w-8 h-8" />}
          title="No pending contributions"
          description="When supporters contribute to your campaigns, their requests will appear here for your review."
        />
      ) : (
        <div className="space-y-4">
          {contributions.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar src={c.supporterImage} name={c.supporterName} className="w-12 h-12 text-base" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{c.supporterName}</p>
                  <p className="text-xs text-slate-500 truncate">{c.supporterEmail}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                    {formatCredits(c.amount)} credits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  onClick={() => setViewTarget(c)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
                >
                  <Eye className="w-4 h-4" /> Details
                </button>
                <button
                  onClick={() => handleAction(c, "approve")}
                  disabled={processingId === c._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {processingId === c._id ? <Spinner className="w-4 h-4" color="text-current" /> : <Check className="w-4 h-4" />}
                  Approve
                </button>
                <button
                  onClick={() => handleAction(c, "reject")}
                  disabled={processingId === c._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition disabled:opacity-60"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Contribution details"
        size="max-w-md"
      >
        {viewTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={viewTarget.supporterImage} name={viewTarget.supporterName} className="w-14 h-14 text-lg" />
              <div>
                <p className="font-bold text-slate-900">{viewTarget.supporterName}</p>
                <p className="text-sm text-slate-500">{viewTarget.supporterEmail}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Campaign</p>
                <p className="font-semibold text-slate-800 mt-0.5">{viewTarget.campaignTitle}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Contribution</p>
                <p className="font-bold text-emerald-700 mt-0.5">{formatCredits(viewTarget.amount)} credits</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Submitted</p>
                <p className="font-semibold text-slate-800 mt-0.5">{formatDateTime(viewTarget.createdAt)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-semibold text-amber-600 mt-0.5 capitalize">{viewTarget.status}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => handleAction(viewTarget, "approve")}
                disabled={processingId === viewTarget._id}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60"
              >
                {processingId === viewTarget._id ? <Spinner className="w-4 h-4" color="text-current" /> : <Check className="w-4 h-4" />}
                Approve
              </button>
              <button
                onClick={() => handleAction(viewTarget, "reject")}
                disabled={processingId === viewTarget._id}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition disabled:opacity-60"
              >
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
