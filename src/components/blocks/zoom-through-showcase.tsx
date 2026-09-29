"use client";

import React, { useRef } from "react";

import Image from "next/image";

import { MotionValue, motion, useScroll, useSpring, useTransform } from "motion/react";

import { SplitText } from "@/components/scroll/split-text";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "We're misusing Mainline as a CRM and it still works!",
    author: "Amy Chase",
    role: "PM",
    company: "Mercury Finance",
    image: "/testimonials/amy-chase.webp",
  },
  {
    quote: "I was able to replace 80% of my team with Mainline bots.",
    author: "Jonas Kotara",
    role: "Lead Engineer",
    company: "Mercury Finance",
    image: "/testimonials/jonas-kotara.webp",
  },
  {
    quote: "Founder Mode is hard enough without having a really nice PM app.",
    author: "Kevin Yam",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kevin-yam.webp",
  },
  {
    quote: "I can use the tool as a substitute from my PM.",
    author: "Kundo Marta",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kundo-marta.webp",
  },
];

function ShowcaseCard({
  item,
  index,
  total,
  progress,
}: {
  item: Testimonial;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  let inputRange: number[];
  let scaleOutput: number[];
  let rotateXOutput: number[];
  let opacityOutput: number[];
  let yOutput: number[];
  let blurOutput: string[];

  if (index === 0) {
    inputRange = [0, 0.22, 0.34, 0.44];
    scaleOutput = [1.0, 1.0, 1.34, 1.48];
    rotateXOutput = [0, 0, -6, -10];
    opacityOutput = [1.0, 1.0, 0, 0];
    yOutput = [0, 0, -45, -70];
    blurOutput = ["blur(0px)", "blur(0px)", "blur(8px)", "blur(14px)"];
  } else if (index === total - 1) {
    inputRange = [0.66, 0.80, 0.90, 1.0];
    scaleOutput = [0.84, 1.0, 1.0, 1.0];
    rotateXOutput = [14, 0, 0, 0];
    opacityOutput = [0, 1.0, 1.0, 1.0];
    yOutput = [65, 0, 0, 0];
    blurOutput = ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)"];
  } else if (index === 1) {
    inputRange = [0.14, 0.26, 0.46, 0.58, 0.68];
    scaleOutput = [0.84, 1.0, 1.0, 1.34, 1.48];
    rotateXOutput = [14, 0, 0, -6, -10];
    opacityOutput = [0, 1.0, 1.0, 0, 0];
    yOutput = [65, 0, 0, -45, -70];
    blurOutput = ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)", "blur(14px)"];
  } else {
    // index === 2
    inputRange = [0.40, 0.52, 0.72, 0.84, 0.92];
    scaleOutput = [0.84, 1.0, 1.0, 1.34, 1.48];
    rotateXOutput = [14, 0, 0, -6, -10];
    opacityOutput = [0, 1.0, 1.0, 0, 0];
    yOutput = [65, 0, 0, -45, -70];
    blurOutput = ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)", "blur(14px)"];
  }

  const scale = useTransform(progress, inputRange, scaleOutput);
  const rotateX = useTransform(progress, inputRange, rotateXOutput);
  const opacity = useTransform(progress, inputRange, opacityOutput);
  const y = useTransform(progress, inputRange, yOutput);
  const filter = useTransform(progress, inputRange, blurOutput);
  const pointerEvents = useTransform(opacity, (val) => (val > 0.4 ? "auto" : "none"));

  return (
    <motion.div
      style={{
        scale,
        rotateX,
        opacity,
        y,
        filter,
        pointerEvents,
      }}
      className="absolute inset-0 flex items-center justify-center p-4 md:p-6 origin-center will-change-transform"
    >
      {/* Large cinematic UI frame styled like the hero mockup */}
      <div className="relative w-full max-w-5xl h-[460px] sm:h-[520px] md:h-[600px] lg:h-[660px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 bg-card group">
        {/* Subtle top window bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3.5 bg-background/60 backdrop-blur-md border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="font-mono text-xs text-muted-foreground/80 tracking-wider">
            {item.company}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            0{index + 1} / 0{total}
          </span>
        </div>

        {/* Full-bleed hero portrait image */}
        <div className="relative w-full h-full">
          <Image
            src={item.image}
            alt={item.author}
            fill
            priority
            className="object-cover object-top filter brightness-[0.96] transition-transform duration-700 group-hover:scale-102"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent pointer-events-none" />
        </div>

        {/* Floating bottom glass card with typography */}
        <div className="absolute bottom-4 inset-x-4 md:bottom-6 md:inset-x-6 z-20 rounded-2xl border border-border/70 bg-background/85 p-6 md:p-8 backdrop-blur-xl shadow-xl">
          <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-snug">
            "{item.quote}"
          </blockquote>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border/40 text-sm">
            <div>
              <span className="font-semibold text-foreground">{item.author}</span>
              <span className="text-muted-foreground"> — {item.role}</span>
            </div>
            <div className="font-medium text-foreground text-xs uppercase tracking-wider bg-muted/80 px-3 py-1 rounded-full border border-border/40">
              {item.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ZoomThroughShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.22,
    restDelta: 0.0005,
  });

  return (
    <section
      ref={containerRef}
      className="relative h-[380vh] bg-gradient-to-b from-background via-muted/20 to-background"
    >
      {/* Pinned Sticky Stage */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-10 md:py-14"
        style={{ perspective: 1200 }}
      >
        {/* Clean section header */}
        <div className="container max-w-5xl z-20 text-center shrink-0">
          <SplitText
            text="Trusted by product builders"
            as="h2"
            className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          />
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Mainline is built on the habits that make high-velocity product teams successful.
          </p>
        </div>

        {/* 3D Perspective Zoom Stage */}
        <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center my-2">
          {testimonials.map((item, index) => (
            <ShowcaseCard
              key={item.author}
              item={item}
              index={index}
              total={testimonials.length}
              progress={smoothProgress}
            />
          ))}

          {/* Minimalist step dots on the right */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3.5 z-30">
            {testimonials.map((_, i) => (
              <StepIndicator key={i} index={i} total={testimonials.length} progress={smoothProgress} />
            ))}
          </div>
        </div>

        {/* Clean minimal footer spacer */}
        <div className="container max-w-5xl z-20 shrink-0 h-4" />
      </div>
    </section>
  );
}

function StepIndicator({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index === 0 ? 0 : (index - 0.35) / (total - 1);
  const peak = index / (total - 1);
  const end = index === total - 1 ? 1 : (index + 0.35) / (total - 1);

  const scaleY = useTransform(progress, [start, peak, end], [1, 2.4, 1]);
  const opacity = useTransform(progress, [start, peak, end], [0.28, 1, 0.28]);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        style={{ scaleY, opacity }}
        className="w-1.5 h-5 rounded-full bg-foreground origin-center"
      />
      <span className="font-mono text-[10px] text-muted-foreground/60">
        0{index + 1}
      </span>
    </div>
  );
}
