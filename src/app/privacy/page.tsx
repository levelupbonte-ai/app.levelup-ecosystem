import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 lg:pt-44 lg:pb-32 overflow-x-hidden">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: September 29, 2026
        </p>

        <div className="space-y-8 text-foreground/90">
          <div>
            <p className="leading-relaxed text-muted-foreground">
              This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use LevelUp Ecosystem and explains your privacy rights and how the law protects you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              1. Definitions and Interpretation
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Company:</strong> Refers to LevelUp Ecosystem (&quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;).
              </li>
              <li>
                <strong className="text-foreground">Service:</strong> Refers to the LevelUp Ecosystem website and web applications.
              </li>
              <li>
                <strong className="text-foreground">Personal Data:</strong> Any information relating to an identified or identifiable individual.
              </li>
              <li>
                <strong className="text-foreground">Device:</strong> Any device capable of accessing our Service, including computers, tablets, and smartphones.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              2. Collecting and Using Your Personal Data
            </h2>
            <p className="leading-relaxed text-muted-foreground mb-3">
              While using our services, we may ask you to provide certain personally identifiable information to contact or identify you, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>First name and last name</li>
              <li>Email address</li>
              <li>Phone number (for booking confirmations)</li>
              <li>Project details and business information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              3. Data Security and Encryption
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              The security of your Personal Data is our utmost priority. We employ strict industry-standard HTTPS/SSL encryption, Firestore database security rules, and firewalls. No method of transmission over the Internet or electronic storage is 100% impenetrable, but we implement proactive defense mechanisms against unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              4. Cookies and Tracking
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We utilize essential session cookies and performance telemetry to maintain secure sessions, remember theme preferences, and optimize site speed. You can configure your browser to reject cookies, though some features may require essential cookies to function.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              5. Contact Us
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions or concerns regarding this Privacy Policy, please reach out directly through our{" "}
              <Link href="/contact" className="underline font-medium text-foreground hover:text-primary">
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
