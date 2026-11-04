import type { Metadata } from "next";
import Link from "next/link";
import { getAllPatterns } from "@/content/patterns/registry";
import {
  patternCategories,
  patternCategoryLabels,
  type PatternCategory,
} from "@/content/patterns/types";
import { Pattern } from "@/content/patterns/schema";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse the 23 Gang of Four design patterns.",
};

export default function LibraryPage() {
  const patterns = getAllPatterns();

  const byCategory: Record<PatternCategory, Pattern[]> = {
    creational: [],
    structural: [],
    behavioral: [],
  };
  for (const pattern of patterns) {
    byCategory[pattern.category].push(pattern);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-border pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Volume I
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          The Library
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The 23 Gang of Four design patterns, each as a chapter.
        </p>
      </header>

      {patternCategories.map((category) => {
        const items = byCategory[category];
        return (
          <section key={category} className="mt-12">
            <h2 className="font-heading text-2xl font-semibold">
              {patternCategoryLabels[category]}
            </h2>
            {items.length === 0 ? (
              <p className="mt-3 text-sm italic text-muted-foreground">
                Chapters for this section have not been bound yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {items.map((pattern) => (
                  <li key={pattern.slug}>
                    <Link
                      href={`/patterns/${pattern.slug}`}
                      className="group block border-l-2 border-border py-2 pl-4 transition-colors hover:border-forest"
                    >
                      <span className="font-heading text-lg group-hover:text-forest">
                        {pattern.name}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {pattern.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
