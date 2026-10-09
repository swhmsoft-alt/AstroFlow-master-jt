/**
 * IndustryApplicationsHub.tsx
 *
 * React 19 client island for the Industry Applications Hub
 * (`/resources/industry-applications/`).
 *
 * Composition (5 vertical sections):
 *   1. IndustryHeroMatrix        — 6-cell industry overview matrix +
 *                                   4-cell cross-industry metrics
 *   2. IndustryFilterBar          — 4-dim pill filter (sector / grade /
 *                                   standard / component) + search + reset
 *   3. IndustryCardGrid          — 6 application case cards with
 *                                   challenge / solution / evidence / compliance
 *   4. CrossIndustryComparator   — Material property table
 *                                   (Ti Grade 5/23/7 vs 316L / 7075 / 4140)
 *   5. IndustryRfqDrawer         — Radix Dialog slide-in via floating CTA →
 *                                   /rfq/?app=...&grade=...&std=...
 *
 * State source of truth: `useIndustryApplicationsUrlState`
 *   (?sector=&grade=&std=&comp=&q=&app=&drawer=). All sections read/write
 *   the same URL, so the filter view is shareable.
 *
 * a11y:
 *   - Filter pills use <button> with aria-pressed.
 *   - Application cards are <button> wrappers so keyboard users can open modal.
 *   - Modal & Drawer: Radix Dialog (WAI-ARIA modal, focus trap, ESC, scroll lock).
 *   - Floating CTA has aria-expanded reflecting drawer state.
 *   - Search uses aria-controls; result count aria-live="polite".
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { JSX } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  INDUSTRY_APPLICATIONS,
  HUB_STRINGS_EN,
  filterIndustryApplications,
  buildIndustryApplicationFacets,
  countActiveFilters,
  findApplicationCardById,
  INDUSTRY_SECTOR_LABELS,
  MATERIAL_GRADE_LABELS,
  COMPLIANCE_STANDARD_LABELS,
  SECTOR_ACCENT,
  type SectorAccentKey,
} from '../../data/industry-applications-data';
import type {
  ApplicationCard,
  IndustrySector,
  MaterialGradeId,
  ComplianceStandard,
  ComponentFunction,
  IndustryDrawerMode,
  ApplicationIntent,
} from '../../types/industry-application';
import { useIndustryApplicationsUrlState } from './useIndustryApplicationsUrlState';

// Re-export so the .astro page can import strings type if it wants.
export type { IndustryApplicationHubStrings } from '../../types/industry-application';

// ────────────────────────────────────────────────────────────────────
// Theme tokens (read once via CSS variables; mirrors ManufacturingInsightsHub)
// ────────────────────────────────────────────────────────────────────

const COLOR_TEXT = 'var(--theme-text)';
const COLOR_TEXT_70 = 'color-mix(in srgb, var(--theme-text) 70%, transparent)';
const COLOR_TEXT_55 = 'color-mix(in srgb, var(--theme-text) 55%, transparent)';
const COLOR_TEXT_40 = 'color-mix(in srgb, var(--theme-text) 40%, transparent)';
const COLOR_TEXT_25 = 'color-mix(in srgb, var(--theme-text) 25%, transparent)';
const COLOR_TEXT_15 = 'color-mix(in srgb, var(--theme-text) 15%, transparent)';
const COLOR_TEXT_08 = 'color-mix(in srgb, var(--theme-text) 8%, transparent)';
const COLOR_SURFACE = 'var(--theme-surface)';
const COLOR_ACCENT = 'var(--theme-primary)';
const COLOR_ACCENT_15 = 'color-mix(in srgb, var(--theme-primary) 15%, transparent)';
const COLOR_ACCENT_25 = 'color-mix(in srgb, var(--theme-primary) 25%, transparent)';

// ────────────────────────────────────────────────────────────────────
// Sector matrix definitions (drives the 6-cell Hero Matrix section)
// ────────────────────────────────────────────────────────────────────

interface SectorMatrixCell {
  readonly key: SectorAccentKey;
  readonly sector: IndustrySector;
  readonly cardId: string;
  readonly metric: string;
  readonly metricLabel: string;
}

const SECTOR_MATRIX: ReadonlyArray<SectorMatrixCell> = [
  { key: 'aerospace', sector: 'aerospace-defence', cardId: 'aerospace-structural-bracket-5axis', metric: '−42%', metricLabel: 'vs 4140 steel' },
  { key: 'medical', sector: 'medical-implant', cardId: 'medical-bone-screw-grade23', metric: 'Ra ≤ 0.2 µm', metricLabel: 'electropolish' },
  { key: 'marine', sector: 'marine-hydrofoil', cardId: 'hydrofoil-mast-step-grade7', metric: '2000+ hr', metricLabel: 'ASTM B117 zero pitting' },
  { key: 'motorsport', sector: 'motorsport-automotive', cardId: 'racing-wheel-lug-bolt-grade5', metric: '−45%', metricLabel: 'unsprung mass' },
  { key: 'subsea', sector: 'subsea-oil-gas', cardId: 'subsea-sensor-housing-grade7', metric: '30 MPa', metricLabel: 'hydrostatic proof' },
  { key: 'edc', sector: 'edc-luxury-hardware', cardId: 'microdermal-top-grade23', metric: 'Grade 0', metricLabel: 'ISO 10993-5' },
];

// ────────────────────────────────────────────────────────────────────
// Comparator row definitions
// ────────────────────────────────────────────────────────────────────

interface ComparatorRow {
  readonly label: string;
  readonly density: string;
  readonly tensile: string;
  readonly corrosion: string;
  readonly biocompat: string;
  readonly cost: string;
  readonly highlight?: boolean;
}

const COMPARATOR_ROWS: ReadonlyArray<ComparatorRow> = [
  { label: 'Ti Grade 5 (Ti-6Al-4V)', density: '4.43 g/cm³', tensile: '≥ 895 MPa', corrosion: 'Excellent (seawater)', biocompat: 'Limited (not implant grade)', cost: '$$$', highlight: true },
  { label: 'Ti Grade 23 (Ti-6Al-4V ELI)', density: '4.43 g/cm³', tensile: '≥ 860 MPa', corrosion: 'Excellent (seawater)', biocompat: 'YES (ISO 5832-3)', cost: '$$$$', highlight: true },
  { label: 'Ti Grade 7 (Ti-0.2Pd)', density: '4.51 g/cm³', tensile: '≥ 785 MPa', corrosion: 'Best in class (Pd-stabilised)', biocompat: 'YES (Pd trace)', cost: '$$$$', highlight: true },
  { label: 'Stainless 316L', density: '8.00 g/cm³', tensile: '≥ 485 MPa', corrosion: 'Good (pitting < 200 hr)', biocompat: 'NO (Ni²⁺ release)', cost: '$$' },
  { label: 'Aluminium 7075-T6', density: '2.81 g/cm³', tensile: '≥ 572 MPa', corrosion: 'Poor (galvanic risk)', biocompat: 'NO (Al toxicity)', cost: '$' },
  { label: 'Steel 4140 (chromoly)', density: '7.85 g/cm³', tensile: '≥ 1020 MPa', corrosion: 'Poor (requires plating)', biocompat: 'NO (Fe/Cr risk)', cost: '$$' },
];

// ────────────────────────────────────────────────────────────────────
// Intent → band metadata
// ────────────────────────────────────────────────────────────────────

const INTENT_BAND: Readonly<
  Record<ApplicationIntent, { label: string; accent: string }>
> = {
  informational: { label: 'Industry Selection', accent: 'rgba(125,211,252,0.7)' },
  'commercial-investigation': { label: 'Compliance & Capability', accent: 'rgba(110,231,183,0.7)' },
  transactional: { label: 'Industry RFQ', accent: 'rgba(253,186,116,0.7)' },
};

// ────────────────────────────────────────────────────────────────────
// 1. Reusable inline micro-components
// ────────────────────────────────────────────────────────────────────

function FilterPill<T extends string>(props: {
  value: T;
  active: boolean;
  onToggle: (v: T) => void;
  label: string;
  accent?: { border: string; bg: string; text: string };
}): JSX.Element {
  const { value, active, onToggle, label, accent } = props;
  const baseBorder = active
    ? (accent?.border ?? 'color-mix(in srgb, var(--theme-primary) 50%, transparent)')
    : COLOR_TEXT_15;
  const baseBg = active
    ? (accent?.bg ?? COLOR_ACCENT_15)
    : COLOR_SURFACE;
  const baseText = active
    ? (accent?.text ?? COLOR_ACCENT)
    : COLOR_TEXT_70;
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      aria-pressed={active}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-1"
      style={{
        borderColor: baseBorder,
        backgroundColor: baseBg,
        color: baseText,
      }}
    >
      {active ? (
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.997 8a1 1 0 01-1.414 0l-3.997-4a1 1 0 111.414-1.42L8 12.578l7.29-7.288a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : null}
      {label}
    </button>
  );
}

function ComplianceChip({ badge }: { badge: string }): JSX.Element {
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold"
      style={{
        backgroundColor: COLOR_ACCENT_15,
        color: COLOR_ACCENT,
        border: `1px solid ${COLOR_ACCENT_25}`,
      }}
    >
      {badge}
    </span>
  );
}

function MetricChip({
  label,
  value,
  standard,
  baseline,
  emphasis,
}: {
  label: string;
  value: string;
  standard?: string;
  baseline?: string;
  emphasis: 'low' | 'medium' | 'high';
}): JSX.Element {
  const accentColor =
    emphasis === 'high'
      ? 'var(--theme-primary)'
      : emphasis === 'medium'
        ? COLOR_TEXT
        : COLOR_TEXT_70;
  const bg =
    emphasis === 'high'
      ? COLOR_ACCENT_15
      : emphasis === 'medium'
        ? COLOR_TEXT_08
        : 'transparent';
  return (
    <div
      className="flex flex-col gap-0.5 rounded-md border px-3 py-2"
      style={{ borderColor: COLOR_TEXT_15, backgroundColor: bg }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
        {label}
      </div>
      <div className="font-mono text-sm font-bold" style={{ color: accentColor }}>
        {value}
      </div>
      {baseline !== undefined ? (
        <div className="text-[10px]" style={{ color: COLOR_TEXT_55 }}>
          {baseline}
        </div>
      ) : null}
      {standard !== undefined ? (
        <div className="text-[9px] font-mono opacity-80" style={{ color: COLOR_TEXT_40 }}>
          {standard}
        </div>
      ) : null}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// 2. Build the /rfq/ URL from current filter context
// ────────────────────────────────────────────────────────────────────

function buildRfqHref(card: ApplicationCard | null, mode: IndustryDrawerMode): string {
  const params = new URLSearchParams();
  params.set('part', mode);
  if (card !== null) {
    params.set('app', card.id);
    params.set('sector', card.sector);
    params.set('grade', card.materialSpec.grade);
    if (card.complianceChain.length > 0) {
      params.set('std', card.complianceChain.join(','));
    }
    if (card.rfqDefaultContext.partHint !== undefined) {
      params.set('hint', card.rfqDefaultContext.partHint);
    }
  }
  return `/rfq/?${params.toString()}`;
}

// ────────────────────────────────────────────────────────────────────
// 3. Main Hub component
// ────────────────────────────────────────────────────────────────────

export interface IndustryApplicationsHubProps {
  /** Hub-level i18n strings. */
  readonly strings: typeof HUB_STRINGS_EN;
}

