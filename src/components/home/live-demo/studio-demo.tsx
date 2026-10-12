"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  Eye,
  Globe,
  Lightbulb,
  ListChecks,
  Maximize2,
  MessagesSquare,
  Monitor,
  PanelRightClose,
  Plus,
  Share2,
  Smartphone,
  Square,
  UserRound,
} from "lucide-react";

import { sora } from "@/app/fonts";
import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import {
  type CamKey,
  type CursorStop,
  type DemoBuild,
  LiveDemo,
  countUpTo,
  useClockValue,
  useCue,
  useFlags,
  typingTimes,
} from "./engine";
import { SalonSite, SITE_WIDTH } from "./studio-site";

/* ---------------------------------------------------------------------------
   Replica of the real LevelStudio (Vite SPA): AppHeader, HomePage hero +
   Composer, StudioPage chat (ChatMessage, StudioActivity, ExpandableText,
   QuestionWizard chips, SiteDeliveryCard, ActivityLog) and InteractiveCanvas.
   Strings are the app's own i18n (src/lib/i18n) and the studio's narration
   (server/pipeline.ts). The one-question round with a "Skip" chip is the
   feature being added to the studio right now: it reuses the wizard's chips.
   The business is fictional.
--------------------------------------------------------------------------- */

type Copy = {
  url: string;
  status: string;
  alt: string;
  brief: string;
  projects: string;
  templates: string;
  signIn: string;
  newProject: string;
  share: string;
  hero: {
    kicker: string;
    before: string;
    word: string;
    after: string;
    sub: string;
  };
  phrase: [string, string];
  placeholder: string;
  inspire: string;
  disclaimer: string;
  tabs: [string, string];
  reading: string;
  question: {
    text: string;
    label: string;
    options: string[];
    own: string;
    skip: string;
  };
  build: { blocks: { kind: "p" | "li"; segs: { t: string; b?: boolean }[] }[] };
  narration: string[];
  steps: number;
  siteReady: string;
  siteName: string;
  siteStyle: string;
  newTab: string;
  preview: string;
  suggestions: string[];
  how: string;
  stepsLabel: string;
  canvasKicker: string;
  browse: string;
  hint: string;
  working: string;
  userAnswerIndex: number;
};

