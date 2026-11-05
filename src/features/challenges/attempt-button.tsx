"use client";

import { useState } from "react";
import { useSubmitAttempt } from "./use-submit-attempt";

type Props = {
  challengeSlug: string;
  patternSlug: string;
};

export function AttemptButton({ challengeSlug, patternSlug }: Props) {
  const { state, submit } = useSubmitAttempt(challengeSlug, patternSlug);
  const [lastOutcome, setLastOutcome] = useState<"correct" | "wrong" | null>(
    null,
  );

  const isSubmitting = state.status === "submitting";

  async function handleClick(isCorrect: boolean) {
    setLastOutcome(isCorrect ? "correct" : "wrong");
    await submit(isCorrect);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleClick(true)}
          disabled={isSubmitting}
          className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit correct answer"}
        </button>
        <button
          onClick={() => handleClick(false)}
          disabled={isSubmitting}
          className="rounded bg-rose-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Submit wrong answer
        </button>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-rose-600">Error: {state.message}</p>
      )}

      {state.status === "success" && (
        <div className="text-sm text-neutral-700">
          {state.result.xpAwarded ? (
            <p className="text-emerald-600">
              +{state.result.xpAmount} XP → {state.result.totalXp} total
            </p>
          ) : (
            <p>No XP this time (already rewarded or answer was wrong).</p>
          )}
          <p>
            Level: <strong>{state.result.level.current}</strong>
            {state.result.level.next && (
              <>
                {" — "}
                {Math.round((state.result.level.progressRatio ?? 0) * 100)}% to{" "}
                {state.result.level.next}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
