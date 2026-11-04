import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("ignores falsy values", () => {
    expect(cn("px-2", false, undefined, null, "text-sm")).toBe("px-2 text-sm");
  });

  // DIAGNOSTIC: Tailwind conflict resolution.
  // If this fails, cn@0.5.2 is a plain classnames helper (no dedupe),
  // and Commit 2 will replace it with clsx + tailwind-merge.
  it("resolves conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
