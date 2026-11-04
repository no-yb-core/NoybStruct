"use client";

import Link from "next/link";

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
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-border pb-8 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Session complete
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          {totalXp} XP
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {correctCount} of {total} correct · {percent}%
        </p>
      </header>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Signed-out sessions are not saved. Signing in to keep XP and unlock
        achievements arrives in a later phase.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-sm bg-forest px-4 py-2 text-sm text-primary-foreground"
        >
          Play again
        </button>
        <Link
          href="/workshop"
          className="rounded-sm border border-border px-4 py-2 text-sm"
        >
          Change difficulty
        </Link>
      </div>
    </div>
  );
}
