// Uses 'canvas-confetti' for lightweight celebratory particle bursts on workshop completion and achievement unlocks.
import confetti from "canvas-confetti";

export function fireCelebrationConfetti() {
  if (typeof window === "undefined") return;
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.65 },
      colors: ["#2d5a3f", "#c89d38", "#d4af37", "#1e3d2b", "#e2c068"],
      ticks: 200,
      gravity: 1.1,
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.65 },
      colors: ["#2d5a3f", "#c89d38", "#d4af37", "#1e3d2b", "#e2c068"],
      ticks: 200,
      gravity: 1.1,
    });
  } catch {
    // Graceful fallback if canvas is not supported in the environment
  }
}
