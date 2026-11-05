import { signIn } from "@/lib/auth";

export function SignInButton({
  redirectTo = "/workshop",
}: {
  redirectTo?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo });
      }}
    >
      <button
        type="submit"
        className="rounded bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
      >
        Sign in with GitHub
      </button>
    </form>
  );
}
