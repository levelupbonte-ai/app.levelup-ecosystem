"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { LazyDashboardDemo, LazyStudioDemo } from "./live-demo/lazy-demo";
import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { Reveal } from "./reveal";
import { WindowFrame } from "./window-frame";

type Panel = "brief" | "studio" | "dashboard";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    steps: { title: string; body: string; panel: Panel; tag: string }[];
    brief: { file: string; lines: [string, string][]; status: string };
  }
> = {
  en: {
    eyebrow: "How it works",
    title: "Three steps.",
    titleMuted: "One place to run it all.",
    steps: [
      {
        title: "We build your site",
        body: "Tell us about your business. We design and build a site around it: your services, your booking flow, your brand.",
        panel: "brief",
        tag: "Build",
      },
      {
        title: "Preview it in LevelStudio",
        body: "See a free, interactive draft before you commit. Answer a few sharp questions and watch it take shape.",
        panel: "studio",
        tag: "Preview",
      },
      {
        title: "Manage it from your dashboard",
        body: "Once you are live, bookings, requests, services, reviews and SEO all live in one dashboard.",
        panel: "dashboard",
        tag: "Manage",
      },
    ],
    brief: {
      file: "brief.txt",
      lines: [
        ["project", "your business"],
        ["pages", "home · services · book · contact"],
        ["booking", "online, 24/7"],
        ["google", "maps + local seo"],
        ["security", "https · monitoring"],
        ["preview", "free, before you commit"],
      ],
      status: "Ready to build",
    },
  },
  fr: {
    eyebrow: "Comment ça marche",
    title: "Trois étapes.",
    titleMuted: "Un seul endroit pour tout gérer.",
    steps: [
      {
        title: "Nous créons votre site",
        body: "Parlez-nous de votre activité. Nous concevons un site autour d’elle : vos services, votre parcours de réservation, votre marque.",
        panel: "brief",
        tag: "Créer",
      },
      {
        title: "Prévisualisez-le dans LevelStudio",
        body: "Découvrez un brouillon interactif gratuit avant de vous engager. Répondez à quelques questions précises et regardez-le prendre forme.",
        panel: "studio",
        tag: "Prévisualiser",
      },
      {
        title: "Gérez-le depuis votre tableau de bord",
        body: "Une fois en ligne, réservations, demandes, services, avis et SEO sont réunis dans un seul tableau de bord.",
        panel: "dashboard",
        tag: "Gérer",
      },
    ],
    brief: {
      file: "brief.txt",
      lines: [
        ["projet", "votre activité"],
        ["pages", "accueil · services · réserver · contact"],
        ["réservation", "en ligne, 24h/24"],
        ["google", "maps + seo local"],
        ["sécurité", "https · surveillance"],
        ["aperçu", "gratuit, avant engagement"],
      ],
      status: "Prêt à construire",
    },
  },
};

const ROMAN = ["I", "II", "III"];

function BriefPanel({
  t,
  active,
}: {
  t: (typeof COPY)["en"]["brief"];
  active: boolean;
}) {
  return (
    <WindowFrame label={t.file} status={t.status}>
      <div className="font-label aspect-[16/11] p-6 text-[13px] leading-[2.1] sm:p-8 sm:text-sm">
        {t.lines.map(([key, value], line) => (
          <div
            key={`${key}-${active}`}
            className="flex gap-4"
            style={
              active
                ? {
                    animation: `lu-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${line * 90}ms both`,
                  }
                : undefined
            }
          >
            <span className="text-ink-foreground/25 w-5 shrink-0 select-none">
              {line + 1}
            </span>
            <span className="text-brand-soft w-24 shrink-0 sm:w-28">{key}</span>
            <span className="text-ink-foreground/80 min-w-0">{value}</span>
          </div>
        ))}
        <div className="flex gap-4" aria-hidden="true">
          <span className="text-ink-foreground/25 w-5 shrink-0 select-none">
            {t.lines.length + 1}
          </span>
          <span
            className="bg-brand-soft lu-loop mt-[0.55em] block h-[1.1em] w-2"
            style={{ animation: "lu-pulse 1.1s steps(2, jump-none) infinite" }}
          />
        </div>
      </div>
    </WindowFrame>
  );
}

