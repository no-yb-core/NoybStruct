"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

type CodeSnippetProps = {
  code: string;
  language?: string;
  filename?: string;
};

export function CodeSnippet({
  code,
  language = "TypeScript",
  filename = "solution.ts",
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Snippet copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="relative mt-4 overflow-hidden rounded-md border border-border bg-secondary/50 font-mono text-xs shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/80 px-4 py-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-forest dark:bg-gold opacity-75" />
          <span className="font-medium text-foreground">{filename}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/60">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
            className="flex items-center gap-1 rounded border border-border/80 bg-background/80 px-2 py-0.5 text-[11px] font-sans text-muted-foreground transition-all hover:border-forest hover:bg-background hover:text-foreground dark:hover:border-gold"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto p-4 leading-relaxed text-foreground scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
