/**
 * FAQAccordionList.tsx
 *
 * Container for the FAQ accordion group. Wraps `Accordion.Root` from Radix
 * UI and renders the "Expand all / Collapse all" toolbar at the top of the
 * list. Open state is fully controlled — the parent passes `openIds` and
 * `onOpenChange` so the hash-direct-link and external controls work.
 */
import { useCallback, useMemo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import type { FaqEntry, FaqCategoryId } from './faq-data';
import { FAQAccordionItem, type FAQAccordionItemStrings } from './FAQAccordionItem';

interface Props {
  entries: readonly FaqEntry[];
  /** id → category-label lookup for the header chip. */
  categoryLabels: Readonly<Record<FaqCategoryId, string>>;
  openIds: readonly string[];
  onOpenChange: (nextIds: readonly string[]) => void;
  query: string;
  feedbackMap: Readonly<Record<string, 'yes' | 'no'>>;
  onFeedback: (faqId: string, helpful: boolean) => void;
  strings: FAQAccordionItemStrings;
  expandAllLabel: string;
  collapseAllLabel: string;
}

export function FAQAccordionList({
  entries,
  categoryLabels,
  openIds,
  onOpenChange,
  query,
  feedbackMap,
  onFeedback,
  strings,
  expandAllLabel,
  collapseAllLabel,
}: Props) {
  const allOpen = useMemo(
    () => entries.length > 0 && openIds.length === entries.length,
    [entries.length, openIds.length],
  );

  const onToggleAll = useCallback(() => {
    if (allOpen) {
      onOpenChange([]);
    } else {
      onOpenChange(entries.map((e) => e.id));
    }
  }, [allOpen, entries, onOpenChange]);

  // Radix Accordion expects `string[]` — narrow the readonly in the controlled API.
  const handleValueChange = useCallback(
    (value: string[]) => {
      onOpenChange(value);
    },
    [onOpenChange],
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
        >
          {entries.length} {entries.length === 1 ? 'answer' : 'answers'}
        </span>
        <button
          type="button"
          onClick={onToggleAll}
          className="rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)',
            color: 'var(--theme-primary)',
            backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
          }}
          aria-pressed={allOpen}
        >
          {allOpen ? collapseAllLabel : expandAllLabel}
        </button>
      </div>

      <Accordion.Root
        type="multiple"
        value={openIds as string[]}
        onValueChange={handleValueChange}
        id="faq-list"
        role="region"
        aria-label="FAQ list"
        className="space-y-3"
      >
        {entries.map((entry) => (
          <FAQAccordionItem
            key={entry.id}
            entry={entry}
            categoryLabel={categoryLabels[entry.category]}
            isOpen={openIds.includes(entry.id)}
            onOpenChange={(open) => {
              const next = open
                ? Array.from(new Set([...openIds, entry.id]))
                : openIds.filter((id) => id !== entry.id);
              onOpenChange(next);
            }}
            query={query}
            feedback={feedbackMap[entry.id] ?? null}
            onFeedback={(helpful) => onFeedback(entry.id, helpful)}
            strings={strings}
          />
        ))}
      </Accordion.Root>
    </div>
  );
}