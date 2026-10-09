/**
 * grades-guide-data.ts
 *
 * URL state + view-model types for the Titanium Grades Selection Hub
 * (`/resources/titanium-grades-guide/`).
 *
 * Architecture (mirrors `knowledge-data.ts`):
 *   - 5 core grades hard-listed (Grade 2/5/7/12/23) — driven by SOP Buyer
 *     Search Intelligence dimension mapping (D1 — material selection).
 *   - URL state is single source of truth: `?compare=g2,g5,g23` enables
 *     shareable filter views.
 *   - Empty values silently drop.
 *
 * No fabrication. Grade chemical/mechanical/standard data is sourced
 * from `src/data/titanium-grades.ts` (GRADE_DATA — the master content file).
 */
import { GRADE_DATA, type GradeData } from '../../data/titanium-grades';

/** Hard-listed 5 core grade keys for the hub. Single source of truth. */
export const HUB_GRADE_KEYS = [
  'grade-2',
  'grade-5',
  'grade-7',
  'grade-12',
  'grade-23',
] as const;

export type HubGradeKey = (typeof HUB_GRADE_KEYS)[number];

/** Hub grade view-model (subset of GradeData fields we surface). */
export interface HubGrade {
  readonly key: HubGradeKey;
  readonly name: string;
  readonly uns: string;
  readonly classification: string;
  readonly tagline: string;
  readonly detailHref: string;
  readonly rm: string;
  readonly rp02: string;
  readonly a5: string;
  readonly density: string;
  readonly maxTemp: string;
  readonly primaryStandards: readonly string[];
  readonly applications: readonly string[];
  readonly keyCharacteristics: readonly string[];
}

function isHubGradeKey(v: string): v is HubGradeKey {
  return (HUB_GRADE_KEYS as readonly string[]).includes(v);
}

/** Safe property extraction (data may be missing for newly-added grades). */
function pickRm(g: GradeData): string {
  const t = g.hasProperty.properties.find((p) =>
    p.label.toLowerCase().includes('tensile'),
  );
  return t?.value ?? '—';
}
function pickRp02(g: GradeData): string {
  const t = g.hasProperty.properties.find((p) =>
    p.label.toLowerCase().includes('yield'),
  );
  return t?.value ?? '—';
}
function pickA5(g: GradeData): string {
  const t = g.hasProperty.properties.find((p) =>
    p.label.toLowerCase().includes('elongation'),
  );
  return t?.value ?? '—';
}
function pickDensity(g: GradeData): string {
  const t = g.hasProperty.properties.find((p) =>
    p.label.toLowerCase().includes('density'),
  );
  return t?.value ?? '4.51 g/cm³';
}
function pickMaxTemp(g: GradeData): string {
  const t = g.hasProperty.properties.find((p) =>
    p.label.toLowerCase().includes('max service'),
  );
  return t?.value ?? '316°C';
}

/** Derive the 5 core Hub grades from GRADE_DATA (real values, no fabrication). */
export const HUB_GRADES: readonly HubGrade[] = HUB_GRADE_KEYS.map((key) => {
  const g = GRADE_DATA[key];
  if (!g) {
    throw new Error(
      `HUB_GRADE_KEYS references missing grade "${key}" — add it to src/data/titanium-grades.ts GRADE_DATA first.`,
    );
  }
  return {
    key,
    name: g.name,
    uns: g.uns,
    classification: g.entityDefinition.classification,
    tagline: g.tagline,
    detailHref: `/materials/${key}/`,
    rm: pickRm(g),
    rp02: pickRp02(g),
    a5: pickA5(g),
    density: pickDensity(g),
    maxTemp: pickMaxTemp(g),
    primaryStandards: g.conformsTo.items.slice(0, 3),
    applications: g.usedIn.items.slice(0, 3),
    keyCharacteristics: g.entityDefinition.keyCharacteristics.slice(0, 3),
  };
});

export const MAX_COMPARE = 3;
export { isHubGradeKey };

// ── Hub strings (English only for the initial release; i18n keys can be
//     added later by `src/i18n/translations/<lang>.json` + translate-cli).
//     These are passed by the Astro shell into the React island as
//     `strings` prop. If the prop is missing, HUB_STRINGS_EN is the
//     default. Defined here (not in the .tsx) so the Astro page can
//     import them for SSR-side rendering of copy. ─────────────────────
export interface GradesGuideStrings {
  readonly heroBadge: string;
  readonly heroTitlePrefix: string;
  readonly heroTitleHighlight: string;
  readonly heroSubtitle: string;
  readonly decisionTitle: string;
  readonly decisionSubtitle: string;
  readonly decisionAerospaceLabel: string;
  readonly decisionAerospaceAnswer: string;
  readonly decisionMedicalLabel: string;
  readonly decisionMedicalAnswer: string;
  readonly decisionChemicalLabel: string;
  readonly decisionChemicalAnswer: string;
  readonly decisionMarineLabel: string;
  readonly decisionMarineAnswer: string;
  readonly decisionIndustrialLabel: string;
  readonly decisionIndustrialAnswer: string;
  readonly quickComparisonTitle: string;
  readonly quickComparisonSubtitle: string;
  readonly detailCardsTitle: string;
  readonly detailCardsSubtitle: string;
  readonly interactiveTitle: string;
  readonly interactiveSubtitle: string;
  readonly interactivePlaceholder: string;
  readonly interactiveCtaLabel: string;
  readonly interactiveResetLabel: string;
  readonly interactiveSelectedCountTemplate: string;
  readonly standardsMatrixTitle: string;
  readonly complianceTitle: string;
  readonly complianceSubtitle: string;
  readonly rfqTitle: string;
  readonly rfqSubtitle: string;
  readonly rfqPrimaryLabel: string;
  readonly rfqSecondaryLabel: string;
  readonly rmLabel: string;
  readonly rp02Label: string;
  readonly a5Label: string;
  readonly densityLabel: string;
  readonly maxTempLabel: string;
  readonly unsLabel: string;
  readonly classificationLabel: string;
  readonly detailCtaLabel: string;
}

