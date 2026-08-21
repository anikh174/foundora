import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Misc";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[12%] w-[26rem] h-[26rem] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 left-[8%] w-[24rem] h-[24rem] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <header className="relative flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={38} />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">Fundora</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </header>

      <main className="relative flex flex-1 px-5 pb-14 sm:px-10">
        <div className="m-auto w-full max-w-md pt-4 animate-fade-up">{children}</div>
      </main>

      <footer className="relative flex items-center justify-center gap-2 pb-8 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        Your data is protected by 256-bit encryption
      </footer>
    </div>
  );
}
