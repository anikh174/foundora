"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HandCoins } from "lucide-react";
import { api } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, Avatar } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateTime, formatCredits } from "@/lib/utils";

const statusTabs = ["All", "pending", "approved", "rejected"];

export default function MyContributions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/api/contributions/my?page=${page}&limit=8&status=${status}`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData({ contributions: [], totalPages: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  const handleStatusChange = (next) => {
    setLoading(true);
    setPage(1);
    setStatus(next);
  };

  const handlePageChange = (next) => {
    setLoading(true);
    setPage(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Contributions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track every campaign you have backed and its approval status.
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
        <TableSkeleton rows={6} cols={5} />
      ) : data?.contributions?.length === 0 ? (
        <EmptyState
          icon={<HandCoins className="w-8 h-8" />}
          title="No contributions found"
          description="You have not backed any campaigns yet in this category. Explore campaigns to get started."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.contributions?.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                          {c.campaignImage && (
                            <Image src={c.campaignImage} alt={c.campaignTitle} fill className="object-cover" unoptimized />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{c.campaignTitle}</p>
                          <p className="text-xs text-slate-500">
                            Creator: {c.creatorEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCredits(c.amount)}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDateTime(c.createdAt)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
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
    </div>
  );
}
