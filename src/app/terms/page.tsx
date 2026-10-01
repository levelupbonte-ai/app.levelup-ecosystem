import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>

      <article className="prose prose-lg dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: September 29, 2026
        </p>

        <section className="space-y-6 text-foreground/90">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using LevelUp Ecosystem, you agree to be bound by these
              Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Use of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              LevelUp Ecosystem grants you a non-exclusive, non-transferable license to
              use our platform and services in accordance with your agreed plan and objectives.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All proprietary technologies, workflows, and visual architectures
              belong exclusively to LevelUp Ecosystem and are protected by applicable intellectual property laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us via our{" "}
              <Link href="/contact" className="underline text-primary">
                Contact page
              </Link>
              .
            </p>
          </div>
        </section>
      </article>
    </section>
  );
}
