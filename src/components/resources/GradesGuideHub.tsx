/**
 * GradesGuideHub.tsx
 *
 * React 19 client island for the Titanium Grades Selection Hub
 * (`/resources/titanium-grades-guide/`). Provides a multi-select
 * chip group (max 3 grades) with side-by-side comparison table.
 *
 * URL state: `?compare=g2,g5,g23` (shareable, debounced 200ms write).
 * Selection survives back/forward via `popstate`.
 *
 * a11y:
 *   - Chip group is a `role="group"` with aria-label.
 *   - Selected state announced via `aria-pressed`.
 *   - Reset button has aria-label.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HUB_GRADES,
  HUB_STRINGS_EN,
  MAX_COMPARE,
  type GradesGuideStrings,
  type HubGrade,
  type HubGradeKey,
  isHubGradeKey,
} from './grades-guide-data';

const DEBOUNCE_MS = 200;

function readSelectionFromUrl(): HubGradeKey[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('compare');
  if (raw === null || raw.length === 0) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is HubGradeKey => isHubGradeKey(s))
    .slice(0, MAX_COMPARE);
}

function writeSelectionToUrl(next: HubGradeKey[]): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (next.length === 0) params.delete('compare');
  else params.set('compare', next.join(','));
  const query = params.toString();
  const url = `${window.location.pathname}${query.length > 0 ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', url);
}

export interface GradesGuideHubProps {
  readonly strings?: GradesGuideStrings;
  /** Path for "Request CNC Quote" CTA. Default: `/rfq/`. */
  readonly rfqHref?: string;
}

export default function GradesGuideHub(props: GradesGuideHubProps) {
  const strings = props.strings ?? HUB_STRINGS_EN;
  const rfqHref = props.rfqHref ?? '/rfq/';

  const [selected, setSelected] = useState<HubGradeKey[]>(() =>
    readSelectionFromUrl(),
  );
  const writeTimerRef = useRef<number | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (writeTimerRef.current !== null) {
      window.clearTimeout(writeTimerRef.current);
    }
    writeTimerRef.current = window.setTimeout(() => {
      writeSelectionToUrl(selectedRef.current);
      writeTimerRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (writeTimerRef.current !== null) {
        window.clearTimeout(writeTimerRef.current);
      }
    };
  }, [selected]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => setSelected(readSelectionFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const toggle = useCallback((key: HubGradeKey) => {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, key];
    });
  }, []);

  const reset = useCallback(() => {
    setSelected([]);
  }, []);

  const selectedGrades = useMemo<readonly HubGrade[]>(
    () =>
      selected
        .map((k) => HUB_GRADES.find((g) => g.key === k))
        .filter((g): g is HubGrade => g !== undefined),
    [selected],
  );

  const rfqHrefWithGrades = useMemo(() => {
    if (selectedGrades.length === 0) return rfqHref;
    const param =
      'material=' +
      encodeURIComponent(selectedGrades.map((g) => g.name).join(' / '));
    return `${rfqHref}?${param}`;
  }, [rfqHref, selectedGrades]);

  const selectedCountLabel = strings.interactiveSelectedCountTemplate.replace(
    '{n}',
    String(selectedGrades.length),
  );

  return (
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
            {strings.interactiveTitle}
          </h3>
          <p className="mt-2 text-sm md:text-base" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>
            {strings.interactiveSubtitle}
          </p>
        </div>
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
            color: 'var(--theme-primary)',
          }}
        >
          {selectedCountLabel}
        </div>
      </div>

      <div role="group" aria-label="Select titanium grades to compare (max 3)" className="flex flex-wrap gap-3 mb-6">
        {HUB_GRADES.map((g) => {
          const isSelected = selected.includes(g.key);
          const isDisabled = !isSelected && selected.length >= MAX_COMPARE;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => toggle(g.key)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all border-2"
              style={{
                backgroundColor: isSelected
                  ? 'var(--theme-primary)'
                  : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                color: isSelected ? 'var(--theme-bg, #fff)' : 'var(--theme-text)',
                borderColor: isSelected
                  ? 'var(--theme-primary)'
                  : 'color-mix(in srgb, var(--theme-text) 25%, transparent)',
                opacity: isDisabled ? 0.45 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {g.name.split(' – ')[0]}
            </button>
          );
        })}
      </div>

      {selectedGrades.length === 0 ? (
        <div
          className="text-center py-10 px-4 rounded-xl"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--theme-bg) 50%, transparent)',
            border: '1px dashed color-mix(in srgb, var(--theme-text) 20%, transparent)',
          }}
        >
          <p className="text-sm md:text-base" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>
            {strings.interactivePlaceholder}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ color: 'var(--theme-text)', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th
                  className="text-left p-3 font-semibold border-b"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--theme-text) 15%, transparent)',
                    color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
                    minWidth: '160px',
                  }}
                  scope="col"
                >
                  Property
                </th>
                {selectedGrades.map((g) => (
                  <th
                    key={g.key}
                    className="text-left p-3 font-bold border-b"
                    style={{
                      borderColor: 'var(--theme-primary)',
                      color: 'var(--theme-primary)',
                      minWidth: '180px',
                    }}
                    scope="col"
                  >
                    {g.name.split(' – ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                { label: strings.unsLabel, get: (g: HubGrade) => g.uns },
                { label: strings.classificationLabel, get: (g: HubGrade) => g.classification },
                { label: strings.rmLabel, get: (g: HubGrade) => g.rm },
                { label: strings.rp02Label, get: (g: HubGrade) => g.rp02 },
                { label: strings.a5Label, get: (g: HubGrade) => g.a5 },
                { label: strings.densityLabel, get: (g: HubGrade) => g.density },
                { label: strings.maxTempLabel, get: (g: HubGrade) => g.maxTemp },
              ] as const).map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="text-left p-3 font-medium border-b align-top"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                      color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
                    }}
                  >
                    {row.label}
                  </th>
                  {selectedGrades.map((g) => (
                    <td
                      key={g.key}
                      className="p-3 border-b align-top"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                      }}
                    >
                      {row.get(g)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <a
          href={rfqHrefWithGrades}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            backgroundColor: 'var(--theme-primary)',
            color: 'var(--theme-bg, #fff)',
          }}
        >
          {strings.interactiveCtaLabel}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        {selectedGrades.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label={strings.interactiveResetLabel}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all border-2"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--theme-text)',
              borderColor: 'color-mix(in srgb, var(--theme-text) 25%, transparent)',
            }}
          >
            {strings.interactiveResetLabel}
          </button>
        )}
      </div>
    </div>
  );
}
