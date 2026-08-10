"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import FilterBar from "@/components/campaign/FilterBar";
import CampaignCard from "@/components/CampaignCard";
import Pagination from "@/components/ui/Pagination";
import { CampaignCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/Misc";
import { api } from "@/lib/api";

const defaultFilters = {
  search: "",
  category: "All",
  goal: "Any",
  deadline: "Any",
  sort: "newest",
  page: 1,
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState(() => {
    const category = searchParams.get("category");
    return { ...defaultFilters, category: category || "All" };
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== "Any" && value !== "All") params.append(key, value);
        });
        const res = await api.get(`/api/campaigns?${params.toString()}`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData({ campaigns: [], total: 0, totalPages: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleChange = (next) => {
    setLoading(true);
    setFilters(next);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    router.replace("/campaigns", { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Explore Campaigns
        </h1>
        <p className="mt-2 text-slate-500 max-w-2xl">
          Discover live, verified campaigns across every category. Only approved campaigns with an
          active deadline appear here.
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        resultCount={data?.total ?? 0}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.campaigns?.length === 0 ? (
        <EmptyState
          icon={<SearchX className="w-8 h-8" />}
          title="No campaigns match your filters"
          description="Try adjusting your search or clearing filters to see more live campaigns."
          action={
            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.campaigns?.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
          {data?.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => handleChange({ ...filters, page })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
