export default function StatCard({ icon: Icon, label, value, sublabel, accent = "emerald" }) {
  const accents = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accents[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}
