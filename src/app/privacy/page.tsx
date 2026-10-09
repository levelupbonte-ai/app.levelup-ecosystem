import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Lock } from "lucide-react";
import { getLegalDocument } from "@/lib/levelup-site";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Privacy Policy | LevelUp Ecosystem",
  description:
    "Privacy Policy for LevelUp Ecosystem. How we handle client contact information, Google user data, security, and data protection.",
};

export default async function PrivacyPage() {
  const dynamicDoc = await getLegalDocument("privacy");

  return (
    <section className="mx-auto max-w-4xl px-4 py-28 lg:pt-40 lg:pb-32 overflow-x-hidden">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <Lock className="size-3.5 text-violet-500" />
          <span>Data Protection &amp; Transparency</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>Official Standard</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          {dynamicDoc?.title || "Privacy Policy"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {dynamicDoc?.last_updated || "October 2, 2026"} • Operated by Richelieu Bonte (LevelUp Ecosystem)
        </p>

        {dynamicDoc?.content_markdown ? (
          <div className="space-y-6 text-foreground/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {dynamicDoc.content_markdown}
          </div>
        ) : (

        <div className="space-y-10 text-foreground/90 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              1. Overview &amp; Data Commitment
            </h2>
            <p className="text-muted-foreground">
              LevelUp Ecosystem (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
              founded and operated by Richelieu Bonte, respects your privacy and is committed to protecting your personal data.
              This Privacy Policy explains how we collect, store, and protect information when you visit our website at{" "}
              <a href="https://levelup-ecosystem.com" className="text-primary hover:underline">
                https://levelup-ecosystem.com
              </a>
              , access our LevelStudio platform, or interact with our web services.
            </p>
          </div>

          {/* WHAT WE COLLECT & DO */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                2. What Data We Collect &amp; What We Do
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We collect strictly the minimum information necessary to provide our web design, security audit, and booking solutions:
            </p>
            <ul className="space-y-2.5 text-muted-foreground list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Contact &amp; Inquiry Information:</strong> Name, business email, telephone number, and project briefs submitted via our consultation or RSVP simulation forms, used solely to respond to your inquiries and generate project proposals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Account Authentication (LevelStudio):</strong> When you create an account, we store your name and verified email through our secure authentication service to manage your workspace access securely.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Technical Session Data:</strong> Essential functional cookies for session continuity, theme preference persistence, and server performance monitoring.
                </span>
              </li>
            </ul>
          </div>

          {/* WHAT WE DO NOT DO */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10">
            <div className="flex items-center gap-2.5 mb-4">
              <XCircle className="size-6 text-red-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                3. What We Do NOT Do With Your Data
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We maintain a strict zero-surveillance, privacy-first engineering philosophy:
            </p>
            <ul className="space-y-2.5 text-muted-foreground list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT sell or rent personal information:</strong> Your data is never sold, leased, or exchanged with data brokers, marketing agencies, or advertising networks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT use invasive trackers or ad pixels:</strong> We do not track you across other websites, build behavioral advertising profiles, or install spyware.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT use client data to train public AI models:</strong> Your proprietary briefs, project documents, and code repositories remain strictly confidential.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT store raw credit card numbers:</strong> All payment transactions are processed through PCI-DSS Level 1 certified processors (Stripe).
                </span>
              </li>
            </ul>
          </div>

          {/* GOOGLE API USER DATA POLICY COMPLIANCE */}
          <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2.5 mb-4">
              <ShieldCheck className="size-6 text-primary shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                4. Google API Services &amp; OAuth User Data Compliance
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              LevelUp Ecosystem integrates Google Sign-In and Google Identity Services for fast, secure authentication.
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Data Accessed:</strong> When signing in with Google, we request access only to your basic Google public profile information (your full name, email address, and profile picture avatar).
              </p>
              <p>
                <strong className="text-foreground">How We Use Google Data:</strong> This data is solely used to verify your identity, generate your LevelStudio workspace account, and display your name inside the application interface.
              </p>
              <p>
                <strong className="text-foreground">No Sharing:</strong> Information retrieved from Google APIs is never shared with third parties, except as required to provide core authentication services.
              </p>
              <div className="p-4 rounded-xl border border-primary/20 bg-background/80 text-foreground font-medium text-xs sm:text-sm">
                &ldquo;LevelUp Ecosystem&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.&rdquo;
              </div>
            </div>
          </div>

          {/* DATA RETENTION & SECURITY */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              5. Data Security &amp; Storage
            </h2>
            <p className="text-muted-foreground mb-3">
              We implement comprehensive defense-in-depth security measures to protect your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>End-to-end TLS 1.3 / HTTPS encryption in transit.</li>
              <li>Strict database access rules allowing users to read and modify only their own data.</li>
              <li>Encrypted cloud backups hosted in secure data centers.</li>
              <li>Regular automated vulnerability checks and dependency audits.</li>
            </ul>
          </div>

          {/* USER RIGHTS */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              6. Your Privacy Rights (GDPR &amp; CCPA/CPRA)
            </h2>
            <p className="text-muted-foreground mb-3">
              Under applicable data protection laws, you retain the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or complete deletion of your account and personal data.</li>
              <li>Withdraw consent for optional communications at any time.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:contact@levelup-ecosystem.com" className="text-primary hover:underline">
                contact@levelup-ecosystem.com
              </a>{" "}
              or{" "}
              <a href="mailto:levelup.bonte@gmail.com" className="text-primary hover:underline">
                levelup.bonte@gmail.com
              </a>
              . We respond to all requests within 48 business hours.
            </p>
          </div>

          {/* CONTACT & LEGAL ENTITY */}
          <div className="pt-4 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              7. Contact Us &amp; Responsible Entity
            </h2>
            <div className="p-4 rounded-xl border border-border bg-card/50 text-sm space-y-1">
              <p className="text-foreground font-semibold">LevelUp Ecosystem</p>
              <p className="text-muted-foreground">Founder &amp; Data Controller: Richelieu Bonte</p>
              <p className="text-muted-foreground">San Diego, California • United States</p>
              <p className="text-muted-foreground">
                Email:{" "}
                <a href="mailto:contact@levelup-ecosystem.com" className="text-primary hover:underline">
                  contact@levelup-ecosystem.com
                </a>{" "}
                /{" "}
                <a href="mailto:levelup.bonte@gmail.com" className="text-primary hover:underline">
                  levelup.bonte@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground">
                Website:{" "}
                <a href="https://levelup-ecosystem.com" className="text-primary hover:underline">
                  https://levelup-ecosystem.com
                </a>
              </p>
            </div>
          </div>
        </div>
        )}
      </article>
    </section>
  );
}
