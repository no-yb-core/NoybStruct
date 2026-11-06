import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { getChallengesByDifficulty } from "@/content/challenges/registry";
import {
  difficulties,
  difficultyLabels,
  type Difficulty,
} from "@/content/challenges/types";

export const metadata: Metadata = {
  title: "Workshop",
  description: "Practice identifying design patterns through challenges.",
};

const tierDetails: Record<
  Difficulty,
  { badge: string; description: string; xp: string; icon: typeof Flame }
> = {
  beginner: {
    badge: "Level I · Novice",
    description:
      "Foundational object-oriented patterns in focused single-responsibility scenarios.",
    xp: "50 XP / challenge",
    icon: Flame,
  },
  intermediate: {
    badge: "Level II · Practitioner",
    description:
      "Decoupling services, event propagation, and refactoring tangled dependencies.",
    xp: "100 XP / challenge",
    icon: Zap,
  },
  advanced: {
    badge: "Level III · Architect",
    description:
      "Subtle architectural anti-patterns, distributed queues, and multi-pattern ecosystems.",
    xp: "150 XP / challenge",
    icon: ShieldAlert,
  },
};

export default function WorkshopPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* Header */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            The Workshop · Arena
          </span>
          <span className="rounded-xs border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            3 Tiers
          </span>
        </div>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Pattern Detective
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Analyze real architectural tensions, diagnose structural bottlenecks,
          and pinpoint the optimal pattern under lived constraints.
        </p>
      </header>

      {/* Difficulty Tier Cards */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Choose Your Difficulty Tier
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            Select tier to begin session
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {difficulties.map((d) => {
            const count = getChallengesByDifficulty(d).length;
            const details = tierDetails[d];
            const Icon = details.icon;

            return (
              <Link
                key={d}
                href={`/workshop/${d}`}
                className="group relative flex flex-col justify-between rounded-sm border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-forest hover:shadow-lg dark:hover:border-gold/60"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {details.badge}
                    </span>
                    <Icon className="size-4 text-forest dark:text-gold transition-transform group-hover:scale-110" />
                  </div>

                  <h3 className="mt-4 font-heading text-2xl font-bold text-foreground group-hover:text-forest dark:group-hover:text-gold transition-colors">
                    {difficultyLabels[d]}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {details.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-forest dark:text-gold">
                      {details.xp}
                    </span>
                    <span className="text-muted-foreground">
                      {count} {count === 1 ? "challenge" : "challenges"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-forest dark:group-hover:text-gold">
                    <span>Launch session</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Scoring & Mechanics Rules */}
      <section className="mt-14 rounded-md border border-border/80 bg-secondary/30 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-gold" />
          <h3 className="font-heading text-lg font-bold">
            Scoring & Session Mechanics
          </h3>
        </div>

        <div className="mt-4 grid gap-4 text-xs sm:grid-cols-3 text-muted-foreground leading-relaxed">
          <div className="rounded border border-border/60 bg-card/60 p-4">
            <span className="font-mono font-bold text-foreground block mb-1">
              ⚡ First-Attempt Bonus
            </span>
            Identify the pattern on your first try to earn a 1.5× XP multiplier.
          </div>
          <div className="rounded border border-border/60 bg-card/60 p-4">
            <span className="font-mono font-bold text-foreground block mb-1">
              🔄 Retry Option
            </span>
            If you miss on your first try, you can retry for base XP or skip
            ahead to the next challenge.
          </div>
          <div className="rounded border border-border/60 bg-card/60 p-4">
            <span className="font-mono font-bold text-foreground block mb-1">
              🏆 Profile Synchronization
            </span>
            Sign in with GitHub to save your total XP, rank up on the
            leaderboard, and unlock achievements.
          </div>
        </div>
      </section>
    </div>
  );
}
