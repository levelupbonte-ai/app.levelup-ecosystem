"use client";

import { useState } from "react";

import Link from "next/link";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureSection {
  category: string;
  features: {
    name: string;
    starter: true | false | null | string;
    secure: true | false | null | string;
    care: true | false | null | string;
  }[];
}

const pricingPlans = [
  {
    name: "Starter ($500)",
    button: {
      text: "Get Started",
      variant: "outline" as const,
      href: "/contact?plan=starter",
    },
  },
  {
    name: "Secure ($900)",
    button: {
      text: "Get Started",
      variant: "default" as const,
      href: "/contact?plan=secure",
    },
  },
  {
    name: "Secure + Care ($900 + $75/mo)",
    button: {
      text: "Get Started",
      variant: "outline" as const,
      href: "/contact?plan=secure-care",
    },
  },
];

const comparisonFeatures: FeatureSection[] = [
  {
    category: "Design & Performance",
    features: [
      {
        name: "Custom Responsive Mobile Design",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "Sub-2s Mobile Page Speed",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "Google Maps & Local SEO Setup",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "100% Code Ownership",
        starter: true,
        secure: true,
        care: true,
      },
    ],
  },
  {
    category: "Booking & Features",
    features: [
      {
        name: "Contact & Lead Capture Form",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "24/7 Automated Online Booking",
        starter: false,
        secure: true,
        care: true,
      },
      {
        name: "Live Calendar Sync (Square, Calendly, Acuity)",
        starter: false,
        secure: true,
        care: true,
      },
      {
        name: "Customer Appointment SMS/Email Confirmations",
        starter: false,
        secure: true,
        care: true,
      },
      {
        name: "Google Business Profile Sync",
        starter: false,
        secure: true,
        care: true,
      },
    ],
  },
  {
    category: "Cybersecurity & Hardening",
    features: [
      {
        name: "SSL / HTTPS Encryption Standard",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "Anti-Spam Form Honeypot",
        starter: true,
        secure: true,
        care: true,
      },
      {
        name: "2FA Admin Access Enforcement",
        starter: false,
        secure: true,
        care: true,
      },
      {
        name: "Database Access Rules & Security Audit",
        starter: false,
        secure: true,
        care: true,
      },
    ],
  },
  {
    category: "Ongoing Care & Peace of Mind",
    features: [
      {
        name: "High-Speed Cloud Hosting Included",
        starter: false,
        secure: false,
        care: true,
      },
      {
        name: "Automated Daily Offsite Backups",
        starter: false,
        secure: false,
        care: true,
      },
      {
        name: "Continuous Uptime & Health Monitoring",
        starter: false,
        secure: false,
        care: true,
      },
      {
        name: "On-Demand Monthly Content Edits",
        starter: false,
        secure: false,
        care: "Up to 2 hrs/mo",
      },
      {
        name: "VIP Direct Developer Support",
        starter: "Email",
        secure: "30 days priority",
        care: "Dedicated ongoing",
      },
    ],
  },
];

const renderFeatureValue = (value: true | false | null | string) => {
  if (value === true) {
    return (
      <span className="size-5 rounded-full bg-[#ccff00] text-black flex items-center justify-center shrink-0">
        <Check className="size-3.5 stroke-[3]" />
      </span>
    );
  }
  if (value === false) {
    return <X className="size-5 text-muted-foreground/40" />;
  }
  if (value === null) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      <span className="size-5 rounded-full bg-[#ccff00] text-black flex items-center justify-center shrink-0">
        <Check className="size-3.5 stroke-[3]" />
      </span>
      <span className="text-muted-foreground text-xs sm:text-sm font-medium">{value}</span>
    </div>
  );
};

export const PricingTable = () => {
  const [selectedPlan, setSelectedPlan] = useState(1);

  return (
    <section className="pb-28 lg:py-32">
      <div className="container max-w-6xl">
        <div className="mb-10 text-center space-y-2">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            Detailed Feature Comparison
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Everything you need to know about our transparent deliverables.
          </p>
        </div>

        <PlanHeaders
          selectedPlan={selectedPlan}
          onPlanChange={setSelectedPlan}
        />
        <FeatureSections selectedPlan={selectedPlan} />
      </div>
    </section>
  );
};

const PlanHeaders = ({
  selectedPlan,
  onPlanChange,
}: {
  selectedPlan: number;
  onPlanChange: (index: number) => void;
}) => {
  return (
    <div className="">
      {/* Mobile View */}
      <div className="md:hidden space-y-3 pb-4 border-b">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 text-center">
          {pricingPlans.map((plan, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onPlanChange(index)}
              className={cn(
                "py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate",
                selectedPlan === index
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {plan.name.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
            {pricingPlans[selectedPlan].name}
          </h3>
          <Button
            variant={pricingPlans[selectedPlan].button.variant}
            size="sm"
            asChild
            className="shrink-0 font-semibold"
          >
            <Link href={pricingPlans[selectedPlan].button.href}>
              {pricingPlans[selectedPlan].button.text}
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="grid grid-cols-4 gap-4 max-md:hidden items-center border-b pb-6">
        <div className="col-span-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Features &amp; Deliverables
          </span>
        </div>

        {pricingPlans.map((plan, index) => (
          <div key={index} className="space-y-2 text-start">
            <h3 className="text-lg font-bold tracking-tight">{plan.name}</h3>
            <Button variant={plan.button.variant} size="sm" asChild>
              <Link href={plan.button.href}>
                {plan.button.text}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureSections = ({ selectedPlan }: { selectedPlan: number }) => (
  <>
    {comparisonFeatures.map((section, sectionIndex) => (
      <div key={sectionIndex} className="mt-8">
        <div className="border-b py-3">
          <h4 className="text-base font-bold text-foreground">{section.category}</h4>
        </div>
        {section.features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            className="text-foreground grid grid-cols-2 font-medium max-md:border-b md:grid-cols-4 items-center"
          >
            <span className="inline-flex items-center py-3.5 text-sm">
              {feature.name}
            </span>
            {/* Mobile View - Only Selected Plan */}
            <div className="md:hidden">
              <div className="flex items-center gap-1 py-3.5">
                {renderFeatureValue(
                  [feature.starter, feature.secure, feature.care][
                    selectedPlan
                  ],
                )}
              </div>
            </div>
            {/* Desktop View - All Plans */}
            <div className="hidden md:col-span-3 md:grid md:grid-cols-3 md:gap-4">
              {[feature.starter, feature.secure, feature.care].map(
                (value, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 border-b border-border/40 py-3.5"
                  >
                    {renderFeatureValue(value)}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    ))}
  </>
);
