import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { assertTestDatabase, resetDatabase } from "@/test/db-utils";

beforeAll(assertTestDatabase);
beforeEach(async () => {
  await resetDatabase();
  await prisma.user.create({
    data: {
      id: "00000000-0000-0000-0000-000000000001",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});
afterAll(async () => prisma.$disconnect());

function makeReq(
  body: unknown,
  userId = "00000000-0000-0000-0000-000000000001",
) {
  return new NextRequest("http://localhost/api/challenges/two-sum/attempt", {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-id": userId },
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
    expect(json.totalXp).toBe(50);
    expect(json.level.current).toBe("Apprentice");
    expect(json.level.progressRatio).toBe(0.5);
  });

  it("returns 400 on invalid body", async () => {
    const res = await POST(makeReq({ isCorrect: "yes" }), {
      params: Promise.resolve({ slug: "two-sum" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 401 without x-user-id", async () => {
    const req = new NextRequest(
      "http://localhost/api/challenges/two-sum/attempt",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isCorrect: true, patternSlug: "arrays" }),
      },
    );
    const res = await POST(req, {
      params: Promise.resolve({ slug: "two-sum" }),
    });
    expect(res.status).toBe(401);
  });
});
