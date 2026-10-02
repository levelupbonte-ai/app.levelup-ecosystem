"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PremiumTextSectionReveal } from "@/components/scroll/premium-reveal";
import { Button } from "@/components/ui/button";

interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  pricePeriod: string;
  secondaryPrice?: string;
  tags: string[];
  buttonText: string;
  badge?: string;
  description: string;
  ctaHref: string;
  ctaText: string;
  highlights: string[];
  specs: {
    label: string;
    value: string;
  }[];
  detailedFeatures: {
    category: string;
    items: string[];
  }[];
}

// 1. One-time Website Builds (Achat de création de site web)
const buildPlans: PlanItem[] = [
  {
    id: "starter-build",
    name: "Starter",
    subtitle: "for local businesses",
    price: "$500",
    pricePeriod: "/one-time",
    tags: ["Custom design", "Local SEO setup", "Fast mobile speed"],
    buttonText: "See Starter plan",
    description:
      "A bespoke high-conversion showcase website. Built from scratch with sub-2s mobile loading speed, local Google ranking, and complete ownership.",
    highlights: [
      "Bespoke mobile-first web architecture",
      "Sub-2s mobile loading speed (100% PageSpeed target)",
      "100% full code ownership with zero monthly lock-in",
    ],
    specs: [
      { label: "Turnaround", value: "3 - 5 Business Days" },
      { label: "Pages Included", value: "Up to 5 Pages" },
      { label: "SEO Setup", value: "Local SEO & Google Maps" },
      { label: "Code Ownership", value: "100% Yours (No lock-in)" },
    ],
    detailedFeatures: [
      {
        category: "Bespoke Web Architecture",
        items: [
          "Bespoke mobile-first Next.js web build crafted for your brand",
          "Sub-2s mobile loading speed optimized for Google Core Web Vitals",
          "SSL / HTTPS encryption standard and clean semantic markup",
        ],
      },
      {
        category: "Local Growth & Visibility",
        items: [
          "Google Maps and Local Business schema markup integration",
          "Contact and inquiry form with anti-spam security protection",
          "Optimized social media share cards (OpenGraph & Twitter previews)",
        ],
      },
      {
        category: "Ownership & Guarantees",
        items: [
          "100% full source code ownership with zero recurring platform tax",
          "14-day post-launch warranty with complimentary bug fixes",
        ],
      },
    ],
    ctaHref: "/contact?plan=starter",
    ctaText: "Get started with Starter",
  },
  {
    id: "secure-build",
    name: "Secure",
    subtitle: "for growing businesses",
    price: "$900",
    pricePeriod: "/one-time",
    badge: "Most Popular",
    tags: ["24/7 Booking engine", "Calendar sync", "Cyber defense"],
    buttonText: "See Secure plan",
    description:
      "An automated appointment booking powerhouse equipped with cybersecurity defense, real-time calendar synchronization, and Google profile domination.",
    highlights: [
      "24/7 automated appointment booking & calendar sync",
      "Real-time sync with Google Calendar, Apple, or Square",
      "Cybersecurity audit, firewall defense & database hardening",
    ],
    specs: [
      { label: "Turnaround", value: "5 - 7 Business Days" },
      { label: "Booking Engine", value: "24/7 Automated Sync" },
      { label: "Security", value: "Firewall & RLS Hardening" },
      { label: "Launch Support", value: "30 Days Priority" },
    ],
    detailedFeatures: [
      {
        category: "Automated Booking Engine",
        items: [
          "Self-service appointment scheduler with client timezone detection",
          "Real-time 2-way sync with Google Calendar, Square, or Calendly",
          "Automated SMS & email booking confirmations to minimize no-shows",
        ],
      },
      {
        category: "Cybersecurity & Hardening",
        items: [
          "Comprehensive cybersecurity audit & custom firewall setup",
          "Database access rules (RLS) & API endpoint hardening",
          "DDoS mitigation & intelligent anti-scraping protection",
        ],
      },
      {
        category: "Local SEO & Support",
        items: [
          "Google Business Profile complete audit & local ranking boost",
          "Speed tuning for top mobile search conversion",
          "30 days priority launch support & administrative walkthrough",
        ],
      },
    ],
    ctaHref: "/contact?plan=secure",
    ctaText: "Get started with Secure",
  },
  {
    id: "secure-care-build",
    name: "Secure + Care",
    subtitle: "for turnkey ease",
    price: "$900",
    pricePeriod: "+ $49/month",
    badge: "Best Value",
    tags: ["Full build included", "Cloud hosting & CDN", "Daily backups"],
    buttonText: "See Secure+Care plan",
    description:
      "Complete bespoke website creation plus turnkey ultra-fast cloud hosting, daily offsite backups, continuous uptime defense, and on-demand content edits.",
    highlights: [
      "Complete Secure website build included ($900 value)",
      "High-speed global cloud hosting across 300+ cities",
      "Automated daily offsite backups & on-demand edits",
    ],
    specs: [
      { label: "Build Turnaround", value: "5 - 7 Business Days" },
      { label: "Cloud Hosting", value: "Edge CDN Included" },
      { label: "Backups", value: "Daily Automated Offsite" },
      { label: "Care & Edits", value: "Monthly Updates Included" },
    ],
    detailedFeatures: [
      {
        category: "Complete Website Build",
        items: [
          "Everything in the Secure build included ($900 value)",
          "24/7 automated booking engine & calendar synchronization",
          "Bespoke design custom-tailored to your exact brand identity",
        ],
      },
      {
        category: "Turnkey Cloud Hosting & CDN",
        items: [
          "High-speed cloud hosting across 300+ global edge locations",
          "Automated daily offsite backups with instant 1-click restore",
          "24/7 continuous uptime monitoring & automated health checks",
        ],
      },
      {
        category: "Continuous Care & Support",
        items: [
          "On-demand monthly content, copy, and layout adjustments",
          "SSL renewals, DNS management & security patches",
          "Priority direct phone, WhatsApp, and email support",
        ],
      },
    ],
    ctaHref: "/contact?plan=secure-care",
    ctaText: "Get started with Secure + Care",
  },
  {
    id: "custom-build",
    name: "Enterprise",
    subtitle: "for mission-critical systems",
    price: "Custom",
    pricePeriod: "one-time quote",
    tags: ["Custom architecture", "API & ERP integrations", "Dedicated team"],
    buttonText: "See Enterprise plan",
    description:
      "Bespoke engineering for high-volume platforms, multi-location businesses, custom web applications, and systems requiring enterprise integrations and custom SLAs.",
    highlights: [
      "Tailored multi-page web platform or client portal",
      "Custom CRM, ERP, and API third-party integrations",
      "Dedicated solutions architect & custom SLA",
    ],
    specs: [
      { label: "Architecture", value: "Custom Bespoke" },
      { label: "Integrations", value: "API, ERP, CRM, Stripe" },
      { label: "Team", value: "Dedicated Lead Engineer" },
      { label: "Warranty", value: "Extended SLA & Training" },
    ],
    detailedFeatures: [
      {
        category: "Bespoke Engineering",
        items: [
          "Custom multi-page web platform, client portal, or SaaS application",
          "Complex business workflow automation & database schema design",
          "Third-party API integrations, Stripe payment workflows, and CRM sync",
        ],
      },
      {
        category: "Enterprise Security & Compliance",
        items: [
          "SOC2 / HIPAA / GDPR compliance hardening and auditing",
          "Penetration testing & vulnerability assessment",
          "Automated multi-region failover and disaster recovery",
        ],
      },
      {
        category: "VIP Incident Response & SLA",
        items: [
          "Designated senior software engineer & solution architect",
          "Comprehensive staff training & technical documentation",
          "Custom service-level agreement (SLA) with emergency turnaround",
        ],
      },
    ],
    ctaHref: "/contact?plan=custom-enterprise",
    ctaText: "Request Custom Proposal",
  },
];

