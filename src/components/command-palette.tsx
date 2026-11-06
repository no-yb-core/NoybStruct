"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Compass, Flame, Search, Trophy, User } from "lucide-react";
import { searchPatterns } from "@/lib/search";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => searchPatterns(query), [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Palette container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-md border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false} loop>
              <div className="flex items-center border-b border-border px-4 py-3">
                <Search className="mr-3 size-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search 23 patterns, chapters, or workshop tiers…"
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              <Command.List className="max-h-96 overflow-y-auto p-2 scrollbar-none">
                <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No patterns found matching &ldquo;{query}&rdquo;.
                </Command.Empty>

                {query.trim() === "" && (
                  <>
                    <Command.Group
                      heading="Navigation"
                      className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      <Command.Item
                        value="nav-library"
                        onSelect={() => select("/library")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium">The Library</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          All 23 patterns
                        </span>
                      </Command.Item>
                      <Command.Item
                        value="nav-workshop"
                        onSelect={() => select("/workshop")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <Compass className="size-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium">The Workshop</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          Pattern Detective
                        </span>
                      </Command.Item>
                      <Command.Item
                        value="nav-leaderboard"
                        onSelect={() => select("/leaderboard")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <Trophy className="size-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium">Leaderboard</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          Top players
                        </span>
                      </Command.Item>
                      <Command.Item
                        value="nav-profile"
                        onSelect={() => select("/profile")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <User className="size-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium">My Profile</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          XP & Achievements
                        </span>
                      </Command.Item>
                    </Command.Group>

                    <Command.Group
                      heading="Workshop Tiers"
                      className="mt-2 px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      <Command.Item
                        value="tier-beginner"
                        onSelect={() => select("/workshop/beginner")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <Flame className="size-4 shrink-0 text-forest" />
                        <span className="font-medium">Beginner Workshop</span>
                        <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          50 XP
                        </span>
                      </Command.Item>
                      <Command.Item
                        value="tier-intermediate"
                        onSelect={() => select("/workshop/intermediate")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <Flame className="size-4 shrink-0 text-gold" />
                        <span className="font-medium">
                          Intermediate Workshop
                        </span>
                        <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          100 XP
                        </span>
                      </Command.Item>
                      <Command.Item
                        value="tier-advanced"
                        onSelect={() => select("/workshop/advanced")}
                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-secondary data-[selected=true]:text-forest dark:data-[selected=true]:text-gold"
                      >
                        <Flame className="size-4 shrink-0 text-destructive" />
                        <span className="font-medium">Advanced Workshop</span>
                        <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          150 XP
                        </span>
                      </Command.Item>
                    </Command.Group>
                  </>
                )}

                {query.trim() !== "" && (
                  <Command.Group
                    heading={`Patterns (${results.length})`}
                    className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                  >
                    {results.map((r) => (
                      <Command.Item
                        key={r.slug}
                        value={r.slug}
                        onSelect={() => select(r.href)}
                        className="flex cursor-pointer flex-col gap-0.5 rounded-sm px-3 py-2.5 text-sm transition-colors data-[selected=true]:bg-secondary"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-semibold text-foreground group-data-[selected=true]:text-forest">
                            {r.title}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {r.description}
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>

              {/* Footer info bar */}
              <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-4 py-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Navigate</span>
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                    ↑
                  </kbd>
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                    ↓
                  </kbd>
                  <span className="ml-1">Select</span>
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                    ↵
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Close</span>
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                    esc
                  </kbd>
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
