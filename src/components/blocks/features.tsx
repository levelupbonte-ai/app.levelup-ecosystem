"use client";

import React, { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { cn } from "@/lib/utils";

interface ProjectItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  href: string;
  external?: boolean;
  aspectRatio: string;
  ctaText: string;
}

const items: ProjectItem[] = [
  {
    id: "final-stop",
    step: "01",
    badge: "Client Case Study • San Diego, CA",
    title: "Final Stop Barber Shop & Salon",
    description:
      "Engineered a high-performance booking engine that eliminates phone tag through 24/7 client self-scheduling, real-time barber calendar synchronization, and automated reminders. Built with zero third-party builder bloat to guarantee sub-1.8s mobile page speeds and top Google Local rankings.",
    image: "/projects/final-stop.png",
    href: "https://finalstop.org",
    external: true,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Visit site",
  },
  {
    id: "concept-architecture",
    step: "02",
    badge: "Spatial Design & Architecture",
    title: "Concept Architecture Studio",
    description:
      "Architectural firm portfolio engineered with cinematic high-resolution asset delivery, progressive scroll perspectives, and editorial typography that honors structural design without platform lag.",
    image: "/features/overview-card.svg",
    href: "/projects",
    external: false,
    aspectRatio: "aspect-[16/10]",
    ctaText: "Explore",
  },
  {
    id: "concept-wellness",
    step: "03",
    badge: "Multi-Practitioner Booking",
    title: "Concept Wellness Clinic & Spa",
    description:
      "Streamlined patient intake and appointment platform featuring multi-staff scheduling, customized treatment selection, and synchronized calendar notifications for local medical wellness practices.",
    image: "/features/cycle-card.svg",
    href: "/projects",
    external: false,
    aspectRatio: "aspect-[16/10]",
    ctaText: "Explore",
  },
];

/**
 * Scale-on-Scroll Project Showcase Item
 * Optimized for mobile touch & desktop:
 * Starts visibly scaled down (~76-78%) in the viewport and expands smoothly
 * to full width (100%) as the user scrolls through it.
 */
