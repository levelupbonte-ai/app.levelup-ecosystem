/**
 * LevelUp site content from the shared LevelUp Supabase database.
 *
 * Everything comes from one public RPC, `get_site_bundle(p_website_id)`, called
 * with the PUBLISHABLE key only (RLS / SECURITY DEFINER RPC on the database
 * side). The response is cached by Next (tag "levelup-site", 5 min at most):
 * the database pings /api/revalidate on every content change, so edits show up
 * within seconds. Requests are de-duplicated with React `cache()`.
 *
 * Rows are written by dashboard editors, so every value is validated before it
 * reaches a component, and every getter falls back to the hard-coded content
 * when the bundle is missing, empty or malformed. Nothing here ever throws.
 */
import "server-only";

import { cache } from "react";

import { PLATFORM_CONFIGURED, callPlatform } from "@/lib/platform-api";

import type { FaqCategory } from "@/components/blocks/faq";
import type { PlanItem } from "@/components/blocks/pricing";
import type {
  CareComparisonRow,
  CareTablePlan,
  ComparisonCategory,
  BuildTablePlan,
  PricingComparison,
} from "@/components/blocks/pricing-table";
import type { TestimonialItem } from "@/components/blocks/testimonials";
import {
  defaultConcepts,
  defaultProjects,
  type ConceptItem,
  type ProjectItem,
} from "@/data/projects";

// ============================================================================
// Bundle types (subset of get_site_bundle used by this site)
// ============================================================================

type Json = Record<string, unknown>;

export interface BundleService {
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  price_cents: number | null;
  price_label: string | null;
  currency: string | null;
  badge: string | null;
  featured: boolean;
  inclusions: string[];
  data: Json;
}

export interface BundleReview {
  author: string;
  rating: number | null;
  comment: string;
  source: string | null;
  data: Json;
}

export interface BundleFaq {
  category: string | null;
  question: string;
  answer: string;
}

export interface SiteBundle {
  id: string;
  name: string;
  features: string[];
  settings: Json;
  blocks: Record<string, Record<string, Json>>;
  services: BundleService[];
  reviews: BundleReview[];
  faq: BundleFaq[];
}

// ============================================================================
// Config
// ============================================================================

const WEBSITE_ID = process.env.WEBSITE_ID || "ws_6e797257f5b32b86";

const REQUEST_TIMEOUT_MS = 5000;

// ============================================================================
// Validation helpers
// ============================================================================

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, max = 4000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function objects(value: unknown, max = 500): Json[] {
  return Array.isArray(value) ? value.filter(isObject).slice(0, max) : [];
}

function strings(value: unknown, max = 100): string[] {
  return Array.isArray(value)
    ? value
        .map((v) => str(v, 500))
        .filter((v): v is string => v !== null)
        .slice(0, max)
    : [];
}

