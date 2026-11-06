import { prisma } from "@/lib/prisma";
import { levelProgress, type LevelProgress } from "@/lib/xp/levels";

export type ProfileData = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    githubUsername: string | null;
    createdAt: Date;
  };
  xp: {
    total: number;
    level: LevelProgress;
  };
  attempts: {
    total: number;
    correct: number;
  };
  mastery: Array<{
    patternSlug: string;
    attemptsCount: number;
    correctCount: number;
    masteredAt: Date | null;
  }>;
  achievements: Array<{
    achievementSlug: string;
    earnedAt: Date;
    badgeTheme: string;
    badgeStyle: string | null;
  }>;
};

export async function getProfileData(
  userId: string,
): Promise<ProfileData | null> {
  const [user, xpAgg, attemptsCount, correctCount, mastery, achievements] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          githubUsername: true,
          createdAt: true,
        },
      }),
      prisma.xpTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.challengeAttempt.count({ where: { userId } }),
      prisma.challengeAttempt.count({
        where: { userId, correctAt: { not: null } },
      }),
      prisma.patternMastery.findMany({
        where: { userId },
        orderBy: { attemptsCount: "desc" },
        select: {
          patternSlug: true,
          attemptsCount: true,
          correctCount: true,
          masteredAt: true,
        },
      }),
      prisma.earnedAchievement.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" },
        select: {
          achievementSlug: true,
          earnedAt: true,
          badgeTheme: true,
          badgeStyle: true,
        },
      }),
    ]);

  if (!user) return null;

  const total = xpAgg._sum.amount ?? 0;

  return {
    user,
    xp: { total, level: levelProgress(total) },
    attempts: { total: attemptsCount, correct: correctCount },
    mastery,
    achievements,
  };
}

export async function getProfileDataByUsername(
  githubUsername: string,
): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { githubUsername },
    select: { id: true },
  });
  if (!user) return null;
  return getProfileData(user.id);
}
