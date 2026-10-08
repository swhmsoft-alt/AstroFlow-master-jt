/**
 * FAQCTA.tsx
 *
 * Bottom-of-page B2B conversion block. Two buttons, both to `/rfq/` per
 * the design decision — primary "Request a Custom Quote" (visible above the
 * fold as the strongest CTA) and secondary "Talk to a Titanium Engineer"
 * (less aggressive, framed as a conversation).
 */
interface Props {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  /** Visual feature chips under the buttons — used to reinforce trust. */
  bullets?: readonly string[];
}

export function FAQCTA({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  bullets,
}: Props) {
  return (
    <section
      className="mt-16 overflow-hidden rounded-2xl border p-8 md:mt-20 md:p-12"
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface)) 0%, var(--theme-surface) 60%, color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface)) 100%)',
        borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
      }}
    >
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              color: 'var(--theme-primary)',
            }}
          >
            <span aria-hidden="true">⚡</span>
            <span>Direct line</span>
          </div>
          <h2
            className="mb-3 text-2xl font-bold leading-tight md:text-3xl"
            style={{ color: 'var(--theme-text)' }}
          >
            {title}
          </h2>
          <p
            className="text-sm leading-relaxed md:text-base"
            style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href={primaryHref}
            className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-all hover:opacity-90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)',
              color: 'var(--theme-primary)',
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {secondaryLabel}
          </a>

          {bullets && bullets.length > 0 ? (
            <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    style={{ color: 'var(--theme-primary)' }}
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}