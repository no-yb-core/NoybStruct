// src/test/db-utils.ts
import { prisma } from "@/lib/prisma";

export async function assertTestDatabase(): Promise<void> {
  const [{ current_database }] = await prisma.$queryRaw<
    { current_database: string }[]
  >`
    SELECT current_database()
  `;
  if (current_database !== "design_craft_test") {
    throw new Error(
      `Integration tests must run against design_craft_test, connected to "${current_database}". ` +
        `Check .env.test.`,
    );
  }
}

export async function resetDatabase(): Promise<void> {
  await prisma.$transaction([
    prisma.xpTransaction.deleteMany(),
    prisma.challengeAttempt.deleteMany(),
    prisma.patternMastery.deleteMany(),
    prisma.earnedAchievement.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
