// src/lib/db/xp.ts
import { prisma } from "@/lib/prisma";
import { levelProgress, type LevelProgress } from "@/lib/xp/levels";

export async function getUserXp(userId: string): Promise<{
  totalXp: number;
  level: LevelProgress;
}> {
  const { _sum } = await prisma.xpTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const totalXp = _sum.amount ?? 0;
  return { totalXp, level: levelProgress(totalXp) };
}