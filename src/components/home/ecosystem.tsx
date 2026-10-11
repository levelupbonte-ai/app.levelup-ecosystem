"use client";

import type { ComponentType, SVGProps } from "react";

import {
  BarChart3,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
} from "lucide-react";

import { PreviewIcon } from "@/components/brand/preview-icon";

import { type Locale, useLocale } from "@/lib/locale";

import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { Reveal } from "./reveal";

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  LayoutDashboard,
  CalendarCheck,
  Search,
  BarChart3,
  MessageSquareText,
  Mail,
  ShieldCheck,
  PreviewIcon,
];

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    lead: string;
    items: { name: string; kind: string; body: string }[];
  }
> = {
  en: {
    eyebrow: "The ecosystem",
    title: "One ecosystem.",
    titleMuted: "Everything connected.",
    lead: "Your website, your bookings and your clients share one account, so nothing lives in five different tools.",
    items: [
      {
        name: "Dashboard",
        kind: "Manage",
        body: "Your site, bookings and clients in one place.",
      },
      {
        name: "Online booking",
        kind: "Book",
        body: "Appointments, confirmations and a waitlist.",
      },
      {
        name: "SEO",
        kind: "Get found",
        body: "Titles, descriptions and local search, editable any time.",
      },
      {
        name: "Analytics",
        kind: "Measure",
        body: "Set up at launch, so you see where visitors come from.",
      },
      {
        name: "Forms",
        kind: "Capture",
        body: "Contact and quote requests land in your dashboard.",
      },
      {
        name: "E-mail",
        kind: "Notify",
        body: "Booking confirmations and new-request alerts.",
      },
      {
        name: "Security",
        kind: "Protect",
        body: "HTTPS, monitoring and hardened settings.",
      },
      {
        name: "LevelStudio",
        kind: "Preview",
        body: "A free, interactive draft before you commit.",
      },
    ],
  },
  fr: {
    eyebrow: "L’écosystème",
    title: "Un écosystème.",
    titleMuted: "Tout est connecté.",
    lead: "Votre site, vos réservations et vos clients partagent un seul compte : rien ne s’éparpille entre cinq outils.",
    items: [
      {
        name: "Tableau de bord",
        kind: "Gérer",
        body: "Votre site, vos réservations et vos clients au même endroit.",
      },
      {
        name: "Réservation",
        kind: "Réserver",
        body: "Rendez-vous, confirmations et liste d’attente.",
      },
      {
        name: "SEO",
        kind: "Être trouvé",
        body: "Titres, descriptions et recherche locale, modifiables à tout moment.",
      },
      {
        name: "Statistiques",
        kind: "Mesurer",
        body: "Installées au lancement, pour savoir d’où viennent vos visiteurs.",
      },
      {
        name: "Formulaires",
        kind: "Collecter",
        body: "Demandes de contact et de devis dans votre tableau de bord.",
      },
      {
        name: "E-mail",
        kind: "Notifier",
        body: "Confirmations de réservation et alertes de nouvelles demandes.",
      },
      {
        name: "Sécurité",
        kind: "Protéger",
        body: "HTTPS, surveillance et réglages renforcés.",
      },
      {
        name: "LevelStudio",
        kind: "Prévisualiser",
        body: "Un brouillon interactif gratuit avant de vous engager.",
      },
    ],
  },
};

export function Ecosystem() {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="font-editorial border-hairline relative border-t py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
          <Eyebrow center className="mb-6">
            {t.eyebrow}
          </Eyebrow>
          <LensText
            as="h2"
            id="ecosystem-title"
            className="font-editorial text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
          >
            {t.title}
            <br />
            <span className="text-muted-foreground">{t.titleMuted}</span>
          </LensText>
          <LensText
            as="p"
            className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty"
          >
            {t.lead}
          </LensText>
        </Reveal>

        <ul className="bg-hairline border-hairline grid grid-cols-1 gap-px border sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li key={item.name} className="bg-background">
                <Reveal
                  delay={(i % 4) * 70}
                  className="group relative h-full p-7 lg:p-9"
                >
                  <span
                    aria-hidden="true"
                    className="bg-brand absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                  <div className="flex items-center justify-between">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="text-foreground group-hover:text-brand size-6 transition-colors duration-300"
                    />
                    <span className="font-label text-muted-foreground text-[11px]">
                      {String(i + 1).padStart(2, "0")} / {item.kind}
                    </span>
                  </div>
                  <h3 className="font-editorial mt-10 text-2xl leading-tight font-normal tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-1 lg:mt-14">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground mt-2.5 leading-relaxed">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
