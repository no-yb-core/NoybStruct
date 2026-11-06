"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function getThemeSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  const observer = new MutationObserver(() => callback());
  if (typeof document !== "undefined") {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

export function ThemeToggle() {
  const mounted = useMounted();
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "light",
  );

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("noyb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("noyb-theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="size-8 rounded-sm border border-border/60 bg-secondary/50" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark (Lamp-lit study)" : "light (Daylight library)"} theme`}
      className="relative flex size-8 items-center justify-center rounded-sm border border-border/80 bg-secondary/60 text-muted-foreground transition-colors hover:border-forest hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      title={
        theme === "light"
          ? "Switch to Lamp-lit study (Dark)"
          : "Switch to Daylight library (Light)"
      }
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.7, rotate: -25, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.7, rotate: 25, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {theme === "light" ? (
          <Moon className="size-4 text-forest" />
        ) : (
          <Sun className="size-4 text-gold" />
        )}
      </motion.div>
    </button>
  );
}
