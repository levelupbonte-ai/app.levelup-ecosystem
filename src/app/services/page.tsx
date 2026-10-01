import React from "react";

import Link from "next/link";

import {
  Calendar,
  Check,
  Clock,
  Globe,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Web Services & Solutions | LevelUp Ecosystem",
  description:
    "Fast, secure websites for San Diego businesses and creators: 24/7 online booking, Google Maps setup, security audits, and monthly care plans.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Web Services & Solutions | LevelUp Ecosystem",
    description:
      "Bespoke web architecture, 24/7 online booking, local SEO, and cybersecurity audits for businesses and creators in San Diego, CA.",
    url: "/services",
    siteName: "LevelUp Ecosystem",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/projects/final-stop.png",
        width: 1200,
        height: 630,
        alt: "LevelUp Ecosystem - Bespoke Web Services & Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Services & Solutions | LevelUp Ecosystem",
    description:
      "Bespoke web architecture, 24/7 online booking, local SEO, and cybersecurity audits for businesses in San Diego, CA.",
    images: ["/projects/final-stop.png"],
    creator: "@levelupecosystem",
  },
};

export default function ServicesPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        {/* Header */}
        <section className="container max-w-4xl text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
            Bespoke Architecture & Engineering
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Our Web Services
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Lightweight, high-converting digital infrastructure engineered for local businesses, service providers, and independent creators in San Diego and beyond.
          </p>
        </section>

        {/* Services List */}
        <section className="container max-w-5xl mt-16 space-y-16">
          {/* 1. Local Business Websites with Online Booking */}
          <div id="local-business" className="scroll-mt-32">
            <Card className="rounded-3xl overflow-hidden border border-border/80 shadow-md">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                      <Calendar className="size-6 text-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Service 01
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Local Business Websites with 24/7 Online Booking
                      </h2>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/contact">
                      Get a free preview
                    </Link>
                  </Button>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Tailored for barbershops, boutique hair salons, wellness clinics, personal trainers, and local contractors.
                  We replace endless phone tag and missed calls with a frictionless mobile booking flow connected directly
                  to your calendar and payment provider (Square, Calendly, Acuity, or Stripe).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Smartphone className="size-4 text-foreground" />
                      <span>Sub-2s Mobile Loading</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Zero slow plugins. Built with lightweight, modern code that loads instantly on cellular data.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Clock className="size-4 text-foreground" />
                      <span>24/7 Automated Sync</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clients choose their preferred staff member, service, and time slot without calling.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <MapPin className="size-4 text-foreground" />
                      <span>Google Maps Optimization</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Structured local business data to improve ranking on Google Maps and local search.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Website Security Checks */}
          <div id="security" className="scroll-mt-32">
            <Card className="rounded-3xl overflow-hidden border border-border/80 shadow-md">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                      <ShieldCheck className="size-6 text-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Service 02
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Website Security Checks &amp; Vulnerability Audits
                      </h2>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/contact">
                      Request security check
                    </Link>
                  </Button>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Conducted by our cybersecurity engineering team, our security check is a strictly non-destructive review
                  of your live website. Automated internet bots scan small business websites every single day looking for unpatched
                  vulnerabilities, exposed database keys, and unprotected admin logins.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <ShieldAlert className="size-4 text-foreground" />
                      <span>Database &amp; API Key Isolation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ensures customer data and private credentials are never exposed in public frontend code.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Check className="size-4 text-foreground" />
                      <span>2FA Account Hardening</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Walkthrough and implementation of two-factor authentication on hosting, email, and registrar.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Zap className="size-4 text-foreground" />
                      <span>Plain-English Report</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Prioritized into Critical, Recommended, and Best Practices with actionable steps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Monthly Website Care Plans */}
          <div id="care-plans" className="scroll-mt-32">
            <Card className="rounded-3xl overflow-hidden border border-border/80 shadow-md">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                      <Sparkles className="size-6 text-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Service 03 • $49 / month
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Managed Website Care &amp; Maintenance
                      </h2>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/pricing">
                      View pricing plans
                    </Link>
                  </Button>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Never worry about website updates, broken plugins, or hosting outages again. We provide fast cloud hosting,
                  automated daily backups, proactive security monitoring, and on-demand content edits whenever you change
                  prices, hours, staff, or photos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Check className="size-4 text-foreground" />
                      <span>Daily Offsite Backups</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatic snapshots taken every day so your site can be restored in minutes if needed.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Clock className="size-4 text-foreground" />
                      <span>On-Demand Content Edits</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Simply email us your new prices or announcements and we publish them within 24-48 business hours.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Globe className="size-4 text-foreground" />
                      <span>24/7 Uptime &amp; SSL Checks</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Continuous monitoring ensures your site remains accessible and secure around the clock.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. Creator & Portfolio Sites */}
          <div id="creators" className="scroll-mt-32">
            <Card className="rounded-3xl overflow-hidden border border-border/80 shadow-md">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                      <Globe className="size-6 text-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Service 04
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Creator, Portfolio &amp; Brand Showcases
                      </h2>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/projects">
                      See our work
                    </Link>
                  </Button>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Engineered for digital media creators, podcasters, visual artists, and architects. We craft elegant personal brand websites,
                  interactive portfolio decks, and custom link hubs with zero third-party branding.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container max-w-4xl mt-20 text-center">
          <DashedLine className="mb-12" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to test your new website concept?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Request a free interactive preview built for your phone within 24 to 48 hours. No upfront payment required.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                Request free preview
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                View package pricing
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Background>
  );
}
