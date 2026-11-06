// Uses 'motion' (formerly framer-motion) for hardware-accelerated spring animations, layout transitions, and micro-interactions across the UI.
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
