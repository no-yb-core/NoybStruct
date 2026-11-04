type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Challenge {current} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-1.5 w-full bg-border"
      >
        <div
          className="h-full bg-forest transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
