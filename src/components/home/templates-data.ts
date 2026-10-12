import type { Locale } from "@/lib/locale";

/**
 * Premium website templates: demo sites built by LevelUp (not clients).
 * Each one can be the starting point of a project:
 * /start-project?template=<slug>.
 */
export type TemplateSlug = "missbeauty" | "resto" | "travel";

export interface TemplateItem {
  slug: TemplateSlug;
  name: string;
  url: string;
  domain: string;
  /** Path prefix of the desktop capture (`-720.webp` / `-1440.webp`). */
  desktop: string;
  /** Mobile capture: the top of the site (390 x 844 viewport, 2x). */
  mobile: string;
  copy: Record<
    Locale,
    { industry: string; tagline: string; body: string; features: string[] }
  >;
}

export const TEMPLATES: TemplateItem[] = [
  {
    slug: "missbeauty",
    name: "Miss Beauty",
    url: "https://missbeauty.levelup-ecosystem.com/",
    domain: "missbeauty.levelup-ecosystem.com",
    desktop: "/home/tpl-missbeauty-desktop",
    mobile: "/home/tpl-missbeauty-mobile.webp",
    copy: {
      en: {
        industry: "Hair atelier & beauty",
        tagline: "Your hair. Your signature.",
        body: "A light, editorial site for a hair atelier: braids, silk press and colouring, presented like a magazine, with booking built in.",
        features: ["Online booking", "Service menu", "Editorial serif design"],
      },
      fr: {
        industry: "Atelier coiffure et beauté",
        tagline: "Your hair. Your signature.",
        body: "Un site clair et éditorial pour un atelier de coiffure : tresses, silk press et coloration présentés comme un magazine, avec la réservation intégrée.",
        features: [
          "Réservation en ligne",
          "Carte des prestations",
          "Design éditorial à empattements",
        ],
      },
    },
  },
  {
    slug: "resto",
    name: "Taste of Egypt Cafe",
    url: "https://resto.levelup-ecosystem.com/",
    domain: "resto.levelup-ecosystem.com",
    desktop: "/home/tpl-resto-desktop",
    mobile: "/home/tpl-resto-mobile.webp",
    copy: {
      en: {
        industry: "Café & artisanal bakery",
        tagline: "Haute Egyptian gastronomy",
        body: "A dark burgundy and gold site for a luxury café and bakery: the full menu, a custom sandwich builder, a gallery and table reservations.",
        features: [
          "Table reservation",
          "Menu & custom sandwich",
          "Photo gallery",
        ],
      },
      fr: {
        industry: "Café et boulangerie artisanale",
        tagline: "Haute gastronomie égyptienne",
        body: "Un site bordeaux et or pour un café-boulangerie de luxe : la carte complète, un sandwich sur mesure, une galerie et la réservation de table.",
        features: [
          "Réservation de table",
          "Carte et sandwich sur mesure",
          "Galerie photo",
        ],
      },
    },
  },
  {
    slug: "travel",
    name: "LevelFlight",
    url: "https://travel.levelup-ecosystem.com/",
    domain: "travel.levelup-ecosystem.com",
    desktop: "/home/tpl-travel-desktop",
    mobile: "/home/tpl-travel-mobile.webp",
    copy: {
      en: {
        industry: "Travel & visa advisory",
        tagline: "Travel, elevated.",
        body: "A cinematic navy and gold site for international travel and consular visa advice: destinations, visa services and consultation booking.",
        features: [
          "Consultation booking",
          "Destinations & visa services",
          "Cinematic design",
        ],
      },
      fr: {
        industry: "Voyage et conseil en visas",
        tagline: "Travel, elevated.",
        body: "Un site cinématographique bleu nuit et or pour le voyage international et le conseil consulaire : destinations, services de visa et prise de rendez-vous.",
        features: [
          "Prise de rendez-vous",
          "Destinations et visas",
          "Design cinématographique",
        ],
      },
    },
  },
];

export const TEMPLATE_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    titleMuted: string;
    lead: string;
    badge: string;
    demo: string;
    start: string;
    newTab: string;
  }
> = {
  en: {
    eyebrow: "Templates",
    title: "Start from a template.",
    titleMuted: "Make it yours.",
    lead: "Three premium demo sites designed and built by LevelUp. Pick one as your starting point and we tailor it to your brand, your content and your booking flow.",
    badge: "Template · Demo site",
    demo: "View live demo",
    start: "Start with this template",
    newTab: "opens in a new tab",
  },
  fr: {
    eyebrow: "Modèles",
    title: "Partez d’un modèle.",
    titleMuted: "Faites-le vôtre.",
    lead: "Trois sites de démonstration premium conçus et développés par LevelUp. Choisissez-en un comme point de départ : nous l’adaptons à votre marque, à vos contenus et à votre parcours de réservation.",
    badge: "Modèle · Site de démo",
    demo: "Voir la démo",
    start: "Partir de ce modèle",
    newTab: "s’ouvre dans un nouvel onglet",
  },
};

export const templateStartHref = (slug: TemplateSlug) =>
  `/start-project?template=${slug}`;
