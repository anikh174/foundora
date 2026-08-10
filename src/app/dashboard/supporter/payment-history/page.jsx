"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, formatMoney, formatCredits } from "@/lib/utils";

export default function PaymentHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/api/payments/my?page=${page}&limit=10`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData({ payments: [], totalPages: 0 });
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
          All your credit purchases, processed securely through Stripe.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : data?.payments?.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8" />}
          title="No payments yet"
          description="When you purchase credits, your transactions will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Package</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Credits</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.payments?.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-slate-900">Credit Pack</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCredits(p.credits)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatMoney(p.amountUSD)}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDateTime(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">Completed</Badge>
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
