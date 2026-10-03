"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { PremiumTextSectionReveal } from "@/components/scroll/premium-reveal";
import { Button } from "@/components/ui/button";

export interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  isRecommended?: boolean;
  subtitle: string;
  price: string;
  pricePeriod: string;
  secondaryNote?: string;
  description: string;
  shortPoints: string[];
  fullFeatures: {
    category: string;
    items: string[];
  }[];
  ctaText: string;
  ctaHref: string;
}

// 1. Core Website Build Plans
const buildPlans: PlanItem[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "For small businesses needing a clean, professional web presence",
    price: "$850",
    pricePeriod: "/one-time",
    description:
      "A bespoke high-converting showcase website built from scratch. Includes mobile-first responsive architecture, Google Maps integration, technical and local SEO foundations, and 100% full ownership with zero monthly fees.",
    shortPoints: [
      "Custom bespoke design (up to 5 pages)",
      "Mobile, tablet & desktop responsive",
      "Google Maps & Local SEO foundation",
      "Contact & lead capture form",
      "100% website code ownership",
    ],
    fullFeatures: [
      {
        category: "Included Services & Deliverables",
        items: [
          "Custom website design (no generic pre-made templates)",
          "Up to 5 custom-crafted pages",
          "Responsive design: mobile, tablet & desktop",
          "Contact and lead capture form",
          "Google Maps integration with interactive directions",
          "Basic technical SEO architecture",
          "Local SEO foundation targeting your area",
          "Optimized meta titles & descriptions",
          "Image & asset optimization",
          "Performance optimization (sub-2s loading speed target)",
          "SSL / HTTPS security encryption",
          "Google Analytics setup",
          "Basic accessibility (WCAG compliant)",
          "2 rounds of revisions included",
          "Official website launch & verification",
          "100% full website and code ownership",
        ],
      },
      {
        category: "Scope Boundary",
        items: [
          "No online booking engine included (available in Secure)",
          "No automated calendar synchronization",
          "No monthly maintenance included (optional Care available)",
        ],
      },
    ],
    ctaText: "Get Started with Starter ($850)",
    ctaHref: "/contact?plan=starter",
  },
  {
    id: "secure",
    name: "Secure",
    badge: "Business Engine",
    subtitle: "A complete business engine — not just a pretty website",
    price: "$1,500",
    pricePeriod: "/one-time",
    description:
      "An automated appointment booking and customer acquisition powerhouse. Includes self-service scheduling, 2-way calendar sync, cybersecurity hardening, and advanced local SEO.",
    shortPoints: [
      "24/7 Online Booking System",
      "Live 2-Way Calendar Sync",
      "Cybersecurity Hardening & Audit",
      "Google Business Profile Setup",
      "Advanced Local & Technical SEO",
    ],
    fullFeatures: [
      {
        category: "Business & Booking System",
        items: [
          "Everything in Starter included",
          "Online booking system for customer self-scheduling",
          "Live 2-way calendar integration (Google, Apple, Square, Calendly)",
          "Automated appointment email confirmations to minimize no-shows",
          "Lead capture & notification pipeline",
          "Instant email notifications for new bookings",
          "Google Business Profile setup and integration",
          "Advanced interactive contact/lead intake forms",
        ],
      },
      {
        category: "Search Visibility & Authority",
        items: [
          "Advanced on-page SEO targeting high-intent buyer searches",
          "Search-friendly site architecture",
          "Local SEO optimization with geo-coordinates",
          "Structured data & Schema.org markup",
          "Google Search Console configuration",
          "XML Sitemap & robots.txt configuration",
        ],
      },
      {
        category: "Security & Performance",
        items: [
          "SSL / HTTPS encryption with security headers",
          "Anti-spam protection & honeypot filtering",
          "Admin authentication hardening",
          "Access-control & role-based permissions review",
          "Database security rules where applicable",
          "Dependency & security review",
          "Basic security audit report",
          "Mobile speed optimization & Core Web Vitals tuning",
          "Lossless image optimization pipeline",
          "3 rounds of revisions included",
        ],
      },
    ],
    ctaText: "Get Started with Secure ($1,500)",
    ctaHref: "/contact?plan=secure",
  },
  {
    id: "secure-care",
    name: "Secure + Care Bundle",
    badge: "Turnkey Bundle",
    subtitle: "Complete build + 1 year of managed hosting, backups & updates",
    price: "$2,300",
    pricePeriod: "/turnkey package",
    secondaryNote: "Full Secure build + 1 year of Pro Care ($99/mo value)",
    description:
      "The complete turnkey package: you get the $1,500 Secure website build plus a full year of managed cloud hosting, daily backups, continuous security defense, and monthly updates handled for you.",
    shortPoints: [
      "Full Secure Build Included ($1,500 value)",
      "1 Full Year of Managed Cloud Hosting",
      "Daily Automated Offsite Backups",
      "24/7 Continuous Uptime Monitoring",
      "Monthly website updates (up to 2h/mo)",
    ],
    fullFeatures: [
      {
        category: "Complete Website Build",
        items: [
          "Everything included in the $1,500 Secure build",
          "24/7 online booking engine & live calendar sync",
          "Full cybersecurity audit and hardening",
          "Advanced local SEO & Google Business Profile setup",
          "3 rounds of build revisions included",
        ],
      },
      {
        category: "Included 1-Year Care Management",
        items: [
          "Managed ultra-fast cloud hosting on edge infrastructure",
          "Global Content Delivery Network (CDN)",
          "Automated daily offsite backups with instant recovery",
          "24/7 continuous uptime monitoring & health checks",
          "Up to 2 hours of monthly website updates (text, photos, prices)",
          "Continuous SSL renewal & DNS management",
          "Priority developer support",
        ],
      },
    ],
    ctaText: "Choose Secure + Care ($2,300)",
    ctaHref: "/contact?plan=secure-care",
  },
  {
    id: "custom",
    name: "Custom",
    badge: "Tailored",
    subtitle: "Build exactly what you need — tailored to your exact scope",
    price: "From $250+",
    pricePeriod: "/custom quote",
    secondaryNote: "Pricing varies based on features you choose",
    description:
      "Every project is different. Choose your features, design, integrations and functionality. We'll provide a custom quote based on your project.",
    shortPoints: [
      "Event websites & invitations (from $250)",
      "Portfolios, landing pages & creators",
      "E-commerce, booking & client portals",
      "Dashboards, custom APIs & AI web apps",
      "100% customized to your exact needs",
    ],
    fullFeatures: [
      {
        category: "Build Exactly What You Need",
        items: [
          "Event & luxury digital wedding invitations with RSVP tracking (from $250)",
          "Birthday invitations & private celebration websites",
          "Creator portfolios, personal branding & landing pages",
          "Restaurant websites with interactive digital menus",
          "Custom 24/7 booking platforms for barbershops, salons & clinics",
          "E-commerce stores with instant Stripe checkouts",
          "Client portals & SaaS dashboards",
          "AI-powered websites & smart interactive tools",
          "Full-stack custom web applications",
          "Custom business systems & workflow automation",
          "Third-party API, CRM and ERP integrations",
          "Custom database architecture (Cloud SQL, Firestore, Redis)",
        ],
      },
      {
        category: "Tailored Engagement",
        items: [
          "Transparent quote based on your exact specifications",
          "Pay only for the features you actually need",
          "Milestone-based delivery & dedicated engineering review",
          "100% full source code ownership",
        ],
      },
    ],
    ctaText: "Get a custom quote",
    ctaHref: "/contact?plan=custom",
  },
];

