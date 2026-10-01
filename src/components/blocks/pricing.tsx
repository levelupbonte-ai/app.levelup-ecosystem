"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { PremiumTextSectionReveal } from "@/components/scroll/premium-reveal";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { cn } from "@/lib/utils";

interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  includesLabel?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const buildPlans: PlanItem[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$500",
    period: "/ one-time",
    description: "Bespoke website with top local search rankings",
    features: [
      "Bespoke mobile-first web architecture",
      "Sub-2s mobile loading speed",
      "Google Maps & Local SEO setup",
      "SSL / HTTPS encryption standard",
      "Contact form with anti-spam protection",
      "100% full code ownership (zero lock-in)",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=starter",
  },
  {
    id: "secure",
    name: "Secure",
    price: "$900",
    period: "/ one-time",
    badge: "Most Popular",
    description: "24/7 automated booking & cybersecurity defense",
    includesLabel: "Everything in Starter, plus:",
    features: [
      "24/7 automated appointment booking",
      "Real-time calendar sync (Google, Square, Calendly)",
      "Cybersecurity audit & firewall protection",
      "Database access rule hardening",
      "Google Business Profile optimization",
      "30 days priority launch support",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=secure",
  },
  {
    id: "secure-care",
    name: "Secure + Care",
    price: "$900",
    period: "+ $49/month",
    description: "Turnkey website build plus ongoing care & hosting",
    includesLabel: "Complete build & support:",
    features: [
      "Everything in Secure build",
      "Ultra-fast cloud hosting & global CDN",
      "Automated daily offsite backups",
      "24/7 continuous uptime monitoring",
      "On-demand content updates & edits",
      "Priority direct phone & email support",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=secure-care",
  },
];

const carePlans: PlanItem[] = [
  {
    id: "standard-care",
    name: "Standard Care",
    price: "$49",
    period: "/ month",
    description: "Essential cloud hosting, daily backups & uptime monitoring",
    features: [
      "High-speed cloud hosting & global CDN",
      "Automated daily offsite backups",
      "24/7 continuous uptime monitoring",
      "SSL certificate renewals & maintenance",
      "Minor content updates (1h/month)",
      "Cancel anytime, zero commitment",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=standard-care",
  },
  {
    id: "growth-care",
    name: "Growth Care",
    price: "$99",
    period: "/ month",
    badge: "Recommended",
    description: "Active site updates, SEO maintenance & security patches",
    includesLabel: "Everything in Standard Care, plus:",
    features: [
      "Everything in Standard Care",
      "3 hours monthly on-demand content edits",
      "Monthly Google Local SEO audit & optimization",
      "Proactive security patching & malware scans",
      "Monthly performance & speed optimization",
      "Priority email & WhatsApp support",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=growth-care",
  },
  {
    id: "vip-care",
    name: "VIP Dedicated",
    price: "$199",
    period: "/ month",
    description: "Unlimited support, high-availability & custom features",
    includesLabel: "Everything in Growth Care, plus:",
    features: [
      "Everything in Growth Care",
      "Unlimited minor content & graphic updates",
      "Custom feature development (2h/month included)",
      "Database backups every 6 hours",
      "DDoS & advanced cyber threat mitigation",
      "Direct dedicated phone line & emergency SLA",
    ],
    ctaText: "Get started",
    ctaHref: "/contact?plan=vip-care",
  },
];

interface PricingProps {
  className?: string;
}

export const Pricing = ({ className }: PricingProps) => {
  // 'build' = One-Time Website Builds (prix d'achat)
  // 'subscription' = Monthly Care Subscriptions (abonnements)
  const [billingType, setBillingType] = useState<"build" | "subscription">("build");

  const currentPlans = billingType === "build" ? buildPlans : carePlans;

  return (
    <section id="pricing" className={cn("pt-4 sm:pt-8 pb-20 md:pb-28 overflow-hidden", className)}>
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Professional Headline and Subtitle */}
        <div className="mb-8 sm:mb-10">
          <PremiumTextSectionReveal
            heading="Tailored Solutions. Clear Pricing."
            description="Select a custom turnkey website build or choose a monthly care plan to keep your platform fast, secure, and always updated."
            headingAs="h2"
            headingClassName="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            descriptionClassName="mt-3.5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            align="center"
          />
        </div>

        {/* Toggle Switcher between One-Time Builds and Monthly Subscriptions */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="grid grid-cols-2 p-1 w-[270px] sm:w-[310px] rounded-full bg-neutral-200/70 dark:bg-neutral-800/80 border border-neutral-300/80 dark:border-neutral-700/80 backdrop-blur-sm shadow-inner">
            <button
              type="button"
              onClick={() => setBillingType("build")}
              className={cn(
                "relative flex items-center justify-center rounded-full py-1.5 px-2 text-[11.5px] sm:text-xs font-semibold transition-all duration-300 focus:outline-none w-full text-center",
                billingType === "build"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Website Builds
            </button>
            <button
              type="button"
              onClick={() => setBillingType("subscription")}
              className={cn(
                "relative flex items-center justify-center rounded-full py-1.5 px-2 text-[11.5px] sm:text-xs font-semibold transition-all duration-300 focus:outline-none w-full text-center",
                billingType === "subscription"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly Subscriptions
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid with smooth animated transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={billingType}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {currentPlans.map((plan, index) => (
              <ScrollReveal
                key={plan.id}
                yOffset={20}
                duration={0.55}
                delay={index * 0.08}
                className="flex"
              >
                <div className="relative w-full flex flex-col justify-between rounded-[28px] bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-7 sm:p-8 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm">
                  {plan.badge && (
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-foreground/10 text-foreground border border-foreground/15">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed pr-12">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-8 mb-6 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm font-normal ml-2">
                        {plan.period}
                      </span>
                    </div>

                    {/* Subheader if present */}
                    {plan.includesLabel && (
                      <p className="text-xs text-muted-foreground font-medium mb-4">
                        {plan.includesLabel}
                      </p>
                    )}

                    {/* Features list */}
                    <ul className="space-y-4">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className="size-4 shrink-0 text-foreground stroke-[2.5] mt-1" />
                          <span className="text-sm text-foreground/90 font-normal">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-10">
                    <Link
                      href={plan.ctaHref}
                      className="block w-full py-3.5 px-6 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-center text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
