// src/lib/auth.ts (new)
import { z } from "zod";

/**
 * Stub until Auth.js is wired.
 * Replace with: const session = await auth(); return session?.user?.id
 */
export function getCurrentUserId(req: Request): string {
  const header = req.headers.get("x-user-id");
  const parsed = z.string().uuid().safeParse(header);
  if (!parsed.success) {
    throw new Response("Unauthenticated", { status: 401 });
  }
  return parsed.data;
}
