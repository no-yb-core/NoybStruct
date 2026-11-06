"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Profile link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy profile link");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 rounded-sm border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-forest hover:bg-secondary dark:hover:border-gold shadow-xs"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-forest dark:text-emerald-400" />
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5 text-muted-foreground" />
          <span>Share Profile</span>
        </>
      )}
    </button>
  );
}
