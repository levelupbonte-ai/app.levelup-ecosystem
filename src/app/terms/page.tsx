import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { getLegalDocument } from "@/lib/supabase";

export const metadata = {
  title: "Terms of Service | LevelUp Ecosystem",
  description:
    "Terms of Service for LevelUp Ecosystem web design, security checks, and ongoing maintenance.",
};

export default async function TermsPage() {
  const dynamicDoc = await getLegalDocument("terms");

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
          <ShieldCheck className="size-3.5 text-violet-500" />
          <span>Official Agreement &amp; Terms</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>LevelUp Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          {dynamicDoc?.title || "Terms of Service"}
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
              1. Agreement to Terms
            </h2>
            <p className="text-muted-foreground">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you,
              whether personally or on behalf of an entity (&quot;you&quot;, &quot;Client&quot; or &quot;User&quot;),
              and LevelUp Ecosystem (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
              founded and operated by Richelieu Bonte, located at San Diego, California.
              By accessing or using our website located at{" "}
              <a href="https://levelup-ecosystem.com" className="text-primary hover:underline">
                https://levelup-ecosystem.com
              </a>
              , our LevelStudio platform, or any associated digital services, you agree that you have read,
              understood, and agree to be bound by all of these Terms.
            </p>
          </div>

          {/* WHAT WE DO */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                2. Scope of Services — What We Do
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              LevelUp Ecosystem is a specialized digital engineering and web design studio. We provide:
            </p>
            <ul className="space-y-2 text-muted-foreground list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Turnkey Web Development:</strong> Design, development, and deployment of bespoke high-performance websites, dynamic applications, and interactive web experiences.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Cybersecurity Audits &amp; Hardening:</strong> Code-level vulnerability assessment, Firestore security rules enforcement, SSL/TLS configuration, DDoS mitigation, and OWASP top-10 defense protocols.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Managed Cloud Hosting &amp; Maintenance:</strong> Proactive server optimization, uptime monitoring, daily backups, automated CI/CD pipeline deployments, and technical support.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong className="text-foreground">Interactive RSVP &amp; Booking Systems:</strong> Custom guest pass simulation engines, automated lead intake forms, and real-time client notification pipelines.
                </span>
              </li>
            </ul>
          </div>

          {/* WHAT WE DO NOT DO */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10">
            <div className="flex items-center gap-2.5 mb-4">
              <XCircle className="size-6 text-red-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground m-0">
                3. Prohibited Uses &amp; Limitations — What We Do NOT Do
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              To guarantee client security, absolute trust, and regulatory compliance:
            </p>
            <ul className="space-y-2 text-muted-foreground list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT sell, broker, or monetize your data:</strong> Neither user emails, lead inputs, nor client database records are ever sold, rented, or shared with third-party advertising exchanges.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT perform unauthorized network intrusions:</strong> All cybersecurity testing is strictly conducted on client-owned systems with signed mutual authorization. We never engage in illicit black-hat hacking or unauthorized scanning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT claim ownership of your intellectual property:</strong> Clients retain 100% full ownership of their brand identity, logos, business content, media files, and proprietary business concepts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>
                  <strong className="text-foreground">We DO NOT store raw credit card credentials:</strong> All billing, invoicing, and subscription processing is handled via PCI-DSS Level 1 certified processors (Stripe). We never touch or store raw card numbers.
                </span>
              </li>
            </ul>
          </div>

          {/* GOOGLE ACCOUNTS & AUTH */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              4. User Accounts &amp; Google Authentication
            </h2>
            <p className="text-muted-foreground mb-3">
              When creating an account or logging into LevelStudio, you may authenticate via email/password or Google Sign-In:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>
                You are responsible for safeguarding your login credentials and maintaining control over the account.
              </li>
              <li>
                Google authentication is used strictly to verify your identity and pre-fill your workspace profile with your name and verified email.
              </li>
              <li>
                We adhere to the{" "}
                <strong className="text-foreground">
                  Google API Services User Data Policy, including the Limited Use requirements
                </strong>
                .
              </li>
            </ul>
          </div>

          {/* PAYMENTS & BILLING */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              5. Payments, Subscriptions &amp; Cancellations
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">One-Time Project Builds:</strong> Typically invoiced with a 50% initial commitment deposit to commence design and architectural development, and the remaining 50% upon final delivery and domain launch.
              </li>
              <li>
                <strong className="text-foreground">Monthly Subscriptions (Hosting &amp; Support):</strong> Billed automatically on a recurring monthly or annual cycle. Subscriptions can be canceled at any time with 30 days notice prior to the subsequent billing cycle.
              </li>
              <li>
                <strong className="text-foreground">Revisions:</strong> Each project build includes standard milestone revisions as agreed upon in the project proposal.
              </li>
            </ul>
          </div>

          {/* INTELLECTUAL PROPERTY */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              6. Intellectual Property Rights
            </h2>
            <p className="text-muted-foreground">
              Upon final payment for a custom build, the Client receives full ownership rights of the customized deliverables, code base, and design elements produced specifically for their project. LevelUp Ecosystem retains the rights to general reusable libraries, starter architecture templates, and the right to showcase the completed work in our digital portfolio unless a non-disclosure agreement (NDA) has been signed.
            </p>
          </div>

          {/* LIMITATION OF LIABILITY */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              7. Limitation of Liability &amp; Disclaimers
            </h2>
            <p className="text-muted-foreground">
              LevelUp Ecosystem provides services on an &quot;as is&quot; and &quot;as available&quot; basis. While we implement bank-grade cybersecurity protocols and proactive server monitoring, we do not guarantee uninterrupted uptime or that third-party cloud hosting providers (e.g. Google Cloud, AWS, Vercel) will experience zero downtime. In no event shall LevelUp Ecosystem or its founder Richelieu Bonte be liable for indirect, incidental, or consequential damages.
            </p>
          </div>

          {/* CONTACT & LEGAL ENTITY */}
          <div className="pt-4 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              8. Contact &amp; Legal Notices
            </h2>
            <p className="text-muted-foreground mb-2">
              For any legal inquiries, questions regarding these Terms, or formal notices:
            </p>
            <div className="p-4 rounded-xl border border-border bg-card/50 text-sm space-y-1">
              <p className="text-foreground font-semibold">LevelUp Ecosystem</p>
              <p className="text-muted-foreground">Founder &amp; Lead Architect: Richelieu Bonte</p>
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
