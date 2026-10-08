/**
 * KnowledgeCTA.tsx
 *
 * Bottom-of-page B2B CTA — always rendered (even on empty state) so a
 * landing visitor who hasn't filtered anything still sees the conversion
 * path. Mirrors the FAQCTA pattern but with a knowledge-base specific
 * value prop (cross-references the deep technical content above).
 */
interface Props {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  bullets: readonly string[];
}

export function KnowledgeCTA({
  title, subtitle, primaryLabel, primaryHref,
  secondaryLabel, secondaryHref, bullets,
}: Props) {
  return (
    <section
      className="mt-12 rounded-2xl border p-6 md:p-10"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--theme-surface) 70%, transparent)',
        borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)',
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="mb-3 text-2xl font-bold md:text-3xl"
          style={{ color: 'var(--theme-text)' }}
        >
          {title}
        </h2>
        <p
          className="mb-6 text-base md:text-lg"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
        >
          {subtitle}
        </p>

        <ul
          className="mb-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
        >
          {bullets.map((b) => (
            <li key={b} className="inline-flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                style={{ color: 'var(--theme-primary)' }}
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: 'var(--theme-primary)',
              color: 'var(--theme-bg)',
            }}
          >
            {primaryLabel}
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
          <a
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-primary) 35%, transparent)',
              color: 'var(--theme-primary)',
            }}
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
