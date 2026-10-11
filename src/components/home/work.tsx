"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { DeviceMockup } from "./device-mockup";
import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { LiveRegion, Reveal } from "./reveal";

/** What the server passes for each case (title/link may come from the database). */
export interface WorkCase {
  id: "final-stop" | "blackpater";
  title: string;
  href: string;
}

const CASE_COPY: Record<
  WorkCase["id"],
  {
    domain: string;
    desktop: string;
    mobile: string;
    copy: Record<
      Locale,
      { label: string; body: string; tags: string[]; alt: string }
    >;
  }
> = {
  "final-stop": {
    domain: "finalstop.org",
    desktop: "/home/finalstop-desktop",
    mobile: "/home/finalstop-mobile-long.webp",
    copy: {
      en: {
        label: "Barbershop · San Diego, CA",
        body: "A custom site for a local barbershop: online booking, a live walk-in waitlist, and pages for every barber and service.",
        tags: ["Online booking", "Live waitlist", "Local SEO"],
        alt: "Final Stop Barbershop website, home page",
      },
      fr: {
        label: "Barbier · San Diego, Californie",
        body: "Un site sur mesure pour un barbier local : réservation en ligne, file d’attente en direct pour les clients sans rendez-vous, et une page pour chaque barbier et service.",
        tags: ["Réservation en ligne", "File d’attente en direct", "SEO local"],
        alt: "Site de Final Stop Barbershop, page d’accueil",
      },
    },
  },
  blackpater: {
    domain: "blackpater.com",
    desktop: "/home/blackpater-desktop",
    mobile: "/home/blackpater-mobile-long.webp",
    copy: {
      en: {
        label: "Personal brand & portfolio",
        body: "A cinematic portfolio for educator and entrepreneur Jean-Pierre Lofumbwa: editorial typography, a journey timeline, and English and French versions.",
        tags: ["Portfolio", "Bilingual EN/FR", "Editorial design"],
        alt: "Black Pater website, home page",
      },
      fr: {
        label: "Marque personnelle et portfolio",
        body: "Un portfolio cinématographique pour l’éducateur et entrepreneur Jean-Pierre Lofumbwa : typographie éditoriale, frise de parcours, et versions anglaise et française.",
        tags: ["Portfolio", "Bilingue EN/FR", "Design éditorial"],
        alt: "Site de Black Pater, page d’accueil",
      },
    },
  },
};

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    all: string;
    visit: string;
  }
> = {
  en: {
    eyebrow: "Selected work",
    title: "Real businesses.",
    titleMuted: "Live sites.",
    all: "All projects",
    visit: "Visit",
  },
  fr: {
    eyebrow: "Réalisations",
    title: "De vraies entreprises.",
    titleMuted: "Des sites en ligne.",
    all: "Tous les projets",
    visit: "Visiter",
  },
};

function CaseVisual({
  id,
  alt,
  flip,
}: {
  id: WorkCase["id"];
  alt: string;
  flip: boolean;
}) {
  const c = CASE_COPY[id];
  return (
    <DeviceMockup
      domain={c.domain}
      desktop={c.desktop}
      mobile={c.mobile}
      mobileSize={{ width: 440, height: 3520 }}
      alt={alt}
      flip={flip}
    />
  );
}

export function Work({ cases }: { cases: WorkCase[] }) {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <LiveRegion
      as="section"
      id="work"
      labelledBy="work-title"
      className="font-editorial relative py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="mb-14 flex flex-col gap-8 lg:mb-24 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Eyebrow className="mb-6">{t.eyebrow}</Eyebrow>
            <LensText
              as="h2"
              id="work-title"
              className="font-editorial text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
            >
              {t.title}
              <br />
              <span className="text-muted-foreground">{t.titleMuted}</span>
            </LensText>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/projects"
              className="lu-press group border-foreground/20 hover:border-foreground/45 inline-flex h-12 items-center gap-2 rounded-full border px-6 text-[15px] whitespace-nowrap transition-colors"
            >
              {t.all}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="space-y-24 lg:space-y-36">
          {cases.map((item, i) => {
            const meta = CASE_COPY[item.id];
            const c = meta.copy[locale];
            const flip = i % 2 === 1;
            return (
              <article
                key={item.id}
                className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <Reveal
                  className={cn(
                    "lg:col-span-5",
                    flip && "lg:order-2 lg:col-start-8",
                  )}
                >
                  <div className="font-label text-muted-foreground flex items-center gap-4 text-xs">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="bg-foreground/20 h-px w-8"
                      aria-hidden="true"
                    />
                    <span>{c.label}</span>
                  </div>
                  <h3 className="font-editorial mt-6 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] font-normal tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed text-pretty">
                    {c.body}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-label border-hairline text-foreground/70 rounded-full border px-3 py-1 text-xs"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:text-brand-ink mt-8 inline-flex items-center gap-2 text-[15px] underline decoration-current/25 underline-offset-[6px] transition-colors"
                  >
                    {t.visit} {meta.domain}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </Reveal>
                <Reveal
                  delay={120}
                  className={cn(
                    "lg:col-span-7",
                    flip && "lg:order-1 lg:col-start-1",
                  )}
                >
                  <CaseVisual id={item.id} alt={c.alt} flip={flip} />
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </LiveRegion>
  );
}
