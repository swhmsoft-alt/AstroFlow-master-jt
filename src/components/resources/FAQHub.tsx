/**
 * FAQHub.tsx
 *
 * Main React island that orchestrates the Resources-Hub FAQ pillar page.
 * All interactive state lives here:
 *   - URL search params (?cat=, ?q=) — Single Source of Truth for filter state
 *   - Open accordion set (also driven by URL hash #faq-… on first paint)
 *   - Per-FAQ feedback map (persisted to localStorage)
 *
 * Composition:
 *   SubpageHero (Astro, rendered around this island)
 *     └─ <FAQHeroSearch client:visible ... />            ← inside hero slot
 *   FAQHeroSearch                                            ↓ emits query
 *   FAQCategoryTabs                                          ↓ emits category
 *   FAQAccordionList + FAQEmpty (conditional render)
 *   FAQCTA                                                   (static footer)
 */
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type {
  FaqEntry,
  FaqCategoryId,
  CategoryMeta,
} from './faq-data';
import { FAQ_ENTRIES } from './faq-data';
import { useFaqUrlState } from './useFaqUrlState';
import { useDebouncedValue } from './useDebounce';
import { escapeRegExp } from '../../utils/strip-html';
import { FAQHeroSearch } from './FAQHeroSearch';
import { FAQCategoryTabs, type CategoryTabDef } from './FAQCategoryTabs';
import { FAQAccordionList } from './FAQAccordionList';
import { FAQEmpty } from './FAQEmpty';
import { FAQCTA } from './FAQCTA';
import { FAQKeyboardHandler } from './FAQKeyboardHandler';

export interface FAQHubStrings {
  readonly heroPlaceholder: string;
  readonly heroShortcutHint: string;
  /**
   * Template for the result counter when a search filter is active.
   * Placeholders: `{matched}` (number of matched entries) and `{total}`
   * (total number of entries in the dataset). Example:
   *   "Showing {matched} of {total} answers"
   */
  readonly heroMatchedLabel: string;
  /** Template for the result counter when no filter is active. `{total}`. */
  readonly heroTotalLabel: string;
  readonly categoryAllLabel: string;
  readonly expandAllLabel: string;
  readonly collapseAllLabel: string;
  readonly helpfulQuestion: string;
  readonly helpfulYes: string;
  readonly helpfulNo: string;
  readonly helpfulThanks: string;
  readonly helpfulThanksNegative: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly emptyResetLabel: string;
  readonly emptyCtaLabel: string;
  readonly ctaTitle: string;
  readonly ctaSubtitle: string;
  readonly ctaPrimaryLabel: string;
  readonly ctaSecondaryLabel: string;
}

/** Safe template placeholder substitution — unknown keys left untouched. */
function interpolate(template: string, vars: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in vars ? String(vars[key]) : m,
  );
}

export interface FAQHubProps {
  /** Categories in display order (without the implicit "All" tab). */
  categories: readonly CategoryMeta[];
  /** Overrides the default 24-entry dataset (e.g. for tests / future locales). */
  entries?: readonly FaqEntry[];
  /** Hub-level i18n strings. */
  strings: FAQHubStrings;
  /** CTA destination. */
  ctaHref?: string;
}

type FeedbackMap = Readonly<Record<string, 'yes' | 'no'>>;

type FeedbackAction =
  | { type: 'set'; faqId: string; value: 'yes' | 'no' }
  | { type: 'reset' }
  | { type: 'hydrate'; map: FeedbackMap };

function feedbackReducer(state: FeedbackMap, action: FeedbackAction): FeedbackMap {
  switch (action.type) {
    case 'set': {
      if (state[action.faqId] === action.value) return state;
      return { ...state, [action.faqId]: action.value };
    }
    case 'reset':
      return {};
    case 'hydrate':
      return action.map;
    default:
      return state;
  }
}

const FEEDBACK_STORAGE_KEY = 'boze.faq.feedback.v1';

function readFeedbackFromStorage(): FeedbackMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const out: Record<string, 'yes' | 'no'> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if ((v === 'yes' || v === 'no') && typeof k === 'string') out[k] = v;
    }
    return out;
  } catch {
    // localStorage may throw in Safari private mode or when blocked.
    return {};
  }
}

