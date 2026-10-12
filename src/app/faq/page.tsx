import React from "react";

import type { Metadata } from "next";

import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { Testimonials } from "@/components/blocks/testimonials";
import { DashedLine } from "@/components/dashed-line";
import { getFaqCategories, getTestimonialItems } from "@/lib/levelup-site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | LevelUp Ecosystem",
  description:
    "Common questions about our web design process, 24-48h free mobile previews, Google Maps setup, security audits, and monthly care plans in San Diego.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | LevelUp Ecosystem",
    description:
      "Learn how our free mobile previews work, project turnaround times, who owns what, local SEO on Google Maps, and monthly care plan inclusions.",
    url: "/faq",
    siteName: "LevelUp Ecosystem",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions - LevelUp Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | LevelUp Ecosystem",
    description:
      "Answers to common questions about web design, free previews, local Google Maps ranking, and security care plans.",
    images: ["/og-image.jpg"],
    creator: "@levelupecosystem",
  },
};

// Built-in structured data, used when the FAQ is not available from the database.
const defaultFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the free interactive preview work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You send us your business name, services, and any photos or ideas you have. Within 24 to 48 hours, we build a functional, interactive mobile preview of your site. You get to test it on your phone before spending a single dollar. If you approve, we move forward. If not, you owe nothing.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help our business rank higher on Google Maps in San Diego?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every website we build is configured for local search visibility: structured Schema.org markup, localized Google Business Profile linking, mobile-first performance, and exact geographic coordinates so nearby customers find you first.",
      },
    },
    {
      "@type": "Question",
      name: "How fast is the turnaround time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most client websites launch within 7 to 14 days of prototype approval. Because our engineering stack is built on lightweight Next.js rather than heavy templates, we build rapidly without sacrificing security or performance.",
      },
    },
    {
      "@type": "Question",
      name: "Who owns my website, content and domain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You own your domain, brand, text, photos and customer data, and you can export them on request. LevelUp builds, hosts and maintains the site on its platform under a license: we keep the code, templates and components (and may reuse them for other clients, never your content or branding), and the site stays online while your care plan is active. We never hold your domain or your data hostage. If you want the project-specific code, a code buy-out is available under a separate written agreement.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in a Care Plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Care Plan covers managed cloud hosting, daily automated backups, 24/7 uptime monitoring, security patches, SSL certificate renewals, and monthly content updates, with the amount of update time depending on the plan you choose.",
      },
    },
  ],
};

export default async function FAQPage() {
  const [faqCategories, testimonials] = await Promise.all([
    getFaqCategories(),
    getTestimonialItems(),
  ]);

  // Structured data mirrors the questions actually shown on the page.
  const faqJsonLd = faqCategories
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqCategories.flatMap((category) =>
          category.questions.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        ),
      }
    : defaultFaqJsonLd;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Background>
        <div className="py-28 lg:py-32 lg:pt-44">
          <FAQ categories={faqCategories} headerTag="h1" />
          <DashedLine className="container max-w-5xl scale-x-115 my-12" />
          <Testimonials items={testimonials} />
        </div>
      </Background>
    </>
  );
}
