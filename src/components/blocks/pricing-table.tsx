"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanMeta {
  id: string;
  name: string;
  buildPrice: string;
  monthlyPrice: string;
  badge?: string;
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
}

const tablePlans: PlanMeta[] = [
  {
    id: "starter",
    name: "Starter",
    buildPrice: "$850",
    monthlyPrice: "No monthly fee",
    ctaText: "Choose Starter",
    ctaHref: "/contact?plan=starter",
  },
  {
    id: "secure",
    name: "Secure",
    buildPrice: "$1,500",
    monthlyPrice: "No monthly fee",
    badge: "Business",
    ctaText: "Choose Secure",
    ctaHref: "/contact?plan=secure",
  },
  {
    id: "secure-care",
    name: "Secure + Care",
    buildPrice: "$1,500",
    monthlyPrice: "$99/mo",
    badge: "Most Popular",
    isPopular: true,
    ctaText: "Choose Secure + Care",
    ctaHref: "/contact?plan=secure-care",
  },
  {
    id: "custom",
    name: "Custom",
    buildPrice: "Starting $3,000+",
    monthlyPrice: "Custom",
    badge: "Architecture",
    ctaText: "Request Quote",
    ctaHref: "/contact?plan=custom",
  },
];

interface ComparisonRow {
  name: string;
  starter: boolean | string;
  secure: boolean | string;
  care: boolean | string;
  custom: boolean | string;
}

interface TableCategory {
  category: string;
  rows: ComparisonRow[];
}

