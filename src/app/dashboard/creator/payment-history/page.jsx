"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { api } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, Avatar } from "@/components/ui/Misc";
import { formatCredits, formatDateTime } from "@/lib/utils";

export default function CreatorPaymentHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/api/contributions/received?page=${page}&limit=10`);
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
  }, [page]);

  const handlePageChange = (next) => {
    setLoading(true);
    setPage(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Payment History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every approved contribution that has been added to your campaigns.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : data?.contributions?.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No payments received yet"
          description="Approved contributions from supporters will appear here as they flow into your campaigns."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Supporter</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.contributions?.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <Avatar src={c.supporterImage} name={c.supporterName} className="w-9 h-9 text-xs" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{c.supporterName}</p>
                          <p className="text-xs text-slate-500 truncate">{c.supporterEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{c.campaignTitle}</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">+{formatCredits(c.amount)}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDateTime(c.createdAt)}</td>
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
