"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import CampaignCard from "@/components/CampaignCard";
import { CampaignCardSkeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";

export default function TopCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/api/campaigns/top?limit=6")
      .then((res) => {
        if (active) setCampaigns(res.data.campaigns || []);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Trending now
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Most Funded Campaigns
          </h2>
          <p className="mt-2 text-slate-500 max-w-xl">
            These campaigns are capturing hearts and credits right now. Join the movement before the
            deadline.
          </p>
        </div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition self-start"
        >
          View all campaigns <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No active campaigns yet. Be the first to start one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </section>
  );
}
