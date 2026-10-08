"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BuildTablePlan {
  id: string;
  name: string;
  buildPrice: string;
  monthlyPrice: string;
  badge?: string;
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
}

export interface CareTablePlan {
  id: string;
  name: string;
  price: string;
  badge?: string;
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
}

// 1. Website Build Plans
const defaultBuildTablePlans: BuildTablePlan[] = [
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
    badge: "Business Engine",
    ctaText: "Choose Secure",
    ctaHref: "/contact?plan=secure",
  },
  {
    id: "secure-care",
    name: "Secure + Care",
    buildPrice: "$2,300",
    monthlyPrice: "Includes 1-Yr Pro Care",
    badge: "Turnkey Bundle",
    isPopular: true,
    ctaText: "Choose Bundle",
    ctaHref: "/contact?plan=secure-care",
  },
  {
    id: "custom",
    name: "Custom",
    buildPrice: "From $250+",
    monthlyPrice: "Custom",
    badge: "Tailored",
    ctaText: "Request Quote",
    ctaHref: "/contact?plan=custom",
  },
];

// 2. Monthly Care Plans
const defaultCareTablePlans: CareTablePlan[] = [
  {
    id: "essential",
    name: "Essential Care",
    price: "$39/mo",
    badge: "Maintenance",
    ctaText: "Get Essential",
    ctaHref: "/contact?plan=essential-care",
  },
  {
    id: "pro",
    name: "Pro Care",
    price: "$99/mo",
    badge: "Recommended",
    isPopular: true,
    ctaText: "Get Pro Care",
    ctaHref: "/contact?plan=pro-care",
  },
  {
    id: "premium",
    name: "Premium Care",
    price: "$199/mo",
    badge: "High Growth",
    ctaText: "Get Premium",
    ctaHref: "/contact?plan=premium-care",
  },
];

export interface ComparisonRow {
  name: string;
  starter: boolean | string;
  secure: boolean | string;
  care: boolean | string;
  custom: boolean | string;
}

export interface ComparisonCategory {
  category: string;
  rows: ComparisonRow[];
}

