"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { RotateCcw, Trophy, ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { fireCelebrationConfetti } from "@/lib/confetti";

type CompletionScreenProps = {
  totalXp: number;
  correctCount: number;
  total: number;
  onRestart: () => void;
};

export function CompletionScreen({
  totalXp,
  correctCount,
  total,
  onRestart,
}: CompletionScreenProps) {
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl px-6 py-12 sm:py-16"
    >
      <div className="rounded-md border border-border bg-card p-8 sm:p-10 shadow-lg text-center">
        {/* Laurel / Trophy badge */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-sm">
          <Trophy className="size-7" />
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Session Complete
        </p>

        {/* Animated XP Total */}
        <h1 className="mt-2 font-heading text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          <AnimatedCounter value={totalXp} duration={800} /> XP
        </h1>

        <p className="mt-3 text-base text-muted-foreground">
          {correctCount} of {total} challenges solved correctly · {percent}%
          accuracy
        </p>

        {/* Scorecard metrics */}
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-sm border border-border bg-secondary/30 p-4 font-mono text-center">
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Completed
            </span>
            <span className="text-xl font-bold text-foreground">{total}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Correct
            </span>
            <span className="text-xl font-bold text-forest dark:text-emerald-400">
              {correctCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Accuracy
            </span>
            <span className="text-xl font-bold text-gold">{percent}%</span>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Signed-in sessions persist XP to your profile and rank on the global
          leaderboard.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-forest-deep dark:bg-gold dark:text-ink transition-all"
          >
            <RotateCcw className="size-3.5" />
            <span>Play Again</span>
          </button>

          <Link
            href="/workshop"
            className="flex items-center gap-2 rounded-sm border border-border bg-secondary/80 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-all"
          >
            <span>Change Difficulty</span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:border-forest transition-all"
          >
            <span>View Leaderboard</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
