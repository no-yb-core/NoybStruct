import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-24">
      <h1 className="text-2xl font-semibold">Sign in to Design Craft</h1>
      <p className="text-sm text-neutral-600">
        Progress, XP, and achievements are tied to your account.
      </p>
      <Suspense fallback={<SignInSkeleton />}>
        <LoginGate />
      </Suspense>
    </div>
  );
}

async function LoginGate() {
  const session = await auth();
  if (session?.user) redirect("/workshop");
  return <SignInButton />;
}

function SignInSkeleton() {
  return <div className="h-10 w-44 animate-pulse rounded bg-neutral-200" />;
}
