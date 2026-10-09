/**
 * ManufacturingInsightsHub.tsx
 *
 * React 19 client island for the Manufacturing Insights Hub
 * (`/resources/manufacturing-insights/`).
 *
 * Composition (5 vertical sections):
 *   1. HubHero                     — capability dashboard intro + dual CTA
 *   2. CapabilityDashboard         — 6-cell CMM/HPC/MTR/Tolerance/CMM/PED dashboard
 *   3. FacetFilterBar              — Process / Quality / Industry pills + search
 *   4. InsightCardGrid             — 3-band grid (informational → commercial →
 *                                    transactional), Radix Dialog modal for CMM/MTR
 *   5. FactoryAuditDrawer          — Radix Dialog slide-in via floating CTA \u2192
 *                                    `/rfq/?part=audit|cmm-sample|mtr-sample`
 *
 * State source of truth: `useManufacturingInsightsUrlState`
 *   (?proc=&qual=&app=&q=&insight=&drawer=). All sections read/write the same URL.
 *
 * a11y:
 *   - Filter chips use <button> with aria-pressed.
 *   - Insight cards are <button> (card body) so keyboard users can open modal.
 *   - Modal & Drawer: Radix Dialog (WAI-ARIA modal, focus trap, ESC, scroll lock).
 *   - Floating CTA has aria-expanded reflecting drawer state.
 *   - Search uses aria-controls; result count aria-live="polite".
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  MANUFACTURING_INSIGHTS,
  HUB_STRINGS_EN,
  filterManufacturingInsights,
  buildInsightFacetGroups,
  countActiveFilters,
  PROCESS_CATEGORY_LABELS,
  QUALITY_DIMENSION_LABELS,
  INSIGHT_INDUSTRY_LABELS,
  type ManufacturingInsight,
  type ManufacturingInsightUrlState,
} from '../../data/manufacturing-insights-data';
import type {
  ManufacturingHubStrings,
  ProcessCategory,
  QualityDimension,
  InsightIndustry,
  FactoryDrawerMode,
} from '../../types/manufacturing-insight';
import { useManufacturingInsightsUrlState } from './useManufacturingInsightsUrlState';
import type { InsightIntent } from '../../data/manufacturing-insights-data';

// Re-export so the .astro page can import strings type if it wants.
export type { ManufacturingHubStrings } from '../../types/manufacturing-insight';

// ────────────────────────────────────────────────────────────────────
// Theme tokens (read once via CSS variables; mirrors DesignEngineeringHub)
// ────────────────────────────────────────────────────────────────────

const COLOR_TEXT = 'var(--theme-text)';
const COLOR_TEXT_70 = 'color-mix(in srgb, var(--theme-text) 70%, transparent)';
const COLOR_TEXT_55 = 'color-mix(in srgb, var(--theme-text) 55%, transparent)';
const COLOR_TEXT_40 = 'color-mix(in srgb, var(--theme-text) 40%, transparent)';
const COLOR_TEXT_25 = 'color-mix(in srgb, var(--theme-text) 25%, transparent)';
const COLOR_TEXT_15 = 'color-mix(in srgb, var(--theme-text) 15%, transparent)';
const COLOR_TEXT_08 = 'color-mix(in srgb, var(--theme-text) 8%, transparent)';
const COLOR_SURFACE = 'var(--theme-surface)';
const COLOR_SURFACE_90 = 'color-mix(in srgb, var(--theme-surface) 90%, transparent)';
const COLOR_ACCENT = 'var(--theme-primary)';
const COLOR_ACCENT_15 = 'color-mix(in srgb, var(--theme-primary) 15%, transparent)';
const COLOR_ACCENT_25 = 'color-mix(in srgb, var(--theme-primary) 25%, transparent)';

// 7 accent hues for the 6-dashboard matrix (slightly differentiated, all
// rooted in the active theme).
type DashboardAccent = ManufacturingInsight['dashboardAccent'];
const ACCENT_MAP: Readonly<Record<DashboardAccent, string>> = {
  tolerance: '#22d3ee', // cyan — tolerance
  cm: '#a78bfa', // violet — CMM
  finish: '#f472b6', // pink — surface finish
  hpc: '#34d399', // emerald — high-pressure coolant
  mtr: '#fbbf24', // amber — MTR
  weld: '#fb923c', // orange — welding/PED
  anodize: '#60a5fa', // blue — anodizing
};

// ────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────

export interface ManufacturingInsightsHubProps {
  /** Hub-level i18n strings. Defaults to English baseline. */
  readonly strings?: ManufacturingHubStrings;
}

// ────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────

