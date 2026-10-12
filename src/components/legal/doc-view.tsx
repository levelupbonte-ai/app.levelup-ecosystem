import Link from "next/link";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { LegalToc } from "@/components/legal/toc";
import { Eyebrow } from "@/components/home/eyebrow";
import type { LegalDoc } from "@/lib/legal";
import {
  LEGAL_DOCS,
  LEGAL_EFFECTIVE,
  legalUpdated,
  type LegalSlug
} from "@/lib/legal-docs";
import type { Locale } from "@/lib/locale";

const CHROME: Record<
  Locale,
  {
    eyebrow: string;
    effective: string;
    updated: string;
    toc: string;
    tocShort: string;
    others: string;
    contact: string;
    contactLine: string;
  }
> = {
  en: {
    eyebrow: "Legal",
    effective: "Effective",
    updated: "Last updated",
    toc: "On this page",
    tocShort: "Contents",
    others: "Other legal documents",
    contact: "contact@levelup-ecosystem.com",
    contactLine: "Questions about this document?"
  },
  fr: {
    eyebrow: "Légal",
    effective: "En vigueur le",
    updated: "Dernière mise à jour",
    toc: "Sur cette page",
    tocShort: "Sommaire",
    others: "Autres documents légaux",
    contact: "contact@levelup-ecosystem.com",
    contactLine: "Une question sur ce document ?"
  }
};

/** One language version of a legal document (server-rendered). */
export function LegalDocView({
  doc,
  locale,
  slug,
  children
}: {
  doc: LegalDoc;
  locale: Locale;
  slug: LegalSlug;
  children?: React.ReactNode;
}) {
  const t = CHROME[locale];
  const updated = legalUpdated(slug);

  return (
    <div lang={locale} className="mx-auto max-w-[1180px] px-4 pt-28 pb-24 sm:px-6 lg:px-12 lg:pt-40 lg:pb-32">
      <header className="max-w-3xl" data-hero="fade" style={{ ["--m-hero-d" as string]: "140ms" }}>
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="font-editorial mt-5 text-[2.1rem] leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl">
          {doc.title}
        </h1>
        <p className="font-label text-muted-foreground mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
          <span>
            {t.effective}{" "}
            <time dateTime={LEGAL_EFFECTIVE.iso}>{LEGAL_EFFECTIVE[locale]}</time>
          </span>
          <span>
            {t.updated} <time dateTime={updated.iso}>{updated[locale]}</time>
          </span>
        </p>
        {doc.notice ? (
          <div
            className="border-hairline bg-muted/60 text-foreground/90 mt-6 rounded-xl border px-4 py-3 text-sm leading-relaxed [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: doc.notice }}
          />
        ) : null}
      </header>

      {doc.summary ? (
        <aside
          data-m="fade"
          aria-label={doc.summaryTitle}
          className="border-brand/30 bg-brand/[0.07] relative mt-10 max-w-3xl overflow-hidden rounded-2xl border p-6 sm:p-8 dark:bg-brand/10"
        >
          <div className="text-brand-ink flex items-center gap-2 text-sm font-semibold">
            <Sparkles aria-hidden="true" className="size-4" />
            <p className="font-label m-0 tracking-tight">{doc.summaryTitle}</p>
          </div>
          <div
            className="lu-summary mt-4"
            dangerouslySetInnerHTML={{ __html: doc.summary }}
          />
        </aside>
      ) : null}

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:order-first">
          <details className="border-hairline rounded-xl border px-4 py-3 lg:hidden">
            <summary className="font-label cursor-pointer text-sm select-none">
              {t.tocShort}
            </summary>
            <div className="mt-3">
              <LegalToc items={doc.toc} label={t.toc} />
            </div>
          </details>
          <div className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block">
            <p className="font-label text-muted-foreground mb-3 text-xs tracking-tight">
              {t.toc}
            </p>
            <LegalToc items={doc.toc} label={t.toc} />
          </div>
        </div>

        <div className="min-w-0">
          <article
            className="lu-legal max-w-3xl"
            dangerouslySetInnerHTML={{ __html: doc.body }}
          />
          {children}
          <p className="border-hairline text-muted-foreground mt-14 max-w-3xl border-t pt-6 text-sm">
            {t.contactLine}{" "}
            <a
              href={`mailto:${t.contact}`}
              className="text-foreground underline decoration-current/30 underline-offset-4"
            >
              {t.contact}
            </a>
          </p>
        </div>
      </div>

      <nav
        data-m="rule-top"
        aria-label={t.others}
        className="border-hairline mt-16 max-w-3xl border-t pt-10 lg:mt-20 lg:max-w-none"
      >
        <h2 className="font-label text-muted-foreground mb-5 text-xs font-normal tracking-tight">
          {t.others}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEGAL_DOCS.filter((d) => d.slug !== slug).map((d) => (
            <li key={d.slug}>
              <Link
                href={d.path}
                className="group border-hairline hover:border-brand/40 hover:bg-brand/[0.04] flex h-full flex-col gap-1.5 rounded-xl border p-4 transition-colors"
              >
                <span className="flex items-center justify-between gap-2 text-[15px] font-medium">
                  {d.label[locale]}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
                <span className="text-muted-foreground text-[13px] leading-snug">
                  {d.description[locale]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
