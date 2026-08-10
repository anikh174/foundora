"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 bg-slate-50 transition-colors duration-300">
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-70" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="relative z-10 flex items-center justify-center bg-white rounded-full p-3 shadow-card border border-emerald-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-emerald-600"
          >
            <path d="M12 2v4" />
            <path d="m16.24 7.76 2.83-2.83" />
            <path d="M2 12h4" />
            <path d="m5.07 4.93 2.83 2.83" />
            <path d="M20 12h2" />
            <path d="M12 6a6 6 0 0 0 6 6 6 6 0 0 0-6-6a6 6 0 0 0-6 6 6 6 0 0 0 6-6Z" />
            <path d="M8 15a4 4 0 0 0 8 0" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-3 text-center max-w-sm">
        <h3 className="text-sm font-bold tracking-wide text-slate-800">
          Loading Fundora...
        </h3>
        <p className="text-xs text-slate-400">
          Preparing your crowdfunding experience
        </p>
        <div className="flex items-center space-x-1.5 pt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
