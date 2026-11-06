"use client";

import { motion } from "motion/react";
import type { PatternSlug } from "@/content/patterns/types";
import type { AnswerEvaluation } from "../engine";

type AnswerOptionProps = {
  slug: PatternSlug;
  displayName: string;
  selected: PatternSlug | null;
  submitted: PatternSlug | undefined;
  correctPatternSlug: PatternSlug;
  evaluation: AnswerEvaluation | undefined;
  disabled: boolean;
  onSelect: (slug: PatternSlug) => void;
  index?: number;
};

type VisualState =
  "default" | "selected" | "correct" | "wrong" | "revealed-correct";

function visualState(
  slug: PatternSlug,
  selected: PatternSlug | null,
  submitted: PatternSlug | undefined,
  correctPatternSlug: PatternSlug,
  evaluation: AnswerEvaluation | undefined,
): VisualState {
  if (evaluation) {
    if (slug === submitted && evaluation.correct) return "correct";
    if (slug === submitted && !evaluation.correct) return "wrong";
    if (slug === correctPatternSlug && !evaluation.correct)
      return "revealed-correct";
    return "default";
  }
  return slug === selected ? "selected" : "default";
}

const stateClasses: Record<VisualState, string> = {
  default:
    "border-border hover:border-forest/70 hover:bg-secondary/40 dark:hover:border-gold/70",
  selected:
    "border-forest bg-forest/10 ring-1 ring-forest dark:border-gold dark:bg-gold/10 dark:ring-gold",
  correct: "border-forest bg-forest/15 ring-1 ring-forest dark:border-forest",
  wrong: "border-destructive bg-destructive/10 ring-1 ring-destructive",
  "revealed-correct":
    "border-forest border-dashed bg-forest/5 dark:border-gold",
};

export function AnswerOption({
  slug,
  displayName,
  selected,
  submitted,
  correctPatternSlug,
  evaluation,
  disabled,
  onSelect,
  index,
}: AnswerOptionProps) {
  const visual = visualState(
    slug,
    selected,
    submitted,
    correctPatternSlug,
    evaluation,
  );

  const className = [
    "group flex w-full items-center justify-between rounded-sm border px-4 py-3 text-left transition-all shadow-xs",
    stateClasses[visual],
    disabled ? "cursor-default" : "cursor-pointer",
  ].join(" ");

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(slug)}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={className}
      aria-pressed={slug === selected}
    >
      <div className="flex items-center gap-3">
        {/* Keyboard shortcut pill */}
        {index !== undefined && (
          <span className="hidden sm:inline-flex size-5 items-center justify-center rounded-xs border border-border/80 bg-background/80 font-mono text-[10px] text-muted-foreground group-hover:border-foreground/40">
            {index + 1}
          </span>
        )}
        <span className="font-medium text-sm text-foreground">
          {displayName}
        </span>
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {visual === "correct" && (
          <span className="text-forest dark:text-emerald-400 font-bold">
            correct
          </span>
        )}
        {visual === "wrong" && (
          <span className="text-destructive font-bold">your answer</span>
        )}
        {visual === "revealed-correct" && (
          <span className="text-forest dark:text-gold font-bold">
            correct answer
          </span>
        )}
      </span>
    </motion.button>
  );
}
