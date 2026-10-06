"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { OfficialTransitionSpinner } from "@/components/official-loader";

interface TransitionContext {
  title: string;
  steps: string[];
}

const PREPARATION_ROUTES: Record<string, TransitionContext> = {
  "/start-project": {
    title: "LevelUp Project Studio",
    steps: ["Configuring studio...", "Loading interactive environment...", "Opening Project Studio..."],
  },
  "/dashboard": {
    title: "Client Workspace",
    steps: ["Verifying authorization...", "Synchronizing live telemetry...", "Loading overview dashboard..."],
  },
  "/auth/sign-in": {
    title: "Client Authentication",
    steps: ["Securing handshake...", "Verifying credentials...", "Opening LevelStudio..."],
  },
  "/login": {
    title: "Client Authentication",
    steps: ["Securing handshake...", "Verifying credentials...", "Opening LevelStudio..."],
  },
  "/signup": {
    title: "New Account",
    steps: ["Allocating encrypted space...", "Provisioning workspace...", "Setting up dashboard..."],
  },
};

const DEFAULT_PREPARATION_CONTEXT: TransitionContext = {
  title: "Project Builder",
  steps: ["Configuring scope...", "Setting up requirements...", "Opening interactive canvas..."],
};

function getPreparationContext(path: string): TransitionContext | null {
  const normalized = path.split("?")[0].split("#")[0];
  if (PREPARATION_ROUTES[normalized]) {
    return PREPARATION_ROUTES[normalized];
  }
  for (const [key, ctx] of Object.entries(PREPARATION_ROUTES)) {
    if (normalized.startsWith(key + "/") || normalized === key) {
      return ctx;
    }
  }
  return null;
}

/**
 * Global Navigation Transition Provider:
 * Displays the official LevelUp 8-dot transition animation exclusively
 * when entering creative / preparation workflows (Start Project, Workspace, Dashboard).
 */
export function NavigationTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeContext, setActiveContext] = useState<TransitionContext>(DEFAULT_PREPARATION_CONTEXT);
  const [stepIndex, setStepIndex] = useState(0);
  const navigatingRef = useRef(false);

  // When pathname changes after navigation, dismiss smoothly after brief fade
  useEffect(() => {
    if (navigatingRef.current) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
        navigatingRef.current = false;
        setStepIndex(0);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsNavigating(false);
      setStepIndex(0);
    }
  }, [pathname]);

  // Dynamic status word cycling: advances at 450ms so user sees status change
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % activeContext.steps.length);
    }, 450);

    return () => clearInterval(interval);
  }, [isNavigating, activeContext]);

  // Intercept internal link clicks and give the animation guaranteed visibility
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      try {
        const target = (e.target as HTMLElement).closest("a");
        if (!target) return;

        const href = target.getAttribute("href");
        if (!href) return;

        // Ignore hash anchors, external links, mailto, tel, downloads, or blank targets
        if (
          href.startsWith("#") ||
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          target.getAttribute("target") === "_blank" ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }

        // Only trigger if destination is a creation or workspace preparation route
        const currentPath = window.location.pathname;
        const targetPath = href.split("?")[0].split("#")[0];

        const context = getPreparationContext(targetPath);
        if (!context || targetPath === currentPath) {
          // Standard page browsing: instantaneous Next.js navigation with no blocking overlay
          return;
        }

        e.preventDefault();
        navigatingRef.current = true;
        setActiveContext(context);
        setStepIndex(0);
        setIsNavigating(true);

          // Cycle to next step at 320ms
          setTimeout(() => {
            setStepIndex(1);
          }, 320);

          // Execute navigation after clear display duration (~680ms)
          setTimeout(() => {
            router.push(href);

            // Safety fallback if page load is fast or route is same
            setTimeout(() => {
              setIsNavigating(false);
              navigatingRef.current = false;
            }, 600);
          }, 680);
      } catch {
        // Fallback gracefully
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [router]);

  const currentStep = activeContext.steps[stepIndex] || activeContext.steps[0];

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          key="global-route-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 bg-background/60 backdrop-blur-md select-none pointer-events-auto"
        >
          {/* Refined Glass Capsule - Minimal, no pills, no flashing dot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-3.5 px-8 py-6 rounded-2xl bg-card/90 border border-border/75 shadow-2xl backdrop-blur-xl text-center min-w-[240px] max-w-xs"
          >
            {/* Official 8-Dot Pulse Animation */}
            <OfficialTransitionSpinner size={44} />

            {/* Clean, free, uncluttered typography - No pill, no border, no blinking dot */}
            <div className="space-y-0.5 select-none text-center">
              <h4 className="text-sm font-semibold tracking-tight text-foreground">
                {activeContext.title}
              </h4>
              <div className="h-5 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStep}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 0.75, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-xs text-muted-foreground font-mono"
                  >
                    {currentStep}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NavigationTransition;
