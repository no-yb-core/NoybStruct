import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { assertTestDatabase, resetDatabase } from "@/test/db-utils";
import { recordChallengeAttempt } from "./attempts";

beforeAll(assertTestDatabase);
beforeEach(async () => {
  await resetDatabase();
  await prisma.user.create({
    data: {
      id: "00000000-0000-0000-0000-000000000001",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});
afterAll(async () => prisma.$disconnect());

const userId = "00000000-0000-0000-0000-000000000001";

async function seedXp(amount: number, key: string) {
  await prisma.xpTransaction.create({
    data: {
      userId,
      amount,
      source: "seed",
      sourceId: "seed",
      idempotencyKey: key,
    },
  });
}

describe("checkAndUnlock (via recordChallengeAttempt)", () => {
  it("unlocks first-correct on the very first correct answer", async () => {
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    expect(r.newAchievements).toEqual([{ slug: "first-correct", xpBonus: 0 }]);
    expect(await prisma.earnedAchievement.count({ where: { userId } })).toBe(1);
  });

  it("does not re-unlock first-correct on subsequent corrects", async () => {
    await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    const second = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    expect(second.newAchievements).toEqual([]);
  });

  it("does not unlock anything on a wrong answer", async () => {
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: false,
    });
    expect(r.newAchievements).toEqual([]);
    expect(await prisma.earnedAchievement.count({ where: { userId } })).toBe(0);
  });

  it("unlocks xp-100 when the challenge award crosses the threshold", async () => {
    await seedXp(60, "seed-60");
    // +50 challenge → 110 total
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    const slugs = r.newAchievements.map((a) => a.slug);
    expect(slugs).toContain("xp-100");
    expect(slugs).toContain("first-correct");
    expect(slugs).not.toContain("xp-500");
  });

  it("unlocks xp-500 and awards the 25 XP bonus exactly once", async () => {
    await seedXp(460, "seed-460");
    // +50 challenge → 510 → xp-500 fires (+25 bonus → 535)
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    expect(r.newAchievements.find((a) => a.slug === "xp-500")).toEqual({
      slug: "xp-500",
      xpBonus: 25,
    });

    // Total XP includes the challenge award + achievement bonus
    const xpAgg = await prisma.xpTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    expect(xpAgg._sum.amount).toBe(535);

    // Bonus XP row uses the achievement idempotency key
    const bonusRow = await prisma.xpTransaction.findFirst({
      where: { userId, idempotencyKey: "achievement:xp-500" },
    });
    expect(bonusRow?.amount).toBe(25);

    // Idempotent: re-running does not add a second bonus
    await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    const again = await prisma.xpTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    expect(again._sum.amount).toBe(535);
  });

  it("unlocks pattern-master after 3 perfect attempts and stamps masteredAt", async () => {
    // Three correct answers on the same challenge/pattern
    for (let i = 0; i < 3; i++) {
      await recordChallengeAttempt({
        userId,
        challengeSlug: "two-sum",
        patternSlug: "arrays",
        isCorrect: true,
      });
    }
    const mastery = await prisma.patternMastery.findUnique({
      where: { userId_patternSlug: { userId, patternSlug: "arrays" } },
    });
    expect(mastery?.attemptsCount).toBe(3);
    expect(mastery?.correctCount).toBe(3);
    expect(mastery?.masteredAt).toBeInstanceOf(Date);

    expect(
      await prisma.earnedAchievement.findUnique({
        where: {
          userId_achievementSlug: {
            userId,
            achievementSlug: "pattern-master",
          },
        },
      }),
    ).not.toBeNull();
  });

  it("unlocks five-corrects after 5 correct answers across patterns", async () => {
    for (let i = 0; i < 5; i++) {
      await recordChallengeAttempt({
        userId,
        challengeSlug: `challenge-${i}`,
        patternSlug: `pattern-${i}`,
        isCorrect: true,
      });
    }
    expect(
      await prisma.earnedAchievement.findUnique({
        where: {
          userId_achievementSlug: {
            userId,
            achievementSlug: "five-corrects",
          },
        },
      }),
    ).not.toBeNull();
  });
});

describe("extended achievement rules", () => {
  it("unlocks pattern-collector after trying 5 different patterns", async () => {
    // Seed 4 patterns already tried
    await prisma.patternMastery.createMany({
      data: [1, 2, 3, 4].map((i) => ({
        userId,
        patternSlug: `pattern-${i}`,
        attemptsCount: 1,
        correctCount: 0,
      })),
    });
    // 5th pattern via a real attempt
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "fifth-challenge",
      patternSlug: "pattern-5",
      isCorrect: false,
    });
    const slugs = r.newAchievements.map((a) => a.slug);
    expect(slugs).toContain("pattern-collector");
    expect(
      r.newAchievements.find((a) => a.slug === "pattern-collector"),
    ).toEqual({ slug: "pattern-collector", xpBonus: 25 });
  });

  it("unlocks xp-1000 when crossing the 1000 XP threshold", async () => {
    await seedXp(960, "seed-960");
    // +50 first-try correct → 1010 → xp-1000 fires
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "two-sum",
      patternSlug: "arrays",
      isCorrect: true,
    });
    expect(r.newAchievements.find((a) => a.slug === "xp-1000")).toEqual({
      slug: "xp-1000",
      xpBonus: 50,
    });
  });

  it("unlocks ten-corrects at 10 total correct answers", async () => {
    // Seed one pattern with 9 corrects already
    await prisma.patternMastery.create({
      data: {
        userId,
        patternSlug: "arrays",
        attemptsCount: 9,
        correctCount: 9,
      },
    });
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "tenth-challenge",
      patternSlug: "arrays",
      isCorrect: true,
    });
    const slugs = r.newAchievements.map((a) => a.slug);
    expect(slugs).toContain("ten-corrects");
    expect(slugs).toContain("pattern-master"); // 10/10 also masters
  });

  it("unlocks mastery-collector when 3 patterns are mastered", async () => {
    // Seed 3 patterns at 3/3 (all mastered)
    await prisma.patternMastery.createMany({
      data: ["arrays", "strings", "trees"].map((slug) => ({
        userId,
        patternSlug: slug,
        attemptsCount: 3,
        correctCount: 3,
      })),
    });
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "fresh-challenge",
      patternSlug: "graphs",
      isCorrect: false,
    });
    expect(
      r.newAchievements.find((a) => a.slug === "mastery-collector"),
    ).toEqual({ slug: "mastery-collector", xpBonus: 100 });
  });

  it("unlocks persistent at 20 total attempts", async () => {
    // Seed 19 attempts across one pattern
    await prisma.patternMastery.create({
      data: {
        userId,
        patternSlug: "arrays",
        attemptsCount: 19,
        correctCount: 0,
      },
    });
    const r = await recordChallengeAttempt({
      userId,
      challengeSlug: "twentieth",
      patternSlug: "arrays",
      isCorrect: false,
    });
    expect(r.newAchievements.find((a) => a.slug === "persistent")).toEqual({
      slug: "persistent",
      xpBonus: 25,
    });
  });
});
