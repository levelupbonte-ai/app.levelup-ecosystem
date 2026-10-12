"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  TbBell,
  TbBrightness,
  TbCalendar,
  TbChevronRight,
  TbChevronsDown,
  TbCode,
  TbInbox,
  TbLayoutSidebar,
  TbListDetails,
  TbLoader2,
  TbPalette,
  TbPhoto,
  TbSearch,
  TbSelector,
  TbSend,
  TbSettings,
  TbSlash,
  TbLayoutDashboard,
  TbTrendingUp,
  TbUsers,
  TbWorld,
} from "react-icons/tb";

import { geist } from "@/app/fonts";
import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import {
  type CamKey,
  type CursorStop,
  type DemoBuild,
  LiveDemo,
  useCue,
  useFlags,
} from "./engine";

/* ---------------------------------------------------------------------------
   Replica of the real client dashboard (Next + shadcn "base-nova", default
   theme, light). Layout, class names, icons and every label come from the
   dashboard code: config/nav-config.ts, components/layout/*, ui/*,
   features/assistant, features/site/components/seo-form.tsx and
   messages/en.json + fr.json. Scripted scenario: the AI assistant writes the
   Google title and description, the owner applies them, the SEO page shows
   them. Business and person are fictional.
--------------------------------------------------------------------------- */

