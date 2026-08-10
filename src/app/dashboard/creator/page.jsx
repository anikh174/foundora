"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FolderOpen, Rocket, Coins, Hourglass, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCredits } from "@/lib/utils";

export default function CreatorHome() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState(null);
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/campaigns/my").catch(() => ({ data: { campaigns: [] } })),
      api.get("/api/campaigns/pending-contributions").catch(() => ({ data: { contributions: [] } })),
    ])
      .then(([campRes, pendRes]) => {
        setCampaigns(campRes.data.campaigns || []);
        setPending(pendRes.data.contributions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCampaigns = campaigns?.filter((c) => c.status === "approved") || [];
  const totalRaised = campaigns?.reduce((sum, c) => sum + c.raised, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={FolderOpen}
          label="Total Campaigns"
          value={loading ? "—" : formatCredits(campaigns?.length || 0)}
          sublabel="All campaigns you have launched"
          accent="emerald"
        />
        <StatCard
          icon={Rocket}
          label="Active Campaigns"
          value={loading ? "—" : formatCredits(activeCampaigns.length)}
          sublabel="Live and accepting contributions"
          accent="sky"
        />
        <StatCard
          icon={Coins}
          label="Total Raised Credits"
          value={loading ? "—" : formatCredits(totalRaised)}
          sublabel="Across all your campaigns"
          accent="violet"
        />
        <StatCard
          icon={Hourglass}
          label="Pending Contributions"
          value={loading ? "—" : formatCredits(pending?.length || 0)}
          sublabel="Waiting for your review"
          accent="amber"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Your campaigns</h2>
          <Link
            href="/dashboard/creator/add-campaign"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> Add campaign
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : campaigns?.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-7 h-7" />}
            title="No campaigns yet"
            description="Launch your first campaign and start raising funds for your idea."
          />
        ) : (
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <div
                key={c._id}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{c.title}</p>
                  <p className="text-xs text-slate-500">
                    {formatCredits(c.raised)} / {formatCredits(c.fundingGoal)} credits raised
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
