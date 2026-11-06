import Image from "next/image";

import type { ProfileData } from "@/lib/db/profile";
import { ShareButton } from "./share-button";

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
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <header className="flex items-center gap-5">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Avatar"}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-border"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{user.name ?? "Anonymous"}</h1>
          {user.githubUsername && (
            <p className="text-sm text-muted-foreground">
              @{user.githubUsername}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        {shareUrl && <ShareButton url={shareUrl} />}
      </header>

      <section className="rounded-lg border p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Level
            </p>
            <p className="text-2xl font-semibold">{xp.level.current}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Total XP
            </p>
            <p className="text-2xl font-semibold">{xp.total}</p>
          </div>
        </div>
        {xp.level.next && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{xp.level.next}</span>
              <span>
                {xp.level.xpIntoLevel} / {xp.level.xpForNextLevel} XP
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded bg-emerald-600"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Challenges</h2>
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{attempts.total}</p>
            <p className="text-xs text-muted-foreground">Attempted</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{attempts.correct}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{correctPct}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Pattern mastery</h2>
        {mastery.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No attempts yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {mastery.map((m) => {
              const pct =
                m.attemptsCount > 0
                  ? Math.round((m.correctCount / m.attemptsCount) * 100)
                  : 0;
              return (
                <li
                  key={m.patternSlug}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium capitalize">
                    {m.patternSlug.replace(/-/g, " ")}
                  </span>
                  <span className="text-muted-foreground">
                    {m.correctCount}/{m.attemptsCount} ({pct}%)
                    {m.masteredAt && (
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                        mastered
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Achievements</h2>
        {achievements.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No achievements yet.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {achievements.map((a) => (
              <li
                key={a.achievementSlug}
                className="rounded border p-3 text-sm"
              >
                <p className="font-medium capitalize">
                  {a.achievementSlug.replace(/-/g, " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.earnedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
