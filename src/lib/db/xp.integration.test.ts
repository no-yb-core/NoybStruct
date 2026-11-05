// src/lib/db/xp.integration.test.ts
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { awardXp, getUserXp } from "./xp";
import { resetDatabase } from "@/test/db-utils";

async function seedUser(id: string) {
  await prisma.user.create({
    data: { id, createdAt: new Date(), updatedAt: new Date() },
  });
}

async function seedXp(userId: string, amount: number, key: string) {
  await prisma.xpTransaction.create({
    data: {
      userId,
      amount,
      source: "challenge_correct_first",
      sourceId: "two-sum",
      idempotencyKey: key,
    },
  });
}

describe("getUserXp", () => {
  beforeEach(async () => {
    await prisma.xpTransaction.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 0 XP and Apprentice level for a user with no transactions", async () => {
    await seedUser("u1");
    const { totalXp, level } = await getUserXp("u1");
    expect(totalXp).toBe(0);
    expect(level.current).toBe("Apprentice");
    expect(level.next).toBe("Junior Developer");
  });

  it("sums multiple transactions and returns the right level", async () => {
    await seedUser("u1");
    await seedXp("u1", 60, "challenge:a");
    await seedXp("u1", 60, "challenge:b");
    const { totalXp, level } = await getUserXp("u1");
    expect(totalXp).toBe(120); // crosses the 100 threshold
    expect(level.current).toBe("Junior Developer");
    expect(level.xpIntoLevel).toBe(20);
  });

  it("only counts the requesting user's transactions", async () => {
    await seedUser("u1");
    await seedUser("u2");
    await seedXp("u1", 50, "challenge:a");
    await seedXp("u2", 500, "challenge:a");
    const { totalXp } = await getUserXp("u1");
    expect(totalXp).toBe(50);
  });
});

describe("awardXp", () => {
  beforeEach(async () => {
    await resetDatabase();
    await prisma.user.create({
      data: { id: "u1", createdAt: new Date(), updatedAt: new Date() },
    });
  });

  it("creates a transaction on first call", async () => {
    const { awarded } = await awardXp({
      userId: "u1",
      amount: 50,
      source: "challenge_correct_first",
      sourceId: "two-sum",
      idempotencyKey: "challenge:two-sum:correct_first",
    });
    expect(awarded).toBe(true);
    expect(await prisma.xpTransaction.count({ where: { userId: "u1" } })).toBe(
      1,
    );
  });

  it("is idempotent — duplicate key does not double-award", async () => {
    const input = {
      userId: "u1",
      amount: 50,
      source: "challenge_correct_first",
      sourceId: "two-sum",
      idempotencyKey: "challenge:two-sum:correct_first",
    };
    expect((await awardXp(input)).awarded).toBe(true);
    expect((await awardXp(input)).awarded).toBe(false);
    expect(await prisma.xpTransaction.count({ where: { userId: "u1" } })).toBe(
      1,
    );
  });
});
