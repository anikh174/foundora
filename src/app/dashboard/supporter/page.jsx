"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HandCoins, Hourglass, BadgeCheck, Coins, Compass, ArrowRight, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { formatCredits } from "@/lib/utils";

export default function SupporterHome() {
  const { user, refreshUser } = useAuth();
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/contributions/my?limit=100")
      .then((res) => setContributions(res.data.contributions || []))
      .catch(() => setContributions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const pending = contributions?.filter((c) => c.status === "pending") || [];
  const approved = contributions?.filter((c) => c.status === "approved") || [];
  const approvedAmount = approved.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={HandCoins}
          label="Total Contributions"
          value={loading ? "—" : formatCredits(contributions?.length || 0)}
          sublabel={`${contributions?.length || 0} contribution${(contributions?.length || 0) !== 1 ? "s" : ""} made`}
          accent="emerald"
        />
        <StatCard
          icon={Hourglass}
          label="Pending Contributions"
          value={loading ? "—" : formatCredits(pending.length)}
          sublabel="Awaiting creator approval"
          accent="amber"
        />
        <StatCard
          icon={BadgeCheck}
          label="Approved Contribution Amount"
          value={loading ? "—" : formatCredits(approvedAmount)}
          sublabel="Credits successfully transferred"
          accent="sky"
        />
        <StatCard
          icon={Coins}
          label="Available Credits"
          value={loading ? "—" : formatCredits(user?.credits || 0)}
          sublabel="Ready to support campaigns"
          accent="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent contributions</h2>
            <Link
              href="/dashboard/supporter/my-contributions"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : contributions?.length === 0 ? (
            <EmptyState
              icon={<HandCoins className="w-7 h-7" />}
              title="No contributions yet"
              description="Explore campaigns and back the ones you care about with your credits."
              action={
                <Link
                  href="/dashboard/supporter/explore-campaigns"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  <Compass className="w-4 h-4" /> Explore campaigns
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {contributions.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{c.campaignTitle}</p>
                    <p className="text-xs text-slate-500">{c.amount} credits</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : c.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="font-bold text-slate-900">Need more credits?</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Top up your wallet and keep supporting the campaigns you believe in. Packages start at
            just $10.
          </p>
          <Link
            href="/dashboard/supporter/purchase-credits"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
          >
            <Coins className="w-4 h-4" /> Purchase credits
          </Link>
        </div>
      </div>
    </div>
  );
}
