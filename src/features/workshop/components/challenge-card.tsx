"use client";

import type { Challenge } from "@/content/challenges/schema";
import type { PatternSlug } from "@/content/patterns/types";
import type { AnswerEvaluation } from "../engine";
import { AnswerOption } from "./answer-option";
import { FeedbackBanner } from "./feedback-banner";
import type { GamePhase } from "../use-game";

type ChallengeCardProps = {
  challenge: Challenge;
  options: PatternSlug[];
  patternNames: Record<string, string>;
  phase: GamePhase;
  selectedPatternSlug: PatternSlug | null;
  submitted: PatternSlug | undefined;
  evaluation: AnswerEvaluation | undefined;
  onSelect: (slug: PatternSlug) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetry: () => void;
};

export function ChallengeCard({
  challenge,
  options,
  patternNames,
  phase,
  selectedPatternSlug,
  submitted,
  evaluation,
  onSelect,
  onSubmit,
  onNext,
  onRetry,
}: ChallengeCardProps) {
  const feedbackOpen = phase === "feedback" && evaluation !== undefined;
  const canSubmit = phase === "choosing" && selectedPatternSlug !== null;

  return (
    <article className="mt-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {challenge.difficulty}
      </p>

      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
        {challenge.scenario}
      </h1>

      <p className="mt-4">{challenge.problem}</p>

      {challenge.codeSnippet !== null && (
        <pre className="mt-6 overflow-x-auto border border-border bg-secondary/40 p-4 font-mono text-sm">
          <code>{challenge.codeSnippet}</code>
        </pre>
      )}

      <h2 className="mt-8 font-heading text-2xl font-semibold">
        Which pattern fits best?
      </h2>

      <div className="mt-4 space-y-2">
        {options.map((slug) => (
          <AnswerOption
            key={slug}
            slug={slug}
            displayName={patternNames[slug] ?? slug}
            selected={selectedPatternSlug}
            submitted={submitted}
            correctPatternSlug={challenge.patternSlug}
            evaluation={evaluation}
            disabled={phase === "feedback"}
            onSelect={onSelect}
          />
        ))}
      </div>

      {feedbackOpen && evaluation !== undefined && (
        <FeedbackBanner
          correct={evaluation.correct}
          correctPatternName={
            patternNames[challenge.patternSlug] ?? challenge.patternSlug
          }
          explanation={challenge.explanation}
          xpEarned={evaluation.xpEarned}
          firstAttemptBonus={evaluation.firstAttemptBonus}
        />
      )}

      <div className="mt-6 flex justify-end gap-3">
        {phase === "choosing" && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="rounded-sm bg-forest px-4 py-2 text-sm text-primary-foreground transition-opacity disabled:opacity-50"
          >
            Submit
          </button>
        )}

        {phase === "feedback" && evaluation?.correct && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-sm bg-forest px-4 py-2 text-sm text-primary-foreground"
          >
            Next
          </button>
        )}

        {phase === "feedback" && evaluation && !evaluation.correct && (
          <>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-sm border border-border px-4 py-2 text-sm"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-sm bg-forest px-4 py-2 text-sm text-primary-foreground"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </article>
  );
}
