import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Award, Compass, Crown, Medal, Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/db/leaderboard";

export const metadata = {
  title: "Leaderboard",
  description: "Top players by total XP.",
};

// Extract the data fetch into a cached function.
// "use cache" + cacheLife replace the old `export const revalidate = 60`.
async function getCachedLeaderboard() {
  "use cache";
  cacheLife({ revalidate: 60 });
  return getLeaderboard(10);
}

export default async function LeaderboardPage() {
  const entries = await getCachedLeaderboard();

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Hall of Architectural Intuition
          </span>
          <span className="rounded-xs border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Top 10 Engineers
          </span>
        </div>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Global Leaderboard
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          The leading software practitioners ranked by verified problem-solving
          XP across the 23 design patterns.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="mt-12 rounded-md border border-dashed border-border py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Trophy className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            The Archives are Pristine
          </h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
            No scores recorded in this epoch yet. Complete a workshop challenge
            to claim the #1 spot on the leaderboard.
          </p>
          <Link
            href="/workshop"
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-forest-deep dark:bg-gold dark:text-ink"
          >
            <Compass className="size-3.5" />
            <span>Launch Workshop Challenge</span>
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {/* Top 3 Podium (if available) */}
          {topThree.length > 0 && (
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                The High Table
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {topThree.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const isSecond = entry.rank === 2;

                  const cardStyle = isFirst
                    ? "border-gold/60 bg-gradient-to-b from-gold/10 via-card to-card shadow-md ring-1 ring-gold/40"
                    : isSecond
                      ? "border-border/90 bg-card shadow-xs"
                      : "border-border/80 bg-card shadow-xs";

                  return (
                    <div
                      key={entry.userId}
                      className={`relative flex flex-col justify-between rounded-md border p-5 text-center ${cardStyle}`}
                    >
                      {/* Rank badge */}
                      <div className="absolute right-3 top-3">
                        {isFirst ? (
                          <div className="flex size-7 items-center justify-center rounded-full bg-gold/20 text-gold">
                            <Crown className="size-4" />
                          </div>
                        ) : isSecond ? (
                          <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                            <Medal className="size-4" />
                          </div>
                        ) : (
                          <div className="flex size-7 items-center justify-center rounded-full bg-amber-900/10 text-amber-700 dark:text-amber-500">
                            <Award className="size-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center pt-2">
                        {entry.image ? (
                          <div className="relative">
                            <Image
                              src={entry.image}
                              alt={entry.name ?? "Avatar"}
                              width={56}
                              height={56}
                              className={`rounded-full ring-2 ${
                                isFirst ? "ring-gold" : "ring-border"
                              }`}
                            />
                            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                              {entry.rank}
                            </span>
                          </div>
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-base font-bold">
                            {entry.rank}
                          </div>
                        )}

                        <p className="mt-3 font-heading text-lg font-bold text-foreground">
                          {entry.name ?? entry.githubUsername ?? "Anonymous"}
                        </p>
                        {entry.githubUsername && (
                          <p className="text-[11px] text-muted-foreground font-mono">
                            @{entry.githubUsername}
                          </p>
                        )}

                        <span className="mt-2 rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {entry.level.current}
                        </span>
                      </div>

                      <div className="mt-5 border-t border-border/60 pt-3">
                        <span className="font-heading text-xl font-bold text-forest dark:text-gold tabular-nums">
                          {entry.totalXp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ranks 4 - 10 */}
          {remaining.length > 0 && (
            <section>
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                Honorable Mention (Ranks 4-10)
              </h2>
              <ol className="divide-y divide-border/60 rounded-md border border-border bg-card">
                {remaining.map((entry) => (
                  <li
                    key={entry.userId}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30"
                  >
                    <span className="w-8 text-center font-mono text-sm font-semibold text-muted-foreground tabular-nums">
                      #{entry.rank}
                    </span>

                    {entry.image ? (
                      <Image
                        src={entry.image}
                        alt={entry.name ?? "Avatar"}
                        width={36}
                        height={36}
                        className="rounded-full ring-1 ring-border"
                      />
                    ) : (
                      <div className="size-9 rounded-full bg-secondary text-xs flex items-center justify-center font-bold">
                        {entry.rank}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {entry.name ?? entry.githubUsername ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {entry.level.current}
                      </p>
                    </div>

                    <p className="font-heading text-base font-bold text-foreground tabular-nums">
                      {entry.totalXp.toLocaleString()} XP
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
