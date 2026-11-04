
import type { Pattern } from "./schema";
import type { PatternSlug } from "./types";

const patterns: readonly Pattern[] = [
  // Each pattern module will be imported and appended here as content lands.
];

export function getAllPatterns(): readonly Pattern[] {
  return patterns;
}

export function getPattern(slug: PatternSlug): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}