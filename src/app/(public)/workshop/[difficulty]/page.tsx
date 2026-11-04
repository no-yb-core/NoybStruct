import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChallengesByDifficulty } from "@/content/challenges/registry";
import {
  difficulties,
  difficultyLabels,
  type Difficulty,
} from "@/content/challenges/types";
import { getPattern } from "@/content/patterns/registry";
import type { PatternSlug } from "@/content/patterns/types";
import { GameSession } from "@/features/workshop/components/game-session";

import { Suspense } from "react";
export const instant = false;

type PageProps = { params: Promise<{ difficulty: string }> };

function isDifficulty(value: string): value is Difficulty {
  return (difficulties as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return difficulties.map((difficulty) => ({ difficulty }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { difficulty } = await params;
  if (!isDifficulty(difficulty)) return { title: "Pattern Detective" };
  return {
    title: `Pattern Detective — ${difficultyLabels[difficulty]}`,
    description: `Practice identifying design patterns at ${difficultyLabels[
      difficulty
    ].toLowerCase()} difficulty.`,
  };
}

export default async function WorkshopDifficultyPage({ params }: PageProps) {
  const { difficulty } = await params;
  if (!isDifficulty(difficulty)) notFound();

  const challenges = getChallengesByDifficulty(difficulty);
  if (challenges.length === 0) notFound();

  // Build a slug → display-name map here so the client does not need to
  // import the full pattern registry (~23 content files).
  const patternNames: Record<string, string> = {};
  const seen = new Set<PatternSlug>();
  for (const challenge of challenges) {
    for (const slug of challenge.options) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      const pattern = getPattern(slug);
      if (pattern) patternNames[slug] = pattern.name;
    }
  }

  return (
    <Suspense fallback={<GameSessionSkeleton />}>
      <GameSession challenges={challenges} patternNames={patternNames} />
    </Suspense>
  );
}

function GameSessionSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12" aria-busy="true">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Loading session…</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-border" />
      <div className="mt-8 space-y-4">
        <div className="h-3 w-24 bg-border/60" />
        <div className="h-10 w-3/4 bg-border/60" />
        <div className="h-4 w-full bg-border/60" />
        <div className="h-4 w-5/6 bg-border/60" />
        <div className="mt-8 space-y-2">
          <div className="h-12 w-full bg-border/40" />
          <div className="h-12 w-full bg-border/40" />
          <div className="h-12 w-full bg-border/40" />
          <div className="h-12 w-full bg-border/40" />
        </div>
      </div>
    </div>
  );
}
