"use client";

import React, { useRef } from "react";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  once?: boolean;
}

/**
 * Ultra-fluid reveal animation as user scrolls down the page.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  yOffset = 32,
  xOffset = 0,
  scale = 0.98,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        scale,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Signature ultra-fluid Apple curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

/**
 * Staggers children components progressively as the container scrolls into view.
 */
export function ScrollStagger({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: ScrollStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollStaggerItem({
  children,
  className,
  yOffset = 24,
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Interactive 3D Perspective Scroll Card (like Linear / Apple hero showcases)
 * As the user scrolls, the mockup smoothly levels out from a 3D tilted plane.
 */
export function ScrollPerspectiveCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [14, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const y = useTransform(smoothProgress, [0, 1], [50, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 1], [0.4, 0.85, 1]);

  return (
    <div ref={ref} style={{ perspective: 1200 }} className={className}>
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Parallax floating layer tied directly to scroll progress
 */
export function ScrollParallaxLayer({
  children,
  className,
  speed = 40,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number; // pixels to travel
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}