const COPY: Record<Locale, Copy> = {
  en: {
    url: "studio.levelup-ecosystem.com",
    status: "Drafting your preview",
    alt: "LevelStudio: a brief is typed, the studio answers and asks one question, the visitor picks an answer and the website draft builds in the preview.",
    brief: "A website for my hair salon in Lyon, with online booking.",
    projects: "Projects",
    templates: "Templates",
    signIn: "Sign in",
    newProject: "New project",
    share: "Share",
    hero: {
      kicker: "LevelStudio by LevelUp Ecosystem",
      before: "Your",
      word: "boutique",
      after: "website, drafted before you commit.",
      sub: "Describe the business. Answer a few sharp questions. Receive a complete, interactive website draft in minutes — no account required.",
    },
    phrase: ["Describe your ", "project"],
    placeholder: "Ask for a change, or attach a photo or file",
    inspire: "Inspire me",
    disclaimer:
      "Drafts are previews. Final websites are delivered by LevelUp Ecosystem.",
    tabs: ["Chat", "Preview"],
    reading: "Reading your request and what you attached…",
    question: {
      text: "A hair salon in Lyon with online booking: I have what I need for the structure. One choice will shape the whole look, so I would rather ask than guess.",
      label: "Which mood should the site have?",
      options: [
        "Warm and editorial",
        "Clean and minimal",
        "Bold and modern",
        "Natural and organic",
      ],
      own: "My own answer",
      skip: "Skip — let the AI decide",
    },
    build: {
      blocks: [
        {
          kind: "p",
          segs: [
            { t: "Warm and editorial it is. I’m building " },
            { t: "Salon Aurore", b: true },
            { t: ", a hair salon in Lyon, in three pages:" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Home", b: true },
            { t: ": a calm hero and the signature services" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Services", b: true },
            { t: ": cuts, colour and balayage, with prices" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Book", b: true },
            { t: ": pick a day and a slot online" },
          ],
        },
      ],
    },
    narration: [
      "Setting the identity: Playfair Display and DM Sans type. Then the home page: a calm hero, signature services, booking.",
      "Writing the Services page: cuts, colour and balayage with prices.",
      "Writing the Book page: day and time picker, opening hours.",
      "Proofreading every page like a demanding client: copy, consistency, links.",
      "The site is ready.",
    ],
    steps: 5,
    siteReady: "Salon Aurore",
    siteName: "Salon Aurore",
    siteStyle: "Warm editorial: cream, terracotta and a serif voice",
    newTab: "New tab",
    preview: "Preview",
    suggestions: [
      "Add a gallery of recent work",
      "Show opening hours in the footer",
      "Make the booking button stand out",
      "Simplify the mobile menu",
    ],
    how: "How I worked",
    stepsLabel: "5 steps",
    canvasKicker: "LevelUp Ecosystem · Template library",
    browse: "Browse all",
    hint: "Your draft appears here once the brief is complete.",
    working: "Working on your site",
    userAnswerIndex: 0,
  },
  fr: {
    url: "studio.levelup-ecosystem.com",
    status: "Aperçu en préparation",
    alt: "LevelStudio : un brief est saisi, le studio répond et pose une seule question, le visiteur choisit une réponse et le brouillon du site se construit dans l’aperçu.",
    brief:
      "Un site pour mon salon de coiffure à Lyon, avec réservation en ligne.",
    projects: "Projets",
    templates: "Modèles",
    signIn: "Se connecter",
    newProject: "Nouveau projet",
    share: "Partager",
    hero: {
      kicker: "LevelStudio par LevelUp Ecosystem",
      before: "Le site de votre",
      word: "boutique",
      after: "prêt avant même de vous engager.",
      sub: "Décrivez l’entreprise. Répondez à quelques questions précises. Recevez en quelques minutes un brouillon de site complet et interactif, sans créer de compte.",
    },
    phrase: ["Décrivez votre ", "projet"],
    placeholder:
      "Demandez une modification, ou joignez une photo ou un fichier",
    inspire: "Inspirez-moi",
    disclaimer:
      "Les brouillons sont des aperçus. Les sites finaux sont livrés par LevelUp Ecosystem.",
    tabs: ["Discussion", "Aperçu"],
    reading: "Je lis votre demande et ce que vous avez joint…",
    question: {
      text: "Un salon de coiffure à Lyon avec réservation en ligne : j’ai de quoi poser la structure. Un seul choix va déterminer tout le style, alors je préfère demander plutôt que deviner.",
      label: "Quelle ambiance pour le site ?",
      options: [
        "Chaleureuse et éditoriale",
        "Épurée et minimale",
        "Audacieuse et moderne",
        "Naturelle et organique",
      ],
      own: "Ma propre réponse",
      skip: "Passer — laisser l’IA décider",
    },
    build: {
      blocks: [
        {
          kind: "p",
          segs: [
            { t: "Chaleureux et éditorial, c’est noté. Je construis " },
            { t: "Salon Aurore", b: true },
            { t: ", un salon de coiffure à Lyon, en trois pages :" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Accueil", b: true },
            { t: " : une introduction posée et les prestations phares" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Prestations", b: true },
            { t: " : coupes, couleur et balayage, avec les tarifs" },
          ],
        },
        {
          kind: "li",
          segs: [
            { t: "Réserver", b: true },
            { t: " : choisissez un jour et un créneau en ligne" },
          ],
        },
      ],
    },
    narration: [
      "Je pose l’identité : typographies Playfair Display et DM Sans. Puis l’accueil : une intro posée, les prestations phares, la réservation.",
      "J’écris la page Prestations : coupes, couleur et balayage avec les tarifs.",
      "J’écris la page Réserver : choix du jour et de l’heure, horaires.",
      "Je relis chaque page comme un client exigeant : textes, cohérence, liens.",
      "Le site est prêt.",
    ],
    steps: 5,
    siteReady: "Salon Aurore",
    siteName: "Salon Aurore",
    siteStyle:
      "Éditorial chaleureux : crème, terracotta et une voix à empattements",
    newTab: "Nouvel onglet",
    preview: "Aperçu",
    suggestions: [
      "Ajouter une galerie de réalisations",
      "Afficher les horaires dans le pied de page",
      "Mettre en valeur le bouton de réservation",
      "Simplifier le menu mobile",
    ],
    how: "Comment j’ai travaillé",
    stepsLabel: "5 étapes",
    canvasKicker: "LevelUp Ecosystem · Bibliothèque de modèles",
    browse: "Tout parcourir",
    hint: "Votre brouillon apparaîtra ici une fois le brief complété.",
    working: "Votre site est en préparation",
    userAnswerIndex: 0,
  },
};

const plainOf = (blocks: Copy["build"]["blocks"]) =>
  blocks.map((b) => b.segs.map((s) => s.t).join("")).join("");

/* ------------------------------------------------------------------ pieces */

const FACETS: [string, string][] = [
  ["256,278 256,38 202,192", "#BA97FE"],
  ["256,278 256,38 310,192", "#7A31EE"],
  ["256,278 310,192 484,204", "#681FE1"],
  ["256,278 484,204 344,280", "#460DB7"],
  ["256,278 344,280 397,470", "#3A0897"],
  ["256,278 397,470 256,362", "#480DB7"],
  ["256,278 256,362 115,470", "#5C15CC"],
  ["256,278 115,470 168,280", "#6E22E1"],
  ["256,278 168,280 28,204", "#8941F7"],
  ["256,278 28,204 202,192", "#A974FE"],
];

function Mark({
  className,
  working,
}: {
  className?: string;
  working?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn(className, working && "ld-working")}
      aria-hidden="true"
    >
      <g
        className="ld-brackets"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="22"
        strokeLinecap="square"
      >
        <path d="M 64 144 L 64 64 L 144 64" />
        <path d="M 368 64 L 448 64 L 448 144" />
        <path d="M 64 368 L 64 448 L 144 448" />
        <path d="M 368 448 L 448 448 L 448 368" />
      </g>
      <g className="ld-star">
        <g transform="translate(256, 256) scale(0.44) translate(-256, -256)">
          {FACETS.map(([p, f]) => (
            <polygon key={p} points={p} fill={f} />
          ))}
        </g>
      </g>
    </svg>
  );
}

const iconBtn =
  "grid size-9 shrink-0 place-items-center rounded-lg text-slate-400";

function Avatar() {
  return (
    <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-500/80 to-indigo-600/80 text-[12px] font-semibold text-white ring-1 ring-white/10">
      <UserRound className="size-4" />
    </span>
  );
}

function Header({
  c,
  compact,
  title,
  hero,
  siteReady,
}: {
  c: Copy;
  compact: boolean;
  title: string;
  hero: boolean;
  siteReady: boolean;
}) {
  const locale = c.projects === "Projets" ? "fr" : "en";
  return (
    <header className="relative z-10 shrink-0 border-b border-white/[0.07] bg-[#0B0B0D]">
      <div className="flex h-14 items-center justify-between gap-2 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <div className="-ml-1.5 flex h-9 min-w-9 shrink-0 items-center justify-center gap-2 px-1.5">
            <Mark className="size-[22px] shrink-0" />
            <span
              className={cn(
                "text-[15px] font-bold tracking-tight text-white",
                !hero && compact && "hidden",
              )}
              style={{ fontFamily: sora.style.fontFamily }}
            >
              Level<span className="text-violet-400">Studio</span>
            </span>
          </div>
          {!hero && (
            <ol className="flex min-w-0 items-center gap-1 text-[13.5px]">
              {!compact && (
                <>
                  <li aria-hidden="true" className="shrink-0 text-slate-600">
                    <ChevronRight className="size-3.5" />
                  </li>
                  <li className="shrink-0 px-1.5 py-1 text-slate-400">
                    {c.projects}
                  </li>
                </>
              )}
              <li aria-hidden="true" className="shrink-0 text-slate-600">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="min-w-0 flex-1">
                <span
                  key={title}
                  className="ld-rise block truncate px-1.5 font-medium text-white"
                >
                  {title}
                </span>
              </li>
            </ol>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {hero && !compact && (
            <nav className="mr-1 flex items-center gap-1 text-[13px] text-slate-300">
              <span className="inline-flex h-9 items-center rounded-full px-3">
                {c.templates}
              </span>
              <span className="inline-flex h-9 items-center rounded-full px-3">
                {c.projects}
              </span>
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full px-3">
                LevelUp Ecosystem <ArrowUpRight className="size-3.5" />
              </span>
            </nav>
          )}
          {hero && !compact && (
            <span className="mr-1 inline-flex h-9 items-center rounded-lg bg-white px-4 text-[13px] font-semibold text-[#0B0B0D]">
              {c.signIn}
            </span>
          )}
          {!hero && !compact && (
            <>
              <span className={iconBtn}>
                <Plus className="size-[18px]" />
              </span>
              <span className={cn(iconBtn, !siteReady && "opacity-35")}>
                <ArrowUpRight className="size-[18px]" />
              </span>
              <span className={iconBtn}>
                <PanelRightClose className="size-[18px]" />
              </span>
              <span
                className={cn(
                  "ml-1 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[13px] font-medium text-slate-200",
                  !siteReady && "opacity-35",
                )}
              >
                <Share2 className="size-4" /> {c.share}
              </span>
            </>
          )}
          {!hero && compact && (
            <span
              className={cn(
                "grid size-11 place-items-center text-slate-400",
                !siteReady && "opacity-35",
              )}
            >
              <Share2 className="size-[18px]" />
            </span>
          )}
          {!compact && (
            <span className="mr-0.5 inline-flex shrink-0 items-center rounded-lg border border-white/10 p-0.5">
              {(["en", "fr"] as const).map((l) => (
                <span
                  key={l}
                  className={cn(
                    "grid h-7 min-w-8 place-items-center rounded-md px-2 text-[11.5px] font-medium tracking-wide uppercase",
                    l === locale ? "bg-white text-[#0B0B0D]" : "text-slate-400",
                  )}
                >
                  {l}
                </span>
              ))}
            </span>
          )}
          <Avatar />
        </div>
      </div>
    </header>
  );
}

/** Inline **bold** and the list of the studio's Markdown, revealed char by char. */
function Md({
  blocks,
  count,
}: {
  blocks: Copy["build"]["blocks"];
  count: number;
}) {
  let left = count;
  const out: ReactNode[] = [];
  let list: ReactNode[] = [];
  const flush = () => {
    if (list.length) {
      out.push(
        <ul
          key={`ul${out.length}`}
          className="my-2 list-disc space-y-1.5 pl-5 marker:text-[#7f8fa6]"
        >
          {list}
        </ul>,
      );
      list = [];
    }
  };
  blocks.forEach((b, bi) => {
    if (left <= 0) return;
    const segs = b.segs.map((s, si) => {
      const text = s.t.slice(0, Math.max(0, left));
      left -= s.t.length;
      if (!text) return null;
      return s.b ? (
        <strong key={si} className="font-semibold text-white">
          {text}
        </strong>
      ) : (
        <span key={si}>{text}</span>
      );
    });
    if (b.kind === "li") {
      list.push(
        <li key={bi} className="leading-relaxed">
          {segs}
        </li>,
      );
    } else {
      flush();
      out.push(
        <p key={bi} className="my-1.5 leading-relaxed">
          {segs}
        </p>,
      );
    }
  });
  flush();
  return <div className="text-[15px] text-slate-200">{out}</div>;
}

function Streamed({
  text,
  times,
  start,
}: {
  text: string;
  times: number[];
  start: number;
}) {
  const n = useClockValue((t) => countUpTo(times, t - start));
  return (
    <div className="relative text-[14px] leading-relaxed text-slate-200">
      {/* The final text is laid out (hidden) from the start, so typing never moves anything. */}
      <div className="invisible text-[15px] text-slate-200" aria-hidden="true">
        <p className="my-1.5 leading-relaxed">{text}</p>
      </div>
      <div className="absolute inset-0 text-[15px] text-slate-200">
        <p className="my-1.5 leading-relaxed">{text.slice(0, n)}</p>
      </div>
    </div>
  );
}

function StreamedMd({
  blocks,
  times,
  start,
}: {
  blocks: Copy["build"]["blocks"];
  times: number[];
  start: number;
}) {
  const n = useClockValue((t) => countUpTo(times, t - start));
  return (
    <div className="relative text-[14px] leading-relaxed text-slate-200">
      <div className="invisible" aria-hidden="true">
        <Md blocks={blocks} count={Infinity} />
      </div>
      <div className="absolute inset-0">
        <Md blocks={blocks} count={n} />
      </div>
    </div>
  );
}

/** One status line, typed in, one row with a chevron when it overflows. */
function Narration({
  lines,
  starts,
  compact,
}: {
  lines: string[];
  starts: number[];
  compact: boolean;
}) {
  const idx = useClockValue((t) => {
    let i = -1;
    while (i + 1 < starts.length && t >= starts[i + 1]) i++;
    return i;
  });
  const line = lines[Math.max(0, idx)];
  const times = useMemo(() => typingTimes(line, 7, false), [line]);
  const start = starts[Math.max(0, idx)];
  const n = useClockValue((t) => countUpTo(times, t - start));
  const shown = line.slice(0, n);
  const long = line.length > (compact ? 34 : 46);
  return (
    <div key={idx} className="ld-rise flex min-w-0 flex-1 items-start gap-1">
      <div className="line-clamp-1 min-w-0 flex-1 overflow-hidden text-[13px] leading-snug text-slate-400">
        {shown}
      </div>
      {long && n > 30 && (
        <span className="-my-1 grid size-6 shrink-0 place-items-center rounded-full text-[#7f8fa6]">
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </div>
  );
}

function Journey({ done, total }: { done: number; total: number }) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 text-[11.5px] text-slate-400 tabular-nums">
      <ListChecks className="size-3.5" />
      {done}/{total}
    </span>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="ld-rise flex flex-col items-end gap-2">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-3 text-[14px] leading-relaxed [overflow-wrap:anywhere] whitespace-pre-wrap text-slate-100">
        {text}
      </div>
    </div>
  );
}

function Assistant({
  working,
  children,
}: {
  working?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="ld-rise flex gap-3">
      <Mark
        className={cn("size-5 shrink-0", working ? "mt-0.5" : "mt-1")}
        working={working}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ScrollStack({
  watch,
  compact,
  overlay,
  children,
}: {
  watch: string;
  compact: boolean;
  /** Sits over the bottom of the chat; the messages scroll up above it. */
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const ov = useRef<HTMLDivElement>(null);
  const cue = useCue("chat");
  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const reserve = ov.current?.offsetHeight ?? 0;
    const over = Math.max(0, i.offsetHeight - (b.clientHeight - reserve));
    i.style.transform = `translate3d(0, ${-over}px, 0)`;
  }, [watch]);
  return (
    <div
      ref={(el) => {
        box.current = el;
        cue(el);
      }}
      className="relative min-h-0 flex-1 overflow-hidden"
    >
      <div
        ref={inner}
        className={cn("space-y-7 py-6", compact ? "px-4" : "px-6")}
        style={{ transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {children}
      </div>
      {overlay && (
        <div ref={ov} className="absolute inset-x-0 bottom-0 px-3 pb-3">
          {overlay}
        </div>
      )}
    </div>
  );
}

function Panel({
  c,
  compact,
  picked,
  hover,
}: {
  c: Copy;
  compact: boolean;
  picked: boolean;
  hover: boolean;
}) {
  const q = c.question;
  const cueChip = useCue("chip");
  const cuePanel = useCue("panel");
  const chip =
    "inline-flex max-w-full items-center gap-2 border text-left font-normal transition-[background-color,border-color,color] duration-200";
  const size = compact
    ? "min-h-11 px-3.5 py-2 text-[14px]"
    : "px-3 py-2 text-[13px]";
  return (
    <div
      ref={cuePanel}
      className="ld-rise flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111114]"
    >
      <div className="px-4 py-4">
        <p className="text-[15px] leading-snug font-semibold text-white">
          {q.label}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((opt, i) => {
            const active = i === 0 && picked;
            return (
              <span
                key={opt}
                ref={i === 0 ? cueChip : undefined}
                className={cn(
                  chip,
                  size,
                  "rounded-full",
                  active
                    ? "border-white/60 bg-white/[0.08] text-white"
                    : i === 0 && hover
                      ? "border-white/30 bg-white/[0.02] text-slate-100"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                    active ? "border-white bg-white" : "border-white/20",
                  )}
                >
                  {active && <Check className="size-2.5 text-[#141420]" />}
                </span>
                {opt}
              </span>
            );
          })}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/12 text-slate-400",
              compact
                ? "min-h-11 px-3.5 py-2 text-[14px]"
                : "px-3 py-2 text-[13px]",
            )}
          >
            <Plus className="size-3" /> {q.own}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-dashed border-violet-400/30 text-violet-200/90",
              compact
                ? "min-h-11 px-3.5 py-2 text-[14px]"
                : "px-3 py-2 text-[13px]",
            )}
          >
            {q.skip}
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Composer({
  c,
  compact,
  busy,
}: {
  c: Copy;
  compact: boolean;
  busy: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141416] px-3 pt-1 pb-2">
      <div className="relative">
        <div className="h-[60px] px-2 pt-3 text-[15px] leading-relaxed text-slate-100" />
        <span
          className={cn(
            "pointer-events-none absolute top-3 left-2 max-w-[94%] truncate text-[#7f8fa6]",
            compact ? "text-[16px]" : "text-[15px]",
          )}
        >
          {c.placeholder}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="grid size-8 place-items-center rounded-full text-slate-400">
            <Plus className="size-[18px]" />
          </span>
          {!compact && (
            <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[12.5px] text-slate-400">
              <Lightbulb className="size-3.5" /> {c.inspire}
            </span>
          )}
        </div>
        {busy ? (
          <span className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-slate-200">
            <Square className="size-3.5 fill-current" />
          </span>
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-white/8 text-[#7f8fa6]">
            <ArrowUp className="size-[18px]" />
          </span>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- the hero */

function Hero({
  c,
  compact,
  typedTimes,
  typeStart,
  sendHover,
}: {
  c: Copy;
  compact: boolean;
  typedTimes: number[];
  typeStart: number;
  sendHover: boolean;
}) {
  const n = useClockValue((t) => countUpTo(typedTimes, t - typeStart));
  const wordTimes = useMemo(
    () => typingTimes(c.hero.word, 90, false),
    [c.hero.word],
  );
  const w = useClockValue((t) => countUpTo(wordTimes, t - 250));
  const cueComposer = useCue("composer-hero");
  const cueSend = useCue("send");
  const typed = c.brief.slice(0, n);
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center text-center",
        compact ? "px-5 pt-7" : "px-8 pt-[72px]",
      )}
    >
      <p className="text-[12px] font-medium tracking-[0.2em] text-[#7f8fa6] uppercase">
        {c.hero.kicker}
      </p>
      <p
        className={cn(
          "mt-5 max-w-[820px] font-semibold tracking-tight text-white",
          compact ? "text-[30px] leading-[1.08]" : "text-[60px] leading-[1.08]",
        )}
        style={{ fontFamily: sora.style.fontFamily }}
      >
        {c.hero.before}{" "}
        <span className="text-slate-400">{c.hero.word.slice(0, w)}</span>
        <span className="ld-caret ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] bg-slate-400 align-baseline" />
        <br />
        {c.hero.after}
      </p>
      <p
        className={cn(
          "mt-5 max-w-[560px] leading-relaxed text-slate-400",
          compact ? "text-[14px]" : "text-[16px]",
        )}
      >
        {c.hero.sub}
      </p>
      <div
        className={cn(
          "w-full max-w-[760px] text-left",
          compact ? "mt-6" : "mt-10",
        )}
      >
        <div
          ref={cueComposer}
          className="rounded-2xl border border-white/25 bg-[#141416] px-3 pt-1 pb-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
        >
          <div className="relative">
            <div
              className={cn(
                "min-h-[72px] px-2 pt-3 leading-relaxed text-slate-100",
                compact ? "text-[16px]" : "text-[15px]",
              )}
            >
              {typed}
              <span className="ld-caret ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-slate-100" />
            </div>
            {n === 0 && (
              <span
                className={cn(
                  "pointer-events-none absolute top-3 left-2 max-w-[94%] truncate text-[#7f8fa6]",
                  compact ? "text-[16px]" : "text-[15px]",
                )}
              >
                {c.phrase[0]}
                <strong className="font-semibold text-slate-300">
                  {c.phrase[1]}
                </strong>
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="grid size-8 place-items-center rounded-full text-slate-400">
                <Plus className="size-[18px]" />
              </span>
              {!compact && (
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] text-slate-400">
                  <Lightbulb className="size-3.5" /> {c.inspire}
                </span>
              )}
            </div>
            <span
              ref={cueSend}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-all duration-200",
                n >= c.brief.length
                  ? sendHover
                    ? "bg-slate-200 text-[#0B0B0D]"
                    : "bg-white text-[#0B0B0D]"
                  : "bg-white/8 text-[#7f8fa6]",
              )}
            >
              <ArrowUp className="size-[18px]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- canvas */

function CanvasStage({
  c,
  compact,
  f,
  tl,
  locale,
}: {
  c: Copy;
  compact: boolean;
  f: Flags;
  tl: Times;
  locale: Locale;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const cue = useCue("canvas");
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = stage.current;
    if (el) setSize({ w: el.clientWidth, h: el.clientHeight });
  }, []);
  const width = compact ? SITE_WIDTH.phone : SITE_WIDTH.desktop;
  const k = size.w / width;
  const viewport = size.h / (k || 1);
  return (
    <div
      ref={(el) => {
        stage.current = el;
        cue(el);
      }}
      className="relative min-h-0 flex-1 overflow-hidden bg-[#F6F6F4]"
    >
      {!f.site && (
        <div
          className="ld-fade absolute inset-0 flex flex-col"
          style={{ opacity: f.generating ? 0.35 : 1 }}
        >
          <div className="flex items-center justify-between px-6 pt-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              {c.canvasKicker}
            </p>
            {!compact && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3.5 py-1.5 text-[12px] font-medium text-slate-700">
                {c.browse} <ArrowUpRight className="size-3.5" />
              </span>
            )}
          </div>
          <div className="mx-6 mt-4 min-h-0 flex-1 overflow-hidden rounded-t-xl border border-b-0 border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]" />
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-slate-900" />
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="size-1.5 rounded-full bg-slate-300" />
              ))}
            </div>
            <p className="text-[11.5px] text-slate-500">{c.hint}</p>
          </div>
        </div>
      )}

      {f.sitePane && size.w > 0 && (
        <div
          className="absolute top-0 left-0 origin-top-left overflow-hidden"
          style={{
            width,
            height: viewport,
            transform: `scale(${k})`,
          }}
        >
          <SalonSite
            locale={locale}
            narrow={compact}
            on={f.site}
            scrollFrom={tl.scrollFrom}
            scrollTo={tl.scrollTo}
            viewport={viewport}
          />
        </div>
      )}

      {f.generating && !f.site && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4">
          <div className="ld-drop flex max-w-full items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-[13px] text-slate-700 shadow-lg">
            <Mark className="size-4 shrink-0" working />
            <span className="min-w-0 truncate font-medium">
              <CanvasStatus c={c} tl={tl} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function CanvasStatus({ c, tl }: { c: Copy; tl: Times }) {
  const idx = useClockValue((t) => {
    let i = 0;
    while (i + 1 < tl.narr.length && t >= tl.narr[i + 1]) i++;
    return i;
  });
  const short = [
    c.working,
    ...c.narration.slice(1, 4).map((s) => s.split(":")[0]),
  ];
  return <>{idx === 0 ? c.working : short[Math.min(idx, short.length - 1)]}</>;
}

function Canvas(props: {
  c: Copy;
  compact: boolean;
  f: Flags;
  tl: Times;
  locale: Locale;
  title: string;
}) {
  const { compact, f, title } = props;
  if (compact) return <CanvasStage {...props} />;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white text-slate-800 shadow-2xl">
      <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Mark className="size-4 shrink-0" />
          <span
            key={title}
            className="ld-rise min-w-0 truncate rounded-md px-2 py-1 text-[13.5px] font-medium text-slate-800"
          >
            {title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <div className="mr-1 flex items-center rounded-lg border border-slate-200 p-0.5">
            <span className="grid size-8 place-items-center rounded-md bg-slate-900 text-white">
              <Monitor className="size-3.5" />
            </span>
            <span className="grid size-8 place-items-center rounded-md text-slate-500">
              <Smartphone className="size-3.5" />
            </span>
          </div>
          {[ArrowUpRight, Share2, Maximize2].map((Icon, i) => (
            <span
              key={i}
              className={cn(
                "grid size-9 place-items-center rounded-md text-slate-500 transition-opacity duration-300",
                !f.site && i < 2 && "opacity-30",
              )}
            >
              <Icon className="size-4" />
            </span>
          ))}
        </div>
      </header>
      <CanvasStage {...props} />
    </div>
  );
}

/* ----------------------------------------------------------------- script */

type Times = ReturnType<typeof makeTimes>;
type Flags = Record<
  | "studio"
  | "heroGone"
  | "user1"
  | "read"
  | "qStart"
  | "qEnd"
  | "panel"
  | "hoverChip"
  | "picked"
  | "panelOut"
  | "user2"
  | "generating"
  | "ready"
  | "unseen"
  | "sitePane"
  | "site"
  | "hoverSend"
  | "tabHover"
  | "log",
  boolean
>;

function makeTimes(c: Copy) {
  const briefTimes = typingTimes(c.brief, 37);
  const typeStart = 900;
  const typeEnd = typeStart + briefTimes[briefTimes.length - 1];
  const sendClick = typeEnd + 1100;
  const S = sendClick + 250;
  const qPlain = c.question.text;
  const qTimes = typingTimes(qPlain, 10, false);
  const qStart = S + 1300;
  const qEnd = qStart + qTimes[qTimes.length - 1];
  const panel = qEnd + 450;
  const chipClick = panel + 1500;
  const G = chipClick + 800;
  const aPlain = plainOf(c.build.blocks);
  const aTimes = typingTimes(aPlain, 12, false);
  const narr = [G, G + 1000, G + 2000, G + 3000, G + 3900];
  const R = G + 4600;
  const sh = 1200;
  const siteAt = R + sh;
  return {
    briefTimes,
    typeStart,
    typeEnd,
    sendClick,
    S,
    qTimes,
    qStart,
    qEnd,
    panel,
    hoverChip: panel + 800,
    chipClick,
    G,
    aTimes,
    aStart: G + 300,
    narr,
    R,
    sh,
    siteAt,
    scrollFrom: siteAt + 3000,
    scrollTo: siteAt + 5800,
    end: siteAt + 7200,
    finalAt: siteAt + 2700,
  };
}

function Scene({
  c,
  compact,
  tl,
  locale,
}: {
  c: Copy;
  compact: boolean;
  tl: Times;
  locale: Locale;
}) {
  const f = useFlags({
    studio: tl.S,
    heroGone: tl.S + 700,
    user1: tl.S + 250,
    read: tl.S + 700,
    qStart: tl.qStart,
    qEnd: tl.qEnd,
    panel: tl.panel,
    hoverChip: tl.hoverChip,
    picked: tl.chipClick,
    panelOut: tl.chipClick + 450,
    user2: tl.chipClick + 600,
    generating: tl.G,
    ready: tl.R,
    unseen: tl.R + 200,
    sitePane: compact ? tl.siteAt - 600 : tl.G,
    site: tl.siteAt,
    hoverSend: tl.sendClick - 500,
    tabHover: tl.R + 800,
    log: tl.R + 500,
  }) as Flags;
  const doneSteps = useClockValue((t) => {
    const marks = [tl.G, tl.narr[1], tl.narr[2], tl.narr[3], tl.narr[4]];
    let n = 0;
    while (n < marks.length && t >= marks[n]) n++;
    return n;
  });
  const pane: "chat" | "preview" = compact && f.site ? "preview" : "chat";
  const title = f.generating ? c.siteName : c.newProject;
  const busy = (f.read && !f.qEnd) || (f.generating && !f.ready);
  const aBlocks = c.build.blocks;
  const cueTab = useCue("tab-preview");
  const cueDelivery = useCue("delivery");

  const chat = (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-col",
        compact ? "flex-1" : "w-[460px] shrink-0 border-r border-white/[0.06]",
      )}
    >
      <ScrollStack
        compact={compact}
        overlay={
          f.panel && !f.panelOut ? (
            <Panel
              c={c}
              compact={compact}
              picked={f.picked}
              hover={f.hoverChip}
            />
          ) : null
        }
        watch={`${f.user1}${f.read}${f.qEnd}${f.panel}${f.panelOut}${f.user2}${f.generating}${f.ready}${f.log}${doneSteps}`}
      >
        {f.user1 && <UserBubble text={c.brief} />}

        {f.read && (
          <Assistant working={!f.qEnd}>
            {f.qStart && (
              <div className="mb-2">
                <Streamed
                  text={c.question.text}
                  times={tl.qTimes}
                  start={tl.qStart}
                />
              </div>
            )}
            {!f.qEnd && (
              <div className="flex items-start gap-3">
                <Narration
                  lines={[c.reading]}
                  starts={[tl.S + 700]}
                  compact={compact}
                />
              </div>
            )}
          </Assistant>
        )}

        {f.user2 && <UserBubble text={c.question.options[c.userAnswerIndex]} />}

        {f.generating && (
          <Assistant working={!f.ready}>
            <div className="mb-2">
              <StreamedMd
                blocks={aBlocks}
                times={tl.aTimes}
                start={tl.aStart}
              />
            </div>
            {!f.ready ? (
              <div className="flex items-start gap-3">
                <Narration
                  lines={c.narration}
                  starts={tl.narr}
                  compact={compact}
                />
                <Journey done={doneSteps} total={c.steps} />
              </div>
            ) : (
              <div className="ld-rise mt-4 space-y-3">
                <div
                  ref={cueDelivery}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-200">
                      <Globe className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-white">
                        {c.siteName}
                      </p>
                      <p className="truncate text-[11.5px] text-[#7f8fa6]">
                        {c.siteStyle}
                      </p>
                    </div>
                  </div>
                  {compact ? (
                    <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold text-[#0B0B0D]">
                      <Eye className="size-4" /> {c.preview}
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-1.5 text-[12px] font-medium text-slate-200">
                      {c.newTab} <ArrowUpRight className="size-3.5" />
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "flex flex-wrap",
                    compact ? "gap-2" : "gap-1.5",
                  )}
                >
                  {c.suggestions.map((s) => (
                    <span
                      key={s}
                      className={cn(
                        "rounded-full border border-white/10 text-left text-slate-400",
                        compact
                          ? "min-h-11 px-3.5 py-2 text-[13px]"
                          : "px-3 py-1 text-[12px]",
                      )}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {f.log && (
                  <div className="ld-rise mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-slate-400">
                    <ChevronRight className="size-3.5" />
                    <span className="underline decoration-white/15 underline-offset-4">
                      {c.how}
                    </span>
                    <span className="text-[#7f8fa6]">· {c.stepsLabel}</span>
                  </div>
                )}
              </div>
            )}
          </Assistant>
        )}
      </ScrollStack>

      <div className="shrink-0 border-t border-white/[0.06] px-3 pt-3 pb-3">
        <Composer c={c} compact={compact} busy={busy} />
        {!compact && (
          <p className="mt-2 text-center text-[11px] text-[#7f8fa6]">
            {c.disclaimer}
          </p>
        )}
      </div>
    </section>
  );

  const canvas = (
    <Canvas
      c={c}
      compact={compact}
      f={f}
      tl={tl}
      locale={locale}
      title={title}
    />
  );

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#0B0B0D] text-slate-100"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, sans-serif" }}
    >
      <Header
        c={c}
        compact={compact}
        title={title}
        hero={!f.heroGone}
        siteReady={f.ready}
      />
      {compact && (
        <div
          className="ld-fade px-3 pb-2"
          style={{ opacity: f.heroGone ? 1 : 0 }}
        >
          <div className="mx-auto flex max-w-md gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
            {(["chat", "preview"] as const).map((id, i) => (
              <span
                key={id}
                ref={id === "preview" ? cueTab : undefined}
                className={cn(
                  "relative inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] text-[14px] font-medium transition-colors duration-200",
                  pane === id
                    ? "bg-white text-[#0B0B0D] shadow-sm"
                    : "text-slate-400",
                )}
              >
                {id === "chat" ? (
                  <MessagesSquare className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                {c.tabs[i]}
                {id === "preview" && f.unseen && pane !== "preview" && (
                  <span className="absolute top-2.5 right-4 size-2 rounded-full bg-violet-400" />
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1">
        {/* hero (the studio's home) */}
        {!f.heroGone && (
          <div
            className="ld-fade absolute inset-0 z-[5] overflow-hidden bg-[#0B0B0D]"
            style={{ opacity: f.studio ? 0 : 1 }}
          >
            <Hero
              c={c}
              compact={compact}
              typedTimes={tl.briefTimes}
              typeStart={tl.typeStart}
              sendHover={f.hoverSend}
            />
          </div>
        )}

        {compact ? (
          pane === "chat" ? (
            chat
          ) : (
            <section className="ld-rise flex min-h-0 min-w-0 flex-1 flex-col">
              {canvas}
            </section>
          )
        ) : (
          <>
            {chat}
            <aside className="min-w-0 flex-1 p-3">{canvas}</aside>
          </>
        )}
      </div>
    </div>
  );
}

function build(c: Copy, locale: Locale, compact: boolean): DemoBuild {
  const tl = makeTimes(c);
  const mid: [number, number] = [0.5, 0.5];
  const camera: CamKey[] = compact
    ? [
        { t: 0, z: 1, f: mid },
        { t: 700, z: 1, f: mid },
        { t: 1500, z: 1.05, f: "composer-hero" },
        { t: tl.sendClick + 300, z: 1.05, f: "composer-hero" },
        { t: tl.S + 1200, z: 1, f: mid },
        { t: tl.panel + 300, z: 1.05, f: "panel" },
        { t: tl.chipClick + 700, z: 1.05, f: "panel" },
        { t: tl.G + 1600, z: 1, f: mid },
        { t: tl.R + 600, z: 1.05, f: "tab-preview" },
        { t: tl.siteAt + 700, z: 1, f: mid },
        { t: tl.scrollTo + 900, z: 1, f: mid },
      ]
    : [
        { t: 0, z: 1, f: mid },
        { t: 600, z: 1, f: mid },
        { t: 1700, z: 1.28, f: "composer-hero" },
        { t: tl.sendClick + 250, z: 1.28, f: "composer-hero" },
        { t: tl.S + 900, z: 1, f: mid },
        { t: tl.S + 1000, z: 1, f: mid },
        { t: tl.S + 1900, z: 1.6, f: "chat" },
        { t: tl.panel - 300, z: 1.6, f: "chat" },
        { t: tl.panel + 700, z: 1.6, f: "panel" },
        { t: tl.chipClick + 700, z: 1.6, f: "panel" },
        { t: tl.G + 1700, z: 1, f: mid },
        { t: tl.R - 200, z: 1, f: mid },
        { t: tl.R + 400, z: 1.55, f: "delivery" },
        { t: tl.R + 1500, z: 1.55, f: "delivery" },
        { t: tl.R + 2500, z: 1.7, f: "canvas" },
        { t: tl.scrollTo + 800, z: 1.7, f: "canvas" },
        { t: tl.end - 1200, z: 1, f: mid },
      ];
  const cursor: CursorStop[] = compact
    ? [
        { at: "send", arrive: tl.sendClick - 500, leave: tl.sendClick + 350 },
        {
          at: "chip",
          arrive: tl.hoverChip,
          leave: tl.chipClick + 450,
          hide: true,
        },
        {
          at: "tab-preview",
          arrive: tl.R + 450,
          leave: tl.R + 1300,
          hide: true,
        },
      ]
    : [
        { at: "send", arrive: tl.sendClick - 500, leave: tl.sendClick + 350 },
        {
          at: "chip",
          arrive: tl.hoverChip,
          leave: tl.chipClick + 450,
          hide: true,
        },
      ];
  const clicks = compact
    ? [tl.sendClick, tl.chipClick, tl.R + 900]
    : [tl.sendClick, tl.chipClick];
  return {
    script: {
      duration: tl.end,
      finalAt: tl.finalAt,
      camera,
      cursor,
      clicks,
    },
    scene: <Scene c={c} compact={compact} tl={tl} locale={locale} />,
  };
}

export function StudioDemo({ active }: { active?: boolean }) {
  const locale = useLocale();
  const c = COPY[locale];
  const builder = useCallback(
    (compact: boolean) => build(c, locale, compact),
    [c, locale],
  );
  const prepare = useCallback(
    () => document.fonts?.load(`700 15px ${sora.style.fontFamily}`),
    [],
  );
  return (
    <LiveDemo
      label={c.url}
      status={c.status}
      ariaLabel={c.alt}
      build={builder}
      resetKey={locale}
      tone="dark"
      active={active}
      prepare={prepare}
    />
  );
}
