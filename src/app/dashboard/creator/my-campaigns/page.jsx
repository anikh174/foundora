"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, FolderOpen, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { api, extractError } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EditCampaignModal from "@/components/dashboard/EditCampaignModal";
import { formatCredits, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/campaigns/my");
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/campaigns/${deleteTarget._id}`);
      toast.success("Campaign deleted. Approved supporters have been refunded.");
      setDeleteTarget(null);
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">Manage, edit or remove your campaigns.</p>
        </div>
        <Link
          href="/dashboard/creator/add-campaign"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition self-start"
        >
          <Plus className="w-4 h-4" /> Add campaign
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : campaigns?.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-8 h-8" />}
          title="You have no campaigns yet"
          description="Launch your first campaign and start raising funds for your idea."
          action={
            <Link
              href="/dashboard/creator/add-campaign"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Add your first campaign
            </Link>
          }
        />
      ) : (
        <>
        <div className="lg:hidden space-y-3">
          {campaigns.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                  {c.image && <Image src={c.image} alt={c.title} fill className="object-cover" unoptimized />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.category}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Raised</p>
                  <p className="mt-0.5 font-bold text-slate-900">{formatCredits(c.raised)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Goal</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">{formatCredits(c.fundingGoal)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Deadline: {formatDate(c.deadline)}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/campaign/${c._id}`}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setEditTarget(c)}
                    disabled={c.status === "suspended"}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition disabled:opacity-40"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Raised</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Goal</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Deadline</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                          {c.image && <Image src={c.image} alt={c.title} fill className="object-cover" unoptimized />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                          <p className="text-xs text-slate-500">{c.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCredits(c.raised)}</td>
                    <td className="px-5 py-4 text-slate-600">{formatCredits(c.fundingGoal)}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(c.deadline)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/campaign/${c._id}`}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditTarget(c)}
                          disabled={c.status === "suspended"}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition disabled:opacity-40"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this campaign?"
        message={`Deleting "${deleteTarget?.title}" will permanently remove it and refund all approved supporters their contribution credits. This action cannot be undone.`}
        confirmText="Delete campaign"
      />

      <EditCampaignModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        campaign={editTarget}
        onSaved={() => reload()}
      />
    </div>
  );
}
