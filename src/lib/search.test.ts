import { describe, it, expect } from "vitest";
import { searchPatterns } from "./search";

describe("searchPatterns", () => {
  it("returns empty array for empty query", () => {
    expect(searchPatterns("")).toEqual([]);
    expect(searchPatterns("   ")).toEqual([]);
  });

  it("finds a pattern by name", () => {
    const results = searchPatterns("singleton");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].href).toBe("/patterns/singleton");
  });

  it("is case-insensitive", () => {
    const lower = searchPatterns("singleton");
    const upper = searchPatterns("SINGLETON");
    expect(lower.length).toBe(upper.length);
  });

  it("returns empty array for nonsense", () => {
    expect(searchPatterns("xyzzy-no-such-thing")).toEqual([]);
  });
});