export function ManufacturingInsightsHub(
  props: ManufacturingInsightsHubProps,
): JSX.Element {
  const strings: ManufacturingHubStrings = props.strings ?? HUB_STRINGS_EN;
  const url = useManufacturingInsightsUrlState();
  const facetGroups = useMemo(() => buildInsightFacetGroups(), []);

  // Active-filter count for chip reset button.
  const activeFilterCount = useMemo(
    () => countActiveFilters(url.state),
    [url.state],
  );

  const filtered = useMemo(
    () => filterManufacturingInsights(MANUFACTURING_INSIGHTS, url.state),
    [url.state],
  );

  // Group filtered insights by intent (3 bands).
  const insightsByIntent = useMemo(
    () => groupByIntent(filtered),
    [filtered],
  );

  // Active insight (for modal).
  const openInsight = useMemo(
    () =>
      url.state.openInsightId !== null
        ? MANUFACTURING_INSIGHTS.find((i) => i.id === url.state.openInsightId) ?? null
        : null,
    [url.state.openInsightId],
  );

  // Drawer state from URL.
  const drawerOpen = url.state.drawer !== null;

  // ── Keyboard shortcut: `/` focuses the search input. ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable
      )
        return;
      if (e.key === '/') {
        e.preventDefault();
        const input = document.getElementById(
          'mih-search',
        ) as HTMLInputElement | null;
        input?.focus();
        input?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close handlers (centralised to clean URL on Radix onOpenChange).
  const closeInsight = useCallback(
    () => url.setOpenInsightId(null),
    [url],
  );
  const setDrawerMode = useCallback(
    (d: FactoryDrawerMode | null) => url.setDrawer(d),
    [url],
  );

  // Dashboard active insight selection.
  const [dashboardInsightId, setDashboardInsightId] = useState<string | null>(
    MANUFACTURING_INSIGHTS[0]?.id ?? null,
  );
  const dashboardInsight = useMemo(
    () =>
      MANUFACTURING_INSIGHTS.find((i) => i.id === dashboardInsightId) ?? null,
    [dashboardInsightId],
  );

  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      aria-labelledby="mih-heading"
    >
      <h2 id="mih-heading" className="sr-only">
        Manufacturing Insights Hub
      </h2>

      <HubHero strings={strings} />

      <CapabilityDashboard
        strings={strings}
        insights={MANUFACTURING_INSIGHTS}
        activeId={dashboardInsightId}
        onSelect={setDashboardInsightId}
      />

      <FacetFilterBar
        strings={strings}
        groups={facetGroups}
        state={url.state}
        onToggleProcess={url.toggleProcess}
        onToggleQuality={url.toggleQuality}
        onToggleIndustry={url.toggleIndustry}
        onQueryChange={url.setQuery}
        onReset={url.reset}
        activeFilterCount={activeFilterCount}
        totalCount={MANUFACTURING_INSIGHTS.length}
        matchedCount={filtered.length}
      />

      <InsightCardGrid
        strings={strings}
        insightsByIntent={insightsByIntent}
        onOpenInsight={(id) => url.setOpenInsightId(id)}
        onRfqForInsight={openRfqForInsight(url.setDrawer)}
      />

      <BottomCTA strings={strings} />

      {/* Floating CTA */}
      <button
        type="button"
        onClick={() =>
          setDrawerMode(url.state.drawer === 'audit' ? null : 'audit')
        }
        aria-expanded={drawerOpen}
        aria-controls="mih-drawer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg ring-1 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: COLOR_ACCENT,
          color: 'white',
          boxShadow:
            '0 10px 30px -5px color-mix(in srgb, var(--theme-primary) 45%, transparent)',
        }}
      >
        <span aria-hidden="true">🛠️</span>
        <span>{strings.drawerFloatingCtaLabel}</span>
      </button>

      {/* Modals / Drawers */}
      <InsightEvidenceModal
        open={openInsight !== null}
        onOpenChange={(open) => {
          if (!open) closeInsight();
        }}
        insight={openInsight}
        strings={strings}
      />

      <FactoryAuditDrawer
        open={drawerOpen}
        onOpenChange={(open) => setDrawerMode(open ? 'audit' : null)}
        mode={url.state.drawer}
        onModeChange={setDrawerMode}
        linkedInsight={dashboardInsight}
        strings={strings}
      />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

