import type { Metadata } from "next";
import { getAllPatterns } from "@/content/patterns/registry";
import { PatternLibraryView } from "@/components/library/pattern-library-view";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse the 23 Gang of Four design patterns.",
};

export default function LibraryPage() {
  const patterns = getAllPatterns();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Volume I · The Codex
          </span>
          <span className="rounded-xs border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            23 Chapters
          </span>
        </div>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          The Library
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          The 23 Gang of Four design patterns, each cataloged with TypeScript
          implementations, architectural diagrams, and real-world trade-offs.
        </p>
      </header>

      <section className="mt-10">
        <PatternLibraryView patterns={patterns} />
      </section>
    </div>
  );
}
