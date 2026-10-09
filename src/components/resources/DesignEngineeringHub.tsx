/**
 * DesignEngineeringHub.tsx
 *
 * React 19 client island for the Titanium Design Engineering Hub
 * (`/resources/design-engineering-guide/`).
 *
 * Composition (5 modules, in vertical order):
 *   1. Quick-Checker   — 4 engineering gauges (wall / tolerance / L:D / thread)
 *   2. DFM Rules Matrix — 4-facet filter sidebar + rule card grid
 *   3. Good-vs-Bad CAD Dialog — Radix Dialog opened on card click
 *   4. Engineering Calculators — Corner-radius + Thread-depth estimators
 *   5. RFQ CTA          — Bottom-of-page DFM review + RFQ buttons
 *
 * State source of truth: `useDesignEngineeringUrlState` (URL ?feat=&proc=
 * &grade=&goal=&rule=). All five modules read from / write to the same URL.
 *
 * a11y:
 *   - Filter checkbox groups use native <input type="checkbox"> with
 *     `aria-checked` and a `role="group"` wrapper.
 *   - Rule cards are <button> elements (not <a>), so they appear in the
 *     keyboard tab order with proper Enter/Space activation.
 *   - Dialog uses Radix Dialog (WAI-ARIA APG modal pattern, focus trap
 *     + ESC to close + scroll lock).
 *   - Live result count uses `role="status" aria-live="polite"`.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  DFM_RULES,
  EMPTY_DFM_STATE,
  HUB_STRINGS_EN,
  computeCornerRadius,
  computeThreadDepth,
  filterDfmRules,
  findDfmRule,
  FEATURE_CATEGORY_LABELS,
  FEATURE_CATEGORY_IDS,
  MACHINING_PROCESS_LABELS,
  MACHINING_PROCESS_IDS,
  TITANIUM_GRADE_LABELS,
  TITANIUM_GRADE_IDS,
  OPTIMIZATION_GOAL_LABELS,
  OPTIMIZATION_GOAL_IDS,
  type DFMRule,
  type DFMUrlState,
  type FeatureCategory,
  type MachiningProcess,
  type OptimizationGoal,
  type TitaniumGradeId,
  type DesignEngineeringHubStrings,
} from './design-engineering-data';
import { useDesignEngineeringUrlState } from './useDesignEngineeringUrlState';

// ────────────────────────────────────────────────────────────────────
// Re-export `DesignEngineeringHubStrings` so the .astro page can
// import it from the same module path.
// ────────────────────────────────────────────────────────────────────
export type { DesignEngineeringHubStrings } from './design-engineering-data';

// ────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────
export interface DesignEngineeringHubProps {
  /** Hub-level i18n strings. Defaults to HUB_STRINGS_EN. */
  readonly strings?: DesignEngineeringHubStrings;
  /** Optional override dataset (mostly for tests). */
  readonly rules?: readonly DFMRule[];
}

// ────────────────────────────────────────────────────────────────────
// Theme color tokens (read once, avoid re-parsing CSS vars per render).
// ────────────────────────────────────────────────────────────────────
const COLOR_ACCENT = 'var(--theme-primary)';
const COLOR_TEXT = 'var(--theme-text)';
const COLOR_TEXT_70 = 'color-mix(in srgb, var(--theme-text) 70%, transparent)';
const COLOR_TEXT_50 = 'color-mix(in srgb, var(--theme-text) 50%, transparent)';
const COLOR_TEXT_25 = 'color-mix(in srgb, var(--theme-text) 25%, transparent)';
const COLOR_TEXT_15 = 'color-mix(in srgb, var(--theme-text) 15%, transparent)';
const COLOR_SURFACE = 'color-mix(in srgb, var(--theme-surface) 90%, transparent)';
const COLOR_ACCENT_10 = 'color-mix(in srgb, var(--theme-primary) 10%, transparent)';
const COLOR_ACCENT_15 = 'color-mix(in srgb, var(--theme-primary) 15%, transparent)';
const COLOR_ACCENT_25 = 'color-mix(in srgb, var(--theme-primary) 25%, transparent)';
const COLOR_ACCENT_SOFT = 'color-mix(in srgb, var(--theme-primary) 7%, transparent)';

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

