"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick?.(e);

    // If default was prevented or modifier keys were pressed, let native browser behavior take over
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey
    ) {
      return;
    }

    const hrefStr = typeof href === "string" ? href : (href.pathname ?? "");
    const isInternal = hrefStr.startsWith("/") && !hrefStr.startsWith("//");

    // Check if View Transitions API is supported and reduced motion is NOT preferred
    if (
      isInternal &&
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      (typeof window.matchMedia !== "function" ||
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).startViewTransition(() => {
        router.push(hrefStr);
      });
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
