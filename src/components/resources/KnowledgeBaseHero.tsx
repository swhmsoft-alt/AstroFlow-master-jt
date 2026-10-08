/**
 * KnowledgeBaseHero.tsx
 *
 * Hero block for the Titanium Knowledge Base. Contains:
 *   - debounced search input (Grade / ASTM / process match)
 *   - "Popular Topics" pill row (one-click shortcuts)
 *
 * a11y: the input is a `<input type="search">` with `role="searchbox"`
 * (implicit), `aria-label`, and a visible focus ring. Result counter uses
 * `role="status"` + `aria-live="polite"` so screen readers announce the
 * match count after debounce settles.
 */
import { useId, type RefObject } from 'react';

export interface KnowledgeBaseHeroStrings {
  readonly searchPlaceholder: string;
  readonly shortcutHint: string;
  readonly resultTotalTemplate: string;  // "Showing {n} technical articles"
  readonly resultFilteredTemplate: string;  // "Showing {matched} of {total} articles"
  readonly popularTopicsLabel: string;
  readonly clearSearchLabel: string;
}

export interface PopularTopic {
  readonly id: string;
  readonly label: string;
  readonly query: string;
}

interface Props {
  value: string;
  onChange: (next: string) => void;
  statusText: string;
  inputRef: RefObject<HTMLInputElement>;
  strings: KnowledgeBaseHeroStrings;
  popularTopics: readonly PopularTopic[];
  onPopularTopic: (topic: PopularTopic) => void;
}

export function KnowledgeBaseHero({
  value,
  onChange,
  statusText,
  inputRef,
  strings,
  popularTopics,
  onPopularTopic,
}: Props) {
  const inputId = useId();

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">
      <label htmlFor={inputId} className="sr-only">
        {strings.searchPlaceholder}
      </label>
      <div
        className="relative flex items-center rounded-2xl border transition-shadow focus-within:shadow-lg"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-surface) 88%, transparent)',
          borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
        }}
      >
        <span
          className="pointer-events-none absolute left-4 flex items-center"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            style={{ color: 'var(--theme-primary)' }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={strings.searchPlaceholder}
          aria-label={strings.searchPlaceholder}
          aria-controls="knowledge-grid"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="w-full bg-transparent py-4 pl-12 pr-12 text-base outline-none md:text-lg"
          style={{ color: 'var(--theme-text)' }}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={strings.clearSearchLabel}
            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p
        className="mt-3 text-center text-sm"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
        role="status"
        aria-live="polite"
      >
        {statusText}
      </p>

      {/* Popular topics — single-click shortcut, drives the search query. */}
      {popularTopics.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
          >
            {strings.popularTopicsLabel}:
          </span>
          {popularTopics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPopularTopic(t)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)',
                color: 'var(--theme-primary)',
                backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
