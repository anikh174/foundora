"use client";

import { useEffect, useState } from "react";
import { Banknote, Coins, CreditCard, Smartphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, extractError } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCredits, formatMoney, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

const CREDITS_PER_DOLLAR = 20;
const MIN_WITHDRAWAL = 200;

const methods = [
  { value: "stripe", label: "Stripe", hint: "PayPal / card payout", icon: CreditCard },
  { value: "bkash", label: "bKash", hint: "Mobile wallet", icon: Smartphone },
  { value: "rocket", label: "Rocket", hint: "Mobile wallet", icon: Smartphone },
  { value: "nagad", label: "Nagad", hint: "Mobile wallet", icon: Smartphone },
];

export default function Withdrawals() {
  const { user, refreshUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: MIN_WITHDRAWAL, method: "stripe", accountNumber: "" });
  const [errors, setErrors] = useState({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/withdrawals/my");
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

  const hasEnoughCredits = (user?.credits || 0) >= MIN_WITHDRAWAL;
  const usdValue = Number(form.amount) / CREDITS_PER_DOLLAR;

  const validate = () => {
    const next = {};
    if (!form.amount || Number(form.amount) < MIN_WITHDRAWAL) {
      next.amount = `Minimum withdrawal is ${MIN_WITHDRAWAL} credits`;
    } else if (Number(form.amount) > (user?.credits || 0)) {
      next.amount = "You do not have enough credits";
    }
    if (!form.method) next.method = "Select a payout method";
    if (!form.accountNumber.trim()) next.accountNumber = "Account number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post("/api/withdrawals", form);
      toast.success("Withdrawal request submitted. Awaiting admin approval.");
      await refreshUser();
      reload();
      setForm({ amount: MIN_WITHDRAWAL, method: "stripe", accountNumber: "" });
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition bg-white";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Withdrawals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Convert your credits into cash. <span className="font-semibold">20 credits = $1</span>,
          minimum withdrawal is {MIN_WITHDRAWAL} credits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Available credits</p>
                <p className="text-2xl font-extrabold text-slate-900">{formatCredits(user?.credits || 0)}</p>
              </div>
            </div>

            {!hasEnoughCredits && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
                You need at least {MIN_WITHDRAWAL} credits to make a withdrawal.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Withdrawal amount (credits)
                </label>
                <input
                  type="number"
                  value={form.amount}
                  min={MIN_WITHDRAWAL}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={`${inputBase} mt-1.5`}
                />
                {errors.amount && <p className="mt-1.5 text-xs text-rose-600">{errors.amount}</p>}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-800">You will receive</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatMoney(usdValue || 0)}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payout method</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                  {methods.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, method: value })}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-semibold transition ${
                        form.method === value
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
                {errors.method && <p className="mt-1.5 text-xs text-rose-600">{errors.method}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account number</label>
                <input
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder={form.method === "stripe" ? "Email for Stripe payout" : "Mobile number for payout"}
                  className={`${inputBase} mt-1.5`}
                />
                {errors.accountNumber && <p className="mt-1.5 text-xs text-rose-600">{errors.accountNumber}</p>}
              </div>

              {hasEnoughCredits && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60"
                >
                  {submitting ? <Spinner className="w-4 h-4" color="text-current" /> : <Banknote className="w-4 h-4" />}
                  Request withdrawal
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <TableSkeleton rows={5} cols={4} />
          ) : withdrawals?.length === 0 ? (
            <EmptyState
              icon={<Banknote className="w-8 h-8" />}
              title="No withdrawal requests yet"
              description="When you request a withdrawal, you can track its status here."
            />
          ) : (
            <div className="space-y-3 lg:hidden">
              {withdrawals.map((w) => (
                <div key={w._id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{formatCredits(w.amount)} credits</p>
                      <p className="text-xs text-emerald-600 font-semibold">{formatMoney(w.usdAmount)}</p>
                    </div>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                      {w.method}
                    </span>
                    <span className="truncate">{w.accountNumber}</span>
                    <span>{formatDateTime(w.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && withdrawals?.length > 0 && (
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Payout</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Method</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Account</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w) => (
                      <tr key={w._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">{formatCredits(w.amount)}</p>
                          <p className="text-xs text-emerald-600 font-semibold">{formatMoney(w.usdAmount)}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-500">${w.usdAmount.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                            {w.method}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{w.accountNumber}</td>
                        <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDateTime(w.createdAt)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={w.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
