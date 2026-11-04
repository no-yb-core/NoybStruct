import type { Pattern } from "./schema";
import { patternSlugs, PatternSlug } from "./types";
import { abstractFactory } from "./abstract-factory";
import { adapter } from "./adapter";
import { bridge } from "./bridge";
import { builder } from "./builder";
import { chainOfResponsibility } from "./chain-of-responsibility";
import { command } from "./command";
import { composite } from "./composite";
import { decorator } from "./decorator";
import { facade } from "./facade";
import { factoryMethod } from "./factory-method";
import { flyweight } from "./flyweight";
import { iterator } from "./iterator";
import { mediator } from "./mediator";
import { observer } from "./observer";
import { prototype } from "./prototype";
import { proxy } from "./proxy";
import { singleton } from "./singleton";
import { state } from "./state";
import { strategy } from "./strategy";
import { templateMethod } from "./template-method";

const patterns: readonly Pattern[] = [
  abstractFactory,
  adapter,
  bridge,
  builder,
  chainOfResponsibility,
  command,
  composite,
  decorator,
  facade,
  factoryMethod,
  flyweight,
  iterator,
  mediator,
  observer,
  prototype,
  proxy,
  singleton,
  state,
  strategy,
  templateMethod,
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
