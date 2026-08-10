"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Megaphone, Trash2, Eye, PauseCircle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { api, extractError } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCredits, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const statusTabs = ["All", "pending", "approved", "rejected", "suspended"];

export default function ManageCampaigns() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (status !== "All") params.append("status", status);
        const res = await api.get(`/api/admin/campaigns?${params.toString()}`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData({ campaigns: [], totalPages: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, status, reloadKey]);

  const handleStatusChange = (next) => {
    setLoading(true);
    setPage(1);
    setStatus(next);
  };

  const handlePageChange = (next) => {
    setLoading(true);
    setPage(next);
  };

  const reload = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleToggleSuspend = async (campaign) => {
    setBusyId(campaign._id);
    try {
      await api.patch(`/api/admin/campaigns/${campaign._id}/suspend`);
      toast.success(campaign.status === "suspended" ? "Campaign reactivated" : "Campaign suspended");
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/admin/campaigns/${deleteTarget._id}`);
      toast.success("Campaign deleted and approved supporters refunded");
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
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manage Campaigns</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, suspend or remove any campaign on the platform.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              status === s
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : data?.campaigns?.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="No campaigns found"
          description="No campaigns match the selected status."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Creator</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Raised</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Deadline</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.campaigns?.map((c) => (
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
                    <td className="px-5 py-4 text-slate-600">{c.creatorName}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCredits(c.raised)}</td>
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
                        {c.status !== "pending" && (
                          <button
                            onClick={() => handleToggleSuspend(c)}
                            disabled={busyId === c._id}
                            className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition disabled:opacity-40"
                            title={c.status === "suspended" ? "Reactivate" : "Suspend"}
                          >
                            {c.status === "suspended" ? (
                              <PlayCircle className="w-4 h-4" />
                            ) : (
                              <PauseCircle className="w-4 h-4" />
                            )}
                          </button>
                        )}
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

          {data?.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this campaign?"
        message={`Deleting "${deleteTarget?.title}" will permanently remove it and refund approved supporters. This cannot be undone.`}
        confirmText="Delete campaign"
      />
    </div>
  );
}
