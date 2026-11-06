import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background/50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1: Identity */}
          <div className="space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                Noyb Struct
              </span>
              <span className="rounded-xs border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Edition 2026
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              A comprehensive field guide to the 23 Gang of Four software design
              patterns. Read chapters, inspect TypeScript architectures, and
              hone intuition through realistic engineering challenges.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                23 Patterns Cataloged
              </span>
              <span>·</span>
              <span>3 Workshop Tiers</span>
            </div>
          </div>

          {/* Col 2: The Library */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              The Library
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/library"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  All 23 Chapters
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/strategy"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Strategy Pattern
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/observer"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Observer Pattern
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/factory-method"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Factory Method
                </Link>
              </li>
              <li>
                <Link
                  href="/patterns/adapter"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Adapter Pattern
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: The Workshop */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              The Workshop
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/workshop"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Pattern Detective
                </Link>
              </li>
              <li>
                <Link
                  href="/workshop/beginner"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Beginner Tier (50 XP)
                </Link>
              </li>
              <li>
                <Link
                  href="/workshop/intermediate"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Intermediate Tier (100 XP)
                </Link>
              </li>
              <li>
                <Link
                  href="/workshop/advanced"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Advanced Tier (150 XP)
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with keyboard shortcuts & colophon */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row text-xs text-muted-foreground">
          <p>
            Crafted for engineers who value architectural elegance. Open
            reference & exercises.
          </p>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline">Shortcuts:</span>
            <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              ⌘K
            </kbd>
            <span className="hidden md:inline text-[11px]">search</span>
            <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              1-4
            </kbd>
            <span className="hidden md:inline text-[11px]">workshop</span>
            <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              Esc
            </kbd>
            <span className="hidden md:inline text-[11px]">close</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
