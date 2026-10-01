import {
  ArrowRight,
  CalendarCheck,
  Globe,
  Search,
  ShieldCheck,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
} from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Bespoke Websites",
    description: "Fast, modern sites built to convert.",
    icon: Globe,
  },
  {
    title: "Search Visibility",
    description: "Get found first on Google & Maps.",
    icon: Search,
  },
  {
    title: "Cyber Protection",
    description: "Active shield against attacks and downtime.",
    icon: ShieldCheck,
  },
  {
    title: "Automated Booking",
    description: "24/7 scheduling with zero manual work.",
    icon: CalendarCheck,
  },
];

export const Hero = () => {
  return (
    <section className="pt-28 lg:pt-40 pb-6 sm:pb-10">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content with scroll reveals */}
        <div className="flex-1">
          <SplitText
            text="LevelUp Your Online Presence."
            as="h1"
            className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl font-bold"
            delay={0.15}
            stagger={0.065}
          />

          <ScrollReveal yOffset={24} duration={0.8} delay={0.35}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mt-5 max-w-xl">
              <span className="text-foreground font-medium">
                Building your business together by scaling your digital impact.
              </span>{" "}
              We deliver fast, secure websites with automated booking and local SEO
              designed to maximize your client conversion.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.8} delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <Button asChild>
                <a href="/contact">
                  Book now
                </a>
              </Button>
              <Button
                variant="outline"
                className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md font-semibold"
                asChild
              >
                <a
                  href="/contact"
                  className="max-w-56 truncate text-start md:max-w-none"
                >
                  Build free preview
                  <ArrowRight className="stroke-3" />
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* Right side - Features with staggered entrance */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          <ScrollStagger staggerDelay={0.12}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <ScrollStaggerItem key={feature.title} yOffset={16}>
                  <div className="flex gap-2.5 lg:gap-5 mb-5 last:mb-0">
                    <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                    <div>
                      <h2 className="font-text text-foreground font-semibold">
                        {feature.title}
                      </h2>
                      <p className="text-muted-foreground max-w-76 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStagger>
        </div>
      </div>
    </section>
  );
};
