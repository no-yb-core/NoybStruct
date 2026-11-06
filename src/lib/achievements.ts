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
  "pattern-collector": {
    title: "Pattern Collector",
    description: "Tried 5 different patterns.",
  },
  "xp-1000": {
    title: "1,000 XP",
    description: "Reached 1,000 XP.",
  },
  "ten-corrects": {
    title: "Ten Correct",
    description: "Answered ten challenges correctly.",
  },
  "mastery-collector": {
    title: "Mastery Collector",
    description: "Mastered three different patterns.",
  },
  persistent: {
    title: "Persistent",
    description: "Made twenty total attempts.",
  },
};
