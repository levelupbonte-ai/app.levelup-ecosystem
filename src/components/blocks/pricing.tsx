"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  Zap,
  Info,
  ChevronDown,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { PremiumTextSectionReveal } from "@/components/scroll/premium-reveal";
import { Button } from "@/components/ui/button";

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  subtitle: string;
  price: string;
  pricePeriod: string;
  secondaryNote?: string;
  description: string;
  summaryTags: string[];
  revisions: string;
  ctaText: string;
  ctaHref: string;
  notIncludedNote?: string;
  categories: {
    name: string;
    items: string[];
  }[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "For small businesses that need a clean, professional web presence",
    price: "$850",
    pricePeriod: "one-time",
    description:
      "A bespoke high-converting showcase website built from scratch. Includes mobile-first responsive architecture, Google Maps integration, technical and local SEO foundations, and 100% full ownership with zero platform lock-in.",
    summaryTags: [
      "Custom Design",
      "Up to 5 Pages",
      "Google Maps & Local SEO",
      "100% Code Ownership",
    ],
    revisions: "2 rounds of revisions included",
    notIncludedNote:
      "No online booking engine, no calendar automation, and no monthly maintenance included.",
    ctaText: "Get Started with Starter ($850)",
    ctaHref: "/contact?plan=starter",
    categories: [
      {
        name: "Design & Core Build",
        items: [
          "Custom bespoke website design (no generic pre-made templates)",
          "Up to 5 custom-crafted pages",
          "Responsive design: mobile, tablet, and desktop optimized",
          "Contact and lead capture form",
          "Website launch & deployment verification",
          "100% full website and code ownership",
        ],
      },
      {
        name: "Search Visibility & Local SEO",
        items: [
          "Google Maps integration with interactive directions",
          "Basic technical SEO architecture & semantic HTML5",
          "Local SEO foundation targeting your service area",
          "Custom meta titles & meta descriptions",
          "Google Analytics setup with privacy-conscious tracking",
        ],
      },
      {
        name: "Speed & Accessibility",
        items: [
          "Image compression & asset optimization",
          "Performance optimization (sub-2s loading speed target)",
          "SSL / HTTPS encryption standard",
          "Basic accessibility (WCAG compliance)",
          "2 rounds of revisions included before final launch",
        ],
      },
    ],
  },
  {
    id: "secure",
    name: "Secure",
    badge: "Business Engine",
    subtitle: "A complete business engine — not just a pretty website",
    price: "$1,500",
    pricePeriod: "one-time",
    description:
      "An automated appointment booking and customer acquisition powerhouse. Includes self-service scheduling, 2-way calendar synchronization, cybersecurity audit and database hardening, and advanced local SEO.",
    summaryTags: [
      "24/7 Online Booking",
      "Calendar Sync",
      "Cybersecurity Hardening",
      "Advanced Local SEO",
    ],
    revisions: "3 rounds of revisions included",
    ctaText: "Get Started with Secure ($1,500)",
    ctaHref: "/contact?plan=secure",
    categories: [
      {
        name: "Business & Booking System",
        items: [
          "24/7 online booking system for customer self-scheduling",
          "Real-time calendar integration (Google, Apple, Square, Calendly)",
          "Automated appointment email confirmations to reduce no-shows",
          "Lead capture & management pipeline",
          "Automated email notifications for new inquiries",
          "Google Business Profile integration & setup assistance",
          "Advanced interactive contact/lead intake forms",
        ],
      },
      {
        name: "Search Visibility & Authority",
        items: [
          "Advanced on-page SEO targeting high-intent buyer searches",
          "Search-friendly site architecture & breadcrumb structure",
          "Local SEO optimization with geo-coordinates and NAP consistency",
          "Structured data & Schema.org markup where appropriate",
          "Google Search Console setup and automated XML sitemap submission",
          "Sitemap & robots.txt configuration",
        ],
      },
      {
        name: "Security & Hardening",
        items: [
          "SSL / HTTPS encryption with strict security headers",
          "Anti-spam protection & honeypot filtering",
          "Admin authentication hardening",
          "Access-control and role-based permissions review",
          "Database security rules where applicable (Firestore / Cloud SQL)",
          "Dependency & package vulnerability review",
          "Foundational cybersecurity audit report",
        ],
      },
      {
        name: "Performance & Revisions",
        items: [
          "Comprehensive mobile speed optimization",
          "Lossless WebP/AVIF image pipeline",
          "Core Web Vitals-oriented optimization",
          "Cross-browser and cross-device performance testing",
          "3 rounds of revisions included",
        ],
      },
    ],
  },
  {
    id: "secure-care",
    name: "Secure + Care",
    badge: "Recommended • Best Value",
    isPopular: true,
    subtitle: "Build once, then LevelUp handles all hosting, backups & monthly updates",
    price: "$1,500",
    pricePeriod: "+ $99/mo",
    secondaryNote: "One-time build ($1,500) + full ongoing management ($99/mo)",
    description:
      "Our most requested plan. You get the complete Secure business website build, and LevelUp takes full responsibility for high-speed cloud hosting, continuous uptime monitoring, daily backups, and up to 2 hours of monthly updates.",
    summaryTags: [
      "Full Secure Build Included",
      "Managed Cloud Hosting",
      "Daily Automated Backups",
      "Up to 2h/mo Updates",
    ],
    revisions: "3 build revision rounds + up to 2 hours of monthly updates",
    ctaText: "Choose Secure + Care ($1,500 + $99/mo)",
    ctaHref: "/contact?plan=secure-care",
    categories: [
      {
        name: "Complete Secure Build Included",
        items: [
          "Everything in the $1,500 Secure plan included from day one",
          "24/7 online booking engine & 2-way calendar sync",
          "Full cybersecurity hardening & access control review",
          "Advanced local SEO & Google Business Profile setup",
          "3 rounds of build revisions included",
        ],
      },
      {
        name: "Hosting & Cloud Infrastructure",
        items: [
          "Managed ultra-fast cloud hosting on edge infrastructure",
          "Global Content Delivery Network (CDN) distribution",
          "Continuous SSL management and automatic certificate renewal",
          "Domain and DNS configuration assistance",
          "CI/CD deployment management & zero-downtime updates",
        ],
      },
      {
        name: "Protection & Reliability",
        items: [
          "Automated daily offsite backups with instant recovery assistance",
          "24/7 continuous uptime monitoring & health checks",
          "Proactive security monitoring & threat mitigation",
          "Regular dependency & security patch maintenance",
          "Disaster recovery assistance",
        ],
      },
      {
        name: "Ongoing Monthly Support",
        items: [
          "Up to 2 hours of website updates included every month",
          "Small content changes, staff changes & price adjustments",
          "Text, copy, and photo/portfolio updates",
          "Minor layout adjustments and seasonal announcements",
          "Priority developer support via email, phone, and WhatsApp",
        ],
      },
    ],
  },
  {
    id: "custom",
    name: "Custom Build",
    badge: "Advanced Architecture",
    subtitle: "For companies requiring advanced web applications, custom workflows & AI",
    price: "Starting at $3,000+",
    pricePeriod: "based on scope",
    secondaryNote: "Tailored quote based on your technical requirements",
    description:
      "Engineered for ambitious companies, SaaS platforms, multi-location brands, and web applications that require custom databases, third-party API/CRM integrations, custom workflows, or AI capabilities.",
    summaryTags: [
      "Custom Architecture",
      "Web Apps & APIs",
      "E-Commerce & Dashboards",
      "AI & Automation",
    ],
    revisions: "Milestone-based reviews with dedicated lead architect",
    ctaText: "Request Custom Proposal (From $3,000+)",
    ctaHref: "/contact?plan=custom",
    categories: [
      {
        name: "Custom Web Applications",
        items: [
          "Bespoke system architecture engineered for scale",
          "Advanced full-stack web applications and portals",
          "Custom dashboards and internal business tools",
          "E-commerce & custom payment checkout pipelines",
          "Advanced multi-location booking or resource systems",
        ],
      },
      {
        name: "Integrations & Automation",
        items: [
          "Third-party API integrations (Stripe, Twilio, SendGrid, etc.)",
          "CRM and ERP business integrations",
          "Business automation and data synchronization pipelines",
          "AI integrations & intelligent backend features",
          "Advanced SEO architecture for large dynamic catalogs",
        ],
      },
      {
        name: "Databases, Security & Governance",
        items: [
          "Custom relational or NoSQL databases (Cloud SQL, Firestore, Redis)",
          "Advanced authentication, SSO, and role-based access control (RBAC)",
          "Custom workflows tailored to company operations",
          "Dedicated solutions engineer & milestone reviews",
          "Custom Service Level Agreements (SLA) available",
        ],
      },
    ],
  },
];

