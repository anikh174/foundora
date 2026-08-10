"use client";

import { useEffect, useState } from "react";
import { Wallet, Check, X } from "lucide-react";
import { api, extractError } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatCredits, formatMoney, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/admin/withdrawals?status=pending");
        if (!cancelled) setWithdrawals(res.data.withdrawals || []);
      } catch {
        if (!cancelled) setWithdrawals([]);
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

  const handleApprove = async (w) => {
    setBusyId(w._id);
    try {
      await api.patch(`/api/admin/withdrawals/${w._id}/approve`);
      toast.success("Payment marked as successful and credits deducted");
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (w) => {
    setBusyId(w._id);
    try {
      await api.patch(`/api/admin/withdrawals/${w._id}/reject`);
      toast.success("Withdrawal request rejected");
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
        <h1 className="text-xl font-bold text-slate-900">Withdrawal Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Approve creator payouts. Clicking &quot;Payment Success&quot; transfers the funds and
          deducts the credits.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : withdrawals?.length === 0 ? (
        <EmptyState
          icon={<Wallet className="w-8 h-8" />}
          title="No pending withdrawal requests"
          description="When creators request payouts, they will appear here."
        />
      ) : (
        <div className="space-y-4">
          {withdrawals.map((w) => (
            <div
              key={w._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{w.creatorName}</p>
                    <p className="text-xs text-slate-500">{w.creatorEmail}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="font-extrabold text-slate-900">{formatCredits(w.amount)} credits</span>
                  <span className="font-bold text-emerald-600">{formatMoney(w.usdAmount)}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                    {w.method}
                  </span>
                  <span className="text-slate-500">{w.accountNumber}</span>
                  <span className="text-slate-500">{formatDateTime(w.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 lg:ml-auto">
                <StatusBadge status={w.status} />
                <button
                  onClick={() => handleApprove(w)}
                  disabled={busyId === w._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {busyId === w._id ? <Spinner className="w-4 h-4" color="text-current" /> : <Check className="w-4 h-4" />}
                  Payment Success
                </button>
                <button
                  onClick={() => handleReject(w)}
                  disabled={busyId === w._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition disabled:opacity-60"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
