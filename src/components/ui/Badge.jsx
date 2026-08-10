export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    suspended: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <Badge className={map[status] || "bg-slate-50 text-slate-600 ring-slate-200"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
