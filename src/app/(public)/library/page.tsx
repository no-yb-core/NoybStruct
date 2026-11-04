import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse the 23 Gang of Four design patterns.",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        The Library
      </p>
      <h1 className="font-heading text-4xl font-bold tracking-tight">
        Coming in Phase 2
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        The full Codex — all 23 patterns with explanations, diagrams, and
        TypeScript examples — will be bound here soon.
      </p>
    </div>
  );
}