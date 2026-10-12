"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Background } from "@/components/background";
import { Eyebrow } from "@/components/home/eyebrow";
import { Button } from "@/components/ui/button";
import { type Locale, useLocale } from "@/lib/locale";

type Kind = "not-found" | "error";

const COPY: Record<
  Locale,
  {
    notFound: { eyebrow: string; title: string; body: string };
    error: { eyebrow: string; title: string; body: string; retry: string };
    home: string;
    helpful: string;
    links: { href: string; label: string; hint: string }[];
    contact: string;
  }
> = {
  en: {
    notFound: {
      eyebrow: "Error 404",
      title: "This page doesn't exist.",
      body: "The link may be out of date or mistyped. Here is where you can pick things back up."
    },
    error: {
      eyebrow: "Something went wrong",
      title: "We hit an unexpected problem.",
      body: "It is not something you did. Try again, or head back to the homepage. If it keeps happening, let us know.",
      retry: "Try again"
    },
    home: "Back to the homepage",
    helpful: "Helpful links",
    links: [
      { href: "/", label: "Home", hint: "Start from the beginning" },
      { href: "/studio", label: "LevelStudio", hint: "Turn an idea into a website draft" },
      { href: "/projects", label: "Projects", hint: "See what we have built" },
      { href: "/pricing", label: "Pricing", hint: "Fixed prices and care plans" },
      { href: "/contact", label: "Contact", hint: "Talk to us" }
    ],
    contact: "Need a hand? Write to"
  },
  fr: {
    notFound: {
      eyebrow: "Erreur 404",
      title: "Cette page n'existe pas.",
      body: "Le lien est peut-être obsolète ou mal saisi. Voici de quoi reprendre votre chemin."
    },
    error: {
      eyebrow: "Une erreur est survenue",
      title: "Nous avons rencontré un problème inattendu.",
      body: "Vous n'y êtes pour rien. Réessayez, ou retournez à l'accueil. Si cela persiste, prévenez-nous.",
      retry: "Réessayer"
    },
    home: "Retour à l'accueil",
    helpful: "Liens utiles",
    links: [
      { href: "/", label: "Accueil", hint: "Repartir du début" },
      { href: "/studio", label: "LevelStudio", hint: "Transformer une idée en ébauche de site" },
      { href: "/projects", label: "Projets", hint: "Voir nos réalisations" },
      { href: "/pricing", label: "Tarifs", hint: "Prix fixes et plans de maintenance" },
      { href: "/contact", label: "Contact", hint: "Parler avec nous" }
    ],
    contact: "Besoin d'aide ? Écrivez à"
  }
};

/** Branded 404 and error screen (EN/FR), in the site's editorial style. */
export function ErrorShell({
  kind,
  onRetry
}: {
  kind: Kind;
  onRetry?: () => void;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const c = kind === "not-found" ? t.notFound : t.error;

  return (
    <Background>
      <div className="font-editorial mx-auto max-w-[1100px] px-4 pt-32 pb-24 sm:px-6 lg:px-12 lg:pt-44 lg:pb-32">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="text-[2.4rem] leading-[1.05] tracking-[-0.035em] text-balance sm:text-6xl">
              {c.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
              {c.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {kind === "error" && onRetry ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={onRetry}
                  className="cursor-pointer rounded-full px-6 font-medium"
                >
                  {t.error.retry}
                </Button>
              ) : null}
              <Button
                asChild
                size="lg"
                variant={kind === "error" ? "outline" : "default"}
                className="rounded-full px-6 font-medium"
              >
                <Link href="/">
                  {t.home}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          {kind === "not-found" ? (
            <p
              aria-hidden="true"
              className="text-brand-ink/90 select-none text-[7rem] leading-none tracking-[-0.06em] sm:text-[11rem] lg:text-[13rem]"
            >
              404
            </p>
          ) : null}
        </div>

        <nav
          aria-label={t.helpful}
          className="border-hairline mt-16 border-t pt-10 lg:mt-24"
        >
          <h2 className="font-label text-muted-foreground mb-5 text-xs font-normal tracking-tight">
            {t.helpful}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {t.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group border-hairline hover:border-brand/40 hover:bg-brand/[0.04] flex h-full flex-col gap-1.5 rounded-xl border p-4 transition-colors"
                >
                  <span className="flex items-center justify-between gap-2 text-[15px] font-medium">
                    {l.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="text-muted-foreground text-[13px] leading-snug">
                    {l.hint}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-8 text-sm">
            {t.contact}{" "}
            <a
              href="mailto:contact@levelup-ecosystem.com"
              className="text-foreground underline decoration-current/30 underline-offset-4"
            >
              contact@levelup-ecosystem.com
            </a>
          </p>
        </nav>
      </div>
    </Background>
  );
}
