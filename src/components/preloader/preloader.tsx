"use client";

import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

const PRELOADER_SEEN_KEY = "levelup_preloader_intro_seen_v4";
const LAST_ACTIVE_KEY = "levelup_last_active_timestamp_v4";

interface PreloaderProps {
  forcePlay?: boolean;
  onComplete?: () => void;
}

export function Preloader({ forcePlay = false, onComplete }: PreloaderProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [phase, setPhase] = useState<
    "travel" | "dissolve" | "shimmer" | "exit" | "done"
  >("travel");
  const textRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check sessionStorage on mount so the user experiences the intro in every session
  useEffect(() => {
    setMounted(true);
    if (forcePlay) {
      setShouldPlay(true);
      setPhase("travel");
      return;
    }

    try {
      // Clear legacy blocking localStorage if present
      localStorage.removeItem("levelup_preloader_intro_seen_v3");
      localStorage.removeItem("levelup_preloader_intro_seen_v2");
      localStorage.removeItem("levelup_preloader_intro_seen");

      const hasSeenSession = sessionStorage.getItem(PRELOADER_SEEN_KEY);
      const urlHasIntro = typeof window !== "undefined" && window.location.search.includes("intro");

      if (hasSeenSession === "true" && !urlHasIntro) {
        setShouldPlay(false);
        setPhase("done");
        if (typeof window !== "undefined") {
          (window as unknown as { __site_ready?: boolean }).__site_ready = true;
          window.dispatchEvent(new CustomEvent("site-ready"));
        }
      } else {
        sessionStorage.setItem(PRELOADER_SEEN_KEY, "true");
        setShouldPlay(true);
        setPhase("travel");
      }
    } catch {
      setShouldPlay(true);
      setPhase("travel");
    }
  }, [forcePlay]);

  // Track when user leaves or closes tab to calculate absence on return
  useEffect(() => {
    const updateActive = () => {
      try {
        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      } catch {
        // Ignore
      }
    };

    window.addEventListener("beforeunload", updateActive);
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        updateActive();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", updateActive);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Measure exact text width on mount & resize
  useEffect(() => {
    if (!mounted || !shouldPlay) return;
    const updateMetrics = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 640);
    };

    updateMetrics();
    const t1 = setTimeout(updateMetrics, 40);
    const t2 = setTimeout(updateMetrics, 120);
    window.addEventListener("resize", updateMetrics);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [mounted, shouldPlay]);

  // Lock scroll while preloader is running, unlock immediately on exit
  useEffect(() => {
    if (!shouldPlay) return;

    if (phase !== "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldPlay, phase]);

  // Cinematic timeline
  useEffect(() => {
    if (!mounted || !shouldPlay) return;

    // 0s -> 1.1s: Star travels across the phrase
    const tDissolve = setTimeout(() => {
      setPhase("dissolve");
    }, 1100);

    // 1.35s: Star dissolves cleanly, phrase shimmers with light
    const tShimmer = setTimeout(() => {
      setPhase("shimmer");
    }, 1350);

    // 1.85s: Curtain lifts upward to reveal the website
    const tExit = setTimeout(() => {
      setPhase("exit");
      if (typeof window !== "undefined") {
        (window as unknown as { __site_ready?: boolean }).__site_ready = true;
        window.dispatchEvent(new CustomEvent("site-ready"));
        window.dispatchEvent(new Event("scroll"));
        window.dispatchEvent(new Event("resize"));
      }
      if (onComplete) {
        onComplete();
      }
    }, 1850);

    // 2.45s: Complete, unmount
    const tDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-ready"));
        window.dispatchEvent(new Event("scroll"));
        window.dispatchEvent(new Event("resize"));
      }
    }, 2450);

    return () => {
      clearTimeout(tDissolve);
      clearTimeout(tShimmer);
      clearTimeout(tExit);
      clearTimeout(tDone);
      document.body.style.overflow = "";
    };
  }, [mounted, shouldPlay, onComplete]);

  if (!mounted || !shouldPlay || phase === "done") {
    return null;
  }

  // Positioning: tightly bound to the phrase so star NEVER wanders into screen corners
  const startOffset = isMobile ? 18 : 28;
  const gap = isMobile ? 6 : 12;
  const rawTarget =
    textWidth > 0 ? startOffset + textWidth + gap : isMobile ? 220 : 380;
  const targetX =
    textWidth > 0 ? Math.min(rawTarget, startOffset + textWidth + gap) : rawTarget;

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

          {/* Central Phrase & Star Stage: Perfectly centered on mobile and desktop */}
          <div className="relative flex items-center justify-center py-6 px-4 max-w-[94vw] mx-auto">
            <div className="relative inline-flex items-center">
              {/* The single straight phrase */}
              <h1
                ref={textRef}
                className={`relative text-[16px] sm:text-2xl md:text-3xl font-semibold tracking-tight whitespace-nowrap font-sans select-none transition-colors duration-500 ${
                  phase === "shimmer" || phase === "exit"
                    ? "text-transparent bg-clip-text bg-[linear-gradient(110deg,#18181b_35%,#9333ea_50%,#18181b_65%)] dark:bg-[linear-gradient(110deg,#ffffff_35%,#c084fc_50%,#ffffff_65%)] bg-[length:250%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"
                    : "text-zinc-900 dark:text-white"
                }`}
              >
                {/* Smooth progressive gradient mask reveal */}
                <motion.span
                  className="inline-block whitespace-nowrap"
                  style={{
                    WebkitMaskImage:
                      phase === "shimmer" || phase === "exit"
                        ? "none"
                        : "linear-gradient(to right, #000 0%, #000 calc(50% - 28px), rgba(0,0,0,0.5) calc(50% - 8px), transparent 50%, transparent 100%)",
                    maskImage:
                      phase === "shimmer" || phase === "exit"
                        ? "none"
                        : "linear-gradient(to right, #000 0%, #000 calc(50% - 28px), rgba(0,0,0,0.5) calc(50% - 8px), transparent 50%, transparent 100%)",
                    WebkitMaskSize: "200% 100%",
                    maskSize: "200% 100%",
                  }}
                  initial={{
                    maskPosition: "100% 0%",
                  }}
                  animate={{
                    maskPosition: "0% 0%",
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  LevelUp your online presence.
                </motion.span>
              </h1>

              {/* The Star: spins cleanly across phrase with soft leading gradient beam */}
              <motion.div
                className="absolute pointer-events-none z-20 flex items-center justify-center top-1/2 -translate-y-1/2"
                style={{ left: `-${startOffset}px` }}
                initial={{
                  x: 0,
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                }}
                animate={
                  phase === "travel"
                    ? {
                        x: [0, targetX],
                        rotate: [0, 1080],
                        scale: [0.95, 1.05, 1],
                        opacity: 1,
                      }
                    : {
                        x: targetX,
                        rotate: 1350,
                        scale: [1, 0.35, 0],
                        opacity: [1, 0.5, 0],
                      }
                }
                transition={{
                  duration: phase === "travel" ? 1.1 : 0.4,
                  ease: phase === "travel" ? [0.25, 1, 0.5, 1] : "easeOut",
                }}
              >
                {/* Star container */}
                <div className="relative size-6 sm:size-8 md:size-9 flex items-center justify-center">
                  <svg
                    viewBox="0 0 74 74"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                    className="size-6 sm:size-8 md:size-9 shrink-0 relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
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
          </div>

          {/* Bottom Branding: Crisp, clear LevelUp Ecosystem watermark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}
            className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-4 select-none pointer-events-none pb-0 mb-0 -mb-2 overflow-hidden opacity-80 dark:opacity-85"
          >
            <svg
              viewBox="0 0 1000 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto text-foreground select-none pointer-events-none block"
            >
              {/* LevelUp */}
              <text
                x="50%"
                y="85"
                textAnchor="middle"
                fill="url(#preloader_paint_levelup)"
                className="font-display font-black select-none"
                style={{
                  fontSize: "100px",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
                }}
              >
                LevelUp
              </text>

              {/* Ecosystem */}
              <text
                x="50%"
                y="198"
                textAnchor="middle"
                fill="url(#preloader_paint_ecosystem)"
                className="font-display font-black select-none"
                style={{
                  fontSize: "135px",
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
                  x1="500"
                  y1="10"
                  x2="500"
                  y2="90"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" stopOpacity="0.85" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
                </linearGradient>

                <linearGradient
                  id="preloader_paint_ecosystem"
                  x1="500"
                  y1="95"
                  x2="500"
                  y2="205"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="currentColor" stopOpacity="0.55" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.25" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