function buildRfqHref(state: DFMUrlState, baseHref: string, activeRuleId: string | null): string {
  const params = new URLSearchParams();
  if (state.features.length > 0) params.set('feat', state.features.join(','));
  if (state.processes.length > 0) params.set('proc', state.processes.join(','));
  if (state.grades.length > 0) params.set('grade', state.grades.join(','));
  if (state.goals.length > 0) params.set('goal', state.goals.join(','));
  if (activeRuleId !== null) params.set('rule', activeRuleId);
  const q = params.toString();
  // baseHref looks like "/rfq/?part=dfm-review"
  const [path, existing] = baseHref.split('?');
  const merged = new URLSearchParams(existing ?? '');
  if (q.length > 0) {
    for (const [k, v] of new URLSearchParams(q)) merged.set(k, v);
  }
  const query = merged.toString();
  return `${path ?? '/rfq/'}${query.length > 0 ? `?${query}` : ''}`;
}

function isFacetActive<T>(list: readonly T[], value: T): boolean {
  return list.includes(value);
}

function activeFilterCount(state: DFMUrlState): number {
  return (
    state.features.length +
    state.processes.length +
    state.grades.length +
    state.goals.length
  );
}

// ────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────
export default function DesignEngineeringHub(props: DesignEngineeringHubProps) {
  const strings = props.strings ?? HUB_STRINGS_EN;
  const rules = props.rules ?? DFM_RULES;
  const url = useDesignEngineeringUrlState();

  const filtered = useMemo(() => filterDfmRules(rules, url.state), [rules, url.state]);
  const activeRule = useMemo(
    () => (url.state.activeRule !== null ? findDfmRule(rules, url.state.activeRule) : undefined),
    [rules, url.state.activeRule],
  );

  // Reset rule dialog when the active rule is no longer in the filtered set
  // (e.g. user filtered it out, or it's an unknown id from a stale URL).
  useEffect(() => {
    if (url.state.activeRule !== null && activeRule === undefined) {
      url.setActiveRule(null);
    }
  }, [url.state.activeRule, activeRule, url]);

  const handleOpenRule = useCallback((id: string) => url.setActiveRule(id), [url]);
  const handleCloseRule = useCallback(() => url.setActiveRule(null), [url]);
  const filterCount = activeFilterCount(url.state);

  // RFQ href carries all active filters + the currently-open rule id.
  const rfqHref = useMemo(
    () => buildRfqHref(url.state, strings.ctaPrimaryHref, url.state.activeRule),
    [url.state, strings.ctaPrimaryHref],
  );
  const dialogRfqHref = useMemo(
    () => buildRfqHref(url.state, strings.dialogRfqHref, url.state.activeRule),
    [url.state, strings.dialogRfqHref],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* ── MODULE 1: QUICK-CHECKER ──────────────────────────────── */}
      <QuickChecker
        strings={strings}
        onOpenRule={handleOpenRule}
      />

      {/* ── MODULE 2 + 3: DFM RULES MATRIX + DIALOG ─────────────── */}
      <div className="mt-12">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="text-2xl font-bold leading-tight md:text-3xl"
              style={{ color: COLOR_TEXT }}
            >
              {strings.rulesTitle}
            </h2>
            <p className="mt-1 text-sm md:text-base" style={{ color: COLOR_TEXT_70 }}>
              {strings.rulesSubtitle}
            </p>
          </div>
          {filterCount > 0 && (
            <button
              type="button"
              onClick={url.reset}
              aria-label={strings.filterResetLabel}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
              style={{
                borderColor: COLOR_ACCENT_25,
                color: COLOR_ACCENT,
              }}
            >
              <span aria-hidden="true">×</span>
              <span>{strings.filterResetLabel}</span>
              <span className="rounded-full px-1.5 text-[0.65rem]" style={{ background: COLOR_ACCENT_10 }}>
                {filterCount}
              </span>
            </button>
          )}
        </header>

        <div
          className="text-xs mb-3"
          role="status"
          aria-live="polite"
          style={{ color: COLOR_TEXT_50 }}
        >
          Showing {filtered.length} of {rules.length} DFM rules
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            state={url.state}
            onToggleFeature={url.toggleFeature}
            onToggleProcess={url.toggleProcess}
            onToggleGrade={url.toggleGrade}
            onToggleGoal={url.toggleGoal}
            onReset={url.reset}
            strings={strings}
            rules={rules}
          />

          <div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                {filtered.map((r) => (
                  <RuleCard
                    key={r.id}
                    rule={r}
                    onOpen={handleOpenRule}
                    strings={strings}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                onReset={url.reset}
                strings={strings}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── MODULE 4: ENGINEERING CALCULATORS ────────────────────── */}
      <Calculators strings={strings} />

      {/* ── MODULE 5: BOTTOM CTA ─────────────────────────────────── */}
      <RfqCta
        strings={strings}
        rfqHref={rfqHref}
      />

      {/* ── MODULE 3 (continued): GOOD-VS-BAD DIALOG ────────────── */}
      <RuleDialog
        rule={activeRule ?? null}
        open={activeRule !== undefined}
        onOpenChange={(open) => { if (!open) handleCloseRule(); }}
        dialogRfqHref={dialogRfqHref}
        strings={strings}
      />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: QuickChecker (4 engineering gauges)
// ────────────────────────────────────────────────────────────────────
interface QuickCheckerProps {
  strings: DesignEngineeringHubStrings;
  onOpenRule: (id: string) => void;
}

function QuickChecker({ strings, onOpenRule }: QuickCheckerProps) {
  const gauges: ReadonlyArray<{
    label: string;
    value: string;
    ruleId: string;
    ariaHint: string;
  }> = [
    { label: strings.quickCheckerWallLabel, value: strings.quickCheckerWallValue, ruleId: 'thin-wall', ariaHint: 'Open thin-wall DFM rule' },
    { label: strings.quickCheckerToleranceLabel, value: strings.quickCheckerToleranceValue, ruleId: '5axis-toolpath', ariaHint: 'Open 5-axis tolerance DFM rule' },
    { label: strings.quickCheckerDeepHoleLabel, value: strings.quickCheckerDeepHoleValue, ruleId: 'deep-hole', ariaHint: 'Open deep-hole DFM rule' },
    { label: strings.quickCheckerThreadLabel, value: strings.quickCheckerThreadValue, ruleId: 'thread-depth', ariaHint: 'Open thread depth DFM rule' },
  ];
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ borderColor: COLOR_ACCENT_25, background: COLOR_ACCENT_SOFT }}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold md:text-xl" style={{ color: COLOR_TEXT }}>
            {strings.quickCheckerTitle}
          </h2>
          <p className="mt-0.5 text-xs md:text-sm" style={{ color: COLOR_TEXT_70 }}>
            {strings.quickCheckerSubtitle}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {gauges.map((g) => (
          <button
            key={g.ruleId}
            type="button"
            onClick={() => onOpenRule(g.ruleId)}
            aria-label={`${g.label}: ${g.value} — ${g.ariaHint}`}
            className="group flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] md:p-4"
            style={{
              borderColor: COLOR_TEXT_15,
              backgroundColor: COLOR_SURFACE,
            }}
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
              {g.label}
            </span>
            <span className="text-xl font-bold tabular-nums md:text-2xl" style={{ color: COLOR_TEXT }}>
              {g.value}
            </span>
            <span className="text-[0.65rem] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: COLOR_TEXT_50 }}>
              click to open rule →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: FilterSidebar (4-facet checkbox groups)
// ────────────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  state: DFMUrlState;
  rules: readonly DFMRule[];
  onToggleFeature: (f: FeatureCategory) => void;
  onToggleProcess: (p: MachiningProcess) => void;
  onToggleGrade: (g: TitaniumGradeId) => void;
  onToggleGoal: (g: OptimizationGoal) => void;
  onReset: () => void;
  strings: DesignEngineeringHubStrings;
}

function FilterSidebar(props: FilterSidebarProps) {
  const { state, rules, onToggleFeature, onToggleProcess, onToggleGrade, onToggleGoal, onReset, strings } = props;

  // Count per facet, ignoring the filter for that dimension
  // (so the user can see "if I also ticked X, I'd get N rules").
  const featureCounts = useMemo(() => countByFacet(rules, state, 'features'), [rules, state]);
  const processCounts = useMemo(() => countByFacet(rules, state, 'processes'), [rules, state]);
  const gradeCounts = useMemo(() => countByFacet(rules, state, 'grades'), [rules, state]);
  const goalCounts = useMemo(() => countByFacet(rules, state, 'goals'), [rules, state]);

  return (
    <aside
      className="rounded-xl border p-4"
      style={{ borderColor: COLOR_TEXT_15, background: COLOR_SURFACE }}
      aria-label="Filter DFM rules"
    >
      <FacetGroup
        label={strings.filterFeaturesLabel}
        ids={FEATURE_CATEGORY_IDS}
        labels={FEATURE_CATEGORY_LABELS}
        active={state.features}
        counts={featureCounts}
        onToggle={(id) => onToggleFeature(id as FeatureCategory)}
      />
      <FacetGroup
        label={strings.filterProcessesLabel}
        ids={MACHINING_PROCESS_IDS}
        labels={MACHINING_PROCESS_LABELS}
        active={state.processes}
        counts={processCounts}
        onToggle={(id) => onToggleProcess(id as MachiningProcess)}
      />
      <FacetGroup
        label={strings.filterGradesLabel}
        ids={TITANIUM_GRADE_IDS}
        labels={TITANIUM_GRADE_LABELS}
        active={state.grades}
        counts={gradeCounts}
        onToggle={(id) => onToggleGrade(id as TitaniumGradeId)}
      />
      <FacetGroup
        label={strings.filterGoalsLabel}
        ids={OPTIMIZATION_GOAL_IDS}
        labels={OPTIMIZATION_GOAL_LABELS}
        active={state.goals}
        counts={goalCounts}
        onToggle={(id) => onToggleGoal(id as OptimizationGoal)}
      />
      <button
        type="button"
        onClick={onReset}
        className="mt-3 w-full rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
        style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT_70 }}
      >
        {strings.filterResetLabel}
      </button>
    </aside>
  );
}

function countByFacet(
  rules: readonly DFMRule[],
  state: DFMUrlState,
  dim: 'features' | 'processes' | 'grades' | 'goals',
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  const stateWithout: DFMUrlState = { ...state, [dim]: [] };
  const filtered = filterDfmRules(rules, stateWithout);
  for (const r of filtered) {
    const tags = r[dim];
    for (const t of tags) counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts;
}

interface FacetGroupProps {
  label: string;
  ids: readonly string[];
  labels: Readonly<Record<string, string>>;
  active: readonly string[];
  counts: Readonly<Record<string, number>>;
  onToggle: (id: string) => void;
}

function FacetGroup({ label, ids, labels, active, counts, onToggle }: FacetGroupProps) {
  return (
    <div className="mb-4 last:mb-0" role="group" aria-label={label}>
      <div
        className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider"
        style={{ color: COLOR_ACCENT }}
      >
        {label}
      </div>
      <ul className="space-y-1">
        {ids.map((id) => {
          const isActive = active.includes(id);
          const count = counts[id] ?? 0;
          return (
            <li key={id}>
              <label
                className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-white/5"
                style={{ opacity: count === 0 ? 0.45 : 1 }}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onToggle(id)}
                    aria-checked={isActive}
                    aria-label={labels[id] ?? id}
                    className="h-3.5 w-3.5 cursor-pointer accent-[var(--theme-primary)]"
                  />
                  <span style={{ color: COLOR_TEXT }}>{labels[id] ?? id}</span>
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums"
                  style={{
                    background: isActive ? COLOR_ACCENT_15 : COLOR_TEXT_15,
                    color: isActive ? COLOR_ACCENT : COLOR_TEXT_50,
                  }}
                >
                  {count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: RuleCard (clickable card → opens Dialog)
// ────────────────────────────────────────────────────────────────────
interface RuleCardProps {
  rule: DFMRule;
  onOpen: (id: string) => void;
  strings: DesignEngineeringHubStrings;
}

function RuleCard({ rule, onOpen, strings: _strings }: RuleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(rule.id)}
      aria-label={`${rule.title} — open Good-vs-Bad comparison`}
      id={`rule-${rule.id}`}
      className="group flex h-full flex-col items-stretch rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2"
      style={{
        borderColor: COLOR_TEXT_15,
        background: COLOR_SURFACE,
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider"
          style={{
            background: rule.featured ? COLOR_ACCENT_15 : COLOR_TEXT_15,
            color: rule.featured ? COLOR_ACCENT : COLOR_TEXT_50,
          }}
        >
          {rule.featured ? '★ Featured' : 'Standard'}
        </span>
        <span
          className="text-[0.6rem] font-medium uppercase tracking-wider"
          style={{ color: COLOR_TEXT_50 }}
        >
          {rule.id}
        </span>
      </div>

      <h3 className="mb-1 text-base font-bold leading-tight md:text-lg" style={{ color: COLOR_TEXT }}>
        {rule.title}
      </h3>
      <p className="mb-3 text-xs leading-relaxed md:text-sm" style={{ color: COLOR_TEXT_70 }}>
        {rule.directAnswer}
      </p>

      <dl className="mb-3 space-y-1 text-xs">
        {rule.parameters.slice(0, 2).map((p) => (
          <div key={p.label} className="flex items-baseline gap-2">
            <dt className="shrink-0 text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
              {p.label}
            </dt>
            <dd className="font-mono font-semibold tabular-nums" style={{ color: COLOR_ACCENT }}>
              {p.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap gap-1">
        {rule.evidenceStandards.slice(0, 2).map((s) => (
          <span
            key={s.id}
            className="rounded px-1.5 py-0.5 text-[0.6rem] font-medium"
            style={{
              background: COLOR_TEXT_15,
              color: COLOR_TEXT_70,
            }}
          >
            {s.spec}
          </span>
        ))}
        <span
          className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: COLOR_ACCENT }}
        >
          Open comparison →
        </span>
      </div>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: EmptyState
// ────────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  strings: DesignEngineeringHubStrings;
  onReset: () => void;
}

function EmptyState({ strings, onReset }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center"
      style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT_70 }}
    >
      <svg
        className="mb-3 h-10 w-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
        />
      </svg>
      <h3 className="mb-1 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.emptyTitle}
      </h3>
      <p className="mb-4 max-w-sm text-sm" style={{ color: COLOR_TEXT_70 }}>
        {strings.emptyDescription}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-md border px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
        style={{ borderColor: COLOR_ACCENT_25, color: COLOR_ACCENT }}
      >
        {strings.emptyResetLabel}
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: Calculators (corner-radius + thread-depth)
// ────────────────────────────────────────────────────────────────────
interface CalculatorsProps {
  strings: DesignEngineeringHubStrings;
}

function Calculators({ strings }: CalculatorsProps) {
  return (
    <section className="mt-12" aria-label={strings.calculatorTitle}>
      <header className="mb-4">
        <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ color: COLOR_TEXT }}>
          {strings.calculatorTitle}
        </h2>
        <p className="mt-1 text-sm md:text-base" style={{ color: COLOR_TEXT_70 }}>
          {strings.calculatorSubtitle}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CornerRadiusCalculator strings={strings} />
        <ThreadDepthCalculator strings={strings} />
      </div>
    </section>
  );
}

function CornerRadiusCalculator({ strings }: { strings: DesignEngineeringHubStrings }) {
  const [toolDiameter, setToolDiameter] = useState<number>(6);
  const result = useMemo(() => computeCornerRadius({ toolDiameterMm: toolDiameter }), [toolDiameter]);
  return (
    <div
      className="rounded-xl border p-4 md:p-5"
      style={{ borderColor: COLOR_ACCENT_25, background: COLOR_ACCENT_SOFT }}
    >
      <h3 className="mb-1 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.calculatorCornerTitle}
      </h3>
      <p className="mb-3 text-[0.7rem]" style={{ color: COLOR_TEXT_50 }}>
        {strings.calculatorCornerExample}
      </p>
      <label className="mb-3 block">
        <span
          className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider"
          style={{ color: COLOR_ACCENT }}
        >
          {strings.calculatorCornerToolLabel}
        </span>
        <input
          type="number"
          min={0.5}
          max={50}
          step={0.5}
          value={toolDiameter}
          onChange={(e) => setToolDiameter(parseFloat(e.target.value) || 0)}
          aria-label={strings.calculatorCornerToolLabel}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
          style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT }}
        />
      </label>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
            {strings.calculatorCornerMinLabel}
          </dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: COLOR_ACCENT }}>
            R ≥ {result.minimumRadiusMm.toFixed(2)} mm
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
            {strings.calculatorCornerRecommendedLabel}
          </dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: COLOR_TEXT }}>
            R {result.recommendedRadiusMm.toFixed(2)} mm
          </dd>
        </div>
      </dl>
    </div>
  );
}

function ThreadDepthCalculator({ strings }: { strings: DesignEngineeringHubStrings }) {
  const [diameter, setDiameter] = useState<number>(6);
  const [depth, setDepth] = useState<number>(10);
  const [through, setThrough] = useState<boolean>(false);
  const result = useMemo(
    () =>
      computeThreadDepth({
        nominalDiameterMm: diameter,
        threadDepthMm: depth,
        throughHole: through,
      }),
    [diameter, depth, through],
  );
  const costColor: Readonly<Record<typeof result.costBand, string>> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return (
    <div
      className="rounded-xl border p-4 md:p-5"
      style={{ borderColor: COLOR_ACCENT_25, background: COLOR_ACCENT_SOFT }}
    >
      <h3 className="mb-3 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.calculatorThreadTitle}
      </h3>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span
            className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider"
            style={{ color: COLOR_ACCENT }}
          >
            {strings.calculatorThreadDiameterLabel}
          </span>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            value={diameter}
            onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
            aria-label={strings.calculatorThreadDiameterLabel}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
            style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT }}
          />
        </label>
        <label className="block">
          <span
            className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider"
            style={{ color: COLOR_ACCENT }}
          >
            {strings.calculatorThreadDepthLabel}
          </span>
          <input
            type="number"
            min={1}
            max={300}
            step={0.5}
            value={depth}
            onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
            aria-label={strings.calculatorThreadDepthLabel}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
            style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT }}
          />
        </label>
      </div>
      <fieldset className="mb-3">
        <legend
          className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider"
          style={{ color: COLOR_ACCENT }}
        >
          {strings.calculatorThreadTypeLabel}
        </legend>
        <div className="flex gap-2">
          {[
            { v: false, label: strings.calculatorThreadTypeBlind },
            { v: true, label: strings.calculatorThreadTypeThrough },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs"
              style={{
                borderColor: through === opt.v ? COLOR_ACCENT : COLOR_TEXT_25,
                background: through === opt.v ? COLOR_ACCENT_10 : 'transparent',
                color: COLOR_TEXT,
              }}
            >
              <input
                type="radio"
                name="thread-hole-type"
                checked={through === opt.v}
                onChange={() => setThrough(opt.v)}
                className="cursor-pointer accent-[var(--theme-primary)]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <dl className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
            {strings.calculatorThreadRatioLabel}
          </dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: COLOR_TEXT }}>
            {result.ratioD.toFixed(2)} ×D
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
            {strings.calculatorThreadLimitLabel}
          </dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: COLOR_TEXT }}>
            {result.limit.toFixed(1)} mm
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
            {strings.calculatorThreadRecoLabel}
          </dt>
          <dd
            className="mt-0.5 text-sm font-bold uppercase tracking-wider"
            style={{ color: costColor[result.costBand] }}
          >
            {result.recommendation.replace('-', ' ')}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: RfqCta (bottom-of-page DFM review CTA)
