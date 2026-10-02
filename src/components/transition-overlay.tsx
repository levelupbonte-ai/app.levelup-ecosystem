"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogoStar } from "@/components/logo";
import { cn } from "@/lib/utils";

interface TransitionOverlayProps {
  isActive: boolean;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  targetUrl?: string;
  delayMs?: number;
  className?: string;
}

/**
 * 8-Dot Circular Pulse Spinner:
 * Faithfully mirrors the luxury loading-14 pulse animation provided by the user.
 */
function CircularPulseDots({ className }: { className?: string }) {
  // 8 dots arranged at 45 degree intervals
  const dots = [
    { x: 0, y: -22, delay: 0 },
    { x: 15.5, y: -15.5, delay: 0.125 },
    { x: 22, y: 0, delay: 0.25 },
    { x: 15.5, y: 15.5, delay: 0.375 },
    { x: 0, y: 22, delay: 0.5 },
    { x: -15.5, y: 15.5, delay: 0.625 },
    { x: -22, y: 0, delay: 0.75 },
    { x: -15.5, y: -15.5, delay: 0.875 },
  ];

  return (
    <div className={cn("relative size-16 flex items-center justify-center select-none", className)}>
      {/* Center glowing LevelUp star */}
      <motion.div
        animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex items-center justify-center"
      >
        <LogoStar iconClassName="size-6" />
      </motion.div>

      {/* 8 pulsing dots */}
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          className="absolute size-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
          style={{
            transform: `translate(${dot.x}px, ${dot.y}px)`,
          }}
          animate={{
            scale: [0.65, 1.25, 0.65],
            opacity: [0.25, 1, 0.25],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * LevelUpTransitionOverlay:
 * Elegant backdrop blur overlay keeping the site visible in the background,
 * presenting a refined floating card with the LevelUp circular loading animation.
 */
export function LevelUpTransitionOverlay({
  isActive,
  title = "Redirecting...",
  subtitle = "Loading your workspace",
  onComplete,
  targetUrl,
  delayMs = 1100,
}: TransitionOverlayProps) {
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (targetUrl) {
        window.location.href = targetUrl;
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isActive, delayMs, onComplete, targetUrl]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-background/50 backdrop-blur-md select-none"
      >
        {/* Floating Luxury Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center gap-4 px-8 py-7 rounded-2xl bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl text-center max-w-xs w-full ring-1 ring-violet-500/20"
        >
          {/* Circular 8-Dot Pulse Animation */}
          <CircularPulseDots />

          {/* Texts */}
          <div className="space-y-1">
            <h4 className="text-base font-bold tracking-tight text-foreground">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground font-medium">
              {subtitle}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LevelUpTransitionOverlay;
