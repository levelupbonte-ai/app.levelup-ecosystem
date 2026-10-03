import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cookie Policy & Data Transparency | LevelUp Ecosystem",
  description:
    "Learn about our zero-trust cookie policy: strictly necessary authentication tokens, privacy-preserving session security, and transparency guidelines.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-40 container max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/60 text-xs font-semibold text-foreground">
            <ShieldCheck className="size-3.5 text-purple-400" />
            <span>Cybersecurity & Privacy Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-sans">
            Cookie Policy & Data Transparency
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Last updated: October 2026. As a web architecture and cybersecurity studio, LevelUp Ecosystem adheres to a strict principle of data minimization and zero-trust privacy.
          </p>
        </section>

        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Lock className="size-5 text-purple-400" />
            </div>
            <h2 className="text-base font-bold text-foreground font-sans">
              No Third-Party Ad Trackers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We do not sell personal data, use cross-site behavioral advertising cookies, or allow third-party data brokers to track your activity across the internet.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cookie className="size-5 text-purple-400" />
            </div>
            <h2 className="text-base font-bold text-foreground font-sans">
              Zero-Trust Session Security
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Cookies used for authentication (Firebase Auth) and user sessions are encrypted, scoped strictly to our official domains, and protected against unauthorized script injection.
            </p>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="p-8 rounded-2xl border border-border bg-card space-y-6">
          <h2 className="text-xl font-bold text-foreground font-sans">
            Categories of Cookies We Use
          </h2>

          <div className="space-y-6 divide-y divide-border/60">
            {/* Category 1 */}
            <div className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  1. Strictly Necessary Cookies (Essential)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                These cookies and browser storage keys are required for the website to function securely. They enable user login to the LevelStudio client workspace, maintain session integrity, prevent Cross-Site Request Forgery (CSRF), and remember your dark/light theme choice. These cannot be disabled.
              </p>
            </div>

            {/* Category 2 */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  2. Privacy-Preserving Analytics (Optional)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                We use Google Analytics with IP anonymization enabled solely to measure aggregate traffic patterns (e.g. pages visited, technical error rates). You can refuse these cookies without any impact on your experience or ability to use the site.
              </p>
            </div>

            {/* Category 3 */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  3. Cookie Consent Persistence
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                A single local storage key (<code className="font-mono text-xs text-foreground bg-muted px-1.5 py-0.5 rounded">levelup_cookie_consent</code>) records your cookie preference so we do not repeatedly display the consent banner on every page load.
              </p>
            </div>
          </div>
        </section>

        {/* How to manage */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground font-sans">
            How to Control & Delete Cookies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You can configure your browser (Chrome, Safari, Firefox, Edge, Brave) to block or delete cookies at any time via your browser settings. You can also clear your browser storage to reset your consent preferences on our site.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild variant="outline">
              <Link href="/privacy">
                Read Full Privacy Policy
              </Link>
            </Button>
            <Button asChild>
              <Link href="/contact">
                Contact Privacy Officer
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Background>
  );
}
