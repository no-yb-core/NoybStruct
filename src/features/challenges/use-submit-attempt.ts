"use client";

import { useCallback, useState } from "react";
import type { LevelProgress } from "@/lib/xp/levels";

export type SubmitAttemptResult = {
  attempt: { id: string; attemptsCount: number; correctAt: string | null };
  isFirstCorrect: boolean;
  xpAwarded: boolean;
  xpAmount: number;
  totalXp: number;
  level: LevelProgress;
};

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; result: SubmitAttemptResult }
  | { status: "error"; message: string };

export function useSubmitAttempt(challengeSlug: string, patternSlug: string) {
  const [state, setState] = useState<State>({ status: "idle" });

  const submit = useCallback(
    async (isCorrect: boolean) => {
      setState({ status: "submitting" });
      try {
        const res = await fetch(`/api/challenges/${challengeSlug}/attempt`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ isCorrect, patternSlug }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }
        const result: SubmitAttemptResult = await res.json();
        setState({ status: "success", result });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", message });
        return null;
      }
    },
    [challengeSlug, patternSlug],
  );

  return { state, submit };
}
