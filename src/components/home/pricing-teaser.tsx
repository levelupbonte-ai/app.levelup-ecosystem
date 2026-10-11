"use client";

import Link from "next/link";

import { ArrowRight, Check } from "lucide-react";

import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { Reveal } from "./reveal";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleStroke: string;
    lead: string;
    from: string;
    cards: {
      name: string;
      note: string;
      period: string;
      points: string[];
      cta: string;
      href: string;
    }[];
    footer: string;
    details: string;
  }
> = {
  en: {
    eyebrow: "Pricing",
    title: "Simple,",
    titleStroke: "honest pricing",
    lead: "Fixed project prices and optional monthly care. No builder subscription, no lock-in.",
    from: "from",
    cards: [
      {
        name: "Website projects",
        note: "Custom design and build",
        period: "one-time",
        points: [
          "Designed from scratch, mobile-first",
          "Booking, SEO and security options",
          "You own the site and its code",
        ],
        cta: "Start your project",
        href: "/start-project",
      },
      {
        name: "Care plans",
        note: "Hosting, protection and updates",
        period: "/month",
        points: [
          "Managed hosting and SSL",
          "Daily backups and uptime monitoring",
          "Monthly updates handled for you",
        ],
        cta: "Compare care plans",
        href: "/pricing",
      },
    ],
    footer: "Every project starts with a free preview.",
    details: "See full pricing",
  },
  fr: {
    eyebrow: "Tarifs",
    title: "Des tarifs",
    titleStroke: "simples et clairs",
    lead: "Des prix de projet fixes et un entretien mensuel en option. Pas d’abonnement à un constructeur de site, aucun engagement forcé.",
    from: "à partir de",
    cards: [
      {
        name: "Projets de site",
        note: "Design et développement sur mesure",
        period: "une fois",
        points: [
          "Conçu de zéro, pensé mobile d’abord",
          "Options réservation, SEO et sécurité",
          "Le site et son code vous appartiennent",
        ],
        cta: "Lancer mon projet",
        href: "/start-project",
      },
      {
        name: "Forfaits d’entretien",
        note: "Hébergement, protection et mises à jour",
        period: "/mois",
        points: [
          "Hébergement géré et SSL",
          "Sauvegardes quotidiennes et surveillance",
          "Mises à jour mensuelles prises en charge",
        ],
        cta: "Comparer les forfaits",
        href: "/pricing",
      },
    ],
    footer: "Chaque projet commence par un aperçu gratuit.",
    details: "Voir tous les tarifs",
  },
};

export function PricingTeaser({
  projectFrom,
  careFrom,
}: {
  /** Lowest website project price, e.g. "$850". */
  projectFrom: string;
  /** Lowest monthly care plan price, e.g. "$39". */
  careFrom: string;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const prices = [projectFrom, careFrom];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="font-editorial border-hairline relative border-t py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <Reveal>
            <Eyebrow className="mb-6">{t.eyebrow}</Eyebrow>
            <LensText
              as="h2"
              id="pricing-title"
              className="font-editorial text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98] font-normal tracking-[-0.04em]"
            >
              {t.title}
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]">
                {t.titleStroke}
              </span>
            </LensText>
            <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed text-pretty">
              {t.lead}
            </p>
            <Link
              href="/pricing"
              className="group hover:text-brand-ink mt-8 inline-flex items-center gap-2 text-[15px] underline decoration-current/25 underline-offset-[6px] transition-colors"
            >
              {t.details}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <div>
            <div className="bg-hairline border-hairline grid gap-px border sm:grid-cols-2">
              {t.cards.map((card, i) => (
                <div key={card.name} className="bg-background">
                  <Reveal
                    delay={i * 90}
                    className="flex h-full flex-col p-7 lg:p-10"
                  >
                    <span className="font-label text-muted-foreground text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-editorial mt-2 text-[1.75rem] leading-tight font-normal tracking-[-0.03em]">
                      {card.name}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      {card.note}
                    </p>
                    <div className="border-hairline mt-8 border-b pb-8">
                      <span className="font-label text-muted-foreground block text-xs">
                        {t.from}
                      </span>
                      <span className="mt-1 flex items-baseline gap-2">
                        <span className="text-[3.5rem] leading-none tracking-[-0.045em] lg:text-[4.25rem]">
                          {prices[i]}
                        </span>
                        <span className="text-muted-foreground">
                          {card.period}
                        </span>
                      </span>
                    </div>
                    <ul className="mt-8 flex-1 space-y-3.5">
                      {card.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <Check
                            aria-hidden="true"
                            className="text-brand mt-0.5 size-4 shrink-0"
                          />
                          <span className="text-foreground/75 text-[15px]">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={card.href}
                      className={cn(
                        "group mt-10 inline-flex h-12 items-center justify-center gap-2 text-[15px] transition-colors",
                        i === 0
                          ? "bg-foreground text-background hover:opacity-90"
                          : "border-foreground/20 hover:border-foreground/50 border",
                      )}
                    >
                      {card.cta}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </Reveal>
                </div>
              ))}
            </div>
            <p className="font-label text-muted-foreground mt-5 text-xs">
              {t.footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
