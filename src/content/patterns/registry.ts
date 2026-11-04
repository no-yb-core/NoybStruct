import type { Pattern } from "./schema";
import { patternSlugs, PatternSlug } from "./types";
import { abstractFactory } from "./abstract-factory";
import { adapter } from "./adapter";
import { bridge } from "./bridge";
import { builder } from "./builder";
import { composite } from "./composite";
import { decorator } from "./decorator";
import { facade } from "./facade";
import { factoryMethod } from "./factory-method";
import { flyweight } from "./flyweight";
import { prototype } from "./prototype";
import { proxy } from "./proxy";
import { singleton } from "./singleton";
import { strategy } from "./strategy";

const patterns: readonly Pattern[] = [
  abstractFactory,
  adapter,
  bridge,
  builder,
  composite,
  decorator,
  facade,
  factoryMethod,
  flyweight,
  prototype,
  proxy,
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
