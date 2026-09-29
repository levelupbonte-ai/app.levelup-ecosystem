import React from "react";

import Link from "next/link";

import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Featured Projects & Case Studies",
  description:
    "See recent client work from LevelUp Ecosystem, including Final Stop Barber Shop & Salon in San Diego, CA.",
};

const concepts = [
  {
    title: "Concept Architecture Studio",
    category: "Spatial & Creative Portfolio",
    description: "Bespoke digital architecture firm portfolio with high-resolution imagery and minimalist typography.",
  },
  {
    title: "Concept Audio & Vinyl Store",
    category: "Specialized E-Commerce",
    description: "Lightweight, sub-2s mobile audio showcase with instant checkout and zero bloat.",
  },
  {
    title: "Concept Wellness Clinic & Spa",
    category: "Appointment Scheduling",
    description: "Multi-practitioner wellness scheduling flow with integrated intake questionnaire and reminder sync.",
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

        {/* Featured Case Study: Final Stop Barber Shop */}
        <section className="container max-w-5xl mt-16">
          <Card className="rounded-3xl border border-border/80 overflow-hidden shadow-xl bg-card">
            <CardContent className="p-8 sm:p-12 space-y-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border text-xs font-mono font-medium text-foreground">
                    <MapPin className="size-3.5" />
                    <span>Client Case Study • San Diego, CA</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Final Stop Barber Shop &amp; Salon
                  </h2>
                  <p className="text-muted-foreground max-w-xl text-base">
                    Replacing phone tag with 24/7 mobile appointment booking and an elegant digital storefront for a premier San Diego barbershop and salon.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a
                      href="https://finalstop.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      Visit live site
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">
                      Get shop preview
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Case Study Deep Dive */}
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
                className="p-6 rounded-3xl border border-border/80 bg-card/60 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-colors"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {concept.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{concept.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </div>
                <div>
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