export function IndustryApplicationsHub({ strings }: IndustryApplicationsHubProps): JSX.Element {
  const url = useIndustryApplicationsUrlState();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [drawerMode, setDrawerModeLocal] = useState<IndustryDrawerMode | null>(null);

  // ── Memoized derived state ──────────────────────────────────────────
  const filtered = useMemo<readonly ApplicationCard[]>(
    () => filterIndustryApplications(INDUSTRY_APPLICATIONS, url.state),
    [url.state],
  );

  const facetGroups = useMemo(() => buildIndustryApplicationFacets(), []);

  const activeFilterCount = useMemo(() => countActiveFilters(url.state), [url.state]);

  // Open card (from URL or from click).
  const openCard = useMemo<ApplicationCard | null>(() => {
    if (url.state.openCardId === null) return null;
    return findApplicationCardById(url.state.openCardId);
  }, [url.state.openCardId]);

  // ── Status line text (result count) ────────────────────────────────
  const statusText = useMemo<string>(() => {
    if (filtered.length === INDUSTRY_APPLICATIONS.length) {
      return strings.resultTotalTemplate.replace('{n}', String(filtered.length));
    }
    return strings.resultFilteredTemplate
      .replace('{matched}', String(filtered.length))
      .replace('{total}', String(INDUSTRY_APPLICATIONS.length));
  }, [filtered.length, strings]);

  // ── Drawer summary text ─────────────────────────────────────────────
  const drawerSummary = useMemo<string>(() => {
    const parts: string[] = [];
    if (url.state.sectors.length > 0) {
      parts.push(
        url.state.sectors
          .map((s) => INDUSTRY_SECTOR_LABELS[s])
          .join(', '),
      );
    }
    if (url.state.grades.length > 0) {
      parts.push(
        url.state.grades
          .map((g) => MATERIAL_GRADE_LABELS[g].split(' — ')[0] ?? g)
          .join(', '),
      );
    }
    if (url.state.standards.length > 0) {
      parts.push(
        url.state.standards
          .map((s) => COMPLIANCE_STANDARD_LABELS[s].split(' — ')[0] ?? s)
          .join(', '),
      );
    }
    if (parts.length === 0) return 'No filters selected';
    return parts.join(' · ');
  }, [url.state.sectors, url.state.grades, url.state.standards]);

  // ── Sync drawer local state with URL ────────────────────────────────
  useEffect(() => {
    setDrawerModeLocal(url.state.drawer);
  }, [url.state.drawer]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleOpenCard = useCallback(
    (card: ApplicationCard) => {
      url.setOpenCardId(card.id);
    },
    [url],
  );

  const handleCloseCard = useCallback(() => {
    url.setOpenCardId(null);
  }, [url]);

  const handleOpenDrawer = useCallback(
    (mode: IndustryDrawerMode) => {
      url.setDrawer(mode);
    },
    [url],
  );

  const handleCloseDrawer = useCallback(() => {
    url.setDrawer(null);
  }, [url]);

  const handleReset = useCallback(() => {
    url.reset();
  }, [url]);

  // Global `/` and `⌘K` shortcut to focus the search input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Active filter count text (1 vs n grammar)
  const activeFilterText =
    activeFilterCount === 1
      ? strings.filterActiveCountTemplate.replace('{n}', String(activeFilterCount))
      : strings.filterActiveCountPluralTemplate.replace('{n}', String(activeFilterCount));

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* ────────────────────── Section 1: Industry Hero Matrix ────────────────────── */}
      <div className="mt-10">
        <h2
          id="iah-matrix-title"
          className="text-xl font-bold sm:text-2xl"
          style={{ color: COLOR_TEXT }}
        >
          {strings.matrixSectionTitle}
        </h2>
        <p
          className="mt-1 text-sm sm:text-base"
          style={{ color: COLOR_TEXT_70 }}
        >
          {strings.matrixSectionSubtitle}
        </p>
        <div
          id="iah-dashboard-title"
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {SECTOR_MATRIX.map((cell) => {
            const accent = SECTOR_ACCENT[cell.key];
            const card = findApplicationCardById(cell.cardId);
            return (
              <button
                type="button"
                key={cell.key}
                onClick={() => {
                  if (card !== null) handleOpenCard(card);
                }}
                aria-label={`${INDUSTRY_SECTOR_LABELS[cell.sector]} — ${cell.metric} ${cell.metricLabel}`}
                className="group flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: accent.border, backgroundColor: accent.bg }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: accent.text }}
                >
                  {INDUSTRY_SECTOR_LABELS[cell.sector].split(' & ')[0]}
                </div>
                <div className="font-mono text-2xl font-bold" style={{ color: COLOR_TEXT }}>
                  {cell.metric}
                </div>
                <div className="text-[10px] leading-tight" style={{ color: COLOR_TEXT_70 }}>
                  {cell.metricLabel}
                </div>
                <div
                  className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: accent.text }}
                >
                  View case
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
        {/* Cross-industry metrics row */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border px-3 py-2" style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>5-axis tolerance</div>
            <div className="font-mono text-lg font-bold" style={{ color: COLOR_ACCENT }}>±0.005 mm</div>
          </div>
          <div className="rounded-md border px-3 py-2" style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>MTR coverage</div>
            <div className="font-mono text-lg font-bold" style={{ color: COLOR_ACCENT }}>EN 10204 3.1 — 100%</div>
          </div>
          <div className="rounded-md border px-3 py-2" style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>Salt spray (Grade 7)</div>
            <div className="font-mono text-lg font-bold" style={{ color: COLOR_ACCENT }}>≥ 2000 hr</div>
          </div>
          <div className="rounded-md border px-3 py-2" style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>Weight saving</div>
            <div className="font-mono text-lg font-bold" style={{ color: COLOR_ACCENT }}>−42 to −45%</div>
          </div>
        </div>
      </div>

      {/* ────────────────────── Section 2: Industry Filter Bar ────────────────────── */}
      <div className="mt-10 rounded-xl border p-4 sm:p-5" style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <label htmlFor="iah-search" className="sr-only">
              {strings.filterSearchPlaceholder}
            </label>
            <div className="relative flex-1 min-w-[220px]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: COLOR_TEXT_40 }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                ref={searchInputRef}
                id="iah-search"
                type="search"
                value={url.state.query}
                onChange={(e) => url.setQuery(e.target.value)}
                placeholder={strings.filterSearchPlaceholder}
                aria-controls="iah-card-grid"
                className="w-full rounded-md border py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: COLOR_TEXT_15,
                  color: COLOR_TEXT,
                }}
              />
            </div>
            <span className="hidden text-xs sm:inline" style={{ color: COLOR_TEXT_40 }}>
              <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]" style={{ borderColor: COLOR_TEXT_25 }}>
                /
              </kbd>{' '}
              {strings.filterSearchShortcutHint}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: COLOR_TEXT_55 }}>{activeFilterText}</span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: COLOR_TEXT_15, color: COLOR_TEXT_70, backgroundColor: 'transparent' }}
            >
              {strings.filterResetLabel}
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <FacetGroup
            label={strings.filterSectorLabel}
            values={facetGroups.sector.values}
            labels={facetGroups.sector.labels as Readonly<Record<string, string>>}
            active={url.state.sectors}
            onToggle={url.toggleSector as (v: string) => void}
          />
          <FacetGroup
            label={strings.filterGradeLabel}
            values={facetGroups.grade.values}
            labels={facetGroups.grade.labels as Readonly<Record<string, string>>}
            active={url.state.grades}
            onToggle={url.toggleGrade as (v: string) => void}
          />
          <FacetGroup
            label={strings.filterStandardLabel}
            values={facetGroups.standard.values}
            labels={facetGroups.standard.labels as Readonly<Record<string, string>>}
            active={url.state.standards}
            onToggle={url.toggleStandard as (v: string) => void}
          />
          <FacetGroup
            label={strings.filterComponentLabel}
            values={facetGroups.component.values}
            labels={facetGroups.component.labels as Readonly<Record<string, string>>}
            active={url.state.components}
            onToggle={url.toggleComponent as (v: string) => void}
          />
        </div>
      </div>

      {/* ────────────────────── Section 3: Industry Card Grid ────────────────────── */}
      <div id="iah-card-grid" className="mt-10">
        <div
          role="status"
          aria-live="polite"
          className="mb-4 text-sm"
          style={{ color: COLOR_TEXT_55 }}
        >
          {statusText}
        </div>
        {filtered.length === 0 ? (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}
          >
            <h3 className="text-lg font-bold" style={{ color: COLOR_TEXT }}>
              {strings.emptyTitle}
            </h3>
            <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_70 }}>
              {strings.emptyDescription}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: COLOR_TEXT_25, color: COLOR_TEXT }}
              >
                {strings.filterResetLabel}
              </button>
              <a
                href={strings.emptyCtaHref}
                className="rounded-md border px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{
                  borderColor: COLOR_ACCENT_25,
                  color: COLOR_ACCENT,
                  backgroundColor: COLOR_ACCENT_15,
                }}
              >
                {strings.emptyCtaLabel}
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filtered.map((card) => {
              const accent = SECTOR_ACCENT[card.dashboardAccent];
              const band = INTENT_BAND[card.intent];
              return (
                <article
                  key={card.id}
                  id={card.id}
                  className="flex flex-col rounded-xl border p-5"
                  style={{
                    borderColor: card.featured ? accent.border : COLOR_TEXT_15,
                    backgroundColor: COLOR_SURFACE,
                  }}
                >
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: accent.text, backgroundColor: accent.bg, border: `1px solid ${accent.border}` }}
                      >
                        {INDUSTRY_SECTOR_LABELS[card.sector]}
                      </span>
                      {card.featured ? (
                        <span
                          className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: COLOR_ACCENT, backgroundColor: COLOR_ACCENT_15, border: `1px solid ${COLOR_ACCENT_25}` }}
                        >
                          {strings.cardFeaturedBadge}
                        </span>
                      ) : null}
                      <span
                        className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: band.accent, border: `1px solid ${band.accent}` }}
                      >
                        {band.label}
                      </span>
                    </div>
                  </header>
                  <h3 className="mt-3 text-lg font-bold" style={{ color: COLOR_TEXT }}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                    {card.directAnswer}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
                      {strings.cardMaterialGradeLabel}:
                    </span>
                    <ComplianceChip badge={card.materialSpec.standard} />
                  </div>

                  {/* Challenge / Solution */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-md border p-3"
                      style={{ borderColor: COLOR_TEXT_15, backgroundColor: 'rgba(248,113,113,0.05)' }}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(252,165,165)' }}>
                        {strings.cardChallengeLabel}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                        {card.challenge}
                      </p>
                    </div>
                    <div
                      className="rounded-md border p-3"
                      style={{ borderColor: COLOR_TEXT_15, backgroundColor: 'rgba(110,231,183,0.05)' }}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(110,231,183)' }}>
                        {strings.cardSolutionLabel}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
                        {card.solution}
                      </p>
                    </div>
                  </div>

                  {/* Evidence metrics (first 3) */}
                  <div className="mt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
                      {strings.cardEvidenceLabel}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {card.evidenceMetrics.slice(0, 3).map((m, idx) => (
                        <MetricChip
                          key={idx}
                          label={m.label}
                          value={m.value}
                          baseline={m.baseline}
                          standard={m.standard}
                          emphasis={m.emphasis}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Compliance chain (top 4 badges) */}
                  <div className="mt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
                      {strings.cardComplianceLabel}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {card.complianceBadges.slice(0, 4).map((b) => (
                        <ComplianceChip key={b.id} badge={b.badge} />
                      ))}
                      {card.complianceBadges.length > 4 ? (
                        <span className="rounded px-2 py-0.5 text-[10px] font-mono" style={{ backgroundColor: COLOR_TEXT_08, color: COLOR_TEXT_55 }}>
                          +{card.complianceBadges.length - 4} more
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3" style={{ borderColor: COLOR_TEXT_15 }}>
                    <button
                      type="button"
                      onClick={() => handleOpenCard(card)}
                      className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ borderColor: accent.border, color: accent.text, backgroundColor: accent.bg }}
                    >
                      {strings.cardViewEvidenceLabel}
                    </button>
                    <a
                      href={buildRfqHref(card, 'industry-rfq')}
                      className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ borderColor: COLOR_ACCENT_25, color: COLOR_ACCENT, backgroundColor: COLOR_ACCENT_15 }}
                    >
                      {strings.cardRfqLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ────────────────────── Section 4: Cross-Industry Comparator ────────────────────── */}
      <div className="mt-12">
        <h2 className="text-xl font-bold sm:text-2xl" style={{ color: COLOR_TEXT }}>
          {strings.comparatorSectionTitle}
        </h2>
        <p className="mt-1 text-sm sm:text-base" style={{ color: COLOR_TEXT_70 }}>
          {strings.comparatorSectionSubtitle}
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border" style={{ borderColor: COLOR_TEXT_15 }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: COLOR_TEXT_08 }}>
              <tr>
                {[strings.comparatorMaterialHeader, strings.comparatorDensityHeader, strings.comparatorTensileHeader, strings.comparatorCorrosionHeader, strings.comparatorBiocompatHeader, strings.comparatorCostHeader].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: COLOR_TEXT_55 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARATOR_ROWS.map((row) => (
                <tr
                  key={row.label}
                  style={{
                    backgroundColor: row.highlight === true ? COLOR_ACCENT_15 : 'transparent',
                    borderTop: `1px solid ${COLOR_TEXT_08}`,
                  }}
                >
                  <td className="px-3 py-2 font-semibold" style={{ color: row.highlight === true ? COLOR_ACCENT : COLOR_TEXT }}>
                    {row.label}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs" style={{ color: COLOR_TEXT_70 }}>{row.density}</td>
                  <td className="px-3 py-2 font-mono text-xs" style={{ color: COLOR_TEXT_70 }}>{row.tensile}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: COLOR_TEXT_70 }}>{row.corrosion}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: COLOR_TEXT_70 }}>{row.biocompat}</td>
                  <td className="px-3 py-2 font-mono text-xs" style={{ color: COLOR_TEXT_70 }}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px]" style={{ color: COLOR_TEXT_40 }}>
          {strings.comparatorNote}
        </p>
      </div>

      {/* ────────────────────── Section 5: Bottom CTA strip ────────────────────── */}
      <div
        className="mt-12 flex flex-col items-start gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: COLOR_ACCENT_25, backgroundColor: COLOR_ACCENT_15 }}
      >
        <div>
          <h3 className="text-lg font-bold sm:text-xl" style={{ color: COLOR_TEXT }}>
            {strings.bottomCtaTitle}
          </h3>
          <p className="mt-2 text-sm" style={{ color: COLOR_TEXT_70 }}>
            {strings.bottomCtaSubtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={strings.bottomCtaPrimaryHref}
            className="rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLOR_ACCENT, color: 'var(--theme-bg)' }}
          >
            {strings.bottomCtaPrimaryLabel}
          </a>
          <a
            href={strings.bottomCtaSecondaryHref}
            className="rounded-md border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ borderColor: COLOR_ACCENT_25, color: COLOR_ACCENT }}
          >
            {strings.bottomCtaSecondaryLabel}
          </a>
        </div>
      </div>

      {/* ────────────────────── Floating CTA: Industry RFQ Drawer trigger ────────────────────── */}
      <Dialog.Root
        open={drawerMode !== null}
        onOpenChange={(open) => {
          if (!open) handleCloseDrawer();
        }}
      >
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-expanded={drawerMode !== null}
            aria-label={strings.drawerFloatingCtaLabel}
            onClick={() => handleOpenDrawer('industry-rfq')}
            className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: COLOR_ACCENT,
              color: 'var(--theme-bg)',
              boxShadow: '0 12px 32px -8px rgba(0,0,0,0.5)',
            }}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {strings.drawerFloatingCtaLabel}
          </button>
        </Dialog.Trigger>
        <DrawerBody
          openCard={openCard}
          onCloseDrawer={handleCloseDrawer}
          drawerSummary={drawerSummary}
          strings={strings}
        />
      </Dialog.Root>

      {/* ────────────────────── Application Detail Modal ────────────────────── */}
      <ApplicationCardModal
        card={openCard}
        onClose={handleCloseCard}
        strings={strings}
      />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// 4. FacetGroup — renders one filter dimension (label + N pills)
