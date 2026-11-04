import type { Pattern } from "./schema";
import { PatternSlug, patternSlugs } from "./types";
import { abstractFactory } from "./abstract-factory";
import { builder } from "./builder";
import { factoryMethod } from "./factory-method";

import { singleton } from "./singleton";
import { strategy } from "./strategy";
import { prototype } from "./prototype"

const patterns: readonly Pattern[] = [
  abstractFactory,
  builder,
  factoryMethod,
  prototype,
  singleton,
  strategy,
];

export function sortPatterns<T extends { slug: PatternSlug }>(
  input: readonly T[],
): T[] {
  return [...input].sort(
    (a, b) => patternSlugs.indexOf(a.slug) - patternSlugs.indexOf(b.slug),
  );
}

export function getAllPatterns(): readonly Pattern[] {
  return sortPatterns(patterns);
}

export function getPattern(slug: PatternSlug): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}