const tableData: TableCategory[] = [
  {
    category: "Core Deliverables & Design",
    rows: [
      {
        name: "One-Time Build Investment",
        starter: "$850",
        secure: "$1,500",
        care: "$1,500",
        custom: "$3,000+",
      },
      {
        name: "Monthly Care & Support",
        starter: "—",
        secure: "—",
        care: "$99/mo",
        custom: "Custom",
      },
      {
        name: "Custom Bespoke Design",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Up to 5 Pages Included",
        starter: true,
        secure: true,
        care: true,
        custom: "Custom",
      },
      {
        name: "Responsive (Mobile / Tablet / Desktop)",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Contact & Lead Intake Forms",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "100% Website Code Ownership",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Included Revision Rounds",
        starter: "2 rounds",
        secure: "3 rounds",
        care: "3 rounds + 2h/mo",
        custom: "Milestone",
      },
    ],
  },
  {
    category: "Search Visibility & Growth",
    rows: [
      {
        name: "Technical SEO Foundation",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Local SEO & Google Maps Integration",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Google Business Profile Setup",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Structured Data / Schema.org",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Google Search Console & XML Sitemap",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
    ],
  },
  {
    category: "Automated Booking & Business System",
    rows: [
      {
        name: "24/7 Online Booking System",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "2-Way Live Calendar Synchronization",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Automated Appointment Email Confirmations",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Lead Capture & Notification Management",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Advanced Custom Workflows & CRM Sync",
        starter: false,
        secure: false,
        care: false,
        custom: true,
      },
    ],
  },
  {
    category: "Cybersecurity & Performance",
    rows: [
      {
        name: "Performance & Mobile Speed Tuning",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "SSL / HTTPS Encryption Standard",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Security Headers & Anti-Spam Protection",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Admin Authentication Hardening",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Database Security Rules & Security Audit",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
    ],
  },
  {
    category: "Cloud Hosting & Ongoing Management",
    rows: [
      {
        name: "Managed Cloud Hosting & CDN",
        starter: false,
        secure: false,
        care: true,
        custom: "Custom",
      },
      {
        name: "Automated Daily Offsite Backups",
        starter: false,
        secure: false,
        care: true,
        custom: "Custom",
      },
      {
        name: "24/7 Continuous Uptime Monitoring",
        starter: false,
        secure: false,
        care: true,
        custom: "Custom",
      },
      {
        name: "Monthly Updates (Content, text, photos)",
        starter: false,
        secure: false,
        care: "2h / month",
        custom: "Custom",
      },
      {
        name: "Priority Developer Support",
        starter: false,
        secure: false,
        care: true,
        custom: true,
      },
    ],
  },
];

const renderCell = (val: boolean | string) => {
  if (typeof val === "boolean") {
    if (val) {
      return (
        <span className="size-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
          <Check className="size-3.5 stroke-[3]" />
        </span>
      );
    }
    return (
      <span className="size-6 flex items-center justify-center mx-auto text-muted-foreground/35">
        <Minus className="size-4" />
      </span>
    );
  }

  if (val === "—") {
    return (
      <span className="size-6 flex items-center justify-center mx-auto text-muted-foreground/35">
        <Minus className="size-4" />
      </span>
    );
  }

  return (
    <span className="text-xs sm:text-sm font-semibold text-foreground">
      {val}
    </span>
  );
};

export const PricingTable = () => {
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(2); // Secure + Care selected by default on mobile

  const selectedMobilePlan = tablePlans[selectedMobileIndex];

  return (
    <section className="pb-24 pt-4 lg:py-24">
      <div className="container max-w-6xl px-4 sm:px-6">
        {/* Table Title */}
        <div className="mb-10 text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Feature Comparison Matrix
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-sans">
            Compare All 4 Plans Side by Side
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Detailed breakdown of deliverables across Starter, Secure, Secure + Care, and Custom builds.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< md): Tab Selector for Plan Columns                        */}
        {/* ========================================================================= */}
        <div className="md:hidden space-y-6">
          <div className="grid grid-cols-4 gap-1 p-1.5 rounded-2xl bg-muted/60 border border-border/80 text-center">
            {tablePlans.map((plan, idx) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedMobileIndex(idx)}
                className={cn(
                  "py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer truncate",
                  selectedMobileIndex === idx
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {plan.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Active Mobile Plan Summary Card */}
          <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-foreground">
                  {selectedMobilePlan.name}
                </h4>
                {selectedMobilePlan.badge && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                    {selectedMobilePlan.badge}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">
                  {selectedMobilePlan.buildPrice}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {selectedMobilePlan.monthlyPrice}
                </span>
              </div>
            </div>

            <Button size="sm" asChild className="shrink-0 font-bold">
              <Link href={selectedMobilePlan.ctaHref}>
                {selectedMobilePlan.ctaText}
              </Link>
            </Button>
          </div>

          {/* Mobile Breakdown Rows */}
          <div className="space-y-6">
            {tableData.map((cat, cIdx) => (
              <div
                key={cIdx}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden"
              >
                <div className="px-4 py-3 bg-muted/40 border-b border-border/60">
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                    {cat.category}
                  </h5>
                </div>
                <div className="divide-y divide-border/50">
                  {cat.rows.map((row, rIdx) => {
                    const rowVals = [row.starter, row.secure, row.care, row.custom];
                    const activeVal = rowVals[selectedMobileIndex];
                    return (
                      <div
                        key={rIdx}
                        className="px-4 py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <span className="text-foreground/90 font-medium">
                          {row.name}
                        </span>
                        <div className="shrink-0 text-right">
                          {renderCell(activeVal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (md+): Full 5-Column Side-by-Side Matrix                     */}
        {/* ========================================================================= */}
        <div className="hidden md:block rounded-3xl border border-border/90 bg-card overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-5 p-6 border-b border-border/80 bg-muted/20 items-end">
            <div className="col-span-1 pr-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Plans &amp; Deliverables
              </span>
            </div>

            {tablePlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "col-span-1 text-center px-2 py-3 rounded-2xl transition-colors",
                  plan.isPopular && "bg-violet-500/5 border border-violet-500/20",
                )}
              >
                {plan.badge && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1.5 border",
                      plan.isPopular
                        ? "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {plan.isPopular && <Sparkles className="size-2.5 shrink-0" />}
                    {plan.badge}
                  </span>
                )}
                <h4 className="text-lg font-bold text-foreground font-sans">
                  {plan.name}
                </h4>
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-2xl font-black text-foreground">
                    {plan.buildPrice}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    {plan.monthlyPrice}
                  </span>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant={plan.isPopular ? "default" : "outline"}
                    asChild
                    className="w-full text-xs font-bold rounded-xl"
                  >
                    <Link href={plan.ctaHref}>
                      {plan.ctaText}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Categorized Rows */}
          {tableData.map((category, catIdx) => (
            <div key={catIdx} className="border-b last:border-b-0 border-border/80">
              {/* Category Title Row */}
              <div className="bg-muted/40 px-6 py-3 border-b border-border/50">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/80">
                  {category.category}
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/40">
                {category.rows.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid grid-cols-5 px-6 py-3.5 items-center hover:bg-muted/20 transition-colors"
                  >
                    <div className="col-span-1 pr-4 text-xs sm:text-sm font-medium text-foreground/90">
                      {row.name}
                    </div>
                    <div className="col-span-1 text-center">
                      {renderCell(row.starter)}
                    </div>
                    <div className="col-span-1 text-center">
                      {renderCell(row.secure)}
                    </div>
                    <div className={cn("col-span-1 text-center py-1", "bg-violet-500/5 rounded-lg")}>
                      {renderCell(row.care)}
                    </div>
                    <div className="col-span-1 text-center">
                      {renderCell(row.custom)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Need a custom combination or want to discuss your project requirements?
          </p>
          <Button asChild size="lg" className="font-bold">
            <Link href="/contact" className="gap-2">
              <span>Request a free consultation &amp; preview</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
