/**
 * Script to add SLM-related translation keys to all 9 language files.
 * Run: node scripts/translate-slm-keys.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '../src/i18n/translations');

// English source entries to add (as fallback)
const newEntries = `  "services.slmprocessbreakdown.badge": "SLM Process Mechanics",
  "services.slmprocessbreakdown.subtitle": "Three core mechanics powering our Selective Laser Melting process — from micro-laser scanning to complex topology generation.",
  "services.slmprocessbreakdown.0.title": "Monolithic Laser Micro-Scanning",
  "services.slmprocessbreakdown.0.subtitle": "Ytterbium Fiber Laser Focus ø 70 µm",
  "services.slmprocessbreakdown.0.desc": "High-energy Yb-fiber laser with precision focus down to 70 µm spot diameter — enabling ultra-crisp resolution profiles, fine feature reproduction, and sharp internal geometries in titanium powder beds.",
  "services.slmprocessbreakdown.0.cap0": "Yb-fiber laser output up to 400 W with variable pulse shaping",
  "services.slmprocessbreakdown.0.cap1": "Spot focus diameter tunable ø 70–100 µm for feature resolution control",
  "services.slmprocessbreakdown.0.cap2": "Galvanometer scanning speeds up to 7 m/s for rapid hatch filling",
  "services.slmprocessbreakdown.0.cap3": "Multi-strategy scanning: chessboard, stripe, and island pattern modes",
  "services.slmprocessbreakdown.1.title": "Micro-Layer Powder Bed Fusion",
  "services.slmprocessbreakdown.1.subtitle": "Layer Thickness 20 – 40 µm",
  "services.slmprocessbreakdown.1.desc": "Single-stroke recoater blade precisely deposits uniform powder layers with thickness tightly balanced between 20 µm and 40 µm — ensuring consistent melt pool dynamics and isotropic mechanical properties through the entire build height.",
  "services.slmprocessbreakdown.1.cap0": "Soft recoater blade system minimizes powder disruption on delicate features",
  "services.slmprocessbreakdown.1.cap1": "Layer thickness calibration within ±2 µm across full 250 mm platform",
  "services.slmprocessbreakdown.1.cap2": "Adaptive layer strategy: thin layers (20 µm) for fine surfaces, thick (40 µm) for core bulk",
  "services.slmprocessbreakdown.1.cap3": "Real-time melt pool monitoring for layer-to-layer consistency verification",
  "services.slmprocessbreakdown.2.title": "Complex Lattice & Organics Topology",
  "services.slmprocessbreakdown.2.subtitle": "Conformal Cooling, Lightweight Structures, Bio-Pores",
  "services.slmprocessbreakdown.2.desc": "Flawless tracking of conformal cooling channels, organic lightweight lattice structures, and bio-implant porous networks — enabling design freedom impossible with subtractive manufacturing while maintaining full structural integrity.",
  "services.slmprocessbreakdown.2.cap0": "Gyroid, diamond, and custom TPMS lattice generation for lightweighting",
  "services.slmprocessbreakdown.2.cap1": "Conformal cooling channel networks with smooth curvilinear paths",
  "services.slmprocessbreakdown.2.cap2": "Bio-implant porous structures with controlled pore size (200–800 µm)",
  "services.slmprocessbreakdown.2.cap3": "Support generation optimized for minimal post-processing touch-points",
  "services.slmmechanicaldashboard.badge": "Mechanical Properties",
  "services.slmmechanicaldashboard.subtitle": "Hard mechanical properties of our SLM Ti-6Al-4V components — validated per ASTM F2924 and ASTM F3302 aerospace specifications.",
  "services.slmmechanicaldashboard.metric0.label": "Build Chamber Footprint",
  "services.slmmechanicaldashboard.metric0.desc": "Industrial-grade build volume accommodating medium-to-large titanium components in a single print cycle — from aerospace brackets to medical implant arrays.",
  "services.slmmechanicaldashboard.metric1.label": "Tensile Strength (σb)",
  "services.slmmechanicaldashboard.metric1.desc": "Ultimate tensile strength surpassing forged Ti-6Al-4V properties — validated per ASTM F2924 with full-density microstructures free of lack-of-fusion porosity.",
  "services.slmmechanicaldashboard.metric2.label": "Yield Strength (σs)",
  "services.slmmechanicaldashboard.metric2.desc": "High yield strength achieved through optimized laser energy density and controlled cooling rates — ensuring elastic performance matching aerospace design allowables.",
  "services.slmmechanicaldashboard.metric3.label": "Fracture Elongation (A)",
  "services.slmmechanicaldashboard.metric3.desc": "High ductility bounds demonstrating excellent plastic deformation capacity before failure — critical for aerospace crash-worthiness and medical implant fatigue life.",
  "services.slmmechanicaldashboard.metric4.label": "Minimum Wall Resolution",
  "services.slmmechanicaldashboard.metric4.desc": "Fine structural wall capability down to 150 µm — enabling thin-walled lattice struts, compliant mechanisms, and intricate internal channel geometries without support structures.",
  "services.slmmechanicaldashboard.footnote": "Mechanical properties measured from as-built + stress-relieved condition. Post-HIP treatment can further enhance ductility and fatigue performance. All values per ASTM F2924 (Ti-6Al-4V).",
  "services.metallurgydefectcontrol.badge": "Metallurgical Control",
  "services.metallurgydefectcontrol.subtitle": "Eliminating internal defects in titanium SLM requires precise control of melt pool dynamics and atmospheric purity. Here's how we guarantee ≥99.5% density and zero oxide contamination.",
  "services.metallurgydefectcontrol.0.title": "Dynamic Melt Pool Control",
  "services.metallurgydefectcontrol.0.problem": "During SLM processing of titanium, unstable melt pool dynamics can cause balling (beading of molten material), lack-of-fusion porosity between adjacent scan tracks, and keyhole porosity from excessive energy density — all of which degrade relative material density below aerospace-acceptable thresholds of 99.5%.",
  "services.metallurgydefectcontrol.0.solution": "Optimized Laser Energy Density Parameters & Real-Time Melt Pool Monitoring",
  "services.metallurgydefectcontrol.0.detail0": "Volumetric energy density (VED) precisely tuned to 60-120 J/mm³ range for Ti-6Al-4V — balancing laser power (150-400 W), scan speed (600-1,200 mm/s), and hatch spacing (80-120 µm) to achieve stable conduction-mode melting without keyhole transition",
  "services.metallurgydefectcontrol.0.detail1": "Real-time melt pool monitoring via coaxial photodiode sensor — capturing melt pool emission intensity and geometry at 100 kHz sampling rate, enabling closed-loop power adjustment within individual scan vectors",
  "services.metallurgydefectcontrol.0.detail2": "Balling suppression through reduced oxygen content (<100 ppm) and optimized scan vector length (<5 mm island size) — eliminating capillary instability that causes droplet formation on molten track surfaces",
  "services.metallurgydefectcontrol.0.detail3": "Verification via Archimedes density measurement (ASTM B311) and cross-sectional micrograph analysis — consistently achieving ≥99.5% relative density with zero lack-of-fusion or keyhole porosity across all build positions",
  "services.metallurgydefectcontrol.1.title": "Full Argon Gas Cycle",
  "services.metallurgydefectcontrol.1.problem": "Titanium's extreme chemical reactivity at SLM processing temperatures (1,600-2,000°C in the melt pool) means that even trace oxygen contamination causes oxide inclusion formation, alpha-case embrittlement layers, and reduced fatigue performance. Additionally, laser-generated soot and spatter particles can become entrapped in subsequent layers if not continuously evacuated.",
  "services.metallurgydefectcontrol.1.solution": "Sub-100 ppm O₂ Chamber Atmosphere & Forced Micro-Filtration Loop",
  "services.metallurgydefectcontrol.1.detail0": "Dual zirconia oxygen sensors positioned at gas inlet and outlet ports — maintaining continuous real-time monitoring with automated argon purge activation if O₂ exceeds 100 ppm threshold, preventing build contamination within <2 seconds",
  "services.metallurgydefectcontrol.1.detail1": "Ultra-high-purity argon (99.999% grade) with laminar flow distribution across the powder bed — creating a positive-pressure inert gas curtain that prevents atmospheric oxygen ingress through the recoater slot and chamber seals",
  "services.metallurgydefectcontrol.1.detail2": "Forced micro-filtration recirculation loop (HEPA H13 + activated carbon) extracting laser-generated soot, condensate aerosols, and spatter particles at 200 CFM — maintaining optical clarity for the galvanometer system and preventing particle re-deposition on the powder bed",
  "services.metallurgydefectcontrol.1.detail3": "Closed-loop gas management system with automated regeneration — argon consumption optimized via oxygen feedback, reducing operational costs while maintaining sub-100 ppm atmosphere across continuous 120+ hour print runs"`;

const languages = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

for (const lang of languages) {
  const filePath = path.join(dir, `${lang}.json`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.trimEnd();
  
  if (content.endsWith('}')) {
    content = content.slice(0, -1).trimEnd();
    if (!content.endsWith(',')) {
      content += ',';
    }
    content += '\n' + newEntries + '\n}';
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${lang}.json`);
}

console.log('\nAll 9 language files updated!');