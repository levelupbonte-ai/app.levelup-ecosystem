"use client";

import React from "react";

import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  once?: boolean;
  waitPreloader?: boolean;
}

/**
 * SplitText Typography Reveal:
 * Words emerge from an invisible overflow mask with high-precision physics.
 * Can synchronize with the preloader curtain lift for the hero headline.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.75,
  as: Component = "h1",
  once = true,
}: SplitTextProps) {
  const isReady = true;
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotateX: 45,
      filter: "blur(4px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component className={cn("inline-block", className)}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
        style={{ perspective: 1000 }}
        initial="hidden"
        animate={waitPreloader ? (isReady ? "visible" : "hidden") : undefined}
        whileInView={!waitPreloader ? "visible" : undefined}
        viewport={!waitPreloader ? { once, margin: "-40px" } : undefined}
        variants={containerVariants}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-1 pt-0.5 leading-tight"
          >
            <motion.span
              variants={wordVariants}
              className="inline-block origin-bottom transform-gpu"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
