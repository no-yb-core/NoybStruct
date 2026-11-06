import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  XCircle,
} from "lucide-react";
import { PatternDiagram } from "@/components/patterns/pattern-diagram";
import { CodeSnippet } from "@/components/patterns/code-snippet";
import { getAllPatterns, getPattern } from "@/content/patterns/registry";
import type { PatternSlug } from "@/content/patterns/types";
import { patternSlugs } from "@/content/patterns/types";

type PageProps = { params: Promise<{ slug: string }> };

// This route must block: the slug is required before anything can render.
// See https://nextjs.org/docs/messages/instant-shell-url-data
export const instant = false;

function isPatternSlug(value: string): value is PatternSlug {
  return (patternSlugs as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return getAllPatterns().map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isPatternSlug(slug)) return { title: "Pattern not found" };
  const pattern = getPattern(slug);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: pattern.name,
    description: pattern.tagline,
  };
}

export default async function PatternPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isPatternSlug(slug)) notFound();
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const all = getAllPatterns();
  const idx = all.findIndex((p) => p.slug === pattern.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* Top Breadcrumb & Chapter Nav */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4 text-xs text-muted-foreground">
        <Link
          href="/library"
          className="group flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Codex</span>
        </Link>
        <div className="flex items-center gap-2 font-mono">
          <span>
            CHAPTER {idx + 1} OF {all.length}
          </span>
          <span>·</span>
          <span className="uppercase text-forest dark:text-gold font-semibold">
            {pattern.category}
          </span>
        </div>
      </div>

      {/* Chapter Title & Tagline */}
      <header className="pt-8 pb-8">
        <div className="inline-block rounded-xs border border-border/80 bg-secondary/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {pattern.category} Pattern
        </div>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {pattern.name}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground sm:text-xl font-serif italic">
          &ldquo;{pattern.tagline}&rdquo;
        </p>
      </header>

      {/* Introduction */}
      <section className="prose prose-neutral dark:prose-invert max-w-none border-t border-border/80 pt-8 text-base leading-relaxed text-foreground/90">
        <p>{pattern.introduction}</p>
      </section>

      {/* Problem & Solution Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {/* The Problem */}
        <section className="rounded-sm border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <span className="size-2 rounded-full bg-rose-500" />
            <h2 className="font-heading text-xl font-bold text-foreground">
              The Architectural Problem
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {pattern.problem}
          </p>
        </section>

        {/* The Solution */}
        <section className="rounded-sm border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-forest dark:text-gold">
            <span className="size-2 rounded-full bg-forest dark:bg-gold" />
            <h2 className="font-heading text-xl font-bold text-foreground">
              The Pattern Solution
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {pattern.solution}
          </p>
        </section>
      </div>

      {/* Real-World Analogy */}
      <section className="mt-10 rounded-sm border border-border/80 bg-secondary/30 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-gold" />
          <h2 className="font-heading text-lg font-bold text-foreground">
            Conceptual Analogy
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic font-serif">
          {pattern.analogy}
        </p>
      </section>

      {/* When to use vs When not to use */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <section className="rounded-sm border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              When to apply it
            </h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
            {pattern.whenToUse.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-sm border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <XCircle className="size-4" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              When not to apply it
            </h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
            {pattern.whenNotToUse.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Structural Diagram */}
      <section className="mt-14">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Structural Architecture
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Formal schematic representation of classes, interfaces, and
          collaborating actors.
        </p>
        <PatternDiagram
          content={pattern.diagram.content}
          description={pattern.diagram.description}
        />
      </section>

      {/* Code Implementation */}
      <section className="mt-14">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          TypeScript Implementation
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Idiomatic implementation showing encapsulation, polymorphy, and type
          safety.
        </p>
        <CodeSnippet
          code={pattern.example.code}
          language="TypeScript"
          filename={`${pattern.slug}.ts`}
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {pattern.example.explanation}
        </p>
      </section>

      {/* Trade-offs: Advantages & Disadvantages */}
      <section className="mt-14">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Engineering Trade-offs
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Advantages */}
          <div className="rounded-sm border border-forest/30 bg-forest/5 dark:border-forest/40 p-5">
            <h3 className="font-heading text-base font-bold text-forest dark:text-emerald-400">
              Advantages
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
              {pattern.advantages.map((adv) => (
                <li key={adv} className="flex items-start gap-2">
                  <span className="text-forest dark:text-emerald-400 font-bold">
                    ✓
                  </span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disadvantages */}
          <div className="rounded-sm border border-border bg-secondary/30 p-5">
            <h3 className="font-heading text-base font-bold text-foreground">
              Disadvantages & Pitfalls
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
              {pattern.disadvantages.map((dis) => (
                <li key={dis} className="flex items-start gap-2">
                  <span className="text-muted-foreground font-bold">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related Patterns */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Related Patterns
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pattern.related.map((rel) => {
            const linked = getPattern(rel.slug);
            return (
              <div
                key={rel.slug}
                className="rounded-sm border border-border bg-card p-4 transition-all hover:border-forest/60 dark:hover:border-gold/60"
              >
                <div className="font-medium text-sm">
                  {linked ? (
                    <Link
                      href={`/patterns/${linked.slug}`}
                      className="font-heading font-semibold text-forest dark:text-gold hover:underline inline-flex items-center gap-1"
                    >
                      <span>{linked.name}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  ) : (
                    <span>{rel.slug}</span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {rel.note}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA to Workshop */}
      <section className="mt-14 rounded-md border border-forest/30 bg-gradient-to-r from-forest/10 via-forest/5 to-transparent dark:border-gold/30 dark:from-gold/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Test your knowledge of {pattern.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Put your architectural intuition to the test inside the Pattern
            Detective workshop.
          </p>
        </div>
        <Link
          href="/workshop"
          className="shrink-0 rounded-sm bg-forest px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-forest-deep dark:bg-gold dark:text-ink flex items-center gap-1.5"
        >
          <Compass className="size-3.5" />
          <span>Enter Workshop</span>
        </Link>
      </section>

      {/* Chapter Bottom Navigation */}
      <nav
        aria-label="Pattern navigation"
        className="mt-12 grid grid-cols-2 gap-4 border-t border-border/80 pt-6 text-sm"
      >
        <div>
          {prev ? (
            <Link
              href={`/patterns/${prev.slug}`}
              className="group block rounded-sm border border-border bg-card p-4 transition-all hover:border-forest hover:shadow-xs"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-forest">
                <ArrowLeft className="size-3" /> Previous chapter
              </span>
              <p className="mt-1 font-heading font-bold text-foreground group-hover:text-forest">
                {prev.name}
              </p>
            </Link>
          ) : (
            <div className="p-4 text-xs italic text-muted-foreground">
              Beginning of the Codex
            </div>
          )}
        </div>

        <div className="text-right">
          {next ? (
            <Link
              href={`/patterns/${next.slug}`}
              className="group block rounded-sm border border-border bg-card p-4 transition-all hover:border-forest hover:shadow-xs"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground group-hover:text-forest">
                Next chapter <ArrowRight className="size-3" />
              </span>
              <p className="mt-1 font-heading font-bold text-foreground group-hover:text-forest">
                {next.name}
              </p>
            </Link>
          ) : (
            <div className="p-4 text-xs italic text-muted-foreground">
              End of the Codex
            </div>
          )}
        </div>
      </nav>
    </article>
  );
}