// 2. Monthly Subscriptions (Abonnements mensuels - matching reference image)
const subscriptionPlans: PlanItem[] = [
  {
    id: "free-sub",
    name: "Free",
    subtitle: "for hobby projects",
    price: "$0",
    pricePeriod: "/month",
    tags: ["Unmetered DDoS", "Universal SSL", "Global CDN"],
    buttonText: "See Free plan",
    description:
      "Get started with zero cost. Perfect for prototypes, personal experiments, or previewing our next-generation architecture.",
    highlights: [
      "$0 forever, no credit card required",
      "Instant setup in our interactive studio",
      "Sub-second global edge network",
    ],
    specs: [
      { label: "Bandwidth", value: "10 GB / month" },
      { label: "Uptime SLA", value: "99.9% standard" },
      { label: "SSL Protocol", value: "Automated HTTPS / TLS 1.3" },
      { label: "Support", value: "Community & Documentation" },
    ],
    detailedFeatures: [
      {
        category: "Infrastructure & Speed",
        items: [
          "Global CDN edge caching across 300+ points of presence",
          "Next.js 15 modern framework architecture",
          "Automated Brotli and Gzip asset compression",
        ],
      },
      {
        category: "Security & Protection",
        items: [
          "Unmetered Layer 3/4 DDoS protection",
          "Universal wildcard SSL certificate auto-renewed",
          "Automatic HTTP/3 and IPv6 protocol support",
        ],
      },
      {
        category: "Support & Resources",
        items: [
          "Full access to LevelUp documentation",
          "Community Discord and public knowledge base",
        ],
      },
    ],
    ctaHref: "https://studio.levelup-ecosystem.com",
    ctaText: "Launch free preview",
  },
  {
    id: "pro-sub",
    name: "Pro",
    subtitle: "for pro websites",
    price: "$20",
    pricePeriod: "/mo billed annually",
    secondaryPrice: "or $25/mo billed monthly",
    badge: "Most Popular",
    tags: ["Image optimization", "Bot protection", "Ticket support"],
    buttonText: "See Pro plan",
    description:
      "Engineered for freelancers, independent professionals, and emerging brands that need high speed, custom domain power, and active defense.",
    highlights: [
      "Custom domain connection with automated DNS setup",
      "Next-generation WebP/AVIF image pipeline",
      "Intelligent anti-scraping and bot mitigation",
    ],
    specs: [
      { label: "Bandwidth", value: "100 GB / month" },
      { label: "Uptime SLA", value: "99.95% high availability" },
      { label: "Backups", value: "Weekly automated offsite snapshots" },
      { label: "Support", value: "Direct ticket support (under 24h)" },
    ],
    detailedFeatures: [
      {
        category: "Performance & Optimization",
        items: [
          "Real-time on-the-fly image & asset optimization (WebP/AVIF)",
          "Google Core Web Vitals optimization (sub-1.5s load times)",
          "Dynamic edge caching and global asset distribution",
        ],
      },
      {
        category: "Defense & Reliability",
        items: [
          "Intelligent AI bot shield and rate limiting",
          "Contact form anti-spam shield and captcha bypass prevention",
          "Continuous uptime and SSL expiration monitoring",
        ],
      },
      {
        category: "Support & Maintenance",
        items: [
          "1 hour monthly included content, copy, and layout adjustments",
          "Direct email ticket support with guaranteed 24h response",
          "Full code export capability with zero vendor lock-in",
        ],
      },
    ],
    ctaHref: "/contact?plan=pro",
    ctaText: "Get started with Pro",
  },
  {
    id: "business-sub",
    name: "Business",
    subtitle: "for small business",
    price: "$200",
    pricePeriod: "/mo billed annually",
    secondaryPrice: "or $250/mo billed monthly",
    badge: "Recommended",
    tags: ["PCI DSS 4.0", "100% uptime SLA", "Chat support"],
    buttonText: "See Business plan",
    description:
      "A complete turnkey digital headquarters. Includes 24/7 automated booking, bank-grade payment security compliance, and direct live chat.",
    highlights: [
      "24/7 automated appointment booking & live calendar sync",
      "PCI DSS 4.0 compliance & hardened database security",
      "100% uptime SLA with dedicated edge routing",
    ],
    specs: [
      { label: "Bandwidth", value: "1 TB / month" },
      { label: "Uptime SLA", value: "100% financially-backed SLA" },
      { label: "Backups", value: "Daily offsite snapshots (30-day retention)" },
      { label: "Support", value: "Live Chat & Priority WhatsApp" },
    ],
    detailedFeatures: [
      {
        category: "Conversion & Booking Engine",
        items: [
          "24/7 automated appointment scheduling system",
          "Bi-directional calendar sync (Google, Apple, Square, Calendly)",
          "Automated SMS & email booking reminders to reduce no-shows",
        ],
      },
      {
        category: "Security & Compliance",
        items: [
          "PCI DSS 4.0 payment gateway protection standards",
          "Database row-level security (RLS) and access hardening",
          "Continuous malware scanning and vulnerability monitoring",
        ],
      },
      {
        category: "Dedicated Growth & Care",
        items: [
          "3 hours monthly on-demand custom edits and new sections",
          "Monthly Google Local SEO & Business Profile rank audits",
          "Direct priority WhatsApp and live chat with engineering team",
        ],
      },
    ],
    ctaHref: "/contact?plan=business",
    ctaText: "Get started with Business",
  },
  {
    id: "contract-sub",
    name: "Contract",
    subtitle: "for mission-critical",
    price: "Custom",
    pricePeriod: "Billed annually",
    tags: ["Network priority", "24/7 support", "Custom contracts"],
    buttonText: "See Contract plan",
    description:
      "Bespoke engineering for high-volume enterprises, multi-location businesses, and mission-critical systems requiring strict compliance and 15-minute emergency SLA.",
    highlights: [
      "Dedicated network route with tier-1 edge priority",
      "24/7/365 dedicated phone line with 15-minute response SLA",
      "Custom enterprise agreements (BAA, SOC2, HIPAA, GDPR)",
    ],
    specs: [
      { label: "Bandwidth", value: "Unlimited unmetered" },
      { label: "Uptime SLA", value: "100% mission-critical guaranteed SLA" },
      { label: "Backups", value: "Every 6 hours with multi-region replicas" },
      { label: "Support", value: "24/7 Dedicated phone + designated engineer" },
    ],
    detailedFeatures: [
      {
        category: "Bespoke Architecture",
        items: [
          "Custom API, ERP, CRM, and internal system integrations",
          "Multi-tenant & multi-location architecture support",
          "Designated lead solutions architect and code reviews",
        ],
      },
      {
        category: "Enterprise Security & Governance",
        items: [
          "Advanced threat intelligence and customized WAF rules",
          "SOC2 Type II, HIPAA, and GDPR compliance agreements",
          "Annual third-party penetration testing and reports",
        ],
      },
      {
        category: "VIP Incident Response & SLA",
        items: [
          "Private Slack / Microsoft Teams channel with senior staff",
          "15-minute incident response SLA for critical priority",
          "Quarterly strategic roadmap & architectural consultations",
        ],
      },
    ],
    ctaHref: "/contact?plan=contract",
    ctaText: "Request Enterprise Proposal",
  },
];

