"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const dashboardPath = user
    ? user.role === "creator"
      ? "/dashboard/creator"
      : user.role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/supporter"
    : "/login";

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Access Restricted</h1>
        <p className="mt-3 text-slate-500 leading-relaxed">
          You do not have permission to view this page. The dashboard you tried to open requires a
          different account role.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={dashboardPath}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
          >
            Go to my dashboard
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
