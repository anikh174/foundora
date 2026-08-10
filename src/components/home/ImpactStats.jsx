"use client";

import { useEffect, useState } from "react";
import { Users, Wallet, HeartHandshake, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { formatCredits } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    label: "Active Supporters",
    value: (data) => (data ? `${formatCredits(data.supporters)}` : "—"),
    suffix: "+",
    note: "people backing great ideas",
  },
  {
    icon: Wallet,
    label: "Credits Contributed",
    value: (data) => (data ? formatCredits(data.raisedCredits) : "—"),
    suffix: "",
    note: "invested across all campaigns",
  },
  {
    icon: HeartHandshake,
    label: "Campaigns Funded",
    value: (data) => (data ? `${data.funded}` : "—"),
    suffix: "",
    note: "fully funded to their goal",
  },
  {
    icon: TrendingUp,
    label: "Success Rate",
    value: (data) => (data ? `${data.successRate}%` : "—"),
    suffix: "",
    note: "of campaigns reach their goal",
  },
];

export default function ImpactStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/api/campaigns/stats")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            Real impact, real numbers
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Platform Impact Statistics
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Every statistic below represents a real story — a student in class, a family with clean
            water, an artist with a canvas.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, label, value, suffix, note }) => (
            <div
              key={label}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-emerald-700 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">
                {value(data)}
                {suffix}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-200">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
