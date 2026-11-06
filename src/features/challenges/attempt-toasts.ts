import { toast } from "sonner";
import { ACHIEVEMENT_LABELS } from "@/lib/achievements";

type IncomingAchievement = { slug: string; xpBonus: number };

export function showAchievementToasts(achievements: IncomingAchievement[]) {
  for (const achievement of achievements) {
    const meta =
      ACHIEVEMENT_LABELS[achievement.slug as keyof typeof ACHIEVEMENT_LABELS];
    if (!meta) continue;

    toast.success(`Achievement unlocked: ${meta.title}`, {
      description:
        achievement.xpBonus > 0
          ? `${meta.description} (+${achievement.xpBonus} XP)`
          : meta.description,
      duration: 5000,
    });
  }
}
