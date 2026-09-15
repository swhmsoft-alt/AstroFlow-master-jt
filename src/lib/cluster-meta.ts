/**
 * src/lib/cluster-meta.ts
 *
 * P3 — Single source of truth for 7 topic-cluster Hub pages.
 * Used by:
 *   - 7 × src/pages/blog/<cluster-slug>/index.astro (Hub skeleton)
 *   - src/pages/blog/index.astro (P4 L0 Hub of Hubs — adjacent nav)
 *
 * Conventions:
 *   - `slug` is the URL path segment under /blog/<slug>/.
 *   - `name` is the canonical display label (matches frontmatter `category`
 *     values post-P1 migration).
 *   - `featured` points to the Featured article (frontmatter featured=true)
 *     that should be promoted on this cluster's Hub. null when no natural
 *     Featured candidate exists (cluster ⑥ Applications & Industries).
 *   - `adjacent` lists 1-2 cluster slugs for the cross-cluster rail.
 *   - `icon` is a 24×24 stroke-based SVG path (matches CATEGORY_ICONS
 *     style in src/pages/blog/index.astro).
 *   - Long-form "why this matters" text is intentionally NOT here; each
 *     Hub page owns its own copy.
 */

export type ClusterSlug =
  | 'materials-grades'
  | 'machining-processes'
  | 'design-dfm'
  | 'problems-solutions'
  | 'quality-standards'
  | 'applications-industries'
  | 'procurement-services';

export interface ClusterMeta {
  slug: ClusterSlug;
  name: string;
  h1: string;
  lede: string;
  featured: string | null;
  adjacent: ClusterSlug[];
  icon: string;
}

export const CLUSTERS: readonly ClusterMeta[] = Object.freeze([
  {
    slug: 'materials-grades',
    name: 'Materials & Grades',
    h1: 'Titanium Materials & Grades — Engineering Reference',
    lede:
      'CP, alpha, alpha-beta, and beta titanium alloys — composition, mechanical properties, ASTM/ASME/AMS/ISO standards, and grade-selection logic for aerospace, medical, chemical, and industrial applications.',
    featured: 'titanium-grades-complete-guide-cp-alpha-beta-alloys',
    adjacent: ['machining-processes', 'quality-standards'],
    icon:
      'M9 3v2m0 0a3 3 0 00-3 3v1a3 3 0 003 3m0-7a3 3 0 013 3v1a3 3 0 01-3 3m0-7v7m6-7v2m0 0a3 3 0 013 3v1a3 3 0 01-3 3m0-7v7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    slug: 'machining-processes',
    name: 'Machining Processes',
    h1: 'Titanium Machining Processes — Milling, Turning, Drilling & EDM',
    lede:
      'Process parameters, tooling selection, coolant strategy, and defect prevention for milling, turning, drilling, tapping, EDM, and grinding of titanium alloys.',
    featured: 'titanium-machining-processes-milling-turning-drilling-edm',
    adjacent: ['materials-grades', 'problems-solutions'],
    icon:
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    slug: 'design-dfm',
    name: 'Design & DFM',
    h1: 'Design for Machinability — Titanium Part Engineering',
    lede:
      'DFM rules for CNC-machined titanium parts: dimensional tolerances, wall thickness, corner radii, thread specifications, hole geometry, and feature accessibility.',
    featured: 'titanium-cnc-design-guide-machinability-rules',
    adjacent: ['problems-solutions', 'quality-standards'],
    icon:
      'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
  {
    slug: 'problems-solutions',
    name: 'Problems & Solutions',
    h1: 'Titanium Machining Problems & Solutions',
    lede:
      'Troubleshooting guides for chatter, work hardening, surface roughness, burr formation, springback, alpha-case formation, and tool wear in titanium CNC machining.',
    featured: 'why-titanium-is-difficult-to-machine',
    adjacent: ['machining-processes', 'design-dfm'],
    icon:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
  },
  {
    slug: 'quality-standards',
    name: 'Quality & Standards',
    h1: 'Titanium Parts Quality & Standards — AS9100 / ASTM / NDT',
    lede:
      'AS9100D, ISO 13485, Nadcap, ASTM B348 / B265 / F136, MTR, CoC, FAI, dimensional inspection, surface finish measurement, and non-destructive testing for titanium parts.',
    featured: 'ultimate-guide-titanium-surface-treatments-aerospace',
    adjacent: ['materials-grades', 'applications-industries'],
    icon:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    slug: 'applications-industries',
    name: 'Applications & Industries',
    h1: 'Titanium Parts by Industry — Aerospace, Medical, Racing, Chemical',
    lede:
      'Industry-specific titanium applications: aerospace structural and engine components, medical implants and instruments, motorsports and racing, chemical processing equipment, subsea and offshore, semiconductor chamber hardware.',
    featured: null,
    adjacent: ['procurement-services', 'quality-standards'],
    icon:
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    slug: 'procurement-services',
    name: 'Procurement & Services',
    h1: 'Procurement & Services — RFQ, Supplier Evaluation, Cost',
    lede:
      'RFQ preparation, supplier qualification (AS9100 / ISO 13485), cost drivers, lead times, MOQ, Incoterms, and sourcing strategy for titanium CNC machined parts.',
    featured: 'how-to-choose-titanium-cnc-machining-supplier',
    adjacent: ['applications-industries', 'quality-standards'],
    icon:
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
]);

export const CLUSTER_BY_SLUG: Readonly<Record<ClusterSlug, ClusterMeta>> =
  Object.freeze(
    CLUSTERS.reduce(
      (acc, c) => {
        acc[c.slug] = c;
        return acc;
      },
      {} as Record<ClusterSlug, ClusterMeta>
    )
  );

export function getClusterMeta(slug: string): ClusterMeta | undefined {
  return (CLUSTER_BY_SLUG as Record<string, ClusterMeta | undefined>)[slug];
}

export const CLUSTER_NAMES: readonly string[] = Object.freeze(
  CLUSTERS.map(c => c.name)
);