// 2. Optional Monthly Care Plans (Essential $39, Pro $99, Premium $199)
const carePlans: PlanItem[] = [
  {
    id: "care-essential",
    name: "Essential Care",
    subtitle: "For business owners who want their site securely online & maintained",
    price: "$39",
    pricePeriod: "/month",
    description:
      "Keeps your website online, fast, and protected. Managed cloud hosting, daily backups, and 30 minutes of monthly minor updates.",
    shortPoints: [
      "Managed Edge Cloud Hosting",
      "SSL / HTTPS & DNS Maintenance",
      "Daily Automated Offsite Backups",
      "24/7 Continuous Uptime Monitoring",
      "30 min / month of website updates",
    ],
    fullFeatures: [
      {
        category: "Infrastructure & Security",
        items: [
          "High-speed cloud hosting on global edge network",
          "Continuous SSL certificate auto-renewals",
          "Automated daily offsite backups",
          "24/7 uptime monitoring & health checks",
          "Basic security monitoring & patch updates",
          "Performance & speed monitoring",
          "Up to 30 minutes of monthly updates (text, hours, contact)",
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          "Unused monthly hours do not roll over to the next month",
          "Major redesigns or feature additions quoted separately",
          "Cancel anytime with zero long-term contract",
        ],
      },
    ],
    ctaText: "Choose Essential Care ($39/mo)",
    ctaHref: "/contact?plan=essential-care",
  },
  {
    id: "care-pro",
    name: "Pro Care",
    badge: "Recommended",
    isRecommended: true,
    subtitle: "For businesses that want LevelUp to actively care for their site monthly",
    price: "$99",
    pricePeriod: "/month",
    description:
      "Our most popular monthly plan. We handle all hosting, advanced security defense, SEO improvements, and up to 2 hours of monthly updates.",
    shortPoints: [
      "Everything in Essential Care",
      "Advanced Security & Threat Defense",
      "Up to 2 hours / month of website updates",
      "Monthly SEO & Analytics Reporting",
      "Priority Support (WhatsApp & Email)",
    ],
    fullFeatures: [
      {
        category: "Complete Care & Growth",
        items: [
          "Everything in Essential Care included",
          "Advanced continuous security monitoring",
          "Up to 2 hours of website updates included every month",
          "Content updates, text tweaks, photo swaps & price changes",
          "Ongoing SEO maintenance & basic monthly SEO tuning",
          "Monthly traffic & performance analytics reporting",
          "Priority developer support via WhatsApp and email",
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          "Unused monthly hours do not roll over to the next month",
          "Major custom developments or redesigns quoted separately",
          "No lock-in: cancel anytime with 30 days notice",
        ],
      },
    ],
    ctaText: "Choose Pro Care ($99/mo)",
    ctaHref: "/contact?plan=pro-care",
  },
  {
    id: "care-premium",
    name: "Premium Care",
    badge: "High Growth",
    subtitle: "Full digital engineering partner: content, SEO, dev & priority support",
    price: "$199",
    pricePeriod: "/month",
    description:
      "For growing businesses requiring active development: up to 5 hours of monthly updates, 1 hour of custom code development, and advanced SEO.",
    shortPoints: [
      "Everything in Pro Care",
      "Up to 5 hours / month of website updates",
      "1 hour / month of custom development",
      "New sections & pages creation",
      "Highest Priority VIP Developer Support",
    ],
    fullFeatures: [
      {
        category: "VIP Engineering & Expansion",
        items: [
          "Everything in Pro Care included",
          "Up to 5 hours of monthly website updates & content maintenance",
          "1 hour per month of dedicated custom feature development",
          "Creation of new sections or landing pages as needed",
          "Advanced monthly SEO improvements & rank tracking",
          "Deep analytics & conversion reporting",
          "Highest priority VIP developer support (direct line)",
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          "Unused monthly hours do not roll over to the next month",
          "Major multi-week system builds quoted separately",
          "Cancel anytime with zero penalty",
        ],
      },
    ],
    ctaText: "Choose Premium Care ($199/mo)",
    ctaHref: "/contact?plan=premium-care",
  },
];

