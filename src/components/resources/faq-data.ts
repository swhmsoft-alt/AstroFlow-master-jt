/**
 * faq-data.ts
 *
 * Canonical FAQ dataset for the Resources Hub pillar page
 * `/resources/faq/`. 24 entries across 6 procurement-oriented categories.
 *
 * Conventions:
 *   - `id` is the URL slug AND the JSON-LD @id anchor (#faq-{id})
 *   - `answerHtml` is a trusted, authored string. Allowed tags: <strong>, <code>, <em>.
 *     NEVER inject user-supplied content here — schema.ts will strip tags
 *     for the Answer.text payload but the on-page render uses dangerouslySetInnerHTML.
 *   - `tags` are lowercase keywords used for the secondary search match (alongside
 *     question + plain-text answer). Affects ranking only, not visibility filter.
 *
 * The dataset is also passed (after `stripHtml`) to `BaseLayout.faqItems` so
 * the page-level FAQPage JSON-LD is generated automatically — see FaqPage.astro.
 * Do NOT add inline `<script type="application/ld+json">` elsewhere on this page
 * (SOP §F4 red line).
 */

export const FAQ_CATEGORY_IDS = [
  'general',
  'materials',
  'cnc-machining',
  'surface-finishing',
  'quality',
  'shipping',
] as const;

export type FaqCategoryId = (typeof FAQ_CATEGORY_IDS)[number];

export interface FaqEntry {
  /** URL-safe slug, also used as the JSON-LD anchor (#faq-{id}). */
  readonly id: string;
  readonly category: FaqCategoryId;
  /** Plain text — schema.org Question.name + visible question. */
  readonly question: string;
  /** Authored HTML — visible answer. Stripped to plain text for schema.org Answer.text. */
  readonly answerHtml: string;
  /** Lowercase search tags. Matched case-insensitively in the FAQ search. */
  readonly tags: readonly string[];
}

/**
 * 24 entries. Each category has exactly 4 entries (4 × 6 = 24). The
 * previous static FaqPage.astro content (DFARS, NDT, hydrogen embrittlement,
 * GD&T, wall thickness, surface finish) is preserved verbatim in their
 * respective new categories.
 */
