/**
 * FAQKeyboardHandler.tsx
 *
 * Global keyboard shortcuts for the FAQ page:
 *   - `/`           → focus search input
 *   - `Ctrl+K` / `⌘K` → focus search input (search-engine-like)
 *
 * The handler is registered on `window` (capture) so it works regardless of
 * where the user is focused on the page. It explicitly bails out if the
 * user is inside an input, textarea, or contenteditable element to avoid
 * hijacking normal typing.
 *
 * Renders nothing — pure side-effect component.
 */
import { useEffect } from 'react';

interface Props {
  /** Ref to the search input element. May be null on SSR / before mount. */
  searchInputRef: React.RefObject<HTMLInputElement>;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches('input, textarea, [contenteditable="true"], [contenteditable=""]')) {
    return true;
  }
  return false;
}

export function FAQKeyboardHandler({ searchInputRef }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onKey = (event: KeyboardEvent) => {
      // Bail if typing in any input/textarea.
      if (isTypingTarget(event.target)) return;
      // Bail if any modifier other than the ones we use.
      if (event.altKey || event.shiftKey) return;

      const isSlash = event.key === '/';
      const isCmdK =
        (event.metaKey || event.ctrlKey) &&
        (event.key === 'k' || event.key === 'K');

      if (!isSlash && !isCmdK) return;

      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchInputRef]);

  return null;
}