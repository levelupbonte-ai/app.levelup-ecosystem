/**
 * Supabase Data Client & PostgREST Query Layer
 * Handles dynamic entities fetching, SEO metadata resolution, and Schema.org generation.
 * Built with zero-dependency native fetch for high performance, edge compatibility, and resilience.
 */

export interface Entity {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  entity_type: "person" | "organization" | "creative_work" | "project" | "game" | "artist" | "company";
  category: string;
  short_bio: string;
  full_content?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  website_url?: string | null;
  social_links?: Record<string, string>;
  tags?: string[];
  status: "draft" | "published" | "archived";
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Fallback seed data in case Supabase credentials are being configured
const FALLBACK_ENTITIES: Entity[] = [
  {
    id: "e1",
    slug: "momon-samuel",
    name: "Momon Samuel",
    subtitle: "Directeur Artistique, Créateur & Visionnaire Média",
    entity_type: "person",
    category: "Culture & Médias",
    short_bio:
      "Momon Samuel est un directeur artistique et stratège créatif reconnu dans le développement de talents, la production musicale et la direction de projets médias d'envergure internationale.",
    full_content: `Momon Samuel est une figure créative majeure, reconnue pour son approche avant-gardiste dans la valorisation des artistes et la direction de productions multimédias.

### Parcours & Réalisations
- **Direction Artistique & Identité Visuelle** : Supervision de chartes graphiques, pochettes d'albums, clips et scénographies pour des créateurs de premier plan.
- **Stratégie & Développement de Talents** : Accompagnement stratégique, structuration de partenariats de marques et rayonnement numérique international.
- **Rayonnement & Réseau** : Collaboration avec les hubs culturels majeurs entre l'Afrique, l'Europe et les États-Unis.

### Vision & Engagement
Momon Samuel défend une culture d'excellence et d'indépendance créative, en connectant les récits authentiques aux technologies web et de diffusion modernes.`,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    banner_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
    website_url: "https://levelupecosystem.com",
    social_links: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
    tags: ["Artiste", "Directeur Artistique", "Musique", "Production", "LevelUp"],
    status: "published",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "e2",
    slug: "blackpater",
    name: "Black_Pater (Jean-Pierre Lofumbwa)",
    subtitle: "Entrepreneur, Éducateur & Ambassadeur Culturel Congolais",
    entity_type: "person",
    category: "Entrepreneuriat & Éducation",
    short_bio:
      "Black_Pater (Jean-Pierre Lofumbwa, Le Prof) est un entrepreneur, créateur de contenu et éducateur congolais basé aux États-Unis, pionnier de la transmission culturelle et linguistique.",
    full_content: `Fondateur de la marque Black_Pater, Jean-Pierre Lofumbwa — universellement salué sous le pseudonyme « Le Prof » — s'est imposé comme l'une des voix les plus influentes de la diaspora congolaise contemporaine.

### Domaines d'impact
- **Éducation Linguistique (Lingala)** : Créateur d'une méthode d'apprentissage immersive du Lingala suivie par des centaines de milliers d'élèves à travers le monde.
- **Entrepreneuriat & Écosystème** : Fondateur d'initiatives commerciales et culturelles reliant les États-Unis et la République Démocratique du Congo.
- **Ambassadeur Culturel** : Porteur des valeurs de résilience, de travail et de fierté culturelle pour la jeunesse africaine.`,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    banner_url: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1600&q=80",
    website_url: "https://levelupecosystem.com/projects/blackpater-portofolio.html",
    social_links: {
      youtube: "https://youtube.com/@blackpater",
      tiktok: "https://tiktok.com/@blackpater",
      instagram: "https://instagram.com/blackpater",
    },
    tags: ["BlackPater", "Le Prof", "Congo", "Culture", "Lingala", "USA"],
    status: "published",
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "e3",
    slug: "finalstop",
    name: "Final Stop (Projet Interactif)",
    subtitle: "Expérience Narrative & Performance Logicielle",
    entity_type: "creative_work",
    category: "Technologie & Design",
    short_bio:
      "Final Stop est une expérience immersive alliant narration cinématique, design sonore interactif et performances WebGL développée au sein de LevelUp Ecosystem.",
    full_content: `Final Stop repousse les limites des applications web en proposant une traversée narrative ultra-fluide construite sur Next.js, shaders WebGL et spatial audio.

### Spécificités Techniques
- **Performances 60 FPS** : Rendu graphique haute précision optimisé pour mobile et desktop.
- **Design Sonore Spatial** : Intégration audio interactive réagissant au scroll de l'utilisateur.
- **Direction Artistique Cinématique** : Typographie sur mesure et contrastes sombres immersifs.`,
    avatar_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    banner_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    website_url: "https://levelupecosystem.com/projects",
    social_links: {},
    tags: ["Final Stop", "Web3D", "Next.js", "LevelUp", "Innovation"],
    status: "published",
    created_at: "2026-02-01T00:00:00Z",
  },
];

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

// Support both new Supabase format (sb_publishable_...) and legacy JWT anon format
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

// Server-side secret key (sb_secret_... or legacy service_role)
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

// Use secret key on server if available, otherwise fall back to publishable key
const EFFECTIVE_SERVER_KEY = SUPABASE_SECRET_KEY || SUPABASE_KEY;

function isConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
      !SUPABASE_URL.includes("your-project-id") &&
      EFFECTIVE_SERVER_KEY &&
      !EFFECTIVE_SERVER_KEY.includes("your-anon-public-key") &&
      !EFFECTIVE_SERVER_KEY.includes("your-service-role")
  );
}

