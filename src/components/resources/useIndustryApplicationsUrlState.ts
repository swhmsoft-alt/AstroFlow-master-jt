/**
 * useIndustryApplicationsUrlState.ts
 *
 * Bidirectional sync between
 *   `?sector=&grade=&std=&comp=&q=&app=&drawer=`
 * URL query params and the IndustryApplicationsHub's React state. URL is
 * the Single Source of Truth for shareable filter state.
 *
 * Mirrors the design notes from `useManufacturingInsightsUrlState.ts`:
 *   - READ synchronously inside useState initializer (no first-paint flicker).
 *   - WRITE via `history.replaceState` (typing in search does not pollute
 *     browser back history).
 *   - Writes debounced 200ms via `useDebouncedCallback`.
 *   - `popstate` listener re-syncs state on Back/paste.
 *
 * Tokens are comma-separated:
 *   ?sector=aerospace-defence,marine-hydrofoil
 *   ?grade=grade-5,grade-23
 *   ?std=ams-4928,en-10204-3.1
 *
 * Empty / unknown tokens are silently dropped by `parseIndustryUrlState`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from './useDebounce';
import {
  EMPTY_URL_STATE,
  parseIndustryUrlState,
  serializeIndustryUrlState,
  type IndustryApplicationUrlState,
  type IndustrySector,
  type MaterialGradeId,
  type ComplianceStandard,
  type ComponentFunction,
  type IndustryDrawerMode,
} from '../../data/industry-applications-data';

export interface UseIndustryApplicationsUrlStateReturn {
  readonly state: IndustryApplicationUrlState;
  readonly setQuery: (q: string) => void;
  readonly toggleSector: (s: IndustrySector) => void;
  readonly toggleGrade: (g: MaterialGradeId) => void;
  readonly toggleStandard: (s: ComplianceStandard) => void;
  readonly toggleComponent: (c: ComponentFunction) => void;
  readonly setOpenCardId: (id: string | null) => void;
  readonly setDrawer: (d: IndustryDrawerMode | null) => void;
  readonly reset: () => void;
}

const DEBOUNCE_MS = 200;

function readFromUrl(): IndustryApplicationUrlState {
  if (typeof window === 'undefined') return EMPTY_URL_STATE;
  return parseIndustryUrlState(new URLSearchParams(window.location.search));
}

function toggleInList<T extends string>(
  list: readonly T[],
  value: T,
): readonly T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function useIndustryApplicationsUrlState(): UseIndustryApplicationsUrlStateReturn {
  // Synchronous initializer → first render already reflects the URL.
  const [state, setState] = useState<IndustryApplicationUrlState>(() => readFromUrl());

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── URL WRITE (debounced) ───────────────────────────────────────────
  const writeUrl = useCallback((next: IndustryApplicationUrlState) => {
    if (typeof window === 'undefined') return;
    const currentParams = new URLSearchParams(window.location.search);
    const nextParams = serializeIndustryUrlState(next);
    // Preserve any non-Hub keys that the page might already carry.
    const merged = new URLSearchParams();
    for (const [k, v] of currentParams) {
      if (!['sector', 'grade', 'std', 'comp', 'q', 'app', 'drawer'].includes(k)) {
        merged.set(k, v);
      }
    }
    for (const [k, v] of nextParams) merged.set(k, v);
    const query = merged.toString();
    const url = `${window.location.pathname}${query.length > 0 ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const writeUrlDebounced = useDebouncedCallback(writeUrl, DEBOUNCE_MS);

  useEffect(() => {
    writeUrlDebounced(state);
  }, [state, writeUrlDebounced]);

  useEffect(() => {
    return () => {
      // useDebouncedCallback handles its own cleanup.
    };
  }, []);

  // Browser Back / paste → popstate fires; re-sync.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const fromUrl = readFromUrl();
      const current = stateRef.current;
      if (
        fromUrl.query !== current.query ||
        fromUrl.sectors.join(',') !== current.sectors.join(',') ||
        fromUrl.grades.join(',') !== current.grades.join(',') ||
        fromUrl.standards.join(',') !== current.standards.join(',') ||
        fromUrl.components.join(',') !== current.components.join(',') ||
        fromUrl.openCardId !== current.openCardId ||
        fromUrl.drawer !== current.drawer
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

  const toggleSector = useCallback((s: IndustrySector) => {
    setState((prev) => ({
      ...prev,
      sectors: toggleInList(prev.sectors, s),
    }));
  }, []);

  const toggleGrade = useCallback((g: MaterialGradeId) => {
    setState((prev) => ({
      ...prev,
      grades: toggleInList(prev.grades, g),
    }));
  }, []);

  const toggleStandard = useCallback((s: ComplianceStandard) => {
    setState((prev) => ({
      ...prev,
      standards: toggleInList(prev.standards, s),
    }));
  }, []);

  const toggleComponent = useCallback((c: ComponentFunction) => {
    setState((prev) => ({
      ...prev,
      components: toggleInList(prev.components, c),
    }));
  }, []);

  const setOpenCardId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, openCardId: id }));
  }, []);

  const setDrawer = useCallback((d: IndustryDrawerMode | null) => {
    setState((prev) => ({ ...prev, drawer: d }));
  }, []);

  const reset = useCallback(() => setState(EMPTY_URL_STATE), []);

  return {
    state,
    setQuery,
    toggleSector,
    toggleGrade,
    toggleStandard,
    toggleComponent,
    setOpenCardId,
    setDrawer,
    reset,
  };
}
