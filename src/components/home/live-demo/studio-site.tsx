"use client";

import { useLayoutEffect, useRef } from "react";

import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { easeInOut, In, useFrame } from "./engine";

/* The website LevelStudio drafts in the demo: a fictional hair salon. It is
   drawn at the width of the real preview iframe (1280 px desktop, 390 px
   phone) and scaled into the canvas, like the real studio does. */

export const SITE_COPY: Record<
  Locale,
  {
    name: string;
    nav: [string, string, string];
    cta: string;
    label: string;
    h1: [string, string];
    lead: string;
    see: string;
    bookCta: string;
    hours: string;
    servicesTitle: string;
    services: { n: string; name: string; time: string; price: string }[];
    bookTitle: string;
    bookText: string;
    days: string[];
    slots: string[];
    confirm: string;
    address: string;
    badge: [string, string, string];
  }
> = {
  en: {
    name: "Salon Aurore",
    nav: ["Home", "Services", "Book"],
    cta: "Book now",
    label: "Croix-Rousse · Lyon",
    h1: ["Unhurried hair,", "in the heart of Lyon."],
    lead: "Cuts, colour and balayage by appointment, in a calm salon on the slopes of the Croix-Rousse.",
    see: "See services",
    bookCta: "Book an appointment",
    hours: "By appointment · Tuesday to Saturday",
    servicesTitle: "Services",
    services: [
      { n: "01", name: "Cut & finish", time: "60 min", price: "from €48" },
      { n: "02", name: "Colour", time: "90 min", price: "from €72" },
      { n: "03", name: "Balayage", time: "150 min", price: "from €120" },
    ],
    bookTitle: "Book online",
    bookText: "Pick a day and a time. We confirm by email.",
    days: ["Tue 12", "Wed 13", "Thu 14"],
    slots: ["09:30", "11:00", "14:15", "16:30"],
    confirm: "Confirm appointment",
    address: "12 rue Imaginaire, 69004 Lyon",
    badge: ["Built with", "LevelStudio", "by LevelUp Ecosystem"],
  },
  fr: {
    name: "Salon Aurore",
    nav: ["Accueil", "Prestations", "Réserver"],
    cta: "Réserver",
    label: "Croix-Rousse · Lyon",
    h1: ["Des cheveux sans hâte,", "au cœur de Lyon."],
    lead: "Coupes, couleur et balayage sur rendez-vous, dans un salon calme sur les pentes de la Croix-Rousse.",
    see: "Voir les prestations",
    bookCta: "Prendre rendez-vous",
    hours: "Sur rendez-vous · du mardi au samedi",
    servicesTitle: "Prestations",
    services: [
      { n: "01", name: "Coupe & coiffage", time: "60 min", price: "dès 48 €" },
      { n: "02", name: "Couleur", time: "90 min", price: "dès 72 €" },
      { n: "03", name: "Balayage", time: "150 min", price: "dès 120 €" },
    ],
    bookTitle: "Réserver en ligne",
    bookText: "Choisissez un jour et une heure. Nous confirmons par e-mail.",
    days: ["Mar 12", "Mer 13", "Jeu 14"],
    slots: ["09:30", "11:00", "14:15", "16:30"],
    confirm: "Confirmer le rendez-vous",
    address: "12 rue Imaginaire, 69004 Lyon",
    badge: ["Créé avec", "LevelStudio", "par LevelUp Ecosystem"],
  },
};

const INK = "#2b211c";
const CREAM = "#f5efe6";
const SAND = "#ebe2d4";
const CLAY = "#b5532e";
const MUTED = "#7a6a5f";
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

export const SITE_WIDTH = { desktop: 1280, phone: 390 };

/**
 * `on` flips when the site has been delivered: its sections build in with a
 * stagger. `scroll` (0..1) reads the page down to the booking block.
 */
