"use client";

import type { ComponentType, CSSProperties } from "react";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { type Locale, useLocale } from "@/lib/locale";

import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import {
  BookingIcon,
  SecurityIcon,
  VisibilityIcon,
  WebsiteIcon,
} from "./line-icons";
import { LiveRegion, Reveal } from "./reveal";

const ICONS: ComponentType[] = [
  WebsiteIcon,
  BookingIcon,
  VisibilityIcon,
  SecurityIcon,
];

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    more: string;
    rows: { title: string; body: string; points: string[] }[];
  }
> = {
  en: {
    eyebrow: "Capabilities",
    title: "Everything your business needs online.",
    titleMuted: "Built in, not bolted on.",
    more: "Explore services",
    rows: [
      {
        title: "Custom websites",
        body: "Designed around your brand, never a generic template. Built for speed on every phone, hosted and maintained by LevelUp. Your content, brand and data stay yours.",
        points: ["Bespoke design", "Mobile-first", "Your data, exportable"],
      },
      {
        title: "Online booking",
        body: "Clients book 24/7 from your site. You confirm, reschedule and follow up from your dashboard.",
        points: ["24/7 booking", "Confirmations", "Waitlist"],
      },
      {
        title: "Google visibility",
        body: "Local SEO foundations and Google Maps integration, so people nearby can find you when they search.",
        points: ["Local SEO", "Google Maps", "Fast pages"],
      },
      {
        title: "Security & monitoring",
        body: "HTTPS, hardened settings and uptime monitoring from day one. Care plans add daily backups and updates.",
        points: ["SSL / HTTPS", "Uptime monitoring", "Backups"],
      },
    ],
  },
  fr: {
    eyebrow: "Savoir-faire",
    title: "Tout ce dont votre activité a besoin en ligne.",
    titleMuted: "Intégré, pas rapporté.",
    more: "Voir les services",
    rows: [
      {
        title: "Sites sur mesure",
        body: "Conçus autour de votre marque, jamais un modèle générique. Pensés pour la vitesse sur tous les téléphones, hébergés et maintenus par LevelUp. Votre contenu, votre marque et vos données restent à vous.",
        points: ["Design sur mesure", "Mobile d’abord", "Données exportables"],
      },
      {
        title: "Réservation en ligne",
        body: "Vos clients réservent 24h/24 depuis votre site. Vous confirmez, déplacez et relancez depuis votre tableau de bord.",
        points: ["Réservation 24h/24", "Confirmations", "Liste d’attente"],
      },
      {
        title: "Visibilité Google",
        body: "Les bases du référencement local et l’intégration Google Maps, pour que les gens autour de vous vous trouvent.",
        points: ["SEO local", "Google Maps", "Pages rapides"],
      },
      {
        title: "Sécurité et surveillance",
        body: "HTTPS, réglages renforcés et surveillance de disponibilité dès le premier jour. Les forfaits d’entretien ajoutent sauvegardes et mises à jour.",
        points: ["SSL / HTTPS", "Surveillance", "Sauvegardes"],
      },
    ],
  },
};

export function Capabilities() {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <LiveRegion
      as="section"
      id="capabilities"
      labelledBy="capabilities-title"
      className="font-editorial relative py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="mb-14 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Eyebrow className="mb-6">{t.eyebrow}</Eyebrow>
            </Reveal>
            <LensText
              as="h2"
              id="capabilities-title"
              motion="words"
              className="font-editorial max-w-4xl text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
            >
              {t.title}
              <br />
              <span className="text-muted-foreground">{t.titleMuted}</span>
            </LensText>
          </div>
          <Reveal delay={120}>
            <Link
              href="/services"
              className="lu-press group border-foreground/20 hover:border-foreground/45 inline-flex h-12 items-center gap-2 rounded-full border px-6 text-[15px] whitespace-nowrap transition-colors"
            >
              {t.more}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* Phones, tablets, short windows, no motion: the plain list. */}
        <div className="m-pin-off">
          <ol className="border-hairline border-t" data-m="rule-top">
            {t.rows.map((row, i) => {
              const Icon = ICONS[i];
              return (
                <li
                  key={row.title}
                  className="border-hairline border-b"
                  data-m="rule"
                >
                  <Reveal
                    delay={i * 60}
                    className="group grid gap-6 py-10 sm:grid-cols-[3.5rem_1fr] lg:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_13rem] lg:items-center lg:gap-12 lg:py-16"
                  >
                    <span className="font-label text-muted-foreground text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-editorial text-[2rem] leading-[1.05] font-normal tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 lg:text-[2.6rem]">
                      {row.title}
                    </h3>
                    <div className="sm:col-start-2 lg:col-start-auto">
                      <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                        {row.body}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {row.points.map((point) => (
                          <li
                            key={point}
                            className="font-label border-hairline text-foreground/70 rounded-full border px-3 py-1 text-xs"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-foreground h-32 w-40 sm:col-start-2 lg:col-start-auto lg:h-40 lg:w-48 lg:justify-self-end">
                      <Icon />
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Desktop chapter: the section is pinned and the capabilities swap
            as you scroll (docs/motion.md, pinned chapters). Same content. */}
        <div
          className="m-pin-only m-pin"
          data-scrub="pin"
          style={{ "--n": t.rows.length } as CSSProperties}
        >
          <div className="m-pin-stage flex items-center pt-16">
            <div className="grid w-full grid-cols-[14rem_minmax(0,1fr)] gap-14 xl:gap-20">
              <div className="relative self-center">
                <span
                  aria-hidden="true"
                  className="bg-hairline absolute top-0 bottom-0 left-0 w-px"
                >
                  <i className="m-rail-fill bg-brand block h-full w-full" />
                </span>
                <ol aria-hidden="true" className="space-y-7 pl-7">
                  {t.rows.map((row, i) => (
                    <li
                      key={row.title}
                      className="m-i m-rail-item"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span className="font-label text-muted-foreground block text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-lg leading-tight tracking-[-0.02em]">
                        {row.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="relative h-[min(30rem,62svh)]">
                {t.rows.map((row, i) => {
                  const Icon = ICONS[i];
                  return (
                    <div
                      key={row.title}
                      className="m-slide grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem] items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem] xl:gap-14"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <h3 className="font-editorial text-[2.6rem] leading-[1.05] font-normal tracking-[-0.03em]">
                        {row.title}
                      </h3>
                      <div>
                        <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                          {row.body}
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {row.points.map((point) => (
                            <li
                              key={point}
                              className="font-label border-hairline text-foreground/70 rounded-full border px-3 py-1 text-xs"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-foreground h-36 w-full">
                        <Icon />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LiveRegion>
  );
}
