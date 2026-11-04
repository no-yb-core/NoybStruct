import { describe, expect, it } from "vitest";
import { getAllPatterns } from "./registry";
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
});