export function SalonSite({
  locale,
  narrow,
  on,
  delay = 0,
  scrollFrom,
  scrollTo,
  viewport,
}: {
  locale: Locale;
  narrow: boolean;
  on: boolean;
  delay?: number;
  scrollFrom: number;
  scrollTo: number;
  /** Height of the preview window in site pixels. */
  viewport: number;
}) {
  const c = SITE_COPY[locale];
  const page = useRef<HTMLDivElement>(null);
  const max = useRef(0);

  useLayoutEffect(() => {
    const el = page.current;
    if (el) max.current = Math.max(0, el.offsetHeight - viewport);
  }, [viewport, narrow, locale]);

  useFrame((t) => {
    const el = page.current;
    if (!el) return;
    const p = easeInOut(
      Math.min(1, Math.max(0, (t - scrollFrom) / (scrollTo - scrollFrom))),
    );
    el.style.transform = `translate3d(0, ${-max.current * p}px, 0)`;
  });

  const d = (n: number) => delay + n;
  const px = narrow ? 24 : 80;

  const header = (
    <In on={on} delay={d(0)} y={-14}>
      <div
        className="flex items-center justify-between"
        style={{ height: narrow ? 64 : 88, padding: `0 ${px}px` }}
      >
        <span style={{ ...serif, fontSize: narrow ? 22 : 28, color: INK }}>
          {c.name}
        </span>
        {narrow ? (
          <span className="flex flex-col gap-[5px]" aria-hidden="true">
            <span className="block h-[2px] w-6" style={{ background: INK }} />
            <span
              className="block h-[2px] w-4 self-end"
              style={{ background: INK }}
            />
          </span>
        ) : (
          <span
            className="flex items-center gap-10 text-[15px]"
            style={{ color: INK }}
          >
            {c.nav.map((n, i) => (
              <span key={n} style={{ opacity: i === 0 ? 1 : 0.65 }}>
                {n}
              </span>
            ))}
            <span
              className="rounded-full px-6 py-2.5 text-[14px]"
              style={{ background: INK, color: CREAM }}
            >
              {c.cta}
            </span>
          </span>
        )}
      </div>
    </In>
  );

  const hero = (
    <div
      className={cn(
        "grid items-center",
        narrow
          ? "gap-8 pt-6 pb-12"
          : "grid-cols-[1.15fr_0.85fr] gap-12 pt-10 pb-24",
      )}
      style={{ padding: narrow ? `24px ${px}px 48px` : `40px ${px}px 96px` }}
    >
      <div>
        <In on={on} delay={d(180)}>
          <p
            className="text-[13px] tracking-[0.2em] uppercase"
            style={{ color: CLAY }}
          >
            {c.label}
          </p>
        </In>
        <div
          className="mt-5 font-normal"
          style={{
            ...serif,
            color: INK,
            fontSize: narrow ? 42 : 80,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          <In on={on} delay={d(300)} y={18}>
            {c.h1[0]}
          </In>
          <In on={on} delay={d(420)} y={18}>
            <span style={{ color: CLAY, fontStyle: "italic" }}>{c.h1[1]}</span>
          </In>
        </div>
        <In on={on} delay={d(560)}>
          <p
            className="mt-6 max-w-[34ch]"
            style={{
              color: MUTED,
              fontSize: narrow ? 16 : 20,
              lineHeight: 1.55,
            }}
          >
            {c.lead}
          </p>
        </In>
        <In on={on} delay={d(700)}>
          <div className="mt-8 flex items-center gap-6">
            <span
              className="rounded-full px-7 py-3.5 text-[15px]"
              style={{ background: CLAY, color: CREAM }}
            >
              {c.bookCta}
            </span>
            <span
              className="text-[15px] underline underline-offset-4"
              style={{ color: INK }}
            >
              {c.see}
            </span>
          </div>
        </In>
        <In on={on} delay={d(820)}>
          <p className="mt-6 text-[13px]" style={{ color: MUTED }}>
            {c.hours}
          </p>
        </In>
      </div>
      <In on={on} delay={d(500)} y={30} scale={0.96}>
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: narrow ? "100%" : 420,
            height: narrow ? 260 : 520,
            borderRadius: "999px 999px 24px 24px",
            background:
              "linear-gradient(165deg, #e9b99a 0%, #cf7f56 45%, #8f3f22 100%)",
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              width: narrow ? 90 : 190,
              height: narrow ? 90 : 190,
              left: "50%",
              top: "22%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, #fbe6cf 0%, #f3c9a2 70%)",
            }}
          />
          <span
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "38%",
              background:
                "linear-gradient(180deg, transparent, rgb(43 33 28 / 0.45))",
            }}
          />
          <span
            className="absolute rounded-full border"
            style={{
              width: narrow ? 160 : 340,
              height: narrow ? 160 : 340,
              left: "50%",
              top: "8%",
              transform: "translateX(-50%)",
              borderColor: "rgb(251 230 207 / 0.5)",
            }}
          />
        </div>
      </In>
    </div>
  );

  const services = (
    <In on={on} delay={d(1100)} y={24}>
      <div
        style={{
          background: SAND,
          padding: narrow ? `40px ${px}px` : `72px ${px}px`,
        }}
      >
        <div
          className="font-normal"
          style={{
            ...serif,
            color: INK,
            fontSize: narrow ? 30 : 46,
            letterSpacing: "-0.01em",
          }}
        >
          {c.servicesTitle}
        </div>
        <div className="mt-8" style={{ borderTop: `1px solid ${INK}33` }}>
          {c.services.map((s) => (
            <div
              key={s.n}
              className="flex items-baseline gap-5"
              style={{
                borderBottom: `1px solid ${INK}33`,
                padding: narrow ? "16px 0" : "26px 0",
                color: INK,
              }}
            >
              <span className="text-[13px]" style={{ color: CLAY }}>
                {s.n}
              </span>
              <span style={{ ...serif, fontSize: narrow ? 20 : 30, flex: 1 }}>
                {s.name}
              </span>
              {!narrow && (
                <span className="text-[15px]" style={{ color: MUTED }}>
                  {s.time}
                </span>
              )}
              <span style={{ fontSize: narrow ? 15 : 18 }}>{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </In>
  );

  const book = (
    <In on={on} delay={d(1500)} y={24}>
      <div
        className={cn(
          "grid",
          narrow ? "gap-6" : "grid-cols-2 items-center gap-16",
        )}
        style={{ padding: narrow ? `40px ${px}px` : `88px ${px}px` }}
      >
        <div>
          <div
            className="font-normal"
            style={{
              ...serif,
              color: INK,
              fontSize: narrow ? 30 : 46,
              letterSpacing: "-0.01em",
            }}
          >
            {c.bookTitle}
          </div>
          <p
            className="mt-4 max-w-[30ch]"
            style={{ color: MUTED, fontSize: narrow ? 15 : 18 }}
          >
            {c.bookText}
          </p>
        </div>
        <div
          className="rounded-3xl p-7"
          style={{ background: "#fffaf3", border: `1px solid ${INK}1f` }}
        >
          <div className="flex gap-3">
            {c.days.map((day, i) => (
              <span
                key={day}
                className="rounded-full px-5 py-2.5 text-[14px]"
                style={{
                  background: i === 1 ? INK : "transparent",
                  color: i === 1 ? CREAM : INK,
                  border: `1px solid ${INK}33`,
                }}
              >
                {day}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {c.slots.map((slot, i) => (
              <span
                key={slot}
                className="rounded-xl py-3 text-center text-[14px]"
                style={{
                  background: i === 2 ? CLAY : "transparent",
                  color: i === 2 ? CREAM : INK,
                  border: `1px solid ${i === 2 ? CLAY : `${INK}33`}`,
                }}
              >
                {slot}
              </span>
            ))}
          </div>
          <span
            className="mt-6 block rounded-full py-3.5 text-center text-[15px]"
            style={{ background: INK, color: CREAM }}
          >
            {c.confirm}
          </span>
        </div>
      </div>
    </In>
  );

  const footer = (
    <div
      className="flex items-center justify-between text-[13px]"
      style={{
        padding: narrow ? `28px ${px}px 36px` : `32px ${px}px 40px`,
        color: MUTED,
        borderTop: `1px solid ${INK}1f`,
        flexDirection: narrow ? "column" : "row",
        gap: narrow ? 8 : 0,
      }}
    >
      <span>{c.address}</span>
      <span className="text-[12px] opacity-70">
        {c.badge[0]} <strong>{c.badge[1]}</strong> {c.badge[2]}
      </span>
    </div>
  );

  return (
    <div
      ref={page}
      style={{
        background: on ? CREAM : "transparent",
        color: INK,
        transition: "background-color 0.6s ease",
      }}
    >
      {header}
      {hero}
      {services}
      {book}
      {footer}
    </div>
  );
}
