import React from "react";
import type { Metadata } from "next";

import { Background } from "@/components/background";
import { Pricing } from "@/components/blocks/pricing";
import { PricingTable } from "@/components/blocks/pricing-table";
import { DashedLine } from "@/components/dashed-line";
import { getPricingContent } from "@/lib/levelup-site";

export const metadata: Metadata = {
  title: "Transparent Pricing & Website Offers | LevelUp Ecosystem",
  description:
    "Fixed website prices and monthly care plans: Starter, Secure, Secure + Care and Custom projects. Every project starts with a free preview, and your content, brand and data stay yours.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Transparent Pricing & Website Offers | LevelUp Ecosystem",
    description:
      "Fixed website prices and monthly care plans, with a free mobile preview before you commit. See the current plans and prices.",
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
  const pricing = await getPricingContent();

  return (
    <Background>
      <div className="py-24 lg:pt-40 lg:pb-24">
        <Pricing
          initialPlans={pricing.buildPlans}
          initialCarePlans={pricing.carePlans}
        />
        <div className="container max-w-5xl my-6">
          <DashedLine />
        </div>
        <PricingTable comparison={pricing.comparison} />
      </div>
    </Background>
  );
};

export default Page;
