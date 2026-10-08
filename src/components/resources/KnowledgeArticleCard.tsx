/**
 * KnowledgeArticleCard.tsx
 *
 * One article card, in either 'grid' or 'list' layout. The same data, two
 * presentations — the hub passes the mode down so this component stays dumb.
 *
 * Grid mode:  tall card with summary clamp + tag chips
 * List mode:  horizontal compact row
 *
 * The "Quick View" button opens the Radix Dialog (KnowledgeQuickViewModal).
 * Cards remain a static <a> link to keep SEO happy (search engines can
 * crawl the link); the dialog is purely a UX shortcut.
 */
import type { KnowledgeArticle, KnowledgeViewMode } from './knowledge-data';
import {
  GRADE_LABELS,
  PROCESS_LABELS,
  STANDARD_LABELS,
  INDUSTRY_LABELS,
} from './knowledge-data';

interface Props {
  article: KnowledgeArticle;
  mode: KnowledgeViewMode;
  onQuickView: (article: KnowledgeArticle) => void;
  quickViewLabel: string;
  readMoreLabel: string;
  updatedLabel: string;
  readTimeLabel: string;  // template "{n} min read"
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

function clampSummary(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;
}

export function KnowledgeArticleCard({
  article, mode, onQuickView,
  quickViewLabel, readMoreLabel, updatedLabel, readTimeLabel,
}: Props) {
  const articleHref = `/blog/${article.slug}/`;
  const summary = mode === 'list' ? clampSummary(article.summary, 180) : article.summary;
  const tagLimit = mode === 'list' ? 2 : 3;

  return (
    <article
      className={
        mode === 'list'
          ? 'group flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start sm:gap-5'
          : 'group flex h-full flex-col rounded-2xl border p-6'
      }
      style={{
        backgroundColor: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
        borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
      }}
    >
      {/* Header: standard badge + date */}
      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start">
        {article.primaryStandard ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)',
              color: 'var(--theme-primary)',
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
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
              className="h-3 w-3"
              aria-hidden="true"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 5-3.5 7.5-9 9-5.5-1.5-9-4-9-9V5l9-3 9 3z" />
            </svg>
            {STANDARD_LABELS[article.primaryStandard]}
          </span>
        ) : <span aria-hidden="true" />}
        <span
          className="text-xs tabular-nums"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
        >
          {updatedLabel} {formatDate(article.updatedAt)}
        </span>
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <h3
          className={mode === 'list' ? 'mb-1 text-lg font-semibold' : 'mb-2 text-lg font-semibold leading-snug md:text-xl'}
          style={{ color: 'var(--theme-text)' }}
        >
          <a
            href={articleHref}
            className="hover:underline focus:outline-none focus-visible:underline"
            style={{ color: 'inherit' }}
          >
            {article.title}
          </a>
        </h3>
        <p
          className="mb-3 text-sm leading-relaxed"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
        >
          {summary}
        </p>

        {/* Tag chips */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {article.gradeTags.slice(0, tagLimit).map((g) => (
            <span
              key={`g-${g}`}
              className="rounded-full border px-2 py-0.5 text-[0.65rem] font-medium"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-text) 18%, transparent)',
                color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
              }}
            >
              {GRADE_LABELS[g]}
            </span>
          ))}
          {article.processTags.slice(0, tagLimit).map((p) => (
            <span
              key={`p-${p}`}
              className="rounded-full border px-2 py-0.5 text-[0.65rem] font-medium"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-text) 18%, transparent)',
                color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
              }}
            >
              {PROCESS_LABELS[p]}
            </span>
          ))}
          {article.industryTags.slice(0, tagLimit).map((i) => (
            <span
              key={`i-${i}`}
              className="rounded-full border px-2 py-0.5 text-[0.65rem] font-medium"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-text) 18%, transparent)',
                color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
              }}
            >
              {INDUSTRY_LABELS[i]}
            </span>
          ))}
        </div>

        {/* Footer: read time + actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {readTimeLabel.replace('{n}', String(article.readTimeMinutes))}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuickView(article)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                color: 'var(--theme-primary)',
                backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
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
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {quickViewLabel}
            </button>
            <a
              href={articleHref}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: 'var(--theme-bg)',
              }}
            >
              {readMoreLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