/**
 * Fetch all published entities with optional filtering
 */
export async function getEntities(options?: {
  category?: string;
  type?: string;
  search?: string;
  limit?: number;
}): Promise<Entity[]> {
  if (!isConfigured()) {
    let result = [...FALLBACK_ENTITIES];
    if (options?.category && options.category !== "all") {
      result = result.filter(
        (e) => e.category.toLowerCase() === options.category?.toLowerCase()
      );
    }
    if (options?.type && options.type !== "all") {
      result = result.filter((e) => e.entity_type === options.type);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
          e.short_bio.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  try {
    const params = new URLSearchParams();
    params.set("status", "eq.published");
    params.set("order", "created_at.desc");

    if (options?.category && options.category !== "all") {
      params.set("category", `eq.${options.category}`);
    }
    if (options?.type && options.type !== "all") {
      params.set("entity_type", `eq.${options.type}`);
    }
    if (options?.limit) {
      params.set("limit", String(options.limit));
    }
    if (options?.search) {
      params.set(
        "or",
        `(name.ilike.*${options.search}*,short_bio.ilike.*${options.search}*)`
      );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/entities?${params.toString()}`, {
      headers: {
        apikey: EFFECTIVE_SERVER_KEY!,
        Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
      },
      next: { revalidate: 60 }, // Incremental Static Regeneration (ISR) - 60s cache
    });

    if (!res.ok) {
      console.warn("Supabase rest query returned status:", res.status);
      return FALLBACK_ENTITIES;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data as Entity[]) : FALLBACK_ENTITIES;
  } catch (error) {
    console.error("Failed to query Supabase entities:", error);
    return FALLBACK_ENTITIES;
  }
}

/**
 * Fetch a single entity by its unique slug
 */
export async function getEntityBySlug(slug: string): Promise<Entity | null> {
  if (!isConfigured()) {
    const found = FALLBACK_ENTITIES.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
    return found || null;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/entities?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;
    const list = await res.json();
    if (Array.isArray(list) && list.length > 0) {
      return list[0] as Entity;
    }

    // Check fallback if not in remote DB
    return (
      FALLBACK_ENTITIES.find((e) => e.slug.toLowerCase() === slug.toLowerCase()) || null
    );
  } catch (error) {
    console.error("Failed to query entity by slug:", error);
    return (
      FALLBACK_ENTITIES.find((e) => e.slug.toLowerCase() === slug.toLowerCase()) || null
    );
  }
}

/**
 * Get all slugs for sitemap generation
 */
export async function getAllEntitySlugs(): Promise<string[]> {
  const entities = await getEntities();
  return entities.map((e) => e.slug);
}

/**
 * Generate Schema.org JSON-LD for Google rich snippets
 */
export function generateSchemaOrgJsonLd(entity: Entity, baseUrl: string) {
  const pageUrl = `${baseUrl}/entities/${entity.slug}`;
  const sameAsList = entity.social_links ? Object.values(entity.social_links) : [];

  let schemaType = "Thing";
  switch (entity.entity_type) {
    case "person":
    case "artist":
      schemaType = "Person";
      break;
    case "organization":
    case "company":
      schemaType = "Organization";
      break;
    case "creative_work":
    case "project":
    case "game":
      schemaType = "CreativeWork";
      break;
    default:
      schemaType = "Thing";
  }

  const primarySchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: entity.name,
    description: entity.short_bio,
    url: pageUrl,
    image: entity.avatar_url || entity.banner_url || undefined,
    sameAs: sameAsList.length > 0 ? sameAsList : undefined,
  };

  if (schemaType === "Person" && entity.subtitle) {
    primarySchema.jobTitle = entity.subtitle;
    primarySchema.worksFor = {
      "@type": "Organization",
      name: "LevelUp Ecosystem",
      url: baseUrl,
    };
  }

  // Breadcrumbs schema for Google SERP Navigation Bar
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "LevelUp Ecosystem",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Index des Entités",
        item: `${baseUrl}/entities`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entity.name,
        item: pageUrl,
      },
    ],
  };

  return {
    primarySchema,
    breadcrumbSchema,
  };
}

// ==============================================================================
// SERVER-SIDE BACKEND QUERIES (Zero frontend exposure)
// ==============================================================================

export interface PricingPlan {
  id: string;
  name: string;
  subtitle?: string | null;
  badge?: string | null;
  price: string;
  price_period: string;
  secondary_note?: string | null;
  description: string;
  short_points: string[];
  full_features?: unknown[];
  is_recommended?: boolean;
  cta_text: string;
  cta_href: string;
  order_index: number;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  location: string;
  founder: string;
  contact_email: string;
  booking_url: string;
  logo_url: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: "LevelUp Ecosystem",
  tagline: "Full-stack web engineering & secure cloud architectures",
  location: "San Diego, California",
  founder: "Richelieu Bonte",
  contact_email: "levelup.ia0@gmail.com",
  booking_url: "/book",
  logo_url: "/brand-logo.svg",
};

/**
 * Fetch dynamic pricing plans from Supabase backend (Server-side only)
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (!isConfigured()) {
    return [
      {
        id: "starter",
        name: "Starter",
        subtitle: "Pour petites entreprises cherchant une présence pro rapide",
        price: "$850",
        price_period: "/one-time",
        description:
          "Site vitrine sur-mesure haute performance. Conception mobile-first, fondation SEO local et Google Maps, propriété intégrale du code sans abonnement imposé.",
        short_points: [
          "Design sur-mesure (jusqu'à 5 pages)",
          "Optimisé mobile, tablette & desktop",
          "Google Maps & Local SEO",
          "Formulaire de contact & capture de leads",
          "100% propriétaire du code",
        ],
        is_recommended: false,
        cta_text: "Commander Starter",
        cta_href: "/book?plan=starter",
        order_index: 1,
      },
      {
        id: "secure",
        name: "Secure + Booking",
        subtitle: "Pour les professionnels nécessitant prise de rdv 24/7 et sécurité",
        badge: "Plus Populaire",
        price: "$1,500",
        price_period: "/one-time",
        description:
          "Architecture web complète avec système de réservation automatisé 24/7, synchronisation calendrier, passerelle d'acompte Stripe et audit de sécurité des règles cloud.",
        short_points: [
          "Tout ce qui est dans Starter",
          "Module de réservation 24/7 en ligne",
          "Synchronisation Google Calendar & Stripe",
          "Sécurisation des clés API & règles base",
          "Support technique dédié 30 jours",
        ],
        is_recommended: true,
        cta_text: "Choisir Secure + Booking",
        cta_href: "/book?plan=secure",
        order_index: 2,
      },
      {
        id: "custom",
        name: "Custom Architecture",
        subtitle: "Pour plateformes à fort trafic, applications SaaS et bases massives",
        badge: "Grand Compte",
        price: "$3,000+",
        price_period: "/sur devis",
        description:
          "Ingénierie logicielle avancée : bases de données relationnelles PostgreSQL, génération SEO programmatique, authentification multi-rôles et infrastructure cloud sur-mesure.",
        short_points: [
          "Base de données PostgreSQL / Supabase haute performance",
          "SEO programmatique & Rich Snippets Google",
          "Authentification sécurisée & rôles d'accès",
          "Optimisation vitesse sub-seconde & CDN mondial",
          "Contrat de maintenance & SLA disponible",
        ],
        is_recommended: false,
        cta_text: "Demander une Architecture Dédiée",
        cta_href: "/book?plan=custom",
        order_index: 3,
      },
    ];
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pricing_plans?status=eq.published&order=order_index.asc`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 300 }, // 5 min cache
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as PricingPlan[];
  } catch (error) {
    console.error("Error fetching pricing plans from backend:", error);
    return [];
  }
}

/**
 * Fetch global site settings (branding, contact, logos)
 */
export async function getSiteSettings(key = "general"): Promise<SiteSettings> {
  if (!isConfigured()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}&limit=1`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return DEFAULT_SETTINGS;
    const list = await res.json();
    if (Array.isArray(list) && list.length > 0 && list[0].value) {
      return { ...DEFAULT_SETTINGS, ...list[0].value };
    }
    return DEFAULT_SETTINGS;
  } catch (err) {
    console.error("Error fetching site settings from backend:", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Fetch legal document markdown (Terms, Privacy, Cookies)
 */
export async function getLegalDocument(slug: string): Promise<{
  title: string;
  last_updated: string;
  content_markdown: string;
} | null> {
  if (!isConfigured()) return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/legal_documents?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    const list = await res.json();
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  } catch (err) {
    console.error("Error fetching legal document:", err);
    return null;
  }
}

/**
 * Fetch published projects/case-studies from Supabase
 */
export async function getProjects() {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?status=eq.published&order=order_index.asc`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching projects from Supabase:", err);
    return null;
  }
}

/**
 * Fetch FAQs from Supabase
 */
export async function getFaqs() {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/faqs?status=eq.published&order=order_index.asc`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching FAQs from Supabase:", err);
    return null;
  }
}

/**
 * Fetch Testimonials from Supabase
 */
export async function getTestimonials() {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/testimonials?status=eq.published&order=order_index.asc`,
      {
        headers: {
          apikey: EFFECTIVE_SERVER_KEY!,
          Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching testimonials from Supabase:", err);
    return null;
  }
}

/**
 * Record a new lead/inquiry into Supabase
 */
export async function recordLead(lead: {
  name: string;
  email: string;
  company?: string;
  employees?: string;
  message?: string;
  isWaitlisted?: boolean;
  queuePosition?: number;
  source?: string;
}) {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EFFECTIVE_SERVER_KEY!,
        Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        company: lead.company || null,
        employees: lead.employees || null,
        message: lead.message || null,
        is_waitlisted: Boolean(lead.isWaitlisted),
        queue_position: lead.queuePosition || 1,
        source: lead.source || "website_contact",
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn("Supabase recordLead error:", errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("Failed to record lead in Supabase:", err);
    return null;
  }
}

/**
 * Record a booking / RSVP into Supabase
 */
export async function recordBooking(booking: {
  type: "consultation" | "wedding_rsvp" | "preview_call";
  name: string;
  email: string;
  phone?: string;
  inviteCode?: string;
  slotTime?: string;
  status?: "pending" | "confirmed" | "cancelled";
  meta?: Record<string, unknown>;
}) {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EFFECTIVE_SERVER_KEY!,
        Authorization: `Bearer ${EFFECTIVE_SERVER_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        type: booking.type,
        name: booking.name,
        email: booking.email,
        phone: booking.phone || null,
        invite_code: booking.inviteCode || null,
        slot_time: booking.slotTime || null,
        status: booking.status || "confirmed",
        meta: booking.meta || {},
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn("Supabase recordBooking error:", errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("Failed to record booking in Supabase:", err);
    return null;
  }
}


/**
 * Registers a public form submission for levelup-ecosystem.com in the shared
 * LevelUp tables (form_submissions) through the rate-limited `submit_form` RPC.
 * Returns "rate_limited" when the visitor exceeded the allowance, so callers
 * can refuse before sending any email.
 */
export async function registerSubmission(input: {
  formType: "contact" | "preview_request";
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  data?: Record<string, unknown>;
  source?: string;
}): Promise<"ok" | "rate_limited" | "unavailable"> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return "unavailable";
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        p_website_id: process.env.WEBSITE_ID || "ws_6e797257f5b32b86",
        p_form_type: input.formType,
        p_name: input.name || null,
        p_email: input.email,
        p_phone: input.phone || null,
        p_company: input.company || null,
        p_message: input.message || null,
        p_data: input.data || {},
        p_source: input.source || "website",
      }),
    });
    if (res.status === 429) return "rate_limited";
    if (!res.ok) {
      console.warn("Supabase submit_form error:", res.status);
      return "unavailable";
    }
    return "ok";
  } catch (err) {
    console.warn("Failed to register submission:", err);
    return "unavailable";
  }
}
