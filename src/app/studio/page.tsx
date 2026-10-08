import type { Metadata } from "next";
import Link from "next/link";

import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { LEVELSTUDIO_URL as STUDIO_URL } from "@/lib/levelup-login";

export const metadata: Metadata = {
  title: "LevelStudio — AI Website Builder by LevelUp Ecosystem",
  description:
    "LevelStudio turns a short brief into a real website draft in minutes: AI-guided questions, 50+ professional templates, live mobile preview, and a production build delivered by the LevelUp Ecosystem engineering team.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "LevelStudio — AI Website Builder by LevelUp Ecosystem",
    description:
      "Describe your business, answer a few AI-guided questions, and preview a real website draft in minutes.",
    url: "https://levelup-ecosystem.com/studio",
  },
};

const steps = [
  {
    title: "Describe your business",
    body: "One sentence is enough: \"A modern barbershop in San Diego with online booking.\"",
  },
  {
    title: "Answer a few guided questions",
    body: "The AI asks only what matters: name, tone, services, colors and must-have pages.",
  },
  {
    title: "Preview your draft live",
    body: "See the site on desktop and mobile, ask for changes in plain language, and share a preview link.",
  },
  {
    title: "Launch with LevelUp",
    body: "Our engineers turn the approved draft into a fast, secure production site with booking, SEO and hosting.",
  },
];

const features = [
  "50+ professional templates (barbershops, salons, restaurants, stores, portfolios, events)",
  "AI-guided brief so the draft matches your brand",
  "Live desktop and mobile preview",
  "Share links for your team or clients",
  "Production build, hosting and care plan by LevelUp Ecosystem",
];

const faq = [
  {
    q: "What is LevelStudio?",
    a: "LevelStudio is the AI website builder of LevelUp Ecosystem. It turns a short description of your business into a website draft you can preview and refine before LevelUp builds the production site.",
  },
  {
    q: "Is the draft my final website?",
    a: "No. Drafts are previews. Once you approve one, the LevelUp engineering team delivers the production website with booking, SEO, security and hosting.",
  },
  {
    q: "Who can use LevelStudio?",
    a: "LevelStudio is available to LevelUp clients with a LevelUp account. Sign in once with your LevelUp account to access LevelStudio and your client dashboard.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "LevelStudio",
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      url: STUDIO_URL,
      description: metadata.description,
      publisher: { "@id": "https://levelup-ecosystem.com/#org" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function StudioPage() {
  return (
    <Background>
      <script
        type="application/ld+json"
        // Static content defined above; escape "<" so it can never close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="py-28 lg:py-32 lg:pt-44">
        <section className="container max-w-5xl">
          <span className="text-muted-foreground font-mono text-xs font-bold uppercase tracking-widest">
            LevelStudio • AI website builder
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            From a one-line brief to a real website draft
          </h1>
          <p className="text-foreground/90 mt-5 max-w-3xl text-xl leading-snug font-medium md:text-2xl">
            LevelStudio is the AI website builder of LevelUp Ecosystem. Describe your business, answer a few
            guided questions, and preview your new site in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={STUDIO_URL}>Open LevelStudio</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/start-project">Start a project</Link>
            </Button>
          </div>
        </section>

        <div className="pt-20 lg:pt-28">
          <DashedLine className="container max-w-5xl scale-x-115" />
        </div>

        <section className="container max-w-5xl pt-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border p-6">
                <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="container max-w-5xl pt-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What you get</h2>
          <ul className="text-muted-foreground mt-6 list-disc space-y-2 pl-5 leading-relaxed">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section className="container max-w-5xl pt-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Questions</h2>
          <dl className="mt-6 space-y-6">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Background>
  );
}
