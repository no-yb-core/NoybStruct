import { z } from "zod";
import { patternSlugs } from "@/content/patterns/types";
import { difficulties } from "./types";

export const challengeSchema = z
  .object({
    slug: z
      .string()
      .min(3)
      .max(80)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
    patternSlug: z.enum(patternSlugs),
    difficulty: z.enum(difficulties),
    scenario: z.string().min(40),
    problem: z.string().min(40),
    codeSnippet: z.string().min(20).nullable(),
    options: z.array(z.enum(patternSlugs)).length(4),
    explanation: z.string().min(40),
  })
  .refine((c) => new Set(c.options).size === c.options.length, {
    message: "options must be unique",
    path: ["options"],
  })
  .refine((c) => c.options.includes(c.patternSlug), {
    message: "the correct pattern must be among the options",
    path: ["options"],
  });

export type Challenge = z.infer<typeof challengeSchema>;