function writeFeedbackToStorage(map: FeedbackMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Match a FAQ entry against a lowercased query — scored rank is returned. */
function matchFaq(entry: FaqEntry, lowerQuery: string): number {
  if (lowerQuery.length === 0) return 1; // empty query → all match (rank=1)
  const q = lowerQuery;
  let score = 0;
  if (entry.question.toLowerCase().includes(q)) score += 4;
  if (entry.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
  // answerHtml is HTML — strip tags before matching for accuracy
  const answerPlain = entry.answerHtml.replace(/<[^>]*>/g, ' ').toLowerCase();
  if (answerPlain.includes(q)) score += 1;
  return score;
}

export function FAQHub({ categories, entries, strings, ctaHref = '/rfq/' }: FAQHubProps) {
  const data = entries ?? FAQ_ENTRIES;
  const url = useFaqUrlState(200);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Category labels lookup ─────────────────────────────
  const categoryLabels = useMemo<Readonly<Record<FaqCategoryId, string>>>(() => {
    const out: Record<FaqCategoryId, string> = {
      general: '',
      materials: '',
      'cnc-machining': '',
      'surface-finishing': '',
      quality: '',
      shipping: '',
    };
    for (const c of categories) out[c.id] = c.label;
    return out;
  }, [categories]);

  // ── Per-category counts (static — derived from `data`) ──
  const categoryCounts = useMemo(() => {
    const counts: Record<FaqCategoryId, number> = {
      general: 0,
      materials: 0,
      'cnc-machining': 0,
      'surface-finishing': 0,
      quality: 0,
      shipping: 0,
    };
    for (const entry of data) counts[entry.category] += 1;
    return counts;
  }, [data]);

  // ── Tabs definition ──────────────────────────────────────────────
  const tabs = useMemo<readonly CategoryTabDef[]>(() => {
    const allTab: CategoryTabDef = {
      id: 'all',
      label: strings.categoryAllLabel,
      count: data.length,
    };
    const perCat: CategoryTabDef[] = categories.map((c) => ({
      id: c.id,
      label: c.label,
      count: categoryCounts[c.id] ?? 0,
    }));
    return [allTab, ...perCat];
  }, [categories, categoryCounts, data.length, strings.categoryAllLabel]);

  // ── Filter state ─────────────────────────────────────────────────
  const activeCategory: FaqCategoryId | 'all' = url.state.category ?? 'all';

  // Debounced query for matching (URL is the live source, debounced = the
  // expensive computation source).
  const debouncedQuery = useDebouncedValue(url.state.query, 150);
  const trimmedQuery = debouncedQuery.trim();
  const lowerQuery = trimmedQuery.toLowerCase();

  const filteredEntries = useMemo(() => {
    let pool = data;
    if (activeCategory !== 'all') {
      pool = pool.filter((e) => e.category === activeCategory);
    }
    if (trimmedQuery.length === 0) return pool;
    const ranked = pool
      .map((e) => ({ e, score: matchFaq(e, lowerQuery) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
    return ranked.map((r) => r.e);
  }, [data, activeCategory, trimmedQuery, lowerQuery]);

  // ── Open accordion set ──────────────────────────────────────────
  // Initial value: if URL has #faq-…, that single id starts open.
  const [openIdsRaw, setOpenIdsRaw] = useState<string[]>(initialHashFilterIds());

  // De-dupe + drop ids that are no longer in the filtered set whenever the
  // filtered list changes.
  const openIds = useMemo(() => {
    const valid = new Set(filteredEntries.map((e) => e.id));
    return openIdsRaw.filter((id) => valid.has(id));
  }, [filteredEntries, openIdsRaw]);

  const setOpenIds = useCallback((next: string[]) => {
    setOpenIdsRaw(Array.from(new Set(next)));
  }, []);

  // ── Feedback reducer ────────────────────────────────────────────
  const [feedbackMap, dispatchFeedback] = useReducer(feedbackReducer, {});

  // Hydrate feedback from localStorage on mount.
  useEffect(() => {
    dispatchFeedback({ type: 'hydrate', map: readFeedbackFromStorage() });
  }, []);

  // Persist feedback on every change.
  useEffect(() => {
    writeFeedbackToStorage(feedbackMap);
  }, [feedbackMap]);

  // ── URL hash → open accordion + smooth scroll ──────────────────
  useEffect(() => {
    const applyHash = (): boolean => {
      if (typeof window === 'undefined') return false;
      const raw = window.location.hash;
      if (!raw) return false;
      const id = raw.replace(/^#/, '').replace(/^faq-/, '');
      if (!id) return false;
      // Ensure the item is in the open set.
      setOpenIds([id]);
      // Scroll into view on the next paint frame.
      requestAnimationFrame(() => {
        const el = document.getElementById(`faq-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Move keyboard focus to the trigger (without re-triggering scroll).
          const trigger = document.getElementById(`faq-trigger-${id}`);
          if (trigger instanceof HTMLElement) {
            trigger.focus({ preventScroll: true });
          }
        }
      });
      return true;
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
    // We only re-bind on `filteredEntries` changes — that way if the hash
    // changes to an item currently filtered out, the next valid filter pass
    // will re-run the effect.
  }, [filteredEntries]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleCategoryChange = useCallback(
    (next: FaqCategoryId | 'all') => {
      url.setCategory(next === 'all' ? null : next);
    },
    [url],
  );

  const handleFeedback = useCallback((faqId: string, helpful: boolean) => {
    dispatchFeedback({
      type: 'set',
      faqId,
      value: helpful ? 'yes' : 'no',
    });
  }, []);

  const handleReset = useCallback(() => {
    url.reset();
    searchInputRef.current?.focus();
  }, [url]);

  // ── Derived status text ─────────────────────────────────────────
  const statusText = useMemo(() => {
    if (trimmedQuery.length === 0 && activeCategory === 'all') {
      return interpolate(strings.heroTotalLabel, { total: data.length });
    }
    return interpolate(strings.heroMatchedLabel, {
      matched: filteredEntries.length,
      total: data.length,
    });
  }, [
    strings.heroTotalLabel,
    strings.heroMatchedLabel,
    data.length,
    filteredEntries.length,
    trimmedQuery.length,
    activeCategory,
  ]);

  // ── Item-level strings (passed to each AccordionItem) ────────────
  const itemStrings = useMemo(
    () => ({
      helpfulQuestion: strings.helpfulQuestion,
      helpfulYes: strings.helpfulYes,
      helpfulNo: strings.helpfulNo,
      helpfulThanks: strings.helpfulThanks,
      helpfulThanksNegative: strings.helpfulThanksNegative,
    }),
    [strings],
  );

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* Global `/` / `⌘K` shortcut handler — renders null */}
      <FAQKeyboardHandler searchInputRef={searchInputRef} />

      {/* Hero with debounced search */}
      <FAQHeroSearch
        value={url.state.query}
        onChange={url.setQuery}
        placeholder={strings.heroPlaceholder}
        shortcutHint={strings.heroShortcutHint}
        statusText={statusText}
        inputRef={searchInputRef}
      />

      {/* Category tabs + counts */}
      <div className="mt-10">
        <FAQCategoryTabs
          tabs={tabs}
          active={activeCategory}
          onChange={handleCategoryChange}
          allLabel={strings.categoryAllLabel}
        />
      </div>

      {/* List or empty state */}
      <div className="mt-6">
        {filteredEntries.length > 0 ? (
          <FAQAccordionList
            entries={filteredEntries}
            categoryLabels={categoryLabels}
            openIds={openIds}
            onOpenChange={setOpenIds}
            query={trimmedQuery}
            feedbackMap={feedbackMap}
            onFeedback={handleFeedback}
            strings={itemStrings}
            expandAllLabel={strings.expandAllLabel}
            collapseAllLabel={strings.collapseAllLabel}
          />
        ) : (
          <FAQEmpty
            title={strings.emptyTitle}
            description={strings.emptyDescription}
            resetLabel={strings.emptyResetLabel}
            ctaLabel={strings.emptyCtaLabel}
            ctaHref={ctaHref}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Bottom-of-page B2B CTA (always rendered — even when filtered list is empty) */}
      <FAQCTA
        title={strings.ctaTitle}
        subtitle={strings.ctaSubtitle}
        primaryLabel={strings.ctaPrimaryLabel}
        primaryHref={ctaHref}
        secondaryLabel={strings.ctaSecondaryLabel}
        secondaryHref={ctaHref}
        bullets={[
          '1–2 business day DFM response',
          'EN 10204 3.1 MTR included',
          'AS9100D / ISO 13485 facility',
        ]}
      />
    </section>
  );
}

/**
 * Helper: read #faq-… from the current URL on first render. Returns an
 * array containing the id if present, otherwise an empty array.
 */
function initialHashFilterIds(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = window.location.hash;
  if (!raw) return [];
  const id = raw.replace(/^#/, '').replace(/^faq-/, '');
  return id ? [id] : [];
}

// Re-export the query escape so consumers (tests) can use the same regex.
export { escapeRegExp };