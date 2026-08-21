import Link from "next/link";
import { ArrowLeft, BadgeCheck, Quote, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { Avatar, Logo } from "@/components/ui/Misc";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified campaigns",
    text: "Every campaign is reviewed by our team before it goes live.",
  },
  {
    icon: BadgeCheck,
    title: "Secure contributions",
    text: "Credits are held safely until contributions are approved.",
  },
  {
    icon: TrendingUp,
    title: "Real impact",
    text: "Creators withdraw funds and turn ideas into reality.",
  },
];

export default function AuthSplitLayout({ children }) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-emerald-500/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 w-[26rem] h-[26rem] rounded-full bg-sky-500/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={44} />
            <span className="text-xl font-extrabold tracking-tight">Fundora</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="relative max-w-lg">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            Where great ideas meet the people who believe in them.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Fundora connects creators with supporters around the world. Launch a campaign, back a
            cause, and watch ideas come to life — one contribution at a time.
          </p>
          <ul className="mt-8 space-y-5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-400/25">
                  <Icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{title}</span>
                  <span className="mt-0.5 block text-sm text-slate-400">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative max-w-lg rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <Quote className="w-7 h-7 text-emerald-300/60" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed text-slate-200">
            “Fundora made it possible to fund my community library. The credit system is easy to
            understand and we reached 110% of our goal!”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <Avatar
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80"
              name="Aisha Khan"
              className="w-10 h-10 text-sm"
            />
            <span>
              <span className="block text-sm font-bold">Aisha Khan</span>
              <span className="block text-xs text-slate-400">Campaign creator</span>
            </span>
          </figcaption>
        </figure>
      </aside>

      <main className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Fundora</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-10 sm:py-12">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}
