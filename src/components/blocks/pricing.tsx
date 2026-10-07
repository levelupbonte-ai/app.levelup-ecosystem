"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { PremiumTextSectionReveal } from "@/components/scroll/premium-reveal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface FeatureItem {
  text: string;
  included: boolean;
}

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
    items: FeatureItem[];
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
        category: "Included Deliverables",
        items: [
          { text: "Custom website design (no generic templates)", included: true },
          { text: "Up to 5 custom-crafted pages", included: true },
          { text: "Responsive design: mobile, tablet & desktop", included: true },
          { text: "Contact and lead capture form", included: true },
          { text: "Google Maps integration with interactive directions", included: true },
          { text: "Basic technical SEO architecture", included: true },
          { text: "Local SEO foundation targeting your service area", included: true },
          { text: "Optimized meta titles & descriptions", included: true },
          { text: "Image & asset optimization (sub-2s loading speed target)", included: true },
          { text: "SSL / HTTPS security encryption standard", included: true },
          { text: "Google Analytics setup", included: true },
          { text: "Basic accessibility (WCAG compliant)", included: true },
          { text: "2 rounds of revisions included", included: true },
          { text: "Website launch & verification", included: true },
          { text: "100% full website and code ownership", included: true },
        ],
      },
      {
        category: "Features Not Included (Available in Secure)",
        items: [
          { text: "24/7 online booking engine", included: false },
          { text: "Live 2-way calendar sync (Google, Apple, Square)", included: false },
          { text: "Automated SMS/Email appointment confirmations", included: false },
          { text: "Database security audit & access hardening", included: false },
          { text: "Included monthly website updates (Care optional)", included: false },
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
          { text: "Everything in Starter included", included: true },
          { text: "Online booking system for customer self-scheduling", included: true },
          { text: "Live 2-way calendar integration (Google, Apple, Square, Calendly)", included: true },
          { text: "Automated appointment email confirmations to reduce no-shows", included: true },
          { text: "Lead capture & notification pipeline", included: true },
          { text: "Instant email notifications for new bookings", included: true },
          { text: "Google Business Profile setup & integration assistance", included: true },
          { text: "Advanced interactive contact/lead intake forms", included: true },
        ],
      },
      {
        category: "Search Visibility & Security",
        items: [
          { text: "Advanced on-page SEO targeting high-intent buyer searches", included: true },
          { text: "Search-friendly site architecture", included: true },
          { text: "Local SEO optimization with geo-coordinates", included: true },
          { text: "Structured data & Schema.org markup", included: true },
          { text: "Google Search Console setup & sitemap submission", included: true },
          { text: "SSL / HTTPS encryption with security headers", included: true },
          { text: "Anti-spam protection & honeypot filtering", included: true },
          { text: "Admin authentication hardening & access review", included: true },
          { text: "Database security rules where applicable", included: true },
          { text: "Mobile speed optimization & Core Web Vitals tuning", included: true },
          { text: "3 rounds of revisions included", included: true },
        ],
      },
      {
        category: "Features Not Included (Available in Bundle / Care)",
        items: [
          { text: "Managed cloud hosting & CDN (Care optional)", included: false },
          { text: "Automated daily offsite backups (Care optional)", included: false },
          { text: "Monthly on-demand website edits (Care optional)", included: false },
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
          { text: "Everything included in the $1,500 Secure build", included: true },
          { text: "24/7 online booking engine & live calendar sync", included: true },
          { text: "Full cybersecurity audit and hardening", included: true },
          { text: "Advanced local SEO & Google Business Profile setup", included: true },
          { text: "3 rounds of build revisions included", included: true },
        ],
      },
      {
        category: "Included 1-Year Care Management",
        items: [
          { text: "Managed ultra-fast cloud hosting on edge infrastructure", included: true },
          { text: "Global Content Delivery Network (CDN)", included: true },
          { text: "Automated daily offsite backups with instant recovery", included: true },
          { text: "24/7 continuous uptime monitoring & health checks", included: true },
          { text: "Up to 2 hours of monthly website updates (text, photos, prices)", included: true },
          { text: "Continuous SSL renewal & DNS management", included: true },
          { text: "Priority developer support", included: true },
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
          { text: "Event & luxury digital wedding invitations with RSVP tracking (from $250)", included: true },
          { text: "Birthday invitations & private celebration websites", included: true },
          { text: "Creator portfolios, personal branding & landing pages", included: true },
          { text: "Restaurant websites with interactive digital menus", included: true },
          { text: "Custom 24/7 booking platforms for barbershops, salons & clinics", included: true },
          { text: "E-commerce stores with instant Stripe checkouts", included: true },
          { text: "Client portals & SaaS dashboards", included: true },
          { text: "AI-powered websites & smart interactive tools", included: true },
          { text: "Full-stack custom web applications", included: true },
          { text: "Custom business systems & workflow automation", included: true },
          { text: "Third-party API, CRM and ERP integrations", included: true },
          { text: "Custom database architecture (Cloud SQL, Firestore, Redis)", included: true },
        ],
      },
      {
        category: "Tailored Engagement",
        items: [
          { text: "Transparent quote based on your exact specifications", included: true },
          { text: "Pay only for the features you actually need", included: true },
          { text: "Milestone-based delivery & dedicated engineering review", included: true },
          { text: "100% full source code ownership", included: true },
        ],
      },
    ],
    ctaText: "Get a custom quote",
    ctaHref: "/contact?plan=custom",
  },
];

