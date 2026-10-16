// Only case studies that are safe to show: not marked `draft: true` and with no
// "[CLIENT NAME]", "[NUMBER]", "[SCREENSHOT: ...]" style placeholders left in visible text.
import { getCollection, type CollectionEntry } from "astro:content";

const PLACEHOLDER = /\[[A-Z][^\]\n]*\](?!\()/;

export function hasPlaceholder(e: CollectionEntry<"case-studies">): boolean {
  const d = e.data;
  const visible: unknown[] = [d.title, d.summary, d.client, d.stats, d.problem, d.steps, d.result, d.tools, e.body ?? ""];
  if (!d.heroImage) visible.push(d.heroPlaceholder);
  if (!d.video) visible.push(d.videoPlaceholder);
  if (!d.before.image) visible.push(d.before.placeholder);
  if (!d.after.image) visible.push(d.after.placeholder);
  return PLACEHOLDER.test(JSON.stringify(visible));
}

export async function getPublishedCaseStudies() {
  return (await getCollection("case-studies", (e) => !e.data.draft && !hasPlaceholder(e)))
    .sort((a, b) => a.data.order - b.data.order);
}
