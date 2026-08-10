"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const categories = [
  "All",
  "Education",
  "Health & Medicine",
  "Technology & Innovation",
  "Environment",
  "Community & Social",
  "Arts & Culture",
  "Emergency Relief",
  "Food & Hunger",
];

const goalRanges = [
  { value: "Any", label: "Any funding goal" },
  { value: "small", label: "Under 5,000 credits" },
  { value: "medium", label: "5,000 – 20,000 credits" },
  { value: "large", label: "Over 20,000 credits" },
];

const deadlineRanges = [
  { value: "Any", label: "Any deadline" },
  { value: "week", label: "Ending within 7 days" },
  { value: "month", label: "Ending within 30 days" },
  { value: "long", label: "More than 30 days" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "raised", label: "Most funded" },
  { value: "goal", label: "Biggest goal" },
  { value: "deadline", label: "Ending soonest" },
];

export default function FilterBar({ filters, onChange, onClear, resultCount }) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const update = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    update("search", searchInput.trim());
  };

  const hasActiveFilters = filters.search || filters.category !== "All" || filters.goal !== "Any" || filters.deadline !== "Any" || filters.sort !== "newest";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 mb-8">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search campaigns by title..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </form>

      <div className={`mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${open ? "block" : "hidden lg:grid"}`}>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Funding goal</label>
          <select
            value={filters.goal}
            onChange={(e) => update("goal", e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
          >
            {goalRanges.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Deadline</label>
          <select
            value={filters.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
          >
            {deadlineRanges.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sort by</label>
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
          >
            <X className="w-3 h-3" /> Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
