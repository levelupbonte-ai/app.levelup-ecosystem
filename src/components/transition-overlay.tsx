"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfficialTransitionSpinner } from "@/components/official-loader";

interface TransitionOverlayProps {
  isActive: boolean;
  title?: string;
  subtitle?: string;
  steps?: string[];
  onComplete?: () => void;
  targetUrl?: string;
  delayMs?: number;
}

/**
 * LevelUpTransitionOverlay:
 * Elegant backdrop blur overlay presenting the official 8-dot transition spinner
 * with clean, unboxed typography and calm waiting status words.
 */
export function LevelUpTransitionOverlay({
  isActive,
  title = "Starting project",
  subtitle = "Preparing workspace...",
  steps = ["Connecting...", "Loading intake...", "Almost ready..."],
  onComplete,
  targetUrl,
  delayMs = 1200,
}: TransitionOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);

    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (targetUrl) {
        window.location.href = targetUrl;
      }
    }, delayMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isActive, delayMs, onComplete, targetUrl, steps.length]);

  if (!isActive) return null;

  const currentStep = steps[stepIndex] || subtitle;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md select-none"
      >
        {/* Floating Luxury Glass Card - No pill, no blinking dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center gap-3.5 px-8 py-6 rounded-2xl bg-card/90 border border-border/75 shadow-2xl backdrop-blur-xl text-center min-w-[240px] max-w-xs"
        >
          {/* Official 8-Dot Pulse Animation */}
          <OfficialTransitionSpinner size={44} />

          {/* Clean, free, uncluttered typography */}
          <div className="space-y-0.5 select-none text-center">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {title}
            </h4>
            <div className="h-5 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 0.75, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="text-xs text-muted-foreground font-mono"
                >
                  {currentStep}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LevelUpTransitionOverlay;
