import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSubmitAttempt } from "./use-submit-attempt";

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = mockFetch;
});
afterEach(() => {
  global.fetch = originalFetch;
  mockFetch.mockReset();
});

const sample = {
  attempt: {
    id: "a1",
    attemptsCount: 1,
    correctAt: "2026-01-01T00:00:00.000Z",
  },
  isFirstCorrect: true,
  xpAwarded: true,
  xpAmount: 50,
  totalXp: 50,
  level: {
    current: "Apprentice",
    next: "Junior Developer",
    xpIntoLevel: 50,
    xpForNextLevel: 100,
    progressRatio: 0.5,
  },
};

describe("useSubmitAttempt", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useSubmitAttempt("two-sum", "arrays"));
    expect(result.current.state.status).toBe("idle");
  });

  it("POSTs and transitions to success", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => sample });
    const { result } = renderHook(() => useSubmitAttempt("two-sum", "arrays"));
    await act(async () => {
      await result.current.submit(true);
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/challenges/two-sum/attempt",
      expect.objectContaining({ method: "POST" }),
    );
    await waitFor(() => expect(result.current.state.status).toBe("success"));
  });

  it("captures API error messages", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad body" }),
    });
    const { result } = renderHook(() => useSubmitAttempt("two-sum", "arrays"));
    await act(async () => {
      await result.current.submit(true);
    });
    await waitFor(() => expect(result.current.state.status).toBe("error"));
    if (result.current.state.status === "error") {
      expect(result.current.state.message).toBe("Bad body");
    }
  });
});
