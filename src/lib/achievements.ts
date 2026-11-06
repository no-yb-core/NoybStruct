import type { AchievementSlug } from "@/lib/db/achievements";

export const ACHIEVEMENT_LABELS: Record<
  AchievementSlug,
  { title: string; description: string }
> = {
  "first-correct": {
    title: "First Correct",
    description: "Answered your first challenge correctly.",
  },
  "five-corrects": {
    title: "Five Correct",
    description: "Answered five challenges correctly.",
  },
  "xp-100": {
    title: "100 XP",
    description: "Reached 100 XP.",
  },
  "xp-500": {
    title: "500 XP",
    description: "Reached 500 XP.",
  },
  "pattern-master": {
    title: "Pattern Master",
    description: "Mastered a pattern with 3+ perfect attempts.",
  },
};