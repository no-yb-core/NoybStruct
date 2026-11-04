import type { MetadataRoute } from "next";
import { getAllPatterns } from "@/content/patterns/registry";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/workshop`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const patternRoutes: MetadataRoute.Sitemap = getAllPatterns().map((p) => ({
    url: `${siteUrl}/patterns/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...patternRoutes];
}