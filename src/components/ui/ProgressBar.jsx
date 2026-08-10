"use client";

export default function ProgressBar({ percent, height = "h-2.5", showLabel = false }) {
  const safePercent = Math.min(Math.max(percent, 0), 100);
  return (
    <div>
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${safePercent}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-semibold text-emerald-600 mt-1.5">{safePercent}% funded</p>
      )}
    </div>
  );
}
