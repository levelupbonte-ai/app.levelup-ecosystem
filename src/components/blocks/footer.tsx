"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowUpRight } from "lucide-react";

import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LEVELSTUDIO_URL, levelUpLoginUrl } from "@/lib/levelup-login";
import { type Locale, useLocale } from "@/lib/locale";

type FooterLink = { label: string; href: string; external?: boolean };

const COPY: Record<
  Locale,
  {
    tagline: string;
    columns: { title: string; links: FooterLink[] }[];
    email: string;
    rights: string;
    language: string;
    theme: string;
  }
> = {
  en: {
    tagline:
      "Custom websites for local businesses and brands: premium design, online booking, Google visibility and security, run from one dashboard.",
    columns: [
      {
        title: "Studio",
        links: [
          { label: "Services", href: "/services" },
          { label: "Projects", href: "/projects" },
          { label: "Pricing", href: "/pricing" },
          { label: "Start a project", href: "/start-project" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Ecosystem",
        links: [
          { label: "LevelStudio", href: "/studio" },
          { label: "Free preview", href: LEVELSTUDIO_URL, external: true },
          {
            label: "Dashboard",
            href: levelUpLoginUrl("sign-in", "/dashboard/site"),
            external: true,
          },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Cookies", href: "/cookies" },
        ],
      },
    ],
    email: "contact@levelup-ecosystem.com",
    rights: "LevelUp Ecosystem. All rights reserved.",
    language: "Language",
    theme: "Theme",
  },
  fr: {
    tagline:
      "Des sites sur mesure pour commerces locaux et marques : design premium, réservation en ligne, visibilité Google et sécurité, pilotés depuis un seul tableau de bord.",
    columns: [
      {
        title: "Studio",
        links: [
          { label: "Services", href: "/services" },
          { label: "Projets", href: "/projects" },
          { label: "Tarifs", href: "/pricing" },
          { label: "Lancer un projet", href: "/start-project" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { label: "À propos", href: "/about" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Écosystème",
        links: [
          { label: "LevelStudio", href: "/studio" },
          { label: "Aperçu gratuit", href: LEVELSTUDIO_URL, external: true },
          {
            label: "Tableau de bord",
            href: levelUpLoginUrl("sign-in", "/dashboard/site"),
            external: true,
          },
        ],
      },
      {
        title: "Légal",
        links: [
          { label: "Confidentialité", href: "/privacy" },
          { label: "Conditions", href: "/terms" },
          { label: "Cookies", href: "/cookies" },
        ],
      },
    ],
    email: "contact@levelup-ecosystem.com",
    rights: "LevelUp Ecosystem. Tous droits réservés.",
    language: "Langue",
    theme: "Thème",
  },
};

function isHidden(pathname: string | null) {
  if (!pathname) return false;
  if (pathname === "/retrouvailles" || pathname.startsWith("/start-project"))
    return true;
  const segments = pathname.split("/").filter(Boolean);
  return (
    (segments[0] === "projects" || segments[0] === "project") &&
    segments.length >= 2
  );
}

export function Footer() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = COPY[locale];

  if (isHidden(pathname)) return null;

  return (
    <footer className="font-editorial border-hairline relative overflow-hidden border-t">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-6 lg:gap-8 lg:py-24">
          <div className="col-span-2">
            <Link
              href="/"
              className="focus-visible:ring-brand/50 inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <Image
                src="/icon.svg"
                alt=""
                width={28}
                height={28}
                unoptimized
                className="size-7"
              />
              <span className="text-2xl tracking-[-0.03em]">LevelUp</span>
              <span className="font-label text-muted-foreground mt-1 text-[11px]">
                Ecosystem
              </span>
            </Link>
            <p className="text-muted-foreground mt-6 max-w-xs leading-relaxed">
              {t.tagline}
            </p>
            <a
              href={`mailto:${t.email}`}
              className="hover:text-brand-ink mt-6 inline-block text-sm underline decoration-current/30 underline-offset-4 transition-colors"
            >
              {t.email}
            </a>
          </div>

          {t.columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-label text-muted-foreground mb-5 text-xs font-normal tracking-tight">
                {column.title}
              </h2>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="group text-foreground/80 hover:text-foreground inline-flex items-center gap-1 text-[15px] transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3.5 opacity-50 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-foreground/80 hover:text-foreground text-[15px] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-hairline flex flex-col gap-5 border-t py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">© {t.rights}</p>
          <div className="flex items-center gap-4">
            <span className="sr-only">{t.language}</span>
            <LanguageSwitch />
            <span className="sr-only">{t.theme}</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto -mb-[3.2vw] max-w-[1400px] px-4 select-none sm:px-6 lg:px-12"
      >
        <p className="text-foreground/[0.07] text-center text-[19.5vw] leading-[0.8] tracking-[-0.06em] whitespace-nowrap lg:text-[min(19.5vw,17.5rem)]">
          LevelUp
        </p>
      </div>
    </footer>
  );
}
