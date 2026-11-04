export const patternCategories = [
  "creational",
  "structural",
  "behavioral",
] as const;

export type PatternCategory = (typeof patternCategories)[number];

export const patternCategoryLabels: Record<PatternCategory, string> = {
  creational: "Creational",
  structural: "Structural",
  behavioral: "Behavioral",
};

export const patternSlugs = [
  "abstract-factory",
  "builder",
  "factory-method",
  "prototype",
  "singleton",
  "adapter",
  "bridge",
  "composite",
  "decorator",
  "facade",
  "flyweight",
  "proxy",
  "chain-of-responsibility",
  "command",
  "interpreter",
  "iterator",
  "mediator",
  "memento",
  "observer",
  "state",
  "strategy",
  "template-method",
  "visitor",
] as const;

export type PatternSlug = (typeof patternSlugs)[number];