export const FAQ_ENTRIES: readonly FaqEntry[] = [
  // ── General (4) ─────────────────────────────────────────
  {
    id: 'industries-served',
    category: 'general',
    question: 'Which industries does BOZE primarily serve?',
    answerHtml:
      'BOZE serves <strong>aerospace & defense</strong>, <strong>medical devices</strong> (Class I–II long-term implants under ISO 13485), motorsports, chemical processing, marine & offshore, and general industrial OEMs. Our titanium manufacturing is purpose-built for buyers whose specifications require controlled raw-material traceability (DFARS, EN 10204 3.1) and ITAR-aware handling.',
    tags: ['industries', 'markets', 'aerospace', 'medical', 'automotive', 'motorsport', 'chemical', 'marine'],
  },
  {
    id: 'how-to-start',
    category: 'general',
    question: 'How do I start a project with BOZE — and what information should I send?',
    answerHtml:
      'Submit an inquiry through our <strong>RFQ portal</strong> at <code>/rfq/</code>. Please attach: (1) your 3D CAD model (STEP AP242 or native), (2) a drawing with GD&T callouts and surface-finish requirements, (3) target annual volume, (4) required certification scope (AS9100D, ISO 13485, EN 10204 3.1/3.2), and (5) any NDA or DFARS restrictions. Our engineering team returns a DFM report within <strong>1–2 business days</strong>.',
    tags: ['rfq', 'process', 'how-to-start', 'project', 'inquiry', 'dfm'],
  },
  {
    id: 'minimum-order-quantity',
    category: 'general',
    question: 'What is the typical minimum order quantity (MOQ) for production orders?',
    answerHtml:
      'For <strong>CNC machined titanium parts</strong>, MOQ is typically <strong>10 pieces</strong> per part number. For <strong>additive (SLM/DMLS)</strong> builds, MOQ is <strong>1 build envelope</strong> (multiple parts nested). For <strong>rapid prototyping</strong>, MOQ is effectively 1 piece with our 3–7 day standard turnaround. We do not run injection-molding-style mass production; if you need 100,000+ pieces, we will redirect you.',
    tags: ['moq', 'quantity', 'order', 'volume', 'prototype', 'mass-production'],
  },
  {
    id: 'nda-and-ip-protection',
    category: 'general',
    question: 'Do you sign NDAs before reviewing our designs?',
    answerHtml:
      'Yes. Every design review is conducted under an executed <strong>mutual NDA</strong> as standard procedure — no charge for the NDA itself. We never retain copies of customer CAD beyond the production contract horizon. All file uploads go through encrypted channels, and our facility is <strong>ITAR-aware</strong> (we do not hold an ITAR registration; for ITAR-restricted work we partner with a registered sub-tier).',
    tags: ['nda', 'confidentiality', 'ip', 'itar', 'security'],
  },

  // ── Materials (4) ─────────────────────────────────────
  {
    id: 'titanium-grades-available',
    category: 'materials',
    question: 'Which titanium grades can BOZE machine?',
    answerHtml:
      'We routinely work with <strong>Grade 1, Grade 2, Grade 3, Grade 5 (Ti-6Al-4V), Grade 5 ELI, Grade 9 (Ti-3Al-6Al-4V), Grade 23 (Ti-6Al-4V ELI)</strong>, plus aerospace alloys <strong>Ti-6Al-2Sn-4Zr-6Mo (Ti-6246)</strong> and <strong>Ti-10V-2Fe-3Al (Ti-10-2-3)</strong>. We also process commercially pure titanium for chemical-processing service. Each bar comes with a heat-traceable MTR.',
    tags: ['materials', 'grades', 'grade-1', 'grade-2', 'grade-5', 'grade-9', 'grade-23', 'ti-6al-4v'],
  },
  {
    id: 'titanium-grade-5-vs-gr23',
    category: 'materials',
    question: 'Titanium Grade 5 vs Grade 23 (ELI) — which is right for permanent medical implants?',
    answerHtml:
      '<strong>Grade 23 (Ti-6Al-4V ELI)</strong> is the medical-implant grade. ELI = Extra-Low Interstitials, meaning tighter limits on oxygen, nitrogen, hydrogen and iron. The result is improved <strong>fracture toughness</strong>, <strong>fatigue life</strong>, and reduced risk of crack initiation under cyclic loading — all critical for permanent implants (hip stems, dental fixtures, spinal cages). Grade 5 has higher strength but lower toughness. For <strong>instrumentation</strong> (non-implant surgical tools), Grade 5 remains acceptable and is more widely available.',
    tags: ['materials', 'grade-5', 'grade-23', 'eli', 'medical', 'implants', 'astm-f136', 'astm-f1472'],
  },
  {
    id: 'dfars-compliance',
    category: 'materials',
    question: 'Can BOZE supply titanium raw materials that strictly comply with DFARS requirements for defense and aerospace applications?',
    answerHtml:
      'Yes, absolutely. BOZE operates a fully locked-down aerospace material control network. Every batch of titanium alloy procured for defense and aerospace contracts strictly complies with <strong>DFARS 252.225-7014 Clause 1 (Preference for Domestic Specialty Metals)</strong> and its relevant supplements. All raw stock is sourced exclusively from tier-one, NADCAP-accredited mills in DFARS-approved qualifying countries. Each delivery is anchored by an authentic, unedited <strong>EN 10204 Type 3.1 Material Test Report (MTR)</strong>, charting complete chemical ladle analysis and mechanical destructive testing metrics. Our internal digital inventory ledger executes absolute <strong>heat number traceability</strong>, linking raw bar stock to the precise mill melt lot.',
    tags: ['dfars', '252.225-7014', 'domestic', 'specialty-metals', 'defense', 'aerospace', 'mtr', 'en-10204'],
  },
  {
    id: 'mtr-and-heat-traceability',
    category: 'materials',
    question: 'Do you provide EN 10204 3.1 / 3.2 Material Test Reports with shipments?',
    answerHtml:
      'Yes — <strong>EN 10204 3.1 MTRs are included as standard</strong> for every production order. Our material traceability pipeline links each batch from mill certificate to finished component via a unique heat/lot number. <strong>3.2 inspection certificates</strong> (third-party verified by an independent inspector such as Bureau Veritas or SGS) are available on request with a 48-hour processing window. We also provide <strong>ASTM E8/E8M tensile verification</strong> and full chemical analysis on request.',
    tags: ['mtr', 'en-10204', '3.1', '3.2', 'certification', 'astm-e8', 'traceability', 'heat-number'],
  },

  // ── CNC Machining (4) ─────────────────────────────────
  {
    id: 'gdt-tolerances',
    category: 'cnc-machining',
    question: 'What GD&T tolerances can you hold on titanium machined parts?',
    answerHtml:
      'Standard dimensional tolerance: <strong>±0.025 mm</strong>. Critical features: <strong>±0.005 mm</strong>. GD&T per ASME Y14.5 verified on ZEISS CMM with ±1.9 µm volumetric accuracy. True position 0.01–0.05 mm routinely achieved on 5-axis machined components. We do not claim impossible tolerances without a written engineering feasibility review — every drawing is DFM-checked before any material is cut.',
    tags: ['tolerance', 'gdt', 'asme-y14.5', 'cmms', 'zeiss', 'machining'],
  },
  {
    id: 'minimum-wall-thickness',
    category: 'cnc-machining',
    question: 'What is the minimum machinable wall thickness in titanium?',
    answerHtml:
      '5-axis milled: down to <strong>0.5 mm</strong> using trochoidal milling with thermal-compensated spindles. Swiss turned: down to <strong>0.3 mm</strong> with guide bushing support. Below 0.3 mm wall thickness, we redirect to <strong>additive manufacturing (SLM)</strong> where thin walls are built monolithically rather than milled from solid bar — often faster and cheaper for complex geometries.',
    tags: ['wall-thickness', 'thin-wall', '5-axis', 'swiss', 'trochoidal', 'machining'],
  },
  {
    id: '5-axis-capability',
    category: 'cnc-machining',
    question: 'Do you support 5-axis CNC machining on titanium?',
    answerHtml:
      'Yes — we run a fleet of 5-axis simultaneous machining centers (DMG MORI DMU 50, DMU 65 monoBLOCK, Hermle C 250U). 5-axis lets us machine complex contoured surfaces, undercuts, and angled holes in a single fixturing, which is essential for <strong>aerospace blisks, blings, and medical implant geometries</strong>. For deep-pocket features, we combine 5-axis milling with <strong>trochoidal tool paths</strong> and high-pressure through-tool coolant.',
    tags: ['5-axis', 'simultaneous', 'dmg-mori', 'hermle', 'blisk', 'bling', 'machining'],
  },
  {
    id: '3-axis-vs-5-axis',
    category: 'cnc-machining',
    question: 'When should I choose 3-axis vs 5-axis CNC machining for titanium?',
    answerHtml:
      'Use <strong>3-axis</strong> for prismatic parts (blocks, plates, holes perpendicular to a single datum) where fixturing is straightforward and tolerances are looser than ±0.05 mm — it is faster and cheaper. Use <strong>5-axis</strong> whenever (a) the part has compound angles or undercuts, (b) tolerances below ±0.025 mm across multiple datums, (c) you want to eliminate secondary operations and reduce fixturing distortion. Our engineering team provides a free 5-axis-vs-3-axis feasibility analysis as part of DFM.',
    tags: ['3-axis', '5-axis', 'comparison', 'selection', 'machining', 'dfm'],
  },

  // ── Surface Finishing (4) ─────────────────────────────
  {
    id: 'surface-finish-capabilities',
    category: 'surface-finishing',
    question: 'What surface finishes can you achieve on titanium components?',
    answerHtml:
      'Standard as-machined: <strong>Ra 0.8–1.6 µm</strong>. Optimized tool paths achieve <strong>Ra 0.4–0.8 µm</strong>. Precision-ground form tools achieve <strong>Ra ≤ 0.4 µm</strong> on threads and sealing surfaces. Electropolishing for semiconductor and medical applications achieves <strong>Ra ≤ 0.1 µm</strong> mirror finish. All surface-finish certifications are issued with the CMM dimensional report.',
    tags: ['surface-finish', 'ra', 'roughness', 'electropolish', 'mirror', 'machining'],
  },
  {
    id: 'anodizing-type2-type3',
    category: 'surface-finishing',
    question: 'Do you offer Type II and Type III (hard) anodizing for titanium?',
    answerHtml:
      'Yes. <strong>Type II (decorative) anodizing</strong> produces a thin titanium-oxide layer (0.5–2 µm) in a controlled color spectrum (gold, blue, purple, green) per <strong>AMS 2488</strong> — used for cosmetic identification and corrosion resistance. <strong>Type III (hard) anodizing</strong> produces a thicker oxide (2–5 µm) per <strong>AMS 2487</strong> for wear resistance and dielectric strength. Both are in-house; we do not outsource finishing.',
    tags: ['anodizing', 'type-2', 'type-3', 'ams-2488', 'ams-2487', 'oxide', 'color', 'decorative'],
  },
  {
    id: 'electropolishing-semiconductor',
    category: 'surface-finishing',
    question: 'Can you electropolish titanium to Ra ≤ 0.1 µm for semiconductor or medical applications?',
    answerHtml:
      'Yes — in-house electropolishing achieves <strong>Ra ≤ 0.1 µm</strong> (mirror) on titanium alloys using a phosphoric-sulfuric acid electrolyte with controlled current density. We verify finish with a <strong>Mahr MarSurf PS10</strong> profilometer. Common applications include <strong>semiconductor gas-delivery fittings, medical implant articulating surfaces, and high-vacuum chamber components</strong>. Electropolishing also improves <strong>corrosion resistance</strong> by removing the cold-worked layer.',
    tags: ['electropolish', 'mirror', 'semiconductor', 'medical', 'implant', 'ra-0.1'],
  },
  {
    id: 'passivation-and-chemical-treatment',
    category: 'surface-finishing',
    question: 'What passivation and chemical treatments do you offer for titanium?',
    answerHtml:
      'We provide <strong>chemical passivation per ASTM A967</strong> and <strong>AMS 2700</strong> using nitric-acid-based solutions (no hydrofluoric, no chromates) to remove surface contaminants and grow the natural passive oxide layer. We also perform <strong>alkaline peroxide etching</strong> for biomedical surface activation prior to coating. All chemical-process lines hold <strong>NADCAP</strong> accreditation through the chemical-processing partner we work with for similar finishes.',
    tags: ['passivation', 'astm-a967', 'ams-2700', 'chemical-treatment', 'oxide', 'nadcap'],
  },

  // ── Quality & Certifications (4) ──────────────────────
  {
    id: 'ndt-inspection',
    category: 'quality',
    question: 'What non-destructive testing (NDT) methodologies do you employ to guarantee the absence of subsurface structural anomalies in titanium parts?',
    answerHtml:
      'To eliminate the risk of catastrophic field failure caused by internal micro-voids or low-density inclusions (LDIs), BOZE enforces a rigorous multi-tiered NDT infrastructure. We execute <strong>Ultrasonic Testing (UT) per ASTM A388 and AMS-STD-2154</strong> for billets and critical machined features, with detection thresholds calibrated to <strong>≤ ∅0.8 mm</strong> flat-bottomed reference reflectors. For Class A aerospace components, <strong>ASTM E1417 fluorescent liquid-penetrant inspection (FPI)</strong> is applied. All NDT operators hold <strong>ASNT Level II or III</strong> certification.',
    tags: ['ndt', 'ut', 'ultrasonic', 'astm-a388', 'ams-std-2154', 'fpi', 'astm-e1417', 'asnt'],
  },
  {
    id: 'hydrogen-embrittlement',
    category: 'quality',
    question: 'How does your process prevent hydrogen embrittlement during aggressive titanium chemical pickling and thermal stress relief cycles?',
    answerHtml:
      'Hydrogen embrittlement represents a critical threat to the structural ductility of titanium under sustained stress. BOZE completely mitigates this risk by restricting chemical exposure parameters and enforcing rigid thermal processing control per <strong>AMS 2801</strong>. Our thermal stress-relief cycles run exclusively inside high-vacuum furnace chambers at a minimum vacuum threshold of <strong>10⁻⁴ Torr</strong>, with soak temperatures precisely between <strong>480°C and 540°C</strong>. When chemical etching or pickling is mandatory, we use tightly calibrated nitric-hydrofluoric acid solutions where the HNO₃ concentration is continuously maintained at a minimum <strong>10:1 ratio</strong> relative to HF, blocking nascent hydrogen migration into the alpha-beta crystal matrix.',
    tags: ['hydrogen', 'embrittlement', 'ams-2801', 'vacuum', 'stress-relief', 'pickling', 'hno3', 'hf'],
  },
  {
    id: 'as9100d-and-iso-13485',
    category: 'quality',
    question: 'Are you certified to AS9100D and ISO 13485:2016?',
    answerHtml:
      'Yes. Boze Titanium Manufacturing Center operates under <strong>AS9100D</strong> (aerospace) and <strong>ISO 13485:2016</strong> (medical devices) quality management systems. Documentation packages include <strong>First Article Inspection Reports (FAIR) per AS9102</strong>, process control plans, and full material-traceability chains. We do not currently hold <strong>AS9110</strong> (aviation MRO) or <strong>AS9120</strong> (aviation distributors) — those are out of scope.',
    tags: ['as9100d', 'iso-13485', 'certification', 'quality', 'fair', 'as9102'],
  },
  {
    id: 'first-article-inspection',
    category: 'quality',
    question: 'Do you provide First Article Inspection Reports (FAIR / AS9102)?',
    answerHtml:
      'Every new part number receives a complete <strong>AS9102 FAIR</strong> prior to the production run. The report includes: (1) design characteristics with measured values, (2) material traceability chain back to the mill heat number, (3) process-capability data (Cpk indices for critical-to-quality characteristics), (4) ballooned drawing with each feature referenced, and (5) non-conformance log (closed-loop). We can also provide <strong>PPAP</strong> packages for automotive-tier customers (we do not currently hold IATF 16949).',
    tags: ['fair', 'as9102', 'first-article', 'ppap', 'iatf', 'automotive', 'inspection'],
  },

  // ── Shipping & Lead Time (4) ──────────────────────────
  {
    id: 'typical-lead-times',
    category: 'shipping',
    question: 'What are your typical lead times for production orders?',
    answerHtml:
      '<strong>Rapid prototyping:</strong> 3–7 business days. <strong>Pre-production samples (NPI):</strong> 2–3 weeks. <strong>Production run (5–500 pieces):</strong> 4–6 weeks. <strong>Large production (500–5000 pieces):</strong> 6–10 weeks. Lead time depends on material grade, post-processing (anodizing, NDT), and certification scope (3.2 MTRs add ~48h). We provide a binding lead-time quote with every RFQ response — no estimates that slip.',
    tags: ['lead-time', 'production', 'prototype', 'npi', 'schedule', 'delivery'],
  },
  {
    id: 'incoterms-2020',
    category: 'shipping',
    question: 'Which Incoterms® 2020 do you support for international shipments?',
    answerHtml:
      'We routinely ship under <strong>EXW, FOB, CFR, CIF, DAP, and DDP</strong>. For North-American customers we also offer <strong>FCA</strong> (Baoji) with customer-arranged pickup. We do not ship under <strong>FAS or DAT</strong> (these are uncommon for our product class). All shipments include commercial invoice, packing list, MTRs, FAIR, and any country-of-origin certificates required for customs clearance.',
    tags: ['incoterms', 'exw', 'fob', 'cif', 'dap', 'ddp', 'shipping', 'logistics'],
  },
  {
    id: 'international-shipping',
    category: 'shipping',
    question: 'Do you ship internationally, and how do you handle customs documentation?',
    answerHtml:
      'Yes — approximately <strong>70% of our shipments cross international borders</strong>. We provide: (1) <strong>commercial invoice</strong> with HS codes, (2) <strong>Certificate of Origin (Form A / RCEP / USMCA)</strong> as requested, (4) <strong>fumigation certificate</strong> for ISPM-15 wood-packaging compliance, (5) <strong>SASO / SABER</strong> certificates for KSA-bound shipments. We ship by air (DHL, FedEx, UPS), sea (FCL/LCL), and courier-air for time-critical orders.',
    tags: ['shipping', 'international', 'customs', 'certificate-of-origin', 'ispm-15', 'dhl', 'fedex'],
  },
  {
    id: 'export-controls-and-restrictions',
    category: 'shipping',
    question: 'How do you handle export-control documentation and restricted-party screening?',
    answerHtml:
      'Every international shipment undergoes <strong>EAR / ITAR restricted-party screening</strong> via Visual Compliance (Descartes) before pickup. We file <strong>EEI (Electronic Export Information)</strong> via AES for shipments above the EEI threshold, and we maintain a documented export-compliance program (ECP) with named empowered officials. For ITAR-restricted work we partner with a registered sub-tier — BOZE does not currently hold an ITAR registration (ITAR-2024 controlled work).',
    tags: ['export', 'itar', 'ear', 'compliance', 'restricted-party', 'screening', 'ecp'],
  },
];

