import type { Challenge } from "@/content/challenges/schema";
import type { Difficulty } from "@/content/challenges/types";

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  beginner: 15,
  intermediate: 30,
  advanced: 60,
};

export const FIRST_ATTEMPT_MULTIPLIER = 1.5;

export type AnswerEvaluation = {
  correct: boolean;
  xpEarned: number;
  firstAttemptBonus: boolean;
};

export function evaluateAnswer(
  challenge: Pick<Challenge, "patternSlug" | "difficulty">,
  selectedPatternSlug: string,
  previouslyAttempted: boolean,
): AnswerEvaluation {
  if (selectedPatternSlug !== challenge.patternSlug) {
    return { correct: false, xpEarned: 0, firstAttemptBonus: false };
  }

  const firstAttemptBonus = !previouslyAttempted;
  const base = XP_BY_DIFFICULTY[challenge.difficulty];
  const xpEarned = firstAttemptBonus
    ? Math.round(base * FIRST_ATTEMPT_MULTIPLIER)
    : base;

  return { correct: true, xpEarned, firstAttemptBonus };
}
