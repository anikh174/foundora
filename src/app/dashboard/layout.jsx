"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { FullPageLoader } from "@/components/ui/Spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const titles = {
  supporter: {
    "/dashboard/supporter": "Dashboard Home",
    "/dashboard/supporter/explore-campaigns": "Explore Campaigns",
    "/dashboard/supporter/my-contributions": "My Contributions",
    "/dashboard/supporter/purchase-credits": "Purchase Credits",
    "/dashboard/supporter/payment-history": "Payment History",
    "/dashboard/supporter/notifications": "Notifications",
  },
  creator: {
    "/dashboard/creator": "Dashboard Home",
    "/dashboard/creator/add-campaign": "Add New Campaign",
    "/dashboard/creator/my-campaigns": "My Campaigns",
    "/dashboard/creator/contribution-review": "Contribution Review",
    "/dashboard/creator/withdrawals": "Withdrawals",
    "/dashboard/creator/payment-history": "Payment History",
    "/dashboard/creator/notifications": "Notifications",
  },
  admin: {
    "/dashboard/admin": "Dashboard Home",
    "/dashboard/admin/users": "Manage Users",
    "/dashboard/admin/campaigns": "Manage Campaigns",
    "/dashboard/admin/campaign-approval": "Campaign Approval",
    "/dashboard/admin/withdrawals": "Withdrawal Requests",
    "/dashboard/admin/reports": "Reports",
    "/dashboard/admin/notifications": "Notifications",
  },
};

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return <FullPageLoader label="Loading your dashboard..." />;

  const role = user.role;
  const roleMap = titles[role];
  let title = "Dashboard";
  for (const [path, t] of Object.entries(roleMap || {})) {
    if (pathname.startsWith(path)) {
      title = t;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