/**
 * 6-mercatorial category meta. Labels are placeholders here — the Astro
 * frontmatter passes the locale-resolved labels via `categories` prop to
 * FAQHub. This constant is the fallback for the default (English) locale
 * and the source of the canonical `id` set used by the URL state.
 */
export interface CategoryMeta {
  readonly id: FaqCategoryId;
  readonly label: string;
  readonly description: string;
}

export const CATEGORY_META_DEFAULT: readonly CategoryMeta[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Onboarding, NDA, MOQ, and how to start a project.',
  },
  {
    id: 'materials',
    label: 'Titanium Grades & Materials',
    description: 'DFARS compliance, MTR traceability, grade selection.',
  },
  {
    id: 'cnc-machining',
    label: '5-Axis CNC Machining',
    description: 'Tolerances, wall thickness, 3-axis vs 5-axis selection.',
  },
  {
    id: 'surface-finishing',
    label: 'Surface Finishing',
    description: 'Anodizing, electropolishing, passivation, Ra capability.',
  },
  {
    id: 'quality',
    label: 'Quality & Certifications',
    description: 'AS9100D, ISO 13485, NDT, FAIR, hydrogen embrittlement.',
  },
  {
    id: 'shipping',
    label: 'Shipping & Lead Time',
    description: 'Incoterms, customs, export controls, lead-time bands.',
  },
];

/**
 * Derive the per-category counts from the canonical entry list. Used by
 * FAQCategoryTabs to render the count chip on each tab.
 */
export function deriveCategoryCounts(
  entries: readonly FaqEntry[],
): Readonly<Record<FaqCategoryId, number>> {
  const counts: Record<FaqCategoryId, number> = {
    general: 0,
    materials: 0,
    'cnc-machining': 0,
    'surface-finishing': 0,
    quality: 0,
    shipping: 0,
  };
  for (const entry of entries) {
    counts[entry.category] = (counts[entry.category] ?? 0) + 1;
  }
  return counts;
}