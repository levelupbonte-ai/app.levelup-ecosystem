import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, ShieldCheck, Sparkles } from "lucide-react";

import { getEntities } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Annuaire Officiel des Entités & Projets | LevelUp Ecosystem",
  description:
    "Explorez le répertoire officiel et les profils indexés de LevelUp Ecosystem. Créateurs, directeurs artistiques, entreprises et applications à forte valeur ajoutée.",
  openGraph: {
    title: "Annuaire des Entités Indexées | LevelUp Ecosystem",
    description:
      "Explorez le répertoire officiel et les profils indexés de LevelUp Ecosystem.",
  },
};

export default async function EntitiesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const entities = await getEntities({
    search: q,
    category: category,
  });

  const categories = [
    { label: "Toutes", value: "all" },
    { label: "Culture & Médias", value: "Culture & Médias" },
    { label: "Entrepreneuriat & Éducation", value: "Entrepreneuriat & Éducation" },
    { label: "Technologie & Design", value: "Technologie & Design" },
  ];

  return (
    <main className="min-h-screen bg-[#0c0a09] px-6 pt-32 pb-24 text-[#efe8dc] sm:px-8 selection:bg-[#c98a52] selection:text-[#0c0a09]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c98a52]/40 bg-[#c98a52]/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c98a52]">
            <Sparkles className="size-3.5" />
            <span>Base de Connaissances & SEO Programmatique</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Répertoire Officiel & Profils Indexés
          </h1>
          <p className="mt-4 text-base text-[#efe8dc]/70 md:text-lg">
            Chaque créateur, projet et entreprise propulsé par LevelUp dispose
            d&apos;une présence numérique haute fidélité, optimisée pour
            Googlebot, les moteurs d&apos;IA et le Knowledge Graph mondial.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
          {categories.map((cat) => {
            const isActive =
              (!category && cat.value === "all") || category === cat.value;
            const href =
              cat.value === "all" ? "/entities" : `/entities?category=${encodeURIComponent(cat.value)}`;

            return (
              <Link
                key={cat.value}
                href={href}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-[#c98a52] text-[#0c0a09]"
                    : "border border-white/10 bg-white/5 text-[#efe8dc]/70 hover:border-[#c98a52]/40 hover:text-white"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Entities Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/entities/${entity.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#171311] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c98a52]/50 hover:shadow-2xl hover:shadow-[#c98a52]/10"
            >
              <div>
                {/* Header Avatar & Tag */}
                <div className="flex items-start justify-between gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#201a17]">
                    {entity.avatar_url ? (
                      <Image
                        src={entity.avatar_url}
                        alt={entity.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-serif text-xl text-[#c98a52]">
                        {entity.name.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <span className="rounded-full border border-[#c98a52]/30 bg-[#c98a52]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c98a52]">
                    {entity.category}
                  </span>
                </div>

                {/* Name & Bio */}
                <div className="mt-5">
                  <h2 className="text-xl font-bold text-white transition-colors group-hover:text-[#c98a52]">
                    {entity.name}
                  </h2>
                  {entity.subtitle && (
                    <p className="mt-1 text-xs font-medium text-[#c98a52]/90">
                      {entity.subtitle}
                    </p>
                  )}
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#efe8dc]/70">
                    {entity.short_bio}
                  </p>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-400/90 text-[11px] font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span>Google Indexé</span>
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-[#c98a52] transition-transform group-hover:translate-x-1">
                  <span>Consulter la fiche</span>
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {entities.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/5 bg-[#171311] p-12 text-center">
            <p className="text-lg text-[#efe8dc]/60">
              Aucune entité trouvée pour cette sélection.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