export function HowItWorks() {
  const locale = useLocale();
  const t = COPY[locale];
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wide, setWide] = useState(false);

  // Desktop: the demos are scrubbed by the scroll through their step (the
  // panel is sticky). Elsewhere each demo is scrubbed by its own travel
  // through the viewport (`"self"`).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stepProgress = useCallback((i: number) => {
    const el = stepRefs.current[i];
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the step reaches the activation band (50% of the viewport),
    // 1 when it has just left it (45%): the whole step is the timeline.
    return (0.5 * vh - r.top) / (0.05 * vh + r.height);
  }, []);
  const scrubs = useMemo(
    () => [0, 1, 2].map((i) => () => stepProgress(i)),
    [stepProgress],
  );

  // The step crossing the middle of the viewport drives the sticky panel.
  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.step);
            setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const renderPanel = (
    panel: Panel,
    isActive: boolean,
    scrub: "self" | (() => number),
  ) =>
    panel === "brief" ? (
      <BriefPanel t={t.brief} active={isActive} />
    ) : panel === "studio" ? (
      <LazyStudioDemo active={isActive} scrub={scrub} />
    ) : (
      <LazyDashboardDemo active={isActive} scrub={scrub} />
    );

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="font-editorial text-ink-foreground relative isolate overflow-clip py-24 lg:py-36"
    >
      {/* The ink panel opens as the section arrives and closes as it leaves
          (a scroll-driven clip-path on this layer, docs/motion.md). */}
      <div
        aria-hidden="true"
        data-sheet=""
        className="bg-ink pointer-events-none absolute inset-0 -z-10 dark:border-y dark:border-white/10"
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="mb-14 lg:mb-20">
          <Reveal>
            <Eyebrow tone="inverted" className="mb-6">
              {t.eyebrow}
            </Eyebrow>
          </Reveal>
          <LensText
            as="h2"
            tone="inverted"
            motion="words"
            id="how-title"
            className="font-editorial text-ink-foreground text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
          >
            {t.title}
            <br />
            <span className="text-ink-foreground/50">{t.titleMuted}</span>
          </LensText>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <ol className="min-w-0">
            {t.steps.map((step, i) => (
              <li key={step.panel}>
                <div
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-step={i}
                  className={cn(
                    "border-ink-foreground/12 border-b py-10 transition-opacity duration-500 lg:flex lg:items-center lg:py-12",
                    // The live demos are scrubbed by scrolling through their step.
                    i === 0 ? "lg:min-h-[62svh]" : "lg:min-h-[115svh]",
                    i === 0 && "border-t",
                    active === i ? "lg:opacity-100" : "lg:opacity-35",
                  )}
                >
                  <div className="flex w-full items-start gap-6" data-m="up">
                    <span className="font-editorial text-ink-foreground/30 hidden w-12 shrink-0 text-3xl sm:block">
                      {ROMAN[i]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-label text-brand-soft text-xs">
                        {String(i + 1).padStart(2, "0")} / {step.tag}
                      </span>
                      <h3 className="font-editorial text-ink-foreground mt-3 text-[1.75rem] leading-[1.1] font-normal tracking-[-0.03em] lg:text-[2.25rem]">
                        {step.title}
                      </h3>
                      <p className="text-ink-foreground/60 mt-4 max-w-md text-lg leading-relaxed">
                        {step.body}
                      </p>
                      <div
                        aria-hidden="true"
                        className="bg-ink-foreground/12 mt-6 hidden h-px max-w-md overflow-hidden lg:block"
                      >
                        <div
                          className={cn(
                            "bg-brand-soft h-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            active === i ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </div>
                      {/* Phones and tablets: the panel sits under its step. */}
                      <div className="mt-8 lg:hidden">
                        {renderPanel(step.panel, true, "self")}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop: one sticky panel that follows the active step. */}
          <div className="hidden min-w-0 lg:block">
            <div className="sticky top-[calc(50svh-15rem)]">
              <div className="relative">
                {t.steps.map((step, i) => (
                  <div
                    key={step.panel}
                    aria-hidden={active !== i}
                    className={cn(
                      "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === 0 ? "relative" : "absolute inset-0",
                      active === i
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0",
                    )}
                  >
                    {renderPanel(step.panel, active === i, wide ? scrubs[i] : "self")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
