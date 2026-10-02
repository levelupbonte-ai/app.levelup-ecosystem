"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { PremiumServiceBlock } from "@/components/scroll/premium-reveal";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { LevelUpTransitionOverlay } from "@/components/transition-overlay";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Bespoke Websites",
    description: "Fast, modern sites built to convert.",
    iconName: "globe" as const,
  },
  {
    title: "Search Visibility",
    description: "Get found first on Google & Maps.",
    iconName: "search" as const,
  },
  {
    title: "Cyber Protection",
    description: "Active shield against attacks and downtime.",
    iconName: "shield" as const,
  },
  {
    title: "Automated Booking",
    description: "24/7 scheduling with zero manual work.",
    iconName: "calendar" as const,
  },
];

export const Hero = () => {
  const [isOpeningStudio, setIsOpeningStudio] = useState(false);

  const handleOpenStudio = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpeningStudio(true);
  };

  return (
    <section className="pt-28 lg:pt-40 pb-6 sm:pb-10">
      <LevelUpTransitionOverlay
        isActive={isOpeningStudio}
        title="LevelStudio Workspace"
        subtitle="Launching interactive environment..."
        targetUrl="https://studio.levelup-ecosystem.com"
        onComplete={() => {
          window.location.href = "https://studio.levelup-ecosystem.com";
        }}
      />
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content with scroll reveals */}
        <div className="flex-1">
          <SplitText
            text="LevelUp Your Online Presence."
            as="h1"
            className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl font-bold"
            delay={0.15}
            stagger={0.065}
            waitPreloader={true}
          />

          <ScrollReveal yOffset={24} duration={0.8} delay={0.35}>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed mt-5 max-w-xl">
              <span className="text-foreground font-semibold text-lg sm:text-xl md:text-2xl block mb-1.5">
                Turn Your Business Into a Brand.
              </span>
              Modern websites designed to get you found, build trust, and turn visitors into customers.
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
                className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md font-semibold cursor-pointer transition-all duration-200"
                onClick={handleOpenStudio}
                disabled={isOpeningStudio}
              >
                {isOpeningStudio ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-purple-400 stroke-3" />
                    <span>Opening LevelStudio...</span>
                  </>
                ) : (
                  <>
                    <span className="max-w-56 truncate text-start md:max-w-none">
                      Build free preview
                    </span>
                    <ArrowRight className="size-4 stroke-3" />
                  </>
                )}
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
          <div>
            {features.map((feature, index) => (
              <PremiumServiceBlock
                key={feature.title}
                title={feature.title}
                description={feature.description}
                iconName={feature.iconName}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
