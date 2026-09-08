/**
 * src/data/parts.ts
 *
 * Single source of truth for the /parts/ Titanium Parts procurement gateway.
 *
 * IMPORTANT ARCHITECTURE:
 *  - /parts/ is a TOP-LEVEL, PARALLEL commercial entry to /products/.
 *  - /products/ (and /products/product-entities/) = Capability Demonstration
 *    & Manufacturing Evidence (kept unchanged).
 *  - /parts/ = B2B Procurement Gateway (titanium parts / titanium components /
 *    custom titanium manufacturing / titanium fabrication).
 *  - NO Product Schema, NO Offer Schema, NO SKU / price / stock.
 *
 * All values are English (English-only per project requirement).
 */

export interface PartsFaq {
  question: string;
  answer: string;
}

export interface PartsCategory {
  slug: string;
  navName: string;
  pageTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroH1: string;
  heroSubtitle: string;
  applicationOverview: {
    title: string;
    body: string;
    keyPoints: string[];
  };
  typicalComponents: {
    title: string;
    intro: string;
    items: { name: string; grade: string; standard: string; note: string }[];
  };
  manufacturingMethods: {
    title: string;
    intro: string;
    methods: { name: string; desc: string }[];
  };
  availableGrades: {
    title: string;
    intro: string;
    grades: { name: string; uns: string; note: string }[];
  };
  technicalCapabilities: {
    title: string;
    intro: string;
    capabilities: { label: string; value: string }[];
  };
  qualityInspection: {
    title: string;
    intro: string;
    points: string[];
  };
  rfqCta: { title: string; text: string };
  faqs: PartsFaq[];

  // ---- STEP 2 enhancements (procurement-first / AIO / E-E-A-T) ----
  /** AIO snapshot: 2–3 sentence direct answer block, optimized for AI Overviews. */
  directIntentResolver?: {
    snapshot: string;
  };
  /** Procurement Snapshot: MOQ / sample fee / lead time / capacity / cert. */
  procurementSnapshot?: {
    title: string;
    intro: string;
    items: { label: string; value: string; placeholder?: boolean }[];
  };
  /** Dimensional Comparison Matrix (e.g. Gr2 vs Gr5 vs Gr9 vs Gr23). */
  comparisonMatrix?: {
    title: string;
    intro: string;
    columns: string[];
    rows: { grade: string; cells: string[] }[];
    footnote?: string;
  };
  /** Sequential Workflow Pipeline (DFM → Quotation → FAI → PPAP → Production → Shipment). */
  workflowPipeline?: {
    title: string;
    intro: string;
    stages: { name: string; desc: string; deliverable: string }[];
  };
  /** Boundary Conditions & Failure Modes: not-suitable-for / common design mistakes. */
  boundaryConditions?: {
    title: string;
    intro: string;
    notSuitableFor: { name: string; reason: string }[];
    commonMistakes: { mistake: string; fix: string }[];
  };
  /** Related Entities Graph: bottom semantic-neighbor links. */
  relatedEntities?: {
    title: string;
    items: { name: string; href: string; relation: string }[];
  };
}

export interface PartsLandingData {
  heroBadge: string;
  heroH1: string;
  heroSubtitle: string;
  intro: string;
  categories: { name: string; slug: string; blurb: string }[];
  faqs: PartsFaq[];

  // ---- STEP 2 enhancements (Pillar Solution Page / AIO / EEAT) ----
  /** AIO snapshot: 2–3 sentence direct-answer block. */
  directIntentResolver?: { snapshot: string };
  /** Procurement Snapshot: MOQ / sample fee / lead time / capacity / cert. */
  procurementSnapshot?: {
    title: string;
    intro: string;
    items: { label: string; value: string; placeholder?: boolean }[];
  };
  /** Dimensional Comparison Matrix across part families. */
  comparisonMatrix?: {
    title: string;
    intro: string;
    columns: string[];
    rows: { grade: string; cells: string[] }[];
    footnote?: string;
  };
  /** Sequential Workflow Pipeline (DFM → Quotation → FAI → Production → Shipment). */
  workflowPipeline?: {
    title: string;
    intro: string;
    stages: { name: string; desc: string; deliverable: string }[];
  };
  /** Boundary Conditions & Failure Modes for B2B engineering evaluation. */
  boundaryConditions?: {
    title: string;
    intro: string;
    notSuitableFor: { name: string; reason: string }[];
    commonMistakes: { mistake: string; fix: string }[];
  };
  /** Related Entities Graph: bottom semantic-neighbor links. */
  relatedEntities?: {
    title: string;
    items: { name: string; href: string; relation: string }[];
  };
  /** Cutting Parameters Reference: grade × Vc table + industry caps + troubleshooting. */
  cuttingParameters?: {
    title: string;
    intro: string;
    grades: { grade: string; vc: string; feed: string; tool: string; coolant: string; notes: string }[];
    industryChips: { industry: string; vc: string; constraint: string }[];
    troubleshooting: { symptom: string; cause: string; action: string }[];
    startupNote: string;
  };
}

// ── Titanium grade slugs (link targets under /materials/) ────────────
export const GRADE_1 = '/materials/grade-1/';
export const GRADE_2 = '/materials/grade-2/';
export const GRADE_5 = '/materials/grade-5/';
export const GRADE_7 = '/materials/grade-7/';
export const GRADE_9 = '/materials/grade-9/';
export const GRADE_12 = '/materials/grade-12/';
export const GRADE_19 = '/materials/grade-19/';
export const GRADE_21 = '/materials/grade-21/';
export const GRADE_23 = '/materials/grade-23/';

// ── Service link targets ─────────────────────────────────────────────
export const SRV_CNC = '/titanium-cnc-machining-services/';
export const SRV_FAB = '/titanium-fabrication-services/';
export const SRV_EDM = '/titanium-cnc-machining-services/wire-edm-machining/';