/** Relative path ("/x", not "//x") or https URL; anything else is rejected. */
export function safeUrl(value: unknown): string | null {
  const url = str(value, 2000);
  if (!url) return null;
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) {
    return url;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function cell(value: unknown): boolean | string {
  if (typeof value === "boolean") return value;
  return str(value, 200) ?? false;
}

// ============================================================================
// Fetch
// ============================================================================

function parseBundle(raw: unknown): SiteBundle | null {
  if (!isObject(raw) || typeof raw.id !== "string") return null;

  const blocks: SiteBundle["blocks"] = {};
  if (isObject(raw.blocks)) {
    for (const [page, pageBlocks] of Object.entries(raw.blocks)) {
      if (!isObject(pageBlocks)) continue;
      blocks[page] = {};
      for (const [key, data] of Object.entries(pageBlocks)) {
        if (isObject(data)) blocks[page][key] = data;
      }
    }
  }

  const services: BundleService[] = objects(raw.services).flatMap((s) => {
    const slug = str(s.slug, 64);
    const name = str(s.name, 160);
    if (!slug || !name) return [];
    return [
      {
        slug,
        name,
        category: str(s.category, 80),
        description: str(s.description),
        price_cents: typeof s.price_cents === "number" ? s.price_cents : null,
        price_label: str(s.price_label, 80),
        currency: str(s.currency, 3),
        badge: str(s.badge, 80),
        featured: s.featured === true,
        inclusions: strings(s.inclusions),
        data: isObject(s.data) ? s.data : {},
      },
    ];
  });

  const reviews: BundleReview[] = objects(raw.reviews, 200).flatMap((r) => {
    const author = str(r.author, 120);
    const comment = str(r.comment);
    if (!author || !comment) return [];
    return [
      {
        author,
        comment,
        rating: typeof r.rating === "number" ? r.rating : null,
        source: str(r.source, 80),
        data: isObject(r.data) ? r.data : {},
      },
    ];
  });

  const faq: BundleFaq[] = objects(raw.faq, 200).flatMap((f) => {
    const question = str(f.question, 500);
    const answer = str(f.answer, 8000);
    if (!question || !answer) return [];
    return [{ question, answer, category: str(f.category, 120) }];
  });

  return {
    id: raw.id,
    name: str(raw.name, 160) ?? "",
    features: strings(raw.features),
    settings: isObject(raw.settings) ? raw.settings : {},
    blocks,
    services,
    reviews,
    faq,
  };
}

/**
 * Fetches the public site bundle once per request (Next data cache, 5 min).
 * Returns null on any error so callers fall back to the built-in content.
 */
export const getSiteBundle = cache(async (): Promise<SiteBundle | null> => {
  if (!PLATFORM_CONFIGURED) return null;
  if (!/^ws_[a-z0-9]{8,32}$/.test(WEBSITE_ID)) return null;

  const { status, body } = await callPlatform(
    "get_site_bundle",
    { p_website_id: WEBSITE_ID },
    {
      timeoutMs: REQUEST_TIMEOUT_MS,
      next: { revalidate: 300, tags: ["levelup-site"] },
    },
  );
  if (status !== 200) {
    // eslint-disable-next-line no-console
    console.warn("[levelup-site] site bundle unavailable, status", status);
    return null;
  }
  return parseBundle(body);
});

// ============================================================================
// Pricing
// ============================================================================

function parseFeatureGroups(value: unknown): PlanItem["fullFeatures"] {
  return objects(value, 20).flatMap((group) => {
    const category = str(group.category, 200);
    if (!category) return [];
    const items = objects(group.items, 60).flatMap((item) => {
      const text = str(item.text, 500);
      return text ? [{ text, included: item.included !== false }] : [];
    });
    return [{ category, items }];
  });
}

function serviceToPlan(service: BundleService): PlanItem | null {
  const ctaHref = safeUrl(service.data.cta_href);
  const price = service.price_label;
  if (!price) return null;
  return {
    id: service.slug,
    name: service.name,
    badge: service.badge ?? undefined,
    isRecommended: service.featured,
    subtitle: str(service.data.subtitle, 300) ?? "",
    price,
    pricePeriod: str(service.data.price_period, 80) ?? "",
    secondaryNote: str(service.data.secondary_note, 300) ?? undefined,
    description: service.description ?? "",
    shortPoints: service.inclusions,
    fullFeatures: parseFeatureGroups(service.data.full_features),
    ctaText: str(service.data.cta_text, 120) ?? `Choose ${service.name}`,
    ctaHref: ctaHref ?? `/contact?plan=${service.slug}`,
  };
}

function parseComparison(
  value: Json | undefined,
): PricingComparison | undefined {
  if (!value) return undefined;

  const buildPlans: BuildTablePlan[] = objects(value.build_plans, 10).flatMap(
    (p) => {
      const id = str(p.id, 64);
      const name = str(p.name, 120);
      if (!id || !name) return [];
      return [
        {
          id,
          name,
          buildPrice: str(p.buildPrice, 80) ?? "",
          monthlyPrice: str(p.monthlyPrice, 80) ?? "",
          badge: str(p.badge, 80) ?? undefined,
          isPopular: p.isPopular === true,
          ctaText: str(p.ctaText, 120) ?? `Choose ${name}`,
          ctaHref: safeUrl(p.ctaHref) ?? "/contact",
        },
      ];
    },
  );

  const carePlans: CareTablePlan[] = objects(value.care_plans, 10).flatMap(
    (p) => {
      const id = str(p.id, 64);
      const name = str(p.name, 120);
      if (!id || !name) return [];
      return [
        {
          id,
          name,
          price: str(p.price, 80) ?? "",
          badge: str(p.badge, 80) ?? undefined,
          isPopular: p.isPopular === true,
          ctaText: str(p.ctaText, 120) ?? `Choose ${name}`,
          ctaHref: safeUrl(p.ctaHref) ?? "/contact",
        },
      ];
    },
  );

  const buildRows: ComparisonCategory[] = objects(value.build_rows, 20).flatMap(
    (c) => {
      const category = str(c.category, 200);
      if (!category) return [];
      const rows = objects(c.rows, 80).flatMap((r) => {
        const name = str(r.name, 200);
        return name
          ? [
              {
                name,
                starter: cell(r.starter),
                secure: cell(r.secure),
                care: cell(r.care),
                custom: cell(r.custom),
              },
            ]
          : [];
      });
      return [{ category, rows }];
    },
  );

  const careRows: CareComparisonRow[] = objects(value.care_rows, 80).flatMap(
    (r) => {
      const name = str(r.name, 200);
      return name
        ? [
            {
              name,
              essential: cell(r.essential),
              pro: cell(r.pro),
              premium: cell(r.premium),
            },
          ]
        : [];
    },
  );

  // The table layout is built for exactly 4 build columns and 3 care columns.
  if (buildPlans.length !== 4 || carePlans.length !== 3) return undefined;
  if (buildRows.length === 0 || careRows.length === 0) return undefined;
  return { buildPlans, carePlans, buildRows, careRows };
}

export async function getPricingContent(): Promise<{
  buildPlans?: PlanItem[];
  carePlans?: PlanItem[];
  comparison?: PricingComparison;
}> {
  const bundle = await getSiteBundle();
  if (!bundle) return {};

  const toPlans = (category: string) =>
    bundle.services
      .filter((s) => s.category === category)
      .map(serviceToPlan)
      .filter((p): p is PlanItem => p !== null);

  const buildPlans = toPlans("website_plan");
  const carePlans = toPlans("care_plan");

  return {
    buildPlans: buildPlans.length > 0 ? buildPlans : undefined,
    carePlans: carePlans.length > 0 ? carePlans : undefined,
    comparison: parseComparison(bundle.blocks.pricing?.comparison),
  };
}

// ============================================================================
// FAQ
// ============================================================================

export async function getFaqCategories(): Promise<FaqCategory[] | undefined> {
  const bundle = await getSiteBundle();
  if (!bundle || bundle.faq.length === 0) return undefined;

  const categories: FaqCategory[] = [];
  for (const item of bundle.faq) {
    const title = item.category ?? "General";
    let category = categories.find((c) => c.title === title);
    if (!category) {
      category = { title, questions: [] };
      categories.push(category);
    }
    category.questions.push({ question: item.question, answer: item.answer });
  }
  return categories;
}

// ============================================================================
// Testimonials
// ============================================================================

export async function getTestimonialItems(): Promise<
  TestimonialItem[] | undefined
> {
  const bundle = await getSiteBundle();
  if (!bundle) return undefined;

  const items = bundle.reviews.flatMap((r) => {
    const image = safeUrl(r.data.image);
    if (!image) return [];
    return [
      {
        quote: r.comment,
        author: r.author,
        role: str(r.data.role, 120) ?? "",
        company: str(r.data.company, 120) ?? "",
        image,
      },
    ];
  });
  // Database reachable: only real, published reviews are shown (an empty list
  // hides the section). The built-in list is only an outage fallback.
  return items;
}

// ============================================================================
// Projects
// ============================================================================

function parseProject(p: Json, index: number): ProjectItem | null {
  const id = str(p.id ?? p.slug, 64);
  const title = str(p.title, 200);
  const href = safeUrl(p.href);
  const image = safeUrl(p.image);
  // id is a route segment (/projects/[id]).
  if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id) || !title || !href || !image) {
    return null;
  }
  const aspectRatio = str(p.aspect_ratio, 40);
  return {
    id,
    step: str(p.step, 8) ?? String(index + 1).padStart(2, "0"),
    badge: str(p.badge, 200) ?? "Client Project",
    title,
    description: str(p.description) ?? "",
    image,
    href,
    external: p.external === true && href.startsWith("https://"),
    // Only Tailwind aspect-[w/h] classes (the value is used as a className).
    aspectRatio:
      aspectRatio && /^aspect-\[\d{1,5}\/\d{1,5}\]$/.test(aspectRatio)
        ? aspectRatio
        : "aspect-[639/298]",
    ctaText: str(p.cta_text, 120) ?? "Explore project",
  };
}

