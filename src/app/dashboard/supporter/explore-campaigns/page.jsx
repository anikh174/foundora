"use client";

import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import CampaignCard from "@/components/CampaignCard";
import Pagination from "@/components/ui/Pagination";
import { CampaignCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { api } from "@/lib/api";

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/api/campaigns?page=${page}&limit=9`);
        if (!cancelled) setCampaigns(res.data);
      } catch {
        if (!cancelled) setCampaigns({ campaigns: [], totalPages: 0 });
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
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Explore Campaigns</h1>
        <p className="mt-1 text-sm text-slate-500">
          Back any live, approved campaign right from your dashboard.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : campaigns?.campaigns?.length === 0 ? (
        <EmptyState
          icon={<SearchX className="w-8 h-8" />}
          title="No active campaigns right now"
          description="Check back soon — creators are launching new campaigns all the time."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns?.campaigns?.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
          {campaigns?.totalPages > 1 && (
            <Pagination page={page} totalPages={campaigns.totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
