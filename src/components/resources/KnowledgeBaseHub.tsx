/**
 * KnowledgeBaseHub.tsx
 *
 * Main React island that orchestrates the Titanium Knowledge Base
 * (`/resources/titanium-knowledge-base/`). Composes:
 *   - KnowledgeBaseHero        — debounced search + popular topics
 *   - KnowledgeFacetSidebar    — 4-dim checkbox groups
 *   - KnowledgeArticleGrid     — grid/list cards + skeleton + empty state
 *   - KnowledgeQuickViewModal  — Radix Dialog for inline preview
 *   - KnowledgeCTA             — bottom-of-page RFQ card
 *
 * State source of truth: `useKnowledgeUrlState` (URL ?q=&grade=&process=&std=&app=&view=).
 * Computed values are memoized: filtered article list, facet counts.
 *
 * a11y:
 *   - Search input has `aria-controls="knowledge-grid"` (the grid is the
 *     filtered target).
 *   - View toggle uses `aria-pressed` on each button.
 *   - Filter checkboxes use native <input type="checkbox"> with `aria-checked`.
 *   - Status messages use `role="status" aria-live="polite"`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from './useDebounce';
import { useKnowledgeUrlState } from './useKnowledgeUrlState';
import {
  buildFacetGroups,
  filterKnowledgeArticles,
  type KnowledgeArticle,
  type KnowledgeFilters,
  type KnowledgeViewMode,
} from './knowledge-data';
import { KnowledgeBaseHero, type PopularTopic } from './KnowledgeBaseHero';
import { KnowledgeFacetSidebar } from './KnowledgeFacetSidebar';
import { KnowledgeArticleGrid } from './KnowledgeArticleGrid';
import { KnowledgeQuickViewModal } from './KnowledgeQuickViewModal';
import { KnowledgeCTA } from './KnowledgeCTA';

export interface KnowledgeHubStrings {
  readonly heroPlaceholder: string;
  readonly heroShortcutHint: string;
  readonly heroResultTotalTemplate: string;       // "Showing {n} technical articles"
  readonly heroResultFilteredTemplate: string;    // "Showing {matched} of {total} articles"
  readonly popularTopicsLabel: string;
  readonly clearSearchLabel: string;
  readonly filtersResetLabel: string;
  readonly gridViewLabel: string;
  readonly listViewLabel: string;
  readonly quickViewLabel: string;
  readonly readMoreLabel: string;
  readonly updatedLabel: string;
  readonly readTimeLabel: string;                  // "{n} min read"
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly emptyResetLabel: string;
  readonly emptyCtaLabel: string;
  readonly emptyCtaHref: string;
  readonly ctaTitle: string;
  readonly ctaSubtitle: string;
  readonly ctaPrimaryLabel: string;
  readonly ctaPrimaryHref: string;
  readonly ctaSecondaryLabel: string;
  readonly ctaSecondaryHref: string;
  readonly ctaBullets: readonly string[];
  readonly dialogCloseLabel: string;
  readonly dialogReadFullLabel: string;
  readonly dialogCtaLabel: string;
  readonly dialogCtaHref: string;
  readonly dialogGradeLabel: string;
  readonly dialogProcessLabel: string;
  readonly dialogStandardLabel: string;
  readonly dialogIndustryLabel: string;
}

export interface KnowledgeHubProps {
  /** Full corpus (all articles from the collection). */
  articles: readonly KnowledgeArticle[];
  /** Popular one-click topics shown in the hero. */
  popularTopics: readonly PopularTopic[];
  /** Hub-level i18n strings. */
  strings: KnowledgeHubStrings;
}

