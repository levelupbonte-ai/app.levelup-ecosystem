import React from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Background } from "@/components/background";
import { BarberShopShowcase } from "@/components/blocks/features";
import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Featured Projects & Case Studies",
  description:
    "See recent client work from LevelUp Ecosystem, including Final Stop Barber Shop in San Diego, CA.",
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
            Real websites engineered for conversion, automated scheduling, and sub-2-second load times.
          </p>
        </section>

        {/* Animated Barber Shop Showcase (Exact same animation from homepage) */}
        <div className="mt-4 sm:mt-6">
          <BarberShopShowcase />
        </div>

        {/* Case Study Deep Dive Details */}
        <section className="container max-w-5xl mt-12">
          <Card className="rounded-3xl border border-border/80 overflow-hidden shadow-xl bg-card">
            <CardContent className="p-8 sm:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-foreground">The Challenge</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Final Stop had continuous incoming phone calls during busy haircut hours, leading to interruptions, missed clients, and manual scheduling errors on busy weekends.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-foreground">The Solution</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    LevelUp engineered a clean, mobile-first web application featuring 24/7 calendar appointment booking, staff selection, service menus, and synchronized Google Maps location details.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="size-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-foreground">The Impact</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Clients book appointments in less than 45 seconds on their smartphones. Phone tag eliminated, sub-2s mobile loading, and zero monthly website builder platform fees.
                  </p>
                </div>
              </div>

              {/* Live Highlights */}
              <div className="pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-2xl font-black text-foreground">&lt; 1.8s</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">Mobile Load Time</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-2xl font-black text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">Mobile Booking</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-2xl font-black text-foreground">100%</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">Code Ownership</div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
                  <div className="text-2xl font-black text-foreground">SSL</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">HTTPS Encrypted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
