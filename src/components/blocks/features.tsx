import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "24/7 online booking with calendar sync",
    image: "/features/triage-card.svg",
    href: "/services#local-business",
  },
  {
    title: "Local SEO & Google Business integration",
    image: "/features/cycle-card.svg",
    href: "/services#seo",
  },
  {
    title: "Cybersecurity basics & automated backups",
    image: "/features/overview-card.svg",
    href: "/services#security",
  },
];

export const Features = () => {
  return (
    <section id="feature-modern-teams" className="pb-28 lg:pb-32">
      <div className="container">
        {/* Top dashed line with text */}
        <ScrollReveal yOffset={16} duration={0.6}>
          <div className="relative flex items-center justify-center">
            <DashedLine className="text-muted-foreground" />
            <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-xs sm:text-sm font-medium tracking-widest max-md:hidden uppercase">
              Bespoke Web Architecture • San Diego, CA
            </span>
          </div>
        </ScrollReveal>

        {/* Content */}
        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-8 lg:mt-24 lg:grid-cols-2">
          <SplitText
            text="Engineered for real-world client bookings"
            as="h2"
            className="text-2xl tracking-tight md:text-4xl lg:text-5xl font-bold"
            stagger={0.05}
          />
          <ScrollReveal yOffset={20} duration={0.7} delay={0.15}>
            <p className="text-muted-foreground leading-relaxed">
              Most agencies deliver slow, bloated template sites that cost thousands and lag on phones.
              LevelUp builds lightweight, bespoke websites engineered for frictionless customer appointment
              scheduling, sub-2s mobile loading, and top Google search rankings.
            </p>
          </ScrollReveal>
        </div>

        {/* Features Card with Stagger */}
        <ScrollReveal yOffset={32} duration={0.8} delay={0.15}>
          <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex p-0 max-md:flex-col">
              {items.map((item, i) => (
                <div key={i} className="flex flex-1 max-md:flex-col group">
                  <div className="flex-1 p-4 pe-0! md:p-6">
                    <div className="relative aspect-[1.28/1] overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={`${item.title} interface`}
                        fill
                        className="object-cover object-left-top ps-4 pt-2 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="from-background absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent" />
                    </div>

                    <Link
                      href={item.href}
                      className={
                        "group/link flex items-center justify-between gap-4 pe-4 pt-4 md:pe-6 md:pt-6"
                      }
                    >
                      <h3 className="font-display max-w-60 text-xl md:text-2xl leading-tight font-bold tracking-tight">
                        {item.title}
                      </h3>
                      <div className="rounded-full border p-2 transition-colors group-hover/link:bg-accent">
                        <ChevronRight className="size-6 transition-transform group-hover/link:translate-x-1 lg:size-9" />
                      </div>
                    </Link>
                  </div>
                  {i < items.length - 1 && (
                    <div className="relative hidden md:block">
                      <DashedLine orientation="vertical" />
                    </div>
                  )}
                  {i < items.length - 1 && (
                    <div className="relative block md:hidden">
                      <DashedLine orientation="horizontal" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
};
