import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

import { recordChallengeAttempt } from "./attempts";

import { assertTestDatabase, resetDatabase } from "@/test/db-utils";
beforeAll(assertTestDatabase);

beforeEach(async () => {
  await resetDatabase();
  await prisma.user.create({
    data: { id: "u1", createdAt: new Date(), updatedAt: new Date() },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

const base = {
  userId: "u1",
  challengeSlug: "two-sum",
  patternSlug: "arrays",
} as const;

describe("recordChallengeAttempt", () => {
  it("records a wrong attempt with no XP", async () => {
    const r = await recordChallengeAttempt({ ...base, isCorrect: false });
    expect(r.attempt.attemptsCount).toBe(1);
    expect(r.attempt.correctAt).toBeNull();
    expect(r.xpAwarded).toBe(false);
    expect(await prisma.xpTransaction.count()).toBe(0);

    const m = await prisma.patternMastery.findUnique({
      where: { userId_patternSlug: { userId: "u1", patternSlug: "arrays" } },
    });
    expect(m?.attemptsCount).toBe(1);
    expect(m?.correctCount).toBe(0);
  });

  it("awards 50 XP on a first-try correct", async () => {
    const r = await recordChallengeAttempt({ ...base, isCorrect: true });
    expect(r.isFirstCorrect).toBe(true);
    expect(r.xpAwarded).toBe(true);
    expect(r.xpAmount).toBe(50);
    expect(r.attempt.correctAt).toBeInstanceOf(Date);
  });

  it("awards 10 XP on first correct after retries", async () => {
    await recordChallengeAttempt({ ...base, isCorrect: false });
    await recordChallengeAttempt({ ...base, isCorrect: false });
    const r = await recordChallengeAttempt({ ...base, isCorrect: true });
    expect(r.isFirstCorrect).toBe(true);
    expect(r.xpAmount).toBe(10);
    expect(r.attempt.attemptsCount).toBe(3);
  });

  it("does not award XP on subsequent corrects", async () => {
    await recordChallengeAttempt({ ...base, isCorrect: true });
    const r = await recordChallengeAttempt({ ...base, isCorrect: true });
    expect(r.isFirstCorrect).toBe(false);
    expect(r.xpAwarded).toBe(false);
    expect(r.xpAmount).toBe(0);
    expect(r.attempt.attemptsCount).toBe(2);
  });
});