// ────────────────────────────────────────────────────────────────────

interface FacetGroupProps {
  readonly label: string;
  readonly values: ReadonlyArray<string>;
  readonly labels: Readonly<Record<string, string>>;
  readonly active: ReadonlyArray<string>;
  readonly onToggle: (v: string) => void;
}

function FacetGroup({ label, values, labels, active, onToggle }: FacetGroupProps): JSX.Element {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: COLOR_TEXT_55 }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <FilterPill
            key={v}
            value={v}
            active={active.includes(v)}
            onToggle={onToggle}
            label={labels[v] ?? v}
          />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// 5. ApplicationCardModal — full evidence + compliance modal
// ────────────────────────────────────────────────────────────────────

interface ApplicationCardModalProps {
  readonly card: ApplicationCard | null;
  readonly onClose: () => void;
  readonly strings: typeof HUB_STRINGS_EN;
}

function ApplicationCardModal({ card, onClose, strings }: ApplicationCardModalProps): JSX.Element {
  const open = card !== null;
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(960px,95vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-2xl"
          style={{
            backgroundColor: COLOR_SURFACE,
            borderColor: COLOR_TEXT_25,
          }}
        >
          {card !== null ? <ModalBody card={card} strings={strings} /> : null}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={strings.modalCloseLabel}
              className="absolute right-4 top-4 rounded-md border p-2 transition-opacity hover:opacity-80"
              style={{ borderColor: COLOR_TEXT_15, color: COLOR_TEXT_70, backgroundColor: COLOR_SURFACE }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModalBody({ card, strings }: { card: ApplicationCard; strings: typeof HUB_STRINGS_EN }): JSX.Element {
  const accent = SECTOR_ACCENT[card.dashboardAccent];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ color: accent.text, backgroundColor: accent.bg, border: `1px solid ${accent.border}` }}
        >
          {INDUSTRY_SECTOR_LABELS[card.sector]}
        </span>
        <ComplianceChip badge={card.materialSpec.standard} />
        {card.materialSpec.biocompatibilityClass !== undefined ? (
          <ComplianceChip badge={card.materialSpec.biocompatibilityClass} />
        ) : null}
      </div>
      <Dialog.Title className="mt-3 text-2xl font-bold" style={{ color: COLOR_TEXT }}>
        {card.title}
      </Dialog.Title>
      <Dialog.Description className="mt-2 text-sm leading-relaxed" style={{ color: COLOR_TEXT_70 }}>
        {card.description}
      </Dialog.Description>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-md border p-4"
          style={{ borderColor: COLOR_TEXT_15, backgroundColor: 'rgba(248,113,113,0.05)' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(252,165,165)' }}>
            {strings.modalChallengeTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR_TEXT_70 }}>{card.challenge}</p>
        </div>
        <div
          className="rounded-md border p-4"
          style={{ borderColor: COLOR_TEXT_15, backgroundColor: 'rgba(110,231,183,0.05)' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(110,231,183)' }}>
            {strings.modalSolutionTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR_TEXT_70 }}>{card.solution}</p>
        </div>
      </div>

      <h3 className="mt-5 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.modalEvidenceTitle}
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {card.evidenceMetrics.map((m, idx) => (
          <MetricChip
            key={idx}
            label={m.label}
            value={m.value}
            baseline={m.baseline}
            standard={m.standard}
            emphasis={m.emphasis}
          />
        ))}
      </div>

      {card.weightComparisonVs !== undefined ? (
        <>
          <h3 className="mt-5 text-base font-bold" style={{ color: COLOR_TEXT }}>
            {strings.modalWeightComparisonTitle}
          </h3>
          <div className="mt-3 overflow-x-auto rounded-md border" style={{ borderColor: COLOR_TEXT_15 }}>
            <table className="w-full text-xs">
              <tbody>
                <tr style={{ borderBottom: `1px solid ${COLOR_TEXT_08}` }}>
                  <th scope="row" className="px-3 py-1.5 text-left font-semibold" style={{ color: COLOR_ACCENT, backgroundColor: COLOR_ACCENT_15 }}>{card.weightComparisonVs.titanium}</th>
                  <td className="px-3 py-1.5 font-mono" style={{ color: COLOR_TEXT_55 }}>This part</td>
                </tr>
                {card.weightComparisonVs.stainless316L !== undefined ? (
                  <tr style={{ borderBottom: `1px solid ${COLOR_TEXT_08}` }}>
                    <th scope="row" className="px-3 py-1.5 text-left font-semibold" style={{ color: COLOR_TEXT_70 }}>{card.weightComparisonVs.stainless316L}</th>
                    <td className="px-3 py-1.5 font-mono" style={{ color: COLOR_TEXT_55 }}>Baseline (heavy)</td>
                  </tr>
                ) : null}
                {card.weightComparisonVs.aluminum7075 !== undefined ? (
                  <tr style={{ borderBottom: `1px solid ${COLOR_TEXT_08}` }}>
                    <th scope="row" className="px-3 py-1.5 text-left font-semibold" style={{ color: COLOR_TEXT_70 }}>{card.weightComparisonVs.aluminum7075}</th>
                    <td className="px-3 py-1.5 font-mono" style={{ color: COLOR_TEXT_55 }}>Baseline (light, weaker)</td>
                  </tr>
                ) : null}
                {card.weightComparisonVs.steel4140 !== undefined ? (
                  <tr>
                    <th scope="row" className="px-3 py-1.5 text-left font-semibold" style={{ color: COLOR_TEXT_70 }}>{card.weightComparisonVs.steel4140}</th>
                    <td className="px-3 py-1.5 font-mono" style={{ color: COLOR_TEXT_55 }}>Baseline (heavy)</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            {card.weightComparisonVs.note !== undefined ? (
              <p className="px-3 py-2 text-[10px]" style={{ color: COLOR_TEXT_40, backgroundColor: COLOR_TEXT_08 }}>
                {card.weightComparisonVs.note}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      <h3 className="mt-5 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.modalComplianceTitle}
      </h3>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {card.complianceBadges.map((b) => (
          <div
            key={b.id}
            className="flex items-start gap-3 rounded-md border p-2.5"
            style={{ borderColor: COLOR_TEXT_15, backgroundColor: COLOR_SURFACE }}
          >
            <ComplianceChip badge={b.badge} />
            <p className="text-xs leading-relaxed" style={{ color: COLOR_TEXT_70 }}>{b.description}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-5 text-base font-bold" style={{ color: COLOR_TEXT }}>
        {strings.modalRelatedPagesLabel}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {card.relatedPages.map((p) => (
          <a
            key={p}
            href={p}
            className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ borderColor: COLOR_TEXT_15, color: COLOR_TEXT_70 }}
          >
            {p}
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t pt-4" style={{ borderColor: COLOR_TEXT_15 }}>
        <a
          href={buildRfqHref(card, 'industry-rfq')}
          className="rounded-md border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: COLOR_ACCENT, color: 'var(--theme-bg)' }}
        >
          {strings.modalRequestCtaLabel}
        </a>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// 6. DrawerBody — Industry RFQ Drawer (Radix Dialog content)
// ────────────────────────────────────────────────────────────────────

interface DrawerBodyProps {
  readonly openCard: ApplicationCard | null;
  readonly onCloseDrawer: () => void;
  readonly drawerSummary: string;
  readonly strings: typeof HUB_STRINGS_EN;
}

function DrawerBody({ openCard, onCloseDrawer, drawerSummary, strings }: DrawerBodyProps): JSX.Element {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      />
      <Dialog.Content
        className="fixed bottom-0 right-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border p-5 shadow-2xl sm:bottom-6 sm:right-6 sm:max-h-[80vh] sm:w-[480px] sm:rounded-2xl"
        style={{
          backgroundColor: COLOR_SURFACE,
          borderColor: COLOR_TEXT_25,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <Dialog.Title className="text-lg font-bold" style={{ color: COLOR_TEXT }}>
              {strings.drawerTitle}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-xs" style={{ color: COLOR_TEXT_70 }}>
              {strings.drawerSubtitle}
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={strings.drawerCancelLabel}
              className="rounded-md border p-2 transition-opacity hover:opacity-80"
              style={{ borderColor: COLOR_TEXT_15, color: COLOR_TEXT_70, backgroundColor: COLOR_SURFACE }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </div>

        {/* Current context summary */}
        <div
          className="mt-3 rounded-md border p-3 text-xs"
          style={{ borderColor: COLOR_ACCENT_25, backgroundColor: COLOR_ACCENT_15, color: COLOR_TEXT }}
        >
          {strings.drawerSelectedContextTemplate.replace('{summary}', drawerSummary)}
        </div>

        {/* Drawer mode buttons */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          <DrawerModeButton
            mode="industry-rfq"
            label={strings.drawerModeIndustryRfq}
            desc={strings.drawerModeIndustryRfqDesc}
            onSelect={onCloseDrawer}
            openCard={openCard}
          />
          <DrawerModeButton
            mode="industry-drawing"
            label={strings.drawerModeIndustryDrawing}
            desc={strings.drawerModeIndustryDrawingDesc}
            onSelect={onCloseDrawer}
            openCard={openCard}
          />
          <DrawerModeButton
            mode="audit"
            label={strings.drawerModeAudit}
            desc={strings.drawerModeAuditDesc}
            onSelect={onCloseDrawer}
            openCard={openCard}
          />
          <DrawerModeButton
            mode="cmm-sample"
            label={strings.drawerModeCmmSample}
            desc={strings.drawerModeCmmSampleDesc}
            onSelect={onCloseDrawer}
            openCard={openCard}
          />
          <DrawerModeButton
            mode="mtr-sample"
            label={strings.drawerModeMtrSample}
            desc={strings.drawerModeMtrSampleDesc}
            onSelect={onCloseDrawer}
            openCard={openCard}
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3" style={{ borderColor: COLOR_TEXT_15 }}>
          <button
            type="button"
            onClick={onCloseDrawer}
            className="rounded-md border px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ borderColor: COLOR_TEXT_15, color: COLOR_TEXT_70 }}
          >
            {strings.drawerCancelLabel}
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

interface DrawerModeButtonProps {
  readonly mode: IndustryDrawerMode;
  readonly label: string;
  readonly desc: string;
  readonly onSelect: () => void;
  readonly openCard: ApplicationCard | null;
}

function DrawerModeButton({ mode, label, desc, onSelect, openCard }: DrawerModeButtonProps): JSX.Element {
  return (
    <a
      href={buildRfqHref(openCard, mode)}
      onClick={onSelect}
      className="block rounded-md border p-3 transition-colors hover:opacity-90"
      style={{
        borderColor: COLOR_TEXT_15,
        backgroundColor: COLOR_SURFACE,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold" style={{ color: COLOR_TEXT }}>{label}</div>
        <svg className="h-4 w-4 shrink-0" style={{ color: COLOR_ACCENT }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: COLOR_TEXT_70 }}>{desc}</p>
    </a>
  );
}















