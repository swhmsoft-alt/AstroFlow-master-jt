/**
 * KnowledgeFacetSidebar.tsx
 *
 * 4-dimensional facet sidebar. Each dimension is a WAI-ARIA `role="group"`
 * containing a list of native checkboxes — semantic, keyboard-accessible
 * (Tab + Space), and screen-reader friendly without any custom widget code.
 *
 * The numeric count next to each option is the "what would match if I picked
 * this option, given my OTHER current filters" count (standard faceting
 * pattern). Counts of 0 are visually de-emphasized but remain clickable
 * (they reset cleanly).
 *
 * Mobile: the sidebar collapses into a top-of-grid drawer (state lifted
 * to the hub). On desktop, sticky-positioned.
 */
import type {
  KnowledgeFacetGroup,
  KnowledgeFilters,
  KnowledgeGrade,
  KnowledgeProcess,
  KnowledgeStandard,
  KnowledgeIndustry,
} from './knowledge-data';

interface Props {
  groups: readonly KnowledgeFacetGroup[];
  filters: KnowledgeFilters;
  onToggleGrade: (g: KnowledgeGrade) => void;
  onToggleProcess: (p: KnowledgeProcess) => void;
  onToggleStandard: (s: KnowledgeStandard) => void;
  onToggleIndustry: (i: KnowledgeIndustry) => void;
  onReset: () => void;
  resetLabel: string;
  activeFilterCount: number;
}

export function KnowledgeFacetSidebar({
  groups,
  filters,
  onToggleGrade,
  onToggleProcess,
  onToggleStandard,
  onToggleIndustry,
  onReset,
  resetLabel,
  activeFilterCount,
}: Props) {
  const isChecked = (
    dimension: 'grade' | 'process' | 'standard' | 'industry',
    id: string,
  ): boolean => {
    switch (dimension) {
      case 'grade': return filters.grades.includes(id as KnowledgeGrade);
      case 'process': return filters.processes.includes(id as KnowledgeProcess);
      case 'standard': return filters.standards.includes(id as KnowledgeStandard);
      case 'industry': return filters.industries.includes(id as KnowledgeIndustry);
    }
  };

  const handleToggle = (
    dimension: 'grade' | 'process' | 'standard' | 'industry',
    id: string,
  ): void => {
    switch (dimension) {
      case 'grade': onToggleGrade(id as KnowledgeGrade); return;
      case 'process': onToggleProcess(id as KnowledgeProcess); return;
      case 'standard': onToggleStandard(id as KnowledgeStandard); return;
      case 'industry': onToggleIndustry(id as KnowledgeIndustry); return;
    }
  };

  return (
    <aside
      className="lg:sticky lg:top-24"
      aria-label="Knowledge base filters"
    >
      <div
        className="rounded-2xl border p-5"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
          borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--theme-text)' }}
          >
            Filters
            {activeFilterCount > 0 && (
              <span
                className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.7rem] font-semibold"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'var(--theme-bg)',
                }}
                aria-label={`${activeFilterCount} active filters`}
              >
                {activeFilterCount}
              </span>
            )}
          </h2>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ color: 'var(--theme-primary)' }}
            >
              {resetLabel}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.dimension}
              role="group"
              aria-label={group.label}
            >
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}
              >
                {group.label}
              </h3>
              <ul className="space-y-1.5">
                {group.options.map((opt) => {
                  const checked = isChecked(group.dimension, opt.id);
                  return (
                    <li key={opt.id}>
                      <label
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_6%,transparent)]"
                        style={{ color: 'var(--theme-text)' }}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border accent-[var(--theme-primary)]"
                          style={{
                            borderColor: 'color-mix(in srgb, var(--theme-text) 30%, transparent)',
                          }}
                          checked={checked}
                          onChange={() => handleToggle(group.dimension, opt.id)}
                          aria-checked={checked}
                        />
                        <span className="flex-1 truncate">{opt.label}</span>
                        <span
                          className="ml-auto text-xs tabular-nums"
                          style={{
                            color: opt.count === 0
                              ? 'color-mix(in srgb, var(--theme-text) 35%, transparent)'
                              : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                          }}
                        >
                          {opt.count}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
