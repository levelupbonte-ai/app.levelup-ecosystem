"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { Aurora } from "./aurora";
import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { ParticleStar } from "./particle-star";
import { PromptBox } from "./prompt-box";
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

/** Rotation state, shared by the heading and its lens copy so they stay in sync. */
function useRotation(words: string[], active: boolean) {
  const [state, setState] = useState({ index: 0, animated: false });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setState({ index: 0, animated: false });
  }, [words]);

  useEffect(() => {
    if (!active || reduced) return;
    let timer = 0;
    const cancel = afterIntro(() => {
      timer = window.setInterval(() => {
        setState((s) => ({
          index: (s.index + 1) % words.length,
          animated: true,
        }));
      }, ROTATE_MS);
    });
    return () => {
      cancel();
      window.clearInterval(timer);
    };
  }, [active, reduced, words]);

  return state;
}

function RotatingWord({
  word,
  index,
  animated,
}: {
  word: string;
  index: number;
  animated: boolean;
}) {
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
                {char === " " ? "\u00A0" : char}
              </span>
            ))
          : word}
        <span className="text-brand">.</span>
      </span>
      <span
        key={`bar-${index}`}
        aria-hidden="true"
        className="bg-brand/25 dark:bg-brand/35 absolute right-[0.32em] -bottom-[0.02em] left-0 h-[0.09em] origin-left"
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

  // First visit: the entrance plays when the intro curtain lifts (paused by
  // CSS while html.lu-intro is set), a beat after it starts rising.
  const rotation = useRotation(t.words, inView);
  const word = t.words[rotation.index] ?? t.words[0];
  const headline = (
    <span aria-hidden="true" className="block">
      <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
        <span className="lu-enter block" style={delay(90)}>
          {t.lead}
        </span>
      </span>
      <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
        <span className="lu-enter block" style={delay(190)}>
          {t.pre}{" "}
          <RotatingWord
            word={word}
            index={rotation.index}
            animated={rotation.animated}
          />
        </span>
      </span>
    </span>
  );

  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains("lu-intro")) {
      sectionRef.current?.style.setProperty("--lu-intro-offset", "380ms");
      setPlay(true);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-hero-title"
      className={cn(
        "font-editorial relative isolate overflow-hidden",
        play && "lu-play",
      )}
      data-live={inView ? "true" : "false"}
    >
      {/* Airy aurora + faint grid */}
      <Aurora />

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
        className="mx-auto max-w-[1400px] px-4 pt-28 pb-14 sm:px-6 lg:px-12 lg:pt-36 lg:pb-16"
      >
        <div className="lu-enter-fade mb-6 lg:mb-8" style={delay(0)}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
        </div>

        <LensText
          as="h1"
          id="home-hero-title"
          className="text-foreground text-[clamp(2.75rem,14vw,9.25rem)] leading-[0.92] font-normal tracking-[-0.045em]"
          overlay={headline}
        >
          <span className="sr-only">{t.srTitle}</span>
          {headline}
        </LensText>

        <div className="mt-8 max-w-[46rem] lg:mt-10">
          <p
            className="lu-enter-slide text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty sm:text-xl lg:text-[1.375rem]"
            style={delay(360)}
          >
            {t.sub}
          </p>
          <div className="lu-enter-fade mt-7 lg:mt-8" style={delay(460)}>
            <PromptBox />
          </div>
        </div>
      </div>

      {/* Facts strip: only things that are true of every project. */}
      <div
        className="lu-enter-soft lu-marquee border-hairline bg-background/40 relative overflow-hidden border-y py-5 backdrop-blur-[2px] lg:py-6"
        style={delay(620)}
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
