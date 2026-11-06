"use client";

import { toast } from "sonner";

export function ShareButton({ url }: { url: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
    >
      Share profile
    </button>
  );
}
