"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-60 h-[2.5px] origin-left bg-gradient-to-r from-neutral-400 via-neutral-900 to-neutral-500 shadow-xs pointer-events-none"
    />
  );
}
