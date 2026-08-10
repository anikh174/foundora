"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
  Clock,
  Target,
  Users,
  Flag,
  CalendarDays,
  Coins,
  Gift,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { categoryEmoji, daysRemaining, formatCredits, formatDate, progressPercent } from "@/lib/utils";
import { Avatar } from "@/components/ui/Misc";
import ProgressBar from "@/components/ui/ProgressBar";
import { FullPageLoader } from "@/components/ui/Spinner";
import ContributionModal from "@/components/campaign/ContributionModal";
import ReportModal from "@/components/campaign/ReportModal";
import { useAuth } from "@/context/AuthContext";

export default function CampaignDetails({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [supporterCount, setSupporterCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/api/campaigns/${id}`)
      .then((res) => {
        if (active) {
          setCampaign(res.data.campaign);
          setSupporterCount(res.data.supporterCount || 0);
        }
      })
      .catch(() => {
        if (active) router.replace("/campaigns");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, router]);

  if (loading) return <FullPageLoader label="Loading campaign..." />;
  if (!campaign) return null;

  const percent = progressPercent(campaign.raised, campaign.fundingGoal);
  const days = daysRemaining(campaign.deadline);
  const isOwner = user && user.email === campaign.creatorEmail;

  return (
    <div className="bg-slate-50">
      <div className="relative h-[340px] md:h-[440px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${campaign.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link href="/campaigns" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to campaigns
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <span>{categoryEmoji[campaign.category] || "📌"}</span> {campaign.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" /> {days > 0 ? `${days} days left` : "Ended"}
                </span>
              </div>

              <h1 className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {campaign.title}
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <Avatar src={campaign.creatorImage} name={campaign.creatorName} className="w-12 h-12 text-base" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Campaign by</p>
                  <p className="font-bold text-slate-900">{campaign.creatorName}</p>
                  <p className="text-xs text-slate-500">{campaign.creatorEmail}</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-900">
                    {formatCredits(campaign.raised)}{" "}
                    <span className="text-slate-400 font-medium">credits raised</span>
                  </p>
                  <p className="text-sm font-bold text-emerald-600">{percent}%</p>
                </div>
                <ProgressBar percent={percent} height="h-3" />
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-base font-extrabold text-slate-900">
                      {formatCredits(campaign.raised)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">Raised</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-base font-extrabold text-slate-900">
                      {formatCredits(campaign.fundingGoal)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">Goal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-base font-extrabold text-slate-900">{supporterCount}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase mt-0.5">Supporters</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                Deadline: <span className="font-semibold text-slate-700">{formatDate(campaign.deadline)}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-900">About this campaign</h2>
                <div className="mt-3 prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{campaign.story}</p>
                </div>
              </div>
            </div>

            {campaign.reward && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Rewards for backers</h2>
                </div>
                <div className="mt-4 px-5 py-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{campaign.reward}</p>
                </div>
              </div>
            )}

            {!isOwner && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <button
                  onClick={() => setReportOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
                >
                  <Flag className="w-4 h-4" /> Report this campaign
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Back this campaign</p>
                  <p className="text-xs text-slate-500">
                    Min. {formatCredits(campaign.minimumContribution)} credits
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (campaign.status !== "approved" || days <= 0) return;
                  if (!user) {
                    router.push("/login");
                    return;
                  }
                  if (isOwner) return;
                  setContributeOpen(true);
                }}
                disabled={campaign.status !== "approved" || days <= 0 || isOwner}
                className="w-full px-6 py-4 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOwner
                  ? "You created this campaign"
                  : campaign.status !== "approved"
                    ? "Not accepting contributions"
                    : days <= 0
                      ? "Campaign has ended"
                      : "Contribute now"}
              </button>

              <div className="mt-4 space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" /> Funding goal:{" "}
                  <span className="font-semibold text-slate-700">{formatCredits(campaign.fundingGoal)} credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> {supporterCount} supporters so far
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs leading-relaxed text-slate-500">
                  Contributions are deducted from your credit wallet immediately but only reach the
                  creator once approved. Every contribution helps a real campaign get closer to its
                  goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContributionModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
        campaign={campaign}
        onSuccess={() => {
          api.get(`/api/campaigns/${id}`).then((res) => {
            setCampaign(res.data.campaign);
            setSupporterCount(res.data.supporterCount || 0);
          });
        }}
      />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} campaignId={campaign._id} />
    </div>
  );
}
