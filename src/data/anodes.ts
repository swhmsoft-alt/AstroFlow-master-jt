/**
 * src/data/anodes.ts
 *
 * Single source of truth for the /parts/titanium-anode/ product page.
 *
 * Module order maps to the B2B procurement decision path:
 *   M1  Hero · M2  Anode Type Catalog · M3  Coating Chemistry Selector
 *   M4  Operating Parameters Required at RFQ · M5  Applications by Industry
 *   M6  Engineering Considerations · M7  Manufacturing Workflow
 *   M8  Quality & Inspection · M9  Process Capabilities · M10 FAQ
 *   M11 Engineering Consultation CTA · M12 Final CTA
 *
 * Editorial discipline (per the product brief hard rules):
 *   - No invented numbers, Ra values, tolerances, lead times or coating life
 *   - No superlatives (world-class / industry-leading / premium / etc.)
 *   - Every claim conditional: "reviewed", "agreed per project", "subject to DFM"
 *   - Process-specific language (no generic CNC copy)
 *   - Real downstream industries
 *   - Cautious-engineer tone (no exclamation marks, no "we are proud to")
 *
 * Facts authorized by the user:
 *   - ASTM B265 covers titanium strip/plate/sheet; B348 covers bar.
 *   - Gr1 preferred for forming/drawability; Gr2 for structural rigidity.
 *   - IrO2-based coatings for oxygen-evolution environments; RuO2-based for
 *     chlorine-evolution environments.
 *   - Do NOT state coating life numbers or current density values.
 *
 * Page is English-only. No i18n coupling.
 */

export interface AnodeFaq {
  question: string;
  answer: string;
}

export interface AnodeNumberedCard {
  number: string;
  title: string;
  body: string;
  /** Chip line of engineering keywords. Noun phrases, comma-separated. */
  focus: string;
  /** Image for cards. */
  image?: string;
  imageAlt?: string;
}

export interface AnodeCoatingRow {
  environment: string;
  irO2: string;
  ruO2: string;
  pt: string;
  mixedMmo: string;
}

export interface AnodeParameterGroup {
  number: string;
  parameter: string;
  why: string;
}

export interface AnodeApplication {
  name: string;
  desc: string;
  serviceConditions: string;
  image: string;
  imageAlt: string;
  /** If true, the application requires customer-side approval per drawing. */
  qualificationRequired?: boolean;
}

export interface AnodeWorkflowStep {
  name: string;
  desc: string;
  focus: string;
}

export interface AnodeInspectionItem {
  label: string;
  detail: string;
  chips: string;
}

export interface AnodeCapability {
  name: string;
  desc: string;
  focus: string;
}

export interface AnodeDifferentiator {
  title: string;
  body: string;
}

export interface AnodePage {
  slug: string;
  navName: string;
  pageTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroH1: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  keyMetrics: { value: string; label: string }[];

  /** M2 — Anode Type Catalog (10 specific subtypes). */
  anodeTypes: {
    badge: string;
    title: string;
    intro: string;
    boundaryNote: string;
    caveat: string;
    families: AnodeNumberedCard[];
  };

  /** M3 — Coating Chemistry Selector (matrix). */
  coatingSelector: {
    title: string;
    intro: string;
    matrixColumns: string[];
    matrixRows: AnodeCoatingRow[];
    caveat: string;
  };

  /** M4 — Operating Parameters Required at RFQ. */
  operatingParameters: {
    title: string;
    intro: string;
    caveat: string;
    groups: AnodeParameterGroup[];
  };

  /** M5 — Applications by Industry (8 verticals). */
  applications: {
    title: string;
    intro: string;
    caveat: string;
    items: AnodeApplication[];
  };

  /** M6 — Engineering Considerations (5 review items). */
  engineeringConsiderations: {
    title: string;
    intro: string;
    caveat: string;
    items: AnodeNumberedCard[];
  };

  /** M7 — Manufacturing Workflow (8 ordered steps). */
  manufacturingWorkflow: {
    title: string;
    intro: string;
    caveat: string;
    steps: AnodeWorkflowStep[];
  };

