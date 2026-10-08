/**
 * FAQJsonLd.tsx
 *
 * Schema.org FAQPage payload preparation. The actual JSON-LD `<script>` is
 * emitted by `BaseLayout.faqItems` (which delegates to
 * `src/lib/schema.ts → buildFaqPage()`). This module is the data-transformation
 * step that bridges the rich `FaqEntry` model to the schema-friendly
 * `{ question, answer }` pair expected by `BaseLayout.faqItems`.
 *
 * Why a dedicated module (and not an inline arrow in FaqPage.astro):
 *   - Centralizes the `stripHtml` policy (HTML must be stripped for
 *     schema.org Answer.text per Google's structured-data spec).
 *   - Co-locates the `inLanguage` + canonical URL derivation, so the only
 *     place that knows how to build a schema FAQ item is here.
 *   - Single import surface for any test that needs to verify the JSON-LD
 *     payload round-trips correctly.
 *
 * This module deliberately does NOT render any DOM / `<script>` element.
 * Adding inline JSON-LD here would violate SOP §F4 ("Inline JSON-LD blocks
 * instead of BaseLayout props — schema authority lives in src/lib/schema.ts").
 */
import type { FaqItem } from '../lib/schema';
import type { FaqEntry } from './faq-data';
import { stripHtml } from '../../utils/strip-html';

export interface FaqJsonLdInput {
  readonly entries: readonly FaqEntry[];
  /** Absolute page URL — used as the `mainEntity` parent context. */
  readonly pageUrl: string;
  /** IETF BCP-47 language tag, e.g. "en-US". */
  readonly inLanguage?: string;
}

/**
 * Convert rich FAQ entries into the schema-friendly shape BaseLayout expects.
 * HTML is stripped from the answer text — Google's structured-data spec
 * (2024+) accepts only plain text inside `acceptedAnswer.text`.
 */
export function toSchemaFaqItems(entries: readonly FaqEntry[]): readonly FaqItem[] {
  return entries.map((e) => ({
    question: e.question,
    answer: stripHtml(e.answerHtml),
  }));
}

/**
 * Build the full page-level FAQPage JSON-LD payload. Currently a passthrough
 * over `toSchemaFaqItems` because `BaseLayout` already wraps the array in
 * the proper `@graph` envelope. Exposed as a separate helper so callers (e.g.
 * supplementary schema outputs, test fixtures) can verify the payload
 * without re-implementing the stripHtml logic.
 */
export function buildFaqJsonLdPayload(input: FaqJsonLdInput): {
  readonly pageUrl: string;
  readonly inLanguage: string;
  readonly faqItems: readonly FaqItem[];
} {
  return {
    pageUrl: input.pageUrl,
    inLanguage: input.inLanguage ?? 'en-US',
    faqItems: toSchemaFaqItems(input.entries),
  };
}