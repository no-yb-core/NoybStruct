// src/app/api/challenges/[slug]/attempt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/auth";
import { recordChallengeAttempt } from "@/lib/db/attempts";
import { getUserXp } from "@/lib/db/xp";

const bodySchema = z.object({
  isCorrect: z.boolean(),
  patternSlug: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const userId = getCurrentUserId(req);
    const { slug } = await params;
    const body = bodySchema.parse(await req.json());

    const result = await recordChallengeAttempt({
      userId,
      challengeSlug: slug,
      patternSlug: body.patternSlug,
      isCorrect: body.isCorrect,
    });

    const { totalXp, level } = await getUserXp(userId);

    return NextResponse.json({
      attempt: result.attempt,
      isFirstCorrect: result.isFirstCorrect,
      xpAwarded: result.xpAwarded,
      xpAmount: result.xpAmount,
      totalXp,
      level,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("POST /api/challenges/[slug]/attempt failed", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
