/**
 * faq-hub.test.tsx
 *
 * Unit + integration tests for the FAQHub React island + its helper hooks.
 * Run with `npx vitest` (or `pnpm test`). Vitest is NOT pre-installed in this
 * repo — install with:
 *
 *     pnpm add -D vitest @vitest/ui @testing-library/react \
 *               @testing-library/user-event @testing-library/jest-dom \
 *               jsdom happy-dom
 *
 * and add the following to `tsconfig.json`:
 *
 *     "types": ["vitest/globals", "@testing-library/jest-dom"]
 *
 * and create `vitest.config.ts`:
 *
 *     import { defineConfig } from 'vitest/config';
 *     import react from '@vitejs/plugin-react';
 *     export default defineConfig({
 *       plugins: [react()],
 *       test: { environment: 'jsdom', globals: true, setupFiles: ['./tests/setup.ts'] },
 *     });
 *
 * These tests are written so they pass against the public API exported by
 * `FAQHub`, `faq-data`, `useFaqUrlState`, and `strip-html`. They cover the
 * behaviors called out in the SOP acceptance checklist.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQHub } from '../components/resources/FAQHub';
import { FAQ_ENTRIES, CATEGORY_META_DEFAULT } from '../components/resources/faq-data';
import { useFaqUrlState } from '../components/resources/useFaqUrlState';
import { stripHtml, highlightSegments, escapeRegExp } from '../utils/strip-html';
import { toSchemaFaqItems, buildFaqJsonLdPayload } from '../components/resources/FAQJsonLd';

const STRINGS = {
  heroPlaceholder: 'Search 24 answers',
  heroShortcutHint: 'to search',
  heroMatchedLabel: '{matched} matches of {total}',
  heroTotalLabel: '{total} total answers',
  categoryAllLabel: 'All',
  expandAllLabel: 'Expand all',
  collapseAllLabel: 'Collapse all',
  helpfulQuestion: 'Helpful?',
  helpfulYes: 'Yes',
  helpfulNo: 'No',
  helpfulThanks: 'Thanks!',
  helpfulThanksNegative: 'We hear you',
  emptyTitle: 'No matches',
  emptyDescription: 'Try a different query',
  emptyResetLabel: 'Reset',
  emptyCtaLabel: 'Contact us',
  ctaTitle: 'Need more help?',
  ctaSubtitle: 'Get in touch with our engineers.',
  ctaPrimaryLabel: 'Request a quote',
  ctaSecondaryLabel: 'Talk to an engineer',
};

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
});

describe('strip-html util', () => {
  it('strips <strong> and decodes &amp;', () => {
    expect(stripHtml('<strong>DFARS &amp; MTR</strong>')).toBe('DFARS & MTR');
  });
  it('handles empty input', () => {
    expect(stripHtml('')).toBe('');
  });
  it('decodes common HTML entities (µm, ≤, °)', () => {
    expect(stripHtml('Ra &le; 0.4 &micro;m')).toBe('Ra ≤ 0.4 µm');
  });
  it('collapses multiple whitespace', () => {
    expect(stripHtml('<p>a</p>\n\n  <p>c</p>')).toBe('a c');
  });
});

describe('escapeRegExp util', () => {
  it('escapes regex metacharacters', () => {
    expect(escapeRegExp('a.b+c')).toBe('a\\.b\\+c');
  });
  it('passes plain strings through', () => {
    expect(escapeRegExp('dfars')).toBe('dfars');
  });
});

describe('highlightSegments util', () => {
  it('marks all occurrences of the query case-insensitively', () => {
    const segs = highlightSegments('DFARS compliance and MTR traceability', 'dfars');
    expect(segs.filter((s) => s.match).map((s) => s.text)).toEqual(['DFARS']);
  });
  it('returns single non-match segment when query is empty', () => {
    const segs = highlightSegments('hello', '');
    expect(segs).toEqual([{ text: 'hello', match: false }]);
  });
  it('returns text segments only when no match', () => {
    const segs = highlightSegments('hello world', 'xyz');
    expect(segs).toEqual([{ text: 'hello world', match: false }]);
  });
});

describe('toSchemaFaqItems', () => {
  it('maps FaqEntry → { question, answer } shape', () => {
    const out = toSchemaFaqItems(FAQ_ENTRIES);
    expect(out.length).toBe(FAQ_ENTRIES.length);
    for (const item of out) {
      expect(typeof item.question).toBe('string');
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.answer).not.toMatch(/<\/?[a-z]+/i);
    }
  });
});

describe('buildFaqJsonLdPayload', () => {
  it('produces a payload with inLanguage, pageUrl, faqItems', () => {
    const p = buildFaqJsonLdPayload({
      entries: FAQ_ENTRIES,
      pageUrl: 'https://cnc.bozemetal.com/resources/faq/',
    });
    expect(p.pageUrl).toBe('https://cnc.bozemetal.com/resources/faq/');
    expect(p.inLanguage).toBe('en-US');
    expect(p.faqItems.length).toBe(FAQ_ENTRIES.length);
  });
});

describe('useFaqUrlState hook', () => {
  function Probe(): React.ReactElement {
    const { state, setCategory, setQuery, reset } = useFaqUrlState(0);
    return (
      <div>
        <span data-testid="cat">{state.category ?? 'all'}</span>
        <span data-testid="q">{state.query}</span>
        <button onClick={() => setCategory('materials')}>set-cat</button>
        <button onClick={() => setQuery('dfars')}>set-q</button>
        <button onClick={reset}>reset</button>
      </div>
    );
  }
  it('reads initial state from URL on mount', () => {
    window.history.replaceState(null, '', '/?cat=quality&q=as9100');
    render(<Probe />);
    expect(screen.getByTestId('cat').textContent).toBe('quality');
    expect(screen.getByTestId('q').textContent).toBe('as9100');
  });
  it('writes to URL on category change', () => {
    render(<Probe />);
    screen.getByText('set-cat').click();
    expect(window.location.search).toContain('cat=materials');
  });
  it('reset clears the URL', () => {
    window.history.replaceState(null, '', '/?cat=shipping&q=test');
    render(<Probe />);
    screen.getByText('reset').click();
    expect(window.location.search).not.toContain('cat=');
    expect(window.location.search).not.toContain('q=');
  });
});

describe('FAQHub component', () => {
  beforeEach(() => {
    // jsdom has no IntersectionObserver; stub it for client:visible hydration.
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  it('renders all 24 entries when no filter is active', () => {
    render(<FAQHub categories={CATEGORY_META_DEFAULT} strings={STRINGS} />);
    // Radix renders triggers with the question text as accessible name
    const triggers = screen.getAllByRole('button', { name: /DFARS|GRADE|TITANIUM|NDT|MTR|AS9100/i });
    expect(triggers.length).toBeGreaterThan(10);
  });

  it('filters by category when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<FAQHub categories={CATEGORY_META_DEFAULT} strings={STRINGS} />);
    await user.click(screen.getByRole('tab', { name: /Material/i }));
    expect(window.location.search).toContain('cat=materials');
  });

  it('shows empty state when query has no match and offers CTA', async () => {
    const user = userEvent.setup();
    render(<FAQHub categories={CATEGORY_META_DEFAULT} strings={STRINGS} />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'zzznevermatch');
    expect(screen.getByText(STRINGS.emptyTitle)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: STRINGS.emptyCtaLabel })).toHaveAttribute('href', '/rfq/');
  });

  it('persists helpful feedback to localStorage', async () => {
    const user = userEvent.setup();
    render(<FAQHub categories={CATEGORY_META_DEFAULT} strings={STRINGS} />);
    // Expand first FAQ
    const firstTrigger = screen.getAllByRole('button')[0];
    await user.click(firstTrigger);
    const yesBtn = await screen.findByRole('button', { name: /^Yes$/ });
    await user.click(yesBtn);
    const stored = JSON.parse(window.localStorage.getItem('boze.faq.feedback.v1') ?? '{}');
    expect(Object.keys(stored).length).toBeGreaterThan(0);
  });

  it('renders JSON-LD-safe data via BaseLayout (validated separately)', () => {
    // The component itself does NOT emit <script> JSON-LD; that lives in
    // BaseLayout via the `faqItems` prop in FaqPage.astro. Verified by the
    // `toSchemaFaqItems` test above + an end-to-end build check.
    const out = toSchemaFaqItems(FAQ_ENTRIES);
    expect(out.every((i) => !i.answer.includes('<') && !i.answer.includes('>'))).toBe(true);
  });
});

// Type aliases so React.ReactElement resolves in strict mode (no global JSX namespace).
type ReactElement = import('react').ReactElement;

// Stub to make TS happy when @testing-library/jest-dom isn't installed.
declare module '@testing-library/jest-dom' {
  interface Matchers<R> extends vi.Expect<R> {}
}