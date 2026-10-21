/**
 * Hero Configuration — Centralized management for Hero text across all pages.
 *
 * Usage: Import HERO_CONFIG in any page .astro file and pass props to SubpageHero.
 * h1 is the full, ready-to-render H1 string (title + highlight merged).
 *
 * Key paths match page routes (no lang prefix). Keep English only.
 */
export interface HeroEntry {
  /** Full H1 heading (title + highlight merged into one complete string) */
  h1: string;
  /** Subtitle / description paragraph */
  subtitle?: string;
  /** Badge label (small tag above h1) */
  badge?: string;
  /** Key metrics chips displayed below subtitle */
  keyMetrics?: Array<{ value: string; label: string }>;
  /** Entity badges displayed as chips below subtitle */
  entityChips?: string[];
  /** Force smaller/compact hero layout */
  compact?: boolean;
}

export const HERO_CONFIG: Record<string, HeroEntry> = {
  '/': {
    h1: 'End-to-End Titanium Manufacturing Solutions',
    subtitle: 'From titanium additive manufacturing and precision CNC machining to fabrication, finishing, and assembly, we provide complete one-stop solutions for custom titanium parts and components. Built on AS9100-compliant quality systems, we support projects from prototype development to full-scale production.',
    badge: 'Industry-Leading Solutions | AS9100D Certified',
  },
  '/services': {
    h1: 'Titanium CNC Manufacturing Services',
    subtitle: 'End-to-end titanium manufacturing solutions from rapid prototyping to high-volume precision CNC machining and heavy industrial fabrication.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "12+",
                "label": "Years in Titanium"
          },
          {
                "value": "4,800+",
                "label": "RFQs / 24 mo"
          },
          {
                "value": "99.2%",
                "label": "On-Time Delivery"
          },
          {
                "value": "35+",
                "label": "CNC Machines"
          }
    ],
    entityChips: [
          "CNC Machining",
          "Additive Manufacturing",
          "Fabrication",
          "Forming & Heavy",
          "Surface Treatment"
    ]
  },
  '/mill-products': {
    h1: 'Premium Industrial Titanium Mill Products',
    subtitle: 'Certified titanium ingot, bars, plates, tubes, wire, foil and mesh with documented material traceability and international specifications. Sourced through Baoji\'s titanium supply chain and prepared for aerospace, medical, semiconductor, chemical processing and industrial applications.',
    badge: 'Mill Products Hub | AS9100D Supply Chain',
    keyMetrics: [
      { value: '7', label: 'Product Forms' },
      { value: '5', label: 'CP / Alloy Grades' },
      { value: 'ASTM/AMS/MIL', label: 'Specifications' },
      { value: 'EN 10204 3.1', label: 'Mill Certification' },
    ],
    entityChips: [
      'Ingots',
      'Bars & Rods',
      'Plates & Sheets',
      'Tubes & Pipes',
      'Wire',
      'Foil & Coils',
      'Mesh',
    ],
  },
  // BSI Phase G-2.1 · Mill Products Plate & Sheet sub-page (title & scope aligned)
  '/mill-products/plates-sheets': {
    h1: 'Titanium Plate & Sheet — Industrial Mill Stock',
    subtitle: 'Precision-rolled titanium plate and sheet in CP Gr1/2/3/4, aerospace Gr5 / Ti-6Al-2Sn-4Zr-2Mo, and corrosion-resistant Gr7 / Gr12. Plate thickness up to 6″ with sheet in the 0.5–4.8 mm range. EN 10204 3.1/3.2 mill certification; standard stock ships in 3–5 days with non-standard alloys and custom rolling in 6–8 weeks.',
    badge: 'Mill Products / Plate & Sheet | AS9100D',
    keyMetrics: [
      { value: '0.5 mm–6″', label: 'Sheet–plate thickness range' },
      { value: '12′×50′', label: 'Max dimensions' },
      { value: '10+ grades', label: 'Stock range' },
      { value: '3–5 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM B265',
      'ASME SB265',
      'AMS 4911',
      'AMS 4919',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-4 · Mill Products Bar & Rod sub-page
  '/mill-products/bars-rods': {
    h1: 'Titanium Bar & Rod — Industrial Mill Stock',
    subtitle: 'Round, square and hexagonal titanium bar and rod stock in CP Gr1/2, aerospace Gr5 (Ti-6Al-4V), medical Gr23 (Ti-6Al-4V ELI) and corrosion-resistant Gr7 / Gr9 / Gr12. Diameter range Ø3.0–300 mm, centerless-ground and cold-drawn h7–h9 tolerance where specified. EN 10204 3.1 mill certification; standard stock ships in 3–5 days with non-standard alloys and custom heat-treat in 4–6 weeks.',
    badge: 'Mill Products / Bar & Rod | AS9100D',
    keyMetrics: [
      { value: 'Ø3.0–300 mm', label: 'Diameter range' },
      { value: 'h7–h9', label: 'Tolerance grade' },
      { value: '9+ grades', label: 'Stock range' },
      { value: '3–5 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM B348',
      'AMS 4928',
      'ASTM F136',
      'ISO 5832-3',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-5 · Mill Products Tube & Pipe sub-page
  '/mill-products/tubes-pipes': {
    h1: 'Titanium Tubes & Pipes — Heat Exchanger & Process Mill Stock',
    subtitle: 'Seamless and welded titanium tubes and pipes in CP Gr1/2, near-α Gr9 (Ti-3Al-2.5V), Pd-stabilized Gr7, and Gr12 (Ti-0.3Mo-0.8Ni). OD Ø3–219 mm, WT within ±10% of nominal, lengths up to 18 000 mm. Supplied to ASTM B338 / B861 / B862 with EN 10204 3.1 MTR and 100% eddy-current testing; standard stock ships in 5–7 days with non-standard dimensions and alloy in 6–8 weeks.',
    badge: 'Mill Products / Tubes & Pipes | AS9100D',
    keyMetrics: [
      { value: 'Ø3–219 mm', label: 'OD range' },
      { value: '±10%', label: 'WT tolerance' },
      { value: '18 000 mm', label: 'Max length' },
      { value: '5–7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM B338',
      'ASTM B861',
      'ASTM B862',
      'ASME SB338',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-7 · Mill Products Foil & Coil sub-page
  '/mill-products/foil-coils': {
    h1: 'Titanium Foil & Coil — Thin Mill Stock for Chemical, Energy & Precision',
    subtitle: 'Titanium foil and coil stock in CP Gr1 / Gr2, with Pd-stabilized Gr7 for reducing-acid service. Thickness 0.025–0.5 mm (foil) and 0.5–3.0 mm (coil), width 50–610 mm, mill-annealed or hard-rolled temper. Supplied to ASTM B265 with EN 10204 3.1 MTR; standard stock ships in 5–7 days with non-standard dimensions and alloy in 4–6 weeks.',
    badge: 'Mill Products / Foil & Coil | AS9100D',
    keyMetrics: [
      { value: '0.025–3.0 mm', label: 'Thickness range' },
      { value: '50–610 mm', label: 'Width range' },
      { value: 'CP / Pd-Gr7', label: 'Grade family' },
      { value: '5–7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM B265',
      'AMS 4900',
      'ASME SB265',
      'ISO 5832-2',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-8 · Mill Products Woven Mesh sub-page
  '/mill-products/mesh': {
    h1: 'Titanium Woven Mesh — Electrochemical, Filtration & Cathodic-Protection Stock',
    subtitle: 'Titanium woven wire mesh in CP Gr1 / Gr2, with Pd-stabilized Gr7 for reducing-acid and chlor-alkali service. Opening 0.05–6.0 mm, wire Ø 0.025–2.0 mm, plain / twill / dutch weave. Supplied to ASTM E2016 with EN 10204 3.1 MTR; standard stock ships in 5–7 days with custom mesh-count in 4–6 weeks.',
    badge: 'Mill Products / Woven Mesh | AS9100D',
    keyMetrics: [
      { value: '0.05–6.0 mm', label: 'Opening range' },
      { value: '0.025–2.0 mm', label: 'Wire Ø range' },
      { value: 'Plain / Twill / Dutch', label: 'Weave pattern' },
      { value: '5–7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM E2016',
      'ISO 9044',
      'DIN 4185',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-6 · Mill Products Wire sub-page
  '/mill-products/wire': {
    h1: 'Titanium Wire — Welding, Medical & Additive Stock',
    subtitle: 'Titanium wire in coil and straight lengths in CP Gr1/2, aerospace Gr5 (Ti-6Al-4V), medical Gr23 (Ti-6Al-4V ELI) and Gr9 (Ti-3Al-2.5V). Diameter Ø0.1–6.0 mm, coil and spooled, bright / matte / oxide-dark finishes. Supplied to ASTM B863 / AMS 4951 with EN 10204 3.1 MTR; standard stock ships in 5–7 days with non-standard alloys and small-diameter draws in 4–6 weeks.',
    badge: 'Mill Products / Wire | AS9100D',
    keyMetrics: [
      { value: 'Ø0.1–6.0 mm', label: 'Diameter range' },
      { value: 'CP / ELI / α-β', label: 'Grade family' },
      { value: 'Coil / Spool', label: 'Pack form' },
      { value: '5–7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASTM B863',
      'AMS 4951',
      'AMS 4954',
      'AWS A5.16',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
// BSI Phase G-9 · Mill Products Titanium Ingot sub-page
  '/mill-products/ingot': {
    h1: 'Titanium Ingot — Melting Route, Weight Class & Billet Feedstock',
    subtitle: 'Titanium ingot to ASTM B977/B977M in CP Grade 1 / 2 / 3 / 4, aerospace Grade 5 (Ti-6Al-4V) and ELI Grade 23 (Ti-6Al-4V ELI). VAR single, double (EBM + VAR) or triple melt routing per AMS 2380, 5-60 kg weight class at Ø150-600 mm. Sourced against upstream Baoji melting campaigns with EN 10204 3.1 certification and heat-level traceability; MOQ and schedule are quotation-specific.',
    badge: 'Mill Products / Ingot | ASTM B977',
    keyMetrics: [
      { value: 'ASTM B977/B977M', label: 'Ingot specification' },
      { value: '5–60 kg', label: 'Ingot weight class' },
      { value: 'Ø150–600 mm', label: 'Cylindrical geometry' },
      { value: 'VAR 1× / 2× / 3×', label: 'Melting route' },
    ],
    entityChips: [
      'ASTM B977',
      'AMS 2380',
      'ASTM B348',
      'AMS 4928',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase G-6 · Mill Products Wire sub-page
  // BSI Phase H-B · Standard Parts Flanges sub-page
  '/standard-parts/flanges': {
    h1: 'Titanium Flanges — ASME B16.5 / ASTM B381 Forged',
    subtitle: 'Forged titanium pipe flanges in CP Gr.2 / Gr.5 (Ti-6Al-4V) / Gr.7 (Ti-Pd) / Gr.12 (Ti-0.3Mo-0.8Ni) / Gr.23 (Ti-6Al-4V ELI). NPS 1/2 to 48 inch, Class 150 to 2500 (ASME B16.5) / PN 16 to PN 160 (EN 1092-1). Weld-neck, slip-on, blind, threaded, lap-joint and custom geometries. RF / RTJ / FF / MFM facing. Standard stock 5-7 days, custom forging 2-4 weeks.',
    badge: 'Standard Parts / Flanges | AS9100D',
    keyMetrics: [
      { value: 'NPS 1/2-48"', label: 'Size range' },
      { value: 'Class 150-2500', label: 'Pressure class' },
      { value: 'WN / SO / BL / TH / LJ', label: 'Flange form' },
      { value: '5-7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASME B16.5',
      'ASTM B381',
      'ASME SB381',
      'EN 1092-1 Type 11',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase H-C · Standard Parts Pipe Fittings sub-page
  '/standard-parts/pipe-fittings': {
    h1: 'Titanium Pipe Fittings — ASME B16.9 / ASTM B363 Buttweld',
    subtitle: 'Butt-weld titanium pipe fittings in CP Gr.1 / Gr.2 / Gr.5 (Ti-6Al-4V) / Gr.7 (Ti-Pd) / Gr.12 (Ti-0.3Mo-0.8Ni). NPS 1/2 to 24 inch, SCH 5S to SCH 160. Elbows 90 LR / 90 SR / 45, tees equal / reducing, reducers concentric / eccentric, caps, stub ends, crosses, laterals. Forged to ASTM B363 and ASME B16.9 with MSS SP-43 stub ends. Standard stock 5-7 days, custom 2-3 weeks.',
    badge: 'Standard Parts / Pipe Fittings | AS9100D',
    keyMetrics: [
      { value: 'NPS 1/2-24"', label: 'Size range' },
      { value: 'SCH 5S-160', label: 'Wall schedule' },
      { value: 'Elbows / Tees / Reducers', label: 'Fitting form' },
      { value: '5-7 days', label: 'Standard lead time' },
    ],
    entityChips: [
      'ASME B16.9',
      'ASTM B363',
      'ASME SB363',
      'MSS SP-43',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase H-D · Standard Parts Fasteners sub-page
  '/standard-parts/fasteners': {
    h1: 'Titanium Fasteners — DIN / ISO / NAS / AS9100D',
    subtitle: 'High-precision titanium fasteners in CP Gr.2 (semiconductor / chemical) and Gr.5 (Ti-6Al-4V, motorsport / aerospace). Socket head cap screws, hex head bolts, hex nuts, flange nuts, washers, threaded rod. To DIN 912 / DIN 933 / DIN 934 / DIN 6923 / ISO 4014 / ISO 4017 / ISO 4032 / ASME B18.2.1 plus aerospace NAS / AN / MS. AS9100D QMS. Thread-rolled (no cutting) with continuous grain flow. Standard stock 24-48 hours, custom machined 7-10 days, batch heading 3-4 weeks.',
    badge: 'Standard Parts / Fasteners | AS9100D',
    keyMetrics: [
      { value: 'M2-M36', label: 'Metric size range' },
      { value: '6g/6H or 3A/3B', label: 'Thread tolerance' },
      { value: 'SHCS / Hex / Nut / Washer', label: 'Item form' },
      { value: '24-48 hours', label: 'Stock lead time' },
    ],
    entityChips: [
      'DIN 912',
      'ISO 4014/4017',
      'ASME B18.2.1',
      'NAS / AN / MS',
      'EN 10204 3.1',
      'AS9100D',
    ],
  },
  // BSI Phase H-E · Standard Parts Machined Components sub-page (closes the standard-parts sub-page set)
  '/standard-parts/machined-components': {
    h1: 'Titanium CNC Machined Standard Components | Custom to Print, ISO 2768, AS9100D',
    subtitle: 'Custom CNC-machined titanium components to print in CP Gr.2 / Gr.5 (Ti-6Al-4V) / Gr.23 (Ti-6Al-4V ELI). Mating flanges, manifold blocks, sensor housings, pump and valve bodies, structural brackets, and medical implant prototypes. Tolerance to ISO 2768-m (and -k upgrade) with 5-axis contour per ASME Y14.5. AS9100D QMS with full CMM, surface-finish, and PMI inspection. Prototype 7-10 days, production 3-6 weeks.',
    badge: 'ISO 2768-m/k · ASME Y14.5 · AS9100D · ASTM B348 · ASTM F67/F136',
    keyMetrics: [
      { value: '3 / 4 / 5-Axis + Wire EDM', label: 'CNC capacity' },
      { value: '±0.01 mm', label: 'Tightest turning' },
      { value: 'Ra 0.4 µm', label: 'Mirror finish on request' },
      { value: '7-10 d / 3-6 w', label: 'Prototype / production' },
    ],
    entityChips: ['Gr.2 (CP)', 'Gr.5 (Ti-6Al-4V)', 'Gr.23 (ELI)', 'Custom to print', 'AS9100D'],
  },
  '/standard-parts': {
    h1: 'Titanium Standard Parts & Components',
    subtitle: 'Standard-compliant titanium fasteners, flanges, pipe fittings and machined components supplied to ASTM, ASME, DIN and other applicable specifications — with certified materials, dimensional control and full heat-to-part material traceability. Sourced from Baoji, China\'s titanium manufacturing center, with ISO 9001:2015 and AS9100D quality systems.',
    badge: 'Standard Parts Hub | AS9100D Procurement',
    keyMetrics: [
      { value: '4', label: 'Product Families' },
      { value: 'ASTM/ASME/DIN', label: 'Specifications' },
      { value: 'Heat→Part', label: 'Traceability' },
      { value: 'EN 10204 3.1', label: 'Mill Certification' },
    ],
    entityChips: [
      'Titanium Flanges',
      'Pipe Fittings',
      'Titanium Fasteners',
      'CNC Machined Components',
    ],
  },
  '/materials': {
    h1: 'Titanium Materials Engineering Guide',
    subtitle: 'Comprehensive technical reference for procurement engineers — from Grade 1 CP-Titanium to Grade 5 ELI medical-grade alloys. Every grade documented with certified properties and application guidance.',
    badge: 'Metallurgy & Alloys',

    keyMetrics: [
          {
                "value": "30+",
                "label": "Titanium Grades"
          },
          {
                "value": "15+",
                "label": "ASTM/AMS"
          },
          {
                "value": "6",
                "label": "Alloy Classes"
          }
    ],
    entityChips: [
          "Grade 5 Ti-6Al-4V",
          "Grade 23 ELI",
          "Grade 2 CP",
          "AMS 4928",
          "ASTM B348"
    ]
  },
  '/capabilities': {
    h1: 'Technical Capabilities',
    subtitle: 'Certified precision manufacturing infrastructure — from micron-level CNC tolerancing to full material traceability. A detailed technical reference for procurement and engineering teams.',
    badge: 'Manufacturing Engineering Data Sheet',

    keyMetrics: [
          {
                "value": "5",
                "label": "Capability Pillars"
          },
          {
                "value": "AS9100D",
                "label": "Aerospace"
          },
          {
                "value": "\u00b10.005mm",
                "label": "Dimensional"
          }
    ],
    entityChips: [
          "Manufacturing",
          "Engineering",
          "Capacity",
          "Quality",
          "Inspection",
          "Traceability",
          "Certifications"
    ]
  },
  '/industries': {
    h1: 'Industry Solutions',
    subtitle: 'Engineered titanium solutions for the world\'s most demanding industries — from aerospace structural components to AI infrastructure thermal management systems.',
    badge: 'Precision Manufacturing Verticals',

    keyMetrics: [
          {
                "value": "8",
                "label": "Target Industries"
          },
          {
                "value": "AS9100D",
                "label": "Aerospace"
          },
          {
                "value": "",
                "label": "Medical"
          }
    ],
    entityChips: [
          "Aerospace",
          "Medical & Dental",
          "Defense",
          "Automotive",
          "Energy",
          "AI Infrastructure"
    ]
  },
  '/resources': {
    h1: 'Technical Resources Library',
    subtitle: 'Comprehensive technical documentation, engineering guides, whitepapers, and downloadable CAD resources — an open library for titanium manufacturing professionals.',
    badge: 'Engineering Knowledge Base',

    keyMetrics: [
          {
                "value": "50+",
                "label": "Technical Docs"
          },
          {
                "value": "100+",
                "label": "Pages"
          },
          {
                "value": "Free",
                "label": "CAD"
          }
    ],
    entityChips: [
          "Whitepapers",
          "CAD Downloads",
          "Engineering Guides",
          "Compliance Docs"
    ]
  },
  '/resources/titanium-grades-guide': {
    h1: "The Buyer's Guide to Titanium Grades & Alloys",
    subtitle: 'Authoritative selection reference for Grade 2, Grade 5 (Ti-6Al-4V), Grade 7 (Ti-0.15Pd), Grade 12 (Ti-0.3Mo-0.8Ni), and Grade 23 (Ti-6Al-4V ELI) — with chemistry, mechanical properties, applicable ASTM/AMS/ISO standards, and CNC machining guidance. AS9100D ·  · ISO 9001 · EN 10204 3.1 MTR.',
    badge: 'Titanium Grades Reference Hub · ASTM/AMS/ISO',

    keyMetrics: [
      { value: '5', label: 'Core Grades' },
      { value: 'UNS / ASTM', label: 'Authoritative IDs' },
      { value: 'AS9100D', label: 'Aerospace Quality' },
      { value: '', label: 'Medical Quality' },
    ],

    entityChips: [
      'Ti-6Al-4V',
      'Ti-0.15Pd',
      'Ti-0.3Mo-0.8Ni',
      'UNS R56400',
      'UNS R52400',
      'EN 10204 3.1',
    ],
  },
  '/rfq': {
    h1: 'Request a Quote',
    subtitle: 'Submit your engineering RFQ for titanium CNC machining, additive manufacturing, fabrication, or surface treatment. Get a formal quote within 24-48 hours. Secure CAD upload.',
    badge: 'Engineering Procurement',

    keyMetrics: [
          {
                "value": "24-48",
                "label": "Hr Quote"
          },
          {
                "value": "100%",
                "label": "NDA"
          },
          {
                "value": "Secure",
                "label": "CAD Upload"
          }
    ],
    entityChips: [
          "DFM Review",
          "CAD Files",
          "MTR Required",
          "NDA Available",
          "Global Shipping"
    ]
  },
  '/blog': {
    h1: 'Boze Titanium Manufacturing Center Blog: Expert Insights on Titanium Manufacturing',
    subtitle: 'In-depth engineering guides, case studies, procurement guides, material science, and manufacturing insights from our AS9100D-certified titanium CNC facility.',
    badge: 'Knowledge Hub',
  },
  '/use-cases': {
    h1: 'Use Cases',
    subtitle: 'Real-world use cases and application examples of titanium CNC machining across aerospace, medical, automotive, and industrial sectors.',
    badge: 'Industry Applications',
  },
  '/facilities': {
    h1: 'Our Facilities',
    subtitle: 'Strategically located facilities across the globe equipped with state-of-the-art technology to meet your Titanium CNC Machining and manufacturing needs.',
    badge: 'Our Infrastructure',

    keyMetrics: [
          {
                "value": "15+",
                "label": "Facilities"
          },
          {
                "value": "50,000+",
                "label": "Sq Meters"
          },
          {
                "value": "24/7",
                "label": "Operations"
          }
    ],
    entityChips: [
          "Manufacturing Plants",
          "Inspection Labs",
          "Warehousing",
          "Global Logistics"
    ]
  },
  '/equipment': {
    h1: 'CNC Manufacturing Equipment Inventory',
    subtitle: 'Comprehensive equipment specification sheets for our complete titanium CNC manufacturing facility — from 5-axis machining centers and multi-tasking turn-mill machines to CMM inspection, heat treatment, and automated pallet systems.',
    badge: 'Manufacturing Equipment Specification Sheet',

    keyMetrics: [
          {
                "value": "35+",
                "label": "CNC Machines"
          },
          {
                "value": "5-Axis",
                "label": "Centers"
          },
          {
                "value": "CMM",
                "label": "Inspection"
          }
    ],
    entityChips: [
          "5-Axis Machining",
          "Swiss Lathe",
          "Wire EDM",
          "CMM Metrology",
          "Automated Pallet"
    ]
  },
  // --- Services Sub-pages ---
  '/titanium-cnc-machining-services': {
    h1: 'Titanium CNC Machining Services',
    subtitle: 'End-to-end titanium CNC machining solutions — from rapid prototyping to high-volume production — across 3/5-axis milling, turning, wire EDM, and custom industrial components.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "5",
                "label": "CNC Services"
          },
          {
                "value": "\u00b10.005mm",
                "label": "Tolerance"
          },
          {
                "value": "AS9100D",
                "label": "Certified"
          }
    ],
    entityChips: [
          "3/5-Axis Milling",
          "Swiss Turning",
          "Wire EDM",
          "Custom Comp",
          "CAM Sim"
    ]
  },
  '/titanium-cnc-machining-services/3-5-axis-cnc-machining': {
    h1: 'High-Precision Titanium CNC Machining | 3-Axis · 4-Axis · 5-Axis',
    subtitle: 'High-precision CNC machining for difficult-to-cut titanium (TC4, TA2, TA15) — overcoming poor heat dissipation and severe work-hardening. From standard aerospace brackets to blisks and orthopedic implants, with full DFM assessment and custom production.',
    badge: 'Titanium CNC | AS9100D',

    keyMetrics: [
          {
                "value": "3/4/5-Axis",
                "label": "Full Coverage"
          },
          {
                "value": "Gr 5 / Gr 23 ELI",
                "label": "Alloy Range"
          },
          {
                "value": "±0.005mm",
                "label": "Tolerance"
          }
    ],
    entityChips: [
          "3-Axis VMC",
          "4-Axis (3+1)",
          "5-Axis Simultaneous",
          "Blisk & IBR",
          "Orthopedic Implants"
    ]
  },
  '/titanium-cnc-machining-services/cnc-milling-turning': {
    h1: 'CNC Milling & Turning Services',
    subtitle: 'Precision CNC turning, milling, and turn-mill multi-tasking for titanium: bone screws, prismatic components, complete single-setup parts. Tolerances ±0.005 mm.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "\u00b10.005mm",
                "label": "Tolerance"
          },
          {
                "value": "Cpk\u22651.67",
                "label": "Repeat"
          },
          {
                "value": "\u00f80.5mm",
                "label": "Micro"
          }
    ],
    entityChips: [
          "CNC Turning",
          "Multi-Tasking",
          "Swiss Lathe",
          "Bone Screws",
          "Prismatic"
    ]
  },
  '/titanium-cnc-machining-services/wire-edm-machining': {
    h1: 'Wire EDM Machining Services',
    subtitle: 'Precision wire EDM machining for titanium: zero mechanical stress, sharp internal corners (ø 0.1 mm wire), hardened alloy cutting, ±0.002 mm accuracy, Ra 0.25 µm finish.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "\u00b10.002mm",
                "label": "Accuracy"
          },
          {
                "value": "Ra0.25um",
                "label": "Finish"
          },
          {
                "value": "\u00f80.1mm",
                "label": "Wire"
          }
    ],
    entityChips: [
          "Wire EDM",
          "Zero Stress",
          "Sharp Corners",
          "Hardened Alloys",
          "EDM Sinking"
    ]
  },
  '/titanium-cnc-machining-services/custom-industrial-components': {
    h1: 'Custom Industrial Components Services',
    subtitle: 'Custom titanium industrial components: complex structural assemblies, high-vacuum chambers, fluid manifolds, and precision micro-components. AS9100D quality.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "AS9100D",
                "label": "Quality"
          },
          {
                "value": "Complex",
                "label": "Assemblies"
          },
          {
                "value": "Hi-Vac",
                "label": "Chambers"
          }
    ],
    entityChips: [
          "Structural",
          "Fluid Manifolds",
          "Vacuum",
          "Micro-Components",
          "Custom Alloys"
    ]
  },
  '/titanium-additive-manufacturing': {
    h1: 'Titanium Additive Manufacturing Services',
    subtitle: 'Industrial titanium additive manufacturing: SLM/DMLS 3D printing, rapid prototyping in 3-5 days, low-volume production. Full-density Ti-6Al-4V, ASTM F2924, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "3",
                "label": "Additive"
          },
          {
                "value": "\u226599.5%",
                "label": "Density"
          },
          {
                "value": "3-5D",
                "label": "Proto"
          }
    ],
    entityChips: [
          "SLM/DMLS",
          "Rapid Proto",
          "Low-Volume",
          "Ti-6Al-4V",
          "ASTM F2924"
    ]
  },
  '/titanium-additive-manufacturing/3d-printing-slm': {
    h1: '3D Printing Services',
    subtitle: 'Industrial SLM/DMLS 3D printing for titanium: Yb-fiber laser, 20-60 µm layer thickness, ≥99.5% density, 950-1,050 MPa tensile strength. ASTM F2924, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "\u226599.5%",
                "label": "Density"
          },
          {
                "value": "20-60um",
                "label": "Layer"
          },
          {
                "value": "950MPa",
                "label": "Tensile"
          }
    ],
    entityChips: [
          "SLM/DMLS",
          "Yb-Fiber Laser",
          "Ti-6Al-4V",
          "ASTM F2924",
          "Support-Free"
    ]
  },
  '/titanium-additive-manufacturing/rapid-prototyping': {
    h1: 'Rapid Prototyping Services',
    subtitle: 'Titanium rapid prototyping via SLM: 3-5 day lead time, single-unit MOQ, ≥99.5% density, 950-1,050 MPa tensile strength. Zero tooling cost design iterations.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "3-5D",
                "label": "Lead"
          },
          {
                "value": "\u226599.5%",
                "label": "Density"
          },
          {
                "value": "Zero",
                "label": "Tooling"
          }
    ],
    entityChips: [
          "Rapid Proto",
          "Design Iterations",
          "Single-Unit",
          "SLM Tech",
          "DFAM"
    ]
  },
  '/titanium-additive-manufacturing/low-volume-production': {
    h1: 'Low-Volume Production Services',
    subtitle: 'Low-volume titanium production via SLM: 10-1,000+ unit batches, zero tooling costs, ≥95% material utilization, multi-laser sync, SPC witness bar validation. AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "10-1k+",
                "label": "Units"
          },
          {
                "value": "\u226595%",
                "label": "Util"
          },
          {
                "value": "Zero",
                "label": "Tooling"
          }
    ],
    entityChips: [
          "Low-Volume",
          "SPC",
          "Multi-Laser",
          "2-4Week",
          "AS9100D"
    ]
  },
  '/titanium-fabrication-services': {
    h1: 'Titanium Fabrication Services',
    subtitle: 'Precision titanium fabrication: TIG/laser welding with full argon purge, CNC sheet metal profiling, industrial vessels and piping. AWS D1.6, ASME Sec IX, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "3",
                "label": "Fab"
          },
          {
                "value": "AWS D1.6",
                "label": "Weld"
          },
          {
                "value": "AS9100D",
                "label": "Cert"
          }
    ],
    entityChips: [
          "Laser Cutting",
          "Waterjet",
          "TIG Welding",
          "Assembly",
          "Profiling"
    ]
  },
  '/titanium-fabrication-services/laser-cutting': {
    h1: 'Laser Cutting Services',
    subtitle: 'Precision fiber laser cutting for titanium sheets and tubes: 3,000 x 1,500 mm sheet capacity, ø 20-220 mm tube, ±0.03 mm accuracy, 0.1 mm kerf, weld-ready edges.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "\u00b10.03mm",
                "label": "Acc"
          },
          {
                "value": "1500x3000",
                "label": "Sheet"
          },
          {
                "value": "0.1mm",
                "label": "Kerf"
          }
    ],
    entityChips: [
          "Fiber Laser",
          "Sheet Metal",
          "Tube Cutting",
          "Weld-Ready"
    ]
  },
  '/titanium-fabrication-services/waterjet-cutting': {
    h1: 'Waterjet Cutting Services',
    subtitle: 'Precision abrasive waterjet cutting for titanium: 60,000 PSI, 120 mm thickness capacity, 3,000 x 2,000 mm bed, ±0.05 mm angular repeatability, zero HAZ.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "60kPSI",
                "label": "Press"
          },
          {
                "value": "120mm",
                "label": "Thick"
          },
          {
                "value": "No HAZ",
                "label": "Heat"
          }
    ],
    entityChips: [
          "Abrasive WJ",
          "Thick Plate",
          "Complex",
          "Cold Cutting"
    ]
  },
  '/titanium-fabrication-services/titanium-welding-assembly': {
    h1: 'Titanium Welding & Assembly Services',
    subtitle: 'Precision titanium welding and assembly: ultra-pure TIG, laser welding, multi-component system assembly with anti-galling and CMM verification. AWS D1.6, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "AWS D1.6",
                "label": "Std"
          },
          {
                "value": "AS9100D",
                "label": "Cert"
          },
          {
                "value": "Full Ar",
                "label": "Purge"
          }
    ],
    entityChips: [
          "TIG Welding",
          "Laser Welding",
          "Assembly",
          "Anti-Galling"
    ]
  },
  '/titanium-forming-heavy-manufacturing': {
    h1: 'Titanium Forming & Heavy Manufacturing Services',
    subtitle: 'Heavy titanium forming and manufacturing: hot plate rolling, open/closed-die forging, large-scale assembly. 12,000 x 4,500 x 4,000 mm capacity, 50+ mm hot forming, 30 ton crane, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "4",
                "label": "Forming"
          },
          {
                "value": "8kMT",
                "label": "Press"
          },
          {
                "value": "12m",
                "label": "Length"
          }
    ],
    entityChips: [
          "Forging",
          "Extrusion",
          "Hot Rolling",
          "Plate Forming",
          "AS9100D"
    ]
  },
  '/titanium-forming-heavy-manufacturing/titanium-forging': {
    h1: 'Titanium Forging Services',
    subtitle: 'Precision titanium forging: closed-die, open-die, and seamless rolled ring forging. 8,000 metric ton press, ø 2,500 mm rings, AMS 2631 Class AA, ≥95% equiaxed α+β.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "8kMT",
                "label": "Press"
          },
          {
                "value": "2.5m",
                "label": "Ring"
          },
          {
                "value": "95%",
                "label": "Eqx"
          }
    ],
    entityChips: [
          "Closed-Die",
          "Open-Die",
          "Seamless Rings",
          "AMS 2631"
    ]
  },
  '/titanium-forming-heavy-manufacturing/titanium-extrusion': {
    h1: 'Titanium Extrusion Services',
    subtitle: 'Precision titanium extrusion: complex structural profiles, seamless heavy-wall tubes, multi-channel hollow shapes. 6,000 ton press, 12 m length, ø 350 mm envelope, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "6kT",
                "label": "Press"
          },
          {
                "value": "12m",
                "label": "Length"
          },
          {
                "value": "350mm",
                "label": "Envelope"
          }
    ],
    entityChips: [
          "Profile Extrusion",
          "Seamless Tubes",
          "Hollow Shapes",
          "AS9100D"
    ]
  },
  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing': {
    h1: 'Raw Material Preparation & Sizing Services',
    subtitle: 'Titanium raw material preparation: heavy-duty CNC band sawing up to ø 800 mm, mechanical surface peeling, chemical decontamination. PMI validated, AS9100D.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "800mm",
                "label": "Saw"
          },
          {
                "value": "PMI",
                "label": "Valid"
          },
          {
                "value": "AS9100D",
                "label": "Comp"
          }
    ],
    entityChips: [
          "CNC Band Saw",
          "Surface Peel",
          "Chemical Decon",
          "MTR"
    ]
  },
  '/titanium-surface-treatment': {
    h1: 'Titanium Surface Treatment Services',
    subtitle: 'Precision titanium surface treatment services: anodizing, micro-arc oxidation (MAO), acid pickling & passivation. AMS 2488, ASTM F86 certified surface engineering.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "3",
                "label": "Treatments"
          },
          {
                "value": "AMS 2488",
                "label": "Anodize"
          },
          {
                "value": "",
                "label": "Medical"
          }
    ],
    entityChips: [
          "Anodizing",
          "Passivation",
          "Micro-Arc",
          "Sandblasting",
          "AMS 2488"
    ]
  },
  '/titanium-surface-treatment/anodizing': {
    h1: 'Anodizing Services',
    subtitle: 'Precision titanium anodizing services: AMS 2488 Type II anti-galling anodizing, Type III pigment-free color coding, and high-purity acid pre-treatment. , AMS 2488D certified.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "AMS 2488",
                "label": "Type II/III"
          },
          {
                "value": "Anti-Gall",
                "label": "Coat"
          },
          {
                "value": "Color",
                "label": "Option"
          }
    ],
    entityChips: [
          "Anodizing",
          "MAO",
          "AMS 2488D",
          "Wear Resist"
    ]
  },
  '/titanium-surface-treatment/chemical-passivation': {
    h1: 'Chemical Passivation Services',
    subtitle: 'Precision titanium chemical passivation services: nitric acid passivation, citric acid biocompatible lines, HF-HNO3 acid pickling. ASTM F86, ASTM A967, AMS 2700 certified.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "ASTM F86",
                "label": "Std"
          },
          {
                "value": "Nitric",
                "label": "Acid"
          },
          {
                "value": "BioComp",
                "label": "Grade"
          }
    ],
    entityChips: [
          "Passivation",
          "Acid Pickling",
          "Nitric Acid",
          "Citric Acid"
    ]
  },
  '/titanium-surface-treatment/polishing-sandblasting': {
    h1: 'Polishing & Sandblasting Services',
    subtitle: 'Precision titanium mechanical finishing: multi-stage mirror polishing down to Ra 0.01 µm and engineered abrasive sandblasting for medical-grade anchor pore grids. Zero-contamination certified.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "Ra0.01",
                "label": "Mirror"
          },
          {
                "value": "Medical",
                "label": "Grade"
          },
          {
                "value": "Zero-Cont",
                "label": "Cert"
          }
    ],
    entityChips: [
          "Mirror Polish",
          "Abrasive",
          "Anchor Grids",
          "Medical Grade"
    ]
  },
  '/laser-marking-custom-logo': {
    h1: 'Laser Marking & Custom Logo Services',
    subtitle: 'Precision titanium laser marking services: laser annealing, deep engraving, UID/DataMatrix serialization. MIL-STD-130, UDI compliant, ≤0.01 mm beam precision.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "MIL-STD-130",
                "label": "Std"
          },
          {
                "value": "\u22640.01mm",
                "label": "Beam"
          },
          {
                "value": "UDI",
                "label": "Comp"
          }
    ],
    entityChips: [
          "Laser Anneal",
          "Deep Engrave",
          "DataMatrix",
          "UID",
          "Track"
    ]
  },
  '/branded-custom-packaging-services': {
    h1: 'Branded & Custom Packaging Services',
    subtitle: 'End-to-end titanium logistics and structural asset protection solutions: CNC foam milling, VCI marine corrosion barriers, ISPM-15 export crating. ISTA 2A/3A certified, ERP-linked traceability.',
    badge: 'Industrial Logistics Protection',

    keyMetrics: [
          {
                "value": "ISTA 2A",
                "label": "Cert"
          },
          {
                "value": "ERP",
                "label": "Trace"
          },
          {
                "value": "VCI",
                "label": "Corr"
          }
    ],
    entityChips: [
          "CNC Foam",
          "VCI Barriers",
          "ISPM-15",
          "Corr Protect"
    ]
  },
  '/capabilities/manufacturing': {
    h1: 'Advanced Titanium Manufacturing Capabilities & Infrastructure',
    subtitle: 'Scalable, certified precision manufacturing delivering micron-level tolerances, multi-axis geometry, and 100% material traceability for aerospace, medical, and defense applications.',
    badge: 'Precision Manufacturing Infrastructure',

    keyMetrics: [
          {
                "value": "\u00b10.005mm",
                "label": "Tolerance"
          },
          {
                "value": "Ra 0.4um",
                "label": "Finish"
          },
          {
                "value": "1200mm",
                "label": "Max Size"
          }
    ],
    entityChips: [
          "5-Axis CNC Milling",
          "Swiss Lathe Turning",
          "Wire EDM",
          "Ti-6Al-4V",
          "Grade 23"
    ]
  },
  '/capabilities/engineering': {
    h1: 'Front-End Engineering Support & DFM Optimization for Titanium',
    subtitle: 'Bridge the gap between complex aerospace/medical designs and flawless physical execution. Our expert engineering team provides rigorous Design for Manufacturing (DFM) reviews, custom toolpath simulation, and metallurgical consultation to de-risk your titanium supply chain and optimize unit costs.',
    badge: 'Engineering & DFM Services',

    keyMetrics: [
          {
                "value": "24-48Hr",
                "label": "DFM Review"
          },
          {
                "value": "15-25%",
                "label": "Cycle Red"
          },
          {
                "value": "<3:1",
                "label": "Buy-Fly"
          }
    ],
    entityChips: [
          "DFM Review",
          "Mastercam Sim",
          "Value Engineering",
          "GD&T",
          "FEA"
    ]
  },
  '/capabilities/capacity': {
    h1: 'Scalable Titanium Production Capacity & Supply Chain Certainty',
    subtitle: 'From high-mix low-volume medical prototypes to high-volume aerospace contract manufacturing. Armed with advanced multi-axis CNC machine clusters and 24/7 automated "lights-out" shifts, we deliver over 45,000 precision titanium components annually with guaranteed lead-time stability.',
    badge: 'Production Capacity & Scaling',

    keyMetrics: [
          {
                "value": "45,000+",
                "label": "Parts/Yr"
          },
          {
                "value": "8,500+",
                "label": "Hrs/Mo"
          },
          {
                "value": "35+",
                "label": "CNC Units"
          },
          {
                "value": "24/7",
                "label": "Lights-Out"
          }
    ],
    entityChips: [
          "High-Volume",
          "Multi-Pallet",
          "Rapid Proto",
          "Resilience"
    ]
  },
  '/capabilities/quality': {
    h1: 'Certified Quality Assurance & Titanium Traceability Infrastructure',
    subtitle: 'Operating under a zero-defect quality philosophy. From raw titanium sponge verification via EN 10204 3.1 MTRs to multi-axis CMM dimensional validation, our precision infrastructure is strictly aligned with AS9100D and  standards to guarantee mission-critical compliance.',
    badge: 'Quality & Compliance',

    keyMetrics: [
          {
                "value": "\u00b10.0015mm",
                "label": "CMM Acc"
          },
          {
                "value": "100%",
                "label": "MTR"
          },
          {
                "value": "99.9%",
                "label": "On-Time"
          }
    ],
    entityChips: [
          "AS9100D",
          "",
          "EN 10204 3.1",
          "FAIR",
          "SPC"
    ]
  },
  '/capabilities/inspection': {
    h1: 'Titanium Metrology, Inspection & Testing Infrastructure',
    subtitle: 'Fully equipped in-house metrology laboratory with CMM, OES spectrometry, optical comparators, surface profilometry, and NDT capabilities — all calibrated per ISO 17025 traceable standards for aerospace and medical titanium components.',
    badge: 'Inspection & Testing',

    keyMetrics: [
          {
                "value": "\u00b11.9um",
                "label": "CMM"
          },
          {
                "value": "<30s",
                "label": "OES"
          },
          {
                "value": "Ra 0.2um",
                "label": "Roughness"
          }
    ],
    entityChips: [
          "ZEISS CMM",
          "XRF",
          "FPI/UT",
          "Optical Comp",
          "ISO 17025"
    ]
  },
  '/capabilities/traceability': {
    h1: 'Non-Compromised Titanium Material Traceability & Compliance',
    subtitle: 'De-risking your high-liability applications with an unbroken digital chain of custody. Operating in strict accordance with AS9100D and DFARS compliance, BOZE guarantees 100% material provenance tracking — from raw ingot heat lots to permanently marked, finished multi-axis CNC components.',
    badge: 'Material Traceability',

    keyMetrics: [
          {
                "value": "100%",
                "label": "EN 10204"
          },
          {
                "value": "10+Yrs",
                "label": "Archival"
          },
          {
                "value": "24Hr",
                "label": "Audit"
          }
    ],
    entityChips: [
          "DFARS",
          "Heat Lot",
          "PMI",
          "Laser Marked",
          "Chain of Custody"
    ]
  },
  '/capabilities/certifications': {
    h1: 'Global Manufacturing Certifications & Compliance Framework',
    subtitle: 'Our production infrastructure operates under a highly audited, internationally recognized quality management system. Validated by world-leading registrars, BOZE aerospace-grade and medical-grade manufacturing certifications guarantee that every machined titanium component adheres to uncompromising regulatory and safety parameters.',
    badge: 'Certifications & Compliance',

    keyMetrics: [
          {
                "value": "3",
                "label": "Active"
          },
          {
                "value": "Annual",
                "label": "Audits"
          },
          {
                "value": "SGS/TUV",
                "label": "Registrars"
          }
    ],
    entityChips: [
          "AS9100D",
          "",
          "ISO 9001",
          "Nadcap",
          "CAPA"
    ]
  },
  '/about': {
    h1: 'About Boze Titanium Manufacturing Center',
    subtitle: 'Mastering One Metal to Serve the World\'s Most Demanding Industries — from precision titanium CNC machining to OEM/ODM customization.',
    badge: 'Our Story',

    keyMetrics: [
          {
                "value": "500+",
                "label": "Clients"
          },
          {
                "value": "15+",
                "label": "Years"
          },
          {
                "value": "3",
                "label": "Certs"
          }
    ],
    entityChips: [
          "AS9100D",
          "",
          "ISO 9001",
          "OEM/ODM",
          "Global Supply Chain"
    ]
  },
  '/industries/aerospace': {
    h1: 'Aerospace Titanium CNC Machining Services',
    subtitle: 'Precision AS9100D aligned manufacturing specializing in multi-axis titanium machining for high-fatigue aviation hardware. Full material traceability with EN 10204 3.1 Mill Test Reports, AS9102 First Article Inspection, and CMM dimensional validation per ASME Y14.5 GD&T.',
    badge: 'Aerospace & Defense',

    keyMetrics: [
          {
                "value": "AS9100D",
                "label": "Cert"
          },
          {
                "value": "5-Axis",
                "label": "CNC"
          },
          {
                "value": "100%",
                "label": "MTR"
          }
    ],
    entityChips: [
          "AS9100D",
          "5-Axis CNC",
          "Grade 5 Ti",
          "EN 10204 3.1",
          "FAIR"
    ]
  },
  '/industries/medical': {
    h1: 'Medical Grade Titanium CNC Machining Services',
    subtitle: ' certified manufacturing delivering biocompatible, high-precision titanium micro-components and orthopedic implants. Specializing in Swiss CNC turning for bone screws and dental abutments with zero-contamination ultrasonic cleaning lifecycle.',
    badge: 'Medical Devices',

    keyMetrics: [
          {
                "value": "",
                "label": "Cert"
          },
          {
                "value": "\u22640.4um",
                "label": "Ra Surf"
          },
          {
                "value": "Zero",
                "label": "Contam"
          }
    ],
    entityChips: [
          "",
          "Swiss Turning",
          "Grade 23 ELI",
          "Ultrasonic Clean",
          "MTR Tracing"
    ]
  },
  '/industries/uav-drones': {
    h1: 'Lightweight Titanium CNC Machining for UAVs & Drones',
    subtitle: 'High strength-to-weight ratio precision titanium component manufacturing engineered to optimize drone flight endurance, payload capacity, and impact resistance. Specializing in 5-axis thin-wall milling and dynamic balanced structural hardware.',
    badge: 'UAV & Drones',

    keyMetrics: [
          {
                "value": "\u22650.5mm",
                "label": "Wall"
          },
          {
                "value": "35%",
                "label": "Weight"
          },
          {
                "value": "\u00b10.005mm",
                "label": "Balance"
          }
    ],
    entityChips: [
          "5-Axis CNC",
          "Grade 5 Ti",
          "Lightweight",
          "Gimbal Mounts",
          "Dynamic Balance"
    ]
  },
  '/industries/ai-infrastructure': {
    h1: 'Precision Titanium Machining for AI Infrastructure & Optical Communications',
    subtitle: 'High-precision custom titanium component manufacturing engineered to eliminate thermal drift, prevent liquid cooling leakage, and deliver absolute EMI shielding for high-density compute nodes and 800G/1.6T optical transceivers.',
    badge: 'AI & Optical Comms',

    keyMetrics: [
          {
                "value": "\u22640.4mm",
                "label": "Wall"
          },
          {
                "value": "EMI",
                "label": "Shield"
          },
          {
                "value": "Zero",
                "label": "Leak"
          }
    ],
    entityChips: [
          "800G/1.6T",
          "Thin-Wall EMI",
          "Liq Cooling",
          "Thermal Drift",
          "CMM GD&T"
    ]
  },
  '/industries/marine': {
    h1: 'Corrosion-Resistant Titanium CNC Machining for Marine & Subsea Engineering',
    subtitle: 'Custom precision titanium component manufacturing designed to survive extreme hydrostatic pressure, eliminate chloride pitting, and stop crevice corrosion in deep-sea oceanographic applications. Grade 2 and Grade 12 specialty titanium alloys.',
    badge: 'Marine & Subsea',

    keyMetrics: [
          {
                "value": "Grade 12",
                "label": "Alloy"
          },
          {
                "value": "\u22640.4um",
                "label": "Ra Seal"
          },
          {
                "value": "\u00b10.01mm",
                "label": "Position"
          }
    ],
    entityChips: [
          "Grade 12 Ti",
          "Subsea Enclosures",
          "Crevice Corrosion",
          "Pressure Test",
          "CMM GD&T"
    ]
  },
  '/industries/semiconductor': {
    h1: 'Ultra-Precision Titanium CNC Machining for Semiconductor Equipment',
    subtitle: 'Sub-micron precision custom titanium component manufacturing engineered for Ultra-High Vacuum (UHV) compatibility, zero outgassing, and absolute particle contamination control in front-end wafer fabrication processes.',
    badge: 'Semiconductor',

    keyMetrics: [
          {
                "value": "\u22640.1um",
                "label": "Ra"
          },
          {
                "value": "10^-9",
                "label": "Torr"
          },
          {
                "value": "\u03c60.2mm",
                "label": "Hole"
          }
    ],
    entityChips: [
          "UHV Vacuum",
          "Zero Particles",
          "Mirror Finis",
          "Micro-Drilling",
          "Class 100"
    ]
  },
  '/industries/energy': {
    h1: 'Heavy-Duty Titanium CNC Machining for Energy & Power Infrastructure',
    subtitle: 'High-performance precision titanium component manufacturing engineered to survive hydrogen embrittlement, eliminate high-temperature creep, and deliver zero-leakage supercritical fluid sealing for nuclear SMR and hydrogen infrastructure.',
    badge: 'Energy & Power',

    keyMetrics: [
          {
                "value": "H \u22640.0125%",
                "label": "Embrittle"
          },
          {
                "value": "+300%",
                "label": "Fatigue"
          },
          {
                "value": "\u00b10.005mm",
                "label": "CRDM"
          }
    ],
    entityChips: [
          "H2 Embrittle",
          "Impeller",
          "Nuclear SMR",
          "Shot Peen",
          "Supercritical"
    ]
  },
  '/industries/industrial-equipment': {
    h1: 'Heavy-Duty Titanium CNC Machining for Industrial Equipment & Automation',
    subtitle: 'Precision custom titanium component manufacturing engineered to endure high-frequency cyclic loading, eliminate acoustic energy loss, and resist aggressive chemical cavitation for ultrasonic and fluid control hardware.',
    badge: 'Industrial Equipment',

    keyMetrics: [
          {
                "value": "20-40kHz",
                "label": "Resonance"
          },
          {
                "value": "\u22640.4um",
                "label": "Ra Flow"
          },
          {
                "value": "Grade 7",
                "label": "Pd Alloy"
          }
    ],
    entityChips: [
          "Sonotrode",
          "Grade 7 Ti-Pd",
          "Cavitation",
          "20-40kHz",
          "Cyclic Load"
    ]
  },
  '/products': {
    h1: 'Precision CNC Titanium Components Library',
    subtitle: 'Browse 260+ precision CNC machined titanium components across 60 engineering systems, 12 industries, and 20 alloys. Each component includes material grade, manufacturing process, inspection criteria, and engineering specifications.',
    badge: '260+ Components · 60 Systems · 12 Industries · 20 Materials',
    keyMetrics: [
      { "value": "260+", "label": "Components" },
      { "value": "60", "label": "Systems" },
      { "value": "12", "label": "Industries" },
      { "value": "20", "label": "Materials" }
    ],
    entityChips: [
      "Components",
      "Systems",
      "Materials",
      "Capabilities",
      "Industries"
    ]
  },
  // 2026-10-20 — /parts/ restructured to PROCUREMENT logic (not catalogue logic).
  // Method borrowed from competitor procurement-funnel sequencing; all facts below
  // are copied from src/data/parts.ts PARTS_LANDING (procurementSnapshot,
  // comparisonMatrix, workflowPipeline) and src/pages/capabilities/* — nothing invented.
  '/parts': {
    h1: 'Custom Titanium Parts Manufacturing',
    subtitle:
      'Factory-direct custom titanium parts from Baoji Titanium Valley — prototype through mid-volume production. Boze Titanium Manufacturing Center returns a DFM review with cost drivers and lead-time alignment within 24 hours, and a signed quotation within 48 hours of an approved DFM.',
    badge: 'Titanium Parts Procurement Gateway',

    keyMetrics: [
      {
        "value": "24h",
        "label": "DFM Review"
      },
      {
        "value": "48h",
        "label": "Signed Quotation"
      },
      {
        "value": "1 pc",
        "label": "Prototype MOQ"
      }
    ],
    entityChips: [
      "AS9100D",
      "ISO 9001",
      "EN 10204 3.1",
      "Gr1–Gr23",
      "5–50 / 50–500 Piece Lots"
    ]
  },
  // BSI 2026-10-13 — Grade 5 Ti-6Al-4V material-specific machining sub-page
  // (5-inbound #1: heroKey for /titanium-cnc-machining-services/grade-5-titanium-cnc-machining/)
  '/titanium-cnc-machining-services/grade-5-titanium-cnc-machining': {
    h1: 'Grade 5 Titanium CNC Machining Services — Ti-6Al-4V (UNS R56400)',
    subtitle:
      'Precision Ti-6Al-4V (Grade 5) components for aerospace, medical, and advanced industrial applications. Controlled cutting temperatures, thin-wall deformation management, and documented material traceability. AS9100D  controlled process, ±0.005 mm tolerance target, MTR supported.',
    badge: 'Grade 5 Ti-6Al-4V | AS9100D ',
    keyMetrics: [
      { value: '±0.005mm', label: 'Tolerance' },
      { value: 'Ra 0.8μm', label: 'Finish' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-6Al-4V', 'UNS R56400', 'AS9100D', '', 'MTR', '5-Axis'],
  },
  // BSI 2026-10-13 — Grade 23 Ti-6Al-4V ELI material-specific machining sub-page
  // (5-inbound #1: heroKey for /titanium-cnc-machining-services/grade-23-titanium-cnc-machining/)
  '/titanium-cnc-machining-services/grade-23-titanium-cnc-machining': {
    h1: 'Grade 23 Titanium CNC Machining Services — Ti-6Al-4V ELI (UNS R56407)',
    subtitle:
      'Precision Ti-6Al-4V ELI (Grade 23) components for orthopedic, spinal, dental, and surgical-instrument applications. ASTM F136 / ISO 5832-3 controlled process with ELI interstitial verification, ASTM F86 surface preparation, and sterilization-compatible finishing. ±0.005 mm tolerance target on validated micro-features.',
    badge: 'Grade 23 Ti-6Al-4V ELI | ASTM F136 ',
    keyMetrics: [
      { value: '±0.005mm', label: 'Tolerance' },
      { value: 'ASTM F136', label: 'Standard' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-6Al-4V ELI', 'UNS R56407', 'ASTM F136', 'ISO 5832-3', '', 'ASTM F86'],
  },
  // BSI 2026-10-13 — Grade 2 CP-Ti material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-2-titanium-cnc-machining': {
    h1: 'Grade 2 Titanium CNC Machining Services — CP-Ti (UNS R50400)',
    subtitle:
      'Precision Grade 2 commercially pure titanium (CP-Ti) components for chemical processing, marine, biomedical, and desalination applications. ASTM B348 / B265 / B338 controlled process with ASTM B600 surface preparation, MTR-supported material traceability, and iron-contamination-controlled workflow.',
    badge: 'Grade 2 CP-Ti | ASTM B348 / ISO 9001',
    keyMetrics: [
      { value: '±0.025mm', label: 'Tolerance' },
      { value: 'CP-Ti', label: '99.2% Ti' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['CP-Ti', 'UNS R50400', 'ASTM B348', 'ASTM B265', 'ASTM B338', 'ASTM F67'],
  },
  // BSI 2026-10-13 — Grade 9 Ti-3Al-2.5V material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-9-titanium-cnc-machining': {
    h1: 'Grade 9 Titanium CNC Machining Services — Ti-3Al-2.5V (UNS R56320)',
    subtitle:
      'Precision Ti-3Al-2.5V (Grade 9) components for aerospace hydraulic tubing, high-pressure fluid systems, marine, and motorsport applications. AMS 4943 / 4944 / 4945 and ASTM B338 / B861 controlled process with MTR-supported traceability and fatigue-optimized surface integrity.',
    badge: 'Grade 9 Ti-3Al-2.5V | AMS 4943 / AS9100D',
    keyMetrics: [
      { value: '±0.01mm', label: 'Tube OD' },
      { value: 'AMS 4943', label: 'Standard' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-3Al-2.5V', 'UNS R56320', 'AMS 4943', 'ASTM B338', 'AS9100D', 'Aerospace'],
  },
  // BSI 2026-10-13 — Grade 4 CP-Ti material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-4-titanium-cnc-machining': {
    h1: 'Grade 4 Titanium CNC Machining Services — CP-Ti (UNS R50700)',
    subtitle:
      'Precision Grade 4 commercially pure titanium (CP-Ti, UNS R50700) components for chemical processing, marine, medical, and aerospace structural applications where higher strength than Grade 2 is needed. ASTM B348 / B265 / B338 controlled process with MTR-supported traceability and ASTM B600 surface preparation.',
    badge: 'Grade 4 CP-Ti | ASTM B348 / ISO 9001',
    keyMetrics: [
      { value: '±0.025mm', label: 'Tolerance' },
      { value: 'CP-Ti', label: 'High-O' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['CP-Ti', 'UNS R50700', 'ASTM B348', 'ASTM B265', 'ASTM B338', 'ASTM F67'],
  },
  // BSI 2026-10-13 — Grade 7 Ti-0.2Pd material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-7-titanium-cnc-machining': {
    h1: 'Grade 7 Titanium CNC Machining Services — Ti-0.2Pd (UNS R52400)',
    subtitle:
      'Precision Grade 7 palladium-stabilized titanium (Ti-0.2Pd, UNS R52400) components for chemical processing in reducing-acid environments (HCl, H2SO4, H3PO4, hot brine). ASTM B348 / B265 / B338 controlled process with MTR-supported Pd-content verification and ASTM B600 surface preparation.',
    badge: 'Grade 7 Ti-0.2Pd | ASTM B348 / Pd-stabilized',
    keyMetrics: [
      { value: '±0.025mm', label: 'Tolerance' },
      { value: 'Ti-0.2Pd', label: 'GR 7' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-0.2Pd', 'UNS R52400', 'ASTM B348', 'ASTM B338', 'ASTM F67', 'Reducing-Acid'],
  },
  // BSI 2026-10-13 — Grade 12 Ti-0.3Mo-0.8Ni material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-12-titanium-cnc-machining': {
    h1: 'Grade 12 Titanium CNC Machining Services — Ti-0.3Mo-0.8Ni (UNS R53400)',
    subtitle:
      'Precision Grade 12 "improved" titanium (Ti-0.3Mo-0.8Ni, UNS R53400) components for hot-brine, chloride, and chemical processing applications. ASTM B348 / B265 / B338 / B861 controlled process with MTR-supported Mo / Ni verification and ASTM B600 surface preparation.',
    badge: 'Grade 12 Ti-0.3Mo-0.8Ni | ASTM B348 / Improved CP-Ti',
    keyMetrics: [
      { value: '±0.025mm', label: 'Tolerance' },
      { value: 'Ti-Mo-Ni', label: 'GR 12' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-0.3Mo-0.8Ni', 'UNS R53400', 'ASTM B348', 'ASTM B338', 'ASTM B861', 'Hot-Brine'],
  },
  // BSI 2026-10-13 — Grade 21 Ti-15Mo-3Nb-3Al material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-21-titanium-cnc-machining': {
    h1: 'Grade 21 Titanium CNC Machining Services — Ti-15Mo-3Nb-3Al-0.2Si (UNS R58210)',
    subtitle:
      'Precision Grade 21 metastable beta titanium (Ti-15Mo-3Nb-3Al-0.2Si, UNS R58210) components for high-strength aerospace structural and fastener applications. AMS 4915 / 4917 / 4928 controlled process with MTR-supported traceability and coordinated solution-treat + age sequence.',
    badge: 'Grade 21 Ti-15Mo-3Nb-3Al | AMS 4915 / Beta Alloy',
    keyMetrics: [
      { value: '1100+ MPa', label: 'UTS' },
      { value: 'Beta', label: 'Heat-Treat' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-15Mo-3Nb-3Al', 'UNS R58210', 'AMS 4915', 'AMS 4928', 'Aerospace', 'Beta'],
  },
  // BSI 2026-10-13 — Grade 6 alpha-titanium material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-6-titanium-cnc-machining': {
    h1: 'Grade 6 Titanium CNC Machining Services — Ti-5Al-2.5Sn (UNS R54520)',
    subtitle:
      'Precision Grade 6 alpha titanium (Ti-5Al-2.5Sn, UNS R54520) components for high-temperature aerospace structures, jet-engine compressor components, and pressure vessels. AMS 4910 / 4925 / 4966 controlled process with MTR-supported traceability and ASTM B600 surface preparation for alpha-case removal.',
    badge: 'Grade 6 Ti-5Al-2.5Sn | AMS 4910 / Alpha Alloy',
    keyMetrics: [
      { value: '~895 MPa', label: 'UTS' },
      { value: '480 °C', label: 'Service' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-5Al-2.5Sn', 'UNS R54520', 'AMS 4910', 'AMS 4925', 'High-Temp', 'Alpha'],
  },
  // BSI 2026-10-13 — Grade 8 Pd-stabilized near-α material-specific machining sub-page
  '/titanium-cnc-machining-services/grade-8-titanium-cnc-machining': {
    h1: 'Grade 8 Titanium CNC Machining Services — Ti-3Al-2.5V + 0.05Pd (UNS R56323)',
    subtitle:
      'Precision Grade 8 palladium-stabilized near-alpha titanium (Ti-3Al-2.5V + 0.05Pd, UNS R56323) components for aerospace hydraulic tubing requiring both cold-formability and reducing-acid corrosion resistance. AMS 4943 / 4944 / 4945 controlled process with MTR-supported Pd verification.',
    badge: 'Grade 8 Ti-3Al-2.5V + 0.05Pd | AMS 4943 / Hydraulic',
    keyMetrics: [
      { value: '~620 MPa', label: 'UTS' },
      { value: 'Pd 0.05%', label: 'Stabilized' },
      { value: '1 piece', label: 'MOQ' },
      { value: '5–7 d', label: 'Prototype' },
    ],
    entityChips: ['Ti-3Al-2.5V + 0.05Pd', 'UNS R56323', 'AMS 4943', 'AMS 4944', 'Reducing-Acid', 'Hydraulic'],
  },
};