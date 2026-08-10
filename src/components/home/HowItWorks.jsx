import Link from "next/link";
import { UserPlus, Megaphone, HandCoins, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your account",
    description:
      "Join Fundora as a supporter or creator in under a minute. Supporters receive 50 welcome credits, creators receive 20 to get started.",
  },
  {
    icon: Megaphone,
    step: "02",
    title: "Launch your campaign",
    description:
      "Tell your story, set your funding goal and deadline, and add rewards. Our team reviews every campaign to keep the community trustworthy.",
  },
  {
    icon: HandCoins,
    step: "03",
    title: "Rally your supporters",
    description:
      "Share your campaign and watch contributions roll in. Supporters back you with credits they can purchase at any time.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Bring your idea to life",
    description:
      "Withdraw your raised funds easily and deliver on your promise. Approved contributions move straight to your wallet.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-emerald-50/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
            Simple by design
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            How Fundora Works
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            From first idea to funded reality in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div
              key={step}
              className="relative bg-white rounded-2xl border border-slate-100 shadow-card p-6"
            >
              <span className="absolute top-6 right-6 text-4xl font-extrabold text-slate-100">
                {step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register?role=creator"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg transition"
          >
            Start your campaign today
          </Link>
        </div>
      </div>
    </section>
  );
}
