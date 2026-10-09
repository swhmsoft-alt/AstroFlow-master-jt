/**
 * useDesignEngineeringUrlState.ts
 *
 * Bidirectional sync between `?feat=&proc=&grade=&goal=&rule=` URL
 * query params and the DesignEngineeringHub's React state. The URL is
 * the Single Source of Truth for shareable filter state — anyone
 * copying the URL sees the same filtered view.
 *
 * Mirrors the design notes from `useFaqUrlState.ts`:
 *   - We READ synchronously inside `useState`'s initializer (avoids a paint
 *     flicker where the unfiltered list flashes for 1 ms before the URL is
 *     parsed).
 *   - We WRITE via `history.replaceState` (not `pushState`) — typing in the
 *     search box should NOT pollute the browser back history.
 *   - Writes are debounced 200ms via `useDebouncedCallback` to avoid history
 *     thrash on every keystroke.
 *   - The `popstate` listener re-syncs state when the user hits Back.
 *
 * Comma-separated tokens in the URL: `?feat=pocketing,thin-wall`.
 * Empty / unknown values are silently dropped by `parseDfmUrlState()`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EMPTY_DFM_STATE,
  parseDfmUrlState,
  serializeDfmUrlState,
  type DFMUrlState,
  type FeatureCategory,
  type MachiningProcess,
  type OptimizationGoal,
  type TitaniumGradeId,
} from './design-engineering-data';
import { useDebouncedCallback } from './useDebounce';

export interface UseDesignEngineeringUrlStateReturn {
  state: DFMUrlState;
  toggleFeature: (f: FeatureCategory) => void;
  toggleProcess: (p: MachiningProcess) => void;
  toggleGrade: (g: TitaniumGradeId) => void;
  toggleGoal: (g: OptimizationGoal) => void;
  setActiveRule: (id: string | null) => void;
  reset: () => void;
}

const DEBOUNCE_MS = 200;

function readFromUrl(): DFMUrlState {
  if (typeof window === 'undefined') return EMPTY_DFM_STATE;
  return parseDfmUrlState(new URLSearchParams(window.location.search));
}

function toggleInList<T>(list: readonly T[], value: T): readonly T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function useDesignEngineeringUrlState(): UseDesignEngineeringUrlStateReturn {
  // Synchronous initializer → first render already reflects the URL.
  const [state, setState] = useState<DFMUrlState>(() => readFromUrl());

  // Keep a ref so the popstate listener reads the latest state without
  // re-subscribing on every state change.
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── URL WRITE (debounced) ───────────────────────────────────────────
  const writeUrl = useCallback((next: DFMUrlState) => {
    if (typeof window === 'undefined') return;
    const currentParams = new URLSearchParams(window.location.search);
    const nextParams = serializeDfmUrlState(next);
    // Merge: keep any non-DFM params that the page might have.
    const merged = new URLSearchParams();
    for (const [k, v] of currentParams) {
      if (!['feat', 'proc', 'grade', 'goal', 'rule'].includes(k)) {
        merged.set(k, v);
      }
    }
    for (const [k, v] of nextParams) merged.set(k, v);
    const query = merged.toString();
    const url = `${window.location.pathname}${query.length > 0 ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const writeUrlDebounced = useDebouncedCallback(writeUrl, DEBOUNCE_MS);

  // Update URL whenever state changes (debounced).
  useEffect(() => {
    writeUrlDebounced(state);
  }, [state, writeUrlDebounced]);

  // Cleanup pending write timer on unmount.
  useEffect(() => {
    return () => {
      // useDebouncedCallback's internal cleanup is handled by its own hook.
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
        fromUrl.features.join(',') !== current.features.join(',') ||
        fromUrl.processes.join(',') !== current.processes.join(',') ||
        fromUrl.grades.join(',') !== current.grades.join(',') ||
        fromUrl.goals.join(',') !== current.goals.join(',') ||
        fromUrl.activeRule !== current.activeRule
      ) {
        setState(fromUrl);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const toggleFeature = useCallback((f: FeatureCategory) => {
    setState((prev) => ({ ...prev, features: toggleInList(prev.features, f) }));
  }, []);
  const toggleProcess = useCallback((p: MachiningProcess) => {
    setState((prev) => ({ ...prev, processes: toggleInList(prev.processes, p) }));
  }, []);
  const toggleGrade = useCallback((g: TitaniumGradeId) => {
    setState((prev) => ({ ...prev, grades: toggleInList(prev.grades, g) }));
  }, []);
  const toggleGoal = useCallback((g: OptimizationGoal) => {
    setState((prev) => ({ ...prev, goals: toggleInList(prev.goals, g) }));
  }, []);
  const setActiveRule = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeRule: id }));
  }, []);

  const reset = useCallback(() => setState(EMPTY_DFM_STATE), []);

  return {
    state,
    toggleFeature,
    toggleProcess,
    toggleGrade,
    toggleGoal,
    setActiveRule,
    reset,
  };
}
