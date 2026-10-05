import React from "react";
import type { Metadata } from "next";

import { Background } from "@/components/background";
import { Pricing, type PlanItem } from "@/components/blocks/pricing";
import { PricingTable } from "@/components/blocks/pricing-table";
import { DashedLine } from "@/components/dashed-line";
import { getPricingPlans } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Transparent Pricing & Website Offers | LevelUp Ecosystem",
  description:
    "Explore our 4 transparent web architecture plans: Starter ($850), Secure ($1,500), Secure + Care ($1,500 + $99/mo), and Custom Build ($3,000+). 100% code ownership.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Transparent Pricing & Website Offers | LevelUp Ecosystem",
    description:
      "Starter ($850), Secure ($1,500 with 24/7 booking), Secure + Care ($1,500 + $99/mo managed care), and Custom Builds ($3,000+). Free mobile preview in 24-48h.",
    url: "/pricing",
    siteName: "LevelUp Ecosystem",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LevelUp Ecosystem Pricing & Offers",
      },
    ],
  },
};

const Page = async () => {
  const serverPlans = await getPricingPlans();

  // Map to PlanItem format for seamless compatibility
  const initialPlans = serverPlans.map((sp) => ({
    id: sp.id,
    name: sp.name,
    subtitle: sp.subtitle || "",
    badge: sp.badge || undefined,
    isRecommended: sp.is_recommended || false,
    price: sp.price,
    pricePeriod: sp.price_period,
    secondaryNote: sp.secondary_note || undefined,
    description: sp.description,
    shortPoints: sp.short_points || [],
    fullFeatures: (sp.full_features as PlanItem["fullFeatures"]) || [],
    ctaText: sp.cta_text || "Choose Plan",
    ctaHref: sp.cta_href || "/book",
  }));

  return (
    <Background>
      <div className="py-24 lg:pt-40 lg:pb-24">
        <Pricing initialPlans={initialPlans.length > 0 ? initialPlans : undefined} />
        <div className="container max-w-5xl my-6">
          <DashedLine />
        </div>
        <PricingTable />
      </div>
    </Background>
  );
};

export default Page;
