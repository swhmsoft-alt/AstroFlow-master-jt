/**
 * FAQCategoryTabs.tsx
 *
 * Horizontal category tab strip. Implements the WAI-ARIA Tabs pattern via
 * `role="tablist"` + `role="tab"` + `aria-selected`. Each tab shows the
 * number of FAQs in its category as a chip. The first tab is "All" and
 * resets the category filter.
 *
 * Why manual (not Radix Tabs):
 *   The interaction here is single-select, doesn't need a content panel,
 *   and only changes the parent's state. A 60-line manual implementation
 *   is leaner than pulling `@radix-ui/react-tabs` (~6 KB gz). The keyboard
 *      pattern (Arrow Left/Right, Home/End) follows the APG reference.
 */
import { useCallback, useRef } from 'react';
import type { FaqCategoryId } from './faq-data';

export interface CategoryTabDef {
  readonly id: FaqCategoryId | 'all';
  readonly label: string;
  readonly count: number;
}

interface Props {
  tabs: readonly CategoryTabDef[];
  active: FaqCategoryId | 'all';
  onChange: (next: FaqCategoryId | 'all') => void;
  /** Localized "All" label. */
  allLabel: string;
}

export function FAQCategoryTabs({ tabs, active, onChange, allLabel }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = useCallback((idx: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const target = buttons?.[idx];
    if (target) {
      target.focus();
      target.click();
    }
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      if (!buttons || buttons.length === 0) return;
      const currentIdx = Array.from(buttons).findIndex((b) => b === document.activeElement);
      if (currentIdx < 0) return;

      let nextIdx: number | null = null;
      switch (event.key) {
        case 'ArrowRight':
          nextIdx = (currentIdx + 1) % buttons.length;
          break;
        case 'ArrowLeft':
          nextIdx = (currentIdx - 1 + buttons.length) % buttons.length;
          break;
        case 'Home':
          nextIdx = 0;
          break;
        case 'End':
          nextIdx = buttons.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      if (nextIdx !== null) focusTab(nextIdx);
    },
    [focusTab],
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={allLabel}
      onKeyDown={onKeyDown}
      className="flex flex-wrap items-center gap-2"
    >
      {/* "All" tab — first, special-cased so the count is the total. */}
      <CategoryTabButton
        tab={tabs[0]}
        isActive={active === 'all'}
        onClick={() => onChange('all')}
      />
      {tabs.slice(1).map((tab) => (
        <CategoryTabButton
          key={tab.id}
          tab={tab}
          isActive={active === tab.id}
          onClick={() => onChange(tab.id as FaqCategoryId)}
        />
      ))}
    </div>
  );
}

interface TabBtnProps {
  tab: CategoryTabDef;
  isActive: boolean;
  onClick: () => void;
}

function CategoryTabButton({ tab, isActive, onClick }: TabBtnProps) {
  return (
    <button
      type="button"
      role="tab"
      id={`faq-cat-tab-${tab.id}`}
      aria-selected={isActive}
      aria-controls="faq-list"
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: isActive
          ? 'var(--theme-primary)'
          : 'color-mix(in srgb, var(--theme-text) 18%, transparent)',
        backgroundColor: isActive
          ? 'color-mix(in srgb, var(--theme-primary) 14%, transparent)'
          : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
        color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)',
      }}
    >
      <span>{tab.label}</span>
      <span
        className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[0.65rem] font-semibold tabular-nums"
        style={{
          backgroundColor: isActive
            ? 'var(--theme-primary)'
            : 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
          color: isActive
            ? 'var(--theme-bg)'
            : 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
        }}
      >
        {tab.count}
      </span>
    </button>
  );
}