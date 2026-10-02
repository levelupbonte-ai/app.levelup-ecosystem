import React from "react";

import type { Metadata } from "next";

import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { Testimonials } from "@/components/blocks/testimonials";
import { DashedLine } from "@/components/dashed-line";

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
      "Learn how our free mobile previews work, project turnaround times, website ownership, local SEO on Google Maps, and monthly care plan inclusions.",
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

const faqJsonLd = {
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
        text: "Yes. Local visibility requires coordinated website data and a verified Google Business Profile. We format your name, phone number, and service areas to match your Google listing, insert local business Schema.org structured data, and optimize page load speeds so mobile searchers convert into appointments.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a website take to build and launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once you approve your free preview, full custom development, 24/7 online appointment booking configuration, security hardening, and domain launch typically take 7 to 10 days.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in the Website Security Check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We audit your domain registrar and DNS settings, verify SSL HTTPS certificates, audit database permissions, implement two-factor authentication (2FA) on your hosting and business email accounts, install spam bot honeypots, and test for credential leakage.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own my website, code, and domain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100%. Once final payment is settled, you own all rights to your domain, branding, text, and customer lists. There are no lock-in contracts or hostage fees.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in the $49/month Care Plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "High-speed cloud hosting, automated daily backups, monthly security updates, 24/7 uptime monitoring, and on-demand content edits (updating hours, prices, service menus, or staff members).",
      },
    },
  ],
};

const Page = () => {
  return (
    <Background>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQ
        className="py-28 lg:pt-44 lg:pb-32"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-5xl" />
      <Testimonials dashedLineClassName="hidden" />
    </Background>
  );
};

export default Page;
