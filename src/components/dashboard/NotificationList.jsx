"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { EmptyState, Avatar } from "@/components/ui/Misc";
import { Skeleton } from "@/components/ui/Skeleton";
import { timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

const typeIcons = {
  contribution_approved: "✅",
  contribution_rejected: "↩️",
  new_contribution: "🎉",
  campaign_approved: "🚀",
  campaign_rejected: "🚫",
  withdrawal_approved: "💸",
  withdrawal_rejected: "❌",
  campaign_suspended: "⚠️",
  refund: "💰",
  info: "🔔",
};

export default function NotificationList({ role }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/notifications")
      .then((res) => setNotifications(res.data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role]);

  const markAllRead = async () => {
    try {
      await api.patch("/api/notifications/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Could not update notifications");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-100">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8" />}
          title="No notifications yet"
          description="When contributions are approved, campaigns are reviewed, or withdrawals are paid, you will see them here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-2xl border p-5 transition ${
                n.read ? "border-slate-100 opacity-75" : "border-emerald-200 shadow-card"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shrink-0">
                  {typeIcons[n.type] || "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
          <Avatar src={user.image} name={user.name} className="w-9 h-9" />
          <p className="text-xs text-slate-500">
            Notifications are shown only for your account ({user.email}) and sorted newest first.
          </p>
        </div>
      )}
    </div>
  );
}
