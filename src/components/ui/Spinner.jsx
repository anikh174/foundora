export function Spinner({ className = "w-5 h-5", color = "text-emerald-500" }) {
  return (
    <svg className={`animate-spin ${className} ${color}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function ButtonSpinner() {
  return <Spinner className="w-4 h-4" color="text-current" />;
}

export function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Spinner className="w-7 h-7" color="text-emerald-600" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
