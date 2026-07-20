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
                "value": "6",
                "label": "Service Pillars"
          },
          {
                "value": "35+",
                "label": "CNC Machines"
          },
          {
                "value": "3",
                "label": "Quality Certs"
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
                "value": "ISO 13485",
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
    h1: 'Our Blog',
    subtitle: 'Technical guides, industry trends, and company news from the forefront of precision CNC titanium manufacturing.',
    badge: 'Insights & Updates',
  },
  '/documentation': {
    h1: 'Documentation Center',
    subtitle: 'Access comprehensive guides, technical documentation, compliance certificates, and resources to optimize your Titanium CNC Machining operations.',
    badge: 'Comprehensive Resource Center',
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
    h1: '3/5-Axis CNC Machining Services',
    subtitle: 'Precision 3/4-axis and simultaneous 5-axis CNC machining for titanium: complex geometries, single-setup accuracy, aerospace-grade tolerances ±0.005 mm.',
    badge: 'Precision Manufacturing',

    keyMetrics: [
          {
                "value": "3/4/5-Axis",
                "label": "Simultaneous"
          },
          {
                "value": "\u00b10.005mm",
                "label": "Tolerance"
          },
          {
                "value": "HSK-A63",
                "label": "Spindle"
          }
    ],
    entityChips: [
          "5-Axis Milling",
          "3-Axis Milling",
          "HSK Tooling",
          "CAM Sim",
          "In-Process"
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
    subtitle: 'Precision titanium surface treatment services: anodizing, micro-arc oxidation (MAO), acid pickling & passivation. AMS 2488, ISO 13485, ASTM F86 certified surface engineering.',
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
                "value": "ISO 13485",
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
    subtitle: 'Precision titanium anodizing services: AMS 2488 Type II anti-galling anodizing, Type III pigment-free color coding, and high-purity acid pre-treatment. ISO 13485, AMS 2488D certified.',
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
    subtitle: 'Operating under a zero-defect quality philosophy. From raw titanium sponge verification via EN 10204 3.1 MTRs to multi-axis CMM dimensional validation, our precision infrastructure is strictly aligned with AS9100D and ISO 13485 standards to guarantee mission-critical compliance.',
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
          "ISO 13485",
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
          "ISO 13485",
          "ISO 9001",
          "Nadcap",
          "CAPA"
    ]
  },
  '/about': {
    h1: 'About BOZE CNC-Ti',
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
          "ISO 13485",
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
    subtitle: 'ISO 13485:2016 certified manufacturing delivering biocompatible, high-precision titanium micro-components and orthopedic implants. Specializing in Swiss CNC turning for bone screws and dental abutments with zero-contamination ultrasonic cleaning lifecycle.',
    badge: 'Medical Devices',

    keyMetrics: [
          {
                "value": "ISO 13485",
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
          "ISO 13485:2016",
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
};