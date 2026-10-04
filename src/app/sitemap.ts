import type { MetadataRoute } from "next";

import { defaultProjects } from "@/data/projects";
import { getProjects } from "@/lib/supabase";

/**
 * Dynamic Sitemap Generator for Next.js App Router:
 * Merges high-authority static pages and client projects from Supabase.
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

  // 2. Dynamic project routes from Supabase
  const dynamicProjectRoutes: MetadataRoute.Sitemap = [];
  const processedProjectIds = new Set<string>();

  try {
    const projects = await getProjects();
    if (Array.isArray(projects)) {
      for (const item of projects) {
        const slug = item.id;
        if (slug && !processedProjectIds.has(slug)) {
          processedProjectIds.add(slug);
          const lastModifiedDate = item.updated_at ? new Date(item.updated_at) : now;
          dynamicProjectRoutes.push({
            url: `${baseUrl}/projects/${slug}`,
            lastModified: lastModifiedDate,
            changeFrequency: "weekly",
            priority: 0.85,
          });
        }
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[Sitemap] Could not retrieve live projects from Supabase, using fallbacks:", err);
    }
  }

  // 3. Fallback to default verified projects if not already indexed
  for (const project of defaultProjects) {
    if (!processedProjectIds.has(project.id)) {
      processedProjectIds.add(project.id);
      dynamicProjectRoutes.push({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  return [...staticRoutes, ...dynamicProjectRoutes];
}