function ScaleOnScrollItem({
  item,
  isLast,
}: {
  item: ProjectItem;
  isLast: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile & desktop scroll tracking:
  // Starts when card enters 90% of screen (clearly visible to user so they see it grow)
  // Reaches full scale at 48% (optical center of the screen)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center 48%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 22,
    mass: 0.15,
    restDelta: 0.001,
  });

  // Scale: starts visibly compact at 82% on mobile and expands to full 100% (1.0)
  // taking almost the entire width of the mobile phone with clean breathing room
  const scale = useTransform(smoothProgress, [0, 1], [0.82, 1]);
  // Smooth opacity: 0.70 -> 1.0
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.7, 0.9, 1]);
  // Upward elevation: 28px -> 0px
  const y = useTransform(smoothProgress, [0, 1], [28, 0]);

  // Mobile horizontal landscape pan:
  // Slides the site across horizontally as user scrolls on mobile
  const mobileSlideX = useTransform(smoothProgress, [0, 1], ["0%", "-35%"]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-4xl mx-auto px-0 sm:px-4"
    >
      {/* 1. Zoomable Image Showcase with widened horizontal mobile frame */}
      <div className="w-full flex justify-center">
        <motion.div
          style={{
            scale,
            opacity,
            y,
          }}
          className={cn(
            "relative w-full rounded-2xl sm:rounded-3xl border border-border/85 bg-card/90 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden flex items-center justify-center p-1 sm:p-1.5 md:p-2 transform-gpu will-change-transform ring-1 ring-border/40",
            item.id === "final-stop"
              ? "aspect-[16/10] sm:aspect-[16/9] md:aspect-[639/298]"
              : item.aspectRatio,
          )}
        >
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.title}`}
              className="relative w-full h-full flex items-center justify-center cursor-pointer group overflow-hidden rounded-xl sm:rounded-2xl"
            >
              {/* Desktop view (md and up): full snug landscape layout */}
              <div className="hidden md:flex relative w-full h-full items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                  sizes="1024px"
                  priority
                />
              </div>

              {/* Mobile view (< md): large-format crop anchored to the top that pans horizontally across as user scrolls */}
              <div className="md:hidden relative w-full h-full overflow-hidden rounded-xl flex items-start bg-muted/20">
                <motion.div
                  style={{ x: mobileSlideX }}
                  className="relative h-full w-[165%] sm:w-[150%] shrink-0 will-change-transform"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover object-left-top"
                    sizes="800px"
                    priority
                  />
                </motion.div>
              </div>
            </a>
          ) : (
            <Link
              href={item.href}
              aria-label={`Explore ${item.title}`}
              className="relative w-full h-full flex items-center justify-center cursor-pointer group overflow-hidden rounded-xl sm:rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                referrerPolicy="no-referrer"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
            </Link>
          )}
        </motion.div>
      </div>

      {/* 2. Text description & Visit Button with Rising Arrow */}
      <div className="mt-6 sm:mt-8 px-2 sm:px-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3 flex-1 pr-0 sm:pr-2">
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/title block"
            >
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground group-hover/title:text-primary transition-colors leading-tight">
                {item.title}
              </h3>
            </a>
          ) : (
            <Link href={item.href} className="group/title block">
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground group-hover/title:text-primary transition-colors leading-tight">
                {item.title}
              </h3>
            </Link>
          )}

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Visit Button with Rising Arrow */}
        <div className="shrink-0 flex items-center pt-2 sm:pt-0">
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.ctaText} ${item.title}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-border/85 bg-card hover:bg-foreground hover:text-background font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
            >
              <span>{item.ctaText}</span>
              <ArrowUpRight className="size-4 sm:size-4.5 text-foreground group-hover/btn:text-background transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          ) : (
            <Link
              href={item.href}
              aria-label={`${item.ctaText} ${item.title}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-border/85 bg-card hover:bg-foreground hover:text-background font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
            >
              <span>{item.ctaText}</span>
              <ArrowUpRight className="size-4 sm:size-4.5 text-foreground group-hover/btn:text-background transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Subtle dashed divider between each item */}
      {!isLast && (
        <div className="mt-14 sm:mt-20 lg:mt-28">
          <DashedLine orientation="horizontal" className="w-full opacity-60" />
        </div>
      )}
    </motion.div>
  );
}

export const Features = () => {
  return (
    <section id="feature-modern-teams" className="pb-28 lg:pb-36 pt-8">
      <div className="container max-w-6xl">
        {/* Top dashed line with text */}
        <ScrollReveal yOffset={16} duration={0.6}>
          <div className="relative flex items-center justify-center">
            <DashedLine className="text-muted-foreground" />
            <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-xs sm:text-sm font-medium tracking-widest max-md:hidden uppercase">
              Bespoke Web Architecture • San Diego, CA
            </span>
          </div>
        </ScrollReveal>

        {/* Section Heading */}
        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-4 md:gap-8 lg:mt-20 lg:grid-cols-2 mb-16 sm:mb-20 lg:mb-28">
          <SplitText
            text="Selected studio work & live projects"
            as="h2"
            className="text-2xl tracking-tight md:text-4xl lg:text-5xl font-extrabold"
            stagger={0.05}
          />
          <ScrollReveal yOffset={20} duration={0.7} delay={0.15}>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Explore our recent bespoke web projects, engineered for frictionless 24/7 customer appointment
              scheduling, sub-2s mobile loading, and top Google search rankings in San Diego and beyond.
            </p>
          </ScrollReveal>
        </div>

        {/* Stacked Scale-on-Scroll Showcase Items */}
        <div className="space-y-14 sm:space-y-20 lg:space-y-28">
          {items.map((item, index) => (
            <ScaleOnScrollItem
              key={item.id}
              item={item}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
