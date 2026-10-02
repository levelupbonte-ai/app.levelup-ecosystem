"use client";

import React, { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { SplitText } from "@/components/scroll/split-text";
import { allProjects, type ProjectItem } from "@/data/projects";
import { cn } from "@/lib/utils";

export { allProjects, type ProjectItem };

const items: ProjectItem[] = [allProjects[0]];

/**
 * Desktop Pinned Sticky Scrub Showcase:
 * - Uses the EXACT original minimalist visual design.
 * 1. Image zooms into the center of the screen.
 * 2. Glides ("se bouscule") to the left.
 * 3. Title reveals on the right.
 * 4. Description reveals on the right.
 * 5. Visit site button reveals on the right.
 * 6. Everything stays visible, then scrolls naturally.
 */
function DesktopPinnedBarberShopShowcase({
  item,
  showExploreButton = true,
}: {
  item: ProjectItem;
  showExploreButton?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.18,
    restDelta: 0.001,
  });

  // 1. Image appearance: immediately visible, subtle zoom
  const imageScale = useTransform(smoothProgress, [0, 0.18, 0.40, 1], [0.92, 1, 1, 1]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.10, 0.40, 1], [0.85, 1, 1, 1]);
  const imageY = useTransform(smoothProgress, [0, 0.18, 0.40, 1], [15, 0, 0, 0]);

  // 2. Image glide to the left:
  // Starts centered (+35%), then shifts to left (0%)
  const desktopImageX = useTransform(
    smoothProgress,
    [0, 0.20, 0.42, 1],
    ["35%", "35%", "0%", "0%"]
  );

  // 3. Title reveal (0.38 -> 0.54)
  const titleOpacity = useTransform(smoothProgress, [0.38, 0.54, 1], [0, 1, 1]);
  const titleY = useTransform(smoothProgress, [0.38, 0.54, 1], [32, 0, 0]);
  const titleFilter = useTransform(
    smoothProgress,
    [0.38, 0.54, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)"]
  );

  // 4. Description reveal (0.52 -> 0.70)
  const descOpacity = useTransform(smoothProgress, [0.52, 0.70, 1], [0, 1, 1]);
  const descY = useTransform(smoothProgress, [0.52, 0.70, 1], [32, 0, 0]);
  const descFilter = useTransform(
    smoothProgress,
    [0.52, 0.70, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)"]
  );

  // 5. "Visit site" button reveal (0.72 -> 0.86)
  const buttonOpacity = useTransform(smoothProgress, [0.72, 0.86, 1], [0, 1, 1]);
  const buttonScale = useTransform(smoothProgress, [0.72, 0.86, 1], [0.86, 1, 1]);
  const buttonY = useTransform(smoothProgress, [0.72, 0.86, 1], [22, 0, 0]);

  return (
    <div ref={containerRef} className="relative h-[240vh] hidden md:block pt-2">
      {/* Sticky viewport pinned frame - tight optical spacing below header */}
      <div className="sticky top-24 lg:top-28 w-full flex items-center justify-center overflow-hidden px-4 lg:px-8 py-4">
        <div className="w-full max-w-5xl mx-auto">
          {/* Main 12-column grid */}
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Original Barber Shop Image card that glides to the left */}
            <motion.div
              style={{
                x: desktopImageX,
                scale: imageScale,
                opacity: imageOpacity,
                y: imageY,
              }}
              className="col-span-7 will-change-transform flex justify-center"
            >
              <div
                className={cn(
                  "relative w-full rounded-2xl sm:rounded-3xl border border-border/85 bg-card/90 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden flex items-center justify-center p-1 sm:p-1.5 md:p-2 transform-gpu ring-1 ring-border/40",
                  "aspect-[16/10] sm:aspect-[16/9] md:aspect-[639/298]",
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
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="1024px"
                      priority
                    />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-label={`Visit ${item.title}`}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer group overflow-hidden rounded-xl sm:rounded-2xl"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="1024px"
                      priority
                    />
                  </Link>
                )}
              </div>
            </motion.div>

            {/* RIGHT: Original typography and Visit button */}
            <div className="col-span-5 space-y-4 text-left pl-2">
              {/* Step 1 on right: Original Title */}
              <motion.div
                style={{
                  opacity: titleOpacity,
                  y: titleY,
                  filter: titleFilter,
                }}
                className="will-change-transform"
              >
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
              </motion.div>

              {/* Step 2 on right: Original Description */}
              <motion.div
                style={{
                  opacity: descOpacity,
                  y: descY,
                  filter: descFilter,
                }}
                className="will-change-transform"
              >
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>

              {/* Step 3 on right: Action buttons (Visit site + Explore all projects on PC) */}
              <motion.div
                style={{
                  opacity: buttonOpacity,
                  scale: buttonScale,
                  y: buttonY,
                }}
                className="pt-2 will-change-transform flex flex-wrap items-center gap-3"
              >
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
                    <ArrowRight className="size-4 sm:size-4.5 text-foreground group-hover/btn:text-background transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                )}

                {showExploreButton && (
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-border/80 bg-muted/40 hover:bg-foreground hover:text-background font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group/explore"
                  >
                    <span>Explore all projects</span>
                    <ArrowRight className="size-4 text-foreground group-hover/explore:text-background transition-transform duration-300 group-hover/explore:translate-x-1" />
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Scroll-driven Word-by-word Reveal:
 * As the user scrolls down on mobile, each word smoothly illuminates from
 * dimmed (opacity 0.22) to full crystal clarity (opacity 1.0) with zero layout shift.
 */
function MobileScrollWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="will-change-[opacity] inline-block transition-colors"
    >
      {word}
    </motion.span>
  );
}

function MobileScrollTextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 88%", "end 48%"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      className={cn(
        "text-muted-foreground flex flex-wrap gap-x-[0.28em] gap-y-1 select-none",
        className
      )}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.6 / words.length);
        return (
          <MobileScrollWord
            key={`${word}-${i}`}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

/**
 * Mobile Version: EXACT original ScaleOnScrollItem design with scroll-driven word illumination
 */
function MobileScaleOnScrollItem({
  item,
  isLast,
}: {
  item: ProjectItem;
  isLast: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const scale = useTransform(smoothProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.7, 0.9, 1]);
  const y = useTransform(smoothProgress, [0, 1], [28, 0]);
  const mobileSlideX = useTransform(smoothProgress, [0, 1], ["0%", "-35%"]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="md:hidden relative w-full max-w-4xl mx-auto px-0 sm:px-4"
    >
      {/* 1. Zoomable Image Showcase with horizontal pan */}
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
              <div className="relative w-full h-full overflow-hidden rounded-xl flex items-start bg-muted/20">
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
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
            </Link>
          )}
        </motion.div>
      </div>

      {/* 2. Text description & Visit Button */}
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

          {/* Mobile-only word-by-word progressive clarity reveal on scroll */}
          <MobileScrollTextReveal
            text={item.description}
            className="text-xs sm:text-sm md:text-base leading-relaxed"
          />
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
              <ArrowRight className="size-4 sm:size-4.5 text-foreground group-hover/btn:text-background transition-transform duration-300 group-hover/btn:translate-x-1" />
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

export function BarberShopShowcase({
  item = items[0],
  showExploreButton = true,
}: {
  item?: ProjectItem;
  showExploreButton?: boolean;
}) {
  return (
    <div className="relative">
      {/* Desktop: Pinned scrub animation with original design */}
      <DesktopPinnedBarberShopShowcase item={item} showExploreButton={showExploreButton} />

      {/* Mobile: Exact original scale-on-scroll layout with mobile pan */}
      <MobileScaleOnScrollItem item={item} isLast={true} />
    </div>
  );
}

export const ProjectShowcase = BarberShopShowcase;

export const Features = () => {
  return (
    <section id="feature-modern-teams" className="pb-20 lg:pb-32 pt-8">
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
        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-4 md:gap-8 lg:mt-20 lg:grid-cols-2 mb-12 sm:mb-16 lg:mb-20">
          <SplitText
            text="Our Latest Work"
            as="h2"
            className="text-2xl tracking-tight md:text-4xl lg:text-5xl font-extrabold"
            stagger={0.05}
          />
          <ScrollReveal yOffset={20} duration={0.7} delay={0.15}>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              A selection of custom websites built to elevate brands, attract more customers, and turn online traffic into real business.
            </p>
          </ScrollReveal>
        </div>

        {/* Showcase Items */}
        {items.map((item) => (
          <BarberShopShowcase key={item.id} item={item} showExploreButton={true} />
        ))}

        {/* Explore More Projects in dedicated projects page (Mobile only) */}
        <div className="mt-12 sm:mt-16 text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/80 bg-muted/40 hover:bg-foreground hover:text-background font-medium text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm"
          >
            <span>Explore all projects & studio concepts</span>
            <ArrowRight className="size-4 text-foreground group-hover:text-background transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
