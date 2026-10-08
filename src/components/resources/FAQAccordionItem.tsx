/**
 * FAQAccordionItem.tsx
 *
 * Single FAQ accordion row built on `@radix-ui/react-accordion`. Radix
 * implements the WAI-ARIA APG accordion spec, including:
 *   - `aria-expanded`, `aria-controls`, `aria-labelledby` on the trigger
 *   - Up/Down arrow keys move focus between triggers within the group
 *   - Home/End jump to first/last trigger
 *   - Enter/Space toggle
 *
 * Visible behaviors layered on top:
 *   - Search keyword highlighting in the question (rendered via segments).
 *   - Category badge + tag chips on the collapsed header.
 *   - "Was this helpful? Yes / No" feedback row at the bottom of the panel.
 */
import { useMemo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import type { FaqEntry, FaqCategoryId } from './faq-data';
import { highlightSegments } from '../../utils/strip-html';

export interface FAQAccordionItemStrings {
  readonly helpfulQuestion: string;
  readonly helpfulYes: string;
  readonly helpfulNo: string;
  readonly helpfulThanks: string;
  readonly helpfulThanksNegative: string;
}

interface Props {
  entry: FaqEntry;
  categoryLabel: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current search query (verbatim) — drives the highlight. */
  query: string;
  feedback: 'yes' | 'no' | null;
  onFeedback: (helpful: boolean) => void;
  strings: FAQAccordionItemStrings;
}

export function FAQAccordionItem({
  entry,
  categoryLabel,
  isOpen,
  onOpenChange,
  query,
  feedback,
  onFeedback,
  strings,
}: Props) {
  const segments = useMemo(
    () => highlightSegments(entry.question, query),
    [entry.question, query],
  );

  const triggerDomId = `faq-trigger-${entry.id}`;
  const panelDomId = `faq-panel-${entry.id}`;
  const itemDomId = `faq-${entry.id}`;

  return (
    <Accordion.Item
      value={entry.id}
      id={itemDomId}
      className="group overflow-hidden rounded-xl border transition-colors data-[state=open]:border-[color:var(--theme-primary)]"
      style={{
        borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--theme-surface) 80%, transparent)',
      }}
    >
      <Accordion.Header asChild>
        <h3 className="m-0">
          <Accordion.Trigger
            id={triggerDomId}
            className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_5%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 md:px-6 md:py-5"
          >
            <span className="flex-1">
              <span
                className="mb-1 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--theme-primary)' }}
              >
                <span>{categoryLabel}</span>
                {entry.tags.length > 0 ? (
                  <span
                    aria-hidden="true"
                    style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}
                  >
                    ·
                  </span>
                ) : null}
                {entry.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-1.5 py-0.5 normal-case tracking-normal"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
                      color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </span>
              <span
                className="block text-base font-semibold leading-snug md:text-lg"
                style={{ color: 'var(--theme-text)' }}
              >
                {segments.map((seg, i) =>
                  seg.match ? (
                    <mark
                      key={i}
                      className="rounded px-0.5"
                      style={{
                        backgroundColor:
                          'color-mix(in srgb, var(--theme-primary) 28%, transparent)',
                        color: 'var(--theme-text)',
                      }}
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  ),
                )}
              </span>
            </span>
            <span
              className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-data-[state=open]:rotate-180"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent)',
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
                className="h-3.5 w-3.5"
                style={{ color: 'var(--theme-primary)' }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </Accordion.Trigger>
        </h3>
      </Accordion.Header>

      <Accordion.Content
        id={panelDomId}
        className="overflow-hidden text-sm"
      >
        <div
          className="border-t px-5 pb-3 md:px-6 md:pb-4"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
            color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
          }}
        >
          <div
            className="prose prose-invert mt-3 max-w-prose text-[0.95rem] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: entry.answerHtml }}
          />

          <FAQFeedback
            faqId={entry.id}
            categoryId={entry.category}
            feedback={feedback}
            onFeedback={onFeedback}
            strings={strings}
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

interface FAQFeedbackProps {
  faqId: string;
  categoryId: FaqCategoryId;
  feedback: 'yes' | 'no' | null;
  onFeedback: (helpful: boolean) => void;
  strings: FAQAccordionItemStrings;
}

function FAQFeedback({ faqId, categoryId, feedback, onFeedback, strings }: FAQFeedbackProps) {
  return (
    <div
      className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 md:mt-5 md:pt-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)',
      }}
      data-faq-feedback={faqId}
      data-faq-category={categoryId}
    >
      <span
        className="text-xs font-medium"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
      >
        {strings.helpfulQuestion}
      </span>
      <FeedbackButton
        active={feedback === 'yes'}
        onClick={() => onFeedback(true)}
        variant="yes"
        label={strings.helpfulYes}
      />
      <FeedbackButton
        active={feedback === 'no'}
        onClick={() => onFeedback(false)}
        variant="no"
        label={strings.helpfulNo}
      />
      {feedback !== null ? (
        <span
          className="text-xs italic"
          style={{ color: 'var(--theme-primary)' }}
          role="status"
          aria-live="polite"
        >
          {feedback === 'yes' ? strings.helpfulThanks : strings.helpfulThanksNegative}
        </span>
      ) : null}
    </div>
  );
}

const COLOR_YES = '#22c55e';
const COLOR_NO = '#ef4444';
const INACTIVE_BORDER = 'color-mix(in srgb, var(--theme-text) 20%, transparent)';
const INACTIVE_TEXT = 'color-mix(in srgb, var(--theme-text) 80%, transparent)';

interface FeedbackBtnProps {
  active: boolean;
  onClick: () => void;
  variant: 'yes' | 'no';
  label: string;
}

function FeedbackButton({ active, onClick, variant, label }: FeedbackBtnProps) {
  const accent = variant === 'yes' ? COLOR_YES : COLOR_NO;
  const accentBorder = `color-mix(in srgb, ${accent} 40%, transparent)`;
  const accentBg = `color-mix(in srgb, ${accent} 18%, transparent)`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: active ? accentBorder : INACTIVE_BORDER,
        backgroundColor: active ? accentBg : 'transparent',
        color: active ? accent : INACTIVE_TEXT,
      }}
    >
      <span aria-hidden="true">{variant === 'yes' ? '👍' : '👎'}</span>
      <span>{label}</span>
    </button>
  );
}