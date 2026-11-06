import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, Trophy } from "lucide-react";
import type { ProfileData } from "@/lib/db/profile";
import { ShareButton } from "./share-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

type Props = {
  data: ProfileData;
  shareUrl: string | null;
};

export function ProfileView({ data, shareUrl }: Props) {
  const { user, xp, attempts, mastery, achievements } = data;
  const progressPct = Math.round((xp.level.progressRatio ?? 0) * 100);
  const correctPct =
    attempts.total > 0
      ? Math.round((attempts.correct / attempts.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16 space-y-10">
      {/* Header Profile Dossier */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-5">
          {user.image ? (
            <div className="relative">
              <Image
                src={user.image}
                alt={user.name ?? "Avatar"}
                width={72}
                height={72}
                className="rounded-full ring-2 ring-forest/50 dark:ring-gold/50 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-forest text-[10px] text-white dark:bg-gold dark:text-ink">
                ✦
              </span>
            </div>
          ) : (
            <div className="flex size-18 items-center justify-center rounded-full bg-secondary text-2xl font-bold ring-2 ring-border">
              {user.name?.[0] ?? "U"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {user.name ?? "Anonymous Architect"}
              </h1>
            </div>
            {user.githubUsername && (
              <p className="font-mono text-xs text-muted-foreground">
                @{user.githubUsername}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {shareUrl && (
          <div className="shrink-0">
            <ShareButton url={shareUrl} />
          </div>
        )}
      </header>

      {/* Level & XP Progression Card */}
      <section className="rounded-md border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Current Rank & Title
            </span>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-heading text-2xl font-bold text-foreground">
                {xp.level.current}
              </p>
              <span className="rounded-xs border border-forest/40 bg-forest/10 px-2 py-0.5 font-mono text-[10px] text-forest dark:border-gold/40 dark:bg-gold/10 dark:text-gold font-semibold">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Total Career XP
            </span>
            <p className="mt-1 font-heading text-3xl font-bold text-forest dark:text-gold tabular-nums">
              <AnimatedCounter value={xp.total} /> XP
            </p>
          </div>
        </div>

        {xp.level.next && (
          <div className="mt-6 border-t border-border/70 pt-4">
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
              <span>
                Next Rank:{" "}
                <strong className="text-foreground">{xp.level.next}</strong>
              </span>
              <span>
                {xp.level.xpIntoLevel} / {xp.level.xpForNextLevel} XP (
                {progressPct}%)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500 ease-out dark:bg-gold"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Challenge Statistics Grid */}
      <section className="rounded-md border border-border bg-card p-6 shadow-xs">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Workshop Diagnostics
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded border border-border/70 bg-secondary/30 p-4">
            <p className="font-heading text-3xl font-bold text-foreground tabular-nums">
              {attempts.total}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Attempted
            </p>
          </div>
          <div className="rounded border border-border/70 bg-secondary/30 p-4">
            <p className="font-heading text-3xl font-bold text-forest dark:text-emerald-400 tabular-nums">
              {attempts.correct}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Solved
            </p>
          </div>
          <div className="rounded border border-border/70 bg-secondary/30 p-4">
            <p className="font-heading text-3xl font-bold text-gold tabular-nums">
              {correctPct}%
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Accuracy Rate
            </p>
          </div>
        </div>
      </section>

      {/* Pattern Mastery */}
      <section className="rounded-md border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Pattern Mastery Ledger
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {mastery.length} patterns attempted
          </span>
        </div>

        {mastery.length === 0 ? (
          <div className="mt-6 rounded border border-dashed border-border py-8 text-center text-muted-foreground">
            <p className="text-xs">No pattern challenges solved yet.</p>
            <Link
              href="/workshop"
              className="mt-3 inline-flex items-center gap-1 text-xs text-forest dark:text-gold hover:underline font-medium"
            >
              <span>Begin in Workshop</span>
              <ChevronRight className="size-3" />
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {mastery.map((m) => {
              const pct =
                m.attemptsCount > 0
                  ? Math.round((m.correctCount / m.attemptsCount) * 100)
                  : 0;

              return (
                <div
                  key={m.patternSlug}
                  className="flex items-center justify-between rounded border border-border/70 bg-secondary/20 p-3 text-xs"
                >
                  <div>
                    <span className="font-medium font-heading capitalize text-sm text-foreground">
                      {m.patternSlug.replace(/-/g, " ")}
                    </span>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      {m.correctCount} / {m.attemptsCount} correct ({pct}%)
                    </div>
                  </div>

                  {m.masteredAt ? (
                    <span className="rounded border border-forest/40 bg-forest/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-forest dark:text-emerald-300">
                      Mastered
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      In progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Achievements Showcase */}
      <section className="rounded-md border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Earned Accolades
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {achievements.length} unlocked
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="mt-6 rounded border border-dashed border-border py-8 text-center text-muted-foreground">
            <Trophy className="mx-auto size-6 text-muted-foreground/60" />
            <p className="mt-2 text-xs">
              No achievements unlocked yet. Play challenges to earn your first
              accolade.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {achievements.map((a) => (
              <div
                key={a.achievementSlug}
                className="flex items-start gap-3 rounded border border-gold/30 bg-gold/5 dark:bg-gold/10 p-3.5 shadow-xs"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Award className="size-4" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold capitalize text-foreground">
                    {a.achievementSlug.replace(/-/g, " ")}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {new Date(a.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
