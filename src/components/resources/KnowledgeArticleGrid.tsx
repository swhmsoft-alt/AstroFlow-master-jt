/**
 * KnowledgeArticleGrid.tsx
 *
 * Container for the article cards. Owns:
 *   - grid / list view rendering
 *   - empty state
 *   - skeleton state during async-like transitions (e.g. query debounce)
 *   - the "Showing N of M" status line
 *
 * Skeleton state: we render a stable skeleton layout during the brief
 * debounce window so the user sees feedback that "something is happening"
 * (visually consistent with FAQHub's behavior).
 */
import { useState, useEffect } from 'react';
import type { KnowledgeArticle, KnowledgeViewMode } from './knowledge-data';
import { KnowledgeArticleCard } from './KnowledgeArticleCard';

interface Props {
  articles: readonly KnowledgeArticle[];
  isPending: boolean;            // true during debounce (show skeleton)
  view: KnowledgeViewMode;
  onViewChange: (v: KnowledgeViewMode) => void;
  onQuickView: (article: KnowledgeArticle) => void;
  // ── Strings ──
  gridLabel: string;
  listLabel: string;
  quickViewLabel: string;
  readMoreLabel: string;
  updatedLabel: string;
  readTimeLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyResetLabel: string;
  emptyCtaLabel: string;
  emptyCtaHref: string;
  onReset: () => void;
  totalCount: number;
}

const SKELETON_COUNT = 6;

export function KnowledgeArticleGrid({
  articles, isPending, view, onViewChange,
  onQuickView,
  gridLabel, listLabel,
  quickViewLabel, readMoreLabel, updatedLabel, readTimeLabel,
  emptyTitle, emptyDescription, emptyResetLabel, emptyCtaLabel, emptyCtaHref,
  onReset, totalCount,
}: Props) {
  // Defer the skeleton→content swap by 1 frame so React commits the skeleton
  // first (avoids the case where debouncedQuery settles synchronously and the
  // skeleton never paints).
  const [showSkeleton, setShowSkeleton] = useState(isPending);
  useEffect(() => {
    if (isPending) {
      setShowSkeleton(true);
      return;
    }
    const t = window.setTimeout(() => setShowSkeleton(false), 0);
    return () => window.clearTimeout(t);
  }, [isPending]);

  if (showSkeleton) {
    return (
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'
            : 'flex flex-col gap-3'
        }
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            key={i}
            className={view === 'grid' ? 'h-72 rounded-2xl' : 'h-28 rounded-2xl'}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-surface) 50%, transparent)',
              border: '1px solid color-mix(in srgb, var(--theme-text) 8%, transparent)',
            }}
          />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div
        className="rounded-2xl border p-8 text-center md:p-12"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
          borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
        }}
        role="status"
        aria-live="polite"
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)',
          }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            style={{ color: 'var(--theme-primary)' }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </div>

        <h3
          className="mb-2 text-lg font-semibold md:text-xl"
          style={{ color: 'var(--theme-text)' }}
        >
          {emptyTitle}
        </h3>
        <p
          className="mx-auto mb-6 max-w-md text-sm md:text-base"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}
        >
          {emptyDescription}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
              color: 'var(--theme-primary)',
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
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
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
            {emptyResetLabel}
          </button>
          <a
            href={emptyCtaHref}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: 'var(--theme-primary)',
              color: 'var(--theme-bg)',
            }}
          >
            {emptyCtaLabel}
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
      </div>
    );
  }

  return (
    <div>
      {/* View toggle + count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
        >
          {articles.length === totalCount
            ? `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`
            : `${articles.length} of ${totalCount} articles`}
        </span>
        <div
          role="group"
          aria-label="View mode"
          className="inline-flex rounded-full border p-0.5"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-text) 15%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--theme-surface) 40%, transparent)',
          }}
        >
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-pressed={view === 'grid'}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: view === 'grid' ? 'var(--theme-primary)' : 'transparent',
              color: view === 'grid' ? 'var(--theme-bg)' : 'var(--theme-text)',
            }}
          >
            <span className="inline-flex items-center gap-1">
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              {gridLabel}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            aria-pressed={view === 'list'}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: view === 'list' ? 'var(--theme-primary)' : 'transparent',
              color: view === 'list' ? 'var(--theme-bg)' : 'var(--theme-text)',
            }}
          >
            <span className="inline-flex items-center gap-1">
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
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              {listLabel}
            </span>
          </button>
        </div>
      </div>

      <div
        id="knowledge-grid"
        role="region"
        aria-label="Knowledge articles"
        className={
          view === 'grid'
            ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'
            : 'flex flex-col gap-3'
        }
      >
        {articles.map((a) => (
          <KnowledgeArticleCard
            key={a.id}
            article={a}
            mode={view}
            onQuickView={onQuickView}
            quickViewLabel={quickViewLabel}
            readMoreLabel={readMoreLabel}
            updatedLabel={updatedLabel}
            readTimeLabel={readTimeLabel}
          />
        ))}
      </div>
    </div>
  );
}
