type FeedbackBannerProps = {
  correct: boolean;
  correctPatternName: string;
  explanation: string;
  xpEarned: number;
  firstAttemptBonus: boolean;
};

export function FeedbackBanner({
  correct,
  correctPatternName,
  explanation,
  xpEarned,
  firstAttemptBonus,
}: FeedbackBannerProps) {
  const borderClass = correct ? "border-forest" : "border-destructive";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-6 border-l-4 bg-secondary/60 p-4 ${borderClass}`}
    >
      <p className="font-heading text-lg font-semibold">
        {correct ? "Correct." : "Not quite."}
      </p>
      {correct && (
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          +{xpEarned} XP{firstAttemptBonus && " · first-attempt bonus"}
        </p>
      )}
      <p className="mt-3">
        <span className="font-semibold">{correctPatternName}</span>
        {" — "}
        {explanation}
      </p>
    </div>
  );
}
