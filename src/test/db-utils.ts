// src/test/db-utils.ts
import { prisma } from "@/lib/prisma";

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