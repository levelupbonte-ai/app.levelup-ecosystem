"use client";

import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<
    "travel" | "dissolve" | "shimmer" | "exit" | "done"
  >("travel");
  const textRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Mount on every page load & refresh
  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure exact text width on mount & resize
  useEffect(() => {
    if (!mounted) return;
    const updateWidth = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
    };
    updateWidth();
    const t = setTimeout(updateWidth, 120);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateWidth);
    };
  }, [mounted]);

  // Lock scroll while preloader is running
  useEffect(() => {
    if (phase !== "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Cinematic timeline: ~3.4s of smooth brand experience before curtain lifts
  useEffect(() => {
    if (!mounted) return;

    // 0s -> 1.8s: Star travels across the phrase
    const tDissolve = setTimeout(() => {
      setPhase("dissolve");
    }, 1800);

    // 2.3s: Star has dissolved, phrase shines with radiant light
    const tShimmer = setTimeout(() => {
      setPhase("shimmer");
    }, 2300);

    // 3.4s: Curtain lifts upward to reveal the fully loaded website
    const tExit = setTimeout(() => {
      setPhase("exit");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-ready"));
      }
    }, 3400);

    // 4.25s: Complete, unmount
    const tDone = setTimeout(() => {
      setPhase("done");
    }, 4250);

    return () => {
      clearTimeout(tDissolve);
      clearTimeout(tShimmer);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  // Generous spacing after the period so star never crowds the phrase
  const targetX = textWidth > 0 ? textWidth + 85 : 430;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="levelup-cinematic-preloader"
          initial={{ y: 0 }}
          animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1], // Apple-grade curtain lift
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#FAFAFD] dark:bg-[#0A0A10] text-zinc-900 dark:text-zinc-100 select-none overflow-hidden"
        >
          {/* Subtle faint violet ambient background aura */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06)_0%,transparent_70%)]" />

          {/* Top spacer */}
          <div className="h-12 sm:h-20 shrink-0" />

          {/* Central Phrase & Star Stage (Pure typography, clean single line) */}
          <div className="relative inline-flex items-center justify-start py-6 px-4">
            {/* The single straight phrase */}
            <h1
              ref={textRef}
              className={`relative text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight whitespace-nowrap font-sans select-none transition-colors duration-500 ${
                phase === "shimmer" || phase === "exit"
                  ? "text-transparent bg-clip-text bg-[linear-gradient(110deg,#18181b_35%,#9333ea_50%,#18181b_65%)] dark:bg-[linear-gradient(110deg,#ffffff_35%,#c084fc_50%,#ffffff_65%)] bg-[length:250%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"
                  : "text-zinc-900 dark:text-white"
              }`}
            >
              <motion.span
                className="inline-block whitespace-nowrap"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  duration: 1.75,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                Level up your online presence.
              </motion.span>
            </h1>

            {/* The Star: spins like a pin, passes once left-to-right, stops comfortably away from text, then dissolves */}
            <motion.div
              className="absolute pointer-events-none z-20 flex items-center justify-center"
              style={{ left: "-28px" }}
              initial={{
                x: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
              }}
              animate={
                phase === "travel"
                  ? {
                      x: [0, targetX],
                      rotate: [0, 1080],
                      scale: [0.95, 1.05, 1],
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {
                      // Dissolves smoothly like stardust with generous distance from the period
                      x: targetX,
                      rotate: 1350,
                      scale: [1, 0.35, 0],
                      opacity: [1, 0.5, 0],
                      filter: ["blur(0px)", "blur(6px)", "blur(14px)"],
                    }
              }
              transition={{
                duration: phase === "travel" ? 1.75 : 0.45,
                ease: phase === "travel" ? [0.25, 1, 0.5, 1] : "easeOut",
              }}
            >
              {/* Star graphic: 36px original clean style */}
              <div className="relative size-9 sm:size-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-violet-500/25 blur-sm" />
                <svg
                  viewBox="0 0 74 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  shapeRendering="geometricPrecision"
                  className="size-8 sm:size-9 shrink-0 drop-shadow-[0_2px_12px_rgba(147,51,234,0.45)]"
                  aria-hidden="true"
                >
                  <polygon points="37,37 37,3 46.11,24.46" fill="#A855F7" />
                  <polygon points="37,37 46.11,24.46 69.34,26.49" fill="#9333EA" />
                  <polygon points="37,37 69.34,26.49 51.74,41.79" fill="#7E22CE" />
                  <polygon points="37,37 51.74,41.79 56.98,64.51" fill="#6B21A8" />
                  <polygon points="37,37 56.98,64.51 37,52.5" fill="#581C87" />
                  <polygon points="37,37 37,52.5 17.02,64.51" fill="#6B21A8" />
                  <polygon points="37,37 17.02,64.51 22.26,41.79" fill="#7E22CE" />
                  <polygon points="37,37 22.26,41.79 4.66,26.49" fill="#9333EA" />
                  <polygon points="37,37 4.66,26.49 27.89,24.46" fill="#A855F7" />
                  <polygon points="37,37 27.89,24.46 37,3" fill="#C084FC" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Bottom Branding: Grand LevelUp Ecosystem watermark matching footer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.9, ease: "easeOut" }}
            className="w-full select-none pointer-events-none pb-0 mb-0 -mb-2 overflow-hidden"
          >
            <svg
              viewBox="0 0 1570 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto text-foreground/80 select-none pointer-events-none block"
            >
              {/* LevelUp */}
              <text
                x="50%"
                y="150"
                textAnchor="middle"
                fill="url(#preloader_paint_levelup)"
                className="font-display font-black select-none"
                style={{
                  fontSize: "205px",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
                }}
              >
                LevelUp
              </text>

              {/* Ecosystem - clean letter spacing so Y, S, and T never collide */}
              <text
                x="50%"
                y="390"
                textAnchor="middle"
                fill="url(#preloader_paint_ecosystem)"
                className="font-display font-black select-none"
                style={{
                  fontSize: "295px",
                  fontWeight: 900,
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
                }}
              >
                Ecosystem
              </text>
              <defs>
                <linearGradient
                  id="preloader_paint_levelup"
                  x1="785"
                  y1="10"
                  x2="785"
                  y2="155"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" stopOpacity="0.88" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.65" />
                </linearGradient>

                <linearGradient
                  id="preloader_paint_ecosystem"
                  x1="785"
                  y1="160"
                  x2="785"
                  y2="400"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" stopOpacity="0.65" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.38" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
