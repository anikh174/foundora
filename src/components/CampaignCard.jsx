"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Heart, ChevronRight } from "lucide-react";
import ProgressBar from "./ui/ProgressBar";
import { Avatar } from "./ui/Misc";
import { categoryEmoji, daysRemaining, formatCredits, formatMoney, progressPercent } from "@/lib/utils";

export default function CampaignCard({ campaign }) {
  if (!campaign) return null;

  const percent = progressPercent(campaign.raised, campaign.fundingGoal);
  const days = daysRemaining(campaign.deadline);
  const progressWidth = Math.min(percent, 100);

  return (
    <Link
      href={`/campaign/${campaign._id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur rounded-full text-[11px] font-bold text-slate-700 shadow-sm">
            <span>{categoryEmoji[campaign.category] || "📌"}</span>
            {campaign.category}
          </span>
        </div>
        {percent >= 100 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-bold shadow-sm">
            Funded
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
          {campaign.title}
        </h3>

        <div className="flex items-center gap-2 mt-3">
          <Avatar src={campaign.creatorImage} name={campaign.creatorName} className="w-6 h-6 text-[10px]" />
          <span className="text-xs text-slate-500 font-medium truncate">{campaign.creatorName}</span>
        </div>

        <div className="mt-4 flex-1">
          <ProgressBar percent={progressWidth} />
        </div>

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Raised</p>
            <p className="text-sm font-bold text-slate-900">
              {formatCredits(campaign.raised)} <span className="text-slate-400 font-medium">credits</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Goal</p>
            <p className="text-sm font-semibold text-slate-600">{formatCredits(campaign.fundingGoal)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {days > 0 ? `${days} days left` : "Ended"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:gap-2 transition-all">
            View campaign <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
