// src/lib/mentions.ts
// F3.2 - Page-level mentions builders for WebPage JSON-LD.
// Extracted from entity-graph.ts (2026-08-25) to isolate the new helpers
// from the proven F3 surface (refsFromIds, getEntityRef, etc.) and to
// unblock syntax repair on entity-graph.ts.
//
// =========================================================================
// CANONICAL INPUT SCHEMAS (verified 2026-08-25 against src/content/* JSON).
// These are the ONLY fields each builder reads; nothing else is consulted.
// =========================================================================
//
// Product (src/content/product-entities/*.json - 260 files, all uniform):
//   industry             : string                fuzzy-match  -> industry
//   relatedIndustries    : slug[]                exact-slug   -> industry
//   material             : string                fuzzy-match  -> material
//   system               : string                fuzzy-match  -> application
//   process              : string[]              fuzzy-match  -> process
//   standards            : string[]              fuzzy-match  -> standard
//   relatedCapabilities  : slug[]                exact-slug   -> process
//
// Capability (src/content/capabilities/*.json - 445 files, all uniform):
//   industries           : slug[]                exact-slug   -> industry
//   materials            : string[]              fuzzy-match  -> material
//   typicalApplications  : string[]              fuzzy-match  -> application
//   qualityStandards     : string[]              fuzzy-match  -> standard
//
// Industry (src/content/industries/*.json - 12 files, all uniform):
//   applications         : string[]              fuzzy-match  -> application
//   systems              : string[]              fuzzy-match  -> application
//
// Notes:
//   - Slug arrays (relatedIndustries / relatedCapabilities / industries) are
//     resolved by exact slug lookup against the registry (entity.slug or
//     entity._source_slug). Fuzzy matching is NOT applied to slug arrays
//     because they are identifiers, not display strings.
//   - Fields that do not exist in source data (e.g. materials on industry
//     pages) are NOT consulted. No silent fallbacks across alternative field
//     names; if the schema changes, the TypeScript type checker surfaces
//     the gap at the call site.
// =========================================================================

import {
  getAllEntities,
  type EntityRecord,
} from './entity-graph';

// ---------------------------------------------------------------------------
// Typed schemas (structural) - mirror the canonical field names above.
// ---------------------------------------------------------------------------

export interface ProductData {
  industry?: string;
  relatedIndustries?: readonly string[];
  material?: string;
  system?: string;
  process?: readonly string[];
  standards?: readonly string[];
  relatedCapabilities?: readonly string[];
  [k: string]: unknown;
}

export interface CapabilityData {
  industries?: readonly string[];
  materials?: readonly string[];
  typicalApplications?: readonly string[];
  qualityStandards?: readonly string[];
  [k: string]: unknown;
}

export interface IndustryData {
  applications?: readonly string[];
  systems?: readonly string[];
  [k: string]: unknown;
}

// ---------------------------------------------------------------------------
// Scoring primitives
// ---------------------------------------------------------------------------

const _norm = (s: string): string =>
  String(s || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function scoreMatch(value: string, entity: EntityRecord): number | null {
  if (!value) return null;
  const v = _norm(value);
  if (!v) return null;
  const candidates: string[] = [
    entity.canonical_name || '',
    ...(entity.aliases || []),
  ];
  let best: number | null = null;
  for (const c of candidates) {
    const cn = _norm(c);
    if (!cn) continue;
    if (v === cn) return 100;
    if (cn.length >= 8 && (v.includes(cn) || cn.includes(v))) {
      best = Math.max(best || 0, 90);
    } else {
      const vTokens = new Set(v.split(' ').filter((t) => t.length > 2));
      const cTokens = new Set(cn.split(' ').filter((t) => t.length > 2));
      if (vTokens.size > 0 && cTokens.size > 0) {
        const intersect = [...vTokens].filter((t) => cTokens.has(t)).length;
        const ratio = intersect / Math.max(vTokens.size, cTokens.size);
        if (ratio >= 0.7) best = Math.max(best || 0, 70);
      }
    }
  }
  return best;
}

function findBest(
  value: string,
  topCategory?: string,
): { id: string; score: number } | null {
  let best: { id: string; score: number } | null = null;
  for (const e of getAllEntities()) {
    if (topCategory && e.category !== topCategory) continue;
    const sc = scoreMatch(value, e);
    if (sc !== null && (best === null || sc > best.score)) {
      best = { id: e.id, score: sc };
    }
  }
  return best;
}

function idFromField(value: string | null | undefined, category: string): string | null {
  if (!value || typeof value !== 'string') return null;
  const hit = findBest(value, category);
  return hit && (hit.score || 0) >= 70 ? hit.id : null;
}

function idsFromField(
  values: readonly string[] | null | undefined,
  category: string,
  cap = 5,
): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (out.length >= cap) break;
    if (typeof v !== 'string') continue;
    const hit = findBest(v, category);
    if (hit && (hit.score || 0) >= 70 && !seen.has(hit.id)) {
      seen.add(hit.id);
      out.push(hit.id);
    }
  }
  return out;
}

