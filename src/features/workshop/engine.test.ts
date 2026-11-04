import { describe, expect, it } from "vitest";
import { XP_BY_DIFFICULTY, evaluateAnswer } from "./engine";

describe("evaluateAnswer", () => {
  const challenge = {
    patternSlug: "observer" as const,
    difficulty: "beginner" as const,
  };

  it("awards base XP on a correct non-first attempt", () => {
    const result = evaluateAnswer(challenge, "observer", true);
    expect(result.correct).toBe(true);
    expect(result.firstAttemptBonus).toBe(false);
    expect(result.xpEarned).toBe(XP_BY_DIFFICULTY.beginner);
  });

  it("awards bonus XP on a correct first attempt", () => {
    const result = evaluateAnswer(challenge, "observer", false);
    expect(result.correct).toBe(true);
    expect(result.firstAttemptBonus).toBe(true);
    expect(result.xpEarned).toBeGreaterThan(XP_BY_DIFFICULTY.beginner);
  });

  it("awards zero XP on an incorrect answer", () => {
    const result = evaluateAnswer(challenge, "strategy", false);
    expect(result.correct).toBe(false);
    expect(result.xpEarned).toBe(0);
    expect(result.firstAttemptBonus).toBe(false);
  });

  it("scales XP by difficulty", () => {
    const beginner = evaluateAnswer(
      { patternSlug: "observer", difficulty: "beginner" },
      "observer",
      true,
    );
    const advanced = evaluateAnswer(
      { patternSlug: "observer", difficulty: "advanced" },
      "observer",
      true,
    );
    expect(advanced.xpEarned).toBeGreaterThan(beginner.xpEarned);
  });

  it("rounds half-up when a bonus is fractional", () => {
    // 15 * 1.5 = 22.5 → 23
    const result = evaluateAnswer(
      { patternSlug: "observer", difficulty: "beginner" },
      "observer",
      false,
    );
    expect(result.xpEarned).toBe(23);
  });
});
