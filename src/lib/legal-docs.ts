import type { Locale } from "@/lib/locale";

/**
 * The public legal pages. The paths are fixed: LevelStudio and the dashboard
 * link to them (/terms, /privacy, ...). The documents themselves live in
 * src/content/legal/<slug>.<locale>.md (English is the governing version).
 */
export const LEGAL_UPDATED_ISO = "2026-10-11";
export const LEGAL_UPDATED: Record<Locale, string> = {
  en: "October 11, 2026",
  fr: "11 octobre 2026"
};

export type LegalSlug =
  | "terms"
  | "privacy"
  | "acceptable-use"
  | "services-agreement"
  | "dpa"
  | "cookies"
  | "levelstudio-terms";

export type LegalDocMeta = {
  slug: LegalSlug;
  path: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const LEGAL_DOCS: LegalDocMeta[] = [
  {
    slug: "terms",
    path: "/terms",
    label: { en: "Terms of Service", fr: "Conditions d'utilisation" },
    description: {
      en: "The terms that apply to our website, LevelStudio, the client dashboard and the websites we host: license model, plans, payment, liability, disputes.",
      fr: "Les conditions applicables à notre site, LevelStudio, le tableau de bord client et les sites que nous hébergeons : licence, plans, paiement, responsabilité, litiges."
    }
  },
  {
    slug: "privacy",
    path: "/privacy",
    label: { en: "Privacy Policy", fr: "Politique de confidentialité" },
    description: {
      en: "What personal information we collect, why, who we share it with, how long we keep it, and your rights (CCPA/CPRA, GDPR, PIPEDA).",
      fr: "Les informations personnelles que nous collectons, pourquoi, avec qui nous les partageons, combien de temps nous les conservons, et vos droits (CCPA/CPRA, RGPD, LPRPDE)."
    }
  },
  {
    slug: "acceptable-use",
    path: "/acceptable-use",
    label: { en: "Acceptable Use Policy", fr: "Utilisation acceptable" },
    description: {
      en: "What you may and may not do with LevelUp websites, LevelStudio and the platform, and how to report abuse.",
      fr: "Ce que vous pouvez et ne pouvez pas faire avec les sites LevelUp, LevelStudio et la plateforme, et comment signaler un abus."
    }
  },
  {
    slug: "services-agreement",
    path: "/services-agreement",
    label: { en: "Services Agreement", fr: "Contrat de services" },
    description: {
      en: "The agreement for paying clients: builds, care and platform plans, deposits, invoices, support targets, export and transition.",
      fr: "Le contrat des clients payants : créations, plans de maintenance et de plateforme, acomptes, factures, support, export et transition."
    }
  },
  {
    slug: "dpa",
    path: "/dpa",
    label: { en: "Data Processing Addendum", fr: "Avenant de traitement des données" },
    description: {
      en: "Processor terms for the personal data of your customers and visitors that flows through your LevelUp website.",
      fr: "Les conditions de sous-traitance pour les données personnelles de vos clients et visiteurs traitées via votre site LevelUp."
    }
  },
  {
    slug: "cookies",
    path: "/cookies",
    label: { en: "Cookie Policy", fr: "Politique des cookies" },
    description: {
      en: "The cookies and browser storage we use, our cookieless analytics, and how to change your choices.",
      fr: "Les cookies et le stockage du navigateur que nous utilisons, notre mesure d'audience sans cookie, et comment modifier vos choix."
    }
  },
  {
    slug: "levelstudio-terms",
    path: "/levelstudio-terms",
    label: { en: "LevelStudio Terms", fr: "Conditions LevelStudio" },
    description: {
      en: "Additional terms for LevelStudio, our AI-assisted website preview builder: credits, previews, publishing and AI output.",
      fr: "Conditions complémentaires pour LevelStudio, notre outil d'aperçu de site assisté par IA : crédits, aperçus, publication et contenu généré."
    }
  }
];

export const LEGAL_DOC_BY_SLUG = Object.fromEntries(
  LEGAL_DOCS.map((d) => [d.slug, d])
) as Record<LegalSlug, LegalDocMeta>;
