"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { DeviceMockup } from "./device-mockup";
import { Eyebrow } from "./eyebrow";
import { LensText } from "./lens";
import { LiveRegion, Reveal } from "./reveal";
import {
  TEMPLATE_COPY,
  TEMPLATES,
  type TemplateItem,
  templateStartHref,
} from "./templates-data";

function TemplateActions({
  item,
  compact = false,
}: {
  item: TemplateItem;
  compact?: boolean;
}) {
  const locale = useLocale();
  const t = TEMPLATE_COPY[locale];
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        compact && "sm:flex-col sm:items-stretch",
      )}
    >
      <Link
        href={templateStartHref(item.slug)}
        className={cn(
          "group bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-opacity hover:opacity-90",
          compact ? "h-11 px-5 text-sm" : "h-12 px-6 text-[15px]",
        )}
      >
        {t.start}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group border-foreground/20 hover:border-foreground/45 inline-flex items-center justify-center gap-2 rounded-full border whitespace-nowrap transition-colors",
          compact ? "h-11 px-5 text-sm" : "h-12 px-6 text-[15px]",
        )}
      >
        {t.demo}
        <span className="sr-only"> ({t.newTab})</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </div>
  );
}

/** Homepage: the three templates as large editorial rows with devices. */
export function Templates() {
  const locale = useLocale();
  const t = TEMPLATE_COPY[locale];

  return (
    <LiveRegion
      as="section"
      id="templates"
      labelledBy="templates-title"
      className="font-editorial border-hairline relative border-t py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <Reveal className="mb-14 grid gap-8 lg:mb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:gap-16">
          <div>
            <Eyebrow className="mb-6">{t.eyebrow}</Eyebrow>
            <LensText
              as="h2"
              id="templates-title"
              className="font-editorial text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]"
            >
              {t.title}
              <br />
              <span className="text-muted-foreground">{t.titleMuted}</span>
            </LensText>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
            {t.lead}
          </p>
        </Reveal>

        <ol className="border-hairline border-t">
          {TEMPLATES.map((item, i) => {
            const c = item.copy[locale];
            const flip = i % 2 === 1;
            return (
              <li key={item.slug} className="border-hairline border-b">
                <article className="grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
                  <Reveal
                    className={cn(
                      "lg:col-span-5",
                      flip && "lg:order-2 lg:col-start-8",
                    )}
                  >
                    <div className="font-label text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <span>T{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className="bg-foreground/20 h-px w-8"
                        aria-hidden="true"
                      />
                      <span>{c.industry}</span>
                    </div>
                    <span className="font-label border-brand/40 text-brand-ink bg-brand/[0.06] mt-5 inline-flex rounded-full border px-3 py-1 text-[11px]">
                      {t.badge}
                    </span>
                    <h3 className="font-editorial mt-5 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] font-normal tracking-[-0.04em]">
                      {item.name}
                    </h3>
                    <LensText
                      as="p"
                      className="text-foreground/70 mt-3 w-fit text-lg italic"
                    >
                      “{c.tagline}”
                    </LensText>
                    <p className="text-muted-foreground mt-5 max-w-md text-lg leading-relaxed text-pretty">
                      {c.body}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {c.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-[15px]"
                        >
                          <span
                            aria-hidden="true"
                            className="bg-brand size-1.5 shrink-0 rounded-full"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9">
                      <TemplateActions item={item} />
                    </div>
                  </Reveal>
                  <Reveal
                    delay={120}
                    className={cn(
                      "lg:col-span-7",
                      flip && "lg:order-1 lg:col-start-1",
                    )}
                  >
                    <DeviceMockup
                      domain={item.domain}
                      desktop={item.desktop}
                      mobile={item.mobile}
                      mobileSize={{ width: 390, height: 3600 }}
                      alt={`${item.name}, ${c.industry}`}
                      flip={flip}
                    />
                  </Reveal>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </LiveRegion>
  );
}

/** /projects: the same templates as a compact group of cards. */
export function TemplateCards() {
  const locale = useLocale();
  const t = TEMPLATE_COPY[locale];

  return (
    <section
      aria-labelledby="project-templates-title"
      className="font-editorial container mt-24 max-w-6xl"
    >
      <div className="mb-10 text-center">
        <Eyebrow center className="mb-4">
          {t.eyebrow}
        </Eyebrow>
        <h2
          id="project-templates-title"
          className="font-editorial text-3xl font-normal tracking-[-0.03em] sm:text-4xl"
        >
          {t.title}
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl leading-relaxed">
          {t.lead}
        </p>
      </div>
      <ul className="bg-hairline border-hairline grid gap-px border md:grid-cols-3">
        {TEMPLATES.map((item) => {
          const c = item.copy[locale];
          return (
            <li key={item.slug} className="bg-background flex flex-col p-5">
              {/* eslint-disable-next-line @next/next/no-img-element -- responsive capture via srcSet */}
              <img
                src={`${item.desktop}-720.webp`}
                srcSet={`${item.desktop}-720.webp 720w, ${item.desktop}-1440.webp 1440w`}
                sizes="(min-width: 768px) 33vw, 92vw"
                width={720}
                height={450}
                alt={`${item.name}, ${c.industry}`}
                loading="lazy"
                decoding="async"
                className="border-hairline aspect-[16/10] w-full border object-cover object-top"
              />
              <span className="font-label border-brand/40 text-brand-ink mt-5 inline-flex self-start rounded-full border px-2.5 py-0.5 text-[11px]">
                {t.badge}
              </span>
              <h3 className="font-editorial mt-3 text-2xl font-normal tracking-[-0.025em]">
                {item.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">{c.industry}</p>
              <ul className="text-foreground/75 mt-4 flex-1 space-y-1.5 text-sm">
                {c.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="bg-brand size-1 shrink-0 rounded-full"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <TemplateActions item={item} compact />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
