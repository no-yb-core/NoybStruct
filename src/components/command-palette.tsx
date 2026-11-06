"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { searchPatterns, type SearchResult } from "@/lib/search";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    setResults(searchPatterns(query));
  }, [query]);

  const select = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-32"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-lg border bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false}>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search patterns…"
            className="w-full border-b bg-transparent px-4 py-3 text-sm outline-none"
            autoFocus
          />
          <Command.List className="max-h-80 overflow-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results.
            </Command.Empty>
            {results.map((r) => (
              <Command.Item
                key={r.slug}
                value={r.slug}
                onSelect={() => select(r.href)}
                className="flex cursor-pointer flex-col rounded px-3 py-2 text-sm data-[selected=true]:bg-muted"
              >
                <span className="font-medium">{r.title}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {r.description}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
