import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockToast } = vi.hoisted(() => ({
  mockToast: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: mockToast },
}));

import { showAchievementToasts } from "./attempt-toasts";

beforeEach(() => mockToast.mockReset());

describe("showAchievementToasts", () => {
  it("does nothing for an empty array", () => {
    showAchievementToasts([]);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it("fires one toast per achievement with label + XP bonus", () => {
    showAchievementToasts([
      { slug: "first-correct", xpBonus: 0 },
      { slug: "xp-500", xpBonus: 25 },
    ]);

    expect(mockToast).toHaveBeenCalledTimes(2);
    expect(mockToast).toHaveBeenNthCalledWith(
      1,
      "Achievement unlocked: First Correct",
      expect.objectContaining({
        description: expect.stringContaining("Answered"),
      }),
    );
    expect(mockToast).toHaveBeenNthCalledWith(
      2,
      "Achievement unlocked: 500 XP",
      expect.objectContaining({
        description: expect.stringContaining("+25 XP"),
      }),
    );
  });

  it("skips unknown slugs silently", () => {
    showAchievementToasts([{ slug: "not-a-real-slug", xpBonus: 10 }]);
    expect(mockToast).not.toHaveBeenCalled();
  });
});
