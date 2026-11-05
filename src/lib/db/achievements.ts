import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { awardXp } from "./xp";

type TxClient = Prisma.TransactionClient;

export type AchievementSlug =
  "first-correct" | "five-corrects" | "xp-100" | "xp-500" | "pattern-master";

type PatternSnapshot = {
  patternSlug: string;
  attemptsCount: number;
  correctCount: number;
  masteredAt: Date | null;
};

type RuleContext = {
  userId: string;
  totalXp: number;
  totalCorrect: number;
  patternMastery: PatternSnapshot[];
};

type Rule = {
  slug: AchievementSlug;
  xpBonus: number;
  check: (ctx: RuleContext) => boolean;
};

export const RULES: Rule[] = [
  {
    slug: "first-correct",
    xpBonus: 0,
    check: (ctx) => ctx.totalCorrect >= 1,
  },
  {
    slug: "five-corrects",
    xpBonus: 25,
    check: (ctx) => ctx.totalCorrect >= 5,
  },
  {
    slug: "xp-100",
    xpBonus: 0,
    check: (ctx) => ctx.totalXp >= 100,
  },
  {
    slug: "xp-500",
    xpBonus: 25,
    check: (ctx) => ctx.totalXp >= 500,
  },
  {
    slug: "pattern-master",
    xpBonus: 50,
    check: (ctx) =>
      ctx.patternMastery.some(
        (m) => m.attemptsCount >= 3 && m.correctCount === m.attemptsCount,
      ),
  },
];

export type UnlockedAchievement = {
  slug: AchievementSlug;
  xpBonus: number;
};

/**
 * Runs inside the same transaction as recordChallengeAttempt.
 * Idempotent: safe to call on every correct answer — existing
 * earned_achievements rows are skipped (skipDuplicates), and each
 * bonus XP uses an idempotency key that can't double-insert.
 */
export async function checkAndUnlock(
  userId: string,
  tx?: TxClient,
): Promise<UnlockedAchievement[]> {
  const client = tx ?? prisma;

  const [xpAgg, patternMastery, existingRows] = await Promise.all([
    client.xpTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    client.patternMastery.findMany({
      where: { userId },
      select: {
        patternSlug: true,
        attemptsCount: true,
        correctCount: true,
        masteredAt: true,
      },
    }),
    client.earnedAchievement.findMany({
      where: { userId },
      select: { achievementSlug: true },
    }),
  ]);

  const totalCorrect = patternMastery.reduce(
    (sum, m) => sum + m.correctCount,
    0,
  );

  const ctx: RuleContext = {
    userId,
    totalXp: xpAgg._sum.amount ?? 0,
    totalCorrect,
    patternMastery,
  };

  const existingSlugs = new Set(
    existingRows.map((r) => r.achievementSlug as AchievementSlug),
  );

  const newlyEarned = RULES.filter(
    (rule) => !existingSlugs.has(rule.slug) && rule.check(ctx),
  );

  if (newlyEarned.length > 0) {
    await client.earnedAchievement.createMany({
      data: newlyEarned.map((rule) => ({
        userId,
        achievementSlug: rule.slug,
      })),
      skipDuplicates: true,
    });
  }

  // Stamp masteredAt on any pattern that just crossed the pattern-master rule.
  // Runs unconditionally (even when no new achievement fired) so a pattern that
  // becomes "mastered" after pattern-master was already earned still gets its
  // timestamp — that's what powers the "mastered" badge on /profile.
  for (const m of patternMastery) {
    if (
      !m.masteredAt &&
      m.attemptsCount >= 3 &&
      m.correctCount === m.attemptsCount
    ) {
      await client.patternMastery.update({
        where: {
          userId_patternSlug: { userId, patternSlug: m.patternSlug },
        },
        data: { masteredAt: new Date() },
      });
    }
  }

  // Award bonus XP for each newly-earned achievement (idempotent by key)
  for (const rule of newlyEarned) {
    if (rule.xpBonus > 0) {
      await awardXp(
        {
          userId,
          amount: rule.xpBonus,
          source: "achievement",
          sourceId: rule.slug,
          idempotencyKey: `achievement:${rule.slug}`,
        },
        tx,
      );
    }
  }

  return newlyEarned.map((rule) => ({
    slug: rule.slug,
    xpBonus: rule.xpBonus,
  }));
}
