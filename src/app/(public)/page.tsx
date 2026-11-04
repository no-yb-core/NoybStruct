import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A field guide to software design",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <section className="text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Volume I
        </p>
        <h1 className="font-heading text-5xl font-bold tracking-tight">
          Design Codex
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          An interactive book for learning the 23 Gang of Four design patterns —
          read them, practice them, master them.
        </p>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <Link
          href="/library"
          className="group block rounded-sm border border-border p-6 transition-colors hover:border-forest hover:bg-secondary"
        >
          <h2 className="font-heading text-xl font-semibold">The Library</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Read the full Codex — every pattern explained with TypeScript
            examples.
          </p>
          <span className="mt-4 inline-block text-sm text-forest group-hover:underline">
            Open the book →
          </span>
        </Link>

        <Link
          href="/workshop"
          className="group block rounded-sm border border-border p-6 transition-colors hover:border-forest hover:bg-secondary"
        >
          <h2 className="font-heading text-xl font-semibold">The Workshop</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pattern Detective — identify the pattern that solves each scenario.
          </p>
          <span className="mt-4 inline-block text-sm text-forest group-hover:underline">
            Enter the workshop →
          </span>
        </Link>
      </section>
    </div>
  );
}