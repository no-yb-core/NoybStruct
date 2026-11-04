"use client";

import { useReducer } from "react";
import type { Challenge } from "@/content/challenges/schema";
import type { PatternSlug } from "@/content/patterns/types";
import { evaluateAnswer, type AnswerEvaluation } from "./engine";

export type GamePhase = "choosing" | "feedback" | "complete";

export type AnswerRecord = {
  evaluation: AnswerEvaluation;
  selected: PatternSlug;
};

export type GameState = {
  challenges: Challenge[];
  options: Record<string, PatternSlug[]>;
  index: number;
  phase: GamePhase;
  selectedPatternSlug: PatternSlug | null;
  /** Slugs the player has submitted at least one answer for in this session. */
  attempted: Set<string>;
  /** Slugs the player has answered correctly in this session. */
  correct: Set<string>;
  /** Latest evaluation per slug. */
  evaluations: Record<string, AnswerRecord>;
  totalXp: number;
};

export type GameAction =
  | { type: "SELECT"; patternSlug: PatternSlug }
  | { type: "SUBMIT" }
  | { type: "NEXT" }
  | { type: "RETRY" }
  | { type: "RESTART"; challenges: readonly Challenge[] };

function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createGameState(
  challenges: readonly Challenge[],
  random: () => number = Math.random,
): GameState {
  const sessionChallenges = shuffle(challenges, random);
  const options: Record<string, PatternSlug[]> = {};
  for (const challenge of sessionChallenges) {
    options[challenge.slug] = shuffle(challenge.options, random);
  }
  return {
    challenges: sessionChallenges,
    options,
    index: 0,
    phase: "choosing",
    selectedPatternSlug: null,
    attempted: new Set(),
    correct: new Set(),
    evaluations: {},
    totalXp: 0,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT": {
      if (state.phase !== "choosing") return state;
      return { ...state, selectedPatternSlug: action.patternSlug };
    }

    case "SUBMIT": {
      if (state.phase !== "choosing" || !state.selectedPatternSlug)
        return state;
      const challenge = state.challenges[state.index];
      const evaluation = evaluateAnswer(
        challenge,
        state.selectedPatternSlug,
        state.attempted.has(challenge.slug),
      );
      const nextAttempted = new Set(state.attempted);
      nextAttempted.add(challenge.slug);
      const nextCorrect = new Set(state.correct);
      if (evaluation.correct) nextCorrect.add(challenge.slug);
      return {
        ...state,
        phase: "feedback",
        attempted: nextAttempted,
        correct: nextCorrect,
        totalXp: state.totalXp + evaluation.xpEarned,
        evaluations: {
          ...state.evaluations,
          [challenge.slug]: {
            evaluation,
            selected: state.selectedPatternSlug,
          },
        },
      };
    }

    case "NEXT": {
      if (state.phase !== "feedback") return state;
      const isLast = state.index >= state.challenges.length - 1;
      if (isLast) {
        return { ...state, phase: "complete", selectedPatternSlug: null };
      }
      return {
        ...state,
        index: state.index + 1,
        phase: "choosing",
        selectedPatternSlug: null,
      };
    }

    case "RETRY": {
      if (state.phase !== "feedback") return state;
      const challenge = state.challenges[state.index];
      const latest = state.evaluations[challenge.slug];
      if (latest?.evaluation.correct) return state;
      return { ...state, phase: "choosing", selectedPatternSlug: null };
    }

    case "RESTART":
      return createGameState(action.challenges);

    default:
      return state;
  }
}

export function useGame(challenges: readonly Challenge[]) {
  const [state, dispatch] = useReducer(gameReducer, challenges, (cs) =>
    createGameState(cs),
  );
  const restart = () => dispatch({ type: "RESTART", challenges });
  return { state, dispatch, restart };
}