/** Client case studies (content_blocks projects/list), else the built-in list. */
export async function getLiveProjects(): Promise<ProjectItem[]> {
  const bundle = await getSiteBundle();
  const items = objects(bundle?.blocks.projects?.list?.items, 100)
    .map(parseProject)
    .filter((p): p is ProjectItem => p !== null);
  return items.length > 0 ? items : defaultProjects;
}

/** Studio concepts (content_blocks projects/concepts), else the built-in list. */
export async function getConcepts(): Promise<ConceptItem[]> {
  const bundle = await getSiteBundle();
  const items = objects(bundle?.blocks.projects?.concepts?.items, 50).flatMap(
    (c) => {
      const title = str(c.title, 200);
      const image = safeUrl(c.image);
      if (!title || !image) return [];
      return [
        {
          title,
          badge: str(c.badge, 120) ?? "",
          description: str(c.description) ?? "",
          image,
          tags: strings(c.tags, 12),
          ctaText: str(c.cta_text, 120) ?? "Request preview like this",
          ctaHref: safeUrl(c.cta_href) ?? "/contact",
        },
      ];
    },
  );
  return items.length > 0 ? items : defaultConcepts;
}

// ============================================================================
// Legal documents
// ============================================================================

/**
 * Legal page text from content_blocks page "legal", block key = slug
 * (data: { title, last_updated, content_markdown }). Null = use the built-in text.
 */
