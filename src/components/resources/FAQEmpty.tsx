/**
 * FAQEmpty.tsx
 *
 * Shown when the search query + category filter combination yields zero
 * results. Provides a one-click reset (back to all categories, no query) plus
 * a B2B CTA ("Talk to a Titanium Engineer → /rfq/") so the user never
 * leaves empty — they can hand-write their question to the sales team.
 */
interface Props {
  title: string;
  description: string;
  resetLabel: string;
  ctaLabel: string;
  ctaHref: string;
  onReset: () => void;
}

export function FAQEmpty({
  title,
  description,
  resetLabel,
  ctaLabel,
  ctaHref,
  onReset,
}: Props) {
  return (
    <div
      className="rounded-2xl border p-8 text-center md:p-12"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
        borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)',
        }}
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
          className="h-6 w-6"
          style={{ color: 'var(--theme-primary)' }}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>

      <h3
        className="mb-2 text-lg font-semibold md:text-xl"
        style={{ color: 'var(--theme-text)' }}
      >
        {title}
      </h3>
      <p
        className="mx-auto mb-6 max-w-md text-sm md:text-base"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}
      >
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
            color: 'var(--theme-primary)',
            backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
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
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          {resetLabel}
        </button>
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: 'var(--theme-primary)',
            color: 'var(--theme-bg)',
          }}
        >
          {ctaLabel}
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}