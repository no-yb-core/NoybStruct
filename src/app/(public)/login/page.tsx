import { Suspense } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20 sm:py-28">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Return to home</span>
      </Link>

      <div className="rounded-md border border-border bg-card p-8 shadow-lg">
        {/* Brand Stamp */}
        <div className="flex items-center gap-3">
          <div className="size-8 overflow-hidden rounded-sm ring-1 ring-border">
            <Image
              src="/icons/logo-192.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Sign in to Noyb Struct
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Software Architecture Field Guide
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Sign in with your GitHub account to preserve challenge progress, track
          lifetime XP, unlock achievements, and climb the public leaderboard.
        </p>

        <div className="mt-6 border-t border-border/80 pt-6">
          <Suspense fallback={<SignInSkeleton />}>
            <LoginGate />
          </Suspense>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-forest dark:text-gold" />
          <span>Read-only GitHub OAuth. No code access requested.</span>
        </div>
      </div>
    </div>
  );
}

async function LoginGate() {
  const session = await auth();
  if (session?.user) redirect("/workshop");
  return <SignInButton />;
}

function SignInSkeleton() {
  return <div className="h-10 w-full animate-pulse rounded bg-secondary" />;
}