// 2. Monthly Care Plans
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
          { text: "High-speed cloud hosting on global edge network", included: true },
          { text: "Continuous SSL certificate auto-renewals", included: true },
          { text: "Automated daily offsite backups", included: true },
          { text: "24/7 uptime monitoring & health checks", included: true },
          { text: "Basic security monitoring & patch updates", included: true },
          { text: "Performance & speed monitoring", included: true },
          { text: "Up to 30 minutes of monthly updates (text, hours, contact)", included: true },
          { text: "SEO maintenance & reporting", included: false },
          { text: "Custom code development", included: false },
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          { text: "Unused monthly hours do not roll over to the next month", included: true },
          { text: "Major redesigns or feature additions quoted separately", included: true },
          { text: "Cancel anytime with zero long-term contract", included: true },
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
          { text: "Everything in Essential Care included", included: true },
          { text: "Advanced continuous security monitoring", included: true },
          { text: "Up to 2 hours of website updates included every month", included: true },
          { text: "Content updates, text tweaks, photo swaps & price changes", included: true },
          { text: "Ongoing SEO maintenance & basic monthly SEO tuning", included: true },
          { text: "Monthly traffic & performance analytics reporting", included: true },
          { text: "Priority developer support via WhatsApp and email", included: true },
          { text: "New sections / custom page creation", included: false },
          { text: "Custom code development", included: false },
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          { text: "Unused monthly hours do not roll over to the next month", included: true },
          { text: "Major custom developments or redesigns quoted separately", included: true },
          { text: "No lock-in: cancel anytime with 30 days notice", included: true },
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
          { text: "Everything in Pro Care included", included: true },
          { text: "Up to 5 hours of monthly website updates & content maintenance", included: true },
          { text: "1 hour per month of dedicated custom feature development", included: true },
          { text: "Creation of new sections or landing pages as needed", included: true },
          { text: "Advanced monthly SEO improvements & rank tracking", included: true },
          { text: "Deep analytics & conversion reporting", included: true },
          { text: "Highest priority VIP developer support (direct line)", included: true },
        ],
      },
      {
        category: "Terms & Guidelines",
        items: [
          { text: "Unused monthly hours do not roll over to the next month", included: true },
          { text: "Major multi-week system builds quoted separately", included: true },
          { text: "Cancel anytime with zero penalty", included: true },
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
  /** Website build plans from the LevelUp database (falls back to buildPlans). */
  initialPlans?: PlanItem[];
  /** Monthly care plans from the LevelUp database (falls back to carePlans). */
  initialCarePlans?: PlanItem[];
}

export const Pricing = ({
  className,
  showSectionTitle = true,
  initialPlans,
  initialCarePlans,
}: PricingProps) => {
  const [billingTab, setBillingTab] = useState<"build" | "care">("build");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // In-card Care Switch & Modal State
  const [isCareActive, setIsCareActive] = useState(false);
  const [selectedCareTier, setSelectedCareTier] = useState<"essential" | "pro" | "premium">("pro");
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);

  const effectiveBuildPlans = initialPlans && initialPlans.length > 0 ? initialPlans : buildPlans;
  const effectiveCarePlans =
    initialCarePlans && initialCarePlans.length > 0 ? initialCarePlans : carePlans;
  const activePlans = billingTab === "build" ? effectiveBuildPlans : effectiveCarePlans;
  const activeExpandedPlan = activePlans.find((p) => p.id === expandedPlanId) || null;

  const handleTabChange = (tab: "build" | "care") => {
    setBillingTab(tab);
    setExpandedPlanId(null);
    setIsCareActive(false);
    setIsCareModalOpen(false);
  };

  const handleSelectPlan = (planId: string) => {
    setExpandedPlanId((prev) => (prev === planId ? null : planId));
    setIsCareActive(false);
    setIsCareModalOpen(false);
    const element = document.getElementById("pricing-plans-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCloseExpanded = () => {
    setExpandedPlanId(null);
    setIsCareActive(false);
    setIsCareModalOpen(false);
    const element = document.getElementById("pricing-plans-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Toggle switch handler for care
  const handleToggleCareSwitch = (checked: boolean) => {
    setIsCareActive(checked);
    if (checked) {
      setIsCareModalOpen(true);
    } else {
      setIsCareModalOpen(false);
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

          {billingTab === "care" && (
            <p className="text-[11px] text-muted-foreground/80 max-w-lg text-center">
              * Monthly maintenance hours do not roll over. Major custom developments or redesigns are quoted separately.
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
                              {plan.price}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {plan.pricePeriod}
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
                {/* Header Row: Title, Price, Care Switch (Interrupteur), and Close Button */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border/70">
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

                    {/* Dynamic Price Display (Adjusts if Care is switched on) */}
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-foreground">
                        {activeExpandedPlan.price}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                        {isCareActive && activeExpandedPlan.id !== "custom" && activeExpandedPlan.id !== "secure-care"
                          ? `+ ${selectedCareTier === "essential" ? "$39" : selectedCareTier === "pro" ? "$99" : "$199"}/mo`
                          : activeExpandedPlan.pricePeriod}
                      </span>
                    </div>
                  </div>

                  {/* Top-Right Action Controls: Care Switch */}
                  <div className="flex items-center gap-3 self-end sm:self-start">
                    {/* Interrupteur Care Switch (only shown for website builds) */}
                    {billingTab === "build" && activeExpandedPlan.id !== "custom" && activeExpandedPlan.id !== "secure-care" && (
                      <div className="relative">
                        <div className="flex items-center gap-2 p-1 px-3 rounded-full border border-border/80 bg-muted/40">
                          <span className="text-xs font-semibold text-foreground select-none">
                            Care Plan
                          </span>
                          <Switch
                            checked={isCareActive}
                            onCheckedChange={handleToggleCareSwitch}
                            aria-label="Toggle Care Plan"
                          />
                          {isCareActive && (
                            <button
                              type="button"
                              onClick={() => setIsCareModalOpen((prev) => !prev)}
                              className="text-[11px] font-bold text-violet-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>
                                {selectedCareTier === "essential"
                                  ? "$39/mo"
                                  : selectedCareTier === "pro"
                                    ? "$99/mo"
                                    : "$199/mo"}
                              </span>
                              <ChevronDown className="size-3" />
                            </button>
                          )}
                        </div>

                        {/* Interactive Care Selector Pop-up */}
                        {isCareModalOpen && (
                          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-card border border-border/90 shadow-2xl p-4 z-40">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                              <span className="text-xs font-bold text-foreground">
                                Choose Care Level
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsCareModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {/* Essential Care */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCareTier("essential");
                                  setIsCareModalOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                                  selectedCareTier === "essential"
                                    ? "bg-muted border-foreground/30 shadow-2xs"
                                    : "border-border/60 hover:bg-muted/40",
                                )}
                              >
                                <div>
                                  <div className="text-xs font-bold text-foreground">
                                    Essential Care
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    Hosting, backups, 30 min updates
                                  </div>
                                </div>
                                <span className="text-xs font-black text-foreground">
                                  $39/mo
                                </span>
                              </button>

                              {/* Pro Care */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCareTier("pro");
                                  setIsCareModalOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                                  selectedCareTier === "pro"
                                    ? "bg-violet-500/10 border-violet-500/40 shadow-2xs"
                                    : "border-border/60 hover:bg-muted/40",
                                )}
                              >
                                <div>
                                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                                    <span>Pro Care</span>
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-500">
                                      Recommended
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    2h updates, SEO tuning, priority support
                                  </div>
                                </div>
                                <span className="text-xs font-black text-violet-600 dark:text-violet-400">
                                  $99/mo
                                </span>
                              </button>

                              {/* Premium Care */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCareTier("premium");
                                  setIsCareModalOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                                  selectedCareTier === "premium"
                                    ? "bg-muted border-foreground/30 shadow-2xs"
                                    : "border-border/60 hover:bg-muted/40",
                                )}
                              >
                                <div>
                                  <div className="text-xs font-bold text-foreground">
                                    Premium Care
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    5h updates, 1h custom dev, new sections
                                  </div>
                                </div>
                                <span className="text-xs font-black text-foreground">
                                  $199/mo
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed my-6">
                  {activeExpandedPlan.description}
                </p>

                {/* Checklist of Included Services & Features with Green Check / Gray Cross */}
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
                            className="flex items-start gap-2.5 text-xs sm:text-sm font-medium"
                          >
                            {item.included ? (
                              <>
                                <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-snug text-foreground/90">{item.text}</span>
                              </>
                            ) : (
                              <>
                                <X className="size-4 text-muted-foreground/45 shrink-0 mt-0.5" />
                                <span className="leading-snug text-muted-foreground/70">{item.text}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer: Close button WITHOUT arrow, and Main CTA */}
                <div className="mt-8 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleCloseExpanded}
                    className="w-full sm:w-auto text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground py-2 px-4 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer text-center"
                  >
                    Close
                  </button>

                  <Button asChild size="lg" className="w-full sm:w-auto font-bold">
                    <Link
                      href={
                        isCareActive && activeExpandedPlan.id !== "custom" && activeExpandedPlan.id !== "secure-care"
                          ? `${activeExpandedPlan.ctaHref}&care=${selectedCareTier}`
                          : activeExpandedPlan.ctaHref
                      }
                      className="gap-2"
                    >
                      <span>
                        {isCareActive && activeExpandedPlan.id !== "custom" && activeExpandedPlan.id !== "secure-care"
                          ? `Get ${activeExpandedPlan.name} + ${selectedCareTier.charAt(0).toUpperCase() + selectedCareTier.slice(1)} Care`
                          : activeExpandedPlan.ctaText}
                      </span>
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
