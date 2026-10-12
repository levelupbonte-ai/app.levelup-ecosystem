"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowUpRight } from "lucide-react";

import { FooterWordmark } from "@/components/brand/footer-wordmark";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LEVELSTUDIO_URL, levelUpLoginUrl } from "@/lib/levelup-login";
import { LEGAL_DOC_BY_SLUG } from "@/lib/legal-docs";
import { type Locale, useLocale } from "@/lib/locale";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  /** Opens the cookie preferences instead of navigating. */
  cookieSettings?: boolean;
};

const COPY: Record<
  Locale,
  {
    tagline: string;
    columns: { title: string; links: FooterLink[] }[];
    email: string;
    company: string;
    rights: string;
    legalNav: {
      agreements: string;
      privacy: string;
      preferences: string;
      cookieSettings: string;
    };
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
    ],
    email: "contact@levelup-ecosystem.com",
    company: "LevelUp Ecosystem",
    rights: "All rights reserved.",
    legalNav: {
      agreements: "Agreements",
      privacy: "Privacy & data",
      preferences: "Preferences",
      cookieSettings: "Cookie settings",
    },
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
    ],
    email: "contact@levelup-ecosystem.com",
    company: "LevelUp Ecosystem",
    rights: "Tous droits réservés.",
    legalNav: {
      agreements: "Contrats",
      privacy: "Confidentialité et données",
      preferences: "Préférences",
      cookieSettings: "Paramètres des cookies",
    },
    language: "Langue",
    theme: "Thème",
  },
};

const LINK =
  "group relative -mx-1.5 inline-flex min-h-11 items-center rounded-sm px-1.5 text-[14px] leading-snug text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-sec-ring focus-visible:outline-none md:min-h-8";
/* Quiet underline that draws in the section accent. */
const LINK_RULE =
  "bg-brand pointer-events-none absolute inset-x-1.5 bottom-2 h-px origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 md:bottom-0.5";

const AGREEMENTS = ["terms", "services-agreement", "levelstudio-terms", "acceptable-use"] as const;
const PRIVACY = ["privacy", "cookies", "dpa"] as const;

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

  const legalLink = (slug: (typeof AGREEMENTS)[number] | (typeof PRIVACY)[number]) => {
    const doc = LEGAL_DOC_BY_SLUG[slug];
    return (
      <li key={slug}>
        <Link
          href={doc.path}
          aria-current={pathname === doc.path ? "page" : undefined}
          className={LINK}
        >
          {doc.label[locale]}
          <span aria-hidden="true" className={LINK_RULE} />
        </Link>
      </li>
    );
  };

  return (
    <footer className="font-editorial border-hairline relative overflow-hidden border-t">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-5 lg:gap-8 lg:pt-24 lg:pb-16">
          <div className="col-span-2">
            <Link
              href="/"
              className="focus-visible:ring-sec-ring inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:outline-none"
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

        {/* Legal zone: the same five columns as the links above. */}
        <div className="border-hairline relative border-t pt-10 pb-12 lg:pt-12 lg:pb-14">
          <span
            aria-hidden="true"
            className="absolute top-[-1px] left-0 h-px w-16 bg-[linear-gradient(90deg,var(--sec-grad-a),var(--sec-grad-b))]"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 lg:gap-8">
            <nav aria-labelledby="footer-agreements">
              <h2
                id="footer-agreements"
                className="font-label text-muted-foreground mb-3 text-xs font-normal tracking-tight md:mb-4"
              >
                {t.legalNav.agreements}
              </h2>
              <ul>{AGREEMENTS.map(legalLink)}</ul>
            </nav>

            <nav aria-labelledby="footer-privacy">
              <h2
                id="footer-privacy"
                className="font-label text-muted-foreground mb-3 text-xs font-normal tracking-tight md:mb-4"
              >
                {t.legalNav.privacy}
              </h2>
              <ul>
                {PRIVACY.map(legalLink)}
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("levelup_open_cookie_settings"),
                      )
                    }
                    className={`${LINK} cursor-pointer text-left`}
                  >
                    {t.legalNav.cookieSettings}
                    <span aria-hidden="true" className={LINK_RULE} />
                  </button>
                </li>
              </ul>
            </nav>

            <div className="col-span-2 md:col-span-1">
              <h2 className="font-label text-muted-foreground mb-1 text-xs font-normal tracking-tight md:mb-2">
                {t.legalNav.preferences}
              </h2>
              <ul className="divide-hairline divide-y">
                <li className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 md:min-h-11">
                  <span className="text-muted-foreground text-[14px]">
                    {t.language}
                  </span>
                  <LanguageSwitch />
                </li>
                <li className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 md:min-h-11">
                  <span className="text-muted-foreground text-[14px]">
                    {t.theme}
                  </span>
                  <ThemeToggle className="-mr-1.5" />
                </li>
              </ul>
            </div>

            <p className="order-last col-span-2 text-[14px] leading-relaxed md:order-first md:row-start-1 md:col-span-2 md:col-start-1">
              <span className="text-foreground block">
                © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
                {t.company}
              </span>
              <span className="text-muted-foreground block">{t.rights}</span>
            </p>
          </div>
        </div>
      </div>

      {/* The LevelUp Ecosystem lockup of the intro, built by the star's particles */}
      <FooterWordmark className="mt-2 md:mt-4" />
    </footer>
  );
}
