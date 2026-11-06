"use client";

import { Search } from "lucide-react";

export function SearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      }),
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hidden md:flex items-center gap-2 rounded-sm border border-border/80 bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-forest hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      aria-label="Search patterns (Press Command K)"
    >
      <Search className="size-3.5" />
      <span>Search patterns…</span>
      <kbd className="pointer-events-none rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-xs">
        ⌘K
      </kbd>
    </button>
  );
}
