"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/navigation/transition-link";

const navItems = [
  { href: "/library", label: "Library" },
  { href: "/workshop", label: "Workshop" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                className={`relative rounded-sm px-3 py-1.5 transition-colors ${
                  isActive
                    ? "text-foreground font-semibold bg-secondary/80 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-forest dark:bg-gold" />
                )}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
