"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Send } from "lucide-react";
import type { Challenge } from "@/content/challenges/schema";
import type { PatternSlug } from "@/content/patterns/types";
import type { AnswerEvaluation } from "../engine";
import { AnswerOption } from "./answer-option";
import { FeedbackBanner } from "./feedback-banner";
import { CodeSnippet } from "@/components/patterns/code-snippet";
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

  // Keyboard navigation: 1, 2, 3, 4, Enter, R
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (phase === "choosing") {
        if (e.key === "1" && options[0]) {
          e.preventDefault();
          onSelect(options[0]);
        } else if (e.key === "2" && options[1]) {
          e.preventDefault();
          onSelect(options[1]);
        } else if (e.key === "3" && options[2]) {
          e.preventDefault();
          onSelect(options[2]);
        } else if (e.key === "4" && options[3]) {
          e.preventDefault();
          onSelect(options[3]);
        } else if (e.key === "Enter" && canSubmit) {
          e.preventDefault();
          onSubmit();
        }
      } else if (phase === "feedback") {
        if (e.key === "Enter") {
          e.preventDefault();
          onNext();
        } else if (
          (e.key === "r" || e.key === "R") &&
          evaluation &&
          !evaluation.correct
        ) {
          e.preventDefault();
          onRetry();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    phase,
    options,
    canSubmit,
    evaluation,
    onSelect,
    onSubmit,
    onNext,
    onRetry,
  ]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 rounded-md border border-border bg-card p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-forest dark:text-gold font-bold">
          {challenge.difficulty} Tier
        </span>
        <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
          Shortcuts: [1-4] Select · [↵] Submit
        </span>
      </div>

      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {challenge.scenario}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {challenge.problem}
      </p>

      {challenge.codeSnippet !== null && (
        <div className="mt-6">
          <CodeSnippet
            code={challenge.codeSnippet}
            language="TypeScript"
            filename="challenge-context.ts"
          />
        </div>
      )}

      <h2 className="mt-8 font-heading text-xl font-bold text-foreground">
        Which pattern fits best?
      </h2>

      <div className="mt-4 space-y-2.5">
        {options.map((slug, idx) => (
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
            index={idx}
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

      <div className="mt-6 flex justify-end gap-3 pt-2">
        {phase === "choosing" && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 rounded-sm bg-forest px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-forest-deep disabled:opacity-40 disabled:hover:bg-forest dark:bg-gold dark:text-ink"
          >
            <Send className="size-3.5" />
            <span>Submit Choice</span>
            <kbd className="hidden sm:inline rounded bg-black/20 dark:bg-black/30 px-1 py-0.5 font-mono text-[9px]">
              ↵
            </kbd>
          </button>
        )}

        {phase === "feedback" && evaluation?.correct && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 rounded-sm bg-forest px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-forest-deep dark:bg-gold dark:text-ink transition-all"
          >
            <span>Next Challenge</span>
            <ArrowRight className="size-3.5" />
            <kbd className="hidden sm:inline rounded bg-black/20 dark:bg-black/30 px-1 py-0.5 font-mono text-[9px]">
              ↵
            </kbd>
          </button>
        )}

        {phase === "feedback" && evaluation && !evaluation.correct && (
          <>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-sm border border-border bg-secondary/80 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-all"
            >
              <RotateCcw className="size-3.5" />
              <span>Try Again</span>
              <kbd className="hidden sm:inline rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                R
              </kbd>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 rounded-sm bg-forest px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-forest-deep dark:bg-gold dark:text-ink transition-all"
            >
              <span>Skip</span>
              <ArrowRight className="size-3.5" />
            </button>
          </>
        )}
      </div>
    </motion.article>
  );
}
