"use client";

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
  default: "border-border hover:border-forest/60",
  selected: "border-forest bg-secondary",
  correct: "border-forest bg-secondary",
  wrong: "border-destructive bg-destructive/5",
  "revealed-correct": "border-forest border-dashed",
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
}: AnswerOptionProps) {
  const visual = visualState(
    slug,
    selected,
    submitted,
    correctPatternSlug,
    evaluation,
  );
  const className = [
    "flex w-full items-center justify-between border px-4 py-3 text-left transition-colors",
    stateClasses[visual],
    disabled ? "cursor-default" : "cursor-pointer",
  ].join(" ");

  return (
    <button
      type="button"
      onClick={() => onSelect(slug)}
      disabled={disabled}
      className={className}
      aria-pressed={slug === selected}
    >
      <span>{displayName}</span>
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {visual === "correct" && "correct"}
        {visual === "wrong" && "your answer"}
        {visual === "revealed-correct" && "correct answer"}
      </span>
    </button>
  );
}
