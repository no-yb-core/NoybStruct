"use client";

import { motion } from "motion/react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

type FeedbackBannerProps = {
  correct: boolean;
  correctPatternName: string;
  explanation: string;
  xpEarned: number;
  firstAttemptBonus: boolean;
};

export function FeedbackBanner({
  correct,
  correctPatternName,
  explanation,
  xpEarned,
  firstAttemptBonus,
}: FeedbackBannerProps) {
  const borderClass = correct
    ? "border-forest bg-forest/10 dark:border-forest/50 dark:bg-forest/15"
    : "border-destructive bg-destructive/10 dark:border-destructive/50 dark:bg-destructive/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      role="status"
      aria-live="polite"
      className={`mt-6 rounded-sm border-l-4 p-5 shadow-xs ${borderClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {correct ? (
            <CheckCircle2 className="size-5 text-forest dark:text-emerald-400" />
          ) : (
            <XCircle className="size-5 text-destructive" />
          )}
          <p className="font-heading text-xl font-bold text-foreground">
            {correct ? "Correct." : "Not quite."}
          </p>
        </div>

        {correct && (
          <div className="flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest/20 px-3 py-1 text-xs font-mono font-semibold text-forest dark:text-emerald-300">
            <Sparkles className="size-3.5" />
            <span>
              +<AnimatedCounter value={xpEarned} duration={400} /> XP
            </span>
            {firstAttemptBonus && (
              <span className="text-[10px] text-muted-foreground uppercase ml-1">
                · First try
              </span>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        <span className="font-semibold text-foreground">
          {correctPatternName}
        </span>
        {" — "}
        {explanation}
      </p>
    </motion.div>
  );
}