type Copy = {
  org: string;
  domain: string;
  user: { name: string; email: string; initials: string };
  group: { mySite: string; overview: string };
  nav: {
    siteOverview: string;
    assistant: string;
    appointments: string;
    requests: string;
    content: string;
    services: string;
    team: string;
    gallery: string;
    reviews: string;
    announcements: string;
    faq: string;
    media: string;
    seo: string;
    developers: string;
    siteSettings: string;
    dashboard: string;
    organizations: string;
  };
  crumb: { dashboard: string; site: string; assistant: string; seo: string };
  search: string;
  assistant: {
    title: string;
    description: string;
    cardTitle: string;
    intro: string;
    suggestions: string[];
    placeholder: string;
    send: string;
    thinking: string;
    reply: string;
    proposal: string;
    titleLabel: string;
    descriptionLabel: string;
    apply: string;
    applying: string;
    appliedBadge: string;
    toast: string;
    seoTitle: string;
    seoDescription: string;
  };
  seo: {
    title: string;
    description: string;
    card: string;
    cardText: string;
    enabled: string;
    enabledHint: string;
    metaTitle: string;
    metaTitleHint: string;
    metaDescription: string;
    metaDescriptionHint: string;
    keywords: string;
    keywordsPlaceholder: string;
  };
  alt: string;
  url: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    org: "Salon Aurore",
    domain: "salonaurore.example",
    user: {
      name: "Camille Renard",
      email: "camille@salonaurore.example",
      initials: "CA",
    },
    group: { mySite: "My website", overview: "Overview" },
    nav: {
      siteOverview: "Overview",
      assistant: "AI assistant",
      appointments: "Appointments",
      requests: "Requests",
      content: "Content",
      services: "Services",
      team: "Team",
      gallery: "Gallery",
      reviews: "Reviews",
      announcements: "Announcements",
      faq: "FAQ",
      media: "Media library",
      seo: "SEO",
      developers: "Developers",
      siteSettings: "Website settings",
      dashboard: "Dashboard",
      organizations: "Organizations",
    },
    crumb: {
      dashboard: "Dashboard",
      site: "My website",
      assistant: "AI assistant",
      seo: "SEO",
    },
    search: "Search…",
    assistant: {
      title: "AI assistant",
      description: "Questions, copywriting and help with your website",
      cardTitle: "Salon Aurore assistant",
      intro:
        "Ask about your business, request a text or get help with the dashboard. The assistant never sees your customers’ contact details.",
      suggestions: [
        "Summarize my week",
        "Write a better description for my main service",
        "Suggest a Google title and description for my website",
        "How do I add a member to my team?",
      ],
      placeholder: "Type your question…",
      send: "Send",
      thinking: "The assistant is thinking…",
      reply:
        "Here is a Google title and description for Salon Aurore, with your city and your main services. Apply them to put them on your website.",
      proposal: "Website SEO",
      titleLabel: "Title",
      descriptionLabel: "Description",
      apply: "Apply",
      applying: "Saving…",
      appliedBadge: "Applied",
      toast: "Change saved.",
      seoTitle: "Hair Salon in San Diego: Cuts, Color, Booking | Salon Aurore",
      seoDescription:
        "Salon Aurore is a hair salon in North Park, San Diego. Precision cuts, color and balayage by appointment. Book your visit online, day or night.",
    },
    seo: {
      title: "SEO",
      description: "Google visibility and link previews",
      card: "Google search",
      cardText:
        "Applied automatically by the LevelUp tag on your website: title, description, link preview and business profile (schema.org) with your contact details, hours and reviews.",
      enabled: "Enable LevelUp SEO",
      enabledHint: "Turn off if your website already manages its own tags.",
      metaTitle: "Title (Google)",
      metaTitleHint: "50 to 60 characters: business + city + name.",
      metaDescription: "Description",
      metaDescriptionHint: "140 to 160 characters, with a call to action.",
      keywords: "Keywords",
      keywordsPlaceholder: "Type, then press Enter…",
    },
    alt: "The LevelUp dashboard: the AI assistant writes a Google title and description, the owner applies them, and they appear in the SEO settings of the website.",
    url: "dashboard.levelup-ecosystem.com",
  },
  fr: {
    org: "Salon Aurore",
    domain: "salonaurore.example",
    user: {
      name: "Camille Renard",
      email: "camille@salonaurore.example",
      initials: "CA",
    },
    group: { mySite: "Mon site", overview: "Aperçu" },
    nav: {
      siteOverview: "Vue d’ensemble",
      assistant: "Assistant IA",
      appointments: "Rendez-vous",
      requests: "Demandes",
      content: "Contenu",
      services: "Services",
      team: "Équipe",
      gallery: "Galerie",
      reviews: "Avis clients",
      announcements: "Annonces",
      faq: "FAQ",
      media: "Médiathèque",
      seo: "SEO",
      developers: "Développeurs",
      siteSettings: "Paramètres du site",
      dashboard: "Tableau de bord",
      organizations: "Organisations",
    },
    crumb: {
      dashboard: "Tableau de bord",
      site: "Mon site",
      assistant: "Assistant IA",
      seo: "SEO",
    },
    search: "Rechercher…",
    assistant: {
      title: "Assistant IA",
      description: "Questions, textes et aide sur votre site",
      cardTitle: "Assistant de Salon Aurore",
      intro:
        "Posez une question sur votre activité, demandez un texte ou de l’aide sur le tableau de bord. L’assistant ne voit jamais les coordonnées de vos clients.",
      suggestions: [
        "Résume mon activité de la semaine",
        "Rédige une meilleure description pour mon service principal",
        "Propose un titre et une description Google pour mon site",
        "Comment ajouter un membre à mon équipe ?",
      ],
      placeholder: "Écrivez votre question…",
      send: "Envoyer",
      thinking: "L’assistant réfléchit…",
      reply:
        "Voici un titre et une description Google pour Salon Aurore, avec votre ville et vos services principaux. Appliquez-les pour les mettre sur votre site.",
      proposal: "SEO du site",
      titleLabel: "Titre",
      descriptionLabel: "Description",
      apply: "Appliquer",
      applying: "Enregistrement…",
      appliedBadge: "Appliqué",
      toast: "Modification enregistrée.",
      seoTitle: "Coiffeur à San Diego : coupe, couleur et RDV | Salon Aurore",
      seoDescription:
        "Salon Aurore, salon de coiffure à North Park, San Diego. Coupes précises, couleur et balayage sur rendez-vous. Réservez en ligne, de jour comme de nuit.",
    },
    seo: {
      title: "SEO",
      description: "Visibilité sur Google et aperçus de partage",
      card: "Référencement Google",
      cardText:
        "Appliqué automatiquement par le tag LevelUp sur votre site : titre, description, aperçu de partage et fiche entreprise (schema.org) avec vos coordonnées, horaires et avis.",
      enabled: "Activer le SEO LevelUp",
      enabledHint: "Désactivez si votre site gère déjà ses balises.",
      metaTitle: "Titre (Google)",
      metaTitleHint: "50 à 60 caractères : activité + ville + nom.",
      metaDescription: "Description",
      metaDescriptionHint: "140 à 160 caractères, avec un appel à l’action.",
      keywords: "Mots-clés",
      keywordsPlaceholder: "Tapez puis Entrée…",
    },
    alt: "Le tableau de bord LevelUp : l’assistant IA rédige un titre et une description Google, le propriétaire les applique, et ils apparaissent dans les réglages SEO du site.",
    url: "dashboard.levelup-ecosystem.com",
  },
};

