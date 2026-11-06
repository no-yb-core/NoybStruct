import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "../sign-out-button";
import { NavLinks } from "./nav-links";
import { SearchTrigger } from "./search-trigger";
import { ThemeToggle } from "../theme-toggle";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        {/* Left: Brand mark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="relative flex size-7 items-center justify-center overflow-hidden rounded-sm ring-1 ring-border/80 transition-transform group-hover:scale-105">
            <Image
              src="/icons/logo-192.png"
              alt="Noyb Struct logo"
              width={28}
              height={28}
              priority
              className="rounded-sm object-cover"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
            Noyb Struct
          </span>
          <span className="hidden sm:inline-block rounded-xs border border-border/80 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Vol. I
          </span>
        </Link>

        {/* Center: Search trigger */}
        <div className="hidden md:block">
          <SearchTrigger />
        </div>

        {/* Right: nav + theme + auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NavLinks />

          <div className="flex items-center gap-2 pl-2 border-l border-border/70">
            <ThemeToggle />

            {session?.user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/profile"
                  className="group flex items-center gap-2 rounded-sm border border-border/80 bg-secondary/40 px-2 py-1 text-sm text-foreground transition-all hover:border-forest hover:bg-secondary"
                  title="Your Profile & XP"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "Profile"}
                      width={22}
                      height={22}
                      className="rounded-full ring-1 ring-border"
                    />
                  ) : (
                    <div className="size-5 rounded-full bg-forest text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {session.user.name?.[0] ?? "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium">
                    {session.user.name?.split(" ")[0] ?? "Profile"}
                  </span>
                </Link>
                <SignOutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-sm bg-forest px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
