import Image from "next/image";

import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import {
  ScrollPerspectiveCard,
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
} from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Tailored workflows",
    description: "Track progress across custom issue flows for your team.",
    icon: CircleDot,
  },
  {
    title: "Cross-team projects",
    description: "Collaborate across teams and departments.",
    icon: Blend,
  },
  {
    title: "Milestones",
    description: "Break projects down into concrete phases.",
    icon: Diamond,
  },
  {
    title: "Progress insights",
    description: "Track scope, velocity, and progress over time.",
    icon: ChartNoAxesColumn,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content with scroll reveals */}
        <div className="flex-1">
          <SplitText
            text="LevelUp your online presence."
            as="h1"
            className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl font-bold"
            delay={0.15}
            stagger={0.065}
          />

          <ScrollReveal yOffset={24} duration={0.8} delay={0.35}>
            <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
              LevelUp Ecosystem is the fit-for-purpose platform built for planning,
              designing, and launching high-performance digital products.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.8} delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
              <Button asChild>
                <a href="/#feature-modern-teams">
                  Explore services
                </a>
              </Button>
              <Button
                variant="outline"
                className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
                asChild
              >
                <a
                  href="/contact"
                  className="max-w-56 truncate text-start md:max-w-none"
                >
                  Get in touch
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

      {/* 3D Perspective Scroll Card for Hero Mockup */}
      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <ScrollPerspectiveCard>
          <div className="relative h-[793px] w-full">
            <Image
              src="/hero.webp"
              alt="hero"
              fill
              priority
              className="rounded-2xl object-cover object-left-top shadow-2xl ring-1 ring-border/50 max-lg:rounded-tr-none"
            />
          </div>
        </ScrollPerspectiveCard>
      </div>
    </section>
  );
};
