"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Misc";
import { api } from "@/lib/api";
import { formatCredits } from "@/lib/utils";

export default function DashboardTopbar({ onMenuClick, title }) {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/notifications")
      .then((res) => setUnread(res.data.unreadCount || 0))
      .catch(() => {});
  }, [user]);

  return (
    <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-100">
      <div className="flex items-center justify-between px-4 sm:px-8 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">{title || "Dashboard"}</h1>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === "supporter" && (
            <Link
              href="/dashboard/supporter/purchase-credits"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition"
            >
              <Coins className="w-4 h-4" />
              {formatCredits(user.credits)} credits
            </Link>
          )}
          {user?.role === "creator" && (
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">
              <Coins className="w-4 h-4" />
              {formatCredits(user.credits)} credits
            </div>
          )}

          <Link
            href={`/dashboard/${user?.role}/notifications`}
            className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
            <Avatar src={user?.image} name={user?.name} className="w-8 h-8 text-xs" />
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-emerald-600 font-medium capitalize leading-tight">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
