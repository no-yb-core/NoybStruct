// src/lib/db/xp.integration.test.ts
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { getUserXp } from "./xp";

async function seedUser(id: string) {
  await prisma.user.create({ data: { id, createdAt: new Date(), updatedAt: new Date() } });
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
    expect(totalXp).toBe(120);             // crosses the 100 threshold
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