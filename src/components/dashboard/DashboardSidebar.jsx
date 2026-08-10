import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  Coins,
  CreditCard,
  Bell,
  Rocket,
  FolderOpen,
  HandCoins,
  Wallet,
  History,
  Users,
  Megaphone,
  ClipboardCheck,
  Banknote,
  Flag,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Misc";

const linkGroups = {
  supporter: [
    { section: "Overview", links: [{ label: "Dashboard Home", href: "/dashboard/supporter", icon: LayoutDashboard }] },
    {
      section: "Campaigns",
      links: [
        { label: "Explore Campaigns", href: "/dashboard/supporter/explore-campaigns", icon: Compass },
        { label: "My Contributions", href: "/dashboard/supporter/my-contributions", icon: HandCoins },
      ],
    },
    {
      section: "Wallet",
      links: [
        { label: "Purchase Credits", href: "/dashboard/supporter/purchase-credits", icon: Coins },
        { label: "Payment History", href: "/dashboard/supporter/payment-history", icon: CreditCard },
      ],
    },
    { section: "Alerts", links: [{ label: "Notifications", href: "/dashboard/supporter/notifications", icon: Bell }] },
  ],
  creator: [
    { section: "Overview", links: [{ label: "Dashboard Home", href: "/dashboard/creator", icon: LayoutDashboard }] },
    {
      section: "Campaigns",
      links: [
        { label: "Add New Campaign", href: "/dashboard/creator/add-campaign", icon: Rocket },
        { label: "My Campaigns", href: "/dashboard/creator/my-campaigns", icon: FolderOpen },
        { label: "Contribution Review", href: "/dashboard/creator/contribution-review", icon: ClipboardCheck },
      ],
    },
    {
      section: "Wallet",
      links: [
        { label: "Withdrawals", href: "/dashboard/creator/withdrawals", icon: Banknote },
        { label: "Payment History", href: "/dashboard/creator/payment-history", icon: History },
      ],
    },
    { section: "Alerts", links: [{ label: "Notifications", href: "/dashboard/creator/notifications", icon: Bell }] },
  ],
  admin: [
    { section: "Overview", links: [{ label: "Dashboard Home", href: "/dashboard/admin", icon: LayoutDashboard }] },
    {
      section: "Management",
      links: [
        { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Manage Campaigns", href: "/dashboard/admin/campaigns", icon: Megaphone },
      ],
    },
    {
      section: "Moderation",
      links: [
        { label: "Campaign Approval", href: "/dashboard/admin/campaign-approval", icon: ClipboardCheck },
        { label: "Withdrawal Requests", href: "/dashboard/admin/withdrawals", icon: Wallet },
        { label: "Reports", href: "/dashboard/admin/reports", icon: Flag },
      ],
    },
    { section: "Alerts", links: [{ label: "Notifications", href: "/dashboard/admin/notifications", icon: Bell }] },
  ],
};

export default function DashboardSidebar({ open, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;
  const groups = linkGroups[user.role] || [];

  const isActive = (href) => {
    if (href === `/dashboard/${user.role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-slate-950 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-extrabold text-lg">
            F
          </div>
          <div>
            <p className="text-white font-extrabold leading-tight">Fundora</p>
            <p className="text-[11px] text-slate-400 capitalize">{user.role} dashboard</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {groups.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.links.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive(href)
                        ? "bg-emerald-600/15 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={user.image} name={user.name} className="w-9 h-9 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