  /** M8 — Quality & Inspection (6 items with chip line). */
  qualityInspection: {
    title: string;
    intro: string;
    caveat: string;
    items: AnodeInspectionItem[];
  };

  /** M9 — Process Capabilities (6 cards). */
  processCapabilities: {
    title: string;
    intro: string;
    caveat: string;
    capabilities: AnodeCapability[];
  };

  /** M10 — FAQ (6 question/answer pairs). */
  faqs: AnodeFaq[];

  /** M11 — Engineering Consultation CTA (inline form mock). */
  engineeringCta: {
    title: string;
    intro: string;
    bullets: string[];
    anodeTypeOptions: string[];
    applicationOptions: string[];
    submitLabel: string;
    submitHref: string;
  };

  /** M12 — Why BOZE / Differentiators (6 items). */
  whyUs: {
    title: string;
    intro: string;
    items: AnodeDifferentiator[];
  };
}

// Image path constants (placeholder SVGs, real production imagery TBD).
const IMG = {
  substrate: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-substrate.svg',
  tubular: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-tubular.svg',
  mesh: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-mesh.svg',
  plate: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-plate.svg',
  rod: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-rod.svg',
  ribbon: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-ribbon.svg',
  coating: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-coating.svg',
  assembly: '/images/placeholders/titanium-anodes/titanium-anode-placeholder-assembly.svg',
};

