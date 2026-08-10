"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Misc";
import "swiper/css";

const testimonials = [
  {
    name: "Aisha Khan",
    role: "Campaign creator",
    quote:
      "Fundora made it possible to fund my community library. The credit system is easy to understand and the team approved my campaign within a day. We reached 110% of our goal!",
    image: "https://picsum.photos/seed/aisha/200/200",
  },
  {
    name: "Daniel Reyes",
    role: "Supporter",
    quote:
      "I have backed seven campaigns on Fundora. The approval process for contributions gives me confidence that my credits are going to genuine causes. The notifications keep me in the loop every step of the way.",
    image: "https://picsum.photos/seed/daniel/200/200",
  },
  {
    name: "Grace Okonkwo",
    role: "Campaign creator",
    quote:
      "As a first-time creator I was nervous, but the dashboard made everything obvious — approvals, contributions, withdrawals. I withdrew my funds to buy medical equipment with zero hassle.",
    image: "https://picsum.photos/seed/grace/200/200",
  },
  {
    name: "Liam O'Connor",
    role: "Supporter",
    quote:
      "Purchasing credits was smooth and instant. I love that I can support a clean water project one week and a street art festival the next, all from one wallet.",
    image: "https://picsum.photos/seed/liam/200/200",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
          Loved by the community
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          What Our Community Says
        </h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1200: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="pb-2"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.name}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-7 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-emerald-200" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-slate-700 leading-relaxed text-sm flex-1">“{t.quote}”</p>
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <Avatar src={t.image} name={t.name} className="w-11 h-11 text-sm" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
