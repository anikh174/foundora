"use client";

import { useState } from "react";
import { Coins, Zap, ShieldCheck, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, extractError } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { formatCredits } from "@/lib/utils";
import toast from "react-hot-toast";

const packages = [
  { id: "pkg_100", credits: 100, price: 10, badge: "Starter" },
  { id: "pkg_300", credits: 300, price: 25, badge: "Popular", popular: true },
  { id: "pkg_800", credits: 800, price: 60, badge: "Pro" },
  { id: "pkg_1500", credits: 1500, price: 110, badge: "Max" },
];

export default function PurchaseCredits() {
  const { user, refreshUser } = useAuth();
  const [processing, setProcessing] = useState(null);

  const handlePurchase = async (pkg) => {
    setProcessing(pkg.id);
    try {
      const res = await api.post("/api/payments/create-checkout", { packageId: pkg.id });
      window.location.assign(res.data.url);
    } catch (error) {
      toast.error(extractError(error));
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Purchase Credits</h1>
        <p className="mt-1 text-sm text-slate-500">
          Top up your wallet to keep supporting campaigns. Payments are processed securely by
          Stripe.
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 max-w-md">
        <Coins className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm font-semibold text-emerald-800">
          Current balance: {formatCredits(user?.credits || 0)} credits
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-2xl border p-6 flex flex-col shadow-card transition hover:shadow-card-hover ${
              pkg.popular ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-100"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                Most popular
              </span>
            )}
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {pkg.badge}
              </span>
            </div>
            <p className="mt-5 text-3xl font-extrabold text-slate-900">{formatCredits(pkg.credits)}</p>
            <p className="text-xs text-slate-500 font-medium">credits</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
              <p className="text-2xl font-extrabold text-emerald-600">${pkg.price}</p>
              <p className="text-xs text-slate-400">one-time</p>
            </div>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={processing === pkg.id}
              className={`mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition disabled:opacity-60 ${
                pkg.popular
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {processing === pkg.id ? (
                <>
                  <Spinner className="w-4 h-4" color="text-current" /> Redirecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Buy now
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100">
          <Zap className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-900">Instant delivery</p>
            <p className="text-xs text-slate-500 mt-0.5">Credits are added to your wallet immediately after payment.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-900">Secure payments</p>
            <p className="text-xs text-slate-500 mt-0.5">Payments are processed and protected by Stripe.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100">
          <Coins className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-900">No hidden fees</p>
            <p className="text-xs text-slate-500 mt-0.5">What you see is exactly what you pay.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
