"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserRound, Coins, CreditCard, Megaphone, Hourglass, Wallet, Flag, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCredits, formatMoney } from "@/lib/utils";

export default function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch(() => {});
  }, []);

  const quickActions = [
    { label: "Campaign approval", count: stats?.pendingCampaigns, href: "/dashboard/admin/campaign-approval", icon: Megaphone, accent: "amber" },
    { label: "Withdrawal requests", count: stats?.pendingWithdrawals, href: "/dashboard/admin/withdrawals", icon: Wallet, accent: "sky" },
    { label: "Pending reports", count: stats?.pendingReports, href: "/dashboard/admin/reports", icon: Flag, accent: "rose" },
    { label: "Pending contributions", count: stats?.pendingContributions, href: "/dashboard/admin/campaigns", icon: Hourglass, accent: "violet" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Supporters"
          value={stats ? formatCredits(stats.totalSupporters) : "—"}
          sublabel="Registered supporter accounts"
          accent="emerald"
        />
        <StatCard
          icon={UserRound}
          label="Total Creators"
          value={stats ? formatCredits(stats.totalCreators) : "—"}
          sublabel="Registered creator accounts"
          accent="sky"
        />
        <StatCard
          icon={Coins}
          label="Total Available Credits"
          value={stats ? formatCredits(stats.totalAvailableCredits) : "—"}
          sublabel="Across all user wallets"
          accent="violet"
        />
        <StatCard
          icon={CreditCard}
          label="Total Payments Processed"
          value={stats ? formatMoney(stats.totalPaymentsProcessed) : "—"}
          sublabel="Via Stripe credit purchases"
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {quickActions.map(({ label, count, href, icon: Icon, accent }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-extrabold text-slate-900">{count ?? "—"}</p>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <h2 className="font-bold text-slate-900">Platform at a glance</h2>
        {!stats ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-2xl font-extrabold text-slate-900">{stats.totalCampaigns}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total campaigns</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50">
              <p className="text-2xl font-extrabold text-amber-700">{stats.pendingCampaigns}</p>
              <p className="text-xs text-amber-600 mt-0.5">Pending approval</p>
            </div>
            <div className="p-4 rounded-xl bg-sky-50">
              <p className="text-2xl font-extrabold text-sky-700">{stats.pendingWithdrawals}</p>
              <p className="text-xs text-sky-600 mt-0.5">Pending withdrawals</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50">
              <p className="text-2xl font-extrabold text-rose-700">{stats.pendingReports}</p>
              <p className="text-xs text-rose-600 mt-0.5">Pending reports</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
