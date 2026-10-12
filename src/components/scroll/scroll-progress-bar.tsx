"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.1,
    restDelta: 0.0005,
  });

  if (pathname?.startsWith("/start-project")) {
    return null;
  }

  return (
    <motion.div
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-[120] h-[2px] origin-left bg-[linear-gradient(90deg,var(--sec-grad-a),var(--sec-grad-b))]"
    />
  );
}
