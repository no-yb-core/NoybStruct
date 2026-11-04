import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop",
  description: "Practice identifying design patterns through challenges.",
};

export default function WorkshopPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        The Workshop
      </p>
      <h1 className="font-heading text-4xl font-bold tracking-tight">
        Coming in Phase 3
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Pattern Detective — a programming game where you identify the pattern
        that solves each scenario — will open soon.
      </p>
    </div>
  );
}