interface PricingProps {
  className?: string;
}

export const Pricing = ({ className }: PricingProps) => {
  // 'build' = Website Builds (Achat unique de site clé en main)
  // 'subscription' = Monthly Subscriptions (Abonnements d'hébergement, sécurité & support)
  const [billingType, setBillingType] = useState<"build" | "subscription">("build");
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);

  const activePlans = billingType === "build" ? buildPlans : subscriptionPlans;

  // Close modal on Escape key press & handle body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPlan(null);
      }
    };
    if (selectedPlan) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPlan]);

  return (
    <section
      id="pricing"
      className={cn("pt-6 sm:pt-10 pb-20 md:pb-28 overflow-hidden", className)}
    >
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <PremiumTextSectionReveal
            heading="Transparent Plans. Tailored for Growth."
            description="Select a turnkey website build or choose a monthly care plan. Inspect complete plan specifications and features with a single click."
            headingAs="h2"
            headingClassName="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            descriptionClassName="mt-3.5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            align="center"
          />
        </div>

        {/* Compact, Refined Toggle Switcher between Website Builds and Monthly Subscriptions */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex items-center p-1 rounded-full bg-muted/60 dark:bg-neutral-800/80 border border-border/70 backdrop-blur-md shadow-xs">
            <button
              type="button"
              onClick={() => setBillingType("build")}
              className={cn(
                "relative flex items-center justify-center rounded-full py-1.5 px-3.5 text-xs font-medium transition-all duration-200 focus:outline-none cursor-pointer",
                billingType === "build"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Website Builds
            </button>
            <button
              type="button"
              onClick={() => setBillingType("subscription")}
              className={cn(
                "relative flex items-center justify-center rounded-full py-1.5 px-3.5 text-xs font-medium transition-all duration-200 focus:outline-none cursor-pointer",
                billingType === "subscription"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly Subscriptions
            </button>
          </div>
        </div>

        {/* 4-Column Clean Layout matching reference, animated on tab change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={billingType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
                {activePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="min-w-0 flex flex-col justify-between p-5 sm:p-6 lg:p-7 transition-colors hover:bg-muted/15"
                  >
                    {/* Top section */}
                    <div className="min-w-0">
                      {/* Header with Title and Sleek Neutral Badge */}
                      <div className="flex items-center justify-between gap-2 min-h-[26px]">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                          {plan.name}
                        </h3>
                        {plan.badge && (
                          <span className="shrink-0 rounded-full bg-foreground/10 border border-foreground/15 px-2 py-0.5 text-[9.5px] font-semibold text-foreground/90 uppercase tracking-wider">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                        {plan.subtitle}
                      </p>

                      {/* Price Section with uniform vertical rhythm */}
                      <div className="mt-5 mb-3 min-h-[52px] flex flex-col justify-center">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            {plan.price}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {plan.pricePeriod}
                          </span>
                        </div>
                        {plan.secondaryPrice ? (
                          <p className="mt-1 text-[11px] text-muted-foreground truncate">
                            {plan.secondaryPrice}
                          </p>
                        ) : (
                          <div className="h-[18px]" />
                        )}
                      </div>

                      {/* Tags / Pills with dashed borders */}
                      <div className="flex flex-wrap gap-1.5 my-4 min-h-[58px] content-start">
                        {plan.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md border border-dashed border-border/80 bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button pinned to bottom */}
                    <div className="pt-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full rounded-full border border-border/80 bg-background/90 hover:bg-muted hover:border-foreground/30 py-2 px-3 text-xs sm:text-sm font-semibold text-foreground transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] text-center truncate"
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Plan Details Interactive Modal / Drawer */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl rounded-2xl border border-border/90 bg-card p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="size-4" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-border/60 pb-6 pr-8">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {selectedPlan.name} Plan
                  </h3>
                  {selectedPlan.badge && (
                    <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                      {selectedPlan.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedPlan.subtitle}
                </p>

                {/* Price Summary */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    {selectedPlan.price}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {selectedPlan.pricePeriod}
                  </span>
                  {selectedPlan.secondaryPrice && (
                    <span className="text-xs text-muted-foreground/80 pl-2">
                      ({selectedPlan.secondaryPrice})
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {selectedPlan.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="py-5 border-b border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Key Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPlan.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-foreground/90"
                    >
                      <Sparkles className="size-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="py-5 border-b border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedPlan.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/70 bg-muted/20 p-2.5 text-start"
                    >
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                        {spec.label}
                      </span>
                      <span className="text-xs font-semibold text-foreground mt-0.5 block">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorized Detailed Features */}
              <div className="py-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Included Features &amp; Deliverables
                </h4>
                <div className="space-y-4">
                  {selectedPlan.detailedFeatures.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-xl border border-border/60 bg-muted/15 p-4"
                    >
                      <p className="text-xs font-bold text-foreground mb-2.5">
                        {group.category}
                      </p>
                      <ul className="space-y-2">
                        {group.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed"
                          >
                            <Check className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-foreground/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer / CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="w-full sm:w-auto text-xs font-medium text-muted-foreground hover:text-foreground py-2 px-3 transition-colors text-center cursor-pointer"
                >
                  Close details
                </button>

                {selectedPlan.ctaHref.startsWith("http") ? (
                  <Button asChild className="w-full sm:w-auto font-semibold">
                    <a
                      href={selectedPlan.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      {selectedPlan.ctaText}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full sm:w-auto font-semibold">
                    <Link
                      href={selectedPlan.ctaHref}
                      onClick={() => setSelectedPlan(null)}
                      className="gap-2"
                    >
                      {selectedPlan.ctaText}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
