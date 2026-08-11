import { ShieldCheck, Coins, Rocket, Quote } from "lucide-react";
import { Logo } from "@/components/ui/Misc";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified campaigns",
    description: "Every campaign is reviewed by our team before it goes live.",
  },
  {
    icon: Coins,
    title: "Smart credit wallet",
    description: "Buy credits once and support any cause you believe in — instantly.",
  },
  {
    icon: Rocket,
    title: "Transparent payouts",
    description: "Creators keep 100% of their funded goal, with no hidden fees.",
  },
];

export default function AuthShell({ children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-slate-50">
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[44%] sticky top-0 h-[calc(100vh-64px)] flex-col justify-between p-10 xl:p-14 overflow-hidden bg-slate-950 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <Logo size={40} />
            <span className="text-xl font-extrabold tracking-tight">Fundora</span>
          </div>

          <h2 className="mt-12 text-3xl xl:text-[2.6rem] font-extrabold leading-tight tracking-tight">
            Where great ideas meet the people who believe in them.
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed max-w-md">
            Join a community of creators and supporters turning passion into impact, one
            campaign at a time.
          </p>

          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
          <Quote className="w-6 h-6 text-emerald-400" />
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            &ldquo;Fundora made it possible to fund my community library. The team approved my
            campaign within a day and we reached 110% of our goal!&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">
              AK
            </div>
            <div>
              <p className="text-sm font-bold">Aisha Khan</p>
              <p className="text-xs text-slate-400">Campaign creator</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex items-center justify-center px-4 sm:px-8 py-12 lg:py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <Logo size={48} />
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Fundora</h2>
            <p className="mt-1 text-sm text-slate-500">
              Where great ideas meet the people who believe in them.
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