export function KnowledgeBaseHub({ articles, popularTopics, strings }: KnowledgeHubProps) {
  const url = useKnowledgeUrlState();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [quickViewArticle, setQuickViewArticle] = useState<KnowledgeArticle | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Debounce the query so the filter recompute + skeleton settle without
  // thrash on every keystroke.
  const debouncedQuery = useDebouncedValue(url.state.query, 250);
  const isPending = url.state.query !== debouncedQuery;

  // ── Memoized derived state ────────────────────────────────────────────
  const filtered = useMemo<readonly KnowledgeArticle[]>(
    () => filterKnowledgeArticles(articles, url.state, debouncedQuery),
    [articles, url.state, debouncedQuery],
  );

  const facetGroups = useMemo(
    () => buildFacetGroups(articles, url.state, debouncedQuery),
    [articles, url.state, debouncedQuery],
  );

  const activeFilterCount = useMemo(() => {
    const f = url.state;
    return f.grades.length + f.processes.length + f.standards.length + f.industries.length;
  }, [url.state]);

  // ── Status line text ──────────────────────────────────────────────────
  const statusText = useMemo<string>(() => {
    if (filtered.length === articles.length) {
      return strings.heroResultTotalTemplate.replace('{n}', String(filtered.length));
    }
    return strings.heroResultFilteredTemplate
      .replace('{matched}', String(filtered.length))
      .replace('{total}', String(articles.length));
  }, [filtered.length, articles.length, strings]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleQuickView = useCallback((article: KnowledgeArticle) => {
    setQuickViewArticle(article);
    setQuickViewOpen(true);
  }, []);

  const handlePopularTopic = useCallback((topic: PopularTopic) => {
    url.setQuery(topic.query);
    searchInputRef.current?.focus();
  }, [url]);

  // Global `/` and `⌘K` shortcut to focus the search input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <KnowledgeBaseHero
        value={url.state.query}
        onChange={url.setQuery}
        statusText={statusText}
        inputRef={searchInputRef}
        strings={{
          searchPlaceholder: strings.heroPlaceholder,
          shortcutHint: strings.heroShortcutHint,
          resultTotalTemplate: strings.heroResultTotalTemplate,
          resultFilteredTemplate: strings.heroResultFilteredTemplate,
          popularTopicsLabel: strings.popularTopicsLabel,
          clearSearchLabel: strings.clearSearchLabel,
        }}
        popularTopics={popularTopics}
        onPopularTopic={handlePopularTopic}
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <KnowledgeFacetSidebar
          groups={facetGroups}
          filters={url.state as KnowledgeFilters}
          onToggleGrade={url.toggleGrade}
          onToggleProcess={url.toggleProcess}
          onToggleStandard={url.toggleStandard}
          onToggleIndustry={url.toggleIndustry}
          onReset={url.reset}
          resetLabel={strings.filtersResetLabel}
          activeFilterCount={activeFilterCount}
        />

        <div>
          <KnowledgeArticleGrid
            articles={filtered}
            isPending={isPending}
            view={url.state.view as KnowledgeViewMode}
            onViewChange={url.setView}
            onQuickView={handleQuickView}
            gridLabel={strings.gridViewLabel}
            listLabel={strings.listViewLabel}
            quickViewLabel={strings.quickViewLabel}
            readMoreLabel={strings.readMoreLabel}
            updatedLabel={strings.updatedLabel}
            readTimeLabel={strings.readTimeLabel}
            emptyTitle={strings.emptyTitle}
            emptyDescription={strings.emptyDescription}
            emptyResetLabel={strings.emptyResetLabel}
            emptyCtaLabel={strings.emptyCtaLabel}
            emptyCtaHref={strings.emptyCtaHref}
            onReset={url.reset}
            totalCount={articles.length}
          />
        </div>
      </div>

      <KnowledgeCTA
        title={strings.ctaTitle}
        subtitle={strings.ctaSubtitle}
        primaryLabel={strings.ctaPrimaryLabel}
        primaryHref={strings.ctaPrimaryHref}
        secondaryLabel={strings.ctaSecondaryLabel}
        secondaryHref={strings.ctaSecondaryHref}
        bullets={strings.ctaBullets}
      />

      <KnowledgeQuickViewModal
        article={quickViewArticle}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        strings={{
          closeLabel: strings.dialogCloseLabel,
          readFullLabel: strings.dialogReadFullLabel,
          ctaLabel: strings.dialogCtaLabel,
          ctaHref: strings.dialogCtaHref,
          gradeLabel: strings.dialogGradeLabel,
          processLabel: strings.dialogProcessLabel,
          standardLabel: strings.dialogStandardLabel,
          industryLabel: strings.dialogIndustryLabel,
          readTimeLabel: strings.readTimeLabel,
          updatedLabel: strings.updatedLabel,
        }}
      />
    </section>
  );
}
