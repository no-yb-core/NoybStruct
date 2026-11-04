"use client";

import type { Challenge } from "@/content/challenges/schema";
import { useGame } from "../use-game";
import { ChallengeCard } from "./challenge-card";
import { CompletionScreen } from "./completion-screen";
import { ProgressBar } from "./progress-bar";

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
  const options = state.options[challenge.slug];
  const record = state.evaluations[challenge.slug];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ProgressBar current={state.index + 1} total={state.challenges.length} />
      <ChallengeCard
        challenge={challenge}
        options={options}
        patternNames={patternNames}
        phase={state.phase}
        selectedPatternSlug={state.selectedPatternSlug}
        submitted={record?.selected}
        evaluation={state.phase === "feedback" ? record?.evaluation : undefined}
        onSelect={(slug) => dispatch({ type: "SELECT", patternSlug: slug })}
        onSubmit={() => dispatch({ type: "SUBMIT" })}
        onNext={() => dispatch({ type: "NEXT" })}
        onRetry={() => dispatch({ type: "RETRY" })}
      />
    </div>
  );
}
