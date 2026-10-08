/**
 * KnowledgeQuickViewModal.tsx
 *
 * Radix Dialog-based Quick View for an article. Opens when the user clicks
 * the "Quick View" button on a card; closes on Esc, overlay click, or the
 * explicit close button. Renders the article summary + a content preview
 * + a "Talk to an Engineer" CTA.
 *
 * Why a Radix Dialog (not a hand-rolled <dialog>):
 *   - Built-in focus trap and Esc-to-close
 *   - Server-renderable (Radix handles the client-only mount internally)
 *   - aria-modal + aria-labelledby applied automatically
 */
import * as Dialog from '@radix-ui/react-dialog';
import type { KnowledgeArticle } from './knowledge-data';
import {
  GRADE_LABELS,
  PROCESS_LABELS,
  STANDARD_LABELS,
  INDUSTRY_LABELS,
} from './knowledge-data';

interface Props {
  article: KnowledgeArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strings: {
    readonly closeLabel: string;
    readonly readFullLabel: string;
    readonly ctaLabel: string;
    readonly ctaHref: string;
    readonly gradeLabel: string;
    readonly processLabel: string;
    readonly standardLabel: string;
    readonly industryLabel: string;
    readonly readTimeLabel: string;     // "{n} min read"
    readonly updatedLabel: string;
  };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function KnowledgeQuickViewModal({ article, open, onOpenChange, strings }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          style={{ backgroundColor: 'color-mix(in srgb, black 60%, transparent)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 md:p-8"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
          }}
        >
          {article && (
            <>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title
                    className="text-xl font-bold leading-tight md:text-2xl"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {article.title}
                  </Dialog.Title>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}
                  >
                    {article.summary}
                  </p>
                </div>
                <Dialog.Close
                  aria-label={strings.closeLabel}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--theme-text) 5%, transparent)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </Dialog.Close>
              </div>

              {/* Meta line */}
              <div
                className="mb-5 flex flex-wrap items-center gap-3 border-b pb-4 text-xs"
                style={{
                  color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                }}
              >
                <span>
                  {strings.updatedLabel} {formatDate(article.updatedAt)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{strings.readTimeLabel.replace('{n}', String(article.readTimeMinutes))}</span>
                {article.primaryStandard && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span
                      className="inline-flex items-center gap-1 font-semibold"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12c0 5-3.5 7.5-9 9-5.5-1.5-9-4-9-9V5l9-3 9 3z" />
                      </svg>
                      {STANDARD_LABELS[article.primaryStandard]}
                    </span>
                  </>
                )}
              </div>

              {/* Body preview (first 1200 chars of sanitized HTML) */}
              <Dialog.Description asChild>
                <div
                  className="prose prose-sm max-w-none leading-relaxed"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 80%, transparent)' }}
                  dangerouslySetInnerHTML={{ __html: article.bodyHtml.slice(0, 1200) }}
                />
              </Dialog.Description>

              {/* Tag matrix */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {article.gradeTags.length > 0 && (
                  <FacetColumn
                    title={strings.gradeLabel}
                    items={article.gradeTags.map((g) => GRADE_LABELS[g])}
                  />
                )}
                {article.processTags.length > 0 && (
                  <FacetColumn
                    title={strings.processLabel}
                    items={article.processTags.map((p) => PROCESS_LABELS[p])}
                  />
                )}
                {article.standardTags.length > 0 && (
                  <FacetColumn
                    title={strings.standardLabel}
                    items={article.standardTags.map((s) => STANDARD_LABELS[s])}
                  />
                )}
                {article.industryTags.length > 0 && (
                  <FacetColumn
                    title={strings.industryLabel}
                    items={article.industryTags.map((i) => INDUSTRY_LABELS[i])}
                  />
                )}
              </div>

              {/* Footer CTAs */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
                style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)' }}
              >
                <a
                  href={`/blog/${article.slug}/`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                  style={{ color: 'var(--theme-primary)' }}
                >
                  {strings.readFullLabel} →
                </a>
                <a
                  href={strings.ctaHref}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: 'var(--theme-primary)',
                    color: 'var(--theme-bg)',
                  }}
                >
                  {strings.ctaLabel}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FacetColumn({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h4
        className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
      >
        {title}
      </h4>
      <ul className="space-y-0.5 text-sm" style={{ color: 'var(--theme-text)' }}>
        {items.map((it) => (
          <li key={it}>· {it}</li>
        ))}
      </ul>
    </div>
  );
}