const defaultBuildComparisonData: ComparisonCategory[] = [
  {
    category: "Core Deliverables & Architecture",
    rows: [
      {
        name: "One-Time Investment",
        starter: "$850",
        secure: "$1,500",
        care: "$2,300",
        custom: "From $250+",
      },
      {
        name: "Monthly Care Commitment",
        starter: "Optional Care",
        secure: "Optional Care",
        care: "1 Year Included",
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
        name: "Mobile / Tablet / Desktop Responsive",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Contact & Lead Form",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "100% Code Ownership",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Revisions Included",
        starter: "2 rounds",
        secure: "3 rounds",
        care: "3 rounds + 2h/mo",
        custom: "Milestone",
      },
    ],
  },
  {
    category: "Search & Visibility",
    rows: [
      {
        name: "Technical SEO Foundation",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Local SEO & Google Maps",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Google Business Profile Integration",
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
        name: "Google Search Console & Sitemap",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
    ],
  },
  {
    category: "Booking & Automation",
    rows: [
      {
        name: "24/7 Online Booking Engine",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Live Calendar Sync (Google, Apple, Square)",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Appointment Confirmations",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Lead Capture & Notification Pipeline",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
    ],
  },
  {
    category: "Security & Performance",
    rows: [
      {
        name: "Sub-2s Speed Optimization",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "SSL / HTTPS Encryption",
        starter: true,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Anti-Spam & Security Headers",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
      {
        name: "Database Security Rules & Audit",
        starter: false,
        secure: true,
        care: true,
        custom: true,
      },
    ],
  },
];

export interface CareComparisonRow {
  name: string;
  essential: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
}

const defaultCareComparisonRows: CareComparisonRow[] = [
  { name: "Monthly Investment", essential: "$39/mo", pro: "$99/mo", premium: "$199/mo" },
  { name: "Managed Cloud Hosting", essential: true, pro: true, premium: true },
  { name: "SSL / HTTPS & DNS Maintenance", essential: true, pro: true, premium: true },
  { name: "Daily Automated Offsite Backups", essential: true, pro: true, premium: true },
  { name: "24/7 Uptime Monitoring", essential: true, pro: true, premium: true },
  { name: "Security Monitoring", essential: "Basic", pro: "Advanced", premium: "Advanced" },
  { name: "Included Website Updates", essential: "30 min/mo", pro: "2h/mo", premium: "5h/mo" },
  { name: "Performance Monitoring", essential: true, pro: true, premium: true },
  { name: "Priority Support", essential: false, pro: true, premium: "Priority Line" },
  { name: "SEO Maintenance", essential: false, pro: true, premium: true },
  { name: "Monthly SEO Improvements", essential: false, pro: "Basic", premium: "Advanced" },
  { name: "Analytics & Reporting", essential: false, pro: true, premium: "Advanced" },
  { name: "Content & Photo Updates", essential: false, pro: true, premium: true },
  { name: "New Sections / Pages Creation", essential: false, pro: false, premium: true },
  { name: "Custom Code Development", essential: false, pro: false, premium: "1h/mo" },
];

/**
 * Renders a cell value with green checkmark for true, gray cross (X) for false or unsupported,
 * or text value for specifications.
 */
const renderCell = (val: boolean | string) => {
  if (typeof val === "boolean") {
    if (val) {
      return (
        <span className="size-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
          <Check className="size-3.5 stroke-[3]" />
        </span>
      );
    }
    // Gray cross (X) for unsupported features
    return (
      <span className="size-6 flex items-center justify-center mx-auto text-muted-foreground/45">
        <X className="size-4 stroke-[2.5]" />
      </span>
    );
  }

  if (val === "—" || val === false) {
    return (
      <span className="size-6 flex items-center justify-center mx-auto text-muted-foreground/45">
        <X className="size-4 stroke-[2.5]" />
      </span>
    );
  }

  return (
    <span className="text-xs sm:text-sm font-semibold text-foreground">
      {val}
    </span>
  );
};

/** Comparison matrix from the LevelUp database (content_blocks pricing/comparison). */
export interface PricingComparison {
  buildPlans: BuildTablePlan[];
  carePlans: CareTablePlan[];
  buildRows: ComparisonCategory[];
  careRows: CareComparisonRow[];
}

export const PricingTable = ({ comparison }: { comparison?: PricingComparison }) => {
  const buildTablePlans = comparison?.buildPlans ?? defaultBuildTablePlans;
  const careTablePlans = comparison?.carePlans ?? defaultCareTablePlans;
  const buildComparisonData = comparison?.buildRows ?? defaultBuildComparisonData;
  const careComparisonRows = comparison?.careRows ?? defaultCareComparisonRows;

  const [activeTableTab, setActiveTableTab] = useState<"builds" | "care">("builds");
  const [selectedMobileBuildIdx, setSelectedMobileBuildIdx] = useState(1);
  const [selectedMobileCareIdx, setSelectedMobileCareIdx] = useState(1);

  return (
    <section className="pb-24 pt-4 lg:py-24">
      <div className="container max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Detailed Deliverables Matrix
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-sans">
            Compare Features &amp; Deliverables
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Detailed breakdown of deliverables across our Website Builds and Monthly Care Plans.
          </p>

          {/* Table Switcher */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center p-1 rounded-full bg-muted/60 border border-border/80">
              <button
                type="button"
                onClick={() => setActiveTableTab("builds")}
                className={cn(
                  "py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  activeTableTab === "builds"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Website Builds Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTableTab("care")}
                className={cn(
                  "py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  activeTableTab === "care"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Care Plans Matrix
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABLE 1: WEBSITE BUILDS MATRIX                                            */}
        {/* ========================================================================= */}
        {activeTableTab === "builds" && (
          <div>
            {/* Mobile View */}
            <div className="md:hidden space-y-5">
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 text-center">
                {buildTablePlans.map((plan, idx) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedMobileBuildIdx(idx)}
                    className={cn(
                      "py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer truncate",
                      selectedMobileBuildIdx === idx
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {plan.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active Plan Card */}
              <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {buildTablePlans[selectedMobileBuildIdx].name}
                  </h4>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-foreground">
                      {buildTablePlans[selectedMobileBuildIdx].buildPrice}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      {buildTablePlans[selectedMobileBuildIdx].monthlyPrice}
                    </span>
                  </div>
                </div>
                <Button size="sm" asChild className="shrink-0 font-bold">
                  <Link href={buildTablePlans[selectedMobileBuildIdx].ctaHref}>
                    {buildTablePlans[selectedMobileBuildIdx].ctaText}
                  </Link>
                </Button>
              </div>

              {/* Rows */}
              <div className="space-y-4">
                {buildComparisonData.map((cat, cIdx) => (
                  <div key={cIdx} className="rounded-2xl border border-border/80 bg-card overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted/40 border-b border-border/60">
                      <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                        {cat.category}
                      </span>
                    </div>
                    <div className="divide-y divide-border/40">
                      {cat.rows.map((row, rIdx) => {
                        const vals = [row.starter, row.secure, row.care, row.custom];
                        return (
                          <div key={rIdx} className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                            <span className="text-foreground/90 font-medium">{row.name}</span>
                            <div className="shrink-0 text-right">{renderCell(vals[selectedMobileBuildIdx])}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-3xl border border-border/90 bg-card overflow-hidden shadow-xs">
              <div className="grid grid-cols-5 p-6 border-b border-border/80 bg-muted/20 items-end">
                <div className="col-span-1 pr-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Build Deliverables
                  </span>
                </div>
                {buildTablePlans.map((plan) => (
                  <div key={plan.id} className={cn("col-span-1 text-center px-2 py-3 rounded-2xl", plan.isPopular && "bg-violet-500/5 border border-violet-500/20")}>
                    {plan.badge && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1 border border-border bg-muted text-muted-foreground">
                        {plan.badge}
                      </span>
                    )}
                    <h4 className="text-base font-bold text-foreground font-sans">{plan.name}</h4>
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-xl font-black text-foreground">{plan.buildPrice}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{plan.monthlyPrice}</span>
                    </div>
                    <div className="mt-2.5">
                      <Button size="sm" variant={plan.isPopular ? "default" : "outline"} asChild className="w-full text-xs font-bold rounded-xl">
                        <Link href={plan.ctaHref}>{plan.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {buildComparisonData.map((category, catIdx) => (
                <div key={catIdx} className="border-b last:border-b-0 border-border/80">
                  <div className="bg-muted/40 px-6 py-2.5 border-b border-border/50">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/80">
                      {category.category}
                    </span>
                  </div>
                  <div className="divide-y divide-border/40">
                    {category.rows.map((row, rowIdx) => (
                      <div key={rowIdx} className="grid grid-cols-5 px-6 py-3 items-center hover:bg-muted/15 transition-colors">
                        <div className="col-span-1 pr-4 text-xs sm:text-sm font-medium text-foreground/90">{row.name}</div>
                        <div className="col-span-1 text-center">{renderCell(row.starter)}</div>
                        <div className="col-span-1 text-center">{renderCell(row.secure)}</div>
                        <div className="col-span-1 text-center py-0.5 bg-violet-500/5 rounded-lg">{renderCell(row.care)}</div>
                        <div className="col-span-1 text-center">{renderCell(row.custom)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TABLE 2: MONTHLY CARE PLANS MATRIX ($39 - $199)                           */}
        {/* ========================================================================= */}
        {activeTableTab === "care" && (
          <div>
            {/* Mobile View */}
            <div className="md:hidden space-y-5">
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 text-center">
                {careTablePlans.map((plan, idx) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedMobileCareIdx(idx)}
                    className={cn(
                      "py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer truncate",
                      selectedMobileCareIdx === idx
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {plan.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active Plan Card */}
              <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {careTablePlans[selectedMobileCareIdx].name}
                  </h4>
                  <span className="text-xl font-black text-foreground">
                    {careTablePlans[selectedMobileCareIdx].price}
                  </span>
                </div>
                <Button size="sm" asChild className="shrink-0 font-bold">
                  <Link href={careTablePlans[selectedMobileCareIdx].ctaHref}>
                    {careTablePlans[selectedMobileCareIdx].ctaText}
                  </Link>
                </Button>
              </div>

              {/* Rows with Gray Cross X for unsupported features */}
              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
                <div className="divide-y divide-border/40">
                  {careComparisonRows.map((row, rIdx) => {
                    const vals = [row.essential, row.pro, row.premium];
                    return (
                      <div key={rIdx} className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                        <span className="text-foreground/90 font-medium">{row.name}</span>
                        <div className="shrink-0 text-right">{renderCell(vals[selectedMobileCareIdx])}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-3xl border border-border/90 bg-card overflow-hidden shadow-xs">
              <div className="grid grid-cols-4 p-6 border-b border-border/80 bg-muted/20 items-end">
                <div className="col-span-1 pr-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Care Features
                  </span>
                </div>
                {careTablePlans.map((plan) => (
                  <div key={plan.id} className={cn("col-span-1 text-center px-2 py-3 rounded-2xl", plan.isPopular && "bg-violet-500/5 border border-violet-500/20")}>
                    {plan.badge && (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1 border border-border bg-muted text-muted-foreground">
                        {plan.badge}
                      </span>
                    )}
                    <h4 className="text-base font-bold text-foreground font-sans">{plan.name}</h4>
                    <span className="text-2xl font-black text-foreground mt-1 block">{plan.price}</span>
                    <div className="mt-2.5">
                      <Button size="sm" variant={plan.isPopular ? "default" : "outline"} asChild className="w-full text-xs font-bold rounded-xl">
                        <Link href={plan.ctaHref}>{plan.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rows with Gray Cross X */}
              <div className="divide-y divide-border/40">
                {careComparisonRows.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-4 px-6 py-3 items-center hover:bg-muted/15 transition-colors">
                    <div className="col-span-1 pr-4 text-xs sm:text-sm font-medium text-foreground/90">{row.name}</div>
                    <div className="col-span-1 text-center">{renderCell(row.essential)}</div>
                    <div className="col-span-1 text-center py-0.5 bg-violet-500/5 rounded-lg">{renderCell(row.pro)}</div>
                    <div className="col-span-1 text-center">{renderCell(row.premium)}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground/75 text-center mt-4">
              * Note: Unused monthly maintenance hours do not roll over. Major structural redesigns are quoted separately.
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Have questions about website builds or monthly care packages?
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
