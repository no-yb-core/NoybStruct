// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("database client", () => {
  const originalUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalUrl;
  });

  it("throws a clear error when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    await expect(import("./client")).rejects.toThrow(/DATABASE_URL is not set/);
  });
});