interface PricingProps {
  className?: string;
  showSectionTitle?: boolean;
}

export const Pricing = ({ className, showSectionTitle = true }: PricingProps) => {
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const activeExpandedPlan = PRICING_PLANS.find((p) => p.id === expandedPlanId) || null;

  const handleSelectPlan = (planId: string) => {
    setExpandedPlanId((prev) => (prev === planId ? null : planId));
    // Scroll into view smoothly if user is deep
    const element = document.getElementById("pricing-plans-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBackToAll = () => {
    setExpandedPlanId(null);
    const element = document.getElementById("pricing-plans-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="pricing"
      className={cn("pt-8 sm:pt-12 pb-20 md:pb-28 overflow-hidden", className)}
    >
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showSectionTitle && (
          <div className="mb-10 sm:mb-12">
            <PremiumTextSectionReveal
              heading="Transparent Offers. Built to Scale."
              description="From high-speed local business showcase sites to full automated booking systems and managed care plans. Choose an offer below to inspect all included deliverables."
              headingAs="h2"
              headingClassName="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
              descriptionClassName="mt-3.5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              align="center"
            />
          </div>
        )}

        <div id="pricing-plans-container" className="scroll-mt-28">
          <AnimatePresence mode="wait">
            {!activeExpandedPlan ? (
              /* ========================================================================= */
              /* 4-CARD OVERVIEW GRID: Clean, compact summary cards                        */
              /* ========================================================================= */
              <motion.div
                key="all-cards-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
              >
                {PRICING_PLANS.map((plan) => {
                  const isHighlighted = plan.isPopular;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 border text-start",
                        isHighlighted
                          ? "bg-card border-violet-500/50 dark:border-violet-500/40 shadow-lg ring-1 ring-violet-500/25"
                          : "bg-card/70 border-border/80 hover:border-foreground/30 shadow-xs hover:shadow-md",
                      )}
                    >
                      {/* Top Content */}
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between min-h-[26px] mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                            Plan 0{PRICING_PLANS.findIndex((p) => p.id === plan.id) + 1}
                          </span>
                          {plan.badge && (
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                                isHighlighted
                                  ? "border-violet-500/40 bg-violet-500/15 text-violet-600 dark:text-violet-300"
                                  : "border-border/80 bg-muted/60 text-foreground/80",
                              )}
                            >
                              {isHighlighted && <Sparkles className="size-2.5 shrink-0" />}
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-sans">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2 min-h-[34px]">
                          {plan.subtitle}
                        </p>

                        {/* Price Section */}
                        <div className="mt-4 mb-3 pt-3 border-t border-border/60">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                              {plan.price}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {plan.pricePeriod}
                            </span>
                          </div>
                          {plan.secondaryNote ? (
                            <p className="text-[11px] text-muted-foreground/85 mt-1 leading-snug">
                              {plan.secondaryNote}
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground/60 mt-1">
                              {plan.revisions}
                            </p>
                          )}
                        </div>

                        {/* Feature Summary Pills */}
                        <div className="space-y-1.5 my-4 pt-1 border-t border-border/40">
                          {plan.summaryTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-2 text-xs text-foreground/90 font-medium"
                            >
                              <Check className="size-3.5 text-emerald-500 shrink-0" />
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button: Expands this card downward & hides others */}
                      <div className="pt-4 mt-auto border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan(plan.id)}
                          className={cn(
                            "w-full rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] text-center flex items-center justify-center gap-2 group",
                            isHighlighted
                              ? "bg-foreground text-background hover:opacity-90 shadow-md"
                              : "border border-border/90 bg-muted/30 hover:bg-muted text-foreground",
                          )}
                        >
                          <span>See {plan.name} plan</span>
                          <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* ========================================================================= */
              /* EXPANDED SINGLE CARD VIEW: The other 3 disappear, this card enlarges      */
              /* downwards showing all detailed categories and features                   */
              /* ========================================================================= */
              <motion.div
                key={`expanded-${activeExpandedPlan.id}`}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className={cn(
                  "relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all shadow-xl text-start",
                  activeExpandedPlan.isPopular
                    ? "bg-card border-violet-500/50 dark:border-violet-500/40 ring-1 ring-violet-500/30"
                    : "bg-card border-border/90 shadow-lg",
                )}
              >
                {/* Back to all 4 plans navigation bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/70">
                  <button
                    type="button"
                    onClick={handleBackToAll}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground px-3.5 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to all 4 plans</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      Showing detailed specifications for:
                    </span>
                    <span className="text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md">
                      {activeExpandedPlan.name}
                    </span>
                  </div>
                </div>

                {/* Plan Main Presentation Banner */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-8 border-b border-border/70">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
                        Offer Breakdown
                      </span>
                      {activeExpandedPlan.badge && (
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider border border-violet-500/40 bg-violet-500/15 text-violet-600 dark:text-violet-300">
                          <Sparkles className="size-3 shrink-0" />
                          {activeExpandedPlan.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
                      {activeExpandedPlan.name} Plan
                    </h3>

                    <p className="text-base sm:text-lg font-semibold text-foreground/90">
                      {activeExpandedPlan.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {activeExpandedPlan.description}
                    </p>

                    {activeExpandedPlan.notIncludedNote && (
                      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs sm:text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                        <Info className="size-4 shrink-0 mt-0.5" />
                        <span>
                          <strong>Scope boundary:</strong> {activeExpandedPlan.notIncludedNote}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Callout Card */}
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-muted-foreground font-bold">
                        Investment
                      </span>
                      <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                          {activeExpandedPlan.price}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {activeExpandedPlan.pricePeriod}
                        </span>
                      </div>
                      {activeExpandedPlan.secondaryNote && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {activeExpandedPlan.secondaryNote}
                        </p>
                      )}
                      <div className="mt-3 pt-3 border-t border-border/60 text-xs text-foreground/80 space-y-1">
                        <p>✓ {activeExpandedPlan.revisions}</p>
                        <p>✓ 100% Full Code Ownership</p>
                      </div>
                    </div>

                    <Button size="lg" asChild className="w-full font-bold">
                      <Link href={activeExpandedPlan.ctaHref} className="gap-2">
                        <span>Get this plan</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Categorized Inclusions (Detailed breakdown that spreads downward) */}
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Layers className="size-5 text-foreground" />
                    <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Everything Included in {activeExpandedPlan.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeExpandedPlan.categories.map((cat, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-3.5"
                      >
                        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                          {cIdx === 0 && <Zap className="size-4 text-amber-500" />}
                          {cIdx === 1 && <Sparkles className="size-4 text-violet-500" />}
                          {cIdx >= 2 && <Shield className="size-4 text-emerald-500" />}
                          <h5 className="text-sm font-bold text-foreground tracking-tight">
                            {cat.name}
                          </h5>
                        </div>

                        <ul className="space-y-2.5">
                          {cat.items.map((item, iIdx) => (
                            <li
                              key={iIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                              <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-foreground/90">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer with Return Button */}
                <div className="mt-10 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleBackToAll}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>View all 4 plans</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href="/faq">Have questions? Read FAQ</Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto font-bold">
                      <Link href={activeExpandedPlan.ctaHref} className="gap-2">
                        <span>{activeExpandedPlan.ctaText}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
