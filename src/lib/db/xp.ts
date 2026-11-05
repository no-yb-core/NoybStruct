// src/lib/db/xp.ts
import { Prisma } from "@/generated/prisma/client";
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

type AwardXpInput = {
  userId: string;
  amount: number;
  source: string;
  sourceId: string;
  idempotencyKey: string;
};

export async function awardXp(
  input: AwardXpInput,
  tx?: Prisma.TransactionClient,
): Promise<{ awarded: boolean }> {
  const client = tx ?? prisma;
  const result = await client.xpTransaction.createMany({
    data: [input],
    skipDuplicates: true,
  });
  return { awarded: result.count === 1 };
}
