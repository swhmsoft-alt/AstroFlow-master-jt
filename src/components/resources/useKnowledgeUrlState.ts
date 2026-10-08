/**
 * useKnowledgeUrlState.ts
 *
 * Bidirectional sync between `?q=&grade=&process=&std=&app=&view=` URL
 * query params and the KnowledgeBaseHub's React state. The URL is the
 * Single Source of Truth for shareable filter state — anyone copying the
 * URL sees the same filtered view.
 *
 * Mirrors the design notes from `useFaqUrlState.ts`:
 *   - We READ synchronously inside `useState`'s initializer (avoids a paint
 *     flicker where the unfiltered list flashes for 1 ms before the URL is
 *     parsed).
 *   - We WRITE via `history.replaceState` (not `pushState`) — typing in the
 *     search box should NOT pollute the browser back history.
 *   - Writes are debounced 200ms to avoid history thrash on every keystroke.
 *   - The `popstate` listener re-syncs state when the user hits Back.
 *
 * Comma-separated tokens in the URL: `?grade=alpha-beta-gr5,alpha-beta-gr23`
 * is the canonical shape. Empty / unknown values are silently dropped.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EMPTY_FILTERS,
  isKnowledgeGrade,
  isKnowledgeProcess,
  isKnowledgeStandard,
  isKnowledgeIndustry,
  isKnowledgeViewMode,
  type KnowledgeFilters,
  type KnowledgeGrade,
  type KnowledgeProcess,
  type KnowledgeStandard,
  type KnowledgeIndustry,
  type KnowledgeViewMode,
} from './knowledge-data';

export interface UseKnowledgeUrlStateReturn {
  state: KnowledgeFilters;
  setQuery: (q: string) => void;
  toggleGrade: (g: KnowledgeGrade) => void;
  toggleProcess: (p: KnowledgeProcess) => void;
  toggleStandard: (s: KnowledgeStandard) => void;
  toggleIndustry: (i: KnowledgeIndustry) => void;
  setView: (v: KnowledgeViewMode) => void;
  reset: () => void;
}

const DEBOUNCE_MS = 200;

function parseList<T>(
  raw: string | null,
  guard: (v: string) => v is T,
): readonly T[] {
  if (raw === null) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .filter(guard);
}

function readFromUrl(): KnowledgeFilters {
  if (typeof window === 'undefined') return EMPTY_FILTERS;
  const params = new URLSearchParams(window.location.search);
  const viewRaw = params.get('view');
  const view: KnowledgeViewMode = viewRaw !== null && isKnowledgeViewMode(viewRaw) ? viewRaw : 'grid';
  return {
    query: params.get('q') ?? '',
    grades: parseList(params.get('grade'), isKnowledgeGrade),
    processes: parseList(params.get('process'), isKnowledgeProcess),
    standards: parseList(params.get('std'), isKnowledgeStandard),
    industries: parseList(params.get('app'), isKnowledgeIndustry),
    view,
  };
}

function toggleInList<T>(list: readonly T[], value: T): readonly T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function useKnowledgeUrlState(): UseKnowledgeUrlStateReturn {
  // Synchronous initializer → first render already reflects the URL.
  const [state, setState] = useState<KnowledgeFilters>(() => readFromUrl());

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── URL WRITE (debounced via raw setTimeout, no lodash dep) ───────────
  const writeTimerRef = useRef<number | null>(null);
  const writeUrlNow = useCallback((next: KnowledgeFilters) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (key: string, value: string) => {
      if (value.length === 0) params.delete(key);
      else params.set(key, value);
    };
    setOrDelete('q', next.query.trim());
    setOrDelete('grade', next.grades.join(','));
    setOrDelete('process', next.processes.join(','));
    setOrDelete('std', next.standards.join(','));
    setOrDelete('app', next.industries.join(','));
    setOrDelete('view', next.view === 'grid' ? '' : next.view);
    const query = params.toString();
    const url = `${window.location.pathname}${query.length > 0 ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const scheduleWrite = useCallback((next: KnowledgeFilters) => {
    if (typeof window === 'undefined') return;
    if (writeTimerRef.current !== null) window.clearTimeout(writeTimerRef.current);
    writeTimerRef.current = window.setTimeout(() => {
      writeUrlNow(next);
      writeTimerRef.current = null;
    }, DEBOUNCE_MS);
  }, [writeUrlNow]);

  // Update URL whenever state changes (debounced).
  useEffect(() => {
    // Empty state → no params; if URL already empty, skip the write.
    const isEmpty =
      state.query === '' &&
      state.grades.length === 0 &&
      state.processes.length === 0 &&
      state.standards.length === 0 &&
      state.industries.length === 0 &&
      state.view === 'grid';
    if (isEmpty && typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (Array.from(p.keys()).length === 0) return;
    }
    scheduleWrite(state);
  }, [state, scheduleWrite]);

  // Cleanup pending write timer on unmount.
  useEffect(() => {
    return () => {
      if (writeTimerRef.current !== null) window.clearTimeout(writeTimerRef.current);
    };
  }, []);

  // Cross-tab / browser-back: when the user hits "Back" or pastes a URL,
  // popstate fires. We re-sync state to whatever is in the URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const fromUrl = readFromUrl();
      const current = stateRef.current;
      if (
        fromUrl.query !== current.query ||
        fromUrl.grades.join(',') !== current.grades.join(',') ||
        fromUrl.processes.join(',') !== current.processes.join(',') ||
        fromUrl.standards.join(',') !== current.standards.join(',') ||
        fromUrl.industries.join(',') !== current.industries.join(',') ||
        fromUrl.view !== current.view
      ) {
        setState(fromUrl);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const toggleGrade = useCallback((g: KnowledgeGrade) => {
    setState((prev) => ({ ...prev, grades: toggleInList(prev.grades, g) }));
  }, []);
  const toggleProcess = useCallback((p: KnowledgeProcess) => {
    setState((prev) => ({ ...prev, processes: toggleInList(prev.processes, p) }));
  }, []);
  const toggleStandard = useCallback((s: KnowledgeStandard) => {
    setState((prev) => ({ ...prev, standards: toggleInList(prev.standards, s) }));
  }, []);
  const toggleIndustry = useCallback((i: KnowledgeIndustry) => {
    setState((prev) => ({ ...prev, industries: toggleInList(prev.industries, i) }));
  }, []);

  const setView = useCallback((view: KnowledgeViewMode) => {
    setState((prev) => ({ ...prev, view }));
  }, []);

  const reset = useCallback(() => setState(EMPTY_FILTERS), []);

  return {
    state, setQuery,
    toggleGrade, toggleProcess, toggleStandard, toggleIndustry,
    setView, reset,
  };
}
