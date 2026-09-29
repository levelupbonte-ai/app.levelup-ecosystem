"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Check, Sparkles } from "lucide-react";

import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { cn } from "@/lib/utils";

interface PlanItem {
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  includesLabel: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
}

const buildPlans: PlanItem[] = [
  {
    name: "Starter",
    price: "$500",
    period: "one-time",
    description: "For local businesses ready to launch a fast, modern website with built-in Google Maps SEO.",
    includesLabel: "This Plan Includes:",
    features: [
      "Bespoke mobile-first responsive design",
      "Sub-2s mobile loading speed",
      "Google Maps & Local SEO setup",
      "SSL / HTTPS encryption standard",
      "Contact form & anti-spam honeypot",
      "100% code ownership (zero lock-in)",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=starter",
  },
  {
    name: "Secure",
    price: "$900",
    period: "one-time",
    badge: "Popular",
    popular: true,
    description: "Built for businesses that want 24/7 automated booking and hardened cybersecurity.",
    includesLabel: "This Plan Includes:",
    features: [
      "Everything in Starter",
      "24/7 automated appointment booking",
      "Calendar sync (Square, Calendly, Acuity)",
      "Cybersecurity audit & 2FA protection",
      "Database access rule hardening",
      "Google Business Profile synchronization",
      "30 days post-launch priority support",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=secure",
  },
  {
    name: "Secure + Care",
    price: "$900",
    period: "+ $75/month",
    description: "For founders wanting turnkey web development plus ongoing monthly management and updates.",
    includesLabel: "This Plan Includes:",
    features: [
      "Everything in Secure",
      "Fast cloud hosting & DNS management",
      "Automated daily offsite backups",
      "Continuous uptime monitoring",
      "On-demand content edits & updates",
      "Monthly vulnerability & patch audits",
      "Priority direct phone & email support",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=secure-care",
  },
];

const carePlans: PlanItem[] = [
  {
    name: "Standard Care",
    price: "$49",
    period: "per month",
    description: "Essential cloud hosting, daily backups, and security peace of mind for any live website.",
    includesLabel: "This Plan Includes:",
    features: [
      "High-speed cloud hosting & CDN",
      "Automated daily offsite backups",
      "SSL certificate maintenance",
      "24/7 uptime monitoring",
      "Email support within 24h",
      "No lock-in contracts (cancel anytime)",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=standard-care",
  },
  {
    name: "Pro Care",
    price: "$75",
    period: "per month",
    badge: "Popular",
    popular: true,
    description: "Complete hands-off peace of mind with monthly content edits and proactive security checks.",
    includesLabel: "This Plan Includes:",
    features: [
      "Everything in Standard Care",
      "Up to 2 hours of on-demand content edits",
      "Monthly security & vulnerability audits",
      "Google Business Profile updates",
      "Booking system & calendar checks",
      "Same-day priority support response",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=pro-care",
  },
  {
    name: "Growth & SEO",
    price: "$149",
    period: "per month",
    description: "Continuous local ranking optimization and conversion improvements for growing local businesses.",
    includesLabel: "This Plan Includes:",
    features: [
      "Everything in Pro Care",
      "Monthly local keyword tracking",
      "Google Maps review strategy support",
      "Speed & Core Web Vitals optimization",
      "Quarterly strategy consultation",
      "Dedicated senior developer contact",
    ],
    ctaText: "GET STARTED",
    ctaHref: "/contact?plan=growth-care",
  },
];

export const Pricing = ({ className }: { className?: string }) => {
  const [activeTab, setActiveTab] = useState<"build" | "care">("build");

  const plans = activeTab === "build" ? buildPlans : carePlans;

  return (
    <section className={cn("pt-10 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32", className)}>
      <div className="container max-w-6xl px-4 sm:px-6">
        <ScrollReveal yOffset={24} duration={0.7}>
          <div className="space-y-4 text-center">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              Transparent Investment • No Hidden Fees
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Simple, Predictable Pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed text-sm sm:text-base">
              You own 100% of your website code. No hostage fees, no builder subscription traps,
              and a free interactive preview on your phone before you pay a single dollar.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("build")}
                className={cn(
                  "px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "build"
                    ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                Website Build Packages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={cn(
                  "px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "care"
                    ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                Website Care Plans
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Pricing Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, i) => (
            <ScrollReveal
              key={`${plan.name}-${activeTab}`}
              yOffset={24}
              delay={i * 0.1}
              duration={0.65}
              className="h-full"
            >
              <div
                className={cn(
                  "h-full rounded-[28px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300",
                  plan.popular
                    ? "bg-[#090A0F] text-white border-2 border-zinc-700 shadow-2xl relative md:-translate-y-2.5 z-10"
                    : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-xl",
                )}
              >
                {/* Top content */}
                <div>
                  {/* Header row: Plan name & Popular Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        "text-xl sm:text-2xl font-bold tracking-tight",
                        plan.popular ? "text-white" : "text-zinc-950 dark:text-white",
                      )}
                    >
                      {plan.name}
                    </h3>
                    {plan.badge && (
                      <span className="bg-[#ccff00] text-black text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-4xl sm:text-5xl font-black tracking-tight",
                        plan.popular ? "text-white" : "text-zinc-950 dark:text-white",
                      )}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        plan.popular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400",
                      )}
                    >
                      /{plan.period}
                    </span>
                  </div>

                  {/* Subtitle / Description */}
                  <p
                    className={cn(
                      "mt-3 text-sm leading-relaxed min-h-[44px]",
                      plan.popular ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {plan.description}
                  </p>

                  {/* Includes Label */}
                  <div className="mt-8 mb-4">
                    <p
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        plan.popular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400",
                      )}
                    >
                      {plan.includesLabel}
                    </p>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className="size-5 rounded-full bg-[#ccff00] text-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Check className="size-3.5 stroke-[3]" />
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium leading-snug",
                            plan.popular ? "text-zinc-200" : "text-zinc-700 dark:text-zinc-300",
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/80">
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      "w-full py-4 px-6 rounded-2xl flex items-center justify-center font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 active:scale-[0.98]",
                      plan.popular
                        ? "bg-[#ccff00] text-black hover:bg-[#b8e600] shadow-lg shadow-[#ccff00]/25"
                        : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md",
                    )}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Free Preview Banner */}
        <ScrollReveal yOffset={20} duration={0.6} delay={0.3}>
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="size-5 text-[#9333ea]" />
                <h4 className="text-lg font-bold tracking-tight text-foreground">
                  Want to test your website before deciding?
                </h4>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                We build an interactive preview of your site on your phone within 24-48 hours.
                No upfront commitment, no contracts, no credit card required.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Request Free Preview
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
