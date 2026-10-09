"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { cn } from "@/lib/utils";

const ORBIT_STORAGE_KEY = "levelup_has_seen_orbit_scroll";

// 8 prominent integrations with real SVGs from /public/logos
const integrations = [
  { name: "Google Calendar", src: "/logos/calendar.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "WhatsApp", src: "/logos/whatsapp.svg" },
  { name: "Google Maps", src: "/logos/maps.svg" },
  { name: "Gmail", src: "/logos/gmail.svg" },
  { name: "Google Analytics", src: "/logos/analytics.svg" },
  { name: "Cloudflare", src: "/logos/cloudflare-icon.svg" },
  { name: "GitHub", src: "/logos/github-icon.svg" },
];

export function IntegrationsOrbit({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasSeenOrbit, setHasSeenOrbit] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(ORBIT_STORAGE_KEY);
      if (seen === "true") {
        setHasSeenOrbit(true);
      }
    } catch {
      // Fallback
    }
    setMounted(true);
  }, []);

  // Framer Motion scroll progress across the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track progress to mark as seen once fully assembled
  useEffect(() => {
    if (hasSeenOrbit) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.88) {
        try {
          sessionStorage.setItem(ORBIT_STORAGE_KEY, "true");
        } catch {
          // Ignore
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, hasSeenOrbit]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative",
        // If already seen, normal compact section height. If not seen yet, tall pinned container (230vh)
        hasSeenOrbit ? "py-12 sm:py-16 lg:py-24" : "h-[230vh]",
        className,
      )}
    >
      <div
        className={cn(
          "w-full transition-all duration-300",
          !hasSeenOrbit && "sticky top-12 sm:top-16 lg:top-20 z-30 pt-4 pb-8",
        )}
      >
        <div className="container max-w-6xl px-4 sm:px-6">
          <ScrollReveal yOffset={20} duration={0.6}>
            {/* Main Card with Topographic Contour Background */}
            <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-amber-900/10 dark:border-zinc-800 bg-[#F4EFE6] dark:bg-[#151412] p-6 sm:p-10 lg:p-14 shadow-2xl transition-all">
              {/* Topographic Contour Lines SVG Background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 select-none overflow-hidden"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 1200 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-cover scale-110"
                >
                  <path
                    d="M-50,150 C200,80 350,280 600,200 C850,120 1000,320 1250,220"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-amber-800/30 dark:text-zinc-600/40"
                  />
                  <path
                    d="M-50,220 C180,140 380,350 630,260 C880,170 1020,380 1250,290"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-amber-800/30 dark:text-zinc-600/40"
                  />
                  <path
                    d="M-50,290 C220,200 420,420 680,330 C940,240 1050,450 1250,370"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-amber-800/30 dark:text-zinc-600/40"
                  />
                  <path
                    d="M-50,360 C240,270 450,490 710,400 C970,310 1080,510 1250,430"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-amber-800/30 dark:text-zinc-600/40"
                  />
                  <circle
                    cx="880"
                    cy="300"
                    r="240"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    className="text-amber-800/20 dark:text-zinc-600/20"
                  />
                </svg>
              </div>

              {/* Inner Content Grid */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Headlines & CTA buttons */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  {/* Step status badge when scrolling */}
                  {!hasSeenOrbit && mounted && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/10 dark:bg-zinc-800 border border-amber-900/15 dark:border-zinc-700 text-xs font-medium text-amber-900 dark:text-amber-200">
                      <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                      <span>Scroll to build your ecosystem</span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100 leading-[1.12]">
                    Connect over 70+ integrations.
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md">
                    Integrate your favourite tools to keep every project moving in sync.
                    From automated booking calendars and payment checkouts to Google Maps and instant notifications.
                  </p>

                  {/* Two Pill CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md group"
                    >
                      <span>View</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-900/25 dark:border-white/30 text-zinc-900 dark:text-zinc-100 font-semibold text-sm hover:bg-zinc-900/5 dark:hover:bg-white/5 active:scale-95 transition-all group"
                    >
                      <span>Integrations</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Scroll-Driven Orbit Assembly */}
                <div className="lg:col-span-6 flex items-center justify-center py-4">
                  <OrbitStage
                    scrollYProgress={scrollYProgress}
                    hasSeenOrbit={hasSeenOrbit}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

interface OrbitStageProps {
  scrollYProgress: MotionValue<number>;
  hasSeenOrbit: boolean;
}

function OrbitStage({ scrollYProgress, hasSeenOrbit }: OrbitStageProps) {
  return (
    <div className="relative size-[290px] sm:size-[350px] md:size-[380px] flex items-center justify-center">
      {/* Concentric outer dashed orbit path */}
      <div className="absolute inset-4 sm:inset-6 rounded-full border border-dashed border-amber-900/25 dark:border-zinc-700/60 pointer-events-none" />

      {/* Central Glowing White Hub with LevelUp Star */}
      <div className="relative z-20 flex items-center justify-center">
        <div className="size-26 sm:size-32 md:size-36 rounded-full bg-white dark:bg-zinc-900/95 shadow-[0_16px_45px_rgba(0,0,0,0.12)] border border-white/80 dark:border-zinc-800 flex items-center justify-center p-3">
          <div className="size-18 sm:size-22 md:size-24 rounded-full bg-[#FAF7F2] dark:bg-zinc-800/80 shadow-inner flex items-center justify-center">
            {/* Center Star with softened intensity */}
            <svg
              viewBox="0 0 74 74"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
              className="size-9 sm:size-11 shrink-0 opacity-90 transition-transform duration-500"
              aria-label="LevelUp Emblem"
            >
              <polygon points="37,37 37,3 46.11,24.46" fill="#A78BFA" />
              <polygon points="37,37 46.11,24.46 69.34,26.49" fill="#8B5CF6" />
              <polygon points="37,37 69.34,26.49 51.74,41.79" fill="#7C3AED" />
              <polygon points="37,37 51.74,41.79 56.98,64.51" fill="#6D28D9" />
              <polygon points="37,37 56.98,64.51 37,52.5" fill="#5B21B6" />
              <polygon points="37,37 37,52.5 17.02,64.51" fill="#6D28D9" />
              <polygon points="37,37 17.02,64.51 22.26,41.79" fill="#7C3AED" />
              <polygon points="37,37 22.26,41.79 4.66,26.49" fill="#8B5CF6" />
              <polygon points="37,37 4.66,26.49 27.89,24.46" fill="#A78BFA" />
              <polygon points="37,37 27.89,24.46 37,3" fill="#C4B5FD" />
            </svg>
          </div>
        </div>
      </div>

      {/* Orbit Container */}
      <OrbitRing
        scrollYProgress={scrollYProgress}
        hasSeenOrbit={hasSeenOrbit}
      />
    </div>
  );
}

function OrbitRing({ scrollYProgress, hasSeenOrbit }: OrbitStageProps) {
  // If already seen, run continuous rotation immediately
  // If in scroll mode, start spin once progress reaches 0.85
  const spinRotation = useTransform(
    scrollYProgress,
    [0.85, 1],
    [0, 180],
  );

  return (
    <motion.div
      className="absolute inset-0"
      animate={
        hasSeenOrbit
          ? { rotate: 360 }
          : undefined
      }
      style={
        !hasSeenOrbit
          ? { rotate: spinRotation }
          : undefined
      }
      transition={
        hasSeenOrbit
          ? {
              repeat: Infinity,
              duration: 52,
              ease: "linear",
            }
          : undefined
      }
    >
      {integrations.map((item, index) => {
        return (
          <OrbitItem
            key={item.name}
            item={item}
            index={index}
            total={integrations.length}
            scrollYProgress={scrollYProgress}
            hasSeenOrbit={hasSeenOrbit}
          />
        );
      })}
    </motion.div>
  );
}

interface OrbitItemProps {
  item: (typeof integrations)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  hasSeenOrbit: boolean;
}

function OrbitItem({
  item,
  index,
  total,
  scrollYProgress,
  hasSeenOrbit,
}: OrbitItemProps) {
  const angle = (index * (360 / total) * Math.PI) / 180;
  const radiusPercent = 42;
  const x = 50 + radiusPercent * Math.cos(angle);
  const y = 50 + radiusPercent * Math.sin(angle);

  // Progressive scroll thresholds for each of the 8 icons:
  // Starts appearing after 0.10, evenly staggered until 0.80
  const startThreshold = 0.10 + (index / total) * 0.70;
  const finishThreshold = Math.min(startThreshold + 0.08, 0.85);

  const scale = useTransform(
    scrollYProgress,
    [startThreshold, finishThreshold],
    hasSeenOrbit ? [1, 1] : [0, 1],
  );

  const opacity = useTransform(
    scrollYProgress,
    [startThreshold, finishThreshold],
    hasSeenOrbit ? [1, 1] : [0, 1],
  );

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <motion.div
        style={
          !hasSeenOrbit
            ? { scale, opacity }
            : undefined
        }
        initial={hasSeenOrbit ? { scale: 1, opacity: 1 } : false}
        className="group"
      >
        {/* Counter-rotation to keep logo upright */}
        <motion.div
          animate={
            hasSeenOrbit
              ? { rotate: -360 }
              : undefined
          }
          transition={
            hasSeenOrbit
              ? {
                  repeat: Infinity,
                  duration: 52,
                  ease: "linear",
                }
              : undefined
          }
          className="size-11 sm:size-13 md:size-14 rounded-full bg-white dark:bg-zinc-800 shadow-[0_6px_20px_rgba(0,0,0,0.1)] border border-amber-900/10 dark:border-zinc-700/80 flex items-center justify-center p-2.5 transition-transform duration-300 hover:scale-115 cursor-pointer"
        >
          <Image
            src={item.src}
            alt={item.name}
            width={28}
            height={28}
            className="size-5 sm:size-6 object-contain pointer-events-none"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default IntegrationsOrbit;
