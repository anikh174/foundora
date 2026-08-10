"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, ChevronDown, LogOut, LayoutDashboard, Coins, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Logo } from "@/components/ui/Misc";
import { api } from "@/lib/api";
import { formatCredits } from "@/lib/utils";

const dashboardPathFor = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "creator") return "/dashboard/creator";
  return "/dashboard/supporter";
};

export default function Navbar() {
  const pathname = usePathname();
  return <NavbarShell key={pathname} />;
}

function NavbarShell() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      api
        .get("/api/notifications")
        .then((res) => setUnread(res.data.unreadCount || 0))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={38} />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Fundora
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className={`text-sm font-semibold transition ${
                isActive("/") ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className={`text-sm font-semibold transition ${
                pathname.startsWith("/campaigns") ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Explore Campaigns
            </Link>
            <Link
              href="/register?role=creator"
              className={`text-sm font-semibold transition ${
                pathname === "/register" ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Join as Creator
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-28 h-9 bg-slate-100 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="flex items-center gap-3" ref={menuRef}>
                <Link
                  href={`${dashboardPathFor(user.role)}/notifications`}
                  className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition"
                >
                  <Avatar src={user.image} name={user.name} className="w-8 h-8 text-xs" />
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-slate-800 leading-tight max-w-[140px] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium capitalize leading-tight">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-16 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fade-up">
                    <div className="px-3 py-3 rounded-xl bg-slate-50 mb-1">
                      <p className="text-xs text-slate-500">Available credits</p>
                      <p className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-500" />
                        {formatCredits(user.credits)}
                      </p>
                    </div>
                    <Link
                      href={dashboardPathFor(user.role)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {user.role === "supporter" && (
                      <Link
                        href="/dashboard/supporter/purchase-credits"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <Coins className="w-4 h-4" /> Purchase credits
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 mb-2">
                <Avatar src={user.image} name={user.name} className="w-10 h-10 text-sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user.role} • {formatCredits(user.credits)} credits
                  </p>
                </div>
              </div>
            )}
            <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition">
              Home
            </Link>
            <Link
              href="/campaigns"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition"
            >
              <Search className="w-4 h-4 text-slate-400" /> Explore Campaigns
            </Link>
            <Link
              href="/register?role=creator"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition"
            >
              <Coins className="w-4 h-4 text-slate-400" /> Join as Creator
            </Link>

            {user ? (
              <>
                <Link
                  href={dashboardPathFor(user.role)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                </Link>
                <Link
                  href={`${dashboardPathFor(user.role)}/notifications`}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition"
                >
                  <Bell className="w-4 h-4 text-slate-400" /> Notifications
                  {unread > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 rounded-xl text-center text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
