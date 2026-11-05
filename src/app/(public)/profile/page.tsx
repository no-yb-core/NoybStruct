import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/db/profile";

export const instant = false; // blocking: reads session + DB

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getProfileData(session.user.id);
  if (!data) redirect("/login");

  const { user, xp, attempts, mastery, achievements } = data;
  const progressPct = Math.round((xp.level.progressRatio ?? 0) * 100);
  const correctPct =
    attempts.total > 0
      ? Math.round((attempts.correct / attempts.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      {/* Header */}
      <header className="flex items-center gap-5">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Avatar"}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-neutral-200"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-neutral-200" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{user.name ?? "Anonymous"}</h1>
          {user.githubUsername && (
            <p className="text-sm text-neutral-500">@{user.githubUsername}</p>
          )}
          <p className="text-xs text-neutral-400">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* XP + level */}
      <section className="rounded-lg border p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Level
            </p>
            <p className="text-2xl font-semibold">{xp.level.current}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Total XP
            </p>
            <p className="text-2xl font-semibold">{xp.total}</p>
          </div>
        </div>
        {xp.level.next && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>{xp.level.next}</span>
              <span>
                {xp.level.xpIntoLevel} / {xp.level.xpForNextLevel} XP
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-neutral-200">
              <div
                className="h-2 rounded bg-emerald-600"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Attempts */}
      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Challenges</h2>
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{attempts.total}</p>
            <p className="text-xs text-neutral-500">Attempted</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{attempts.correct}</p>
            <p className="text-xs text-neutral-500">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{correctPct}%</p>
            <p className="text-xs text-neutral-500">Accuracy</p>
          </div>
        </div>
      </section>

      {/* Pattern mastery */}
      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Pattern mastery</h2>
        {mastery.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            No attempts yet. Play a challenge to start tracking patterns.
          </p>
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
                  <span className="text-neutral-500">
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

      {/* Achievements */}
      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Achievements</h2>
        {achievements.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            No achievements yet. Keep playing — badges unlock as you hit
            milestones.
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
                <p className="text-xs text-neutral-500">
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
