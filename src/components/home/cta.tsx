"use client";

import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PreviewIcon } from "@/components/brand/preview-icon";
import { LEVELSTUDIO_URL } from "@/lib/levelup-login";
import { type Locale, useLocale } from "@/lib/locale";

import { Aurora } from "./aurora";
import { LensText } from "./lens";
import { ParticleStar } from "./particle-star";
import { Reveal } from "./reveal";
import { useInView } from "./use-in-view";

const COPY: Record<
  Locale,
  {
    title: [string, string];
    body: string;
    primary: string;
    secondary: string;
    note: string;
  }
> = {
  en: {
    title: ["Ready to level up", "your business?"],
    body: "Tell us about your project, or see a free preview of your site first. No commitment either way.",
    primary: "Start your project",
    secondary: "Get a free preview",
    note: "We reply within 24 business hours.",
  },
  fr: {
    title: ["Prêt à passer", "au niveau supérieur ?"],
    body: "Parlez-nous de votre projet, ou découvrez d’abord un aperçu gratuit de votre site. Sans engagement.",
    primary: "Lancer mon projet",
    secondary: "Aperçu gratuit",
    note: "Réponse sous 24 h ouvrées.",
  },
};

export function HomeCta() {
  const locale = useLocale();
  const t = COPY[locale];
  const [liveRef, live] = useInView<HTMLDivElement>({ rootMargin: "120px" });

  return (
    <section
      aria-labelledby="cta-title"
      className="font-editorial relative py-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <Reveal>
          <div
            ref={liveRef}
            data-live={live ? "true" : "false"}
            className="border-foreground relative isolate overflow-hidden border"
          >
            <Aurora grid={false} className="opacity-70" />
            <div
              aria-hidden="true"
              className="border-hairline absolute top-0 right-0 size-12 border-b border-l lg:size-20"
            />
            <div
              aria-hidden="true"
              className="border-hairline absolute bottom-0 left-0 size-12 border-t border-r lg:size-20"
            />

            <div className="relative grid items-center gap-6 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-10 lg:px-16 lg:py-20">
              <div className="relative z-10">
                <LensText
                  as="h2"
                  id="cta-title"
                  className="font-editorial text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[0.96] font-normal tracking-[-0.04em]"
                >
                  {t.title[0]}
                  <br />
                  {t.title[1]}
                </LensText>
                <LensText
                  as="p"
                  className="text-muted-foreground mt-7 max-w-xl text-lg leading-relaxed text-pretty lg:text-xl"
                >
                  {t.body}
                </LensText>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/start-project"
                    className="lu-press group bg-foreground text-background inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-medium transition-opacity hover:opacity-90"
                  >
                    {t.primary}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                  <a
                    href={LEVELSTUDIO_URL}
                    className="lu-press group border-foreground/20 hover:border-foreground/40 inline-flex h-14 items-center justify-center gap-2 rounded-full border px-8 text-base font-medium transition-colors"
                  >
                    <PreviewIcon className="text-brand size-[18px]" />
                    {t.secondary}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
                <p className="font-label text-muted-foreground mt-8 text-xs">
                  {t.note}
                </p>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none relative order-first -mt-6 -mb-2 aspect-square w-44 sm:w-56 lg:order-none lg:m-0 lg:w-full"
              >
                <ParticleStar className="h-full w-full" tint={1} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
