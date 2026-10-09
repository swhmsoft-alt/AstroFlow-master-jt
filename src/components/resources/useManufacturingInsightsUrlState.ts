/**
 * useManufacturingInsightsUrlState.ts
 *
 * Bidirectional sync between
 *   `?proc=&qual=&app=&q=&insight=&drawer=`
 * URL query params and the ManufacturingInsightsHub's React state. URL is the
 * Single Source of Truth for shareable filter state.
 *
 * Mirrors the design notes from `useDesignEngineeringUrlState.ts`:
 *   - READ synchronously inside useState initializer (no first-paint flicker).
 *   - WRITE via `history.replaceState` (typing in search does not pollute
 *     browser back history).
 *   - Writes debounced 200ms via `useDebouncedCallback`.
 *   - `popstate` listener re-syncs state on Back/paste.
 *
 * Tokens are comma-separated:
 *   ?proc=5axis-milling,high-pressure-coolant
 *   ?qual=cmm,mtr
 *   ?app=aerospace,medical
 *
 * Empty / unknown tokens are silently dropped by `parseInsightsUrlState`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from './useDebounce';
import {
  EMPTY_URL_STATE,
  parseInsightsUrlState,
  serializeInsightsUrlState,
  type ManufacturingInsightUrlState,
  type ProcessCategory,
  type QualityDimension,
  type InsightIndustry,
  type FactoryDrawerMode,
} from '../../data/manufacturing-insights-data';

export interface UseManufacturingInsightsUrlStateReturn {
  readonly state: ManufacturingInsightUrlState;
  readonly setQuery: (q: string) => void;
  readonly toggleProcess: (p: ProcessCategory) => void;
  readonly toggleQuality: (q: QualityDimension) => void;
  readonly toggleIndustry: (i: InsightIndustry) => void;
  readonly setOpenInsightId: (id: string | null) => void;
  readonly setDrawer: (d: FactoryDrawerMode | null) => void;
  readonly reset: () => void;
}

const DEBOUNCE_MS = 200;

function readFromUrl(): ManufacturingInsightUrlState {
  if (typeof window === 'undefined') return EMPTY_URL_STATE;
  return parseInsightsUrlState(new URLSearchParams(window.location.search));
}

function toggleInList<T extends string>(
  list: readonly T[],
  value: T,
): readonly T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function useManufacturingInsightsUrlState(): UseManufacturingInsightsUrlStateReturn {
  // Synchronous initializer \u2192 first render already reflects the URL.
  const [state, setState] = useState<ManufacturingInsightUrlState>(() => readFromUrl());

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── URL WRITE (debounced) ───────────────────────────────────────────
  const writeUrl = useCallback((next: ManufacturingInsightUrlState) => {
    if (typeof window === 'undefined') return;
    const currentParams = new URLSearchParams(window.location.search);
    const nextParams = serializeInsightsUrlState(next);
    // Preserve any non-Hub keys that the page might already carry.
    const merged = new URLSearchParams();
    for (const [k, v] of currentParams) {
      if (!['proc', 'qual', 'app', 'q', 'insight', 'drawer'].includes(k)) {
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

  // Browser Back / paste \u2192 popstate fires; re-sync.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const fromUrl = readFromUrl();
      const current = stateRef.current;
      if (
        fromUrl.query !== current.query ||
        fromUrl.processes.join(',') !== current.processes.join(',') ||
        fromUrl.qualityDims.join(',') !== current.qualityDims.join(',') ||
        fromUrl.industries.join(',') !== current.industries.join(',') ||
        fromUrl.openInsightId !== current.openInsightId ||
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

  const toggleProcess = useCallback((p: ProcessCategory) => {
    setState((prev) => ({
      ...prev,
      processes: toggleInList(prev.processes, p),
    }));
  }, []);

  const toggleQuality = useCallback((q: QualityDimension) => {
    setState((prev) => ({
      ...prev,
      qualityDims: toggleInList(prev.qualityDims, q),
    }));
  }, []);

  const toggleIndustry = useCallback((i: InsightIndustry) => {
    setState((prev) => ({
      ...prev,
      industries: toggleInList(prev.industries, i),
    }));
  }, []);

  const setOpenInsightId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, openInsightId: id }));
  }, []);

  const setDrawer = useCallback((d: FactoryDrawerMode | null) => {
    setState((prev) => ({ ...prev, drawer: d }));
  }, []);

  const reset = useCallback(() => setState(EMPTY_URL_STATE), []);

  return {
    state,
    setQuery,
    toggleProcess,
    toggleQuality,
    toggleIndustry,
    setOpenInsightId,
    setDrawer,
    reset,
  };
}
