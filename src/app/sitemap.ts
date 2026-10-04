import type { MetadataRoute } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { defaultProjects } from "@/data/projects";
import { db } from "@/lib/firebase";
import { getEntities } from "@/lib/supabase";

/**
 * Dynamic Sitemap Generator for Next.js App Router:
 * Fetches all active client and showcase project records directly from Firebase Firestore,
 * merges them with core service and landing pages, and returns high-priority Google crawl directives.
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
      url: `${baseUrl}/entities`,
      lastModified: now,
      changeFrequency: "daily",
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

  // 2. Dynamic project routes from Firestore
  const dynamicProjectRoutes: MetadataRoute.Sitemap = [];
  const processedProjectIds = new Set<string>();

  try {
    const projectsCol = collection(db, "projects");
    const q = query(projectsCol, orderBy("step", "asc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const slug = data.slug || docSnap.id;

      if (slug && !processedProjectIds.has(slug)) {
        processedProjectIds.add(slug);

        let lastModifiedDate = now;
        if (data.updatedAt?.toDate) {
          lastModifiedDate = data.updatedAt.toDate();
        } else if (data.createdAt?.toDate) {
          lastModifiedDate = data.createdAt.toDate();
        }

        dynamicProjectRoutes.push({
          url: `${baseUrl}/projects/${slug}`,
          lastModified: lastModifiedDate,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[Sitemap] Could not retrieve live projects from Firestore, using fallbacks:", err);
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

  // 4. Dynamic entity profiles from Supabase (Programmatic SEO)
  const dynamicEntityRoutes: MetadataRoute.Sitemap = [];
  try {
    const entities = await getEntities();
    for (const entity of entities) {
      let lastMod = now;
      if (entity.updated_at) {
        lastMod = new Date(entity.updated_at);
      } else if (entity.created_at) {
        lastMod = new Date(entity.created_at);
      }

      dynamicEntityRoutes.push({
        url: `${baseUrl}/entities/${entity.slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[Sitemap] Could not retrieve entities for sitemap:", err);
    }
  }

  return [...staticRoutes, ...dynamicProjectRoutes, ...dynamicEntityRoutes];
}
