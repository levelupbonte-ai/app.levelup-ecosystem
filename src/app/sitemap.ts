import type { MetadataRoute } from "next";

import { getLiveProjects } from "@/lib/levelup-site";

/**
 * Dynamic Sitemap Generator for Next.js App Router:
 * Merges high-authority static pages and client projects from the LevelUp database.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://levelup-ecosystem.com";
  const now = new Date();

  // 1. Core high-authority static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Project routes (LevelUp database, else the built-in list; never throws)
  const projectIds = new Set((await getLiveProjects()).map((p) => p.id));
  const dynamicProjectRoutes: MetadataRoute.Sitemap = [...projectIds].map(
    (id) => ({
      url: `${baseUrl}/projects/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  return [...staticRoutes, ...dynamicProjectRoutes];
}
