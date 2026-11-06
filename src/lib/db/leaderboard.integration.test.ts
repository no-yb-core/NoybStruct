import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { assertTestDatabase, resetDatabase } from "@/test/db-utils";
import { getLeaderboard } from "./leaderboard";

beforeAll(assertTestDatabase);
afterAll(async () => prisma.$disconnect());

beforeEach(async () => {
  await resetDatabase();
});

async function seed(userId: string, name: string, xpAmounts: number[]) {
  await prisma.user.create({
    data: {
      id: userId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  for (const [i, amount] of xpAmounts.entries()) {
    await prisma.xpTransaction.create({
      data: {
        userId,
        amount,
        source: "test",
        sourceId: "test",
        idempotencyKey: `${userId}-${i}`,
      },
    });
  }
}

describe("getLeaderboard", () => {
  it("returns empty array when no transactions exist", async () => {
    expect(await getLeaderboard()).toEqual([]);
  });

  it("ranks by total XP descending", async () => {
    await seed("u1", "Alice", [50, 100]); // 150
    await seed("u2", "Bob", [200]); // 200
    await seed("u3", "Charlie", [50]); // 50

    const entries = await getLeaderboard();
    expect(entries.map((e) => e.name)).toEqual(["Bob", "Alice", "Charlie"]);
    expect(entries.map((e) => e.totalXp)).toEqual([200, 150, 50]);
    expect(entries.map((e) => e.rank)).toEqual([1, 2, 3]);
  });

  it("respects the limit parameter", async () => {
    for (let i = 0; i < 5; i++) {
      await seed(`u${i}`, `User ${i}`, [100 * (i + 1)]);
    }
    expect(await getLeaderboard(3)).toHaveLength(3);
  });
});
