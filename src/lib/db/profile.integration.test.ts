import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { assertTestDatabase, resetDatabase } from "@/test/db-utils";
import { getProfileData } from "./profile";

beforeAll(assertTestDatabase);
beforeEach(async () => {
  await resetDatabase();
  await prisma.user.create({
    data: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Test User",
      email: "t@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});
afterAll(async () => prisma.$disconnect());

const userId = "00000000-0000-0000-0000-000000000001";

describe("getProfileData", () => {
  it("returns zero-state for a brand new user", async () => {
    const data = await getProfileData(userId);
    expect(data).not.toBeNull();
    expect(data!.xp.total).toBe(0);
    expect(data!.xp.level.current).toBe("Apprentice");
    expect(data!.attempts.total).toBe(0);
    expect(data!.mastery).toHaveLength(0);
    expect(data!.achievements).toHaveLength(0);
  });

  it("aggregates XP, attempts, and mastery", async () => {
    await prisma.xpTransaction.createMany({
      data: [
        {
          userId,
          amount: 50,
          source: "challenge_correct_first",
          sourceId: "two-sum",
          idempotencyKey: "k1",
        },
        {
          userId,
          amount: 60,
          source: "challenge_correct_first",
          sourceId: "valid-parens",
          idempotencyKey: "k2",
        },
      ],
    });
    await prisma.challengeAttempt.create({
      data: {
        userId,
        challengeSlug: "two-sum",
        firstAttemptedAt: new Date(),
        lastAttemptedAt: new Date(),
        correctAt: new Date(),
        attemptsCount: 1,
      },
    });
    await prisma.patternMastery.create({
      data: {
        userId,
        patternSlug: "arrays",
        attemptsCount: 3,
        correctCount: 2,
      },
    });

    const data = await getProfileData(userId);
    expect(data!.xp.total).toBe(110);
    expect(data!.xp.level.current).toBe("Junior Developer");
    expect(data!.attempts.total).toBe(1);
    expect(data!.attempts.correct).toBe(1);
    expect(data!.mastery).toHaveLength(1);
    expect(data!.mastery[0].patternSlug).toBe("arrays");
  });

  it("returns null for a missing user", async () => {
    expect(
      await getProfileData("00000000-0000-0000-0000-000000000099"),
    ).toBeNull();
  });
});
