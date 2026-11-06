import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "../sign-out-button";

const navItems = [
  { href: "/library", label: "Library" },
  { href: "/workshop", label: "Workshop" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Left: logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight"
        >
          <Image
            src="/icons/logo-192.png"
            alt=""
            width={28}
            height={28}
            priority
            className="rounded"
            style={{ width: "auto", height: "auto" }}
          />
          <span>Noyb Struct</span>
        </Link>

        {/* Right: nav + auth */}
        <div className="flex items-center gap-6">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {session?.user ? (
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Profile"}
                    width={24}
                    height={24}
                    className="rounded-full ring-1 ring-border"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-muted" />
                )}
                <span className="hidden sm:inline">
                  {session.user.name?.split(" ")[0] ?? "Profile"}
                </span>
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