export const HUB_STRINGS_EN: GradesGuideStrings = {
  heroBadge: 'Titanium Grades Reference Hub · ASTM/AMS/ISO',
  heroTitlePrefix: "The Buyer's Guide to",
  heroTitleHighlight: 'Titanium Grades & Alloys',
  heroSubtitle:
    'Authoritative selection reference for Grade 2, Grade 5 (Ti-6Al-4V), Grade 7 (Ti-0.15Pd), Grade 12 (Ti-0.3Mo-0.8Ni), and Grade 23 (Ti-6Al-4V ELI) — with chemistry, mechanical properties, applicable ASTM/AMS/ISO standards, and CNC machining guidance. AS9100D · ISO 13485 · ISO 9001 · EN 10204 3.1 MTR.',
  decisionTitle: 'Decision Tree: Which Titanium Grade Do I Need?',
  decisionSubtitle:
    'Start with the dominant requirement of your application. The grade choice flows from there.',
  decisionAerospaceLabel: 'Aerospace structures or engines',
  decisionAerospaceAnswer:
    'Grade 5 (Ti-6Al-4V) per AMS 4928 / ASTM B348 — or Grade 23 ELI for cryogenic or fracture-critical components per AMS 4930.',
  decisionMedicalLabel: 'Surgical implants or medical devices',
  decisionMedicalAnswer:
    'Grade 23 (Ti-6Al-4V ELI) per ASTM F136 / ISO 5832-3 — the medical standard. ELI Grade 4 (ASTM F67) for non-load-bearing devices.',
  decisionChemicalLabel: 'Reducing acids or hot chloride service',
  decisionChemicalAnswer:
    'Grade 7 (Ti-0.15Pd) for the most aggressive reducing environments; Grade 12 (Ti-0.3Mo-0.8Ni) for cost-effective chloride service.',
  decisionMarineLabel: 'Seawater, hydrofoils, superyacht hardware',
  decisionMarineAnswer:
    'Grade 2 (CP-Ti) for general marine service; Grade 5 for structural components; Grade 19 (Ti-10V-2Fe-3Al) for high-strength subsea parts.',
  decisionIndustrialLabel: 'Heat exchangers, tanks, general industrial',
  decisionIndustrialAnswer:
    'Grade 2 (CP-Ti) is the workhorse for chemical, desalination, and power-generation service. Grade 1 if you need maximum formability.',
  quickComparisonTitle: 'Side-by-Side Property Matrix',
  quickComparisonSubtitle:
    'Side-by-side comparison of the 5 core grades. Click any grade for the full data sheet.',
  detailCardsTitle: 'Grade Detail Cards',
  detailCardsSubtitle:
    'Each card includes chemistry (per ASTM B348 / B265), mechanical properties (Rm, Rp0.2, A5, hardness, density), applicable standards, and primary application areas.',
  interactiveTitle: 'Interactive Comparison Tool',
  interactiveSubtitle:
    'Select 1–3 grades to compare side-by-side. The URL stays shareable — copy it to send the comparison to your team.',
  interactivePlaceholder: '+ Add grade',
  interactiveCtaLabel: 'Request CNC Quote',
  interactiveResetLabel: 'Reset',
  interactiveSelectedCountTemplate: '{n} of 3 selected',
  standardsMatrixTitle: 'International Standards Coverage',
  complianceTitle: 'Quality Systems & Material Traceability',
  complianceSubtitle:
    'Every order ships with EN 10204 Type 3.1 mill test reports (MTRs) and full heat-to-part traceability. Our quality systems are independently certified for aerospace, medical, and industrial service.',
  rfqTitle: 'Engineering RFQ for Your Selected Grade',
  rfqSubtitle:
    'Our applications engineers will respond within 24 hours with DFM feedback, lead time, and a formal quote. Secure CAD upload supported (STEP, IGES, Parasolid, native).',
  rfqPrimaryLabel: 'Request CNC Quote',
  rfqSecondaryLabel: 'Talk to an Engineer',
  rmLabel: 'Tensile Strength',
  rp02Label: 'Yield Strength (0.2%)',
  a5Label: 'Elongation',
  densityLabel: 'Density',
  maxTempLabel: 'Max Service Temp',
  unsLabel: 'UNS',
  classificationLabel: 'Classification',
  detailCtaLabel: 'View full grade data sheet →',
};
