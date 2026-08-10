"use client";

import { use } from "react";
import CampaignDetails from "@/components/campaign/CampaignDetails";

export default function Page({ params }) {
  const { id } = use(params);
  return <CampaignDetails id={id} />;
}