export const ANODE_PAGE: AnodePage = {
  slug: 'titanium-anode',
  navName: 'Titanium Anodes',
  pageTitle:
    'Titanium Anodes | Custom MMO & Platinized Titanium Anode Substrates | BOZE',
  metaDescription:
    'Custom titanium anode substrates and assemblies for electrochemical cells. Commercially pure titanium substrate (Gr1/Gr2) per ASTM B265 / B348. MMO or platinum coating. Cathodic protection, electrochlorination, water treatment, chlor-alkali, electrowinning, copper foil, PCB and sodium hypochlorite applications.',
  heroBadge: 'Custom Titanium Anodes',
  heroH1: 'Custom Titanium Anodes for Electrochemical Applications',
  heroSubtitle:
    'Custom-engineered titanium anode substrates and assemblies. MMO, IrO2, RuO2 and platinum coating on ASTM B265 strip/plate or ASTM B348 bar substrate. Drawing review and quotation turn-around confirmed at RFQ.',
  heroImage: IMG.coating,
  heroImageAlt:
    'MMO and platinum coated titanium anode substrate for electrochemical cells',
  keyMetrics: [
    { value: 'MMO', label: 'coating family' },
    { value: 'Pt / IrO2 / RuO2', label: 'catalyst options' },
    { value: 'ASTM B265 / B348', label: 'substrate scope' },
    { value: 'Gr1 / Gr2', label: 'CP titanium' },
  ],

  // ── M2 Anode Type Catalog ─────────────────────────────────────────────
  anodeTypes: {
    badge: 'Anode Type Catalog',
    title: 'Select the Anode Geometry That Matches Your Cell',
    intro:
      'Ten anode subtypes produced to drawing. Substrate form (strip, plate, tube, bar, expanded mesh) and coating chemistry are matched to the cell envelope, reaction environment and operating schedule. Geometry within each subtype is produced per drawing.',
    boundaryNote:
      'Stock mesh and standard plate sizes are listed on dedicated product pages. This page covers custom-engineered anode geometries matched to customer cells.',
    caveat:
      'Use-when guidance below is a starting point. Final geometry, substrate grade and coating chemistry are confirmed at DFM review of your drawing.',
    families: [
      {
        number: '01',
        title: 'MMO Linear Anode',
        body:
          'Solid bar substrate with mixed metal oxide coating, used in long-run impressed-current cathodic protection of pipelines. Bar stock per ASTM B348.',
        focus:
          'ASTM B348 bar · MMO · impressed current · long pipeline · deep groundbed',
        image: IMG.rod,
        imageAlt: 'MMO linear anode on bar substrate',
      },
      {
        number: '02',
        title: 'MMO Wire Anode',
        body:
          'Titanium wire substrate with mixed metal oxide coating, used in reinforced concrete and tank-bottom cathodic protection systems where distributed low-current density is required.',
        focus:
          'wire substrate · MMO · reinforced concrete · tank bottom · distributed current',
        image: IMG.rod,
        imageAlt: 'MMO wire anode for distributed cathodic protection',
      },
      {
        number: '03',
        title: 'MMO Ribbon Anode',
        body:
          'Strip substrate with mixed metal oxide coating, used in shallow groundbed and mesh cathodic protection systems. Strip stock per ASTM B265.',
        focus:
          'ASTM B265 strip · MMO · shallow groundbed · mesh CP · long length',
        image: IMG.ribbon,
        imageAlt: 'MMO ribbon anode on strip substrate',
      },
      {
        number: '04',
        title: 'MMO Mesh Ribbon Anode',
        body:
          'Expanded mesh substrate with mixed metal oxide coating, used where active surface area and flexibility are required for complex surface cathodic protection.',
        focus:
          'expanded mesh · MMO · flexible anode · complex surface · CP mesh',
        image: IMG.mesh,
        imageAlt: 'MMO mesh ribbon anode on expanded substrate',
      },
      {
        number: '05',
        title: 'MMO Canister Anode',
        body:
          'Tubular anode with coke-bake backfill canistered for deep-well and deep groundbed cathodic protection installations.',
        focus:
          'canister · tubular anode · coke backfill · deep well · deep groundbed',
        image: IMG.tubular,
        imageAlt: 'MMO canister anode for deep groundbed CP',
      },
      {
        number: '06',
        title: 'MMO Tubular Anode',
        body:
          'Tube substrate with mixed metal oxide coating, used in continuous-duty industrial cathodic protection and as a back-up anode in electrochemical service. Tube stock per ASTM B265.',
        focus:
          'ASTM B265 tube · MMO · continuous duty · industrial CP · back-up anode',
        image: IMG.tubular,
        imageAlt: 'MMO tubular anode on titanium tube substrate',
      },
      {
        number: '07',
        title: 'MMO Disc Anode',
        body:
          'Disc substrate with mixed metal oxide coating, used in limited-volume electrochemical cells, bench-scale cells and electrochemical sensors.',
        focus:
          'disc substrate · MMO · limited volume · bench-scale cell · sensor',
        image: IMG.plate,
        imageAlt: 'MMO disc anode substrate',
      },
      {
        number: '08',
        title: 'MMO Rod Anode',
        body:
          'Solid rod substrate with mixed metal oxide coating, used as a standalone anode, internal cell rod and stem-mounted anode. Rod stock per ASTM B348.',
        focus:
          'ASTM B348 rod · MMO · standalone anode · internal cell · stem mount',
        image: IMG.rod,
        imageAlt: 'MMO rod anode substrate',
      },
      {
        number: '09',
        title: 'Platinized Plate Anode',
        body:
          'Plate substrate with platinum coating, used in electroplating, water treatment and inert-electrolyte applications. Plate stock per ASTM B265.',
        focus:
          'ASTM B265 plate · Pt coating · inert electrolyte · electroplating · water treatment',
        image: IMG.plate,
        imageAlt: 'Platinized titanium plate anode substrate',
      },
      {
        number: '10',
        title: 'Custom-Profile Anode Assembly',
        body:
          'Custom substrate formed to a non-standard profile, with lead wire or tab attached, insulated and sealed per service environment. Geometry, joint method and coating chemistry are reviewed per drawing.',
        focus:
          'custom drawing · lead wire · tab · seal method · assembly · DFM review',
        image: IMG.assembly,
        imageAlt: 'Custom-profile titanium anode with lead wire attached',
      },
    ],
  },

  // ── M3 Coating Chemistry Selector ──────────────────────────────────────
  coatingSelector: {
    title: 'Coating Chemistry Selector',
    intro:
      'Match coating family to your reaction environment. Selection depends on electrolyte chemistry, pH, temperature, current density profile and target service life. The matrix below is a starting point.',
    matrixColumns: ['Reaction Environment', 'IrO2', 'RuO2', 'Pt', 'Mixed MMO'],
    matrixRows: [
      {
        environment: 'Oxygen evolution (acid electrolyte)',
        irO2: 'Primary',
        ruO2: '—',
        pt: '—',
        mixedMmo: 'Per project',
      },
      {
        environment: 'Oxygen evolution (neutral electrolyte)',
        irO2: 'Per project',
        ruO2: '—',
        pt: '—',
        mixedMmo: 'Primary',
      },
      {
        environment: 'Chlorine evolution',
        irO2: '—',
        ruO2: 'Primary',
        pt: '—',
        mixedMmo: 'Per project',
      },
      {
        environment: 'Inert / acid sulfate electrolyte',
        irO2: '—',
        ruO2: '—',
        pt: 'Primary',
        mixedMmo: '—',
      },
      {
        environment: 'Cathodic protection (soil / seawater)',
        irO2: '—',
        ruO2: '—',
        pt: '—',
        mixedMmo: 'Primary',
      },
    ],
    caveat:
      'Final coating selection depends on electrolyte chemistry, pH, temperature, current density and target service life, agreed per project. Coating life and current density values are not stated as part numbers.',
  },

  // ── M4 Operating Parameters Required at RFQ ───────────────────────────
  operatingParameters: {
    title: 'Operating Parameters Required at RFQ',
    intro:
      'Eight parameters reviewed at RFQ. These values drive coating selection, substrate grade, geometry review and documentation scope. None of them need to be final at first contact.',
    caveat:
      'Coating life and current density are application-dependent and agreed per project. The parameters below are the input set our engineering team reviews before quotation.',
    groups: [
      {
        number: '01',
        parameter: 'Electrolyte composition',
        why: 'Selects coating chemistry family (MMO / Pt / IrO2 / RuO2).',
      },
      {
        number: '02',
        parameter: 'pH range',
        why: 'Selects substrate grade and coating passivation requirements.',
      },
      {
        number: '03',
        parameter: 'Temperature range',
        why: 'Selects thermal cycling tolerance and seal material.',
      },
      {
        number: '04',
        parameter: 'Current density / current output',
        why: 'Sizes the active area and coating pass count.',
      },
      {
        number: '05',
        parameter: 'Operating schedule',
        why: 'Continuous vs. intermittent duty selects coating load.',
      },
      {
        number: '06',
        parameter: 'Target design life',
        why: 'Selects coating pass count and substrate thickness allowance.',
      },
      {
        number: '07',
        parameter: 'Dimensions / active area',
        why: 'Selects substrate geometry and forming sequence.',
      },
      {
        number: '08',
        parameter: 'Electrical connection / lead-wire termination',
        why: 'Selects joint method, seal method and insulation.',
      },
    ],
  },

  // ── M5 Applications by Industry ───────────────────────────────────────
  applications: {
    title: 'Applications by Industry',
    intro:
      'Eight application verticals. Substrate form, coating chemistry and lead-wire specification are matched to the operating environment per project.',
    caveat:
      'Application-specific coating life and current density are agreed per project based on electrolyte, temperature and operating parameters. They are not stated as part numbers on this page.',
    items: [
      {
        name: 'Cathodic Protection',
        desc:
          'Impressed-current CP anodes for marine structures, buried pipelines, tank bottoms, deep groundbed and reinforced concrete.',
        serviceConditions:
          'Low-voltage DC · soil or seawater · long-duration continuous duty',
        image: IMG.tubular,
        imageAlt: 'MMO anode for cathodic protection installation',
      },
      {
        name: 'Electrochlorination',
        desc:
          'On-site sodium hypochlorite generation for water treatment and disinfection. Mesh and plate anodes for brine and seawater feed.',
        serviceConditions:
          'Brine or seawater · variable temperature · on-site generation',
        image: IMG.mesh,
        imageAlt: 'MMO mesh anode for electrochlorination cell',
      },
      {
        name: 'Water Treatment',
        desc:
          'Oxidant production and electrochemical water-treatment cells. Mesh and plate anodes with MMO or platinum coating.',
        serviceConditions:
          'Variable electrolyte · oxidant production · batch or continuous',
        image: IMG.mesh,
        imageAlt: 'MMO mesh anode for water treatment cell',
      },
      {
        name: 'Electrowinning',
        desc:
          'Anodes for copper, zinc, manganese and other metal recovery cells. Substrate form and coating chemistry per electrolyte.',
        serviceConditions:
          'Acid sulfate or chloride · controlled temperature · batch or continuous',
        image: IMG.plate,
        imageAlt: 'Plate anode for electrowinning cell',
      },
      {
        name: 'Chlor-Alkali',
        desc:
          'Anodes for chlor-alkali membrane and diaphragm cells. RuO2-based coating selected for chlorine-evolution environments.',
        serviceConditions:
          'Saturated brine · elevated temperature · continuous duty',
        image: IMG.mesh,
        imageAlt: 'MMO mesh anode for chlor-alkali membrane cell',
      },
      {
        name: 'Copper Foil Production',
        desc:
          'Anodes for electrolytic copper foil manufacturing. Platinized plate substrate with controlled surface profile and current distribution.',
        serviceConditions:
          'Acid sulfate electrolyte · specific current profile · controlled surface finish',
        image: IMG.plate,
        imageAlt: 'Platinized plate anode for copper foil production',
      },
      {
        name: 'PCB Electroplating',
        desc:
          'Platinized plate and mesh anodes for PCB plating tanks. Hole pattern, plate geometry and lead-wire attachment produced to drawing.',
        serviceConditions:
          'Acid or alkaline bath · moderate temperature · tight thickness control',
        image: IMG.plate,
        imageAlt: 'Platinized plate anode for PCB plating tank',
      },
      {
        name: 'Sodium Hypochlorite Generation',
        desc:
          'Brine-electrolysis anodes for on-site hypochlorite production. RuO2-based coating selected for chlorine-evolution environments.',
        serviceConditions:
          'Brine feed · variable pH · on-site chlorine production',
        image: IMG.ribbon,
        imageAlt: 'MMO anode for sodium hypochlorite generation',
      },
    ],
  },

  // ── M6 Engineering Considerations ─────────────────────────────────────
  engineeringConsiderations: {
    title: 'Engineering Considerations Reviewed Per Drawing',
    intro:
      'Five technical areas reviewed at DFM. Each item is confirmed against your drawing and service description.',
    caveat:
      'Engineering review is per drawing. The items below are reviewed case-by-case against your service environment, and the resulting manufacturing plan is documented at DFM.',
    items: [
      {
        number: '01',
        title: 'Coating uniformity and edge coverage',
        body:
          'Coating thickness and edge coverage depend on profile geometry, coating application method and number of passes. Coating uniformity on complex profiles is reviewed at DFM.',
        focus:
          'coating thickness · edge coverage · complex profile · coating passes · DFM review',
      },
      {
        number: '02',
        title: 'Substrate surface preparation',
        body:
          'Substrate roughness, pickling condition and surface contamination are controlled prior to coating. Surface preparation method depends on starting condition and coating chemistry.',
        focus:
          'roughness · pickling · contamination control · starting condition · coating chemistry',
      },
      {
        number: '03',
        title: 'Lead wire and tab interface',
        body:
          'Joint method, seal method and insulation are selected per service environment. Joint integrity is reviewed against current load and electrolyte exposure at DFM.',
        focus:
          'joint method · seal method · insulation · current load · electrolyte exposure',
      },
      {
        number: '04',
        title: 'Dimensional fit to cell or tank',
        body:
          'Mounting features, hole pattern, edge clearance and active area are matched to the existing cell. Dimensional fit is reviewed against your drawing at DFM.',
        focus:
          'mounting feature · hole pattern · edge clearance · active area · existing cell',
      },
      {
        number: '05',
        title: 'Prototype versus repeat coating runs',
        body:
          'Prototype coating runs are produced with full lot documentation. Repeat runs are matched against the prototype baseline by coating record and lot traceability.',
        focus:
          'prototype run · repeat run · lot traceability · coating record · baseline',
      },
    ],
  },

  // ── M7 Manufacturing Workflow ──────────────────────────────────────────
  manufacturingWorkflow: {
    title: 'Manufacturing Workflow',
    intro:
      'Eight-step process from substrate stock to inspected finished anode. The sequence applies to standard custom-engineered anodes. Specific thermal cycles and coating passes depend on coating chemistry and substrate geometry, confirmed at DFM.',
    caveat:
      'The workflow below applies to standard custom-engineered anodes. Specific thermal cycles, coating pass counts and lead-wire termination methods depend on coating chemistry, substrate geometry and current load. The final manufacturing plan is documented at DFM.',
    steps: [
      {
        name: '1. Substrate forming and shearing',
        desc:
          'Strip, plate or bar stock is sheared, rolled or cut to the blank dimensions called for on the drawing. Forming operations (bending, drawing, expanding) are performed where the geometry requires.',
        focus:
          'shearing · rolling · cutting · bending · drawing · expanding · blank dimensions',
      },
      {
        name: '2. Substrate machining',
        desc:
          'Mounting features, hole patterns, edge preparations and active-area trims are machined. Edge condition is controlled to support subsequent coating application.',
        focus:
          'mounting features · hole patterns · edge prep · active-area trim · CNC machining',
      },
      {
        name: '3. Degreasing',
        desc:
          'Oils, handling residue and shop contaminants are removed prior to acid etching. Degreasing method is matched to substrate grade and starting condition.',
        focus:
          'oil removal · handling residue · shop contaminants · substrate grade',
      },
      {
        name: '4. Acid etching',
        desc:
          'Surface oxides and residual scale are removed by acid etching. Etch chemistry and time are selected per substrate grade and starting surface condition.',
        focus:
          'oxide removal · scale removal · etch chemistry · controlled roughness · adhesion',
      },
      {
        name: '5. Coating application (thermal decomposition)',
        desc:
          'MMO or platinum precursor is applied by thermal decomposition. Coating chemistry is selected per electrolyte and reaction environment. Number of passes depends on target loading and profile geometry.',
        focus:
          'thermal decomposition · MMO precursor · Pt precursor · coating passes · profile geometry',
      },
      {
        name: '6. Sintering',
        desc:
          'Coating is sintered to bond the catalyst layer to the substrate. Sintering temperature and time depend on coating chemistry. The thermal cycle is documented per lot.',
        focus:
          'sintering · thermal cycle · coating bond · lot documentation',
      },
      {
        name: '7. Lead wire and tab attachment',
        desc:
          'Lead wires or tabs are attached by joint method selected per service environment. Seal method and insulation are applied per electrolyte chemistry and current load.',
        focus:
          'lead wire · tab · joint method · seal method · insulation · current load',
      },
      {
        name: '8. Post-coating inspection',
        desc:
          'Final dimensional, coating continuity, lead-wire joint and documentation checks are performed against the drawing and the lot record.',
        focus:
          'dimensional · coating continuity · joint check · lot record · material traceability',
      },
    ],
  },

  // ── M8 Quality & Inspection ────────────────────────────────────────────
  qualityInspection: {
    title: 'Quality and Inspection',
    intro:
      'Six inspection areas covering substrate verification, dimensional conformance, coating continuity, lead-wire joint integrity, visual condition and documentation. Records are issued per lot.',
    caveat:
      'Material specifications (ASTM B265, ASTM B348) cover raw stock. Finished-part acceptance criteria are governed by your drawing and PO. Coating life and current density are application-dependent and are not represented in the inspection record.',
    items: [
      {
        label: 'Substrate material verification',
        detail:
          'Substrate grade, heat number and form per ASTM B265 (strip/plate/sheet) or ASTM B348 (bar) verified against the PO and the drawing.',
        chips: 'Records · ASTM B265 · ASTM B348 · heat number · MTC',
      },
      {
        label: 'Dimensional inspection',
        detail:
          'Outside dimensions, thickness, flatness and hole pattern verified against the drawing. Inspection method selected per feature and tolerance.',
        chips:
          'Records · OD/ID · thickness · flatness · hole pattern · drawing',
      },
      {
        label: 'Coating adhesion and continuity',
        detail:
          'Coating continuity and adhesion reviewed against coating chemistry. Method is documented per coating system and lot.',
        chips: 'Records · coating record · continuity · adhesion · per coating system',
      },
      {
        label: 'Lead-wire and joint inspection',
        detail:
          'Lead-wire joint inspected for mechanical integrity (pull test where specified) and seal condition.',
        chips:
          'Records · pull test · seal condition · current load · electrolyte',
      },
      {
        label: 'Visual and surface',
        detail:
          'Coating appearance and edge coverage reviewed against the lot record. Visual inspection covers active area, edges and lead-wire transition.',
        chips: 'Records · coating appearance · edge coverage · active area · transition',
      },
      {
        label: 'Documentation and release',
        detail:
          'Material test certificate (EN 10204 3.1), dimensional report, coating record and lot trace compiled for release.',
        chips: 'Documents · EN 10204 3.1 · MTC · dimensional · coating · lot trace',
      },
    ],
  },

  // ── M9 Process Capabilities ────────────────────────────────────────────
  processCapabilities: {
    title: 'Process Capabilities',
    intro:
      'Six process areas operated in-house. Substrate forming, machining, surface preparation, coating, lead-wire attachment and secondary sealing are documented per lot.',
    caveat:
      'Capability ranges are nominal and represent the operating envelope of each process area. Feature-specific feasibility is confirmed by DFM review of your drawing.',
    capabilities: [
      {
        name: 'Titanium substrate forming',
        desc:
          'Shearing, rolling, bending, drawing and expanding of titanium strip, plate and bar stock. Forming method documented per part.',
        focus:
          'shearing · rolling · bending · drawing · expanding · strip / plate / bar',
      },
      {
        name: 'CNC machining of substrate',
        desc:
          'Machining of mounting features, hole patterns, edge preparations and active-area trims. Edge condition controlled for subsequent coating application.',
        focus:
          'CNC · mounting features · hole patterns · edge prep · active-area trim',
      },
      {
        name: 'Chemical cleaning and etching',
        desc:
          'Degreasing, acid etching and surface conditioning prior to coating. Etch chemistry and time matched to substrate grade and target coating.',
        focus:
          'degreasing · acid etching · surface conditioning · substrate grade',
      },
      {
        name: 'MMO and platinum coating application',
        desc:
          'Coating application by thermal decomposition. Coating chemistry selected per electrolyte and reaction environment.',
        focus:
          'thermal decomposition · MMO · Pt · coating chemistry · coating passes',
      },
      {
        name: 'Lead wire and tab attachment',
        desc:
          'Joint method, seal method and insulation selected per service environment. Lead-wire termination matched to current load and electrolyte exposure.',
        focus:
          'joint method · seal method · insulation · current load · electrolyte exposure',
      },
      {
        name: 'Secondary sealing and insulation',
        desc:
          'Final seal and insulation applied per electrolyte chemistry and operating temperature. Seal method documented per part.',
        focus:
          'seal method · insulation · electrolyte · operating temperature · per-part document',
      },
    ],
  },

  // ── M10 FAQ ───────────────────────────────────────────────────────────
  faqs: [
    {
      question:
        'Which substrate grade should I select — Grade 1 or Grade 2?',
      answer:
        'Grade 1 is selected where forming or drawability is required. Grade 2 is selected where structural rigidity is the controlling criterion. Substrate form is ASTM B265 strip or plate for formed substrates, and ASTM B348 bar for rod and stem substrates. Final grade selection is confirmed at DFM review.',
    },
    {
      question: 'Which coating should I select for chlorine evolution?',
      answer:
        'RuO2-based coatings are used for chlorine-evolution environments. Final coating selection depends on your electrolyte chemistry, current density profile and expected service life, all of which are reviewed at DFM.',
    },
    {
      question: 'Which coating should I select for oxygen evolution?',
      answer:
        'IrO2-based coatings are used for oxygen-evolution environments. Where inertness is required, platinum coating is an alternative. Final coating selection is reviewed against your electrolyte and operating parameters at DFM.',
    },
    {
      question: 'Do you attach lead wires or tabs to the anode?',
      answer:
        'Yes. Lead wires or tabs are attached by joint method selected per service environment, with seal method and insulation applied per electrolyte chemistry and current load. Wire material, cross-section, insulation type and seal method are confirmed at DFM.',
    },
    {
      question: 'Can you re-coat an existing titanium anode?',
      answer:
        'Existing titanium anode substrates can be stripped and re-coated, subject to substrate condition at intake. Stripping method is selected per substrate condition and coating chemistry; intake inspection is performed before re-coating is scheduled.',
    },
    {
      question: 'What documentation is issued with the finished anode?',
      answer:
        'A material test certificate (EN 10204 3.1), dimensional report, coating record and lot trace are issued with each lot. Additional documentation scope is confirmed per PO.',
    },
  ],

  // ── M11 Engineering Consultation CTA ───────────────────────────────────
  engineeringCta: {
    title: 'Send Your Titanium Anode Requirements for Engineering Review',
    intro:
      'Provide your process conditions, electrical requirements, anode geometry and inspection needs. Our engineering team will review the coating family, active area, electrical connection and manufacturing scope before quotation.',
    bullets: [
      'Coating chemistry selection matched to your electrolyte',
      'Substrate grade and forming sequence review',
      'Lead-wire termination and seal method recommendation',
      'Documentation scope (MTC, dimensional, coating record, NDT)',
    ],
    anodeTypeOptions: [
      'MMO Linear Anode',
      'MMO Wire Anode',
      'MMO Ribbon Anode',
      'MMO Mesh Ribbon Anode',
      'MMO Canister Anode',
      'MMO Tubular Anode',
      'MMO Disc Anode',
      'MMO Rod Anode',
      'Platinized Plate Anode',
      'Custom-Profile Assembly',
      'Not Sure / Need Anode Review',
    ],
    applicationOptions: [
      'Cathodic Protection',
      'Electrochlorination',
      'Water Treatment',
      'Electrowinning',
      'Chlor-Alkali',
      'Copper Foil Production',
      'PCB Electroplating',
      'Sodium Hypochlorite Generation',
      'Other / Industrial Process',
    ],
    submitLabel: 'Submit Anode Inquiry',
    submitHref: '/rfq/?category=titanium-anode',
  },

  // ── M12 Why BOZE ───────────────────────────────────────────────────────
  whyUs: {
    title: 'Why BOZE for Titanium Anodes',
    intro:
      'Six engineering differentiators. Drawn from practice on prior titanium anode programs.',
    items: [
      {
        title: 'Substrate grade selection per service',
        body:
          'Gr1 is selected where forming or drawability is required. Gr2 is selected where structural rigidity is the controlling criterion. Substrate grade and form are documented per part.',
      },
      {
        title: 'Coating chemistry matched to reaction',
        body:
          'Coating chemistry is matched to your electrolyte and reaction: IrO2-based for oxygen-evolution environments, RuO2-based for chlorine-evolution environments, platinum where inertness is required.',
      },
      {
        title: 'Drawing-based engineering review',
        body:
          'Each drawing is reviewed against cell geometry, electrolyte and operating parameters before manufacturing. The review covers substrate grade, forming sequence, coating application method and lead-wire termination.',
      },
      {
        title: 'Substrate and coating integrated supply',
        body:
          'Substrate forming, surface preparation, coating application and lead-wire attachment are managed in a single lot record. Material traceability is maintained from substrate stock to finished anode.',
      },
      {
        title: 'Prototype to production support',
        body:
          'Prototype coating runs are produced with full lot documentation. Repeat runs are matched to the prototype baseline by coating record and lot traceability.',
      },
      {
        title: 'Export and project coordination',
        body:
          'Export packaging, customs documentation and freight are coordinated per project. Incoterms and shipping documentation are confirmed per PO.',
      },
    ],
  },
};