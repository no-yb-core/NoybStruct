import { auth } from "@/lib/auth";

export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Response("Unauthenticated", { status: 401 });
  }
  return session.user.id;
}
