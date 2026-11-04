import type { Metadata } from "next";
import Link from "next/link";
import { getChallengesByDifficulty } from "@/content/challenges/registry";
import { difficulties, difficultyLabels } from "@/content/challenges/types";

export const metadata: Metadata = {
  title: "Workshop",
  description: "Practice identifying design patterns through challenges.",
};

export default function WorkshopPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-border pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          The Workshop
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Pattern Detective
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Read a scenario, identify the pattern that solves it, and earn XP for
          correct answers.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">
          Choose a difficulty
        </h2>
        <ul className="mt-4 space-y-3">
          {difficulties.map((d) => {
            const count = getChallengesByDifficulty(d).length;
            return (
              <li key={d}>
                <Link
                  href={`/workshop/${d}`}
                  className="group flex items-center justify-between border border-border px-4 py-3 transition-colors hover:border-forest hover:bg-secondary"
                >
                  <span className="font-heading text-lg group-hover:text-forest">
                    {difficultyLabels[d]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {count} {count === 1 ? "challenge" : "challenges"} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
