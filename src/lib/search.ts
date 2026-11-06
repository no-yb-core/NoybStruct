import { patterns } from "@/content/patterns/registry";

export type SearchResult = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

export function searchPatterns(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return patterns
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
    .map((p) => ({
      slug: p.slug,
      title: p.name,
      description: p.category,
      href: `/patterns/${p.slug}`,
    }));
}
