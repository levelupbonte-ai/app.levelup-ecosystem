import type { MetadataRoute } from "next";

import { getLiveProjects } from "@/lib/levelup-site";
import { LEGAL_DOCS, LEGAL_UPDATED_ISO } from "@/lib/legal-docs";

const BASE_URL = "https://levelup-ecosystem.com";

/**
 * sitemap.xml: every public, indexable page, the legal pages and the client
 * projects (LevelUp database, else the built-in list; never throws).
 *
 * The site language (EN / FR) is a visitor choice stored in a cookie, not a
 * separate URL, so each page appears once.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["", "weekly", 1.0],
    ["/services", "monthly", 0.9],
    ["/projects", "weekly", 0.9],
    ["/pricing", "monthly", 0.9],
    ["/studio", "monthly", 0.9],
    ["/start-project", "monthly", 0.9],
    ["/contact", "monthly", 0.8],
    ["/about", "monthly", 0.7],
    ["/faq", "monthly", 0.7]
  ];

  const staticRoutes: MetadataRoute.Sitemap = pages.map(([path, changeFrequency, priority]) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCS.map((d) => ({
    url: `${BASE_URL}${d.path}`,
    lastModified: new Date(LEGAL_UPDATED_ISO),
    changeFrequency: "yearly",
    priority: 0.3
  }));

  const internal = (await getLiveProjects()).filter((p) => !p.external);
  const projectRoutes: MetadataRoute.Sitemap = internal.map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [...staticRoutes, ...projectRoutes, ...legalRoutes];
}
