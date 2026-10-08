/**
 * useDebounce.ts
 *
 * Native React hooks — no `lodash` dependency. Used by the FAQ search input
 * to throttle URL writes and re-filtering work.
 */
import { useEffect, useRef, useState } from 'react';

/**
 * Returns `value` only after it has remained stable for `delay` ms.
 * First render returns the initial value synchronously (no debounce on first paint).
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

/**
 * Returns a stable, debounced wrapper around `callback`. The latest callback
 * reference is captured on every render (via ref) so consumers can pass an
 * inline lambda without invalidating the debounce timer.
 */
export function useDebouncedCallback<Args extends readonly unknown[]>(
  callback: (...args: Args) => void,
  delay = 250,
): (...args: Args) => void {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (...args: Args) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      cbRef.current(...args);
      timerRef.current = null;
    }, delay);
  };
}