"use client";

import { type FormEvent, useId, useRef, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  LayoutTemplate,
} from "lucide-react";

import { PreviewIcon } from "@/components/brand/preview-icon";
import { loadLevelUpTransition } from "@/components/brand/levelup-transition";
import { PROMPT_MAX, promptSchema } from "@/lib/form-schema";
import { LEVELSTUDIO_URL } from "@/lib/levelup-login";
import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const MAX = PROMPT_MAX;

const COPY: Record<
  Locale,
  {
    label: string;
    placeholder: string;
    hint: string;
    send: string;
    start: string;
    preview: string;
    call: string;
    templates: string;
  }
> = {
  en: {
    label: "Describe your business",
    placeholder: "Describe your business in one sentence…",
    hint: "Free preview in LevelStudio",
    send: "Get my free preview",
    start: "Start your project",
    preview: "Free preview",
    call: "Book a call",
    templates: "See templates",
  },
  fr: {
    label: "Décrivez votre activité",
    placeholder: "Décrivez votre activité en une phrase…",
    hint: "Aperçu gratuit dans LevelStudio",
    send: "Obtenir mon aperçu gratuit",
    start: "Lancer mon projet",
    preview: "Aperçu gratuit",
    call: "Prendre rendez-vous",
    templates: "Voir les modèles",
  },
};

/** Opens LevelStudio with the brief, through the signature transition. */
async function openStudio(prompt: string) {
  const url = `${LEVELSTUDIO_URL}/?prompt=${encodeURIComponent(prompt)}`;
  const api = await loadLevelUpTransition();
  if (api) await api.go(url);
  else window.location.assign(url);
}

const pill =
  "lu-press lu-glass group inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] text-foreground/85 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-sec-ring focus-visible:outline-none";

/**
 * Hero prompt: a glass box where visitors describe their business; sending
 * opens LevelStudio with the text as its brief (?prompt=), where the free
 * preview is built. Pills below lead to the other ways in.
 */
export function PromptBox({ className }: { className?: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const inputId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const text = value.trim();

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!text || sending) return;
    // Same Zod rules as everywhere: control characters and < > removed,
    // whitespace collapsed, 1 to 500 characters.
    const parsed = promptSchema.safeParse(text);
    if (!parsed.success) return;
    setSending(true);
    void openStudio(parsed.data).finally(() => setSending(false));
  };

  return (
    <div className={className}>
      <form
        ref={formRef}
        onSubmit={submit}
        className="lu-glass rounded-3xl p-2 transition-shadow focus-within:shadow-[0_0_0_4px_rgb(139_92_246/0.14),0_18px_50px_-24px_rgb(76_29_149/0.3)]"
      >
        <label htmlFor={inputId} className="sr-only">
          {t.label}
        </label>
        <textarea
          id={inputId}
          value={value}
          maxLength={MAX}
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t.placeholder}
          className="placeholder:text-foreground/45 text-foreground block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-[17px] leading-relaxed outline-none sm:text-lg"
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <span className="font-label text-muted-foreground inline-flex items-center gap-2 text-[11px] sm:text-xs">
            <PreviewIcon className="text-lu-violet size-3.5" />
            {t.hint}
          </span>
          <button
            type="submit"
            disabled={!text || sending}
            aria-label={t.send}
            title={t.send}
            className="lu-press bg-brand focus-visible:ring-sec-ring/70 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-contrast shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--brand)_80%,transparent)] transition-[opacity,transform] hover:scale-105 focus-visible:ring-4 focus-visible:outline-none active:scale-95 disabled:cursor-default disabled:opacity-45 disabled:hover:scale-100"
          >
            <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2.2} />
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Link
          href="/start-project"
          className="lu-press group bg-foreground text-background focus-visible:ring-sec-ring inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {t.start}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
        <a href={LEVELSTUDIO_URL} className={pill}>
          <PreviewIcon className="text-lu-violet size-4" />
          {t.preview}
        </a>
        <Link href="/contact" className={pill}>
          <CalendarDays aria-hidden="true" className="size-4 opacity-70" />
          {t.call}
        </Link>
        <a href="#templates" className={cn(pill)}>
          <LayoutTemplate aria-hidden="true" className="size-4 opacity-70" />
          {t.templates}
        </a>
      </div>
    </div>
  );
}
