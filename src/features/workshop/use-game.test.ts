import { describe, expect, it } from "vitest";
import { getChallengesByDifficulty } from "@/content/challenges/registry";
import type { PatternSlug } from "@/content/patterns/types";
import { createGameState, gameReducer } from "./use-game";
import { XP_BY_DIFFICULTY, FIRST_ATTEMPT_MULTIPLIER } from "./engine";

const beginnerChallenges = getChallengesByDifficulty("beginner");

function freshState() {
  // Deterministic shuffle so tests do not depend on order.
  return createGameState(beginnerChallenges, () => 0.5);
}

function currentChallenge(state: ReturnType<typeof freshState>) {
  return state.challenges[state.index];
}

function wrongOption(state: ReturnType<typeof freshState>): PatternSlug {
  const challenge = currentChallenge(state);
  return challenge.options.find((o) => o !== challenge.patternSlug)!;
}

describe("createGameState", () => {
  it("starts at index 0, choosing phase, zero XP", () => {
    const state = freshState();
    expect(state.index).toBe(0);
    expect(state.phase).toBe("choosing");
    expect(state.selectedPatternSlug).toBeNull();
    expect(state.totalXp).toBe(0);
    expect(state.challenges).toHaveLength(beginnerChallenges.length);
  });

  it("shuffles options but preserves all four", () => {
    const state = freshState();
    for (const challenge of state.challenges) {
      expect(state.options[challenge.slug]).toHaveLength(4);
      expect(new Set(state.options[challenge.slug]).size).toBe(4);
    }
  });
});

describe("gameReducer", () => {
  it("SELECT records the choice", () => {
    const state = freshState();
    const target = currentChallenge(state).patternSlug;
    const next = gameReducer(state, { type: "SELECT", patternSlug: target });
    expect(next.selectedPatternSlug).toBe(target);
  });

  it("ignores SELECT during feedback", () => {
    let state = freshState();
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: currentChallenge(state).patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });
    const sentinel = wrongOption(state);
    const next = gameReducer(state, { type: "SELECT", patternSlug: sentinel });
    expect(next).toBe(state);
  });

  it("SUBMIT of the correct answer on first attempt awards base × bonus", () => {
    let state = freshState();
    const challenge = currentChallenge(state);
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: challenge.patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });

    expect(state.phase).toBe("feedback");
    const record = state.evaluations[challenge.slug];
    expect(record.evaluation.correct).toBe(true);
    expect(record.evaluation.firstAttemptBonus).toBe(true);
    const expectedXp = Math.round(
      XP_BY_DIFFICULTY[challenge.difficulty] * FIRST_ATTEMPT_MULTIPLIER,
    );
    expect(state.totalXp).toBe(expectedXp);
    expect(state.correct.has(challenge.slug)).toBe(true);
    expect(state.attempted.has(challenge.slug)).toBe(true);
  });

  it("SUBMIT of a wrong answer awards zero XP", () => {
    let state = freshState();
    const challenge = currentChallenge(state);
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: wrongOption(state),
    });
    state = gameReducer(state, { type: "SUBMIT" });

    expect(state.phase).toBe("feedback");
    const record = state.evaluations[challenge.slug];
    expect(record.evaluation.correct).toBe(false);
    expect(state.totalXp).toBe(0);
    expect(state.correct.has(challenge.slug)).toBe(false);
    expect(state.attempted.has(challenge.slug)).toBe(true);
  });

  it("RETRY after a wrong answer returns to choosing", () => {
    let state = freshState();
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: wrongOption(state),
    });
    state = gameReducer(state, { type: "SUBMIT" });
    state = gameReducer(state, { type: "RETRY" });

    expect(state.phase).toBe("choosing");
    expect(state.selectedPatternSlug).toBeNull();
    expect(state.attempted.has(currentChallenge(state).slug)).toBe(true);
  });

  it("RETRY is a no-op after a correct answer", () => {
    let state = freshState();
    const challenge = currentChallenge(state);
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: challenge.patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });
    const next = gameReducer(state, { type: "RETRY" });
    expect(next).toBe(state);
  });

  it("correct answer after retry awards base XP only (no bonus)", () => {
    let state = freshState();
    const challenge = currentChallenge(state);
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: wrongOption(state),
    });
    state = gameReducer(state, { type: "SUBMIT" });
    state = gameReducer(state, { type: "RETRY" });
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: challenge.patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });

    const record = state.evaluations[challenge.slug];
    expect(record.evaluation.correct).toBe(true);
    expect(record.evaluation.firstAttemptBonus).toBe(false);
    expect(state.totalXp).toBe(XP_BY_DIFFICULTY[challenge.difficulty]);
  });

  it("NEXT advances to the next challenge", () => {
    let state = freshState();
    const firstSlug = currentChallenge(state).slug;
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: currentChallenge(state).patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });
    state = gameReducer(state, { type: "NEXT" });

    expect(state.index).toBe(1);
    expect(state.phase).toBe("choosing");
    expect(state.selectedPatternSlug).toBeNull();
    expect(currentChallenge(state).slug).not.toBe(firstSlug);
  });

  it("NEXT on the last challenge completes the session", () => {
    let state = freshState();
    for (let i = 0; i < state.challenges.length; i++) {
      state = gameReducer(state, {
        type: "SELECT",
        patternSlug: currentChallenge(state).patternSlug,
      });
      state = gameReducer(state, { type: "SUBMIT" });
      state = gameReducer(state, { type: "NEXT" });
    }
    expect(state.phase).toBe("complete");
    expect(state.correct.size).toBe(state.challenges.length);
  });

  it("RESTART rebuilds a fresh session", () => {
    let state = freshState();
    state = gameReducer(state, {
      type: "SELECT",
      patternSlug: currentChallenge(state).patternSlug,
    });
    state = gameReducer(state, { type: "SUBMIT" });
    state = gameReducer(state, { type: "NEXT" });

    state = gameReducer(state, {
      type: "RESTART",
      challenges: beginnerChallenges,
    });
    expect(state.index).toBe(0);
    expect(state.phase).toBe("choosing");
    expect(state.totalXp).toBe(0);
    expect(state.attempted.size).toBe(0);
    expect(state.correct.size).toBe(0);
  });
});
