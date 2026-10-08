/**
 * FAQHeroSearch.tsx
 *
 * Hero-block search input for the FAQ page. Rendered inside the existing
 * `SubpageHero` slot. Emits `onChange(value)` on every keystroke; the
 * upstream `FAQHub` is responsible for debouncing the URL write + filter.
 *
 * a11y:
 *   - `role="searchbox"` is implicit on `<input type="search">`.
 *   - `aria-label` describes purpose for screen readers (the label is also
 *     exposed visually via placeholder).
 *   - The keyboard shortcut hint (`/` / `⌘K`) is rendered next to the input
 *     to advertise the keyboard-only path. It is purely visual; the shortcut
 *     itself is handled by `FAQKeyboardHandler`.
 */
import { useId } from 'react';

interface Props {
  value: string;
  onChange: (next: string) => void;
  /** Visible placeholder text — also used as `aria-label`. */
  placeholder: string;
  /** e.g. "or press ⌘K" — visual hint for the keyboard shortcut. */
  shortcutHint: string;
  /** Pre-formatted status string — e.g. "Showing 6 of 24 answers" */
  statusText: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function FAQHeroSearch({
  value,
  onChange,
  placeholder,
  shortcutHint,
  statusText,
  inputRef,
}: Props) {
  const inputId = useId();

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
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
          placeholder={placeholder}
          aria-label={placeholder}
          aria-controls="faq-list"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="w-full bg-transparent py-4 pl-12 pr-28 text-base outline-none md:text-lg"
          style={{ color: 'var(--theme-text)' }}
        />
        <span
          className="pointer-events-none absolute right-4 hidden items-center gap-1 text-xs font-medium md:flex"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
          aria-hidden="true"
        >
          <kbd
            className="rounded border px-1.5 py-0.5 font-mono text-[0.7rem]"
            style={{
              borderColor: 'color-mix(in srgb, var(--theme-text) 25%, transparent)',
              color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
            }}
          >
            /
          </kbd>
          <span>{shortcutHint}</span>
        </span>
      </div>

      {/* Result counter — non-visual status conveyed via aria-live */}
      <p
        className="mt-3 text-center text-sm"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
        role="status"
        aria-live="polite"
      >
        {statusText}
      </p>
    </div>
  );
}