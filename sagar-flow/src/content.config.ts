// Case study format. Every .md file in src/content/case-studies becomes a page.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const categories = ["noon", "amazon", "ads", "website", "automation"] as const;

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string(),
    category: z.enum(categories),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false), // true = hidden from the site
    stats: z.array(z.object({ value: z.string(), label: z.string() })).length(3),
    heroImage: z.string().optional(), // path in /public, e.g. "/case-studies/noon-hero.webp"
    heroPlaceholder: z.string().default("[SCREENSHOT: main result]"),
    problem: z.string(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
    video: z.string().optional(), // YouTube or Loom link
    videoPlaceholder: z.string().default("[VIDEO: walkthrough]"),
    before: z.object({ image: z.string().optional(), placeholder: z.string() }),
    after: z.object({ image: z.string().optional(), placeholder: z.string() }),
    result: z.string(),
    tools: z.array(z.string()),
  }),
});

export const collections = { "case-studies": caseStudies };
