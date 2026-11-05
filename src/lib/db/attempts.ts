import { prisma } from "@/lib/prisma";
import { awardXp } from "./xp";
import { checkAndUnlock } from "./achievements";

type RecordAttemptInput = {
  userId: string;
  challengeSlug: string;
  patternSlug: string;
  isCorrect: boolean;
};

const XP_FIRST_TRY = 50;
const XP_AFTER_RETRY = 10;

export async function recordChallengeAttempt(input: RecordAttemptInput) {
  const { userId, challengeSlug, patternSlug, isCorrect } = input;
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.challengeAttempt.findUnique({
      where: {
        challenge_attempts_user_challenge_idx: { userId, challengeSlug },
      },
    });

    const isFirstTry = existing === null;
    const isFirstCorrect = isCorrect && !existing?.correctAt;

    const attempt = await tx.challengeAttempt.upsert({
      where: {
        challenge_attempts_user_challenge_idx: { userId, challengeSlug },
      },
      create: {
        userId,
        challengeSlug,
        firstAttemptedAt: now,
        lastAttemptedAt: now,
        correctAt: isCorrect ? now : null,
        attemptsCount: 1,
      },
      update: {
        lastAttemptedAt: now,
        attemptsCount: { increment: 1 },
        ...(isFirstCorrect ? { correctAt: now } : {}),
      },
    });

    await tx.patternMastery.upsert({
      where: { userId_patternSlug: { userId, patternSlug } },
      create: {
        userId,
        patternSlug,
        attemptsCount: 1,
        correctCount: isCorrect ? 1 : 0,
        masteredAt: null,
      },
      update: {
        attemptsCount: { increment: 1 },
        ...(isCorrect ? { correctCount: { increment: 1 } } : {}),
      },
    });

    let xpAwarded = false;
    let xpAmount = 0;
    if (isFirstCorrect) {
      xpAmount = isFirstTry ? XP_FIRST_TRY : XP_AFTER_RETRY;
      const { awarded } = await awardXp(
        {
          userId,
          amount: xpAmount,
          source: isFirstTry
            ? "challenge_correct_first"
            : "challenge_correct_retry",
          sourceId: challengeSlug,
          idempotencyKey: `challenge:${challengeSlug}:correct_first`,
        },
        tx,
      );
      xpAwarded = awarded;
      if (!xpAwarded) xpAmount = 0;
    }

    const newAchievements = isCorrect ? await checkAndUnlock(userId, tx) : [];

    return { attempt, isFirstCorrect, xpAwarded, xpAmount, newAchievements };
  });
}