interface PricingProps {
  className?: string;
  showSectionTitle?: boolean;
}

export const Pricing = ({ className, showSectionTitle = true }: PricingProps) => {
  const [billingTab, setBillingTab] = useState<"build" | "care">("build");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Optional Care add-on selector for builds
  const [selectedCareAddon, setSelectedCareAddon] = useState<"none" | "essential" | "pro" | "premium">("none");

  const activePlans = billingTab === "build" ? buildPlans : carePlans;
  const activeExpandedPlan = activePlans.find((p) => p.id === expandedPlanId) || null;

  const handleTabChange = (tab: "build" | "care") => {
    setBillingTab(tab);
    setExpandedPlanId(null);
  };

  const handleSelectPlan = (planId: string) => {
    setExpandedPlanId((prev) => (prev === planId ? null : planId));
    const element = document.getElementById("pricing-plans-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCloseExpanded = () => {
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
          <div className="mb-8 sm:mb-10 text-center">
            <PremiumTextSectionReveal
              heading="Transparent Pricing. Zero Hidden Fees."
              description="Choose a turnkey website build or ongoing monthly care. Clean deliverables, fast mobile speeds, and 100% full ownership."
              headingAs="h2"
              headingClassName="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
              descriptionClassName="mt-3 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              align="center"
            />
          </div>
        )}

        {/* Toggle Switcher: Website Builds vs Monthly Care Plans */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center p-1 rounded-full bg-muted/60 dark:bg-zinc-900 border border-border/80 shadow-xs">
            <button
              type="button"
              onClick={() => handleTabChange("build")}
              className={cn(
                "rounded-full py-1.5 px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                billingTab === "build"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Website Builds
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("care")}
              className={cn(
                "rounded-full py-1.5 px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                billingTab === "care"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly Care Plans
            </button>
          </div>

          {/* Interactive Care Addon Selector for Builds Tab */}
          {billingTab === "build" && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="font-medium text-foreground">Optional Monthly Care:</span>
              <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-muted/50 border border-border/70">
                <button
                  type="button"
                  onClick={() => setSelectedCareAddon("none")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                    selectedCareAddon === "none"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  OFF ($0/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCareAddon("essential")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                    selectedCareAddon === "essential"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Essential ($39/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCareAddon("pro")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                    selectedCareAddon === "pro"
                      ? "bg-background text-foreground shadow-2xs text-violet-500 font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Pro ($99/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCareAddon("premium")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                    selectedCareAddon === "premium"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Premium ($199/mo)
                </button>
              </div>
            </div>
          )}

          {/* Important note regarding monthly hours */}
          {billingTab === "care" && (
            <p className="text-[11px] text-muted-foreground/80 max-w-lg text-center">
              * Monthly maintenance hours do not roll over to subsequent months. Major structural redesigns are quoted separately.
            </p>
          )}
        </div>

        <div id="pricing-plans-container" className="scroll-mt-28">
          <AnimatePresence mode="wait">
            {!activeExpandedPlan ? (
              /* ========================================================================= */
              /* COMPACT OVERVIEW CARDS                                                    */
              /* ========================================================================= */
              <motion.div
                key={`grid-${billingTab}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={cn(
                  "grid gap-4 sm:gap-5 lg:gap-6",
                  billingTab === "build"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto",
                )}
              >
                {activePlans.map((plan) => {
                  const isRecommended = plan.isRecommended;

                  // Dynamic calculated price if Care Addon is selected in Build tab
                  const displayedPrice = plan.price;
                  let displayedPeriod = plan.pricePeriod;

                  if (billingTab === "build" && selectedCareAddon !== "none" && plan.id !== "custom" && plan.id !== "secure-care") {
                    const careAmount = selectedCareAddon === "essential" ? "$39/mo" : selectedCareAddon === "pro" ? "$99/mo" : "$199/mo";
                    displayedPeriod = `+ ${careAmount}`;
                  }

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-200 border text-start",
                        isRecommended
                          ? "bg-card border-violet-500/50 dark:border-violet-500/40 shadow-md ring-1 ring-violet-500/20"
                          : "bg-card/70 border-border/80 hover:border-foreground/30 shadow-xs",
                      )}
                    >
                      {/* Top Content */}
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between min-h-[24px] mb-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                            {billingTab === "build" ? "Build" : "Care"}
                          </span>
                          {plan.badge && (
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                                isRecommended
                                  ? "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                                  : "border-border bg-muted/60 text-foreground/80",
                              )}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2 min-h-[34px]">
                          {plan.subtitle}
                        </p>

                        {/* Price */}
                        <div className="mt-3.5 mb-2.5 pt-3 border-t border-border/50">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                              {displayedPrice}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {displayedPeriod}
                            </span>
                          </div>
                          {plan.secondaryNote ? (
                            <p className="text-[11px] text-muted-foreground/85 mt-0.5 truncate">
                              {plan.secondaryNote}
                            </p>
                          ) : null}
                        </div>

                        {/* Short checkmark list */}
                        <div className="space-y-1.5 my-3.5 pt-1 border-t border-border/40">
                          {plan.shortPoints.map((point) => (
                            <div
                              key={point}
                              className="flex items-start gap-2 text-xs text-foreground/90 font-medium"
                            >
                              <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Button to expand this card downwards and hide others */}
                      <div className="pt-3 mt-auto border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan(plan.id)}
                          className={cn(
                            "w-full rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] text-center",
                            isRecommended
                              ? "bg-foreground text-background hover:opacity-90"
                              : "border border-border/80 bg-background hover:bg-muted text-foreground",
                          )}
                        >
                          See {plan.name} plan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* ========================================================================= */
              /* EXPANDED VIEW: Other cards disappear, active card expands with checklist  */
              /* ========================================================================= */
              <motion.div
                key={`expanded-${activeExpandedPlan.id}`}
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -16 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={cn(
                  "relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all shadow-xl text-start max-w-4xl mx-auto",
                  activeExpandedPlan.isRecommended
                    ? "bg-card border-violet-500/50 dark:border-violet-500/40 ring-1 ring-violet-500/25"
                    : "bg-card border-border/90 shadow-md",
                )}
              >
                {/* Header Row: Title, Price, and sleek Close Button */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-border/70">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
                        {activeExpandedPlan.name}
                      </h3>
                      {activeExpandedPlan.badge && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                            activeExpandedPlan.isRecommended
                              ? "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                              : "border-border bg-muted/60 text-foreground/80",
                          )}
                        >
                          {activeExpandedPlan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {activeExpandedPlan.subtitle}
                    </p>
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-foreground">
                        {activeExpandedPlan.price}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                        {activeExpandedPlan.pricePeriod}
                      </span>
                    </div>
                  </div>

                  {/* Clean Close Button */}
                  <button
                    type="button"
                    onClick={handleCloseExpanded}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="size-4" />
                    <span>Close</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed my-6">
                  {activeExpandedPlan.description}
                </p>

                {/* Checklist of Included Services & Features */}
                <div className="space-y-6">
                  {activeExpandedPlan.fullFeatures.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl border border-border/70 bg-muted/20 space-y-3"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                        {group.category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {group.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium"
                          >
                            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer: Close + Get this plan */}
                <div className="mt-8 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleCloseExpanded}
                    className="w-full sm:w-auto text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground py-2 px-3 transition-colors cursor-pointer text-center"
                  >
                    ← Close
                  </button>

                  <Button asChild size="lg" className="w-full sm:w-auto font-bold">
                    <Link href={activeExpandedPlan.ctaHref} className="gap-2">
                      <span>{activeExpandedPlan.ctaText}</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
