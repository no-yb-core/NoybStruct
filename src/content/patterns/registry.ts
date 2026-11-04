
import type { Pattern } from "./schema";
import type { PatternSlug } from "./types";


import { strategy } from "./strategy";

const patterns: readonly Pattern[] = [strategy];

export function getAllPatterns(): readonly Pattern[] {
  return patterns;
}

export function getPattern(slug: PatternSlug): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}