import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

import {
  getAllEntitySlugs,
  getEntityBySlug,
  generateSchemaOrgJsonLd,
} from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://levelupecosystem.com";

// ==============================================================================
// 1. DYNAMIC SEO METADATA FOR GOOGLE SEARCH
// ==============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getEntityBySlug(slug);

  if (!entity) {
    return {
      title: "Entité introuvable | LevelUp Ecosystem",
      description: "Cette page d'entité n'existe pas ou a été déplacée.",
    };
  }

  const pageTitle = `${entity.name} | Répertoire Officiel & Profil Indexé`;
  const pageDescription = entity.short_bio.slice(0, 160);
  const pageUrl = `${BASE_URL}/entities/${entity.slug}`;
  const ogImage =
    entity.banner_url ||
    entity.avatar_url ||
    "https://levelupecosystem.com/og-default.jpg";

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "profile",
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: "LevelUp Ecosystem Knowledge Graph",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: entity.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

// Generate static params for pre-rendering
export async function generateStaticParams() {
  const slugs = await getAllEntitySlugs();
  return slugs.map((slug) => ({ slug }));
}

// ==============================================================================
// 2. DYNAMIC ENTITY PAGE COMPONENT
// ==============================================================================
export default async function EntityPage({ params }: Props) {
  const { slug } = await params;
  const entity = await getEntityBySlug(slug);

  if (!entity) {
    notFound();
  }

  const { primarySchema, breadcrumbSchema } = generateSchemaOrgJsonLd(
    entity,
    BASE_URL
  );

  return (
    <>
      {/* Schema.org Structured Data (JSON-LD) for Googlebot Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(primarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#0c0a09] text-[#efe8dc] selection:bg-[#c98a52] selection:text-[#0c0a09]">
        {/* Banner Area */}
        <div className="relative h-64 w-full md:h-96">
          {entity.banner_url ? (
            <Image
              src={entity.banner_url}
              alt={`Bannière de ${entity.name}`}
              fill
              priority
              className="object-cover opacity-40 brightness-90"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#171311] via-[#201a17] to-[#0c0a09]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30" />

          {/* Top navigation link */}
          <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 pt-24 sm:px-8">
            <Link
              href="/entities"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#efe8dc]/80 backdrop-blur-md transition-all hover:border-[#c98a52] hover:text-[#c98a52]"
            >
              <ArrowLeft className="size-4" />
              <span>Retour à l&apos;annuaire</span>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#c98a52]/40 bg-[#c98a52]/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#c98a52]">
              <ShieldCheck className="size-3.5" />
              <span>Indexé & Vérifié Schema.org</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative mx-auto max-w-6xl px-6 pb-24 sm:px-8">
          <div className="relative -mt-20 flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
            {/* Avatar / Portrait */}
            <div className="relative size-36 shrink-0 overflow-hidden rounded-2xl border-2 border-[#c98a52]/40 bg-[#171311] shadow-2xl md:size-44">
              {entity.avatar_url ? (
                <Image
                  src={entity.avatar_url}
                  alt={entity.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-[#c98a52]">
                  {entity.name.slice(0, 2)}
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex-1">
              {/* Breadcrumb line */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#efe8dc]/50">
                <Link href="/" className="hover:text-[#c98a52]">
                  LevelUp
                </Link>
                <span>/</span>
                <Link href="/entities" className="hover:text-[#c98a52]">
                  Annuaire
                </Link>
                <span>/</span>
                <span className="text-[#c98a52]">{entity.category}</span>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-5xl">
                {entity.name}
              </h1>

              {entity.subtitle && (
                <p className="mt-2 text-lg font-medium text-[#c98a52] md:text-xl">
                  {entity.subtitle}
                </p>
              )}
            </div>

            {/* Official Website Action */}
            {entity.website_url && (
              <div className="shrink-0">
                <a
                  href={entity.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c98a52] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0c0a09] transition-all hover:bg-[#b0753f] hover:shadow-lg hover:shadow-[#c98a52]/20"
                >
                  <Globe className="size-4" />
                  <span>Site / Page Dédiée</span>
                  <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </div>
            )}
          </div>

          {/* Grid Layout : Story & Details Sidebar */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Short Bio (Google Snippet Highlight) */}
              <div className="rounded-2xl border border-white/5 bg-[#171311]/80 p-6 md:p-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#c98a52]">
                  Aperçu Officiel (Extrait Indexé)
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-[#efe8dc]/90">
                  {entity.short_bio}
                </p>
              </div>

              {/* Full Content */}
              {entity.full_content && (
                <div className="mt-8 space-y-6 text-[#efe8dc]/80">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    Biographie & Présentation Complète
                  </h3>
                  <div className="whitespace-pre-line leading-relaxed">
                    {entity.full_content}
                  </div>
                </div>
              )}

              {/* Tag Badges */}
              {entity.tags && entity.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Tag className="size-4 text-[#c98a52]" />
                  {entity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#efe8dc]/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata & Social Sidebar */}
            <div className="space-y-6">
              {/* Knowledge Graph Card */}
              <div className="rounded-2xl border border-white/5 bg-[#171311]/60 p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c98a52]">
                  Fiche Connaissance Googlebot
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-[#efe8dc]/50">Type d&apos;entité</dt>
                    <dd className="font-semibold uppercase text-white">
                      {entity.entity_type}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-[#efe8dc]/50">Catégorie</dt>
                    <dd className="font-medium text-[#c98a52]">{entity.category}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-[#efe8dc]/50">Statut Indexation</dt>
                    <dd className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span>Actif & Indexable</span>
                    </dd>
                  </div>
                  <div className="flex justify-between pt-1">
                    <dt className="text-[#efe8dc]/50">ID Slug</dt>
                    <dd className="font-mono text-xs text-[#efe8dc]/70">
                      /{entity.slug}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Social Channels */}
              {entity.social_links &&
                Object.keys(entity.social_links).length > 0 && (
                  <div className="rounded-2xl border border-white/5 bg-[#171311]/60 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c98a52]">
                      Canaux & Réseaux Officiels
                    </h3>
                    <div className="mt-4 space-y-2">
                      {Object.entries(entity.social_links).map(
                        ([platform, link]) => (
                          <a
                            key={platform}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-xs font-semibold capitalize text-[#efe8dc]/80 transition-all hover:border-[#c98a52]/40 hover:text-white"
                          >
                            <span>{platform}</span>
                            <ExternalLink className="size-3.5 opacity-50" />
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Ecosystem Callout */}
              <div className="rounded-2xl border border-[#c98a52]/30 bg-gradient-to-br from-[#171311] via-[#201a17] to-[#0c0a09] p-6">
                <div className="flex items-center gap-2 text-[#c98a52]">
                  <Sparkles className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    LevelUp Ecosystem
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-white">
                  Faites indexer votre marque ou projet
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#efe8dc]/70">
                  Développez votre présence numérique, votre autorité de marque
                  et votre visibilité Google grâce à nos infrastructures web
                  dédiées.
                </p>
                <Link
                  href="/book"
                  className="mt-4 block w-full rounded-xl bg-white/10 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#c98a52] hover:text-[#0c0a09]"
                >
                  Demander une indexation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
