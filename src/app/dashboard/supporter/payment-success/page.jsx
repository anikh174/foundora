"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, extractError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatCredits, formatMoney, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PaymentSuccess({ searchParams }) {
  const { refreshUser } = useAuth();
  const { session_id: sessionId } = use(searchParams);
  const [status, setStatus] = useState("verifying");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    api
      .post("/api/payments/verify", { sessionId })
      .then(async (res) => {
        setPayment(res.data.payment);
        setStatus("success");
        await refreshUser();
      })
      .catch((error) => {
        toast.error(extractError(error));
        setStatus("error");
      });
  }, [sessionId, refreshUser]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="mt-4 font-semibold text-slate-700">Verifying your payment...</p>
      </div>
    );
  }

  if (!sessionId || status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-bold text-slate-900">We could not verify your payment</p>
        <p className="mt-2 text-sm text-slate-500">Please try again or contact support.</p>
        <Link
          href="/dashboard/supporter/purchase-credits"
          className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
        >
          Back to purchase credits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-card p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Payment successful!</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your credits have been added to your wallet and are ready to use.
      </p>

      <div className="mt-6 p-4 rounded-xl bg-slate-50 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Credits added</span>
          <span className="font-bold text-slate-900">{formatCredits(payment?.credits)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Amount paid</span>
          <span className="font-bold text-slate-900">{formatMoney(payment?.amountUSD)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Date</span>
          <span className="font-semibold text-slate-700">{formatDateTime(payment?.createdAt)}</span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3">
        <Link
          href="/dashboard/supporter/explore-campaigns"
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
        >
          Explore campaigns
        </Link>
        <Link
          href="/dashboard/supporter/payment-history"
          className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
        >
          View payment history
        </Link>
      </div>
    </div>
  );
}
