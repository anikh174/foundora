"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryEmoji } from "@/lib/utils";

const categories = [
  { name: "Education", blurb: "Schools, scholarships, and learning" },
  { name: "Health & Medicine", blurb: "Treatment, care, and medical devices" },
  { name: "Technology & Innovation", blurb: "Open source, hardware, and apps" },
  { name: "Environment", blurb: "Clean water, energy, and conservation" },
  { name: "Community & Social", blurb: "Neighborhoods and public good" },
  { name: "Arts & Culture", blurb: "Music, film, and public art" },
  { name: "Emergency Relief", blurb: "Rapid response to urgent needs" },
  { name: "Food & Hunger", blurb: "Meals, food banks, and farms" },
];

export default function ExploreCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
          Find your cause
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Explore by Category
        </h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          Whatever you care about, there is a campaign ready for your support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/campaigns?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-2xl border border-slate-100 shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {categoryEmoji[category.name] || "📌"}
            </div>
            <h3 className="mt-4 font-bold text-slate-900 group-hover:text-emerald-700 transition">
              {category.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{category.blurb}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition">
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
