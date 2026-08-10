"use client";

import HeroSlider from "@/components/home/HeroSlider";
import TopCampaigns from "@/components/home/TopCampaigns";
import ExploreCategories from "@/components/home/ExploreCategories";
import ImpactStats from "@/components/home/ImpactStats";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <TopCampaigns />
      <ImpactStats />
      <ExploreCategories />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
