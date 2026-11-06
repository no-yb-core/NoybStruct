"use client";

import { useSyncExternalStore } from "react";
import type { Challenge } from "@/content/challenges/schema";
import { useGame, type GameAction, type GameState } from "../use-game";
import { evaluateAnswer } from "../engine";
import { ChallengeCard } from "./challenge-card";
import { CompletionScreen } from "./completion-screen";
import { ProgressBar } from "./progress-bar";
import { useSubmitAttempt } from "@/features/challenges/use-submit-attempt";
import { showAchievementToasts } from "@/features/challenges/attempt-toasts";

// Stable no-op subscribe — useSyncExternalStore needs a stable reference
const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

type GameSessionProps = {
  challenges: readonly Challenge[];
  patternNames: Record<string, string>;
};

export function GameSession(props: GameSessionProps) {
  // useGame shuffles with Math.random(), which differs between SSR and
  // hydration. Render a skeleton on both sides, then mount on the client.
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="h-2 w-full animate-pulse rounded bg-neutral-200" />
        <div className="mt-8 h-64 animate-pulse rounded bg-neutral-100" />
      </div>
    );
  }

  return <GameSessionInner {...props} />;
}

function GameSessionInner({ challenges, patternNames }: GameSessionProps) {
  const { state, dispatch, restart } = useGame(challenges);

  if (state.phase === "complete") {
    return (
      <CompletionScreen
        totalXp={state.totalXp}
        correctCount={state.correct.size}
        total={state.challenges.length}
        onRestart={restart}
      />
    );
  }

  const challenge = state.challenges[state.index];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ProgressBar
        current={state.index + 1}
        total={state.challenges.length}
        sessionXp={state.totalXp}
      />
      <ChallengeView
        key={challenge.slug}
        challenge={challenge}
        state={state}
        dispatch={dispatch}
        patternNames={patternNames}
      />
    </div>
  );
}

type ChallengeViewProps = {
  challenge: Challenge;
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  patternNames: Record<string, string>;
};

function ChallengeView({
  challenge,
  state,
  dispatch,
  patternNames,
}: ChallengeViewProps) {
  const options = state.options[challenge.slug];
  const record = state.evaluations[challenge.slug];
  const { state: submitState, submit } = useSubmitAttempt(
    challenge.slug,
    challenge.patternSlug,
  );

  async function handleSubmit() {
    if (!state.selectedPatternSlug) return;
    const isRetry = state.attempted.has(challenge.slug);
    const evaluation = evaluateAnswer(
      challenge,
      state.selectedPatternSlug,
      isRetry,
    );

    // 1. Local reducer runs immediately (unchanged)
    dispatch({ type: "SUBMIT" });

    // 2. Server persists in background — now we also surface achievements
    const result = await submit(evaluation.correct);

    if (result?.newAchievements?.length) {
      showAchievementToasts(result.newAchievements);
    }
  }

  return (
    <>
      <ChallengeCard
        challenge={challenge}
        options={options}
        patternNames={patternNames}
        phase={state.phase}
        selectedPatternSlug={state.selectedPatternSlug}
        submitted={record?.selected}
        evaluation={state.phase === "feedback" ? record?.evaluation : undefined}
        onSelect={(slug) => dispatch({ type: "SELECT", patternSlug: slug })}
        onSubmit={handleSubmit}
        onNext={() => dispatch({ type: "NEXT" })}
        onRetry={() => dispatch({ type: "RETRY" })}
      />
      {submitState.status === "error" && (
        <p className="mt-3 text-xs text-amber-600">
          Progress not synced: {submitState.message}
        </p>
      )}
    </>
  );
}
