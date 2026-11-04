import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PatternDiagram } from "@/components/patterns/pattern-diagram";
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
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-border pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {pattern.category}
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          {pattern.name}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{pattern.tagline}</p>
      </header>

      <section className="mt-8">
        <p>{pattern.introduction}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">The problem</h2>
        <p className="mt-3">{pattern.problem}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">The solution</h2>
        <p className="mt-3">{pattern.solution}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">When to use it</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          {pattern.whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">
          When not to use it
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          {pattern.whenNotToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Analogy</h2>
        <p className="mt-3">{pattern.analogy}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Diagram</h2>
        <PatternDiagram
          content={pattern.diagram.content}
          description={pattern.diagram.description}
        />
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Implementation</h2>
        <pre className="mt-3 overflow-x-auto border border-border bg-secondary/40 p-4 font-mono text-sm">
          <code>{pattern.example.code}</code>
        </pre>
        <p className="mt-4">{pattern.example.explanation}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Advantages</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          {pattern.advantages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Disadvantages</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          {pattern.disadvantages.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">
          Related patterns
        </h2>
        <ul className="mt-3 space-y-2">
          {pattern.related.map((rel) => {
            const linked = getPattern(rel.slug);
            return (
              <li key={rel.slug}>
                <span className="font-semibold">
                  {linked ? (
                    <Link
                      href={`/patterns/${linked.slug}`}
                      className="hover:underline"
                    >
                      {linked.name}
                    </Link>
                  ) : (
                    rel.slug
                  )}
                </span>
                {" — "}
                <span className="text-muted-foreground">{rel.note}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <nav
        aria-label="Pattern navigation"
        className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm"
      >
        {prev ? (
          <Link
            href={`/patterns/${prev.slug}`}
            className="text-forest hover:underline"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">Beginning of the book</span>
        )}
        {next ? (
          <Link
            href={`/patterns/${next.slug}`}
            className="text-forest hover:underline"
          >
            {next.name} →
          </Link>
        ) : (
          <span className="text-muted-foreground">End of the book</span>
        )}
      </nav>
    </article>
  );
}