// ── Landing page ─────────────────────────────────────────────────────
export const PARTS_LANDING: PartsLandingData = {
  heroBadge: 'Titanium Parts Procurement Gateway',
  heroH1: 'Custom Titanium Parts Manufacturing',
  heroSubtitle:
    'Custom titanium components manufactured from prototype to production. BOZE provides precision CNC machining, welding, EDM and fabrication solutions with direct access to Baoji titanium supply chain.',
  intro:
    'BOZE is a titanium parts manufacturing partner for aerospace, marine, UAV, motorsport, medical and industrial OEMs. Upload your drawing for a DFM review and quotation, or browse the part categories below to understand the titanium components we machine, fabricate and assemble — from Grade 1 CP-titanium to Ti-6Al-4V ELI.',
  categories: [
    { name: 'Titanium CNC Parts', slug: 'titanium-cnc-parts', blurb: 'Precision CNC milled, turned and wire-EDM titanium components to ±0.005 mm.' },
    { name: 'Titanium Fabricated Parts', slug: 'titanium-fabricated-parts', blurb: 'Welded, laser-cut, waterjet and formed titanium assemblies and fabrications.' },
    { name: 'Titanium Pipe Components', slug: 'titanium-pipe-components', blurb: 'Pipe spool fabrication, flanges, fittings, tube assemblies and welded pipe systems.' },
    { name: 'Titanium Marine Parts', slug: 'titanium-marine-parts', blurb: 'Corrosion-resistant titanium hardware for seawater, subsea and marine systems.' },
    { name: 'Titanium UAV Components', slug: 'titanium-uav-components', blurb: 'Lightweight, high-strength titanium precision parts for UAV and drone airframes.' },
    { name: 'Titanium Motorsport Parts', slug: 'titanium-motorsport-parts', blurb: 'High-performance titanium suspension, fasteners and exhaust components for racing.' },
    { name: 'Titanium Medical Components', slug: 'titanium-medical-components', blurb: 'Biocompatible, certified titanium implants and surgical instruments.' },
  ],
  faqs: [
    {
      question: 'What is the difference between /parts/ and /products/ on this site?',
      answer:
        'The Titanium Parts section is our B2B procurement gateway — it answers how we custom-manufacture titanium components to your drawings (CNC, welding, EDM, fabrication) and how to request a quote. The Products & Solutions section demonstrates our engineering systems and component capabilities. Both reference the same certified manufacturing center in Baoji, China.',
    },
    {
      question: 'Which titanium grades can BOZE manufacture parts in?',
      answer:
        'We machine and fabricate commercially pure grades (Gr1–Gr4) and alpha-beta, beta and near-beta alloys including Ti-6Al-4V (Gr5), Ti-6Al-4V ELI (Gr23), Ti-0.2Pd (Gr7), Gr9, Gr12, Gr19 and Gr21 — all supplied with material traceability and mill test certificates.',
    },
    {
      question: 'Can I upload a drawing for a quote?',
      answer:
        'Yes. Use the "Upload Drawing" or "Request Quote" buttons on this page. Our engineering team performs a DFM (design-for-manufacturing) review and returns a quotation within 24–48 hours, including tolerance, surface finish and delivery recommendations.',
    },
    {
      question: 'What quality certifications does the BOZE manufacturing center hold?',
      answer:
        'The facility operates under AS9100D and ISO 9001 quality systems (with ISO 13485 for medical). Every shipment is backed by material traceability (EN 10204 3.1 mill certificates) and non-destructive testing as specified.',
    },
    {
      question: 'What is your minimum order quantity (MOQ)?',
      answer:
        'We support prototypes, low-volume production and batch production. MOQ is project-dependent — for many CNC and fabricated titanium parts we can produce single-piece prototypes and ramp to production.',
    },
  ],

  // ---- AIO direct-answer snapshot (STEP 2 / Citation Block 2) ----
  directIntentResolver: {
    snapshot:
      'Custom titanium parts manufacturing from BOZE covers prototype through mid-volume production of CNC-machined, fabricated, welded and EDM-processed titanium components, machined from certified grades (Gr1–Gr4 CP-titanium and Ti-6Al-4V / Ti-6Al-4V ELI alloys) under AS9100D, ISO 9001 and ISO 13485 quality systems with full EN 10204 3.1 traceability. Submit drawings for a 24–48 hour DFM-reviewed quotation.',
  },

  // ---- Procurement Snapshot (STEP 2 / Citation Block 6) ----
  procurementSnapshot: {
    title: 'Procurement & Supply-Chain Readiness',
    intro: 'Indicative commercial parameters for evaluation. Final terms are confirmed per RFQ.',
    items: [
      { label: 'Batch Range', value: '1-piece prototype → 10–1,000-piece mid-volume production' },
      { label: 'MOQ', value: '5–10 pieces or ≥5 kg per part number (project-dependent)' },
      { label: 'Sample Policy', value: 'Paid prototypes at cost recovery; fees refundable against bulk PO' },
      { label: 'Prototype Lead Time', value: '3–5 working weeks (incl. DFM + First Article Inspection)' },
      { label: 'Low-Volume Lead Time', value: '4–6 working weeks (5–50 pieces)' },
      { label: 'Mid-Volume Lead Time', value: '5–8 working weeks (50–500 pieces; bar stock lead time included)' },
      { label: 'Expedited Surcharge', value: 'Typically +20–30% on standard lead time' },
      { label: 'Customer-Supplied Material', value: 'Accepted (customer-issued titanium bar/plate); full traceability preserved' },
      { label: 'Quality Systems', value: 'AS9100D · ISO 9001 · ISO 13485' },
      { label: 'Material Traceability', value: 'EN 10204 3.1 mill certificates per shipment' },
      { label: 'NDT Capability', value: 'UT / RT / PT / MPI as specified' },
      { label: 'Ti-6Al-4V Roughing Vc (m/min)', value: '60–80 (TiAlN-coated carbide, f 0.15–0.25 mm/rev, ample coolant)' },
      { label: 'Ti-6Al-4V Finishing Vc (m/min)', value: '40–60 (TiAlN/AlCrN-coated, f 0.05–0.10 mm/rev; Ra ≤ 0.8 µm)' },
      { label: 'Ti-6Al-4V Drilling Vc (m/min)', value: '20–40 (carbide twist drill, f 0.10–0.20 mm/rev, chip evacuation mandatory)' },
      { label: 'Ti-5Al-5V-5Fe-3Cr Roughing Vc (m/min)', value: '50–70 (higher strength; TiAlN-coated, f 0.12–0.20 mm/rev)' },
      { label: 'Beta-C (Ti-3Al-8V-6Cr-4Zr-4Mo) Roughing Vc (m/min)', value: '40–60 (high-temperature alloy; coated carbide, f 0.10–0.18 mm/rev)' },
      { label: 'Ti-5Al-2.5Sn Roughing Vc (m/min)', value: '70–90 (cold-formable titanium; carbide, f 0.15–0.25 mm/rev)' },
      { label: 'CP Grade 2/5 Roughing Vc (m/min)', value: '80–120 (best machinability; carbide, f 0.15–0.30 mm/rev)' },
      { label: 'Industry-Adjusted Vc Cap', value: 'Aerospace AS9100D ≤ 60 m/min · Medical ISO 13485 40–50 m/min · Industrial 60–80 m/min · Prototype 30–50 m/min' },
    ],
  },

  // ---- Cutting Parameters (STEP 2 / Citation Block — Engineering) ----
  // Visible Block on the page; NOT mirrored to JSON-LD Service.additionalProperty
  // (engineering parameters stay on-page; JSON-LD only carries contract-level values).
  cuttingParameters: {
    title: 'Cutting Speed (Vc) Reference by Titanium Grade',
    intro:
      'Cutting speed Vc — not spindle RPM — is the primary constraint for titanium. Titanium has very low thermal conductivity (≈ 7 W/m·K), so heat concentrates at the cutting edge: raising RPM to "compensate" slow feed accelerates built-up edge and chipping. Coolant: oil-based > emulsion >> dry. Tool coating: TiAlN / AlCrN > TiN > uncoated.',
    grades: [
      { grade: 'Ti-6Al-4V — Roughing', vc: '60–80 m/min', feed: 'f 0.15–0.25 mm/rev', tool: 'TiAlN-coated carbide', coolant: 'ample flood + air blast', notes: 'Generic first choice; hot-hardness retention' },
      { grade: 'Ti-6Al-4V — Finishing', vc: '40–60 m/min', feed: 'f 0.05–0.10 mm/rev', tool: 'TiAlN / AlCrN-coated', coolant: 'ample flood', notes: 'ISO 5/6 tolerance · Ra ≤ 0.8 µm' },
      { grade: 'Ti-6Al-4V — Drilling', vc: '20–40 m/min', feed: 'f 0.10–0.20 mm/rev', tool: 'carbide twist drill', coolant: 'ample flood + chip evacuation', notes: 'Titanium sticks to flute; forced evacuation mandatory' },
      { grade: 'Ti-5Al-5V-5Fe-3Cr — Roughing', vc: '50–70 m/min', feed: 'f 0.12–0.20 mm/rev', tool: 'TiAlN-coated carbide', coolant: 'ample flood', notes: 'Higher strength → Vc trimmed vs Ti-6-4' },
      { grade: 'Beta-C (Ti-3Al-8V-6Cr-4Zr-4Mo) — Roughing', vc: '40–60 m/min', feed: 'f 0.10–0.18 mm/rev', tool: 'coated carbide', coolant: 'ample flood', notes: 'High-temperature alloy; hardest to cut' },
      { grade: 'Ti-5Al-2.5Sn — Roughing', vc: '70–90 m/min', feed: 'f 0.15–0.25 mm/rev', tool: 'carbide', coolant: 'ample flood', notes: 'Cold-formable titanium; better machinability' },
      { grade: 'CP Grade 2 / 5 — Roughing', vc: '80–120 m/min', feed: 'f 0.15–0.30 mm/rev', tool: 'carbide', coolant: 'ample flood', notes: 'Best machinability; low strength' },
    ],
    industryChips: [
      { industry: 'Aerospace (AS9100D)', vc: 'Vc ≤ 60 m/min (conservative)', constraint: 'Ra ≤ 0.8 µm · full cutting-parameter file archived and traceable' },
      { industry: 'Medical (ISO 13485)', vc: '40–50 m/min', constraint: 'Ra ≤ 0.4 µm · no burrs, no micro-cracks (implant-critical)' },
      { industry: 'Automotive / Industrial', vc: '60–80 m/min', constraint: 'Cost-sensitive · optimise cycle time · wider tool-wear budget' },
      { industry: 'Prototype / Low-Volume', vc: '30–50 m/min', constraint: 'First-article yield ≥ 95% · time secondary' },
    ],
    troubleshooting: [
      { symptom: 'Built-up edge / smearing', cause: 'Vc too high OR insufficient coolant', action: 'Reduce Vc · increase coolant flow · verify coating selection' },
      { symptom: 'Insert chipping / breakage', cause: 'Workpiece rigidity insufficient OR f too aggressive', action: 'Re-check fixturing · reduce feed per tooth · verify ap' },
      { symptom: 'Surface roughness exceeds spec', cause: 'Feed too high OR coolant concentration low', action: 'Reduce f · raise coolant concentration · switch to finer edge prep' },
    ],
    startupNote:
      'Conservative start for Ti-6Al-4V finish milling (D = 25 mm): n ≈ 760 RPM · Vf = n × f ≈ 760 × 0.08 ≈ 60 mm/min · actual Vc ≈ 60 m/min. Ramp in small increments only after confirming chip color and surface finish.',
  },

  // ---- Dimensional Comparison Matrix (STEP 2 / Citation Block 4) ----
  comparisonMatrix: {
    title: 'Titanium Part Family Comparison',
    intro: 'Engineering-side view of the seven titanium part families BOZE manufactures through /parts/. Cost index is qualitative (CP titanium baseline) and reflects families most commonly procured for multi-vertical OEM programs.',
    columns: ['Part Family', 'Primary Process', 'Typical Tolerance', 'Typical Lot', 'Relative Cost'],
    rows: [
      { grade: 'Titanium CNC Parts', cells: ['3/5-axis milling, turning, wire EDM', '±0.005 mm (CMM-verified)', 'Prototype → 10,000+ pc', '1.0–2.5×'] },
      { grade: 'Titanium Fabricated Parts', cells: ['TIG / laser cut / formed', '±0.1 mm typical', '1 → 500 assemblies', '1.1–2.0×'] },
      { grade: 'Titanium Pipe Components', cells: ['Spool fabrication, welded', '±0.2 mm on spool OD', 'Project-orders', '1.2–2.4×'] },
      { grade: 'Titanium Marine Parts', cells: ['CNC + fabrication', '±0.05 mm critical features', 'Low-volume to series', '1.4–2.6×'] },
      { grade: 'Titanium UAV Components', cells: ['5-axis milling, Swiss-type', '±0.005 mm thin-wall', 'Prototype → 1,000 pc', '1.6–3.0×'] },
      { grade: 'Titanium Motorsport Parts', cells: ['CNC + welded assemblies', '±0.02 mm suspension', 'Small series', '1.5–2.8×'] },
      { grade: 'Titanium Medical Components', cells: ['CNC, electropolished', '±0.01 mm + Ra ≤ 0.4 µm', 'Project / sterile-pack', '1.8–3.5×'] },
    ],
    footnote: 'Tolerance, lot and cost ranges are engineering-side reference figures, not quotations. Project-specific terms confirmed via RFQ.',
  },

  // ---- Sequential Workflow Pipeline (STEP 2 / Citation Block 5) ----
  workflowPipeline: {
    title: 'From Drawing to Shipment — Manufacturing Workflow',
    intro: 'How a custom titanium parts program moves through BOZE engineering, production and quality gates.',
    stages: [
      { name: '1. RFQ Intake', desc: 'Customer submits 3D/2D drawing, grade, tolerance, surface finish, NDT.', deliverable: 'RFQ ticket + NDA on request' },
      { name: '2. DFM Review', desc: 'Engineering reviews manufacturability, GDAM, fixturing and cost drivers.', deliverable: 'DFM report + indicative price (24–48 h)' },
      { name: '3. Quotation', desc: 'Formal quote issued with lead time, MOQ, payment terms and sample policy.', deliverable: 'Signed quotation + PO' },
      { name: '4. First Article (FAI)', desc: 'First article machined, CMM-checked, material certificates issued.', deliverable: 'FAI report + CMM inspection' },
      { name: '5. Production Run', desc: 'Approved FAI released to batch; in-process inspection at each stage.', deliverable: 'Batch + traveler + MTC (EN 10204 3.1)' },
      { name: '6. NDT & Surface', desc: 'UT / RT / PT, surface treatment (passivation, anodizing, PVD) as specified.', deliverable: 'NDT report + surface records' },
      { name: '7. Shipment', desc: 'Export packing, HS code, COO, Incoterms and logistics coordinated.', deliverable: 'Shipment + commercial invoice + packing list' },
    ],
  },

  // ---- Boundary Conditions & Failure Modes (STEP 2 / Citation Block 7) ----
  boundaryConditions: {
    title: 'Boundary Conditions & Engineering Failure Modes',
    intro: 'Engineering-side disclosures for buyers and designers evaluating titanium parts manufacturing feasibility.',
    notSuitableFor: [
      { name: 'Mass-production > 50,000 pcs/month', reason: 'Optimized for prototype-to-mid-volume; for very high-volume runs another process tier is more cost-effective.' },
      { name: 'Non-titanium substitutes', reason: 'Titanium-specific tooling, fixturing and chemistry — aluminum / steel jobs are out of scope for this page.' },
      { name: 'Replacing certified OEM-issued parts', reason: 'Customer-OEM parts remain governed by their own FAA / MDR / MIL documentation chain; BOZE supports build-to-print but cannot re-issue OEM certifications.' },
    ],
    commonMistakes: [
      { mistake: 'Specifying ±0.001 mm tolerances where ±0.05 mm is sufficient', fix: 'Tighten only critical GDAM features; reduces cycle time and cost 10–30%.' },
      { mistake: 'Ignoring titanium-specific machinability (work-hardening, springback)', fix: 'Engage DFM in Step 2; fixturing and cutter selection reviewed before quotation.' },
      { mistake: 'Mixing grades on a single part (CP + alloy)', fix: 'Confirm grade(s) up-front; mixing affects weld procedure and certificates.' },
      { mistake: 'Assuming Ti-6Al-4V weldability like CP-Ti', fix: 'Post-weld heat treatment required; design weld access accordingly.' },
    ],
  },

  // ---- Related Entities Graph (STEP 2 / Citation Block 11) ----
  relatedEntities: {
    title: 'Related Titanium Manufacturing Entities',
    items: [
      { name: 'Titanium CNC Machining Services', href: '/titanium-cnc-machining-services/', relation: 'Service' },
      { name: 'Titanium Fabrication & Welding', href: '/titanium-fabrication-services/', relation: 'Service' },
      { name: 'Wire EDM Machining', href: '/titanium-cnc-machining-services/wire-edm-machining/', relation: 'Process' },
      { name: 'Titanium Grades (Materials Library)', href: '/materials/', relation: 'Material' },
      { name: 'Aerospace Titanium Components', href: '/industries/aerospace/', relation: 'Industry' },
      { name: 'Medical Titanium Components', href: '/industries/medical/', relation: 'Industry' },
      { name: 'Technical Capabilities', href: '/capabilities/', relation: 'Capability' },
      { name: 'Standards Compliance', href: '/capabilities/standards-compliance/', relation: 'Standard' },
      { name: 'Request a Quote (RFQ)', href: '/rfq/', relation: 'Commercial' },
    ],
  },
};

