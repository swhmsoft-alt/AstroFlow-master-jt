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
  },
  '/materials': {
    h1: 'Titanium Materials Engineering Guide',
    subtitle: 'Comprehensive technical reference for procurement engineers — from Grade 1 CP-Titanium to Grade 5 ELI medical-grade alloys. Every grade documented with certified properties and application guidance.',
    badge: 'Metallurgy & Alloys',
  },
  '/capabilities': {
    h1: 'Technical Capabilities',
    subtitle: 'Certified precision manufacturing infrastructure — from micron-level CNC tolerancing to full material traceability. A detailed technical reference for procurement and engineering teams.',
    badge: 'Manufacturing Engineering Data Sheet',
  },
  '/industries': {
    h1: 'Industry Solutions',
    subtitle: 'Engineered titanium solutions for the world\'s most demanding industries — from aerospace structural components to AI infrastructure thermal management systems.',
    badge: 'Precision Manufacturing Verticals',
  },
  '/resources': {
    h1: 'Technical Resources Library',
    subtitle: 'Comprehensive technical documentation, engineering guides, whitepapers, and downloadable CAD resources — an open library for titanium manufacturing professionals.',
    badge: 'Engineering Knowledge Base',
  },
  '/products': {
    h1: 'Our Products',
    subtitle: 'High-precision CNC machined components for aerospace, medical, automotive, and industrial applications. Certified quality, global delivery.',
    badge: 'Precision Manufacturing',
  },
  '/rfq': {
    h1: 'Request a Quote',
    subtitle: 'Submit your engineering RFQ for titanium CNC machining, additive manufacturing, fabrication, or surface treatment. Get a formal quote within 24-48 hours. Secure CAD upload.',
    badge: 'Engineering Procurement',
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
  },
  '/equipment': {
    h1: 'CNC Manufacturing Equipment Inventory',
    subtitle: 'Comprehensive equipment specification sheets for our complete titanium CNC manufacturing facility — from 5-axis machining centers and multi-tasking turn-mill machines to CMM inspection, heat treatment, and automated pallet systems.',
    badge: 'Manufacturing Equipment Specification Sheet',
  },
  // --- Services Sub-pages ---
  '/titanium-cnc-machining-services': {
    h1: 'Titanium CNC Machining Services',
    subtitle: 'End-to-end titanium CNC machining solutions — from rapid prototyping to high-volume production — across 3/5-axis milling, turning, wire EDM, and custom industrial components.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-cnc-machining-services/3-5-axis-cnc-machining': {
    h1: '3/5-Axis CNC Machining Services',
    subtitle: 'Precision 3/4-axis and simultaneous 5-axis CNC machining for titanium: complex geometries, single-setup accuracy, aerospace-grade tolerances ±0.005 mm.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-cnc-machining-services/cnc-milling-turning': {
    h1: 'CNC Milling & Turning Services',
    subtitle: 'Precision CNC turning, milling, and turn-mill multi-tasking for titanium: bone screws, prismatic components, complete single-setup parts. Tolerances ±0.005 mm.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-cnc-machining-services/wire-edm-machining': {
    h1: 'Wire EDM Machining Services',
    subtitle: 'Precision wire EDM machining for titanium: zero mechanical stress, sharp internal corners (ø 0.1 mm wire), hardened alloy cutting, ±0.002 mm accuracy, Ra 0.25 µm finish.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-cnc-machining-services/custom-industrial-components': {
    h1: 'Custom Industrial Components Services',
    subtitle: 'Custom titanium industrial components: complex structural assemblies, high-vacuum chambers, fluid manifolds, and precision micro-components. AS9100D quality.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-additive-manufacturing': {
    h1: 'Titanium Additive Manufacturing Services',
    subtitle: 'Industrial titanium additive manufacturing: SLM/DMLS 3D printing, rapid prototyping in 3-5 days, low-volume production. Full-density Ti-6Al-4V, ASTM F2924, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-additive-manufacturing/3d-printing-slm': {
    h1: '3D Printing Services',
    subtitle: 'Industrial SLM/DMLS 3D printing for titanium: Yb-fiber laser, 20-60 µm layer thickness, ≥99.5% density, 950-1,050 MPa tensile strength. ASTM F2924, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-additive-manufacturing/rapid-prototyping': {
    h1: 'Rapid Prototyping Services',
    subtitle: 'Titanium rapid prototyping via SLM: 3-5 day lead time, single-unit MOQ, ≥99.5% density, 950-1,050 MPa tensile strength. Zero tooling cost design iterations.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-additive-manufacturing/low-volume-production': {
    h1: 'Low-Volume Production Services',
    subtitle: 'Low-volume titanium production via SLM: 10-1,000+ unit batches, zero tooling costs, ≥95% material utilization, multi-laser sync, SPC witness bar validation. AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-fabrication-services': {
    h1: 'Titanium Fabrication Services',
    subtitle: 'Precision titanium fabrication: TIG/laser welding with full argon purge, CNC sheet metal profiling, industrial vessels and piping. AWS D1.6, ASME Sec IX, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-fabrication-services/laser-cutting': {
    h1: 'Laser Cutting Services',
    subtitle: 'Precision fiber laser cutting for titanium sheets and tubes: 3,000 x 1,500 mm sheet capacity, ø 20-220 mm tube, ±0.03 mm accuracy, 0.1 mm kerf, weld-ready edges.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-fabrication-services/waterjet-cutting': {
    h1: 'Waterjet Cutting Services',
    subtitle: 'Precision abrasive waterjet cutting for titanium: 60,000 PSI, 120 mm thickness capacity, 3,000 x 2,000 mm bed, ±0.05 mm angular repeatability, zero HAZ.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-fabrication-services/titanium-welding-assembly': {
    h1: 'Titanium Welding & Assembly Services',
    subtitle: 'Precision titanium welding and assembly: ultra-pure TIG, laser welding, multi-component system assembly with anti-galling and CMM verification. AWS D1.6, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-forming-heavy-manufacturing': {
    h1: 'Titanium Forming & Heavy Manufacturing Services',
    subtitle: 'Heavy titanium forming and manufacturing: hot plate rolling, open/closed-die forging, large-scale assembly. 12,000 x 4,500 x 4,000 mm capacity, 50+ mm hot forming, 30 ton crane, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-forming-heavy-manufacturing/titanium-forging': {
    h1: 'Titanium Forging Services',
    subtitle: 'Precision titanium forging: closed-die, open-die, and seamless rolled ring forging. 8,000 metric ton press, ø 2,500 mm rings, AMS 2631 Class AA, ≥95% equiaxed α+β.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-forming-heavy-manufacturing/titanium-extrusion': {
    h1: 'Titanium Extrusion Services',
    subtitle: 'Precision titanium extrusion: complex structural profiles, seamless heavy-wall tubes, multi-channel hollow shapes. 6,000 ton press, 12 m length, ø 350 mm envelope, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing': {
    h1: 'Raw Material Preparation & Sizing Services',
    subtitle: 'Titanium raw material preparation: heavy-duty CNC band sawing up to ø 800 mm, mechanical surface peeling, chemical decontamination. PMI validated, AS9100D.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-surface-treatment': {
    h1: 'Titanium Surface Treatment Services',
    subtitle: 'Precision titanium surface treatment services: anodizing, micro-arc oxidation (MAO), acid pickling & passivation. AMS 2488, ISO 13485, ASTM F86 certified surface engineering.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-surface-treatment/anodizing': {
    h1: 'Anodizing Services',
    subtitle: 'Precision titanium anodizing services: AMS 2488 Type II anti-galling anodizing, Type III pigment-free color coding, and high-purity acid pre-treatment. ISO 13485, AMS 2488D certified.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-surface-treatment/chemical-passivation': {
    h1: 'Chemical Passivation Services',
    subtitle: 'Precision titanium chemical passivation services: nitric acid passivation, citric acid biocompatible lines, HF-HNO3 acid pickling. ASTM F86, ASTM A967, AMS 2700 certified.',
    badge: 'Precision Manufacturing',
  },
  '/titanium-surface-treatment/polishing-sandblasting': {
    h1: 'Polishing & Sandblasting Services',
    subtitle: 'Precision titanium mechanical finishing: multi-stage mirror polishing down to Ra 0.01 µm and engineered abrasive sandblasting for medical-grade anchor pore grids. Zero-contamination certified.',
    badge: 'Precision Manufacturing',
  },
  '/laser-marking-custom-logo': {
    h1: 'Laser Marking & Custom Logo Services',
    subtitle: 'Precision titanium laser marking services: laser annealing, deep engraving, UID/DataMatrix serialization. MIL-STD-130, UDI compliant, ≤0.01 mm beam precision.',
    badge: 'Precision Manufacturing',
  },
  '/branded-custom-packaging-services': {
    h1: 'Branded & Custom Packaging Services',
    subtitle: 'End-to-end titanium logistics and structural asset protection solutions: CNC foam milling, VCI marine corrosion barriers, ISPM-15 export crating. ISTA 2A/3A certified, ERP-linked traceability.',
    badge: 'Industrial Logistics Protection',
  },
  '/capabilities/manufacturing': {
    h1: 'Advanced Titanium Manufacturing Capabilities & Infrastructure',
    subtitle: 'Scalable, certified precision manufacturing delivering micron-level tolerances, multi-axis geometry, and 100% material traceability for aerospace, medical, and defense applications.',
    badge: 'Precision Manufacturing Infrastructure',
  },
  '/capabilities/engineering': {
    h1: 'Front-End Engineering Support & DFM Optimization for Titanium',
    subtitle: 'Bridge the gap between complex aerospace/medical designs and flawless physical execution. Our expert engineering team provides rigorous Design for Manufacturing (DFM) reviews, custom toolpath simulation, and metallurgical consultation to de-risk your titanium supply chain and optimize unit costs.',
    badge: 'Engineering & DFM Services',
  },
  '/capabilities/capacity': {
    h1: 'Scalable Titanium Production Capacity & Supply Chain Certainty',
    subtitle: 'From high-mix low-volume medical prototypes to high-volume aerospace contract manufacturing. Armed with advanced multi-axis CNC machine clusters and 24/7 automated "lights-out" shifts, we deliver over 45,000 precision titanium components annually with guaranteed lead-time stability.',
    badge: 'Production Capacity & Scaling',
  },
  '/capabilities/quality': {
    h1: 'Certified Quality Assurance & Titanium Traceability Infrastructure',
    subtitle: 'Operating under a zero-defect quality philosophy. From raw titanium sponge verification via EN 10204 3.1 MTRs to multi-axis CMM dimensional validation, our precision infrastructure is strictly aligned with AS9100D and ISO 13485 standards to guarantee mission-critical compliance.',
    badge: 'Quality & Compliance',
  },
  '/capabilities/inspection': {
    h1: 'Titanium Metrology, Inspection & Testing Infrastructure',
    subtitle: 'Fully equipped in-house metrology laboratory with CMM, OES spectrometry, optical comparators, surface profilometry, and NDT capabilities — all calibrated per ISO 17025 traceable standards for aerospace and medical titanium components.',
    badge: 'Inspection & Testing',
  },
  '/capabilities/traceability': {
    h1: 'Non-Compromised Titanium Material Traceability & Compliance',
    subtitle: 'De-risking your high-liability applications with an unbroken digital chain of custody. Operating in strict accordance with AS9100D and DFARS compliance, BOZE guarantees 100% material provenance tracking — from raw ingot heat lots to permanently marked, finished multi-axis CNC components.',
    badge: 'Material Traceability',
  },
  '/capabilities/certifications': {
    h1: 'Global Manufacturing Certifications & Compliance Framework',
    subtitle: 'Our production infrastructure operates under a highly audited, internationally recognized quality management system. Validated by world-leading registrars, BOZE aerospace-grade and medical-grade manufacturing certifications guarantee that every machined titanium component adheres to uncompromising regulatory and safety parameters.',
    badge: 'Certifications & Compliance',
  },
  '/about': {
    h1: 'About BOZE CNC-Ti',
    subtitle: 'Mastering One Metal to Serve the World\'s Most Demanding Industries — from precision titanium CNC machining to OEM/ODM customization.',
    badge: 'Our Story',
  },
};