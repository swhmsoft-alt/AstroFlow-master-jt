/**
 * knowledge-base.test.tsx
 *
 * Unit tests for the Titanium Knowledge Base filter / search / URL state
 * pipeline. Pairs with the sibling `faq-hub.test.tsx`.
 *
 * Run with: `npx vitest run src/tests/knowledge-base.test.tsx`
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  filterKnowledgeArticles,
  computeFacetCounts,
  buildFacetGroups,
  EMPTY_FILTERS,
  type KnowledgeArticle,
  type KnowledgeFilters,
} from '../components/resources/knowledge-data';
import { useKnowledgeUrlState } from '../components/resources/useKnowledgeUrlState';
import { KnowledgeArticleGrid } from '../components/resources/KnowledgeArticleGrid';

function makeArticle(overrides: Partial<KnowledgeArticle> = {}): KnowledgeArticle {
  return {
    id: overrides.id ?? 'a-1',
    title: overrides.title ?? 'Sample Article',
    slug: overrides.slug ?? 'sample-article',
    summary: overrides.summary ?? 'Sample summary',
    bodyHtml: overrides.bodyHtml ?? '<p>Body content</p>',
    gradeTags: overrides.gradeTags ?? ['alpha-beta-gr5'],
    processTags: overrides.processTags ?? ['5-axis-cnc'],
    standardTags: overrides.standardTags ?? ['astm-b348'],
    industryTags: overrides.industryTags ?? ['aerospace'],
    publishedAt: '2026-01-01',
    updatedAt: '2026-09-22',
    readTimeMinutes: 5,
    primaryStandard: 'astm-b348',
    featured: false,
    wordCount: 100,
    ...overrides,
  };
}

const corpus: readonly KnowledgeArticle[] = [
  makeArticle({ id: 'g5-5axis', gradeTags: ['alpha-beta-gr5'], processTags: ['5-axis-cnc'] }),
  makeArticle({ id: 'g23-5axis', gradeTags: ['alpha-beta-gr23'], processTags: ['5-axis-cnc'] }),
  makeArticle({ id: 'g23-edm', title: 'Grade 23 EDM', gradeTags: ['alpha-beta-gr23'], processTags: ['wire-edm'] }),
  makeArticle({ id: 'cp2-anod', title: 'CP Grade 2 Anodizing', gradeTags: ['cp-gr2'], processTags: ['anodizing'] }),
];

describe('filterKnowledgeArticles', () => {
  it('returns full corpus when filters empty and query empty', () => {
    expect(filterKnowledgeArticles(corpus, EMPTY_FILTERS, '')).toHaveLength(4);
  });
  it('AND-filters across 4 dimensions', () => {
    const f: KnowledgeFilters = { ...EMPTY_FILTERS, grades: ['alpha-beta-gr5'], processes: ['5-axis-cnc'], standards: ['astm-b348'], industries: ['aerospace'] };
    expect(filterKnowledgeArticles(corpus, f, '').map((a) => a.id)).toEqual(['g5-5axis']);
  });
  it('OR-within-dimension', () => {
    const f: KnowledgeFilters = { ...EMPTY_FILTERS, grades: ['alpha-beta-gr5', 'alpha-beta-gr23'] };
    expect(filterKnowledgeArticles(corpus, f, '')).toHaveLength(3);
  });
  it('free-text query is case-insensitive', () => {
    expect(filterKnowledgeArticles(corpus, EMPTY_FILTERS, 'edm').map((a) => a.id)).toEqual(['g23-edm']);
  });
  it('returns empty array when no match', () => {
    const f: KnowledgeFilters = { ...EMPTY_FILTERS, industries: ['racing-motorsport'] };
    expect(filterKnowledgeArticles(corpus, f, '')).toHaveLength(0);
  });
});

describe('computeFacetCounts', () => {
  it('shows what would match if I pick THIS grade', () => {
    const counts = computeFacetCounts(corpus, EMPTY_FILTERS, '', 'grade');
    expect(counts['alpha-beta-gr5']).toBe(1);
    expect(counts['alpha-beta-gr23']).toBe(2);
    expect(counts['cp-gr2']).toBe(1);
  });
  it('respects non-dimension filters', () => {
    const f: KnowledgeFilters = { ...EMPTY_FILTERS, grades: ['alpha-beta-gr23'] };
    const counts = computeFacetCounts(corpus, f, '', 'process');
    expect(counts['5-axis-cnc']).toBe(1);
    expect(counts['wire-edm']).toBe(1);
  });
  it('respects query', () => {
    const counts = computeFacetCounts(corpus, EMPTY_FILTERS, 'EDM', 'process');
    expect(counts['wire-edm']).toBe(1);
    expect(counts['5-axis-cnc']).toBe(0);
  });
});

describe('buildFacetGroups', () => {
  it('returns 4 groups in stable order', () => {
    expect(buildFacetGroups(corpus, EMPTY_FILTERS, '').map((g) => g.dimension)).toEqual(['grade', 'process', 'standard', 'industry']);
  });
});

describe('useKnowledgeUrlState', () => {
  beforeEach(() => { window.history.replaceState({}, '', '/resources/titanium-knowledge-base/'); vi.useFakeTimers(); });
  afterEach(() => vi.useRealTimers());

  function setup() {
    let api!: ReturnType<typeof useKnowledgeUrlState>;
    function Probe() {
      api = useKnowledgeUrlState();
      return <div data-testid="probe" data-q={api.state.query} data-grades={api.state.grades.join(',')} data-view={api.state.view} />;
    }
    render(<Probe />);
    return { get state() { return api.state; }, setQuery: api.setQuery, toggleGrade: api.toggleGrade };
  }

  it('reads initial state from URL', () => {
    window.history.replaceState({}, '', '/resources/titanium-knowledge-base/?q=test&grade=alpha-beta-gr5&view=list');
    const { state } = setup();
    expect(state.query).toBe('test');
    expect(state.grades).toEqual(['alpha-beta-gr5']);
    expect(state.view).toBe('list');
  });
  it('writes URL after debounce', () => {
    const { setQuery } = setup();
    setQuery('machining');
    expect(window.location.search).toBe('');
    vi.advanceTimersByTime(250);
    expect(window.location.search).toContain('q=machining');
  });
  it('toggles grade in/out', () => {
    const { toggleGrade } = setup();
    toggleGrade('alpha-beta-gr5');
    vi.advanceTimersByTime(250);
    expect(window.location.search).toContain('grade=alpha-beta-gr5');
    toggleGrade('alpha-beta-gr5');
    vi.advanceTimersByTime(250);
    expect(window.location.search).not.toContain('grade=');
  });
  it('drops unknown values silently', () => {
    window.history.replaceState({}, '', '/resources/titanium-knowledge-base/?grade=fake-id,alpha-beta-gr5');
    const { state } = setup();
    expect(state.grades).toEqual(['alpha-beta-gr5']);
  });
});

describe('KnowledgeArticleGrid empty state', () => {
  const baseProps = {
    articles: [] as readonly KnowledgeArticle[], isPending: false, view: 'grid' as const,
    onViewChange: vi.fn(), onQuickView: vi.fn(), totalCount: 0, onReset: vi.fn(),
    gridLabel: 'Grid', listLabel: 'List', quickViewLabel: 'Quick View',
    readMoreLabel: 'Read article', updatedLabel: 'Updated', readTimeLabel: '{n} min read',
    emptyTitle: 'No articles match your filters', emptyDescription: 'Try removing a filter.',
    emptyResetLabel: 'Reset filters', emptyCtaLabel: 'Talk to a Titanium Engineer', emptyCtaHref: '/rfq/',
  };

  it('renders reset button and RFQ CTA when zero articles', () => {
    render(<KnowledgeArticleGrid {...baseProps} />);
    expect(screen.getByText(baseProps.emptyTitle)).toBeTruthy();
    expect(screen.getByText(baseProps.emptyResetLabel)).toBeTruthy();
    expect(screen.getByText(baseProps.emptyCtaLabel)).toBeTruthy();
    const ctaLink = screen.getByText(baseProps.emptyCtaLabel).closest('a');
    expect(ctaLink?.getAttribute('href')).toBe('/rfq/');
  });
  it('clicking reset calls onReset', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<KnowledgeArticleGrid {...baseProps} onReset={onReset} />);
    await user.click(screen.getByText(baseProps.emptyResetLabel));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
  it('view toggle buttons have aria-pressed', () => {
    render(<KnowledgeArticleGrid {...baseProps} articles={corpus} view="list" totalCount={corpus.length} />);
    const listBtn = screen.getByRole('button', { name: /list/i });
    const gridBtn = screen.getByRole('button', { name: /grid/i });
    expect(listBtn.getAttribute('aria-pressed')).toBe('true');
    expect(gridBtn.getAttribute('aria-pressed')).toBe('false');
  });
  it('renders one card per article in grid mode', () => {
    const { container } = render(<KnowledgeArticleGrid {...baseProps} articles={corpus} totalCount={corpus.length} />);
    expect(container.querySelectorAll('article')).toHaveLength(4);
  });
});
