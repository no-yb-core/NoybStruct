export const LEVELS = [
  { name: "Apprentice", minXp: 0 },
  { name: "Junior Developer", minXp: 100 },
  { name: "Pattern Explorer", minXp: 350 },
  { name: "Software Architect", minXp: 850 },
  { name: "Pattern Master", minXp: 2000 },
] as const;

export type LevelName = (typeof LEVELS)[number]["name"];

export function levelFromXp(xp: number): LevelName {
  let current: LevelName = LEVELS[0].name;
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level.name;
    else break;
  }
  return current;
}

export type LevelProgress = {
  current: LevelName;
  next: LevelName | null;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  progressRatio: number | null;
};

export function levelProgress(xp: number): LevelProgress {
  const current = levelFromXp(xp);
  const idx = LEVELS.findIndex((l) => l.name === current);
  const currentLevel = LEVELS[idx];
  const nextLevel = LEVELS[idx + 1] ?? null;

  const xpIntoLevel = xp - currentLevel.minXp;
  const xpForNextLevel = nextLevel
    ? nextLevel.minXp - currentLevel.minXp
    : null;

  return {
    current,
    next: nextLevel?.name ?? null,
    xpIntoLevel,
    xpForNextLevel,
    progressRatio: xpForNextLevel
      ? Math.min(1, xpIntoLevel / xpForNextLevel)
      : null,
  };
}
