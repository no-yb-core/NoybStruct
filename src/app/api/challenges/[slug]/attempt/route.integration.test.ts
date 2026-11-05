import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertTestDatabase, resetDatabase } from "@/test/db-utils";

// 👇 mock the session module BEFORE importing the route
const mockUserId = "00000000-0000-0000-0000-000000000001";
vi.mock("@/lib/session", () => ({
  getCurrentUserId: vi.fn(async () => mockUserId),
}));

import { POST } from "./route";

beforeAll(assertTestDatabase);
beforeEach(async () => {
  await resetDatabase();
  await prisma.user.create({
    data: { id: mockUserId, createdAt: new Date(), updatedAt: new Date() },
  });
});
afterAll(async () => prisma.$disconnect());

function makeReq(body: unknown) {
  return new NextRequest("http://localhost/api/challenges/two-sum/attempt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/challenges/[slug]/attempt", () => {
  it("returns updated XP and level on first-try correct", async () => {
    const res = await POST(
      makeReq({ isCorrect: true, patternSlug: "arrays" }),
      {
        params: Promise.resolve({ slug: "two-sum" }),
      },
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.xpAwarded).toBe(true);
    expect(json.xpAmount).toBe(50);
  });

  it("returns 400 on invalid body", async () => {
    const res = await POST(makeReq({ isCorrect: "yes" }), {
      params: Promise.resolve({ slug: "two-sum" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 401 when no session", async () => {
    const { getCurrentUserId } = await import("@/lib/session");
    vi.mocked(getCurrentUserId).mockRejectedValueOnce(
      new Response("Unauthenticated", { status: 401 }),
    );
    const res = await POST(
      makeReq({ isCorrect: true, patternSlug: "arrays" }),
      {
        params: Promise.resolve({ slug: "two-sum" }),
      },
    );
    expect(res.status).toBe(401);
  });
});