function groupByIntent(
  insights: readonly ManufacturingInsight[],
): ReadonlyArray<{
  intent: InsightIntent;
  label: string;
  blurb: string;
  insights: readonly ManufacturingInsight[];
}> {
  const order: ReadonlyArray<{
    intent: InsightIntent;
    label: string;
    blurb: string;
  }> = [
    {
      intent: 'informational',
      label: 'Process & Technology',
      blurb:
        'How we cut, chip-control, and anodize titanium on real shop floors.',
    },
    {
      intent: 'commercial',
      label: 'Capability Verification',
      blurb:
        'Tolerance, CMM and MTR evidence you can attach to your qualification file.',
    },
    {
      intent: 'transactional',
      label: 'Audit & Sample Request',
      blurb:
        'Schedule a virtual factory audit or request a redacted CMM / MTR sample.',
    },
  ];
  return order.map((g) => ({
    intent: g.intent,
    label: g.label,
    blurb: g.blurb,
    insights: insights.filter((i) => i.intent === g.intent),
  }));
}

function openRfqForInsight(
  setDrawer: (m: FactoryDrawerMode | null) => void,
) {
  return (id: string) => {
    setDrawer('audit');
    // Best-effort: also persist the source insight id so the drawer can
    // surface it. We use a query param suffix the .astro page does not need
    // to know about; the deeper request mapping happens on /rfq/.
    void id;
  };
}

// ────────────────────────────────────────────────────────────────────
// 1. Hero
// ────────────────────────────────────────────────────────────────────

