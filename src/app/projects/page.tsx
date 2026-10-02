import React from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Background } from "@/components/background";
import { ProjectShowcase } from "@/components/blocks/features";
import { allProjects } from "@/data/projects";
import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Featured Projects & Case Studies | LevelUp Ecosystem",
  description:
    "See recent client work and case studies from LevelUp Ecosystem, including Final Stop Barber Shop and Wedding Invitation. Built for conversion, automated booking, and speed.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Featured Projects & Case Studies | LevelUp Ecosystem",
    description:
      "Explore real web design case studies and live client sites engineered for conversion, automated scheduling, and sub-2-second load times.",
    url: "/projects",
    siteName: "LevelUp Ecosystem",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Featured Projects & Case Studies - LevelUp Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured Projects & Case Studies | LevelUp Ecosystem",
    description:
      "Explore real client websites and case studies engineered for conversion and online booking in San Diego, CA.",
    images: ["/og-image.jpg"],
    creator: "@levelupecosystem",
  },
};

const concepts = [
  {
    title: "Concept Architecture Studio",
    badge: "Spatial Design & Architecture",
    description:
      "Architectural firm portfolio engineered with cinematic high-resolution asset delivery, progressive scroll perspectives, and editorial typography that honors structural design without platform lag.",
    image: "/features/overview-card.svg",
    tags: ["High-Res Delivery", "Editorial Design", "Bespoke Portfolio"],
  },
  {
    title: "Concept Wellness Clinic & Spa",
    badge: "Multi-Practitioner Booking",
    description:
      "Streamlined patient intake and appointment platform featuring multi-staff scheduling, customized treatment selection, and synchronized calendar notifications for local medical wellness practices.",
    image: "/features/cycle-card.svg",
    tags: ["24/7 Scheduling", "Intake Flow", "Staff Sync"],
  },
  {
    title: "Concept Audio & Vinyl Store",
    badge: "Specialized E-Commerce",
    description:
      "Lightweight, sub-2s mobile audio showcase with instant checkout, audio previews, and zero third-party builder bloat.",
    image: "/features/overview-card.svg",
    tags: ["Sub-2s Mobile", "Instant Checkout", "Custom Catalog"],
  },
];

export default function ProjectsPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        {/* Header */}
        <section className="container max-w-4xl text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
            Client Work &amp; Case Studies
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Recent Work
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore a selection of custom websites built to elevate brands, simplify customer journeys, and turn visitors into clients.
          </p>
        </section>

        {/* Animated Project Showcases (Final Stop & Le Dernier Retrouvailles with identical scroll animation) */}
        <div className="mt-4 sm:mt-6 space-y-12">
          {allProjects.map((project) => (
            <ProjectShowcase key={project.id} item={project} showExploreButton={false} />
          ))}
        </div>

        {/* Additional Concepts Section */}
        <section className="container max-w-5xl mt-20 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              Design &amp; Technology Concepts
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              More Work &amp; Prototypes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map((concept, index) => (
              <div
                key={index}
                className="p-5 rounded-3xl border border-border/80 bg-card/60 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-3.5">
                  {/* Visual Preview Image */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/60 bg-muted/20">
                    <Image
                      src={concept.image}
                      alt={concept.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>

                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-foreground/5 border border-border text-[11px] font-mono text-muted-foreground">
                    {concept.badge}
                  </div>

                  <h3 className="text-lg font-bold text-foreground tracking-tight">{concept.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {concept.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline"
                  >
                    <span>Request preview like this</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="container max-w-4xl mt-20 text-center">
          <DashedLine className="mb-12" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Want to see how your site would look and perform?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base">
            We build a functional mobile preview in 24 to 48 hours for free. Test it before deciding.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild>
              <Link href="/contact">
                Request your free preview
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Background>
  );
}
