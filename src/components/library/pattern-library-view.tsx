"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, BookOpen, Search, X } from "lucide-react";
import type { Pattern } from "@/content/patterns/schema";
import {
  patternCategories,
  patternCategoryLabels,
  type PatternCategory,
} from "@/content/patterns/types";

type Props = {
  patterns: readonly Pattern[];
};

export function PatternLibraryView({ patterns }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<
    PatternCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: patterns.length,
      creational: patterns.filter((p) => p.category === "creational").length,
      structural: patterns.filter((p) => p.category === "structural").length,
      behavioral: patterns.filter((p) => p.category === "behavioral").length,
    };
  }, [patterns]);

  const filteredPatterns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return patterns.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [patterns, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-sm border border-border bg-secondary/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xs px-3 py-1.5 font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({counts.all})
          </button>
          {patternCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xs px-3 py-1.5 font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {patternCategoryLabels[cat]} ({counts[cat]})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter patterns…"
            className="w-full rounded-sm border border-border bg-card py-1.5 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest dark:focus:border-gold dark:focus:ring-gold"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Pattern Cards */}
      {filteredPatterns.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border py-16 text-center">
          <BookOpen className="mx-auto size-8 text-muted-foreground/60" />
          <p className="mt-3 font-heading text-lg font-semibold">
            No patterns found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No chapters match &ldquo;{searchQuery}&rdquo;. Try another term or
            reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-secondary/80"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredPatterns.map((pattern, idx) => {
              const categoryColor =
                pattern.category === "creational"
                  ? "border-gold/50 text-gold-deep dark:text-gold"
                  : pattern.category === "structural"
                    ? "border-forest/50 text-forest dark:text-forest"
                    : "border-border text-foreground";

              return (
                <motion.div
                  key={pattern.slug}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.2,
                    delay: Math.min(idx * 0.02, 0.25),
                  }}
                >
                  <Link
                    href={`/patterns/${pattern.slug}`}
                    className="group relative flex h-full flex-col justify-between rounded-sm border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-md dark:hover:border-gold/60"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-xs border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${categoryColor}`}
                        >
                          {pattern.category}
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest dark:group-hover:text-gold" />
                      </div>

                      <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-forest dark:group-hover:text-gold transition-colors">
                        {pattern.name}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {pattern.tagline}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                      <span className="font-mono text-[10px]">
                        {pattern.related.length > 0
                          ? `${pattern.related.length} related patterns`
                          : "Foundational pattern"}
                      </span>
                      <span className="text-forest dark:text-gold font-medium group-hover:underline">
                        Read chapter →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
