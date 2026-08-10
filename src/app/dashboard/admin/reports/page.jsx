"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Flag, Check, Ban } from "lucide-react";
import { api, extractError } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/admin/reports");
        if (!cancelled) setReports(res.data.reports || []);
      } catch {
        if (!cancelled) setReports([]);
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

  const handleResolve = async (report) => {
    setBusyId(report._id);
    try {
      await api.patch(`/api/admin/reports/${report._id}/resolve`);
      toast.success("Report marked as resolved");
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
        <h1 className="text-xl font-bold text-slate-900">Reports & Flagged Campaigns</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review reports submitted by supporters. You can mark them resolved or suspend the
          campaign.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : reports?.length === 0 ? (
        <EmptyState
          icon={<Flag className="w-8 h-8" />}
          title="No reports yet"
          description="When supporters flag a campaign, the report will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                  {r.campaignId?.image && (
                    <Image src={r.campaignId.image} alt={r.campaignTitle} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">{r.campaignTitle}</h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Reported by {r.reporterName} ({r.reporterEmail}) on {formatDateTime(r.createdAt)}
                  </p>
                  <div className="mt-3 rounded-xl bg-rose-50/60 border border-rose-100 p-3.5">
                    <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{r.reason}&rdquo;</p>
                  </div>
                </div>
                {r.status === "pending" && (
                  <div className="flex items-center gap-2 lg:ml-auto">
                    <button
                      onClick={() => handleResolve(r)}
                      disabled={busyId === r._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      {busyId === r._id ? <Spinner className="w-4 h-4" color="text-current" /> : <Check className="w-4 h-4" />}
                      Mark Resolved
                    </button>
                    <a
                      href={`/dashboard/admin/campaigns?status=suspended`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition"
                    >
                      <Ban className="w-4 h-4" /> Suspend
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
