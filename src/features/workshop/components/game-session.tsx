"use client";

import type { Challenge } from "@/content/challenges/schema";
import { useGame, type GameAction, type GameState } from "../use-game";
import { evaluateAnswer } from "../engine";
import { ChallengeCard } from "./challenge-card";
import { CompletionScreen } from "./completion-screen";
import { ProgressBar } from "./progress-bar";
import { useSubmitAttempt } from "@/features/challenges/use-submit-attempt";

type GameSessionProps = {
  challenges: readonly Challenge[];
  patternNames: Record<string, string>;
};

export function GameSession({ challenges, patternNames }: GameSessionProps) {
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
      <ProgressBar current={state.index + 1} total={state.challenges.length} />
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

  function handleSubmit() {
    if (!state.selectedPatternSlug) return;
    const isRetry = state.attempted.has(challenge.slug);
    const evaluation = evaluateAnswer(
      challenge,
      state.selectedPatternSlug,
      isRetry,
    );
    // 1. Update local game state synchronously — unchanged behavior
    dispatch({ type: "SUBMIT" });
    // 2. Persist to DB in the background — UI doesn't wait
    void submit(evaluation.correct);
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