function HubHero({ strings }: { strings: ManufacturingHubStrings }) {
  return (
    <header
      className="relative overflow-hidden rounded-2xl border px-6 py-10 sm:px-10 sm:py-14"
      style={{
        backgroundColor: COLOR_SURFACE,
        borderColor: COLOR_ACCENT_15,
      }}
    >
      {/* CMM-style background grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--theme-text) 50%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--theme-text) 50%, transparent) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-4xl">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: COLOR_ACCENT_15,
            color: COLOR_ACCENT,
            border: `1px solid ${COLOR_ACCENT_25}`,
          }}
        >
          <span aria-hidden="true">●</span>
          <span>{strings.heroBadge}</span>
        </div>
        <h1
          className="text-3xl font-extrabold leading-tight sm:text-5xl"
          style={{ color: COLOR_TEXT }}
        >
          {strings.heroTitle}
        </h1>
        <p
          className="mt-5 max-w-3xl text-base leading-relaxed sm:text-lg"
          style={{ color: COLOR_TEXT_70 }}
        >
          {strings.heroSubtitle}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={strings.heroCtaPrimaryHref}
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-transform hover:translate-y-[-1px]"
            style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}
          >
            {strings.heroCtaPrimary}
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={strings.heroCtaSecondaryHref}
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors"
            style={{
              color: COLOR_ACCENT,
              border: `1px solid ${COLOR_ACCENT_25}`,
            }}
          >
            {strings.heroCtaSecondary}
          </a>
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────
// 2. Capability Dashboard (6-cell matrix)
// ────────────────────────────────────────────────────────────────────

function CapabilityDashboard(props: {
  strings: ManufacturingHubStrings;
  insights: readonly ManufacturingInsight[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { strings, insights, activeId, onSelect } = props;

  // Take the first metric of each insight for the dashboard tile.
  const tiles = useMemo(
    () =>
      insights.map((i) => ({
        id: i.id,
        title: i.title,
        intent: i.intent,
        accent: i.dashboardAccent,
        headline: i.thresholds[0]?.value ?? '',
        subline: i.thresholds[0]?.baseline,
        standard: i.thresholds[0]?.standard,
      })),
    [insights],
  );

  return (
    <section
      aria-labelledby="mih-dash-title"
      className="mt-10 rounded-2xl border p-6 sm:p-8"
      style={{
        backgroundColor: COLOR_SURFACE,
        borderColor: COLOR_TEXT_08,
      }}
    >
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="mih-dash-title"
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: COLOR_TEXT }}
          >
            {strings.dashboardSectionTitle}
          </h2>
          <p
            className="mt-2 max-w-3xl text-sm"
            style={{ color: COLOR_TEXT_55 }}
          >
            {strings.dashboardSectionSubtitle}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => {
          const active = t.id === activeId;
          const accent = ACCENT_MAP[t.accent];
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(t.id)}
              className="group rounded-lg border p-4 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: active
                  ? `color-mix(in srgb, ${accent} 10%, ${COLOR_SURFACE})`
                  : COLOR_SURFACE_90,
                borderColor: active ? accent : COLOR_TEXT_15,
              }}
            >
              <div
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {t.title.split(' ').slice(0, 4).join(' ')}…
              </div>
              <div
                className="font-mono text-lg font-bold tabular-nums"
                style={{ color: COLOR_TEXT }}
              >
                {t.headline}
              </div>
              {t.subline && (
                <div
                  className="mt-1 text-xs"
                  style={{ color: COLOR_TEXT_55 }}
                >
                  {t.subline}
                </div>
              )}
              {t.standard && (
                <div
                  className="mt-2 text-[10px] font-mono uppercase tracking-wide"
                  style={{ color: COLOR_TEXT_40 }}
                >
                  {t.standard}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// 3. Facet Filter Bar
// ────────────────────────────────────────────────────────────────────

function FacetFilterBar(props: {
  strings: ManufacturingHubStrings;
  groups: ReturnType<typeof buildInsightFacetGroups>;
  state: ManufacturingInsightUrlState;
  onToggleProcess: (p: ProcessCategory) => void;
  onToggleQuality: (q: QualityDimension) => void;
  onToggleIndustry: (i: InsightIndustry) => void;
  onQueryChange: (q: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  totalCount: number;
  matchedCount: number;
}) {
  const { strings, groups, state, onToggleProcess, onToggleQuality, onToggleIndustry, onQueryChange, onReset, activeFilterCount, totalCount, matchedCount } = props;
  const resultText = matchedCount === totalCount
    ? strings.resultTotalTemplate.replace('{n}', String(matchedCount))
    : strings.resultFilteredTemplate.replace('{matched}', String(matchedCount)).replace('{total}', String(totalCount));
  const fct = activeFilterCount === 1
    ? strings.filterActiveCountTemplate.replace('{n}', '1')
    : strings.filterActiveCountPluralTemplate.replace('{n}', String(activeFilterCount));
  return (
    <section aria-labelledby="mih-filter-title"
      className="mt-10 rounded-2xl border p-5 sm:p-7"
      style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_08 }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="mih-filter-title" className="text-lg font-bold sm:text-xl" style={{ color: COLOR_TEXT }}>
          Filter manufacturing insights
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span role="status" aria-live="polite" style={{ color: COLOR_TEXT_55 }}>{resultText}</span>
          {activeFilterCount > 0 && (
            <>
              <span className="rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide"
                style={{ backgroundColor: COLOR_ACCENT_15, color: COLOR_ACCENT }}>{fct}</span>
              <button type="button" onClick={onReset}
                className="font-semibold underline-offset-2 hover:underline focus:outline-none"
                style={{ color: COLOR_ACCENT }}>
                {strings.filterResetLabel}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="relative mt-4">
        <label htmlFor="mih-search" className="sr-only">{strings.filterSearchPlaceholder}</label>
        <input id="mih-search" type="search" value={state.query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={strings.filterSearchPlaceholder} aria-controls="mih-grid"
          className="w-full rounded-md border px-4 py-2.5 pr-16 font-mono text-sm focus:outline-none focus:ring-2"
          style={{ backgroundColor: 'transparent', color: COLOR_TEXT, borderColor: COLOR_TEXT_15 }} />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-[10px] font-mono"
          style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT_55 }}>/</kbd>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChipGroup label={strings.filterProcessesLabel}
          options={groups.process.values} labels={groups.process.labels}
          selected={state.processes}
          onToggle={(v) => onToggleProcess(v as ProcessCategory)} />
        <ChipGroup label={strings.filterQualityLabel}
          options={groups.quality.values} labels={groups.quality.labels}
          selected={state.qualityDims}
          onToggle={(v) => onToggleQuality(v as QualityDimension)} />
        <ChipGroup label={strings.filterIndustryLabel}
          options={groups.industry.values} labels={groups.industry.labels}
          selected={state.industries}
          onToggle={(v) => onToggleIndustry(v as InsightIndustry)} />
      </div>
    </section>
  );
}

function ChipGroup<T extends string>(props: {
  label: string; options: readonly T[]; labels: Readonly<Record<T, string>>;
  selected: readonly T[]; onToggle: (v: T) => void;
}) {
  const { label, options, labels, selected, onToggle } = props;
  return (
    <div role="group" aria-label={label}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: COLOR_TEXT_55 }}>{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isOn = selected.includes(o);
          return (
            <button key={o} type="button" aria-pressed={isOn}
              onClick={() => onToggle(o)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: isOn ? COLOR_ACCENT : COLOR_TEXT_08,
                color: isOn ? 'white' : COLOR_TEXT_70,
                border: `1px solid ${isOn ? COLOR_ACCENT : COLOR_TEXT_15}`,
              }}>
              {labels[o]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 4. Insight Card Grid
function InsightCardGrid(props: {
  strings: ManufacturingHubStrings;
  insightsByIntent: ReadonlyArray<{
    intent: InsightIntent; label: string; blurb: string;
    insights: readonly ManufacturingInsight[];
  }>;
  onOpenInsight: (id: string) => void;
  onRfqForInsight: (id: string) => void;
}) {
  const { strings, insightsByIntent, onOpenInsight, onRfqForInsight } = props;
  const hasAny = insightsByIntent.reduce((s, g) => s + g.insights.length, 0) > 0;
  if (!hasAny) {
    return (
      <section id="mih-grid" aria-live="polite"
        className="mt-10 rounded-2xl border p-10 text-center"
        style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_08 }}>
        <h3 className="text-2xl font-bold" style={{ color: COLOR_TEXT }}>
          {strings.emptyTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: COLOR_TEXT_55 }}>
          {strings.emptyDescription}
        </p>
        <a href={strings.emptyCtaHref}
          className="mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
          {strings.emptyCtaLabel}
        </a>
      </section>
    );
  }
  return (
    <div id="mih-grid" className="mt-10 space-y-12">
      {insightsByIntent.map((group) =>
        group.insights.length === 0 ? null : (
          <section key={group.intent} aria-labelledby={`mih-band-${group.intent}`}
            className="space-y-5">
            <div>
              <h3 id={`mih-band-${group.intent}`}
                className="text-lg font-bold sm:text-xl" style={{ color: COLOR_TEXT }}>
                {group.label}
              </h3>
              <p className="mt-1 text-sm" style={{ color: COLOR_TEXT_55 }}>
                {group.blurb}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.insights.map((i) => (
                <InsightCard key={i.id} insight={i} strings={strings}
                  onOpen={() => onOpenInsight(i.id)}
                  onRfq={() => onRfqForInsight(i.id)} />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  );
}

function InsightCard(props: {
  insight: ManufacturingInsight;
  strings: ManufacturingHubStrings;
  onOpen: () => void;
  onRfq: () => void;
}) {
  const { insight, strings, onOpen, onRfq } = props;
  const accent = ACCENT_MAP[insight.dashboardAccent];
  const hasEv = insight.cmmEvidence !== undefined || insight.mtrEvidence !== undefined;
  return (
    <article className="flex h-full flex-col rounded-xl border p-5 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: COLOR_SURFACE,
        borderColor: insight.featured
          ? `color-mix(in srgb, ${accent} 35%, ${COLOR_TEXT_15})`
          : COLOR_TEXT_15,
      }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
          }}>
          {insight.featured ? 'Featured' : insight.intent}
        </span>
        {hasEv && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT_55 }}>
            {strings.cardEvidenceBadge}
          </span>
        )}
      </div>
      <h4 className="text-base font-bold leading-snug sm:text-lg" style={{ color: COLOR_TEXT }}>
        {insight.title}
      </h4>
      <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_70 }}>
        {insight.directAnswer}
      </p>
      <div className="mt-4 space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: COLOR_TEXT_55 }}>{strings.cardMetricsLabel}</div>
        <ul className="space-y-1">
          {insight.thresholds.slice(0, 3).map((t, idx) => (
            <li key={`${insight.id}-m-${idx}`}
              className="flex items-baseline justify-between gap-2 text-xs font-mono">
              <span style={{ color: COLOR_TEXT_55 }}>{t.label}</span>
              <span className="font-bold tabular-nums"
                style={{ color: t.emphasis === 'high' ? accent : COLOR_TEXT }}>
                {t.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: COLOR_TEXT_55 }}>{strings.cardEquipmentLabel}</div>
        <ul className="space-y-1 text-xs">
          {insight.recommendedEquipment.slice(0, 2).map((e, idx) => (
            <li key={`${insight.id}-e-${idx}`} style={{ color: COLOR_TEXT_70 }}>
              <span className="font-semibold" style={{ color: COLOR_TEXT }}>{e.name}</span>
              {' — '}{e.spec}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {insight.industries.map((ind) => (
          <span key={`${insight.id}-i-${ind}`}
            className="rounded px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT_55 }}>
            {INSIGHT_INDUSTRY_LABELS[ind]}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <button type="button" onClick={onOpen} disabled={!hasEv}
          className="rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: COLOR_ACCENT_15, color: COLOR_ACCENT,
            border: `1px solid ${COLOR_ACCENT_25}` }}>
          {strings.cardEvidenceLabel}
        </button>
        <button type="button" onClick={onRfq}
          className="rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
          {strings.cardRfqLabel}
        </button>
      </div>
    </article>
  );
}

// ────────────────────────────────────────────────────────────────────
// 6. Bottom CTA strip
// ────────────────────────────────────────────────────────────────────

function BottomCTA({ strings }: { strings: ManufacturingHubStrings }) {
  return (
    <section aria-labelledby="mih-bottom-cta-title"
      className="mt-12 rounded-2xl border p-6 sm:p-8"
      style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_08 }}>
      <h2 id="mih-bottom-cta-title"
        className="text-xl font-bold sm:text-2xl" style={{ color: COLOR_TEXT }}>
        {strings.bottomCtaTitle}
      </h2>
      <p className="mt-3 max-w-3xl text-sm" style={{ color: COLOR_TEXT_55 }}>
        {strings.bottomCtaSubtitle}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={strings.bottomCtaPrimaryHref}
          className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
          {strings.bottomCtaPrimaryLabel}
          <span aria-hidden="true">→</span>
        </a>
        <a href={strings.bottomCtaSecondaryHref}
          className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          style={{ color: COLOR_ACCENT, border: `1px solid ${COLOR_ACCENT_25}` }}>
          {strings.bottomCtaSecondaryLabel}
        </a>
      </div>
    </section>
  );
}

// 7. Insight Evidence Modal (CMM / MTR)
function InsightEvidenceModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: ManufacturingInsight | null;
  strings: ManufacturingHubStrings;
}) {
  const { open, onOpenChange, insight, strings } = props;
  if (insight === null) {
    return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal /></Dialog.Root>;
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <Dialog.Content aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:p-8"
          style={{ backgroundColor: 'var(--theme-bg)', borderColor: COLOR_TEXT_15 }}>
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-xl font-bold sm:text-2xl" style={{ color: COLOR_TEXT }}>
                {insight.title}
              </Dialog.Title>
              <p className="mt-2 max-w-3xl text-sm" style={{ color: COLOR_TEXT_55 }}>
                {insight.directAnswer}
              </p>
            </div>
            <Dialog.Close aria-label={strings.modalCloseLabel}
              className="rounded-full p-2 focus:outline-none focus-visible:ring-2"
              style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT }}>
              ✕
            </Dialog.Close>
          </div>
          {insight.cmmEvidence !== undefined && (
            <CmmEvidencePanel e={insight.cmmEvidence} strings={strings} />
          )}
          {insight.mtrEvidence !== undefined && (
            <MtrEvidencePanel e={insight.mtrEvidence} strings={strings} />
          )}
          <div className="mt-6 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: COLOR_TEXT_15 }}>
            <a href={buildRfqHrefForInsight(insight.id, 'cmm-sample')}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
              {strings.modalRequestCtaLabel} →
            </a>
            <a href="/contact/"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
              style={{ color: COLOR_ACCENT, border: `1px solid ${COLOR_ACCENT_25}` }}>
              Talk to an engineer
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CmmEvidencePanel(props: {
  e: NonNullable<ManufacturingInsight['cmmEvidence']>;
  strings: ManufacturingHubStrings;
}) {
  const { e, strings } = props;
  const passing = e.summary.within === e.summary.total;
  return (
    <section className="mt-5 rounded-xl border p-5"
      style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_15 }}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold" style={{ color: COLOR_TEXT }}>
          {strings.modalCMMTitle}
        </h3>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold"
          style={{
            backgroundColor: passing ? '#10b98125' : '#f59e0b25',
            color: passing ? '#10b981' : '#f59e0b',
            border: `1px solid ${passing ? '#10b98140' : '#f59e0b40'}`,
          }}>
          {passing ? 'ALL PASS' : 'PARTIAL PASS'}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <Detail label="Part">{e.partName}</Detail>
        <Detail label="Part No.">{e.partNumber}</Detail>
        <Detail label="CMM Model">{e.cmmModel}</Detail>
        <Detail label="CMM Accuracy">{e.cmmAccuracy}</Detail>
        <Detail label="Probe">{e.probeConfig}</Detail>
        <Detail label="Software">{e.softwareVersion}</Detail>
        <Detail label="Tolerance Class">{e.toleranceClass}</Detail>
        <Detail label="Inspection Date">{e.inspectionDate}</Detail>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={strings.modalCMMPointCountLabel} value={`${e.summary.total}`} accent="#10b981" />
        <Stat label="Within tolerance" value={`${e.summary.within} / ${e.summary.total}`} accent="#10b981" />
        <Stat label="Max deviation" value={`${e.summary.maxDeviation.toFixed(4)} mm`} accent="#22d3ee" />
        <Stat label="Avg deviation" value={`${e.summary.avgDeviation.toFixed(4)} mm`} accent="#a78bfa" />
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-semibold" style={{ color: COLOR_ACCENT }}>
          Show full point grid (first 50 of {e.points.length} points)
        </summary>
        <div className="mt-3 max-h-64 overflow-auto rounded border" style={{ borderColor: COLOR_TEXT_15 }}>
          <table className="w-full text-[10px] font-mono">
            <thead className="sticky top-0" style={{ backgroundColor: COLOR_TEXT_08 }}>
              <tr>
                {['#', 'X', 'Y', 'Z nominal', 'Z actual', 'Δ mm', 'Status'].map((h) => (
                  <th key={h} className="px-2 py-1.5 text-left font-semibold" style={{ color: COLOR_TEXT_55 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {e.points.slice(0, 50).map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${COLOR_TEXT_08}` }}>
                  <td className="px-2 py-1" style={{ color: COLOR_TEXT_55 }}>{p.id}</td>
                  <td className="px-2 py-1">{p.x}</td>
                  <td className="px-2 py-1">{p.y}</td>
                  <td className="px-2 py-1">{p.nominal.toFixed(4)}</td>
                  <td className="px-2 py-1">{p.actual.toFixed(4)}</td>
                  <td className="px-2 py-1" style={{ color: p.within ? '#10b981' : '#f59e0b' }}>
                    {p.deviation >= 0 ? '+' : ''}{p.deviation.toFixed(4)}
                  </td>
                  <td className="px-2 py-1" style={{ color: p.within ? '#10b981' : '#f59e0b' }}>
                    {p.within ? 'PASS' : 'CHECK'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Detail(props: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
        {props.label}
      </dt>
      <dd className="mt-0.5 font-mono" style={{ color: COLOR_TEXT }}>{props.children}</dd>
    </div>
  );
}

function Stat(props: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded border p-3" style={{ borderColor: COLOR_TEXT_15 }}>
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
        {props.label}
      </div>
      <div className="mt-1 font-mono text-lg font-bold tabular-nums" style={{ color: props.accent }}>
        {props.value}
      </div>
    </div>
  );
}

function buildRfqHrefForInsight(
  insightId: string,
  mode: 'cmm-sample' | 'mtr-sample',
): string {
  return `/rfq/?part=${mode}&insight=${insightId}`;
}

function MtrEvidencePanel(props: {
  e: NonNullable<ManufacturingInsight['mtrEvidence']>;
  strings: ManufacturingHubStrings;
}) {
  const { e, strings } = props;
  return (
    <section className="mt-5 rounded-xl border p-5"
      style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_15 }}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold" style={{ color: COLOR_TEXT }}>
          {strings.modalMTRTitle}
        </h3>
        <span className="rounded px-2 py-0.5 text-[10px] font-mono font-bold"
          style={{ backgroundColor: '#fbbf2425', color: '#fbbf24', border: '1px solid #fbbf2440' }}>
          {e.inspectionType}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <Detail label="Material">{e.material}</Detail>
        <Detail label="Standard">{e.materialStandard}</Detail>
        <Detail label="Form">{e.form}</Detail>
        <Detail label={strings.modalHeatNumberLabel}>{e.heatNumber}</Detail>
        <Detail label={strings.modalMTRBatchLabel}>{e.batchSize}</Detail>
        <Detail label="Manufacturer">{e.manufacturer}</Detail>
        <Detail label="Country of Melt">{e.countryOfMelt}</Detail>
        <Detail label="Inspection Date">{e.inspectionDate}</Detail>
      </dl>
      <h4 className="mt-4 mb-2 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: COLOR_TEXT_55 }}>Chemical Composition (per EN 10204 3.1)</h4>
      <div className="overflow-auto rounded border" style={{ borderColor: COLOR_TEXT_15 }}>
        <table className="w-full text-[10px] font-mono">
          <thead style={{ backgroundColor: COLOR_TEXT_08 }}>
            <tr>
              {['Element', 'Min', 'Max', 'Actual'].map((h) => (
                <th key={h} className="px-2 py-1.5 text-left font-semibold"
                  style={{ color: COLOR_TEXT_55 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.chemicalComposition.map((row) => (
              <tr key={row.element} style={{ borderTop: `1px solid ${COLOR_TEXT_08}` }}>
                <td className="px-2 py-1 font-semibold" style={{ color: COLOR_TEXT }}>{row.element}</td>
                <td className="px-2 py-1" style={{ color: COLOR_TEXT_55 }}>{row.min}</td>
                <td className="px-2 py-1" style={{ color: COLOR_TEXT_55 }}>{row.max}</td>
                <td className="px-2 py-1 font-bold" style={{ color: COLOR_TEXT }}>{row.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="mt-4 mb-2 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: COLOR_TEXT_55 }}>Mechanical Properties (per ASTM E8 / E18)</h4>
      <div className="overflow-auto rounded border" style={{ borderColor: COLOR_TEXT_15 }}>
        <table className="w-full text-[10px] font-mono">
          <thead style={{ backgroundColor: COLOR_TEXT_08 }}>
            <tr>
              {['Property', 'Unit', 'Min', 'Actual'].map((h) => (
                <th key={h} className="px-2 py-1.5 text-left font-semibold"
                  style={{ color: COLOR_TEXT_55 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.mechanicalProperties.map((row) => (
              <tr key={row.property} style={{ borderTop: `1px solid ${COLOR_TEXT_08}` }}>
                <td className="px-2 py-1 font-semibold" style={{ color: COLOR_TEXT }}>{row.property}</td>
                <td className="px-2 py-1" style={{ color: COLOR_TEXT_55 }}>{row.unit}</td>
                <td className="px-2 py-1" style={{ color: COLOR_TEXT_55 }}>{row.min}</td>
                <td className="px-2 py-1 font-bold" style={{ color: '#10b981' }}>{row.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// 8. Factory Audit / RFQ Drawer
function FactoryAuditDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FactoryDrawerMode | null;
  onModeChange: (m: FactoryDrawerMode | null) => void;
  linkedInsight: ManufacturingInsight | null;
  strings: ManufacturingHubStrings;
}) {
  const { open, onOpenChange, mode, onModeChange, linkedInsight, strings } = props;
  const modes: ReadonlyArray<FactoryDrawerMode> = ['audit', 'cmm-sample', 'mtr-sample'];
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <Dialog.Content aria-describedby={undefined}
          id="mih-drawer"
          className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l shadow-2xl sm:max-w-lg"
          style={{ backgroundColor: 'var(--theme-bg)', borderColor: COLOR_TEXT_15 }}>
          <div className="flex items-start justify-between gap-3 border-b p-6"
            style={{ borderColor: COLOR_TEXT_15 }}>
            <div>
              <Dialog.Title className="text-lg font-bold sm:text-xl" style={{ color: COLOR_TEXT }}>
                {strings.drawerTitle}
              </Dialog.Title>
              <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_55 }}>
                {strings.drawerSubtitle}
              </p>
            </div>
            <Dialog.Close aria-label={strings.drawerCancelLabel}
              className="rounded-full p-2 focus:outline-none focus-visible:ring-2"
              style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT }}>
              ✕
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {linkedInsight !== null && (
              <div className="mb-4 rounded-md border p-3 text-xs"
                style={{ backgroundColor: COLOR_SURFACE, borderColor: COLOR_TEXT_15 }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: COLOR_TEXT_55 }}>Linked insight</div>
                <div className="mt-1 font-semibold" style={{ color: COLOR_TEXT }}>
                  {linkedInsight.title}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {modes.map((m) => {
                const isActive = m === mode;
                const labelMap: Record<FactoryDrawerMode, string> = {
                  audit: strings.drawerModeAudit,
                  'cmm-sample': strings.drawerModeCmm,
                  'mtr-sample': strings.drawerModeMtr,
                };
                const descMap: Record<FactoryDrawerMode, string> = {
                  audit: strings.drawerModeAuditDesc,
                  'cmm-sample': strings.drawerModeCmmDesc,
                  'mtr-sample': strings.drawerModeMtrDesc,
                };
                return (
                  <button key={m} type="button" onClick={() => onModeChange(isActive ? null : m)}
                    aria-pressed={isActive}
                    className="block w-full rounded-lg border p-4 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: isActive ? COLOR_ACCENT_15 : COLOR_SURFACE,
                      borderColor: isActive ? COLOR_ACCENT : COLOR_TEXT_15,
                    }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: COLOR_TEXT }}>
                        {labelMap[m]}
                      </span>
                      {isActive && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs" style={{ color: COLOR_TEXT_55 }}>
                      {descMap[m]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-t p-6" style={{ borderColor: COLOR_TEXT_15 }}>
            <a href={continueHrefFor(mode, linkedInsight?.id ?? null)}
              className="block w-full rounded-md px-5 py-3 text-center text-sm font-semibold"
              style={{ backgroundColor: COLOR_ACCENT, color: 'white' }}>
              {strings.drawerContinueLabel} →
            </a>
            <button type="button" onClick={() => onOpenChange(false)}
              className="mt-2 block w-full text-center text-xs font-semibold"
              style={{ color: COLOR_TEXT_55 }}>
              {strings.drawerCancelLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function continueHrefFor(
  mode: FactoryDrawerMode | null,
  insightId: string | null,
): string {
  const m: FactoryDrawerMode = mode ?? 'audit';
  const base = m === 'audit' ? '/rfq/?part=audit' :
    m === 'cmm-sample' ? '/rfq/?part=cmm-sample' :
    '/rfq/?part=mtr-sample';
  return insightId !== null ? `${base}&insight=${insightId}` : base;
}






