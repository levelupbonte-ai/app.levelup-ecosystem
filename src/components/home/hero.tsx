"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { LEVELSTUDIO_URL } from "@/lib/levelup-login";
import { type Locale, useLocale } from "@/lib/locale";

import { Eyebrow } from "./eyebrow";
import { ParticleStar } from "./particle-star";
import { StarGlyph } from "./star-glyph";
import { useInView } from "./use-in-view";
import { usePrefersReducedMotion } from "./use-reduced-motion";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    lead: string;
    pre: string;
    words: string[];
    srTitle: string;
    sub: string;
    primary: string;
    secondary: string;
    facts: string[];
    factsLabel: string;
  }
> = {
  en: {
    eyebrow: "Web studio for local businesses & brands",
    lead: "Websites built",
    pre: "to",
    words: ["impress", "book", "rank", "last"],
    srTitle:
      "Websites built to impress, take bookings, rank on Google and last.",
    sub: "Custom websites that look premium, take bookings 24/7, get found on Google and stay protected. You run it all from one dashboard.",
    primary: "Start your project",
    secondary: "Get a free preview",
    factsLabel: "What every LevelUp site includes",
    facts: [
      "Online booking 24/7",
      "Google Maps ready",
      "SSL & uptime monitoring",
      "You own your site",
      "Free preview first",
      "Mobile-first design",
      "One dashboard for everything",
      "Built from scratch, no templates",
    ],
  },
  fr: {
    eyebrow: "Studio web pour commerces locaux et marques",
    lead: "Des sites faits",
    pre: "pour",
    words: ["séduire", "réserver", "être vus", "durer"],
    srTitle:
      "Des sites faits pour séduire, prendre des réservations, être trouvés sur Google et durer.",
    sub: "Des sites sur mesure au rendu premium, qui prennent des réservations 24h/24, se trouvent sur Google et restent protégés. Vous pilotez tout depuis un seul tableau de bord.",
    primary: "Lancer mon projet",
    secondary: "Aperçu gratuit",
    factsLabel: "Ce que chaque site LevelUp inclut",
    facts: [
      "Réservation en ligne 24h/24",
      "Prêt pour Google Maps",
      "SSL et surveillance",
      "Votre site vous appartient",
      "Aperçu gratuit d’abord",
      "Pensé mobile d’abord",
      "Un seul tableau de bord",
      "Sur mesure, sans modèle",
    ],
  },
};

const ROTATE_MS = 2800;

/** Waits for the first-visit intro (html.lu-intro) to lift before `run`. */
function afterIntro(run: () => void) {
  const html = document.documentElement;
  if (!html.classList.contains("lu-intro")) {
    run();
    return () => {};
  }
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    run();
  };
  window.addEventListener("site-ready", go, { once: true });
  const failsafe = window.setTimeout(go, 4500);
  return () => {
    done = true;
    window.removeEventListener("site-ready", go);
    window.clearTimeout(failsafe);
  };
}

function RotatingWord({ words, active }: { words: string[]; active: boolean }) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setIndex(0);
    setAnimated(false);
  }, [words]);

  useEffect(() => {
    if (!active || reduced) return;
    let timer = 0;
    const cancel = afterIntro(() => {
      timer = window.setInterval(() => {
        setAnimated(true);
        setIndex((i) => (i + 1) % words.length);
      }, ROTATE_MS);
    });
    return () => {
      cancel();
      window.clearInterval(timer);
    };
  }, [active, reduced, words]);

  const word = words[index] ?? words[0];
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span key={`${word}-${index}`} className="inline-flex">
        {animated
          ? Array.from(word).map((char, i) => (
              <span
                key={i}
                className="lu-char"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {char === " " ? " " : char}
              </span>
            ))
          : word}
      </span>
      <span
        key={`bar-${index}`}
        aria-hidden="true"
        className="bg-brand/25 dark:bg-brand/35 absolute right-0 -bottom-[0.02em] left-0 h-[0.09em] origin-left"
        style={
          animated
            ? { animation: "lu-progress 0.7s cubic-bezier(0.16,1,0.3,1) both" }
            : undefined
        }
      />
    </span>
  );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function HomeHero() {
  const locale = useLocale();
  const t = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const [inViewRef, inView] = useInView<HTMLDivElement>({ rootMargin: "0px" });

  // First visit: the intro curtain lifts from the bottom, so the headline
  // waits a beat longer before rising.
  useEffect(() => {
    if (document.documentElement.classList.contains("lu-intro")) {
      sectionRef.current?.style.setProperty("--lu-intro-offset", "380ms");
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-hero-title"
      className="font-editorial relative isolate overflow-hidden"
    >
      {/* Thin grid */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />

      {/* The LevelUp star, in particles */}
      <div
        aria-hidden="true"
        className="lu-enter-soft pointer-events-none absolute top-10 -right-[40%] -z-10 aspect-square w-[96vw] opacity-30 sm:-right-[18%] sm:w-[70vw] sm:opacity-60 lg:top-[47%] lg:-right-[3%] lg:w-[min(50vw,760px)] lg:-translate-y-1/2 lg:opacity-100"
        style={delay(250)}
      >
        <ParticleStar className="h-full w-full" />
      </div>

      <div
        ref={inViewRef}
        className="mx-auto max-w-[1400px] px-4 pt-32 pb-14 sm:px-6 lg:px-12 lg:pt-44 lg:pb-20"
      >
        <div className="lu-enter-fade mb-7 lg:mb-9" style={delay(0)}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
        </div>

        <h1
          id="home-hero-title"
          className="text-foreground text-[clamp(2.75rem,14vw,9.75rem)] leading-[0.92] font-normal tracking-[-0.045em]"
        >
          <span className="sr-only">{t.srTitle}</span>
          <span aria-hidden="true" className="block">
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="lu-enter block" style={delay(90)}>
                {t.lead}
              </span>
            </span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="lu-enter block" style={delay(190)}>
                {t.pre} <RotatingWord words={t.words} active={inView} />
                <span className="text-brand">.</span>
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-9 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-24">
          <p
            className="lu-enter-fade text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty sm:text-xl lg:text-[1.375rem]"
            style={delay(360)}
          >
            {t.sub}
          </p>

          <div
            className="lu-enter-fade flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end"
            style={delay(460)}
          >
            <Link
              href="/start-project"
              className="group bg-foreground text-background focus-visible:ring-brand/50 inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t.primary}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={LEVELSTUDIO_URL}
              className="group border-foreground/20 hover:border-foreground/40 bg-background/70 hover:bg-background backdrop-blur-sm focus-visible:ring-brand/50 inline-flex h-14 items-center justify-center gap-2 rounded-full border px-8 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {t.secondary}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Facts strip: only things that are true of every project. */}
      <div
        className="lu-enter-soft lu-marquee border-hairline relative overflow-hidden border-y py-5 lg:py-6"
        style={delay(620)}
        data-live={inView ? "true" : "false"}
      >
        <p className="sr-only">
          {t.factsLabel}: {t.facts.join(", ")}.
        </p>
        <div
          aria-hidden="true"
          className="lu-marquee-track lu-loop flex w-max items-center"
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {t.facts.map((fact) => (
                <li
                  key={fact}
                  className="flex items-center gap-10 pr-10 text-2xl tracking-[-0.02em] whitespace-nowrap lg:gap-14 lg:pr-14 lg:text-[2rem]"
                >
                  <span>{fact}</span>
                  <StarGlyph className="text-brand size-3.5 shrink-0 lg:size-4" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
