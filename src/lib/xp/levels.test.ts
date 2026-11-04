import { describe, expect, it } from "vitest";
import { levelFromXp, levelProgress } from "./levels";

describe("levelFromXp", () => {
  it("returns Apprentice at zero and below the first threshold", () => {
    expect(levelFromXp(0)).toBe("Apprentice");
    expect(levelFromXp(99)).toBe("Apprentice");
  });

  it("advances at exact thresholds", () => {
    expect(levelFromXp(100)).toBe("Junior Developer");
    expect(levelFromXp(350)).toBe("Pattern Explorer");
    expect(levelFromXp(850)).toBe("Software Architect");
    expect(levelFromXp(2000)).toBe("Pattern Master");
  });

  it("stays at the highest level beyond the final threshold", () => {
    expect(levelFromXp(999_999)).toBe("Pattern Master");
  });
});

describe("levelProgress", () => {
  it("reports progress toward the next level", () => {
    const p = levelProgress(50);
    expect(p.current).toBe("Apprentice");
    expect(p.next).toBe("Junior Developer");
    expect(p.xpIntoLevel).toBe(50);
    expect(p.xpForNextLevel).toBe(100);
    expect(p.progressRatio).toBe(0.5);
  });

  it("has no next level at the highest rank", () => {
    const p = levelProgress(2000);
    expect(p.current).toBe("Pattern Master");
    expect(p.next).toBeNull();
    expect(p.xpForNextLevel).toBeNull();
    expect(p.progressRatio).toBeNull();
  });
});
