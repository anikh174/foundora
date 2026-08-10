import Link from "next/link";
import { Rocket } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-16 md:px-16 text-center">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h2 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Have an idea worth funding?
          </h2>
          <p className="mt-3 text-emerald-100 max-w-xl mx-auto">
            Join Fundora as a creator and turn your passion project into a fully funded reality.
            It only takes a few minutes to launch.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register?role=creator"
              className="px-7 py-3.5 rounded-2xl bg-white text-emerald-700 text-sm font-bold hover:bg-emerald-50 shadow-lg transition"
            >
              Start a Campaign
            </Link>
            <Link
              href="/campaigns"
              className="px-7 py-3.5 rounded-2xl border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
