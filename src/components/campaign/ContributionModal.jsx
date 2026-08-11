"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Minus, Plus, ShieldCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { api, extractError } from "@/lib/api";
import { formatCredits } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ContributionModal({ open, onClose, campaign, onSuccess }) {
  if (!open) return null;
  return (
    <ContributionDialog
      key={campaign?._id}
      open
      onClose={onClose}
      campaign={campaign}
      onSuccess={onSuccess}
    />
  );
}

function ContributionDialog({ open, onClose, campaign, onSuccess }) {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState(campaign?.minimumContribution || 50);
  const [submitting, setSubmitting] = useState(false);

  const insufficient = user && user.credits < amount;

  const presetAmounts = [100, 250, 500, 1000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (insufficient) {
      router.push("/dashboard/supporter/purchase-credits");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/campaigns/${campaign._id}/contribute`, { amount });
      await refreshUser();
      toast.success("Contribution submitted! Awaiting the creator's approval.");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const quickSelect = (n) => {
    const next = n >= (campaign?.minimumContribution || 50) ? n : campaign?.minimumContribution || 50;
    setAmount(next);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Back this campaign"
      size="max-w-lg"
      footer={
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full px-6 py-3.5 rounded-xl text-white text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 ${
            !user
              ? "bg-slate-800 hover:bg-slate-900"
              : insufficient
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {submitting ? (
            <Spinner className="w-4 h-4" color="text-current" />
          ) : !user ? (
            "Log in to contribute"
          ) : insufficient ? (
            "Not enough credits — buy more"
          ) : (
            `Contribute ${formatCredits(amount)} credits`
          )}
        </button>
      }
    >
      {!authLoading && user && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-5">
          <span className="text-sm font-semibold text-emerald-800">Your available credits</span>
          <span className="inline-flex items-center gap-1.5 text-base font-extrabold text-emerald-700">
            <Coins className="w-4 h-4" /> {formatCredits(user.credits)}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {presetAmounts.map((n) => (
          <button
            key={n}
            onClick={() => quickSelect(n)}
            className={`py-3 rounded-xl text-sm font-bold border transition ${
              amount === n
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-slate-200 text-slate-600 hover:border-emerald-400"
            }`}
          >
            {formatCredits(n)}
          </button>
        ))}
      </div>

      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Contribution amount (credits)
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => setAmount(Math.max(campaign?.minimumContribution || 5, amount - 50))}
          className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={amount}
          min={campaign?.minimumContribution || 5}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-center text-lg font-bold text-slate-900"
        />
        <button
          onClick={() => setAmount(amount + 50)}
          className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Minimum contribution is {formatCredits(campaign?.minimumContribution)} credits.
      </p>

      <div className="mt-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-slate-50 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        Your contribution is held in your wallet and only transferred to the creator once they
        approve it. If it is rejected, the credits are refunded automatically.
      </div>
    </Modal>
  );
}
