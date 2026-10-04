-- ==============================================================================
-- LEVELUP ECOSYSTEM - ARCHITECTURE GLOBALE SUPABASE POSTGRESQL (MASTER SCHEMA)
-- Tables pour le Site Web Vitrine, l'Annuaire SEO, et l'Application LevelStudio
-- 100% Sécurisé avec Row Level Security (RLS) & Index Haute Performance
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PARAMÈTRES GLOBAUX DU SITE (Site Settings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. PROJETS & ÉTUDES DE CAS (Portfolio / Case Studies)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    step TEXT NOT NULL DEFAULT '01',
    badge TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    href TEXT NOT NULL,
    external BOOLEAN DEFAULT false,
    aspect_ratio TEXT DEFAULT 'aspect-[639/298]',
    cta_text TEXT NOT NULL DEFAULT 'Explore',
    order_index INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. PLANS TARIFAIRES (Pricing Plans & Care Plans)
-- ==============================================================================
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

-- ==============================================================================
-- 5. ANNUAIRE D'ENTITÉS & KNOWLEDGE GRAPH (Programmatic SEO)
-- ==============================================================================
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

-- ==============================================================================
-- 6. FOIRE AUX QUESTIONS (FAQs par catégories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'About LevelUp Ecosystem', 'Services & Google Ranking', 'Security & Pricing'
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. TÉMOIGNAGES CLIENTS (Testimonials & Social Proof)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    image TEXT NOT NULL,
    rating INT DEFAULT 5,
    order_index INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. CONTACTS, LEADS & DEMANDES D'APERÇU MOBILE (Form Submissions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    employees TEXT,
    message TEXT,
    is_waitlisted BOOLEAN DEFAULT false,
    queue_position INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
    source TEXT DEFAULT 'website_contact',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. RÉSERVATIONS & CONFIRMATIONS RSVP (Bookings & RSVPs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'consultation' CHECK (type IN ('consultation', 'wedding_rsvp', 'preview_call')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    invite_code TEXT,
    slot_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 10. DOCUMENTS LÉGAUX (Legal Documents: Terms, Privacy, Cookies)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.legal_documents (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    last_updated TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 11. TABLES SPÉCIFIQUES POUR LEVELSTUDIO (Studio Projects & Generations)
-- Compatible avec https://github.com/levelupbonte-ai/levelstudio
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.studio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- lié à auth.users si utilisé
    title TEXT NOT NULL,
    framework TEXT NOT NULL DEFAULT 'nextjs',
    prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'error')),
    preview_url TEXT,
    github_repo TEXT,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.studio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.studio_projects(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL, -- 'image', 'component', 'code', 'export'
    url TEXT NOT NULL,
    file_size BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 12. INDEXATION HAUTE PERFORMANCE (Sub-millisecond Queries)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status, order_index);
CREATE INDEX IF NOT EXISTS idx_pricing_status ON public.pricing_plans (status, order_index);
CREATE INDEX IF NOT EXISTS idx_entities_slug ON public.entities (slug);
CREATE INDEX IF NOT EXISTS idx_entities_status ON public.entities (status);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs (category, order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials (status, order_index);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_projects_user ON public.studio_projects (user_id);

-- ==============================================================================
-- 13. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_assets ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (Site Web & Moteurs de recherche)
DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read pricing" ON public.pricing_plans;
CREATE POLICY "Public read pricing" ON public.pricing_plans FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read entities" ON public.entities;
CREATE POLICY "Public read entities" ON public.entities FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read legal" ON public.legal_documents;
CREATE POLICY "Public read legal" ON public.legal_documents FOR SELECT USING (status = 'published');

-- Autoriser les visiteurs à soumettre un contact ou réserver (INSERT Public)
DROP POLICY IF EXISTS "Public submit leads" ON public.leads;
CREATE POLICY "Public submit leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public submit bookings" ON public.bookings;
CREATE POLICY "Public submit bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Politiques Admin Backend (Accès total pour la clé secrète service_role)
DROP POLICY IF EXISTS "Admin write settings" ON public.site_settings;
CREATE POLICY "Admin write settings" ON public.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write pricing" ON public.pricing_plans;
CREATE POLICY "Admin write pricing" ON public.pricing_plans FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write entities" ON public.entities;
CREATE POLICY "Admin write entities" ON public.entities FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write faqs" ON public.faqs;
CREATE POLICY "Admin write faqs" ON public.faqs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write testimonials" ON public.testimonials;
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write leads" ON public.leads;
CREATE POLICY "Admin write leads" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write bookings" ON public.bookings;
CREATE POLICY "Admin write bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write legal" ON public.legal_documents;
CREATE POLICY "Admin write legal" ON public.legal_documents FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write studio projects" ON public.studio_projects;
CREATE POLICY "Admin write studio projects" ON public.studio_projects FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write studio assets" ON public.studio_assets;
CREATE POLICY "Admin write studio assets" ON public.studio_assets FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- 14. SEED DATA INTÉGRALE (TOUTES LES DONNÉES DU SITE PRÉ-REMPLIES)
-- ==============================================================================

-- 14.1 Paramètres généraux
INSERT INTO public.site_settings (key, value, description)
VALUES 
(
    'general',
    '{
        "brand_name": "LevelUp Ecosystem",
        "tagline": "Full-stack web engineering & secure cloud architectures",
        "location": "San Diego, California",
        "founder": "Richelieu Bonte",
        "founder_role": "Founder & Principal Engineer",
        "contact_email": "levelup.ia0@gmail.com",
        "booking_url": "/book",
        "logo_url": "/logo.svg"
    }'::jsonb,
    'Paramètres d''identité globale et de contact'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 14.2 Projets & Études de cas
INSERT INTO public.projects (id, step, badge, title, description, image, href, external, order_index, cta_text, status)
VALUES
(
    'final-stop',
    '01',
    'Client Case Study • San Diego, CA',
    'Final Stop Barber Shop',
    'A custom digital experience built to showcase the brand, simplify appointment booking, and turn local visitors into loyal clients on any device, anytime book appointments easily, and stay connected. Built with a seamless booking system.',
    '/projects/final-stop.png',
    'https://finalstop.org',
    true,
    1,
    'Visit site',
    'published'
),
(
    'wedding-invitation',
    '02',
    'Client Project • Digital Experience',
    'Wedding Invitation',
    'A bespoke digital experience crafted to celebrate an unforgettable union: interactive prestige invitation, real-time online RSVP management, ceremony & reception itinerary, and instant confirmation.',
    '/projects/wedding-card.jpg',
    '/projects/wedding-invitation',
    false,
    2,
    'Explore the invitation',
    'published'
),
(
    'blackpater',
    '03',
    'Client Project • Digital Experience',
    'Black_Pater — Jean-Pierre Lofumbwa',
    'A bespoke cinematic digital portfolio engineered for Jean-Pierre Lofumbwa (« Le Prof »), Congolese educator, entrepreneur, and cultural ambassador in the US. Features custom typography, interactive timeline journey, cover flow showcase, and multi-language support.',
    '/projects/blackpater-card.jpg',
    '/projects/blackpater',
    false,
    3,
    'Explore the portfolio',
    'published'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    href = EXCLUDED.href;

-- 14.3 Plans Tarifaires
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
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    short_points = EXCLUDED.short_points;

-- 14.4 Entités SEO & Profils
INSERT INTO public.entities (slug, name, subtitle, entity_type, category, short_bio, full_content, avatar_url, banner_url, website_url, tags, status)
VALUES 
(
    'richelieu-bonte',
    'Richelieu Bonte',
    'Fondateur & Ingénieur Principal LevelUp Ecosystem',
    'person',
    'Ingénierie & Cybersécurité',
    'Richelieu Bonte est le fondateur et architecte principal de LevelUp Ecosystem à San Diego, Californie. Étudiant en cybersécurité originaire de la RD Congo, il conçoit des architectures web ultra-sécurisées et sans faille.',
    'Richelieu Bonte dirige personnellement la conception technique, l''audit de sécurité et le déploiement cloud de tous les projets de l''écosystème.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    'https://levelup-ecosystem.com/about',
    ARRAY['Richelieu Bonte', 'Founder', 'Cybersecurity', 'San Diego', 'LevelUp'],
    'published'
),
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
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    subtitle = EXCLUDED.subtitle,
    short_bio = EXCLUDED.short_bio;

-- 14.5 Foire Aux Questions (FAQs)
INSERT INTO public.faqs (category, question, answer, order_index, status)
VALUES
(
    'About LevelUp Ecosystem',
    'What is LevelUp Ecosystem?',
    'LevelUp Ecosystem is an independent web architecture and development studio based in San Diego, California. The studio builds fast, secure websites with 24/7 online booking, local SEO, and cybersecurity basics for businesses, barbershops, salons, and creators.',
    1,
    'published'
),
(
    'About LevelUp Ecosystem',
    'Who is Richelieu Bonte?',
    'Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem, an independent web design studio building secure, AI-assisted websites for local businesses and creators. He is a cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo.',
    2,
    'published'
),
(
    'About LevelUp Ecosystem',
    'What is LevelStudio?',
    'LevelStudio is LevelUp Ecosystem''s automated AI preview generator, allowing clients to test website concepts and interactive mobile prototypes on their phone before human engineering and deployment.',
    3,
    'published'
),
(
    'Services & Google Ranking',
    'How does the free interactive preview work?',
    'You send us your business name, services, and any photos or ideas you have. Within 24 to 48 hours, we build a functional, interactive mobile preview of your site. You get to test it on your phone before spending a single dollar. If you approve, we move forward. If not, you owe nothing.',
    4,
    'published'
),
(
    'Services & Google Ranking',
    'Can you help our business rank higher on Google Maps in San Diego?',
    'Yes. Local visibility requires coordinated website data and a verified Google Business Profile. We format your name, phone number, and service areas to match your Google listing, insert local business Schema.org structured data, and optimize page load speeds so mobile searchers convert into appointments.',
    5,
    'published'
),
(
    'Services & Google Ranking',
    'How long does a website take to build and launch?',
    'Once you approve your free preview, full custom development, 24/7 online appointment booking configuration, security hardening, and domain launch typically take 7 to 10 days.',
    6,
    'published'
),
(
    'Security & Pricing',
    'What is included in the Website Security Check?',
    'We audit your domain registrar and DNS settings, verify SSL HTTPS certificates, audit database permissions, implement two-factor authentication (2FA) on your hosting and business email accounts, install spam bot honeypots, and test for credential leakage.',
    7,
    'published'
),
(
    'Security & Pricing',
    'Do I own my website, code, and domain?',
    'Yes, 100%. Once final payment is settled, you own all rights to your domain, branding, text, and customer lists. There are no lock-in contracts or hostage fees.',
    8,
    'published'
),
(
    'Security & Pricing',
    'What is included in the $49/month Care Plan?',
    'High-speed cloud hosting, automated daily backups, monthly security updates, 24/7 uptime monitoring, and on-demand content edits (updating hours, prices, service menus, or staff members).',
    9,
    'published'
);

-- 14.6 Témoignages Clients
INSERT INTO public.testimonials (author, role, company, quote, image, order_index, status)
VALUES
(
    'Amy Chase',
    'Product Manager',
    'Mercury Finance',
    'We''re misusing LevelUp as a CRM and it still works!',
    '/testimonials/amy-chase.webp',
    1,
    'published'
),
(
    'Jonas Kotara',
    'Lead Engineer',
    'Mercury Finance',
    'I was able to replace 80% of my team with LevelUp bots.',
    '/testimonials/jonas-kotara.webp',
    2,
    'published'
),
(
    'Kevin Yam',
    'Founder',
    'Mercury Finance',
    'Founder Mode is hard enough without having a really nice PM app.',
    '/testimonials/kevin-yam.webp',
    3,
    'published'
),
(
    'Kundo Marta',
    'Founder',
    'Mercury Finance',
    'I can use the tool as a substitute from my PM.',
    '/testimonials/kundo-marta.webp',
    4,
    'published'
);
