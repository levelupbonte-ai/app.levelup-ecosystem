"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";

type Panel = "brief" | "studio" | "dashboard";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    steps: { title: string; body: string; panel: Panel; tag: string }[];
    brief: { file: string; lines: [string, string][]; status: string };
    studio: { url: string; alt: string; status: string };
    dashboard: {
      url: string;
      nav: string[];
      heading: string;
      slots: { time: string; state: "ok" | "todo" }[];
      confirmed: string;
      toConfirm: string;
      status: string;
    };
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
    studio: {
      url: "studio.levelup-ecosystem.com",
      alt: "LevelStudio drafting a hair salon website with online booking from a one-line brief.",
      status: "Drafting your preview",
    },
    dashboard: {
      url: "dashboard.levelup-ecosystem.com",
      nav: [
        "Overview",
        "Appointments",
        "Waitlist",
        "Requests",
        "Services",
        "Reviews",
        "SEO",
      ],
      heading: "Appointments",
      slots: [
        { time: "09:00", state: "ok" },
        { time: "10:30", state: "todo" },
        { time: "13:00", state: "ok" },
        { time: "15:45", state: "todo" },
      ],
      confirmed: "Confirmed",
      toConfirm: "To confirm",
      status: "Live",
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
    studio: {
      url: "studio.levelup-ecosystem.com",
      alt: "LevelStudio prépare le site d’un salon de coiffure avec réservation en ligne à partir d’une phrase.",
      status: "Aperçu en préparation",
    },
    dashboard: {
      url: "dashboard.levelup-ecosystem.com",
      nav: [
        "Vue d’ensemble",
        "Rendez-vous",
        "File d’attente",
        "Demandes",
        "Services",
        "Avis",
        "SEO",
      ],
      heading: "Rendez-vous",
      slots: [
        { time: "09:00", state: "ok" },
        { time: "10:30", state: "todo" },
        { time: "13:00", state: "ok" },
        { time: "15:45", state: "todo" },
      ],
      confirmed: "Confirmé",
      toConfirm: "À confirmer",
      status: "En ligne",
    },
  },
};

const ROMAN = ["I", "II", "III"];

function WindowFrame({
  label,
  status,
  children,
}: {
  label: string;
  status: string;
  children: ReactNode;
}) {
  return (
    <div className="border-ink-foreground/12 bg-ink overflow-hidden border">
      <div className="border-ink-foreground/12 flex items-center justify-between gap-4 border-b px-5 py-3.5">
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="bg-ink-foreground/20 size-2.5 rounded-full"
            />
          ))}
        </div>
        <span className="font-label text-ink-foreground/45 truncate text-xs">
          {label}
        </span>
      </div>
      <div className="relative">{children}</div>
      <div className="border-ink-foreground/12 flex items-center gap-3 border-t px-5 py-3.5">
        <span
          aria-hidden="true"
          className="bg-brand-soft lu-loop size-2 rounded-full"
          style={{ animation: "lu-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-label text-ink-foreground/50 text-xs">
          {status}
        </span>
      </div>
    </div>
  );
}

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

function StudioPanel({
  t,
  locale,
}: {
  t: (typeof COPY)["en"]["studio"];
  locale: Locale;
}) {
  return (
    <WindowFrame label={t.url} status={t.status}>
      <div className="aspect-[16/11] overflow-hidden bg-[#0b0b0e]">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size capture, no optimizer */}
        <img
          src={`/home/studio-chat-${locale}-1040.webp`}
          width={1040}
          height={656}
          alt={t.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-left-top"
        />
      </div>
    </WindowFrame>
  );
}

function DashboardPanel({ t }: { t: (typeof COPY)["en"]["dashboard"] }) {
  return (
    <WindowFrame label={t.url} status={t.status}>
      <div
        className="grid aspect-[16/11] grid-cols-[38%_1fr] text-[12px] sm:grid-cols-[34%_1fr] sm:text-[13px]"
        role="img"
        aria-label={`${t.heading}: ${t.slots.map((s) => `${s.time} ${s.state === "ok" ? t.confirmed : t.toConfirm}`).join(", ")}`}
      >
        <ul
          className="border-ink-foreground/12 space-y-1 border-r p-3 sm:p-4"
          aria-hidden="true"
        >
          {t.nav.map((item, i) => (
            <li
              key={item}
              className={cn(
                "truncate rounded-md px-2.5 py-1.5",
                i === 1
                  ? "bg-ink-foreground/10 text-ink-foreground"
                  : "text-ink-foreground/45",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="p-4 sm:p-6" aria-hidden="true">
          <p className="text-ink-foreground text-base tracking-tight sm:text-lg">
            {t.heading}
          </p>
          <div className="bg-ink-foreground/10 mt-2 h-1.5 w-24 rounded-full" />
          <ul className="mt-5 space-y-2.5">
            {t.slots.map((slot, i) => (
              <li
                key={slot.time}
                className="border-ink-foreground/10 flex items-center gap-3 rounded-md border px-3 py-2.5"
              >
                <span className="font-label text-ink-foreground/60 w-11 shrink-0">
                  {slot.time}
                </span>
                <span
                  className="bg-ink-foreground/15 h-1.5 rounded-full"
                  style={{ width: `${34 + ((i * 17) % 30)}%` }}
                />
                <span
                  className={cn(
                    "font-label ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px]",
                    slot.state === "ok"
                      ? "bg-brand/25 text-brand-soft"
                      : "border-ink-foreground/20 text-ink-foreground/60 border",
                  )}
                >
                  {slot.state === "ok" ? t.confirmed : t.toConfirm}
                </span>
              </li>
            ))}
          </ul>
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

  const renderPanel = (panel: Panel, isActive: boolean) =>
    panel === "brief" ? (
      <BriefPanel t={t.brief} active={isActive} />
    ) : panel === "studio" ? (
      <StudioPanel t={t.studio} locale={locale} />
    ) : (
      <DashboardPanel t={t.dashboard} />
    );

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="font-editorial bg-ink text-ink-foreground relative overflow-clip py-24 lg:py-36 dark:border-y dark:border-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <Reveal className="mb-14 lg:mb-20">
          <Eyebrow tone="inverted" className="mb-6">
            {t.eyebrow}
          </Eyebrow>
          <h2
            id="how-title"
            className="font-editorial text-ink-foreground text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
          >
            {t.title}
            <br />
            <span className="text-ink-foreground/50">{t.titleMuted}</span>
          </h2>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <ol className="min-w-0">
            {t.steps.map((step, i) => (
              <li key={step.title}>
                <div
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-step={i}
                  className={cn(
                    "border-ink-foreground/12 border-b py-10 transition-opacity duration-500 lg:flex lg:min-h-[62vh] lg:items-center lg:py-12",
                    i === 0 && "border-t",
                    active === i ? "lg:opacity-100" : "lg:opacity-35",
                  )}
                >
                  <div className="flex w-full items-start gap-6">
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
                        {renderPanel(step.panel, true)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop: one sticky panel that follows the active step. */}
          <div className="hidden min-w-0 lg:block">
            <div className="sticky top-[calc(50vh-15rem)]">
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
                    {renderPanel(step.panel, active === i)}
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
