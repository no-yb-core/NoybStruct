import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  // Database sessions — the `sessions` table already exists in your schema
  session: { strategy: "database" },
  // Required outside Vercel / when AUTH_URL isn't set
  trustHost: true,
  providers: [
    // Auth.js v5 auto-reads AUTH_GITHUB_ID / AUTH_GITHUB_SECRET from env
    GitHub,
  ],
  callbacks: {
    session({ session, user }) {
      // Database strategy gives us the DB user directly — no JWT hop needed
      session.user.id = user.id;
      return session;
    },
  },
});
