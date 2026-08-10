import Link from "next/link";
import { Globe, MessageCircle, Share2, Send, AtSign, Heart } from "lucide-react";
import { Logo } from "@/components/ui/Misc";

const footerLinks = {
  Platform: [
    { label: "Explore Campaigns", href: "/campaigns" },
    { label: "Start a Campaign", href: "/register?role=creator" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Login", href: "/login" },
  ],
  Categories: [
    "Education",
    "Health & Medicine",
    "Technology & Innovation",
    "Environment",
    "Community & Social",
  ],
};

const socials = [
  { icon: Globe, label: "Website", href: "https://fundora.com" },
  { icon: MessageCircle, label: "Community", href: "https://community.fundora.com" },
  { icon: Share2, label: "Share", href: "https://blog.fundora.com" },
  { icon: Send, label: "Telegram", href: "https://t.me/fundora" },
  { icon: AtSign, label: "Email", href: "mailto:support@fundora.com" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={40} />
              <span className="text-xl font-extrabold tracking-tight text-white">Fundora</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Fundora is a modern crowdfunding platform that turns ideas into impact. Support
              campaigns you believe in, or launch your own and rally a community around it.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.Platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.Categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/campaigns?category=${encodeURIComponent(cat)}`} className="text-sm text-slate-400 hover:text-emerald-400 transition">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Get in touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>support@fundora.com</li>
              <li>+1 (555) 014-2233</li>
              <li>120 Innovation Drive, Suite 410<br />San Francisco, CA 94107</li>
            </ul>
            <Link
              href="/register?role=creator"
              className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Fundora. All rights reserved.</p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-emerald-500" /> for creators and supporters everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