// ────────────────────────────────────────────────────────────────────
interface RfqCtaProps {
  strings: DesignEngineeringHubStrings;
  rfqHref: string;
}

function RfqCta({ strings, rfqHref }: RfqCtaProps) {
  return (
    <section
      className="mt-12 rounded-2xl border p-6 md:p-8"
      style={{ borderColor: COLOR_ACCENT_25, background: COLOR_ACCENT_SOFT }}
      aria-label={strings.ctaTitle}
    >
      <h2 className="text-xl font-bold md:text-2xl" style={{ color: COLOR_TEXT }}>
        {strings.ctaTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed md:text-base" style={{ color: COLOR_TEXT_70 }}>
        {strings.ctaSubtitle}
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {strings.ctaBullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 text-xs"
            style={{ color: COLOR_TEXT_70 }}
          >
            <svg
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ color: COLOR_ACCENT }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={rfqHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: COLOR_ACCENT, color: 'var(--theme-bg, #fff)' }}
        >
          {strings.ctaPrimaryLabel}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        <a
          href={strings.ctaSecondaryHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ borderColor: COLOR_ACCENT_25, color: COLOR_TEXT }}
        >
          {strings.ctaSecondaryLabel}
        </a>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: RuleDialog (Good-vs-Bad CAD comparison modal)
// ────────────────────────────────────────────────────────────────────
interface RuleDialogProps {
  rule: DFMRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRfqHref: string;
  strings: DesignEngineeringHubStrings;
}

function RuleDialog({ rule, open, onOpenChange, dialogRfqHref, strings }: RuleDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(96vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-5 shadow-2xl focus:outline-none md:p-7"
          style={{ background: 'var(--theme-bg)', borderColor: COLOR_ACCENT_25 }}
          aria-describedby={rule ? `rule-${rule.id}-desc` : undefined}
        >
          {rule ? (
            <>
              <Dialog.Title className="text-xl font-bold md:text-2xl" style={{ color: COLOR_TEXT }}>
                {rule.title}
              </Dialog.Title>
              <Dialog.Description
                id={`rule-${rule.id}-desc`}
                className="mt-1 text-sm"
                style={{ color: COLOR_TEXT_70 }}
              >
                {rule.directAnswer}
              </Dialog.Description>

              {/* Good vs Bad CAD comparison */}
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>
                  <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>
                    ✗ {strings.dialogBadLabel}
                  </div>
                  <h3 className="mb-1 text-base font-bold" style={{ color: COLOR_TEXT }}>
                    {rule.comparison.badLabel}
                  </h3>
                  <div
                    className="my-3 overflow-hidden rounded-md"
                    style={{ color: '#ef4444' }}
                    dangerouslySetInnerHTML={{ __html: rule.comparison.badSvg }}
                  />
                  <p className="mb-2 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                    {rule.comparison.badDescription}
                  </p>
                  <div className="rounded-md border px-2 py-1.5 text-[0.7rem] font-semibold" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                    {strings.dialogCostImpactLabel}: {rule.comparison.badCostImpact}
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: '#10b981', background: 'rgba(16,185,129,0.06)' }}>
                  <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#10b981' }}>
                    ✓ {strings.dialogGoodLabel}
                  </div>
                  <h3 className="mb-1 text-base font-bold" style={{ color: COLOR_TEXT }}>
                    {rule.comparison.goodLabel}
                  </h3>
                  <div
                    className="my-3 overflow-hidden rounded-md"
                    style={{ color: '#10b981' }}
                    dangerouslySetInnerHTML={{ __html: rule.comparison.goodSvg }}
                  />
                  <p className="mb-2 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                    {rule.comparison.goodDescription}
                  </p>
                  <div className="rounded-md border px-2 py-1.5 text-[0.7rem] font-semibold" style={{ borderColor: '#10b981', color: '#10b981' }}>
                    {strings.dialogCostImpactLabel}: {rule.comparison.goodCostImpact}
                  </div>
                </div>
              </div>

              {/* Engineering parameters */}
              <section className="mt-5">
                <h4 className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
                  {strings.dialogParametersLabel}
                </h4>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {rule.parameters.map((p) => (
                    <li
                      key={p.label}
                      className="flex flex-col rounded-md border px-3 py-2"
                      style={{ borderColor: COLOR_TEXT_15, background: COLOR_SURFACE }}
                    >
                      <span className="text-[0.65rem] font-semibold uppercase" style={{ color: COLOR_TEXT_50 }}>
                        {p.label}
                      </span>
                      <span className="font-mono text-sm font-bold tabular-nums" style={{ color: COLOR_ACCENT }}>
                        {p.value}
                      </span>
                      {p.condition ? (
                        <span className="text-[0.7rem]" style={{ color: COLOR_TEXT_50 }}>
                          {p.condition}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Failure + countermeasure */}
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <section>
                  <h4 className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
                    {strings.dialogFailureLabel}
                  </h4>
                  <p className="mb-2 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                    {rule.failure.summary}
                  </p>
                  <ul className="space-y-0.5 text-[0.7rem]" style={{ color: COLOR_TEXT_50 }}>
                    {rule.failure.evidence.map((e) => (
                      <li key={e} className="font-mono">• {e}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4 className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
                    {strings.dialogCountermeasureLabel}
                  </h4>
                  <p className="mb-2 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                    {rule.countermeasure.summary}
                  </p>
                  <ul className="space-y-0.5 text-[0.7rem]" style={{ color: COLOR_TEXT_70 }}>
                    {rule.countermeasure.strategies.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Tolerances */}
              <section className="mt-5">
                <h4 className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
                  {strings.dialogTolerancesLabel}
                </h4>
                <dl
                  className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs md:grid-cols-3"
                  style={{ borderColor: COLOR_TEXT_15 }}
                >
                  <div><dt style={{ color: COLOR_TEXT_50 }}>GD&T</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.gdntStandard}</dd></div>
                  <div><dt style={{ color: COLOR_TEXT_50 }}>ISO 2768</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.isoStandard}</dd></div>
                  <div><dt style={{ color: COLOR_TEXT_50 }}>Linear</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.typicalLinearMm}</dd></div>
                  <div><dt style={{ color: COLOR_TEXT_50 }}>Tight</dt><dd className="font-mono font-semibold" style={{ color: COLOR_ACCENT }}>{rule.tolerances.achievableTightMm}</dd></div>
                  <div><dt style={{ color: COLOR_TEXT_50 }}>Inspection</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.inspectionMethod}</dd></div>
                  <div><dt style={{ color: COLOR_TEXT_50 }}>Ra</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.surfaceRoughnessRa}</dd></div>
                  <div className="col-span-2 md:col-span-3"><dt style={{ color: COLOR_TEXT_50 }}>Material cert</dt><dd className="font-mono font-semibold" style={{ color: COLOR_TEXT }}>{rule.tolerances.materialCert}</dd></div>
                </dl>
              </section>

              {/* Standards */}
              <section className="mt-4">
                <h4 className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
                  {strings.dialogStandardsLabel}
                </h4>
                <ul className="flex flex-wrap gap-1.5">
                  {rule.evidenceStandards.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-md border px-2 py-1 text-[0.7rem]"
                      style={{ borderColor: COLOR_TEXT_25, background: COLOR_SURFACE }}
                      title={s.summary}
                    >
                      <span className="font-mono font-semibold" style={{ color: COLOR_ACCENT }}>{s.spec}</span>
                      <span className="ml-1" style={{ color: COLOR_TEXT_70 }}>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* CTA */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
                    style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT_70 }}
                  >
                    {strings.dialogCloseLabel}
                  </button>
                </Dialog.Close>
                <a
                  href={dialogRfqHref}
                  className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: COLOR_ACCENT, color: 'var(--theme-bg, #fff)' }}
                >
                  {strings.dialogRfqLabel}
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