/* ------------------------------------------------------------------ shell */

const LEVELUP_STAR: [string, string][] = [
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

const MONO_OPACITY = [1, 0.78, 0.62, 0.42, 0.3, 0.4, 0.55, 0.65, 0.82, 0.92];

/** Small monochrome LevelUp star: the AI assistant's icon. */
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="20 30 472 448"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {LEVELUP_STAR.map(([points], i) => (
        <polygon key={points} points={points} opacity={MONO_OPACITY[i]} />
      ))}
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="20 30 472 448"
      width={20}
      height={20}
      className={className}
      aria-hidden="true"
    >
      {LEVELUP_STAR.map(([points, fill]) => (
        <polygon key={points} points={points} fill={fill} />
      ))}
    </svg>
  );
}

const menuBtn =
  "flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-colors duration-200 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate";
const subBtn =
  "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sm text-sidebar-foreground transition-colors duration-200";
const activeCls =
  "bg-sidebar-accent font-medium text-sidebar-accent-foreground";

type NavProps = {
  c: Copy;
  page: "assistant" | "seo";
  hoverSeo: boolean;
  cueSeo: (el: HTMLElement | null) => void;
};

function NavItem({
  icon: Icon,
  label,
  active,
  hover,
  cue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  hover?: boolean;
  cue?: (el: HTMLElement | null) => void;
}) {
  return (
    <li className="relative">
      <div ref={cue} className={cn(menuBtn, (active || hover) && activeCls)}>
        <Icon />
        <span>{label}</span>
      </div>
    </li>
  );
}

