import { ShieldCheck, Heart, Users, TrendingUp, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Misc";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-slate-50">
      {/* Brand panel */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[45%] sticky top-0 h-[calc(100vh-64px)] flex-col relative overflow-hidden text-white">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 to-transparent" />
        </div>

        {/* Floating stat cards */}
        <div className="absolute top-24 right-10 w-52 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl border border-white/40 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500">Funded this month</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">$48,250</p>
          <div className="mt-2.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="absolute bottom-40 left-10 w-44 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl border border-white/40 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex -space-x-2">
              {["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6"].map((c, i) => (
                <span key={i} className="w-5 h-5 rounded-full ring-2 ring-white" style={{ background: c }} />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900">2,400+ supporters</p>
          <p className="text-[11px] text-slate-500">backing great ideas</p>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
          <div className="flex items-center gap-2.5">
            <Logo size={40} />
            <span className="text-xl font-extrabold tracking-tight">Fundora</span>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Trusted by creators worldwide
            </span>
            <h2 className="mt-6 text-4xl xl:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight max-w-md">
              Turn ideas into impact.
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-sm">
              Join a community where every credit moves a real campaign forward — from community
              libraries to clean water projects.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899"].map((c, i) => (
                  <span key={i} className="w-9 h-9 rounded-full ring-2 ring-slate-950" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                <span className="font-bold text-white">1,200+</span> campaigns funded
                <br />
                <span className="font-bold text-white">99%</span> creator satisfaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">
              AK
            </div>
            <div>
              <p className="text-sm font-bold">Aisha Khan</p>
              <p className="text-xs text-slate-400">
                &ldquo;We reached 110% of our goal in under a week.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 min-w-0 flex items-center justify-center px-4 sm:px-8 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <Logo size={48} />
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Fundora</h2>
            <p className="mt-1 text-sm text-slate-500">
              Where great ideas meet the people who believe in them.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 p-8 md:p-10 animate-fade-up">
            {children}
          </div>

          <div className="mt-6 hidden lg:flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Your data is protected by 256-bit encryption
          </div>
        </div>
      </main>
    </div>
  );
}
