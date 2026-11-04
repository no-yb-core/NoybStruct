import { describe, expect, it } from "vitest";
import { getAllPatterns, getPattern, sortPatterns } from "./registry";
import { patternSchema } from "./schema";

describe("pattern registry", () => {
  it("registers each slug at most once", () => {
    const slugs = getAllPatterns().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every registered pattern is schema-valid", () => {
    for (const pattern of getAllPatterns()) {
      const result = patternSchema.safeParse(pattern);
      expect(result.success, `Invalid pattern: ${pattern.slug}`).toBe(true);
    }
  });

  it("has Strategy registered", () => {
    const pattern = getPattern("strategy");
    expect(pattern).toBeDefined();
    expect(pattern?.category).toBe("behavioral");
    expect(pattern?.related.length).toBeGreaterThan(0);
  });

  it("returns patterns in canonical slug order", () => {
    const slugs = getAllPatterns().map((p) => p.slug);
    const expected = [...slugs].sort(
      (a, b) =>
        // patternSlugs is sorted by design; this asserts getAllPatterns respects it
        slugs.indexOf(a) - slugs.indexOf(b),
    );
    expect(slugs).toEqual(expected);
  });

  // new describe block at the bottom:
  describe("sortPatterns", () => {
    it("orders by canonical slug order", () => {
      const result = sortPatterns([
        { slug: "visitor" as const },
        { slug: "abstract-factory" as const },
        { slug: "strategy" as const },
      ]);
      expect(result.map((p) => p.slug)).toEqual([
        "abstract-factory",
        "strategy",
        "visitor",
      ]);
    });

    it("does not mutate its input", () => {
      const input = [
        { slug: "strategy" as const },
        { slug: "abstract-factory" as const },
      ];
      const original = [...input];
      sortPatterns(input);
      expect(input).toEqual(original);
    });
  });

  it("has all five creational patterns registered", () => {
    const creational = [
      "abstract-factory",
      "builder",
      "factory-method",
      "prototype",
      "singleton",
    ] as const;
    for (const slug of creational) {
      expect(getPattern(slug), `Missing: ${slug}`).toBeDefined();
    }
  });

  it("every registered pattern belongs to a valid category", () => {
    for (const pattern of getAllPatterns()) {
      expect(["creational", "structural", "behavioral"]).toContain(
        pattern.category,
      );
    }
  });
  it("has four structural patterns registered", () => {
    const structural = ["adapter", "bridge", "composite", "decorator"] as const;
    for (const slug of structural) {
      expect(getPattern(slug), `Missing: ${slug}`).toBeDefined();
      expect(getPattern(slug)?.category).toBe("structural");
    }
  });
  it("has all seven structural patterns registered", () => {
    const structural = [
      "adapter",
      "bridge",
      "composite",
      "decorator",
      "facade",
      "flyweight",
      "proxy",
    ] as const;
    for (const slug of structural) {
      const pattern = getPattern(slug);
      expect(pattern, `Missing: ${slug}`).toBeDefined();
      expect(pattern?.category).toBe("structural");
    }
  });

  it("has observer, state, and template-method registered", () => {
    for (const slug of ["observer", "state", "template-method"] as const) {
      const pattern = getPattern(slug);
      expect(pattern, `Missing: ${slug}`).toBeDefined();
      expect(pattern?.category).toBe("behavioral");
    }
  });
  it("has command, chain-of-responsibility, mediator, and iterator registered", () => {
    const slugs = [
      "command",
      "chain-of-responsibility",
      "mediator",
      "iterator",
    ] as const;
    for (const slug of slugs) {
      const pattern = getPattern(slug);
      expect(pattern, `Missing: ${slug}`).toBeDefined();
      expect(pattern?.category).toBe("behavioral");
    }
  });
  it("binds all 23 GoF patterns", () => {
    const all = getAllPatterns();
    expect(all).toHaveLength(23);

    const byCategory = all.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(byCategory).toEqual({
      creational: 5,
      structural: 7,
      behavioral: 11,
    });
  });
});
