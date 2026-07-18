/**
 * Batch 1 Generation Script — Cycling / Bicycle (51 products)
 * Generates complete B2B product specification pages following the BOZE CNC Ti Blueprint.
 * Output: output/product-specs/cycling-bicycle/{slug}.md
 * English only. No modifications to Astro files or JSON databases.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, '..', '..', 'src', 'content', 'product-entities');
const OUT_DIR = join(__dirname);

// ── Material reference table ──
const MATERIAL_DB = {
  'Grade 5 Ti-6Al-4V': {
    uns: 'UNS R56400', wnr: 'W.Nr. 3.7165', density: '4.43 g/cm³',
    tensile: 'Min. 895 MPa', yield: 'Min. 828 MPa', elongation: 'Min. 10%',
    hardness: 'HRC 36', modulus: '114 GPa',
    standards: 'ASTM B348 / ASME SB348 / AMS 4928 / ISO 5832-3',
    thermalConductivity: '6.7 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
  },
  'Grade 2 CP-Ti': {
    uns: 'UNS R50400', wnr: 'W.Nr. 3.7035', density: '4.51 g/cm³',
    tensile: 'Min. 345 MPa', yield: 'Min. 275 MPa', elongation: 'Min. 20%',
    hardness: 'HRB 80', modulus: '105 GPa',
    standards: 'ASTM B348 / ASME SB348 / ISO 5832-2',
    thermalConductivity: '16.4 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
  },
  'Grade 9 Ti-3Al-2.5V': {
    uns: 'UNS R56320', wnr: 'W.Nr. 3.7195', density: '4.48 g/cm³',
    tensile: 'Min. 620 MPa', yield: 'Min. 483 MPa', elongation: 'Min. 15%',
    hardness: 'HRC 32', modulus: '100 GPa',
    standards: 'ASTM B348 / AMS 4934 / ASTM B863',
    thermalConductivity: '7.8 W/m·K', cte: '9.0 µm/m·°C', maxTemp: '315°C (continuous)',
  },
  'Grade 23 Ti-6Al-4V ELI': {
    uns: 'UNS R56401', wnr: 'W.Nr. 3.7165', density: '4.43 g/cm³',
    tensile: 'Min. 860 MPa', yield: 'Min. 795 MPa', elongation: 'Min. 10%',
    hardness: 'HRC 34', modulus: '114 GPa',
    standards: 'ASTM F136 / ASTM B348 / ISO 5832-3',
    thermalConductivity: '6.7 W/m·K', cte: '8.6 µm/m·°C', maxTemp: '315°C (continuous)',
  },
};

const GRADE_TITANIUM_TYPE = {
  'Grade 5 Ti-6Al-4V': 'Titanium Alloy',
  'Grade 2 CP-Ti': 'Commercially Pure Titanium',
  'Grade 9 Ti-3Al-2.5V': 'Titanium Alloy',
  'Grade 23 Ti-6Al-4V ELI': 'Titanium Alloy (Extra Low Interstitial)',
};

const DEFAULT_MATERIAL = MATERIAL_DB['Grade 5 Ti-6Al-4V'];
const SKU_PREFIX = 'TI-CYC';

function getMat(grade) {
  return MATERIAL_DB[grade] || DEFAULT_MATERIAL;
}

function generatePage(entity) {
  const { title, aliases, industry, system, category, function: funcDesc, material, alloyReason, process, surfaceTreatment, inspection, commonFailures, standards, faq } = entity;
  const mat = getMat(material);
  const type = GRADE_TITANIUM_TYPE[material] || 'Titanium Alloy';
  const slug = title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const sku = `${SKU_PREFIX}-${(category||'GEN').substring(0,4).toUpperCase()}-${slug.split('-').slice(-3).join('').toUpperCase().substring(0,6)}`;

  const sysClean = (system||'').replace(/^Bicycle /, '') || 'Precision Component';
  const subSystem = `${sysClean} | Optimized for Weight-Sensitive Cycling Applications`;

  const surfaceFinish = surfaceTreatment?.length
    ? surfaceTreatment.join('; ')
    : 'Passivation ASTM F86';

  const surfaceRa = (category||'').toLowerCase().includes('rotor') || (category||'').toLowerCase().includes('brake')
    ? 'Ra ≤ 0.8 µm'
    : (category||'').toLowerCase().includes('fastener') || (category||'').toLowerCase().includes('bolt') || (category||'').toLowerCase().includes('screw')
    ? 'Ra ≤ 0.4 µm (thread) / Ra ≤ 0.8 µm (head)'
    : 'Ra ≤ 0.8 µm';

  const inspText = inspection?.length ? inspection.join('; ') : '100% dimensional inspection per ISO 2768-m; Material Test Report (MTR)';
  const processText = process?.length ? process.join(', ') : 'Precision CNC machining';

  const ndtMethods = inspection?.some(i => i.toLowerCase().includes('mpi') || i.toLowerCase().includes('crack'))
    ? 'Magnetic Particle Inspection (MPI) per ASTM E1444; Dimensional verification via CMM per ISO 10360'
    : 'Ultrasonic Testing (UT) per ASTM A388; Liquid Penetrant Inspection (LPI) per ASTM E1417; Dimensional verification via CMM';

  const wtReduction = mat.density === '4.43 g/cm³' ? '~45% vs steel (7.85 g/cm³)' : '~42% vs 316L Stainless Steel (8.0 g/cm³)';

  // FAQ - pick most relevant
  const qa1 = faq?.[1] ? { q: faq[1].q, a: faq[1].a }
    : { q: `What anti-galling measures are required for ${title.toLowerCase()} installation?`,
        a: `Titanium exhibits high coefficient of friction under sliding contact, leading to severe galling. We mandate application of molybdenum disulfide (MoS₂) or copper-based anti-seize compound to all thread interfaces before assembly. Torque values must be reduced by 15-20% versus lubricated steel equivalents to account for modified friction coefficient (μ ≈ 0.12-0.15). All threaded surfaces are produced via thread rolling (DIN 13-1 / ISO 965-2, 6g) to maintain continuous grain flow and eliminate stress risers.` };
  const qa2 = faq?.[2] ? { q: faq[2].q, a: faq[2].a }
    : { q: `What is the fatigue performance of ${title.toLowerCase()} under cyclic loading?`,
        a: `Grade 5 Ti-6Al-4V in STA condition exhibits endurance limit of approx. 500-600 MPa at 10⁷ cycles (R = -1, rotating beam test) — a 40% improvement over annealed condition. Thread rolling further enhances fatigue life by 30-50% vs thread cutting through compressive residual stress introduction and uninterrupted grain flow. We recommend applying a 2.0-2.5x safety factor relative to maximum expected service loads for cycling components.` };

  // Upstream/downstream
  let upstream = ['Bicycle Frame Assembly', 'Wheel & Suspension System'];
  let downstream = ['M4/M5/M6 Fastener Hardware', 'Stainless Steel Bearings', 'Aluminum Frame Components'];
  const sys = (system||'').toLowerCase();
  if (sys.includes('brake')) {
    upstream = ['Bicycle Brake Caliper Assembly', 'Hydraulic Brake System'];
    downstream = ['Organic/Sintered Brake Pads', 'Hydraulic Brake Fluid (DOT 4/5.1)', 'Compression Olive & Barb Fittings'];
  } else if (sys.includes('drivetrain')) {
    upstream = ['Bicycle Drivetrain Assembly', 'Crankset & Bottom Bracket System'];
    downstream = ['11/12-Speed Chain', 'Derailleur Pulley Bearings', 'Threadlocker Compound (Loctite 242)'];
  } else if (sys.includes('cockpit') || sys.includes('steering')) {
    upstream = ['Bicycle Handlebar & Stem Assembly', 'Steering Column / Fork Assembly'];
    downstream = ['Carbon Fiber Handlebar', 'Aluminum/Steel Stem', 'Torx T25 Driver Bit'];
  } else if (sys.includes('suspension')) {
    upstream = ['Mountain Bike Full-Suspension Linkage', 'Rear Shock Assembly'];
    downstream = ['Sealed Cartridge Bearings (6800/6900 Series)', 'DIN 912 Socket Head Cap Screws', 'Anti-Seize Compound'];
  } else if (sys.includes('wheel') || sys.includes('pedal') || sys.includes('saddle')) {
    upstream = ['Bicycle Wheel Build Assembly', 'Hub & Axle System'];
    downstream = ['Brass/Nickel-Plated Nipples', 'Rim Tape & Tubeless Valves', 'Spoke Tension Meter'];
  }

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
standards: ${JSON.stringify(standards || ['ASTM B348'])}
compliance: ["EN 10204 3.1", "REACH", "RoHS 3", "ISO 2768-m", "ISO 9001:2015"]
surface_finish: "${surfaceFinish}"
surface_roughness: "${surfaceRa}"
ndt_methods: "${ndtMethods}"
manufacturing_process: "${processText}"
weight_reduction: "${wtReduction}"
function: "${funcDesc || ''}"
aliases: ${JSON.stringify(aliases || [])}
pubDate: "2026-07-18"
---

# ${title}
**${subSystem}**

- **SKU/Part Number Series:** ${sku}
- **Supply Availability:** In-Stock / Custom OEM Blueprint Fabrication (MOQ: 1 pc)
- **Key Certifications:** EN 10204 3.1 MTC Available / REACH & RoHS 3 Compliant / ISO 9001:2015
- **Material:** ${material} (${mat.uns} / ${mat.wnr}) — ${(alloyReason||'').substring(0, 200)}...

---

### 1. Technical Specifications Matrix (The Engineering Gate)

| Technical Parameter | Specification Value | Associated Industrial Standard |
| :--- | :--- | :--- |
| **Component Category** | ${category || 'Precision Component'} / ${sysClean} | Cycling / Bicycle Industry Classification |
| **Material Designation** | ${material} — ${type} | **${mat.uns} / ${mat.wnr}** |
| **International Standards** | Conforms to ${mat.standards} | Full manufacturing and material testing compliance |
| **Tensile Strength ($R_m$)** | ${mat.tensile} | Conforms to standard mechanical minima |
| **Yield Strength ($R_{p0.2}$)** | ${mat.yield} | Guarantees structural load boundaries |
| **Elongation ($A5$)** | ${mat.elongation} | Ensures ductility for thread forming & bending |
| **Hardness** | ${mat.hardness} | Consistent machinability & wear resistance |
| **Density & Weight Profile** | ${mat.density} | ${wtReduction} |
| **Modulus of Elasticity** | ${mat.modulus} | Determines stiffness & deflection under load |
| **Thermal Conductivity** | ${mat.thermalConductivity} | Critical for brake heat management & welding |
| **Dimensional Tolerances** | ISO 2768-m (Medium) / Threads: Class 6g (DIN 13-1 / ISO 965-2) | Guarantees tight interchangeability in assemblies |
| **Surface Finish (Roughness)** | ${surfaceRa} | Specified for optimal fatigue life and corrosion resistance |
| **Surface Treatment** | ${surfaceFinish} | ASTM F86 / AMS 2488 compliant |
| **Max Continuous Service Temp** | ${mat.maxTemp} | Safe operating envelope verified |
| **NDT & Inspection** | ${inspText} | ${ndtMethods} |

---

### 2. Supply Chain, Traceability & Quality Compliance (The Procurement Gate)

- **Material Traceability (EN 10204 3.1):** Every production batch is 100% traceable from raw ingot to finished ${title.toLowerCase()}. Shipments include a complete **EN 10204 3.1 Mill Test Certificate (MTC)** detailing heat analysis chemical composition (Max Fe, N, C, H, O limits within ASTM B348 specification) and destructive mechanical testing results (tensile, yield, elongation, reduction of area).
- **Non-Destructive Testing (NDT):** Components undergo ${ndtMethods} to guarantee zero sub-surface voids, micro-cracks, or structural anomalies. All threaded features are verified with Go/No-Go ring gauges (Class 6g tolerance) per DIN 13-1 / ISO 965-2.
- **Environmental Compliance:** 100% compliant with **REACH Regulation (EC No 1907/2006)** and **RoHS 3 Directive (2015/863/EU)**. Completely free from restricted hazardous substances. Certificate of Conformity (CoC) issued with every shipment.
- **Quality Management:** Manufactured in ISO 9001:2015 and AS9100D-certified facilities. First Article Inspection (FAI) reports available upon request per AS9102 standard.

---

### 3. Application Dynamics & Alternative Displacement (Why Titanium?)

- **Corrosion Kinetics & Operating Boundaries:** In cycling applications, ${title.toLowerCase()} is exposed to road salt, moisture, sweat, and UV radiation. Titanium's native $TiO_2$ passive layer (2-5 nm thick, self-healing) provides complete immunity to galvanic corrosion, pitting, and crevice attack in chloride-rich environments up to ${mat.maxTemp}. Unlike 316L stainless steel (pitting resistance equivalent number PREn ≈ 25), titanium (PREn > 40 for Grade 5) exhibits zero measurable corrosion in neutral pH cycling environments. The material's low thermal conductivity (${mat.thermalConductivity}) provides critical thermal isolation — for brake components, this prevents brake fluid boiling (wet boiling point >180°C) during extended alpine descents where aluminum components conduct heat directly to the caliper fluid circuit.

- **Galvanic Isolation & Material Compatibility:** When mating with carbon fiber reinforced polymer (CFRP) frames or forks, titanium's electrochemical potential (−0.1 to −0.3 V vs SCE) is sufficiently close to carbon (+0.2 to +0.5 V vs SCE) to avoid severe galvanic acceleration in wet conditions. However, we recommend isolating titanium fasteners from direct carbon contact using nylon or PTFE washers in permanently submerged applications. The $TiO_2$ passive layer is maintained via ASTM F86 passivation (20-30% $HNO_3$ bath, 30 min at 50°C) which removes iron contamination and restores the full oxide barrier.

- **Lifecycle Cost Benefit:** While the initial acquisition cost of ${title.toLowerCase()} is 2-3x that of 316L or 7075 aluminum equivalents, the lifecycle total cost of ownership (TCO) favors titanium when accounting for: (1) zero corrosion replacement costs over the bicycle/service vehicle lifespan (15-20 years), (2) **${wtReduction}** reducing unsprung mass and rotational inertia, (3) fatigue endurance limit approximately 2x that of 7075-T6 aluminum (240 MPa at 10⁷ cycles), and (4) elimination of periodic replacement due to corrosion pitting or stress corrosion cracking (SCC).

---

### 4. Advanced Manufacturing & Mechanical Stress Control

- **CNC Tooling & Execution Strategy:** Titanium's low thermal conductivity (${mat.thermalConductivity} — approximately 10% of aluminum) and high chemical reactivity require strict CNC parameter controls to prevent work-hardening and tool failure. Our machining strategy employs: (a) **Cutting speed** $V_c$ = 40-60 m/min for roughing, 60-80 m/min for finishing using grade K313 cemented carbide inserts with TiAlN PVD coating; (b) **Feed rate** $f$ = 0.08-0.15 mm/rev maintaining constant chip load to avoid work-hardening zones; (c) **High-pressure flood coolant** (>70 bar / 1000 psi) directed at the cutting interface to suppress the adiabatic shear band formation that causes catastrophic tool edge fracture; (d) **Rigid setups** with minimum tool overhang (<3:1 ratio) to eliminate deflection-induced taper and chatter in thin-wall sections.

- **Residual Stress Mitigation:** Every ${title.toLowerCase()} batch undergoes post-machining vacuum stress-relieving annealing at 540-675°C for 1-2 hours under argon atmosphere (O₂ < 50 ppm) to eliminate residual tensile stresses induced by CNC material removal. This thermal cycle reduces microstructural distortion risk by >70% and prevents premature **stress corrosion cracking (SCC)** during field service. All threaded features are produced via **thread rolling** (not thread cutting), which induces compressive residual stresses at the thread root and maintains uninterrupted grain flow — increasing fatigue strength by 30-50% compared to cut threads. ISO 965-2 Class 6g tolerance is verified with calibrated Go/No-Go ring gauges on 100% of production.

---

### 5. Technical FAQ for System Engineers

#### Q1: ${qa1.q}
- **A1:** ${qa1.a}

#### Q2: ${qa2.q}
- **A2:** ${qa2.a}

#### Q3: What is the maximum installation torque for threaded variants?
- **A3:** For M4 fasteners: 2.0-2.5 Nm; M5: 4.0-5.0 Nm; M6: 8.0-10.0 Nm (all values apply to lubricated threads with MoS₂ anti-seize). Unlubricated torque values must be reduced by 15-20% to account for the higher coefficient of friction (μ ≈ 0.18-0.22 dry vs 0.12-0.15 lubricated). These figures ensure the fastener operates within 60-70% of yield strength, preserving a 1.5x safety margin for dynamic loading. Always use a calibrated torque wrench (±3% accuracy) for installation; impact drivers are not recommended due to the risk of thread stripping and localized galling at the thread engagement zone.

---

### 6. Semantic Graph & Component Topology (The AI Search Optimization)

- **Primary Industrial Entity:** ${(category||'').includes('Fastener') || (category||'').includes('Bolt') || (category||'').includes('Screw') ? 'MechanicalFastener / BicycleHardware' : 'BicycleComponent / PrecisionMachinedPart'} 
- **Upstream System Integration:** ${upstream.join('; ')}
- **Downstream Consumables & Tooling:** ${downstream.join('; ')}

**Cross-Reference Classification:**
- **Industry:** Cycling / Bicycle (High-Performance, Road, Mountain, Gravel, E-Bike)
- **System:** ${system || 'General Cycling Hardware'}
- **Material Classification:** ${material} — ${mat.uns} / ${mat.wnr}
- **Manufacturing Processes:** ${processText}
- **Inspection Standards:** ${inspText}
`;
}

// ── Main ──
const files = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.json'));
const entities = [];

for (const file of files) {
  const raw = readFileSync(join(ENTITIES_DIR, file), 'utf-8');
  try {
    const entity = JSON.parse(raw);
    if (entity.industry === 'Cycling / Bicycle') {
      entities.push(entity);
    }
  } catch (e) {
    console.error(`Error parsing ${file}: ${e.message}`);
  }
}

console.log(`\nFound ${entities.length} Cycling / Bicycle products.\n`);

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

let count = 0;
for (const entity of entities) {
  const slug = entity.title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const content = generatePage(entity);
  const outPath = join(OUT_DIR, `${slug}.md`);
  writeFileSync(outPath, content, 'utf-8');
  count++;
  process.stdout.write(`\r  [${count}/${entities.length}] ${entity.title}`);
}

console.log(`\n\n✅ Batch 1 complete. ${count} product spec pages generated.`);
console.log(`   Output directory: ${OUT_DIR}\n`);
