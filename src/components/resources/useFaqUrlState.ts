/**
 * useFaqUrlState.ts
 *
 * Bidirectional sync between `?cat=...&q=...` URL query params and the FAQ
 * hub's React state. The URL is the Single Source of Truth for shareable
 * filter state — anyone copying the URL sees the same filtered view.
 *
 * Design notes:
 *   - We READ synchronously inside `useState`'s initializer (avoids a paint
 *     flicker where the unfiltered list flashes for 1 ms before the URL is
 *     parsed).
 *   - We WRITE via `history.replaceState` (not `pushState`) — typing in the
 *     search box should NOT pollute the browser back history.
 *   - Writes are debounced 200ms via `useDebouncedCallback` to avoid history
 *     thrash on every keystroke.
 *   - Hash changes (#faq-...) are NOT handled here — they live in FAQHub's
 *     own hashchange effect (which also triggers scroll).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FaqCategoryId } from './faq-data';
import { FAQ_CATEGORY_IDS } from './faq-data';
import { useDebouncedCallback } from './useDebounce';

export interface FaqUrlState {
  /** null = "All categories" */
  category: FaqCategoryId | null;
  query: string;
}

export interface UseFaqUrlStateReturn {
  state: FaqUrlState;
  setCategory: (category: FaqCategoryId | null) => void;
  setQuery: (query: string) => void;
  reset: () => void;
}

const CATEGORY_SET: ReadonlySet<string> = new Set(FAQ_CATEGORY_IDS);

function isFaqCategoryId(v: string | null): v is FaqCategoryId {
  return v !== null && CATEGORY_SET.has(v);
}

function readFromUrl(): FaqUrlState {
  if (typeof window === 'undefined') return { category: null, query: '' };
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  const qParam = params.get('q') ?? '';
  return {
    category: isFaqCategoryId(catParam) ? catParam : null,
    query: qParam,
  };
}

/**
 * Synchronizes the filter state with `?cat=…&q=…` query params.
 * @param debounceMs — debounce for URL writes (avoids history thrash).
 */
export function useFaqUrlState(debounceMs = 200): UseFaqUrlStateReturn {
  // Synchronous initializer → first render already reflects the URL.
  const [state, setState] = useState<FaqUrlState>(() => readFromUrl());

  // Keep a ref so listeners (popstate / direct callers) read latest state
  // without re-subscribing.
  const stateRef = useRef(state);
  stateRef.current = state;

  const writeUrl = useCallback((next: FaqUrlState) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (next.category === null) params.delete('cat');
    else params.set('cat', next.category);
    if (next.query.trim().length === 0) params.delete('q');
    else params.set('q', next.query);
    const query = params.toString();
    const url = `${window.location.pathname}${query.length > 0 ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const writeUrlDebounced = useDebouncedCallback(writeUrl, debounceMs);

  // Update URL whenever state changes (debounced).
  useEffect(() => {
    // If both are empty defaults, skip — no need to write the same URL again.
    if (state.category === null && state.query === '') {
      writeUrl(state);
      return;
    }
    writeUrlDebounced(state);
  }, [state, writeUrl, writeUrlDebounced]);

  // Cross-tab / browser-back: when the user hits "Back" or pastes a URL,
  // popstate fires. We re-sync state to whatever is in the URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const fromUrl = readFromUrl();
      const current = stateRef.current;
      if (
        fromUrl.category !== current.category ||
        fromUrl.query !== current.query
      ) {
        setState(fromUrl);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setCategory = useCallback((category: FaqCategoryId | null) => {
    setState((prev) => ({ ...prev, category }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const reset = useCallback(() => {
    setState({ category: null, query: '' });
  }, []);

  return { state, setCategory, setQuery, reset };
}