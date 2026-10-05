"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.1,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-neutral-300 via-neutral-900 to-neutral-500 dark:from-neutral-600 dark:via-white dark:to-neutral-400 shadow-xs pointer-events-none"
    />
  );
}
