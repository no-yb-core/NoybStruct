type ProgressBarProps = {
  current: number;
  total: number;
  sessionXp?: number;
};

export function ProgressBar({ current, total, sessionXp }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="font-medium text-foreground">
          Challenge {current} of {total}
        </span>
        <div className="flex items-center gap-3">
          {sessionXp !== undefined && sessionXp > 0 && (
            <span className="text-forest dark:text-gold font-semibold">
              +{sessionXp} XP earned
            </span>
          )}
          <span>{percent}%</span>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border/80"
      >
        <div
          className="h-full rounded-full bg-forest transition-all duration-300 ease-out dark:bg-gold"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