export async function getLegalDocument(slug: string): Promise<{
  title: string | null;
  last_updated: string | null;
  content_markdown: string;
} | null> {
  const bundle = await getSiteBundle();
  const block = bundle?.blocks.legal?.[slug];
  const content = str(block?.content_markdown, 200000);
  if (!block || !content) return null;
  return {
    title: str(block.title, 200),
    last_updated: str(block.last_updated, 80),
    content_markdown: content,
  };
}

// ============================================================================
// Editable section text (content_blocks page/key, see src/data/site-copy.ts)
// ============================================================================

/**
 * Overlays a database block on the built-in copy, keeping the default's shape:
 * strings stay strings, string lists stay string lists, and lists of objects
 * are merged item by item against the first default item. Unknown keys and
 * wrong types are ignored, and an empty list keeps the default list.
 */
function mergeCopy<T>(defaults: T, value: unknown): T {
  if (typeof defaults === "string") return (str(value) ?? defaults) as T;
  if (Array.isArray(defaults)) {
    if (!Array.isArray(value) || value.length === 0) return defaults;
    const sample = defaults[0];
    if (typeof sample === "string") {
      const list = strings(value, 30);
      return (list.length ? list : defaults) as T;
    }
    if (isObject(sample)) {
      const list = objects(value, 30).map((item) => mergeCopy(sample, item));
      return (list.length ? list : defaults) as T;
    }
    return defaults;
  }
  if (isObject(defaults)) {
    if (!isObject(value)) return defaults;
    const out: Json = {};
    for (const [key, fallback] of Object.entries(defaults)) {
      out[key] = mergeCopy(fallback, value[key]);
    }
    return out as T;
  }
  return defaults;
}

/** Text for one section: content_blocks `page/key` over the built-in defaults. */
export async function getSectionCopy<T extends Json>(
  page: string,
  key: string,
  defaults: T,
): Promise<T> {
  const bundle = await getSiteBundle();
  return mergeCopy(defaults, bundle?.blocks[page]?.[key]);
}
