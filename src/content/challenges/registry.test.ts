import { describe, expect, it } from "vitest";
import { getAllChallenges } from "./registry";
import { challengeSchema } from "./schema";
import { getPattern } from "@/content/patterns/registry";

describe("challenge registry", () => {
  it("registers each slug at most once", () => {
    const slugs = getAllChallenges().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every registered challenge is schema-valid", () => {
    for (const challenge of getAllChallenges()) {
      const result = challengeSchema.safeParse(challenge);
      expect(result.success, `Invalid challenge: ${challenge.slug}`).toBe(true);
    }
  });

  it("every challenge's correct pattern exists in the pattern registry", () => {
    for (const challenge of getAllChallenges()) {
      expect(
        getPattern(challenge.patternSlug),
        `Missing pattern: ${challenge.patternSlug} (challenge: ${challenge.slug})`,
      ).toBeDefined();
    }
  });

  it("every challenge covers a distinct correct pattern", () => {
    const patterns = getAllChallenges().map((c) => c.patternSlug);
    expect(new Set(patterns).size).toBe(patterns.length);
  });
});
