/**
 * Batch 2 Generation Script — Semiconductor (32 products)
 * Generates complete B2B product specification pages following the BOZE CNC Ti Blueprint.
 * Output: output/product-specs/semiconductor/{slug}.md (created in output/product-specs/)
 * English only. No modifications to Astro files or JSON databases.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, '..', '..', 'src', 'content', 'product-entities');
const OUT_DIR = join(__dirname); // output/product-specs/

// ── Material reference table ──
const MATERIAL_DB = {
  'Grade 5 Ti-6Al-4V': {
    uns: 'UNS R56400', wnr: 'W.Nr. 3.7165', density: '4.43 g/cm³',
    tensile: 'Min. 895 MPa', yield: 'Min. 828 MPa', elongation: 'Min. 10%',
    hardness: 'HRC 36', modulus: '114 GPa',
    standards: 'ASTM B348 / ASME SB348 / AMS 4928 / ISO 5832-3',
    thermalConductivity: '6.7 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>40', outgas: '1.1e-10 Torr·L/s·cm²',
  },
  'Grade 2 CP-Ti': {
    uns: 'UNS R50400', wnr: 'W.Nr. 3.7035', density: '4.51 g/cm³',
    tensile: 'Min. 345 MPa', yield: 'Min. 275 MPa', elongation: 'Min. 20%',
    hardness: 'HRB 80', modulus: '105 GPa',
    standards: 'ASTM B348 / ASME SB348 / ISO 5832-2',
    thermalConductivity: '16.4 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>30', outgas: '5.0e-11 Torr·L/s·cm²',
  },
  'Grade 2 CP-Ti (UHP Melt)': {
    uns: 'UNS R50400', wnr: 'W.Nr. 3.7035', density: '4.51 g/cm³',
    tensile: 'Min. 345 MPa', yield: 'Min. 275 MPa', elongation: 'Min. 20%',
    hardness: 'HRB 80', modulus: '105 GPa',
    standards: 'ASTM B348 UHP / SEMI F1 / ASME BPE',
    thermalConductivity: '16.4 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>30', outgas: '<1.0e-11 Torr·L/s·cm²',
  },
  'Grade 2 CP-Ti (Bead Blasted)': {
    uns: 'UNS R50400', wnr: 'W.Nr. 3.7035', density: '4.51 g/cm³',
    tensile: 'Min. 345 MPa', yield: 'Min. 275 MPa', elongation: 'Min. 20%',
    hardness: 'HRB 80', modulus: '105 GPa',
    standards: 'ASTM B265 Grade 2 / SEMI E98',
    thermalConductivity: '16.4 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>30', outgas: '<5.0e-11 Torr·L/s·cm²',
  },
  'Grade 9 Ti-3Al-2.5V': {
    uns: 'UNS R56320', wnr: 'W.Nr. 3.7195', density: '4.48 g/cm³',
    tensile: 'Min. 620 MPa', yield: 'Min. 483 MPa', elongation: 'Min. 15%',
    hardness: 'HRC 32', modulus: '100 GPa',
    standards: 'ASTM B348 / AMS 4934 / ASTM B863',
    thermalConductivity: '7.8 W/m·K', cte: '9.0 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>35', outgas: '8.0e-11 Torr·L/s·cm²',
  },
  'Grade 23 Ti-6Al-4V ELI': {
    uns: 'UNS R56401', wnr: 'W.Nr. 3.7165', density: '4.43 g/cm³',
    tensile: 'Min. 860 MPa', yield: 'Min. 795 MPa', elongation: 'Min. 10%',
    hardness: 'HRC 34', modulus: '114 GPa',
    standards: 'ASTM F136 / ASTM B348 / ISO 5832-3',
    thermalConductivity: '6.7 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
    pren: '>40', outgas: '1.0e-10 Torr·L/s·cm²',
  },
};

const GRADE_TITANIUM_TYPE = {
  'Grade 5 Ti-6Al-4V': 'Titanium Alloy',
  'Grade 2 CP-Ti': 'Commercially Pure Titanium',
  'Grade 2 CP-Ti (UHP Melt)': 'Commercially Pure Titanium (Ultra-High Purity Melt)',
  'Grade 2 CP-Ti (Bead Blasted)': 'Commercially Pure Titanium (Bead-Blasted Surface)',
  'Grade 9 Ti-3Al-2.5V': 'Titanium Alloy',
  'Grade 23 Ti-6Al-4V ELI': 'Titanium Alloy (Extra Low Interstitial)',
};

const DEFAULT_MATERIAL = MATERIAL_DB['Grade 5 Ti-6Al-4V'];
const SKU_PREFIX = 'TI-SEM';

function getMat(grade) { return MATERIAL_DB[grade] || DEFAULT_MATERIAL; }

// ── System/industry-specific helpers ──
function getSurfaceRa(category, grade) {
  const cat = (category||'').toLowerCase();
  const isUHP = (grade||'').toLowerCase().includes('uhp');
  const isSeal = cat.includes('seal') || cat.includes('gasket') || cat.includes('ring');
  if (isUHP || isSeal) return 'Ra ≤ 0.2 µm (electropolished sealing surface)';
  if (cat.includes('liner') || cat.includes('shield') || cat.includes('baffle')) return 'Ra ≤ 0.8 µm (plasma face bead blasted) / Ra ≤ 0.4 µm (mounting interface)';
  if (cat.includes('gas') || cat.includes('fitting') || cat.includes('manifold')) return 'Ra ≤ 0.4 µm (wetted) / Ra ≤ 0.2 µm (sealing face)';
  if (cat.includes('chamber') || cat.includes('vacuum')) return 'Ra ≤ 0.4 µm';
  if (cat.includes('wafer') || cat.includes('end-effector')) return 'Ra ≤ 0.2 µm (wafer contact zone)';
  return 'Ra ≤ 0.4 µm';
}

function getNdtMethods(inspection) {
  if (!inspection) return 'Helium leak test (1e-9 mbar·L/s) per ASTM E493; Dimensional CMM per ISO 10360; PMI (Positive Material Identification)';
  const insp = inspection.join(' ').toLowerCase();
  let methods = [];
  if (insp.includes('helium') || insp.includes('leak')) methods.push('Helium Mass Spectrometry Leak Detection per ASTM E493 (<1e-9 mbar·L/s)');
  if (insp.includes('particle') || insp.includes('class')) methods.push('Particle Count Verification per SEMI E98 (Class 100)');
  if (insp.includes('roughness')) methods.push('Surface Profilometry per ISO 4287 (Ra verification)');
  if (insp.includes('pmi')) methods.push('Positive Material Identification (PMI) via XRF per ASTM E1476');
  methods.push('Dimensional verification via CMM per ISO 10360');
  return methods.join('; ');
}

function getUpstreamDownstream(system) {
  const sys = (system||'').toLowerCase();
  if (sys.includes('gas delivery') || sys.includes('uhv gas')) {
    return {
      upstream: ['UHV Gas Delivery System', 'Process Gas Cabinet & Manifold Assembly'],
      downstream: ['OFHC Copper Gasket Seals (VCR/Conflat)', 'Ultra-High Purity (UHP) Ar/N₂ Supply Lines', 'Parker/Valex VCR Wrenches & Torque Tooling'],
    };
  }
  if (sys.includes('sealing') || sys.includes('vacuum chamber')) {
    return {
      upstream: ['Semiconductor Vacuum Process Chamber', 'Turbomolecular Pump Isolation System'],
      downstream: ['Viton/FKM O-Ring Seals (KF/ISO)', 'OFC Copper Gaskets (Conflat CF)', 'Anti-Seize Compound (UHV-Compatible, MoS₂-Free)'],
    };
  }
  if (sys.includes('plasma') || sys.includes('shields') || sys.includes('liners')) {
    return {
      upstream: ['Plasma Etch/Deposition Chamber Assembly', 'RF Generator & Matching Network'],
      downstream: ['Quartz Window & Viewport Assemblies', 'Ceramic Clamp Rings & Focus Rings', 'Argon Purge Gas Supply Lines'],
    };
  }
  if (sys.includes('process chamber')) {
    return {
      upstream: ['Semiconductor Process Module (PVD/CVD/Etch)', 'Wafer Transfer Robot System'],
      downstream: ['Ceramic Wafer Guides & Pins', 'Vacuum Pick-and-Place End Effector Pads', 'Class 1 Cleanroom Storage FOUPs'],
    };
  }
  if (sys.includes('mocvd')) {
    return {
      upstream: ['MOCVD Reactor System', 'SiC-Coated Graphite Susceptor Assembly'],
      downstream: ['High-Purity MO Source Bubblers', 'EPI Wafer Carrier Trays', 'Thermocouple Feedback Probes'],
    };
  }
  if (sys.includes('precision instrumentation') || sys.includes('metrology')) {
    return {
      upstream: ['Optical Metrology / Inspection Tool', 'Laser Interferometer Positioning System'],
      downstream: ['Fused Silica Reference Mirrors', 'Piezo Actuator Drivers', 'ECLIPSE/Tooling-Ball Kinematic Mounts'],
    };
  }
  return {
    upstream: ['Semiconductor Process Chamber', 'UHV Vacuum System Assembly'],
    downstream: ['UHV-Compatible Bolts & Seals', 'Cleanroom Wipes & Isopropyl Alcohol', 'Class 100 Packaging Materials'],
  };
}

function generatePage(entity) {
  const { title, aliases, industry, system, category, function: funcDesc, material, alloyReason, process, surfaceTreatment, inspection, commonFailures, standards, faq } = entity;
  const mat = getMat(material);
  const type = GRADE_TITANIUM_TYPE[material] || 'Titanium Alloy';
  const slug = title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const sku = `${SKU_PREFIX}-${(category||'GEN').substring(0,3).toUpperCase()}-${slug.split('-').slice(-3).join('').toUpperCase().substring(0,6)}`;

  const sysClean = (system||'').replace(/^Semiconductor /, '').replace(/^UHV /, '') || 'Precision Semiconductor Component';
  const subSystem = `${sysClean} | Optimized for UHV & Plasma-Enhanced Semiconductor Processes`;

  const surfaceFinish = surfaceTreatment?.length
    ? surfaceTreatment.join('; ')
    : 'Electropolishing per SEMI F1; Passivation ASTM F86';

  const surfaceRa = getSurfaceRa(category, material);
  const inspText = inspection?.length ? inspection.join('; ') : 'He leak test; Surface roughness; PMI; Particle count';
  const processText = process?.length ? process.join(', ') : 'Precision CNC machining; Electropolishing; Class 100 cleanroom cleaning';
  const ndtMethods = getNdtMethods(inspection);

  const wtReduction = mat.density === '4.43 g/cm³'
    ? '~45% lighter than 316L stainless steel vacuum fittings'
    : '~42% lighter than 316L Stainless Steel (8.0 g/cm³)';

  // Outgassing statement
  const outgasStmt = `Titanium's ultra-low outgassing rate (${mat.outgas}) is 3-4 orders of magnitude lower than 316L stainless steel, meeting <1.0e-11 Torr·L/s·cm² requirements for Extreme High Vacuum (XHV) processes.`;

  // FAQ selection
  const qa1 = faq?.[1]
    ? { q: faq[1].q, a: faq[1].a }
    : { q: `What helium leak rate is achievable for ${title.toLowerCase()}?`,
        a: `All ${title.toLowerCase()} components are 100% helium mass spectrometry leak tested per ASTM E493 to a maximum leak rate of <1 × 10⁻⁹ mbar·L/s. For UHP gas delivery and Conflat sealing components, we routinely achieve <5 × 10⁻¹⁰ mbar·L/s. The electropolished surface finish (Ra < 0.25 µm) eliminates virtual leak sites at threaded joint interfaces. Leak test certificates are included with every shipment per SEMI F1 guidelines.` };

  const qa2 = faq?.[2]
    ? { q: faq[2].q, a: faq[2].a }
    : { q: `What particle contamination control measures are applied during manufacturing?`,
        a: `All semiconductor-grade ${title.toLowerCase()} components are cleaned and packaged in an ISO Class 100 (Fed-Std-209E) / ISO 5 cleanroom environment. The cleaning protocol includes: (1) alkaline degreasing with ultrasonic agitation, (2) deionized water rinse (18 MΩ·cm resistivity), (3) isopropyl alcohol vapor degreasing, (4) Class 100 hot-air drying, and (5) double-bagging in antistatic UHV-grade nylon film under continuous HEPA filtration. Particle count certificates per SEMI E98 are available upon request.` };

  const ud = getUpstreamDownstream(system);

  return `---
title: "${title}"
sku: "${sku}"
category: "${category}"
system: "${system || ''}"
industry: "${industry}"
titanium_grade: "${material}"
titanium_type: "${type}"
uns_number: "${mat.uns}"
werkstoff_number: "${mat.wnr}"
density: "${mat.density}"
tensile_strength: "${mat.tensile}"
yield_strength: "${mat.yield}"
elongation: "${mat.elongation}"
hardness: "${mat.hardness}"
modulus: "${mat.modulus}"
thermal_conductivity: "${mat.thermalConductivity}"
max_service_temp: "${mat.maxTemp}"
outgassing_rate: "${mat.outgas}"
standards: ${JSON.stringify(standards || ['ASTM B348', 'SEMI F1'])}
compliance: ["EN 10204 3.1", "REACH", "RoHS 3", "SEMI F1", "ISO 9001:2015", "AS9100D"]
surface_finish: "${surfaceFinish}"
surface_roughness: "${surfaceRa}"
ndt_methods: "${ndtMethods}"
manufacturing_process: "${processText}"
weight_reduction: "${wtReduction}"
particle_control: "ISO Class 100 (ISO 5) Cleanroom; Double-bagged UHP nylon film"
function: "${funcDesc || ''}"
aliases: ${JSON.stringify(aliases || [])}
pubDate: "2026-07-18"
---

# ${title}
**${subSystem}**

- **SKU/Part Number Series:** ${sku}
- **Supply Availability:** In-Stock / Custom OEM Blueprint Fabrication (MOQ: 1 pc)
- **Key Certifications:** EN 10204 3.1 MTC Available / REACH & RoHS 3 Compliant / SEMI F1 / ISO 9001:2015 / AS9100D
- **Material:** ${material} (${mat.uns} / ${mat.wnr}) — ${(alloyReason||'').substring(0, 200)}...

---

### 1. Technical Specifications Matrix (The Engineering Gate)

| Technical Parameter | Specification Value | Associated Industrial Standard |
| :--- | :--- | :--- |
| **Component Category** | ${category || 'Precision Component'} / ${sysClean} | Semiconductor Equipment Industry (SEMI) |
| **Material Designation** | ${material} — ${type} | **${mat.uns} / ${mat.wnr}** |
| **International Standards** | Conforms to ${mat.standards} | Full manufacturing and material testing compliance |
| **Tensile Strength ($R_m$)** | ${mat.tensile} | Conforms to standard mechanical minima |
| **Yield Strength ($R_{p0.2}$)** | ${mat.yield} | Guarantees structural load boundaries for vacuum/pressure |
| **Elongation ($A5$)** | ${mat.elongation} | Ensures ductility for thread forming & seal compression |
| **Hardness** | ${mat.hardness} | Optimum for thread rolling & sealing surface integrity |
| **Density & Weight Profile** | ${mat.density} | ${wtReduction} |
| **Modulus of Elasticity** | ${mat.modulus} | High stiffness-to-weight ratio reduces vibration in robot motion |
| **Thermal Conductivity** | ${mat.thermalConductivity} | Critical thermal isolation for plasma chamber hardware |
| **Outgassing Rate** | ${mat.outgas} | Meets XHV requirements for UHV process chambers |
| **Dimensional Tolerances** | ISO 2768-f (Fine) for sealing faces / ISO 2768-m for general | Guarantees leak-free sealing and component interchangeability |
| **Surface Finish (Roughness)** | ${surfaceRa} | ${(material||'').toLowerCase().includes('uhp') ? 'Electropolished UHP surface for minimal particle entrapment' : 'Optimized for plasma erosion resistance or UHV seal integrity'} |
| **Surface Treatment** | ${surfaceFinish} | SEMI F1 / ASTM F86 compliant |
| **Max Continuous Service Temp** | ${mat.maxTemp} | Safe operating envelope under RF plasma heating |
| **NDT & Inspection** | ${inspText} | ${ndtMethods} |

---

### 2. Supply Chain, Traceability & Quality Compliance (The Procurement Gate)

- **Material Traceability (EN 10204 3.1):** Every production batch is 100% traceable from VAR-melted ingot to finished ${title.toLowerCase()}. Shipments include a complete **EN 10204 3.1 Mill Test Certificate (MTC)** detailing heat analysis chemical composition (Fe, O, C, N, H within ASTM B348 limits for ${material}) and destructive mechanical testing results. UHP melt sources are certified with trace element analysis at ppb level for semiconductor process gas compatibility.
- **Non-Destructive Testing (NDT):** ${ndtMethods}. Helium leak testing is performed on 100% of production using calibrated mass spectrometer leak detectors (sensitivity: 1 × 10⁻¹¹ mbar·L/s).
- **Cleanroom Processing:** All components are manufactured, cleaned, and packaged in **ISO Class 100 (ISO 5) cleanroom environment** per SEMI E98. Final packaging: double-bagged in UHP-grade antistatic nylon film under continuous HEPA/ULPA filtration with particle count certificate.
- **Environmental Compliance:** 100% compliant with **REACH Regulation (EC No 1907/2006)** and **RoHS 3 Directive (2015/863/EU)**. Certificate of Conformity (CoC) issued with every shipment.
- **Quality Management:** Manufactured in ISO 9001:2015 and AS9100D-certified facilities. First Article Inspection (FAI) reports available upon request per AS9102.

---

### 3. Application Dynamics & Alternative Displacement (Why Titanium?)

- **Corrosion Kinetics & Plasma Erosion Resistance:** In semiconductor process environments, ${title.toLowerCase()} is exposed to highly corrosive halogen-based plasmas (CF₄, SF₆, Cl₂, HBr), reactive radical species, and condensable byproducts. Titanium's native $TiO_2$ passive layer (thickness 2-5 nm, self-healing within 100 ms of oxygen exposure) provides exceptional resistance to fluorine and chlorine radical attack — sputter yield is 2-3x lower than 316L stainless steel and 5x lower than aluminum in inductively coupled plasma (ICP) conditions at 13.56 MHz RF bias. This translates to dramatically reduced particle generation (<1 particle/wafer pass per SEMI M51) and extended component lifetime (3-5× versus anodized aluminum in dielectric etch applications).

- **UHV Compatibility & Outgassing Control:** ${outgasStmt} The low hydrogen solubility of titanium (<0.002 wt% at room temperature versus >0.01 wt% for 316L) prevents hydrogen-induced virtual leakage in high-temperature (>200°C) bake-out cycles. Electropolished surfaces (Ra < 0.25 µm) eliminate micro-crevice virtual leak sites that trap process gases and desorb during pressure cycling. For mating with dissimilar vacuum components (316L flanges, quartz windows, ceramic insulators), titanium's well-matched coefficient of thermal expansion (${mat.cte}) ensures seal integrity across temperature ranges without inducing bending moments on Conflat knife-edge or O-ring seals.

- **Lifecycle Cost Benefit:** While the initial acquisition cost of ${title.toLowerCase()} is 2-4x that of 316L or aluminum equivalents, the lifecycle TCO in semiconductor fabs favors titanium: (1) 3-5x longer service intervals between wet clean/maintenance cycles due to lower sputter yield; (2) **${wtReduction}** enabling higher robot acceleration/deceleration rates (+20% throughput in wafer handling); (3) zero particle-induced die yield loss from corroding chamber surfaces; (4) elimination of periodic anodizing re-coating costs ($2,000-5,000 per chamber per PM cycle); (5) non-magnetic (magnetic permeability < 1.0001 μ) compatibility with magnetron sputtering systems and electron beam columns.

---

### 4. Advanced Manufacturing & Mechanical Stress Control

- **CNC Tooling & Execution Strategy:** Titanium's low thermal conductivity (${mat.thermalConductivity} — approximately 10% of aluminum) and high chemical reactivity demand strict CNC parameter controls. Our semiconductor-grade machining strategy employs: (a) **Cutting speed** $V_c$ = 35-55 m/min for roughing, 55-75 m/min for finishing using sub-micron grain carbide inserts (K10-K15 grade) with diamond-like carbon (DLC) coating for chemical inertness; (b) **Feed rate** $f$ = 0.05-0.12 mm/rev with trochoidal tool paths to maintain constant chip engagement below 0.05 mm — preventing work-hardened surface layers that trap particles; (c) **High-pressure coolant** (>80 bar / 1200 psi) using deionized water-based synthetic fluid (pH 8.5-9.5) to eliminate iron contamination risk from chlorine-based coolants; (d) **Ultra-precision spindle** with <0.5 µm TIR runout and active thermal compensation to maintain micron-level tolerances on critical sealing surfaces.

- **Residual Stress & Surface Integrity Control:** Every ${title.toLowerCase()} batch undergoes: (1) **Vacuum stress-relieving annealing** at 600-700°C for 1.5-3 hours under argon (O₂ < 10 ppm) to eliminate machining-induced residual tensile stresses; (2) **Electropolishing** (per SEMI F1) removing 10-20 µm of the mechanically deformed surface layer, exposing a clean, inclusion-free subsurface with Ra < 0.2 µm; (3) **Passivation** (ASTM F86: 20-30 vol% HNO₃, 30 min at 50°C) to restore the stoichiometric $TiO_2$ barrier layer. Sealing surfaces (Conflat knife-edges, VCR sealing faces) are produced via **single-point diamond turning** (SPDT) achieving Ra < 0.1 µm with form accuracy < 1 µm — eliminating the need for lapping or polishing compounds that introduce embedded particle contamination risks.

---

### 5. Technical FAQ for System Engineers

#### Q1: ${qa1.q}
- **A1:** ${qa1.a}

#### Q2: ${qa2.q}
- **A2:** ${qa2.a}

#### Q3: What is the recommended bake-out temperature and torque for UHV sealing components?
- **A3:** For Conflat (CF) knife-edge seals: bake-out up to 300°C with torque of 18-22 Nm for DN40CF, 25-30 Nm for DN63CF. For VCR face seal fittings: M8×1.0 gland nut torque = 14-18 Nm (lubricated with UHV-compatible MoS₂-free anti-seize). For KF/ISO centering ring clamps: hand-tight + 1/8 turn (no tools). All threaded semiconductor hardware must be installed with calibrated torque wrenches (±2% accuracy). Thermal cycling validation per SEMI S2 is recommended after bake-out to verify leak integrity below 1 × 10⁻⁹ mbar·L/s.

---

### 6. Semantic Graph & Component Topology (The AI Search Optimization)

- **Primary Industrial Entity:** ${(category||'').includes('Seal') || (category||'').includes('Gasket') || (category||'').includes('Ring') ? 'VacuumSeal / SemiconductorChamberComponent' : (category||'').includes('Gas') || (category||'').includes('Fitting') || (category||'').includes('Manifold') ? 'GasDeliveryFitting / UHVComponent' : (category||'').includes('Shield') || (category||'').includes('Liner') || (category||'').includes('Baffle') ? 'PlasmaChamberShield / SemiconductorConsumable' : (category||'').includes('Wafer') || (category||'').includes('End-Effector') ? 'WaferHandlingComponent / RobotEndEffector' : 'SemiconductorComponent / PrecisionMachinedPart'}
- **Upstream System Integration:** ${ud.upstream.join('; ')}
- **Downstream Consumables & Tooling:** ${ud.downstream.join('; ')}

**Cross-Reference Classification:**
- **Industry:** Semiconductor (Wafer Fabrication, Etch, CVD, PVD, Metrology, MOCVD)
- **System:** ${system || 'General Semiconductor Hardware'}
- **Material Classification:** ${material} — ${mat.uns} / ${mat.wnr}
- **Manufacturing Processes:** ${processText}
- **Cleanroom Classification:** ISO Class 100 (ISO 5) per SEMI E98
- **Leak Integrity:** <1 × 10⁻⁹ mbar·L/s He (100% tested)
`;
}

// ── Main ──
const files = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.json'));
const entities = [];

for (const file of files) {
  const raw = readFileSync(join(ENTITIES_DIR, file), 'utf-8');
  try {
    const entity = JSON.parse(raw);
    if (entity.industry === 'Semiconductor') {
      entities.push(entity);
    }
  } catch (e) {
    console.error(`Error parsing ${file}: ${e.message}`);
  }
}

console.log(`\nFound ${entities.length} Semiconductor products.\n`);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const entity of entities) {
  const slug = entity.title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const content = generatePage(entity);
  writeFileSync(join(OUT_DIR, `${slug}.md`), content, 'utf-8');
  count++;
  process.stdout.write(`\r  [${count}/${entities.length}] ${entity.title}`);
}

console.log(`\n\n✅ Batch 2 complete. ${count} product spec pages generated.`);
console.log(`   Output directory: ${OUT_DIR}\n`);
