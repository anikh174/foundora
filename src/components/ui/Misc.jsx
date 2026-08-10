import Image from "next/image";

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-slate-200 bg-white/60">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Logo({ size = 40 }) {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-2/3 h-2/3">
        <path d="M12 2v4" />
        <path d="m16.24 7.76 2.83-2.83" />
        <path d="M2 12h4" />
        <path d="m5.07 4.93 2.83 2.83" />
        <path d="M20 12h2" />
        <path d="M12 6a6 6 0 0 0 6 6 6 6 0 0 0-6-6a6 6 0 0 0-6 6 6 6 0 0 0 6-6Z" />
        <path d="M8 15a4 4 0 0 0 8 0" />
      </svg>
    </div>
  );
}

export function Avatar({ src, name, className = "w-9 h-9 text-sm" }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-semibold overflow-hidden shrink-0 ${className}`}
    >
      {src ? (
        <Image src={src} alt={name || "avatar"} width={96} height={96} className="w-full h-full object-cover" unoptimized />
      ) : (
        <span>{(name || "?").charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