// ── Part category pages ──────────────────────────────────────────────
export const PART_PAGES: PartsCategory[] = [
  {
    slug: 'titanium-cnc-parts',
    navName: 'Titanium CNC Parts',
    pageTitle: 'Titanium CNC Parts Manufacturing | Custom CNC Machined Titanium | BOZE',
    metaDescription:
      'Custom titanium CNC parts manufacturing: 3/5-axis milling, turning and wire EDM to ±0.005 mm. Aerospace, medical, UAV and industrial titanium components from Baoji, China.',
    heroBadge: 'Titanium CNC Parts',
    heroH1: 'Custom Titanium CNC Parts Manufacturing',
    heroSubtitle:
      'Precision titanium precision parts machined on 3/5-axis CNC centers and turn-mill cells — from prototype to production, with wire EDM for complex geometries and titanium rapid prototyping.',
    directIntentResolver: {
      snapshot:
        'Custom titanium CNC parts from BOZE are precision-machined from certified titanium grades (Gr2, Gr5, Gr9, Gr23) on 3/5-axis CNC centers with ±0.005 mm tolerances. Production runs from single-piece prototypes to 10,000+ piece batches under AS9100D / ISO 9001 / ISO 13485 quality systems with EN 10204 3.1 mill certificates. Submit drawings via RFQ for a DFM review and quotation within 24–48 hours.',
    },
    procurementSnapshot: {
      title: 'Procurement Snapshot',
      intro: 'Key commercial parameters for procurement planning. Contact us for project-specific confirmation.',
      items: [
        { label: 'MOQ', value: '1–5 pieces; flexible, prototype-friendly (vs typical 5–10 pc Western job-shop MOQ)' },
        { label: 'Sample Policy', value: 'Paid samples at 50–100% cost recovery; refundable against bulk PO' },
        { label: 'Standard Lead Time', value: '7–15 working days (7 d prototype; 10–15 d short-run production)' },
        { label: 'Monthly Capacity', value: '50,000–100,000 pieces/month (mid-to-upper tier capacity)' },
        { label: 'Quality Systems', value: 'AS9100D · ISO 9001 · ISO 13485 (medical)' },
        { label: 'Material Traceability', value: 'EN 10204 3.1 mill certificates per shipment' },
        { label: 'RFQ Response', value: 'DFM review and quotation within 24–48 hours' },
        { label: 'Pricing Position', value: 'Typically 25–35% below Western job-shop benchmarks for comparable specifications; cost-advantage from integrated Baoji titanium supply chain. Final price subject to project specification.' },
      ],
    },
    applicationOverview: {
      title: 'Application Overview',
      body:
        'CNC machined titanium parts are specified wherever high strength-to-weight ratio, corrosion resistance and fatigue life matter. BOZE produces custom titanium precision parts across aerospace, medical, UAV, semiconductor and industrial equipment. Our machining center runs 120+ CNC machines with lights-out production capability for repeatable batch quality.',
      keyPoints: [
        'Tolerances to ±0.005 mm with CMM verification',
        '5-axis milling, mill-turn and Swiss-type machining',
        'Wire EDM for deep, intricate and hardened titanium geometries',
        'Single-piece prototypes through high-volume production',
        'Direct Baoji titanium supply chain for fast material sourcing',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'We CNC machine a wide range of titanium components to drawing. Examples include:',
      items: [
        { name: 'Aerospace structural brackets & lugs', grade: 'Ti-6Al-4V (Gr5)', standard: 'AMS 4928 / ASTM B348', note: '5-axis milled, ±0.005 mm' },
        { name: 'Medical bone screws & surgical instruments', grade: 'Ti-6Al-4V ELI (Gr23)', standard: 'ISO 5832-3 / ASTM F136', note: 'Tight thread tolerances' },
        { name: 'UAV airframe & gimbal components', grade: 'Gr5 / Gr9', standard: 'ASTM B348', note: 'Lightweight thin-wall' },
        { name: 'Semiconductor vacuum chamber hardware', grade: 'Gr2 / Gr5', standard: 'ASTM B348', note: 'UHV-cleaned surfaces' },
        { name: 'Custom shafts, housings & threaded fasteners', grade: 'Gr2 / Gr5 / Gr23', standard: 'ASTM B348', note: 'Turn-mill single setup' },
        { name: 'Marine fasteners & propeller hubs', grade: 'Gr5 / Gr9', standard: 'ASTM B348 / ASTM B265', note: 'Seawater-corrosion resistant' },
        { name: 'Chemical process valve & reactor internals', grade: 'Gr2 / Gr7', standard: 'ASTM B348 / ASTM B265', note: 'Crevice-corrosion resistant for HCl / H2SO4 service' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium CNC parts are produced through several complementary machining methods:',
      methods: [
        { name: '3/5-Axis CNC Milling', desc: 'Complex 3D geometries, thin walls and aerospace surfaces with full contouring.' },
        { name: 'CNC Turning & Mill-Turn', desc: 'Shafts, housings and rotational parts machined in a single setup to hold concentricity.' },
        { name: 'Wire EDM Machining', desc: 'Wire-cut titanium for deep slots, profiles and precision features without tool pressure.' },
        { name: 'Titanium Rapid Prototyping', desc: 'Fast DFM iteration from CAD to first article for design validation.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'We machine a full range of titanium grades with material traceability. Common grades for CNC parts:',
      grades: [
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'Workhorse aerospace alloy, high strength' },
        { name: 'Grade 23 – Ti-6Al-4V ELI', uns: 'UNS R56401', note: 'Medical-grade, improved toughness' },
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Excellent corrosion resistance, formable' },
        { name: 'Grade 9 – Ti-3Al-2.5V', uns: 'UNS R56320', note: 'Stronger than CP grades, weldable' },
        { name: 'Grade 19 / 21 – Beta alloys', uns: 'UNS R58640 / R58210', note: 'High strength for aerospace' },
      ],
    },
    comparisonMatrix: {
      title: 'Titanium Grade Procurement Comparison',
      intro: 'Side-by-side view of the four grades most commonly procured for custom CNC parts. Cost index is qualitative relative to Grade 2 (CP).',
      columns: ['Property', 'Grade 2 (CP)', 'Grade 5 (Ti-6Al-4V)', 'Grade 9 (Ti-3Al-2.5V)', 'Grade 23 (Ti-6Al-4V ELI)'],
      rows: [
        { grade: 'UNS Designation', cells: ['R50400', 'R56400', 'R56320', 'R56401'] },
        { grade: 'Tensile Strength (min, MPa)', cells: ['345', '895', '620', '860'] },
        { grade: 'Yield Strength (min, MPa)', cells: ['275', '828', '483', '795'] },
        { grade: 'Machinability Index', cells: ['Fair (gummy, work-hardens)', 'Poor–Fair (work-hardening)', 'Fair', 'Poor–Fair (similar to Gr5)'] },
        { grade: 'Corrosion Resistance', cells: ['Excellent (oxidizing media)', 'Good', 'Good', 'Good'] },
        { grade: 'Weldability', cells: ['Excellent', 'Limited (post-weld treatment)', 'Excellent', 'Limited (post-weld treatment)'] },
        { grade: 'Relative Cost Index', cells: ['1.0× (baseline)', '2.5–3.5×', '1.6–2.0×', '3.0–4.0×'] },
        { grade: 'Typical Procurement Use', cells: ['Chemical / marine corrosion parts', 'Aerospace structural & motorsport', 'High-strength welded tubing', 'Medical implants (ISO 5832-3)'] },
      ],
      footnote: 'Mechanical property minima per ASTM B348 (Gr2, Gr5) and ASTM B265 (Gr9, Gr23). Cost index is a market-relative estimate, not a quotation. Confirm with RFQ.',
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Typical machining capabilities for titanium CNC parts:',
      capabilities: [
        { label: 'Dimensional Tolerance', value: '±0.005 mm' },
        { label: 'Surface Finish', value: 'Ra 0.2–0.8 µm as specified' },
        { label: 'Part Size', value: 'From micro-parts to 1.2 m machined envelopes' },
        { label: 'Axes', value: '3-axis, 5-axis, turn-mill, Swiss-type' },
        { label: 'Threading', value: 'Internal/external, metric & UN threads' },
        { label: 'Batch Size', value: 'Prototype (1 pc) to 10,000+ pc production' },
      ],
    },
    workflowPipeline: {
      title: 'From Drawing to Shipment — Sequential Workflow',
      intro: 'Standard process flow for a custom titanium CNC part. Each stage has a defined deliverable for procurement sign-off.',
      stages: [
        { name: '1. DFM Review', desc: 'Engineering review of your drawing for manufacturability, GD&T, tolerance feasibility and material selection.', deliverable: 'DFM report + risk flags within 24 h' },
        { name: '2. Quotation', desc: 'Itemized quote covering material, machining, inspection, surface treatment and freight terms.', deliverable: 'Quotation within 24–48 h' },
        { name: '3. Prototype / First Article', desc: 'Single-piece or small-batch production from stock or procured bar/billet.', deliverable: 'First Article parts (as applicable)' },
        { name: '4. FAI Inspection', desc: 'CMM dimensional inspection against your drawing, surface roughness and thread gauge verification.', deliverable: 'AS9102 / ISO 9001 FAI report' },
        { name: '5. PPAP / ISIR (Automotive / Aerospace)', desc: 'Production Part Approval Process or Initial Sample Inspection Report on request.', deliverable: 'PPAP / ISIR dossier' },
        { name: '6. Production Run', desc: 'Lights-out CNC production with in-process SPC and traveler traceability.', deliverable: 'Production lot + traveler' },
        { name: '7. Final Inspection & Release', desc: 'Final dimensional, surface, NDT and material certificate review before shipment.', deliverable: 'CMM + EN 10204 3.1 cert' },
        { name: '8. Shipment', desc: 'Export packaging, customs documentation and freight per agreed Incoterms.', deliverable: 'Commercial invoice + packing list + MTC' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Every titanium CNC part is verified against drawing with documented quality control:',
      points: [
        'CMM dimensional inspection per ISO 10360',
        'Material traceability with EN 10204 3.1 mill test certificates',
        'Non-destructive testing (UT / PT / MPI) as required',
        'Surface roughness and thread gauge verification',
        'AS9100D & ISO 9001 quality system control',
      ],
    },
    boundaryConditions: {
      title: 'Boundary Conditions & Failure Modes',
      intro: 'To avoid wasted iteration, please review these limitations and common design pitfalls before releasing your drawing.',
      notSuitableFor: [
        { name: 'High-volume commodity parts where aluminum suffices', reason: 'Titanium raw-material cost dominates unit price. Where strength-to-weight is not a critical driver, aluminum or stainless is more economical.' },
        { name: 'Cosmetic-surface parts without functional performance requirement', reason: 'Titanium polishing and finishing cost is significantly higher than stainless. Specify cosmetic requirements explicitly.' },
        { name: 'Envelope > 1.2 m in any single axis', reason: 'Our 5-axis work envelope tops out at 1.2 m. Larger envelopes require welded fabrication — request a fabrication quote instead.' },
        { name: 'Wall thickness < 0.3 mm in Ti-6Al-4V (Gr5)', reason: 'Thin-wall Gr5 has high chatter and work-hardening risk. Minimum recommended wall is 0.5 mm for aerospace Gr5 parts.' },
      ],
      commonMistakes: [
        { mistake: 'Specifying Ra 0.1 µm on functional (non-sealing) surfaces', fix: 'Standard machined Ra 0.4–0.8 µm is achievable; sub-Ra 0.2 µm requires secondary polishing — add to drawing and quote.' },
        { mistake: 'Internal corner radii below the tool nose radius', fix: 'Internal corners are limited by the cutting tool. Specify ≥ R0.5 mm for Gr5, ≥ R0.3 mm for Gr2 to avoid EDM secondary operations.' },
        { mistake: 'Tight ±0.005 mm on non-critical datums', fix: 'Apply tight tolerance only to functional features. Wide-tolerance defaults to ISO 2768-m; this typically halves machining time.' },
        { mistake: 'Forgetting to specify MTC type (3.1 vs 3.2)', fix: 'EN 10204 3.1 is the standard mill certificate; 3.2 requires independent third-party validation — flag this on the PO.' },
      ],
    },
    rfqCta: {
      title: 'Ready to Manufacture Your Titanium CNC Part?',
      text:
        'Upload your drawing or send an RFQ — our engineers review for manufacturability and return a quote within 24–48 hours. You can also request a 24-hour technical review window or our titanium machining whitepaper via the RFQ form.',
    },
    faqs: [
      {
        question: 'What tolerances can you hold on titanium CNC parts?',
        answer:
          'We hold dimensional tolerances to ±0.005 mm on features that require it, verified by CMM. Standard machining tolerances follow ISO 2768-m unless drawing specifies tighter.',
      },
      {
        question: 'Can you produce a single titanium prototype?',
        answer:
          'Yes. We support titanium rapid prototyping from a single piece, enabling you to validate design, fit and function before production.',
      },
      {
        question: 'Do you provide material certificates?',
        answer:
          'Yes. Every production batch ships with material traceability and EN 10204 3.1 mill test certificates where required.',
      },
      {
        question: 'What is the typical lead time from PO to delivery for a titanium CNC production order?',
        answer:
          'Standard lead time depends on material stock and part complexity. For stocked titanium grades (Gr2, Gr5, Gr23), typical production lot lead time is 15–25 working days after PO and material release. For special grades or non-standard bar sizes, add 10–15 working days for material procurement. Express prototyping options are available — request a current lead-time confirmation with your RFQ.',
      },
      {
        question: 'How do you de-risk titanium supply for long-term contracts?',
        answer:
          'We hold direct contracts with Baoji titanium mills, maintain a safety stock of common grades (Gr2, Gr5, Gr23) in standard bar/billet sizes, and lock material slots for framework agreements. Material certificates (EN 10204 3.1) accompany every shipment, and a two-source qualification is maintained for AS9100 programs.',
      },
    ],
    relatedEntities: {
      title: 'Related Entities',
      items: [
        { name: '5-Axis Titanium Machining', href: '/5-axis-titanium-machining/', relation: 'capability' },
        { name: 'AS9100 Titanium Supplier', href: '/as9100-titanium-supplier/', relation: 'certification' },
        { name: 'Titanium CNC Machining Services', href: '/titanium-cnc-machining-services/', relation: 'service-hub' },
        { name: 'Wire EDM Machining (Titanium)', href: '/titanium-cnc-machining-services/wire-edm-machining/', relation: 'process' },
        { name: 'Titanium Grade 5 (Ti-6Al-4V)', href: '/materials/grade-5/', relation: 'material' },
        { name: 'Titanium Grade 23 (Ti-6Al-4V ELI)', href: '/materials/grade-23/', relation: 'material' },
        { name: 'Titanium Grade 2 (CP)', href: '/materials/grade-2/', relation: 'material' },
        { name: 'Titanium CNC Tolerance Guide', href: '/blog/titanium-cnc-tolerance-guide-engineering-specifications/', relation: 'knowledge' },
        { name: 'Titanium CNC Cost Factors', href: '/blog/titanium-cnc-machining-cost-factors/', relation: 'knowledge' },
        { name: 'Titanium CNC RFQ Checklist', href: '/blog/titanium-cnc-machining-rfq-checklist/', relation: 'knowledge' },
        { name: 'Aerospace Parts', href: '/parts/titanium-uav-components/', relation: 'industry-vertical' },
        { name: 'Medical Components', href: '/parts/titanium-medical-components/', relation: 'industry-vertical' },
        { name: 'Marine Parts', href: '/parts/titanium-marine-parts/', relation: 'industry-vertical' },
      ],
    },
  },

  {
    slug: 'titanium-fabricated-parts',
    navName: 'Titanium Fabricated Parts',
    pageTitle: 'Titanium Fabricated Parts & Welded Assemblies | Custom Titanium Fabrication | BOZE',
    metaDescription:
      'Custom titanium fabrication services: TIG welding, laser & waterjet cutting, forming and welded assemblies. Titanium fabricated parts for aerospace, marine, chemical and industrial applications.',
    heroBadge: 'Titanium Fabricated Parts',
    heroH1: 'Custom Titanium Fabrication Services',
    heroSubtitle:
      'Titanium fabricated parts and welded assemblies built from prototype to production — laser & waterjet cutting, TIG welding, forming and surface treatment with full material traceability.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'Custom titanium fabrication turns plate, sheet, tube and bar into structural assemblies and process equipment. BOZE fabricates titanium parts for aerospace, marine, chemical and industrial applications where corrosion resistance and light weight are critical. Our fabrication team supports titanium pipe spool fabrication, tank internals, ducts, housings and welded structures.',
      keyPoints: [
        'TIG (GTAW) welding of titanium in controlled atmospheres',
        'Laser cutting and waterjet cutting of sheet & plate',
        'Forming, bending and rolling of titanium profiles',
        'Welded titanium assemblies with full weld traceability',
        'Post-weld cleaning, passivation and inspection',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Common fabricated titanium parts and assemblies we produce:',
      items: [
        { name: 'Welded titanium assemblies & brackets', grade: 'Gr2 / Gr5', standard: 'ASTM B265 / B381', note: 'Controlled-atmosphere TIG weld' },
        { name: 'Titanium ducting & housings', grade: 'Gr2 / Gr5', standard: 'ASTM B265', note: 'Formed + welded' },
        { name: 'Titanium tank internals & liners', grade: 'Gr1 / Gr2', standard: 'ASTM B265', note: 'Corrosion service' },
        { name: 'Fabricated flanges & weld-neck rings', grade: 'Gr2 / Gr5', standard: 'ASTM B381', note: 'Machined after fabrication' },
        { name: 'Chemical processing components', grade: 'Gr7 / Gr12', standard: 'ASTM B265 / B348', note: 'Crevice-corrosion resistant' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Fabricated titanium parts combine several processes:',
      methods: [
        { name: 'Titanium TIG (GTAW) Welding', desc: 'Trailing-gas shielded welding for clean, oxide-free welds.' },
        { name: 'Laser Cutting', desc: 'High-accuracy cutting of titanium sheet and tube with minimal heat-affected zone.' },
        { name: 'Waterjet Cutting', desc: 'Cold cutting of thick titanium plate without thermal distortion.' },
        { name: 'Forming & Bending', desc: 'Press brake, rolling and hot forming of titanium sections and profiles.' },
        { name: 'Surface Treatment', desc: 'Pickling, passivation and glass-bead finishing for weld-zone cleanliness.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'We fabricate in these titanium grades with material traceability:',
      grades: [
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Most common fabrication grade, excellent weldability' },
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'High-strength welded structures' },
        { name: 'Grade 7 – Ti-0.15Pd', uns: 'UNS R52400', note: 'Crevice-corrosion resistant for chemical service' },
        { name: 'Grade 9 – Ti-3Al-2.5V', uns: 'UNS R56320', note: 'Weldable high-strength CP alternative' },
        { name: 'Grade 12 – Ti-0.3Mo-0.8Ni', uns: 'UNS R53400', note: 'Good elevated-temperature corrosion resistance' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Fabrication capabilities for titanium parts:',
      capabilities: [
        { label: 'Material Thickness', value: '0.5 mm sheet to 50 mm plate' },
        { label: 'Welding', value: 'TIG / GTAW with controlled atmosphere' },
        { label: 'Cutting', value: 'Laser & waterjet cutting' },
        { label: 'Forming', value: 'Press brake, rolling, hot forming' },
        { label: 'Weld Integrity', value: 'Visual, PT, RT & UT per spec' },
        { label: 'Max Assembly', value: 'Large welded assemblies on request' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Fabricated titanium parts are inspected for both dimensional and weld integrity:',
      points: [
        'Weld inspection (visual, dye penetrant PT, RT / UT as required)',
        'CMM / laser-tracker dimensional verification for assemblies',
        'EN 10204 3.1 material traceability for all plate and sheet',
        'Post-weld chemical cleaning & passivation',
        'AS9100D & ISO 9001 quality system control',
      ],
    },
    rfqCta: {
      title: 'Need a Titanium Fabrication Partner?',
      text:
        'Send your fabrication drawings or 3D models — our team reviews weldability and manufacturability and returns a quote within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Do you perform titanium welding in a controlled atmosphere?',
        answer:
          'Yes. We use TIG (GTAW) welding with trailing-gas and controlled shielding to prevent oxygen and nitrogen contamination, producing clean, oxide-free welds.',
      },
      {
        question: 'Can you fabricate titanium pipe spools?',
        answer:
          'Yes. We provide titanium pipe spool fabrication, including cutting, beveling, welding and hydro-testing of titanium pipe systems to your layout drawings.',
      },
      {
        question: 'What is the maximum part size you can fabricate?',
        answer:
          'We fabricate titanium components from small brackets to large welded assemblies. Please share your envelope dimensions with your RFQ so we can confirm capacity.',
      },
    ],
  },

  {
    slug: 'titanium-pipe-components',
    navName: 'Titanium Pipe Components',
    pageTitle: 'Titanium Pipe Components & Pipe Spool Fabrication | BOZE',
    metaDescription:
      'Titanium pipe components and pipe spool fabrication: pipe, flanges, fittings, elbows, tube assemblies and welded pipe systems for chemical, marine and desalination plants.',
    heroBadge: 'Titanium Pipe Components',
    heroH1: 'Titanium Pipe Components & Spool Fabrication',
    heroSubtitle:
      'Titanium pipe spool fabrication and pipe components — pipe, flanges, fittings, elbows and welded tube assemblies built to layout drawings for corrosive and seawater service.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'Titanium pipe systems are specified for seawater, chemical, desalination, and heat-exchanger service where corrosion resistance and long life dominate total cost. BOZE fabricates titanium pipe components and complete spools — from pipe, flanges and fittings to welded tube assemblies — with full weld traceability and material certification.',
      keyPoints: [
        'Titanium pipe spool fabrication to isometric layout drawings',
        'Flanges, fittings, elbows, reducers and weld-neck components',
        'Seamless & welded titanium pipe (ASTM B861 / B862)',
        'Hydro-testing and material certification on every spool',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Titanium pipe components we supply and fabricate:',
      items: [
        { name: 'Titanium pipe spools (fabricated)', grade: 'Gr2 / Gr7', standard: 'ASTM B862', note: 'Welded to isometric drawing' },
        { name: 'Titanium flanges (slip-on, weld-neck, blind)', grade: 'Gr2 / Gr5', standard: 'ASTM B381', note: 'Machined sealing faces' },
        { name: 'Titanium elbows, tees & reducers', grade: 'Gr2', standard: 'ASTM B363', note: 'Wrought fittings' },
        { name: 'Titanium tube & tube assemblies', grade: 'Gr2 / Gr9', standard: 'ASTM B338', note: 'For heat exchangers' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium pipe components are produced through:',
      methods: [
        { name: 'Pipe Spool Fabrication', desc: 'Cutting, beveling, fit-up and TIG welding to isometric layout drawings.' },
        { name: 'TIG (GTAW) Pipe Welding', desc: 'Controlled-atmosphere welding of pipe joints for oxide-free welds.' },
        { name: 'CNC Machining of Fittings & Flanges', desc: 'Machined flanges and fittings with tight sealing-face tolerances.' },
        { name: 'Hydro & Pneumatic Testing', desc: 'Pressure verification per project specification.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'Titanium grades for pipe and pipe components:',
      grades: [
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Standard for seawater & chemical pipe' },
        { name: 'Grade 7 – Ti-0.15Pd', uns: 'UNS R52400', note: 'Crevice-corrosion resistance in acidic service' },
        { name: 'Grade 12 – Ti-0.3Mo-0.8Ni', uns: 'UNS R53400', note: 'Elevated-temperature corrosive service' },
        { name: 'Grade 9 – Ti-3Al-2.5V', uns: 'UNS R56320', note: 'Higher strength, weldable pipe' },
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'High-pressure / structural pipe systems' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Pipe component capabilities:',
      capabilities: [
        { label: 'Pipe Sizes', value: '¼" to 24" diameter, schedules as specified' },
        { label: 'Wall Thickness', value: 'Per schedule / engineering spec' },
        { label: 'Welding', value: 'TIG / GTAW, controlled atmosphere' },
        { label: 'Fittings', value: 'Elbows, tees, reducers, flanges' },
        { label: 'Testing', value: 'Hydrostatic, pneumatic, PT / RT' },
        { label: 'Certification', value: 'EN 10204 3.1 mill certificates' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Titanium pipe components are quality-controlled end to end:',
      points: [
        'EN 10204 3.1 material traceability for pipe and fittings',
        'Weld inspection with PT and RT per specification',
        'Hydrostatic pressure testing of fabricated spools',
        'Dimensional verification against isometric drawings',
        'AS9100D & ISO 9001 quality system control',
      ],
    },
    rfqCta: {
      title: 'Need Titanium Pipe Spools or Components?',
      text:
        'Send your isometric drawings, pipe spec and quantities — our team returns a fabrication quote within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Can you fabricate titanium pipe spools to our isometric drawings?',
        answer:
          'Yes. We fabricate titanium pipe spools to your isometric and layout drawings, including cutting, beveling, fit-up, TIG welding, hydro-testing and full material certification.',
      },
      {
        question: 'What titanium grades are common for seawater pipe?',
        answer:
          'Grade 2 is the standard for seawater and general chemical service. Grade 7 (Ti-0.15Pd) and Grade 12 add crevice-corrosion resistance for more aggressive acidic or elevated-temperature service.',
      },
      {
        question: 'Do you supply titanium flanges and fittings?',
        answer:
          'Yes. We supply and machine titanium flanges (slip-on, weld-neck, blind), and provide wrought fittings such as elbows, tees and reducers per ASTM B363.',
      },
    ],
  },

  {
    slug: 'titanium-marine-parts',
    navName: 'Titanium Marine Parts',
    pageTitle: 'Titanium Marine Parts | Seawater & Subsea Titanium Components | BOZE',
    metaDescription:
      'Titanium marine parts for seawater, subsea and shipboard systems: shafts, flanges, pump components, valves and corrosion-resistant hardware manufactured from titanium.',
    heroBadge: 'Titanium Marine Parts',
    heroH1: 'Titanium Marine Parts & Components',
    heroSubtitle:
      'Corrosion-resistant titanium parts for marine, subsea and shipboard systems — shafts, flanges, pump and valve hardware manufactured to withstand seawater service.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'Titanium is a preferred material for marine and subsea components because it resists seawater corrosion and biofouling without coatings or cathodic protection. BOZE manufactures titanium marine parts for shipboard systems, seawater pumps, valves, heat exchangers and subsea hardware — machined and fabricated to survive the harshest ocean environments.',
      keyPoints: [
        'Seawater corrosion resistance without coatings',
        'High strength for marine structural hardware',
        'Shafts, flanges, pump & valve components',
        'Subsea-rated machined titanium parts',
        'Full material certification for marine service',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Titanium marine parts we manufacture:',
      items: [
        { name: 'Titanium pump shafts & impellers', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'Seawater pump service' },
        { name: 'Titanium flanges & hull penetrations', grade: 'Gr2 / Gr5', standard: 'ASTM B381', note: 'Corrosion-resistant' },
        { name: 'Valve stems, seats & bodies', grade: 'Gr2 / Gr5', standard: 'ASTM B367 / B348', note: 'Seawater valves' },
        { name: 'Subsea structural hardware', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'High-strength' },
        { name: 'Heat-exchanger tube & tube sheets', grade: 'Gr2', standard: 'ASTM B338', note: 'Marine cooling' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium marine parts are produced by:',
      methods: [
        { name: 'CNC Machining', desc: 'Turning, milling and 5-axis machining of marine hardware.' },
        { name: 'TIG Welding & Fabrication', desc: 'Welded marine structures and penetrations with controlled atmosphere.' },
        { name: 'Heat-Treatment & Straightening', desc: 'Stress relief and dimensional stabilization after machining.' },
        { name: 'Surface Treatment', desc: 'Pickling and passivation for corrosion resistance.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'Titanium grades for marine components:',
      grades: [
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Seawater corrosion resistance, formable' },
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'High-strength marine structural parts' },
        { name: 'Grade 23 – Ti-6Al-4V ELI', uns: 'UNS R56401', note: 'Improved fracture toughness' },
        { name: 'Grade 12 – Ti-0.3Mo-0.8Ni', uns: 'UNS R53400', note: 'Elevated-temperature seawater service' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Marine part manufacturing capabilities:',
      capabilities: [
        { label: 'Tolerance', value: '±0.005 mm on critical features' },
        { label: 'Corrosion', value: 'Seawater & subsea rated' },
        { label: 'Surface Finish', value: 'Ra 0.4–0.8 µm as specified' },
        { label: 'Machining', value: 'CNC turning, milling, 5-axis' },
        { label: 'Welding', value: 'TIG, controlled atmosphere' },
        { label: 'Testing', value: 'PT, UT, hydrostatic as required' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Marine titanium parts are certified for demanding service:',
      points: [
        'EN 10204 3.1 material traceability',
        'Dimensional verification with CMM',
        'NDT (PT / UT) on marine-critical components',
        'Surface & passivation verification',
        'AS9100D & ISO 9001 quality control',
      ],
    },
    rfqCta: {
      title: 'Build Your Titanium Marine Parts with BOZE',
      text:
        'Send drawings or specs for your marine, subsea or shipboard titanium parts — we return a quotation within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Why use titanium for marine parts?',
        answer:
          'Titanium resists seawater corrosion and biofouling without coatings, sacrificial anodes or cathodic protection, and provides excellent strength-to-weight for marine hardware.',
      },
      {
        question: 'Can you machine titanium subsea components?',
        answer:
          'Yes. We CNC machine titanium subsea-rated hardware including shafts, flanges, valve parts and structural components to drawing with full material certification.',
      },
      {
        question: 'Do you provide material certificates for marine parts?',
        answer:
          'Yes. Marine components ship with EN 10204 3.1 mill test certificates and, where specified, NDT documentation for traceability and compliance.',
      },
    ],
  },

  {
    slug: 'titanium-uav-components',
    navName: 'Titanium UAV Components',
    pageTitle: 'Titanium UAV Components | Precision Machined Drone Parts | BOZE',
    metaDescription:
      'Titanium UAV components and drone parts: precision CNC machined titanium airframe, gimbal, motor and payload components with high strength-to-weight for UAV applications.',
    heroBadge: 'Titanium UAV Components',
    heroH1: 'Titanium UAV Components & Drone Parts',
    heroSubtitle:
      'Lightweight, high-strength titanium UAV precision machining — airframe, gimbal, motor and payload components that reduce weight while increasing stiffness.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'Every gram of weight matters in UAV design. Titanium offers a superior strength-to-weight ratio to steel and better stiffness and fatigue life than many aluminium alloys in thin sections. BOZE provides UAV precision machining of titanium components — airframe brackets, gimbal housings, motor mounts and payload structures — with tight tolerances and repeatability for flight-critical parts.',
      keyPoints: [
        'High strength-to-weight for flight-critical parts',
        'Tight tolerances (±0.005 mm) for moving assemblies',
        'Thin-wall machining for maximum weight saving',
        'Repeatable quality for production UAV programs',
        'Lightweight titanium for gimbals, mounts & payloads',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Titanium UAV components we precision machine:',
      items: [
        { name: 'UAV airframe brackets & fittings', grade: 'Gr5 / Gr9', standard: 'ASTM B348', note: 'Flight-critical, thin-wall' },
        { name: 'Gimbal housings & camera mounts', grade: 'Gr5', standard: 'ASTM B348', note: 'Precision 5-axis' },
        { name: 'Motor mounts & rotor hardware', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'High strength' },
        { name: 'Payload & sensor frames', grade: 'Gr2 / Gr5', standard: 'ASTM B348', note: 'Lightweight' },
        { name: 'Fasteners & threaded components', grade: 'Gr5', standard: 'ASTM B348', note: 'Tight tolerance' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium UAV components are produced with:',
      methods: [
        { name: '5-Axis CNC Machining', desc: 'Complex airframe and gimbal geometries in one setup.' },
        { name: 'CNC Turning & Mill-Turn', desc: 'Rotational parts and motor hardware with tight concentricity.' },
        { name: 'Wire EDM', desc: 'Intricate features and thin sections without tool deflection.' },
        { name: 'Titanium Rapid Prototyping', desc: 'Fast first articles for UAV design validation.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'Titanium grades for UAV components:',
      grades: [
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'High strength for structural UAV parts' },
        { name: 'Grade 23 – Ti-6Al-4V ELI', uns: 'UNS R56401', note: 'Improved toughness' },
        { name: 'Grade 9 – Ti-3Al-2.5V', uns: 'UNS R56320', note: 'Strong, weldable, good fatigue' },
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Lightweight non-structural parts' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'UAV component manufacturing capabilities:',
      capabilities: [
        { label: 'Tolerance', value: '±0.005 mm' },
        { label: 'Wall Thickness', value: 'Thin-wall machining for weight saving' },
        { label: 'Axes', value: '3-axis, 5-axis, turn-mill' },
        { label: 'Surface Finish', value: 'Ra 0.4–0.8 µm as specified' },
        { label: 'Weight', value: 'Optimized material removal' },
        { label: 'Batch', value: 'Prototype to production' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'UAV-critical components are verified to high standards:',
      points: [
        'CMM dimensional inspection',
        'Material traceability (EN 10204 3.1)',
        'Surface finish & thread verification',
        'Process control for repeatability',
        'AS9100D & ISO 9001 quality control',
      ],
    },
    rfqCta: {
      title: 'Machine Your Titanium UAV Components',
      text:
        'Share your UAV part drawings — our team returns a DFM review and quotation within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Why choose titanium for UAV parts?',
        answer:
          'Titanium provides an excellent strength-to-weight ratio and better stiffness and fatigue life than aluminium in thin sections, ideal for flight-critical UAV components where weight saving is essential.',
      },
      {
        question: 'Can you hold tight tolerances on thin-wall titanium parts?',
        answer:
          'Yes. Using 5-axis machining and wire EDM we hold tolerances to ±0.005 mm even on thin-wall titanium components, verified by CMM.',
      },
      {
        question: 'Do you support UAV production runs?',
        answer:
          'Yes. We support from titanium rapid prototyping and low-volume builds through repeatable production runs for UAV programs.',
      },
    ],
  },

  {
    slug: 'titanium-motorsport-parts',
    navName: 'Titanium Motorsport Parts',
    pageTitle: 'Titanium Motorsport Parts | Racing Components | BOZE',
    metaDescription:
      'Titanium motorsport parts for racing: suspension components, fasteners, exhaust and drivetrain hardware CNC machined from titanium for strength and weight savings.',
    heroBadge: 'Titanium Motorsport Parts',
    heroH1: 'Titanium Motorsport Parts & Racing Components',
    heroSubtitle:
      'High-performance titanium motorsport parts — suspension, fasteners, exhaust and drivetrain components machined to reduce unsprung weight and improve reliability.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'In motorsport, reducing unsprung and rotating mass directly improves handling, acceleration and lap time. Titanium combines high strength with roughly half the weight of steel, making it ideal for suspension, fasteners, exhaust and drivetrain parts. BOZE machines titanium motorsport components to demanding tolerances with certified material for racing reliability.',
      keyPoints: [
        'Reduces unsprung & rotating mass',
        'High strength for fatigue-critical racing parts',
        'Titanium fasteners & suspension components',
        'High-temperature exhaust hardware',
        'Certified material for racing reliability',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Titanium motorsport parts we produce:',
      items: [
        { name: 'Titanium suspension rods & linkages', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'Fatigue-critical' },
        { name: 'Titanium racing fasteners & bolts', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'Lightweight hardware' },
        { name: 'Titanium exhaust components', grade: 'Gr2 / Gr5', standard: 'ASTM B348 / B265', note: 'High temperature' },
        { name: 'Drivetrain & chassis parts', grade: 'Gr5', standard: 'ASTM B348', note: 'High strength' },
        { name: 'Nuts, spacers & washers', grade: 'Gr5', standard: 'ASTM B348', note: 'Precision' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium motorsport parts are made by:',
      methods: [
        { name: 'CNC Turning & Milling', desc: 'Precision fasteners, suspension and chassis parts.' },
        { name: '5-Axis Machining', desc: 'Complex suspension and drivetrain geometries.' },
        { name: 'TIG Welding & Fabrication', desc: 'Welded exhaust and structural components.' },
        { name: 'Heat-Treatment', desc: 'Stress relief and strength optimization.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'Titanium grades for motorsport components:',
      grades: [
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'High strength for structural racing parts' },
        { name: 'Grade 23 – Ti-6Al-4V ELI', uns: 'UNS R56401', note: 'Improved fatigue & toughness' },
        { name: 'Grade 9 – Ti-3Al-2.5V', uns: 'UNS R56320', note: 'Weldable, strong tubing' },
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Exhaust & formable parts' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Motorsport part manufacturing capabilities:',
      capabilities: [
        { label: 'Tolerance', value: '±0.005 mm' },
        { label: 'Strength', value: 'Gr5 / Gr23 high-strength alloys' },
        { label: 'Temperature', value: 'High-temp exhaust compatible' },
        { label: 'Surface Finish', value: 'Ra 0.4–0.8 µm as specified' },
        { label: 'Machining', value: 'CNC turning, milling, 5-axis' },
        { label: 'Heat-Treatment', value: 'Stress relief available' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Motorsport components are inspected for fatigue and dimensional integrity:',
      points: [
        'CMM dimensional verification',
        'Material traceability (EN 10204 3.1)',
        'Thread & surface verification',
        'NDT (PT / UT) where specified',
        'AS9100D & ISO 9001 quality control',
      ],
    },
    rfqCta: {
      title: 'Build Your Titanium Motorsport Parts',
      text:
        'Send drawings for racing suspension, fasteners or exhaust components — we return a quote within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Why is titanium used in motorsport?',
        answer:
          'Titanium offers roughly half the weight of steel with comparable strength, reducing unsprung and rotating mass to improve handling, acceleration and component life.',
      },
      {
        question: 'Can you machine titanium racing fasteners?',
        answer:
          'Yes. We CNC machine titanium bolts, nuts, studs and threaded fasteners to tight tolerances with certified material for racing reliability.',
      },
      {
        question: 'Do you supply certified titanium for motorsport?',
        answer:
          'Yes. Motorsport components ship with material traceability and EN 10204 3.1 mill certificates where required.',
      },
    ],
  },

  {
    slug: 'titanium-medical-components',
    navName: 'Titanium Medical Components',
    pageTitle: 'Titanium Medical Components | Implants & Surgical Instruments | BOZE',
    metaDescription:
      'Titanium medical components: certified implants and surgical instruments machined from Ti-6Al-4V ELI and CP-titanium under ISO 13485 quality systems.',
    heroBadge: 'Titanium Medical Components',
    heroH1: 'Titanium Medical Components & Implants',
    heroSubtitle:
      'Biocompatible, certified titanium medical components — implants and surgical instruments machined from Ti-6Al-4V ELI and CP-titanium under ISO 13485.',
    applicationOverview: {
      title: 'Application Overview',
      body:
        'Titanium is the material of choice for many implantable and surgical components because of its biocompatibility, corrosion resistance and osseointegration. BOZE manufactures titanium medical components — surgical instruments, implant trial parts and instrumentation — from certified Ti-6Al-4V ELI and CP-titanium under ISO 13485 quality management.',
      keyPoints: [
        'Biocompatible titanium alloys (ELI / CP)',
        'ISO 13485 quality management system',
        'Certified implant & surgical instrument machining',
        'Tight tolerances for moving instrument assemblies',
        'Full material & process traceability',
      ],
    },
    typicalComponents: {
      title: 'Typical Components',
      intro:
        'Titanium medical components we manufacture:',
      items: [
        { name: 'Surgical instruments & handles', grade: 'Gr5 / Gr23', standard: 'ASTM B348 / ISO 5832-3', note: 'Reusable instruments' },
        { name: 'Implant trial & instrumentation parts', grade: 'Gr23', standard: 'ISO 5832-3 / ASTM F136', note: 'Precision' },
        { name: 'Bone screws & fixation hardware', grade: 'Gr23', standard: 'ISO 5832-3 / ASTM F136', note: 'ELI medical grade' },
        { name: 'Medical device housings', grade: 'Gr2 / Gr5', standard: 'ASTM B348', note: 'Compact precision' },
        { name: 'Custom surgical tools', grade: 'Gr5 / Gr23', standard: 'ASTM B348', note: 'To drawing' },
      ],
    },
    manufacturingMethods: {
      title: 'Manufacturing Methods',
      intro:
        'Titanium medical components are produced with:',
      methods: [
        { name: 'Precision CNC Machining', desc: 'Micro and precision machining of medical parts.' },
        { name: 'Wire EDM', desc: 'Intricate cutting of surgical geometries.' },
        { name: 'Surface Treatment', desc: 'Passivation per ASTM F86 for corrosion resistance.' },
        { name: 'Cleaning & Packaging', desc: 'Controlled cleaning and validation-ready handling.' },
      ],
    },
    availableGrades: {
      title: 'Available Titanium Grades',
      intro:
        'Titanium grades for medical components:',
      grades: [
        { name: 'Grade 23 – Ti-6Al-4V ELI', uns: 'UNS R56401', note: 'Implant-grade, ISO 5832-3 / ASTM F136' },
        { name: 'Grade 4 ELI – CP-Titanium', uns: 'UNS R50700', note: 'Biocompatible CP for implants' },
        { name: 'Grade 5 – Ti-6Al-4V', uns: 'UNS R56400', note: 'Surgical instruments' },
        { name: 'Grade 2 – Commercial Pure', uns: 'UNS R50400', note: 'Non-implant medical parts' },
      ],
    },
    technicalCapabilities: {
      title: 'Technical Capabilities',
      intro: 'Medical component manufacturing capabilities:',
      capabilities: [
        { label: 'Tolerance', value: '±0.005 mm on critical features' },
        { label: 'Materials', value: 'Gr23 ELI, Gr4 ELI, Gr5, Gr2' },
        { label: 'Standards', value: 'ISO 5832-3, ASTM F136, ASTM F67' },
        { label: 'Surface Finish', value: 'Ra 0.2–0.8 µm as specified' },
        { label: 'Passivation', value: 'ASTM F86' },
        { label: 'Quality', value: 'ISO 13485 quality management' },
      ],
    },
    qualityInspection: {
      title: 'Quality & Inspection',
      intro:
        'Medical titanium components are manufactured under controlled quality systems:',
      points: [
        'ISO 13485 quality management system',
        'Material traceability with EN 10204 3.1',
        'CMM dimensional inspection',
        'Surface finish & passivation verification',
        'Cleaning and traceable process control',
      ],
    },
    rfqCta: {
      title: 'Manufacture Your Titanium Medical Components',
      text:
        'Send your medical component drawings — our team reviews feasibility and returns a quotation within 24–48 hours.',
    },
    faqs: [
      {
        question: 'Can you machine titanium implants and surgical instruments?',
        answer:
          'Yes. We manufacture titanium medical components including surgical instruments and implant trial parts from certified Ti-6Al-4V ELI and CP-titanium under ISO 13485 quality management.',
      },
      {
        question: 'Which titanium grades are biocompatible for medical use?',
        answer:
          'Ti-6Al-4V ELI (Grade 23, ISO 5832-3 / ASTM F136) and CP-titanium (Grade 4 ELI, ASTM F67) are commonly used for implantable and surgical components.',
      },
      {
        question: 'Do you provide material certificates for medical parts?',
        answer:
          'Yes. Medical components ship with EN 10204 3.1 mill test certificates and full material traceability for compliance.',
      },
    ],
  },
];