function SidebarBody({ c, page, hoverSeo, cueSeo }: NavProps) {
  const n = c.nav;
  const sub = [
    n.services,
    n.team,
    n.gallery,
    n.reviews,
    n.announcements,
    n.faq,
  ];
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-violet-500/20 bg-violet-500/10">
            <Star className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{c.org}</span>
            <span className="text-muted-foreground truncate text-xs">
              {c.domain}
            </span>
          </div>
          <TbSelector className="text-muted-foreground ml-auto size-4" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
        <div className="relative flex w-full min-w-0 flex-col px-2 py-0">
          <div className="text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium">
            {c.group.mySite}
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <NavItem icon={TbWorld} label={n.siteOverview} />
            <NavItem
              icon={StarIcon}
              label={n.assistant}
              active={page === "assistant"}
            />
            <NavItem icon={TbCalendar} label={n.appointments} />
            <NavItem icon={TbInbox} label={n.requests} />
            <li className="relative">
              <div className={menuBtn}>
                <TbListDetails />
                <span>{n.content}</span>
                <TbChevronRight className="ml-auto rotate-90" />
              </div>
              <ul className="border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5">
                {sub.map((label) => (
                  <li key={label} className="relative">
                    <div className={subBtn}>
                      <span className="truncate">{label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
            <NavItem icon={TbPhoto} label={n.media} />
            <NavItem
              icon={TbTrendingUp}
              label={n.seo}
              active={page === "seo"}
              hover={hoverSeo}
              cue={cueSeo}
            />
            <NavItem icon={TbCode} label={n.developers} />
            <NavItem icon={TbSettings} label={n.siteSettings} />
          </ul>
        </div>
        <div className="relative flex w-full min-w-0 flex-col px-2 py-0">
          <div className="text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium">
            {c.group.overview}
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <NavItem icon={TbLayoutDashboard} label={n.dashboard} />
            <NavItem icon={TbUsers} label={n.organizations} />
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-muted text-muted-foreground relative flex size-8 shrink-0 items-center justify-center rounded-lg text-sm">
              {c.user.initials}
            </div>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{c.user.name}</span>
              <span className="truncate text-xs">{c.user.email}</span>
            </div>
          </div>
          <TbChevronsDown className="ml-auto size-4" />
        </div>
      </div>
    </>
  );
}

function Header({
  c,
  compact,
  page,
  cueTrigger,
}: {
  c: Copy;
  compact: boolean;
  page: "assistant" | "seo";
  cueTrigger: (el: HTMLElement | null) => void;
}) {
  const last = page === "seo" ? c.crumb.seo : c.crumb.assistant;
  return (
    <header className="bg-background/60 flex h-14 shrink-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2 px-4">
        <div
          ref={cueTrigger}
          className="-ml-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
        >
          <TbLayoutSidebar className="size-4" />
        </div>
        <div className="bg-border mr-2 h-4 w-px shrink-0 self-center" />
        <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
          {!compact && (
            <>
              <li className="inline-flex items-center gap-1 whitespace-nowrap">
                {c.crumb.dashboard}
              </li>
              <li aria-hidden="true" className="[&>svg]:size-3.5">
                <TbSlash />
              </li>
              <li className="inline-flex items-center gap-1 whitespace-nowrap">
                {c.crumb.site}
              </li>
              <li aria-hidden="true" className="[&>svg]:size-3.5">
                <TbSlash />
              </li>
            </>
          )}
          <li
            key={page}
            className="text-foreground ld-rise inline-flex items-center gap-1 font-normal whitespace-nowrap"
          >
            {last}
          </li>
        </ol>
      </div>
      <div className="flex shrink-0 items-center gap-2 px-4">
        {!compact && (
          <div className="border-border bg-background text-muted-foreground relative flex h-9 w-32 shrink-0 items-center rounded-lg border text-sm font-normal">
            <TbSearch className="mr-2 ml-2.5 size-4" />
            {c.search}
            <kbd className="bg-muted absolute top-[0.3rem] right-[0.3rem] flex h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
        <div className="bg-secondary text-secondary-foreground inline-flex size-8 items-center justify-center rounded-lg">
          <TbBrightness className="size-4" />
        </div>
        {!compact && (
          <div className="border-input flex h-8 items-center gap-1.5 rounded-lg border py-2 pr-2 pl-2.5 text-sm whitespace-nowrap">
            <span className="text-muted-foreground">
              <TbPalette className="size-4" />
            </span>
            <span className="flex w-24 items-center gap-1.5 text-left">
              Vercel
            </span>
            <kbd className="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-xs font-medium">
              T T
            </kbd>
            <TbSelector className="text-muted-foreground size-4" />
          </div>
        )}
        <div className="relative inline-flex size-8 items-center justify-center rounded-lg">
          <TbBell className="size-4" />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ cards */

const cardCls =
  "flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)]";

function Heading({
  title,
  description,
  compact,
}: {
  title: string;
  description: string;
  compact: boolean;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-1 basis-60">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "font-bold tracking-tight break-words",
              compact ? "text-2xl" : "text-3xl",
            )}
          >
            {title}
          </div>
        </div>
        <p className="text-muted-foreground text-sm break-words">
          {description}
        </p>
      </div>
    </div>
  );
}

/** Scrolls its content up (transform only) once it outgrows the box. */
function ScrollStack({
  watch,
  children,
}: {
  watch: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const over = Math.max(0, i.offsetHeight - b.clientHeight);
    i.style.transform = `translate3d(0, ${-over}px, 0)`;
  }, [watch]);
  return (
    <div ref={box} className="relative min-h-0 flex-1 overflow-hidden">
      <div
        ref={inner}
        className="flex flex-col gap-4"
        style={{
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

type Flags = Record<keyof ReturnType<typeof times>, boolean>;

function AssistantPage({
  c,
  compact,
  f,
}: {
  c: Copy;
  compact: boolean;
  f: Flags;
}) {
  const a = c.assistant;
  const cueChip = useCue("chip");
  const cueIntro = useCue("intro");
  const cueChat = useCue("chat");
  const cueCard = useCue("card");
  const cueApply = useCue("apply");
  const sent = f.sent;
  const hoverChip = f.hoverChip && !f.sent;
  const hoverApply = f.hoverApply && !f.saving;
  const applied = f.applied;
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-4">
      <div ref={cueChat} className="flex min-h-0 flex-1 flex-col">
        <ScrollStack
          watch={`${f.user}${f.think}${f.reply}${f.card}${applied}${f.introGone}`}
        >
          {!f.introGone && (
            <div
              ref={cueIntro}
              className={cn(cardCls, "ld-fade")}
              style={{ opacity: sent ? 0 : 1 }}
            >
              <div className="grid items-start gap-1 px-(--card-spacing)">
                <div className="flex items-center gap-2 text-base leading-snug font-medium">
                  <StarIcon className="size-5" />
                  {a.cardTitle}
                </div>
              </div>
              <div className="text-muted-foreground space-y-3 px-(--card-spacing) text-sm">
                <p>{a.intro}</p>
                <div className="flex flex-wrap gap-2">
                  {a.suggestions.map((s, i) => (
                    <div
                      key={s}
                      ref={i === 2 ? cueChip : undefined}
                      className={cn(
                        "border-border bg-background text-foreground inline-flex h-auto min-h-8 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border px-2.5 text-left text-[0.8rem] font-medium whitespace-normal transition-colors duration-150",
                        i === 2 && hoverChip && "bg-muted",
                      )}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {f.user && (
            <div className="ld-rise flex justify-end">
              <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl px-4 py-3 text-sm">
                <p className="whitespace-pre-wrap">{a.suggestions[2]}</p>
              </div>
            </div>
          )}

          {f.think && !f.reply && (
            <div className="text-muted-foreground ld-rise flex items-center gap-2 text-sm">
              <TbLoader2 className="ld-spin size-4" aria-hidden="true" />
              {a.thinking}
            </div>
          )}

          {f.reply && (
            <div className="ld-rise flex justify-start">
              <div className="bg-muted max-w-[85%] rounded-2xl px-4 py-3 text-sm">
                <p className="whitespace-pre-wrap">{a.reply}</p>
                {f.card && (
                  <div
                    ref={cueCard}
                    className={cn(cardCls, "ld-rise mt-2 gap-3 py-4")}
                  >
                    <div className="grid items-start gap-1 px-4">
                      <div className="flex items-center gap-2 text-sm leading-snug font-medium">
                        <StarIcon className="size-4" />
                        {a.proposal}
                        {applied && (
                          <span className="bg-secondary text-secondary-foreground ld-pop inline-flex h-5 w-fit shrink-0 items-center justify-center overflow-hidden rounded-4xl px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                            {a.appliedBadge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 px-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          {a.titleLabel}
                        </p>
                        <p className="whitespace-pre-wrap">{a.seoTitle}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          {a.descriptionLabel}
                        </p>
                        <p className="whitespace-pre-wrap">
                          {a.seoDescription}
                        </p>
                      </div>
                    </div>
                    {!applied && (
                      <div className="bg-muted/50 flex items-center rounded-b-xl border-t p-4 px-4">
                        <div
                          ref={cueApply}
                          className={cn(
                            "bg-primary text-primary-foreground inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all duration-150",
                            hoverApply && "bg-primary/80",
                            f.saving && "opacity-50",
                          )}
                        >
                          {f.saving ? a.applying : a.apply}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollStack>
      </div>

      <div className="bg-background flex items-end gap-2 rounded-2xl border p-2 shadow-sm">
        <div
          className={cn(
            "text-muted-foreground flex min-h-11 w-full min-w-0 items-center px-2.5 py-2",
            compact ? "text-base" : "text-sm",
          )}
        >
          {a.placeholder}
        </div>
        <div className="bg-primary text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg opacity-50">
          <TbSend className="size-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div role="group" className="flex w-full flex-col gap-2">
      <div className="flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none">
        {label}
      </div>
      {children}
      {hint && (
        <p className="text-muted-foreground text-left text-sm leading-normal font-normal">
          {hint}
        </p>
      )}
    </div>
  );
}

const focusRing = "border-ring ring-ring/50 ring-3";

function SeoPage({ c, compact, f }: { c: Copy; compact: boolean; f: Flags }) {
  const s = c.seo;
  const a = c.assistant;
  const cueFields = useCue("seo-card");
  const cueTitle = useCue("seo-title");
  const cueDesc = useCue("seo-desc");
  const text = compact ? "text-base" : "text-sm";
  const descFocused = f.focusDesc;
  const titleFocused = f.focusTitle && !f.focusDesc;
  return (
    <div className="ld-rise grid grid-cols-1 gap-6">
      <div ref={cueFields} className={cardCls}>
        <div className="grid auto-rows-min items-start gap-1 px-(--card-spacing)">
          <div className="text-base leading-snug font-medium">{s.card}</div>
          <div className="text-muted-foreground text-sm">{s.cardText}</div>
        </div>
        <div className="px-(--card-spacing)">
          <div className="space-y-4">
            <div className="flex w-full flex-col gap-5">
              <div
                role="group"
                className="flex w-full flex-row items-start gap-2"
              >
                <div className="flex flex-1 flex-col gap-0.5 leading-snug">
                  <div className="flex w-fit items-center gap-2 text-sm leading-snug font-medium">
                    {s.enabled}
                  </div>
                  <p className="text-muted-foreground text-left text-sm leading-normal font-normal">
                    {s.enabledHint}
                  </p>
                </div>
                <div className="bg-primary relative inline-flex h-[18.4px] w-[32px] shrink-0 items-center rounded-full border border-transparent">
                  <span className="bg-background block size-4 translate-x-[calc(100%-2px)] rounded-full" />
                </div>
              </div>
              <Field label={s.metaTitle} hint={s.metaTitleHint}>
                <div
                  ref={cueTitle}
                  className={cn(
                    "border-input flex h-8 w-full min-w-0 items-center rounded-lg border bg-transparent px-2.5 py-1 transition-[border-color,box-shadow] duration-200",
                    text,
                    titleFocused && focusRing,
                  )}
                >
                  <span className="truncate">{a.seoTitle}</span>
                </div>
              </Field>
              <Field label={s.metaDescription}>
                <div
                  ref={cueDesc}
                  className={cn(
                    "border-input flex min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 transition-[border-color,box-shadow] duration-200",
                    text,
                    descFocused && focusRing,
                  )}
                >
                  {a.seoDescription}
                </div>
                <div className="text-muted-foreground text-right text-sm">
                  {a.seoDescription.length} / 320
                </div>
                <p className="text-muted-foreground text-left text-sm leading-normal font-normal">
                  {s.metaDescriptionHint}
                </p>
              </Field>
              <Field label={s.keywords}>
                <div
                  className={cn(
                    "border-input text-muted-foreground flex h-8 w-full items-center rounded-lg border bg-transparent px-2.5",
                    text,
                  )}
                >
                  {s.keywordsPlaceholder}
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ text, compact }: { text: string; compact: boolean }) {
  const cue = useCue("toast");
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-40 flex justify-center px-4">
      <div
        ref={cue}
        className={cn(
          "ld-drop bg-popover text-popover-foreground flex items-center gap-1.5 rounded-lg border p-4 text-[13px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
          compact ? "w-full" : "w-[356px]",
        )}
      >
        <svg
          viewBox="0 0 20 20"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
          className="mr-1 shrink-0"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          />
        </svg>
        <span className="font-medium">{text}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ script */

function times(compact: boolean) {
  const go = compact ? 10500 : 9600; // the click on "SEO" that changes page
  const p = go + 100;
  return {
    hoverChip: 1700,
    sent: 2450,
    introGone: 2750,
    user: 2800,
    think: 3500,
    reply: 4700,
    card: 5100,
    hoverApply: 6500,
    saving: 7300,
    applied: 8000,
    toast: 8050,
    toastOut: compact ? 8900 : 9900,
    drawer: compact ? 9150 : Infinity,
    hoverSeo: go - 400,
    nav: go,
    page: p,
    focusTitle: p + 1500,
    focusDesc: p + 2800,
  };
}

type DashScene = {
  c: Copy;
  compact: boolean;
  tl: ReturnType<typeof times>;
};

function Scene({ c, compact, tl }: DashScene) {
  const f = useFlags(tl);
  const cueSeo = useCue("nav-seo");
  const cueTrigger = useCue("trigger");
  const page: "assistant" | "seo" = f.nav ? "seo" : "assistant";
  const drawerOpen = compact && f.drawer && !f.nav;
  const a = c.assistant;
  const navProps: NavProps = {
    c,
    page,
    hoverSeo: f.hoverSeo && !f.nav,
    cueSeo,
  };
  return (
    <div
      className={cn(
        "ld-dash bg-background text-foreground relative flex h-full w-full overflow-hidden text-sm",
        geist.className,
      )}
    >
      {!compact && (
        <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full w-64 shrink-0 flex-col border-r">
          <SidebarBody {...navProps} />
        </aside>
      )}

      <main className="bg-background relative flex min-w-0 flex-1 flex-col">
        <Header c={c} compact={compact} page={page} cueTrigger={cueTrigger} />
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col pb-4",
            compact ? "px-4 pt-2" : "px-6 pt-4",
          )}
        >
          {page === "assistant" ? (
            <>
              <Heading
                compact={compact}
                title={a.title}
                description={`${a.description} · ${c.domain}`}
              />
              <AssistantPage c={c} compact={compact} f={f} />
            </>
          ) : (
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <Heading
                compact={compact}
                title={c.seo.title}
                description={`${c.seo.description} · ${c.domain}`}
              />
              <SeoPage c={c} compact={compact} f={f} />
            </div>
          )}
        </div>
        {f.nav && !f.page && (
          <div className="ld-toploader bg-primary absolute top-0 left-0 z-50 h-[2px] w-full" />
        )}
      </main>

      {compact && (
        <>
          <div
            className="absolute inset-0 z-30 bg-black/40 transition-opacity duration-300"
            style={{
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: "none",
            }}
          />
          <aside
            className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 z-30 flex w-72 flex-col shadow-lg transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: drawerOpen ? "none" : "translate3d(-100%,0,0)",
            }}
          >
            <SidebarBody {...navProps} />
          </aside>
        </>
      )}

      {f.toast && !f.toastOut && <Toast text={a.toast} compact={compact} />}
    </div>
  );
}

function build(c: Copy, compact: boolean): DemoBuild {
  const tl = times(compact);
  const c0: [number, number] = [0.5, 0.5];
  const camera: CamKey[] = compact
    ? [
        { t: 0, z: 1, f: c0 },
        { t: 1300, z: 1, f: c0 },
        { t: 2300, z: 1, f: "chat" },
        { t: 5600, z: 1, f: "chat" },
        { t: 6500, z: 1, f: "card" },
        { t: 8600, z: 1, f: "card" },
        { t: 9400, z: 1, f: "nav-seo" },
        { t: 10500, z: 1, f: "nav-seo" },
        { t: tl.page + 900, z: 1, f: "seo-card" },
        { t: tl.focusDesc + 600, z: 1, f: "seo-desc" },
        { t: tl.focusDesc + 2300, z: 1, f: c0 },
      ]
    : [
        { t: 0, z: 1, f: c0 },
        { t: 900, z: 1, f: c0 },
        { t: 2000, z: 1.3, f: "intro" },
        { t: 3000, z: 1.3, f: "intro" },
        { t: 4000, z: 1.3, f: "chat" },
        { t: 7700, z: 1.3, f: "chat" },
        { t: 8300, z: 1.3, f: [0.62, 0.38] },
        { t: 8800, z: 1.3, f: [0.62, 0.38] },
        { t: 9350, z: 1.5, f: "nav-seo" },
        { t: 10150, z: 1.5, f: "nav-seo" },
        { t: tl.page + 800, z: 1.3, f: "seo-card" },
        { t: tl.focusDesc + 400, z: 1.3, f: "seo-card" },
        { t: tl.focusDesc + 2000, z: 1, f: c0 },
      ];
  const cursor: CursorStop[] = compact
    ? [
        { at: "chip", arrive: 1900, leave: 2550 },
        { at: "apply", arrive: 6700, leave: 7500 },
        { at: "trigger", arrive: 8700, leave: 9300 },
        { at: "nav-seo", arrive: 9900, leave: 10650 },
        { at: "seo-title", arrive: tl.page + 1000, leave: tl.page + 1900 },
        { at: "seo-desc", arrive: tl.page + 2400, leave: tl.page + 4000 },
      ]
    : [
        { at: "chip", arrive: 1900, leave: 2550 },
        { at: "apply", arrive: 6700, leave: 7500 },
        { at: "nav-seo", arrive: 9200, leave: 9750 },
        { at: "seo-title", arrive: tl.page + 1000, leave: tl.page + 1900 },
        { at: "seo-desc", arrive: tl.page + 2400, leave: tl.page + 4000 },
      ];
  const clicks = compact
    ? [2350, 7300, 9100, 10500, tl.focusTitle, tl.focusDesc]
    : [2350, 7300, 9600, tl.focusTitle, tl.focusDesc];
  const end = tl.page + 5400;
  return {
    script: {
      duration: end,
      finalAt: tl.page + 3600,
      camera,
      cursor,
      clicks,
    },
    scene: <Scene c={c} compact={compact} tl={tl} />,
  };
}

export function DashboardDemo({ active }: { active?: boolean }) {
  const locale = useLocale();
  const c = COPY[locale];
  const builder = useCallback((compact: boolean) => build(c, compact), [c]);
  const prepare = useCallback(
    () => document.fonts?.load(`400 14px ${geist.style.fontFamily}`),
    [],
  );
  const label = useMemo(
    () => (
      <>
        {c.url}
        <span className="hidden sm:inline">/dashboard/site</span>
      </>
    ),
    [c.url],
  );
  return (
    <LiveDemo
      label={label}
      status={locale === "fr" ? "En ligne" : "Live"}
      ariaLabel={c.alt}
      build={builder}
      resetKey={locale}
      tone="light"
      active={active}
      prepare={prepare}
    />
  );
}