// Slug-based resolver: relatedIndustries / relatedCapabilities / industries
// carry slug identifiers (e.g. "cnc-milling"), not display strings. We match
// them against entity.slug or entity._source_slug exactly. Fuzzy matching
// would produce wrong or duplicate IDs.
function idFromSlug(slug: string | null | undefined, category: string): string | null {
  if (!slug || typeof slug !== 'string') return null;
  const norm = slug.trim();
  if (!norm) return null;
  for (const e of getAllEntities()) {
    if (e.category !== category) continue;
    if (e.slug === norm) return e.id;
    if (e._source_slug === norm) return e.id;
  }
  return null;
}

function idsFromSlugs(
  slugs: readonly string[] | null | undefined,
  category: string,
  cap = 5,
): string[] {
  if (!Array.isArray(slugs)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of slugs) {
    if (out.length >= cap) break;
    if (typeof s !== 'string') continue;
    const id = idFromSlug(s, category);
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public builders
// ---------------------------------------------------------------------------

/**
 * mentionsForProduct - product detail page.
 * Reads the canonical ProductData fields. Missing fields contribute nothing;
 * no silent fallbacks across alternative field names.
 */
export function mentionsForProduct(
  data: ProductData,
  currentProductId?: string,
  cap = 12,
): string[] {
  if (!data || typeof data !== 'object') return [];
  const ids: string[] = [];
  const seen = new Set<string>();
  if (currentProductId) seen.add(currentProductId);

  const push = (id: string | null | undefined): void => {
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  };

  // industry (display string -> fuzzy)
  push(idFromField(data.industry, 'industry'));
  // relatedIndustries (slug array -> exact)
  for (const id of idsFromSlugs(data.relatedIndustries, 'industry', 3)) push(id);
  // material (display string -> fuzzy)
  push(idFromField(data.material, 'material'));
  // system (display string -> application)
  push(idFromField(data.system, 'application'));
  // process (display array -> fuzzy)
  for (const id of idsFromField(data.process, 'process', 3)) push(id);
  // standards (display array -> fuzzy)
  for (const id of idsFromField(data.standards, 'standard', 3)) push(id);
  // relatedCapabilities (slug array -> exact)
  for (const id of idsFromSlugs(data.relatedCapabilities, 'process', 3)) push(id);

  return ids.slice(0, cap);
}

/**
 * mentionsForCapability - capability / process detail page.
 * Reads the canonical CapabilityData fields.
 */
export function mentionsForCapability(
  data: CapabilityData,
  currentCapabilityId?: string,
  cap = 12,
): string[] {
  if (!data || typeof data !== 'object') return [];
  const ids: string[] = [];
  const seen = new Set<string>();
  if (currentCapabilityId) seen.add(currentCapabilityId);

  const push = (id: string | null | undefined): void => {
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  };

  // industries (slug array -> exact)
  for (const id of idsFromSlugs(data.industries, 'industry', 2)) push(id);
  // materials (display array -> fuzzy)
  for (const id of idsFromField(data.materials, 'material', 3)) push(id);
  // typicalApplications (display array -> fuzzy)
  for (const id of idsFromField(data.typicalApplications, 'application', 4)) push(id);
  // qualityStandards (display array -> fuzzy)
  for (const id of idsFromField(data.qualityStandards, 'standard', 3)) push(id);

  return ids.slice(0, cap);
}

/**
 * mentionsForIndustry - industry detail page.
 * Reads the canonical IndustryData fields. Industry frontmatter only has
 * applications and systems; other fields are not consulted.
 */
export function mentionsForIndustry(
  data: IndustryData,
  currentIndustryId?: string,
  cap = 12,
): string[] {
  if (!data || typeof data !== 'object') return [];
  const ids: string[] = [];
  const seen = new Set<string>();
  if (currentIndustryId) seen.add(currentIndustryId);

  const push = (id: string | null | undefined): void => {
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  };

  for (const id of idsFromField(data.applications, 'application', 4)) push(id);
  for (const id of idsFromField(data.systems, 'application', 3)) push(id);

  return ids.slice(0, cap);
}
