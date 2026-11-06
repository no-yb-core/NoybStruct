import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Trophy } from "lucide-react";
import { InteractiveHeroDemo } from "@/components/home/interactive-hero-demo";
import { getAllPatterns } from "@/content/patterns/registry";

export const metadata: Metadata = {
  title: "A field guide to software design",
};

export default function HomePage() {
  const patterns = getAllPatterns();
  const creationalCount = patterns.filter(
    (p) => p.category === "creational",
  ).length;
  const structuralCount = patterns.filter(
    (p) => p.category === "structural",
  ).length;
  const behavioralCount = patterns.filter(
    (p) => p.category === "behavioral",
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="text-center">
        {/* Edition Stamp */}
        <div className="inline-flex items-center gap-2 rounded-xs border border-border/90 bg-secondary/70 px-3 py-1 text-xs text-muted-foreground shadow-xs">
          <span className="font-mono uppercase tracking-[0.2em] text-[11px] font-semibold text-foreground">
            Volume I
          </span>
          <span>·</span>
          <span className="font-sans text-xs">The Gang of Four Modernized</span>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.1] text-foreground">
          Software design patterns,{" "}
          <span className="italic font-serif text-forest dark:text-gold">
            mastered through lived scenarios.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          Step beyond dry class diagrams and synthetic textbook examples. Noyb
          Struct is an interactive architectural field guide: study the 23
          classical patterns in modern TypeScript, then diagnose real
          engineering tensions inside the workshop.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/workshop"
            className="group flex items-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-forest-deep hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-gold dark:text-ink"
          >
            <Compass className="size-4 transition-transform group-hover:rotate-45" />
            <span>Enter the Workshop</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/library"
            className="group flex items-center gap-2 rounded-sm border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-xs transition-all hover:border-forest hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <BookOpen className="size-4 text-muted-foreground group-hover:text-foreground" />
            <span>Open the Codex</span>
          </Link>
        </div>

        {/* Interactive Architecture Simulation */}
        <InteractiveHeroDemo />
      </section>

      {/* Three Pillars Section */}
      <section className="mt-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Curriculum
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Designed for Architectural Intuition
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Three intertwined modalities to internalize software composition:
            reference, diagnostic practice, and mastery tracking.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {/* Pillar 1: Codex */}
          <Link
            href="/library"
            className="group relative flex flex-col justify-between rounded-sm border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-md dark:hover:border-gold/60"
          >
            <div>
              <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-secondary/80 text-forest dark:text-gold">
                <BookOpen className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold group-hover:text-forest dark:group-hover:text-gold transition-colors">
                The Library (Codex)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                All 23 Gang of Four patterns cataloged with real-world problems,
                solutions, analogies, UML diagrams, and modern TypeScript
                implementations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-gold">
              <span>Browse 23 chapters</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Pillar 2: Workshop */}
          <Link
            href="/workshop"
            className="group relative flex flex-col justify-between rounded-sm border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-md dark:hover:border-gold/60"
          >
            <div>
              <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-secondary/80 text-forest dark:text-gold">
                <Compass className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold group-hover:text-forest dark:group-hover:text-gold transition-colors">
                Pattern Detective
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Analyze production scenarios, diagnose structural anti-patterns,
                and choose the optimal pattern under time and difficulty
                constraints.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-gold">
              <span>Play challenges</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Pillar 3: Progression */}
          <Link
            href="/leaderboard"
            className="group relative flex flex-col justify-between rounded-sm border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-forest hover:shadow-md dark:hover:border-gold/60"
          >
            <div>
              <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-secondary/80 text-forest dark:text-gold">
                <Trophy className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold group-hover:text-forest dark:group-hover:text-gold transition-colors">
                Ranks & Mastery
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Earn XP, unlock achievements, climb the global leaderboard, and
                verify individual pattern mastery as your architectural skill
                compounds.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-gold">
              <span>View leaderboard</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Pattern Taxonomy Showcase */}
      <section className="mt-24 border-t border-border pt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Taxonomy
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold">
              The Three Classic Families
            </h2>
          </div>
          <Link
            href="/library"
            className="text-xs font-medium text-forest dark:text-gold hover:underline"
          >
            View all in Library →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {/* Creational */}
          <div className="rounded-sm border border-border bg-secondary/20 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase text-gold">
                Creational
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {creationalCount} patterns
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Mechanisms for object instantiation that increase flexibility and
              reuse of existing code.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs font-mono">
              <li>
                <Link
                  href="/patterns/factory-method"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Factory Method
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/abstract-factory"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Abstract Factory
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/builder"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/singleton"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Singleton
                </Link>
              </li>
            </ul>
          </div>

          {/* Structural */}
          <div className="rounded-sm border border-border bg-secondary/20 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase text-forest dark:text-emerald-400">
                Structural
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {structuralCount} patterns
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Composing classes and objects into larger, robust structures while
              keeping them flexible and efficient.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs font-mono">
              <li>
                <Link
                  href="/patterns/adapter"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Adapter
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/decorator"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Decorator
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/facade"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Facade
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/composite"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Composite
                </Link>
              </li>
            </ul>
          </div>

          {/* Behavioral */}
          <div className="rounded-sm border border-border bg-secondary/20 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase text-foreground">
                Behavioral
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {behavioralCount} patterns
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Algorithms and assignment of responsibilities between disparate
              collaborating objects.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs font-mono">
              <li>
                <Link
                  href="/patterns/observer"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Observer
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/strategy"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Strategy
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/command"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • Command
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/state"
                  className="hover:text-forest dark:hover:text-gold hover:underline"
                >
                  • State
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Editorial Pullquote / Philosophy */}
      <section className="my-20 border-y border-border/80 py-12 text-center">
        <blockquote className="mx-auto max-w-2xl font-heading text-xl italic leading-relaxed text-foreground sm:text-2xl">
          &ldquo;Design patterns are not dogmatic recipes or syntax boilerplate
          — they are the hard-won collective vocabulary of engineers resolving
          recurring tensions in software systems.&rdquo;
        </blockquote>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          — Noyb Struct Colophon · Architectural Principles
        </p>
      </section>
    </div>
  );
}
