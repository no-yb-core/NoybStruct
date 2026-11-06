import Image from "next/image";
import Link from "next/link";
import { getLeaderboard } from "@/lib/db/leaderboard";

export const metadata = {
  title: "Leaderboard",
  description: "Top players by total XP.",
};

export const revalidate = 60; // ISR — refresh every minute

export default async function LeaderboardPage() {
  const entries = await getLeaderboard(10);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Leaderboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Top 10 players by total XP. Play a challenge to climb.
      </p>

      {entries.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          No scores yet. Be the first to play.
        </p>
      ) : (
        <ol className="mt-8 space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.userId}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <span className="w-8 text-center text-lg font-semibold tabular-nums text-muted-foreground">
                {entry.rank}
              </span>
              {entry.image ? (
                <Image
                  src={entry.image}
                  alt={entry.name ?? "Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full ring-1 ring-border"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {entry.name ?? entry.githubUsername ?? "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.level.current}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums">
                {entry.totalXp.toLocaleString()} XP
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}