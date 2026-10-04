-- ==============================================================================
-- LEVELUP ECOSYSTEM - SUPABASE POSTGRESQL ARCHITECTURE
-- 100% Server-Authoritative Database Schema
-- No credentials or database mutations ever exposed to the client-side frontend
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SITE GLOBAL SETTINGS (Logos, Slogans, Contacts, Social links)
-- Permet de changer le slogan, les logos, ou le téléphone sans redéployer
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRICING PLANS & PACKAGES
-- Permet de modifier les tarifs, devises, remises et fonctionnalités du jour au lendemain
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    price TEXT NOT NULL,
    price_period TEXT NOT NULL DEFAULT '/one-time',
    secondary_note TEXT,
    description TEXT NOT NULL,
    short_points TEXT[] NOT NULL DEFAULT '{}',
    full_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_recommended BOOLEAN DEFAULT false,
    cta_text TEXT NOT NULL DEFAULT 'Book Architecture Call',
    cta_href TEXT NOT NULL DEFAULT '/book',
    order_index INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LEGAL DOCUMENTS (Terms, Privacy, Cookies)
-- Permet de changer les conditions générales et politiques en 1 seconde sans toucher au code
CREATE TABLE IF NOT EXISTS public.legal_documents (
    slug TEXT PRIMARY KEY, -- 'terms', 'privacy', 'cookies'
    title TEXT NOT NULL,
    subtitle TEXT,
    last_updated TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ENTITIES DIRECTORY (Programmatic SEO & Knowledge Graph)
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    entity_type TEXT NOT NULL DEFAULT 'person',
    category TEXT NOT NULL DEFAULT 'General',
    short_bio TEXT NOT NULL,
    full_content TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    structured_data_override JSONB,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    views_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_entities_slug ON public.entities (slug);
CREATE INDEX IF NOT EXISTS idx_entities_status ON public.entities (status);
CREATE INDEX IF NOT EXISTS idx_pricing_status ON public.pricing_plans (status, order_index);
CREATE INDEX IF NOT EXISTS idx_legal_slug ON public.legal_documents (slug);

-- 7. ROW LEVEL SECURITY (RLS) - HARDENED SERVER-SIDE ACCESS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Read policies: Public / Googlebot can ONLY read published rows
DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read pricing" ON public.pricing_plans;
CREATE POLICY "Public read pricing" ON public.pricing_plans FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read legal" ON public.legal_documents;
CREATE POLICY "Public read legal" ON public.legal_documents FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read entities" ON public.entities;
CREATE POLICY "Public read entities" ON public.entities FOR SELECT USING (status = 'published');

-- Write policies: Locked exclusively to Service Role (Admin Backend)
DROP POLICY IF EXISTS "Admin write settings" ON public.site_settings;
CREATE POLICY "Admin write settings" ON public.site_settings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Admin write pricing" ON public.pricing_plans;
CREATE POLICY "Admin write pricing" ON public.pricing_plans FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Admin write legal" ON public.legal_documents;
CREATE POLICY "Admin write legal" ON public.legal_documents FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Admin write entities" ON public.entities;
CREATE POLICY "Admin write entities" ON public.entities FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Site Settings Seed
INSERT INTO public.site_settings (key, value, description)
VALUES 
(
    'general',
    '{
        "brand_name": "LevelUp Ecosystem",
        "tagline": "Full-stack web engineering & secure cloud architectures",
        "location": "San Diego, California",
        "founder": "Richelieu Bonte",
        "contact_email": "levelup.ia0@gmail.com",
        "booking_url": "/book",
        "logo_url": "/brand-logo.svg"
    }'::jsonb,
    'General brand identity & contact info'
)
ON CONFLICT (key) DO NOTHING;

-- Pricing Plans Seed
INSERT INTO public.pricing_plans (id, name, subtitle, badge, price, price_period, description, short_points, is_recommended, order_index, status)
VALUES
(
    'starter',
    'Starter',
    'Pour petites entreprises cherchant une présence pro rapide',
    NULL,
    '$850',
    '/one-time',
    'Site vitrine sur-mesure haute performance. Conception mobile-first, fondation SEO local et Google Maps, propriété intégrale du code sans abonnement imposé.',
    ARRAY['Design sur-mesure (jusqu''à 5 pages)', 'Optimisé mobile, tablette & desktop', 'Google Maps & Local SEO', 'Formulaire de contact & capture de leads', '100% propriétaire du code'],
    false,
    1,
    'published'
),
(
    'secure',
    'Secure + Booking',
    'Pour les professionnels nécessitant prise de rdv 24/7 et sécurité',
    'Plus Populaire',
    '$1,500',
    '/one-time',
    'Architecture web complète avec système de réservation automatisé 24/7, synchronisation calendrier, passerelle d''acompte Stripe et audit de sécurité des règles cloud.',
    ARRAY['Tout ce qui est dans Starter', 'Module de réservation 24/7 en ligne', 'Synchronisation Google Calendar & Stripe', 'Sécurisation des clés API & règles base', 'Support technique dédié 30 jours'],
    true,
    2,
    'published'
),
(
    'custom',
    'Custom Architecture',
    'Pour plateformes à fort trafic, applications SaaS et bases massives',
    'Grand Compte',
    '$3,000+',
    '/sur devis',
    'Ingénierie logicielle avancée : bases de données relationnelles PostgreSQL, génération SEO programmatique, authentification multi-rôles et infrastructure cloud sur-mesure.',
    ARRAY['Base de données PostgreSQL / Supabase haute performance', 'SEO programmatique & Rich Snippets Google', 'Authentification sécurisée & rôles d''accès', 'Optimisation vitesse sub-seconde & CDN mondial', 'Contrat de maintenance & SLA disponible'],
    false,
    3,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- Entities Seed
INSERT INTO public.entities (slug, name, subtitle, entity_type, category, short_bio, full_content, avatar_url, banner_url, website_url, tags, status)
VALUES 
(
    'momon-samuel',
    'Momon Samuel',
    'Directeur Artistique, Créateur & Visionnaire Média',
    'person',
    'Culture & Médias',
    'Momon Samuel est un directeur artistique et stratège créatif reconnu dans le développement de talents, la production musicale et la direction de projets médias d''envergure internationale.',
    'Momon Samuel accompagne les artistes et entreprises dans l''affirmation de leur identité visuelle et sonore.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    'https://levelupecosystem.com',
    ARRAY['Artiste', 'Directeur Artistique', 'Musique', 'Production', 'LevelUp'],
    'published'
),
(
    'blackpater',
    'Black_Pater (Jean-Pierre Lofumbwa)',
    'Entrepreneur, Éducateur & Ambassadeur Culturel Congolais',
    'person',
    'Entrepreneuriat & Éducation',
    'Black_Pater (Jean-Pierre Lofumbwa, Le Prof) est un entrepreneur, créateur de contenu et éducateur congolais basé aux États-Unis, pionnier de la transmission culturelle et linguistique.',
    'Fondateur de Black_Pater, Jean-Pierre Lofumbwa incarne l''excellence culturelle congolaise aux États-Unis.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1600&q=80',
    'https://levelupecosystem.com/projects/blackpater-portofolio.html',
    ARRAY['BlackPater', 'Le Prof', 'Congo', 'Culture', 'Lingala', 'USA'],
    'published'
)
ON CONFLICT (slug) DO NOTHING;
