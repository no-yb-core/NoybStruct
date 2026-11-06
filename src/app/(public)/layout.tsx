import { connection } from "next/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Suspense } from "react";


export const instant = false;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 await connection();
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

function HeaderSkeleton() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
      </div>
    </header>
  );
}