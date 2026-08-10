"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: "idea",
    title: "Turn Ideas Into Impact.",
    subtitle:
      "Launch your campaign, rally a community, and fund the change you want to see in the world.",
    image: "https://picsum.photos/seed/fundora-hero-1/1600/900",
    accent: "emerald",
  },
  {
    id: "support",
    title: "Support Causes You Believe In.",
    subtitle:
      "From education and healthcare to clean water and creative projects — every credit you give moves a real campaign forward.",
    image: "https://picsum.photos/seed/fundora-hero-2/1600/900",
    accent: "sky",
  },
  {
    id: "create",
    title: "Your Community Is Your Launchpad.",
    subtitle:
      "Creators keep 100% of their funded goal. Transparent progress, fair rewards, and a platform built for trust.",
    image: "https://picsum.photos/seed/fundora-hero-3/1600/900",
    accent: "amber",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative h-[540px] md:h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 hero-slide-overlay" />
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl animate-fade-up">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    Powered by your community
                  </span>
                  <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="mt-5 text-base md:text-lg text-slate-200 leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
                    <Link
                      href="/campaigns"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition"
                    >
                      Explore Campaigns <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/register?role=creator"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-slate-900 text-sm font-bold shadow-lg transition"
                    >
                      <Rocket className="w-4 h-4 text-emerald-600" /> Start a Campaign
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
