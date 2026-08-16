import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Misc";

export default function AuthShell({ children }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 lg:py-16 relative overflow-hidden bg-slate-50">
      {/* Ambient glow background */}
      <div className="absolute -top-24 right-[10%] w-[32rem] h-[32rem] rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-24 left-[5%] w-[28rem] h-[28rem] rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-white blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size={48} />
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Fundora</h2>
          <p className="mt-1 text-sm text-slate-500">
            Where great ideas meet the people who believe in them.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 p-7 sm:p-9 animate-fade-up">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Your data is protected by 256-bit encryption
        </div>
      </div>
    </div>
  );
}
