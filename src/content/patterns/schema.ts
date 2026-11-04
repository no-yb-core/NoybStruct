import { z } from "zod";
import { patternCategories, patternSlugs } from "./types";

const relatedPatternSchema = z.object({
  slug: z.enum(patternSlugs),
  note: z.string().min(1),
});

export const patternSchema = z.object({
  slug: z.enum(patternSlugs),
  name: z.string().min(1),
  category: z.enum(patternCategories),
  tagline: z.string().min(1).max(160),
  introduction: z.string().min(40),
  problem: z.string().min(40),
  solution: z.string().min(40),
  whenToUse: z.array(z.string().min(1)).min(1),
  whenNotToUse: z.array(z.string().min(1)).min(1),
  analogy: z.string().min(20),
  diagram: z.object({
    content: z.string().min(10),
    description: z.string().min(10),
  }),
  example: z.object({
    language: z.literal("ts"),
    code: z.string().min(40),
    explanation: z.string().min(40),
  }),
  advantages: z.array(z.string().min(1)).min(1),
  disadvantages: z.array(z.string().min(1)).min(1),
  related: z.array(relatedPatternSchema),
});

export type Pattern = z.infer<typeof patternSchema>;
export type RelatedPattern = z.infer<typeof relatedPatternSchema>;
