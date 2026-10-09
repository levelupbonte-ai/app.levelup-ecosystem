import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";
import { Background } from "@/components/background";
import { CookieActions } from "@/components/cookie-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Cookie Policy & Data Transparency | LevelUp Ecosystem",
  description:
    "Learn about our zero-trust cookie policy: strictly necessary authentication tokens, privacy-preserving session security, and transparency guidelines.",
  alternates: {
    canonical: "/cookies",
  },
};

const COOKIE_TABLE = [
  {
    name: "levelup_cookie_consent",
    provider: "LevelUp Ecosystem",
    type: "Local Storage",
    duration: "Persistent",
    purpose: "Stores your cookie consent choice (all, declined, or custom) to avoid showing the prompt on every page.",
    category: "Strictly Necessary",
  },
  {
    name: "levelup_cookie_preferences",
    provider: "LevelUp Ecosystem",
    type: "Local Storage",
    duration: "Persistent",
    purpose: "Stores granular preferences for analytics and personalization categories when customized.",
    category: "Strictly Necessary",
  },
  {
    name: "sb-*-auth-token",
    provider: "LevelUp Ecosystem (account sign-in)",
    type: "HTTP-Only / Encrypted Storage",
    duration: "Session / 30 Days",
    purpose: "Maintains secure workspace authentication and prevents Cross-Site Request Forgery (CSRF).",
    category: "Strictly Necessary",
  },
  {
    name: "theme",
    provider: "LevelUp Ecosystem",
    type: "Local Storage",
    duration: "Persistent",
    purpose: "Remembers your dark mode or light mode appearance preference.",
    category: "Strictly Necessary",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics (Optional)",
    type: "First-Party Cookie",
    duration: "13 Months",
    purpose: "Measures aggregate page visits with IP masking enabled. Only loaded if analytics consent is granted.",
    category: "Analytics & Performance",
  },
];

export default function CookiesPage() {
  return (
    <Background>
      <div className="py-24 sm:py-28 lg:py-36 max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to LevelUp</span>
          </Link>
        </div>

        {/* Header - Pure Editorial Typography, No Pill Enclosures */}
        <section className="space-y-3 pb-8 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Governance &amp; Privacy</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>Zero-Trust Standard</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>October 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-sans text-balance">
            Cookie Policy &amp; Data Transparency
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl pt-1">
            LevelUp Ecosystem is an engineering and cybersecurity studio. We adhere to a strict principle of data minimization: we do not use third-party advertising trackers, sell behavioral data, or track users across the internet.
          </p>
        </section>

        {/* Core Principles - Clean Grid Without Colored Bubble Boxes */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
            Our Architectural Commitments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Principle 1 */}
            <div className="p-6 rounded-xl border border-border/80 bg-card/60 space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <EyeOff className="size-4 text-violet-500 shrink-0" />
                <h3>No Third-Party Ad Trackers</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We do not sell personal data, install tracking pixels from social media ad networks, or allow data brokers to record your activity.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-6 rounded-xl border border-border/80 bg-card/60 space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Lock className="size-4 text-violet-500 shrink-0" />
                <h3>Zero-Trust Session Security</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Authentication tokens for the LevelStudio client workspace are encrypted, scoped strictly to our verified domains, and guarded against unauthorized script access.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Categories */}
        <section className="space-y-6 pt-6 border-t border-border/60">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
            Categories of Cookies We Use
          </h2>

          <div className="space-y-6">
            {/* Category 1 */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="text-xs font-mono text-violet-500">01.</span>
                <span>Strictly Necessary (Essential)</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-5">
                Required for site stability, authentication, and core operations. These enable secure client login to LevelStudio, remember your dark or light display theme, and safeguard forms against CSRF tampering. These cannot be disabled.
              </p>
            </div>

            {/* Category 2 */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="text-xs font-mono text-violet-500">02.</span>
                <span>Privacy-Preserving Analytics (Optional)</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-5">
                Measures aggregate site performance, technical errors, and page load velocity with IP anonymization. We do not correlate analytics with individual customer identities. You can opt out at any time with zero penalty.
              </p>
            </div>

            {/* Category 3 */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="text-xs font-mono text-violet-500">03.</span>
                <span>Interactive Personalization (Optional)</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-5">
                Remembers active simulation states (e.g. wedding RSVP demos, prototype preview queues) and form drafts within your active session.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Inventory Table */}
        <section className="space-y-4 pt-6 border-t border-border/60">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
              Technical Storage &amp; Cookie Inventory
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A transparent disclosure of the exact storage keys and tokens used on levelup-ecosystem.com.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 overflow-hidden bg-card/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Name / Key</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Duration</th>
                    <th className="py-3 px-4 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COOKIE_TABLE.map((item) => (
                    <tr key={item.name} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {item.duration}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground leading-relaxed text-xs">
                        {item.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Preferences Control */}
        <section className="p-6 sm:p-8 rounded-xl border border-border/80 bg-card/60 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
              Manage Your Cookie Preferences
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can adjust or revoke your cookie choices at any time directly through our interactive preferences drawer.
            </p>
          </div>

          <CookieActions />
        </section>

        {/* Browser Settings & Contact */}
        <section className="space-y-4 pt-4 border-t border-border/60">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
            Browser Level Controls
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every major web browser (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Brave) allows you to inspect, block, or delete cookies at the browser level through your privacy settings.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/privacy" className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                <span>Privacy Policy</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/terms" className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" />
                <span>Terms of Service</span>
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/contact">
                Contact Data Protection Team
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Background>
  );
}
