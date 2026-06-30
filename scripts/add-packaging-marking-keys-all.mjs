/**
 * Add ALL packaging + marking component keys to all 10 languages.
 * Components: PackagingProcessSpectrum, PackagingSpecsDashboard, 
 * SmearingWarehouseInterlockKnowHow, PackagingDedicatedCta,
 * MarkingProcessSpectrum, MarkingSpecsDashboard,
 * ThermalStressContrastKnowHow, MarkingDedicatedCta
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN = path.resolve(DIR, 'en.json');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const LANGS = ['de','fr','es','pt','it','ko','nl','pl'];
const LN = { de:'German', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

// ============ PACKAGING PROCESS SPECTRUM ============
const ppEn = {
  "services.packagingprocessspectrum.badge": "Packaging Solutions",
  "services.packagingprocessspectrum.title_prefix": "Packaging ",
  "services.packagingprocessspectrum.subtitle": "Three dedicated titanium logistics protection workflows — engineered for precision foam nesting, marine-grade corrosion barriers, and heavy-lift export crating.",
  "services.packagingprocessspectrum.card1.title": "Custom Form-Fitting CNC Foam",
  "services.packagingprocessspectrum.card1.desc": "Milling high-density acid-free EPE/EVA cavities matched to individual 3D component CAD profiles to fully block transit vibrations and eliminate surface contact abrasion.",
  "services.packagingprocessspectrum.card1.cap0": "CNC-routed 3D foam cavity milling from EPE or EVA — densities from 20–100 kg/m³ per application",
  "services.packagingprocessspectrum.card1.cap1": "Cavities matched directly from customer STEP/IGES CAD files, ensuring ±0.5 mm fit tolerance for each component contour",
  "services.packagingprocessspectrum.card1.cap2": "Acid-free certified foam formulations (pH 6.5–7.5 per TAPPI T 509) — zero outgassing or chemical migration onto polished/anodized titanium surfaces",
  "services.packagingprocessspectrum.card1.cap3": "Multi-layer nesting: individual components sealed in separated cavities with 50 mm minimum foam walls for impact energy dissipation",
  "services.packagingprocessspectrum.card2.title": "VCI Marine Corrosion Barriers",
  "services.packagingprocessspectrum.card2.desc": "Deploying anti-static vacuum-sealed Volatile Corrosion Inhibitor films to emit protective atmospheres, isolating alloy skins from ocean salt-spray during sea freight.",
  "services.packagingprocessspectrum.card2.cap0": "Multi-layer VCI film construction: anti-static polyethylene outer, VCI-impregnated middle layer, and low-friction inner contact ply",
  "services.packagingprocessspectrum.card2.cap1": "Vacuum-sealed enclosure emits continuous molecular VCI vapor (amine carboxylates) that forms a mono-molecular protective layer on all exposed metal surfaces",
  "services.packagingprocessspectrum.card2.cap2": "Zero VCI residue on titanium — films leave no trace after unwrapping, eliminating post-shipment cleaning for downstream assembly lines",
  "services.packagingprocessspectrum.card2.cap3": "Validated for 24-month continuous anti-corrosion protection in ASTM D1749 marine environment simulation (40°C, 95% RH, salt-fog cyclic)",
  "services.packagingprocessspectrum.card3.title": "ISPM-15 Certified Export Crating",
  "services.packagingprocessspectrum.card3.desc": "Constructing heavy-duty non-fumigation plywood enclosures with localized structural tie-downs to secure heavy multi-ton assemblies under rough crane lifts and container stacking.",
  "services.packagingprocessspectrum.card3.cap0": "100% ISPM-15 compliant heat-treated (HT) plywood and timber — certified phytosanitary, requires no methyl bromide fumigation",
  "services.packagingprocessspectrum.card3.cap1": "Engineered structural tie-down points with threaded steel inserts rated to 5,000 kg per anchor point — secured to crate base via M16 bolts",
  "services.packagingprocessspectrum.card3.cap2": "Finite element analysis (FEA) optimized crate designs for multi-ton assemblies — validated to withstand 8-point container stacking loads at sea",
  "services.packagingprocessspectrum.card3.cap3": "Full documentation package: ISPM-15 stamp, packing list, photo log, and lift/crane instruction diagrams affixed to crate exterior"
};

// ============ PACKAGING SPECS DASHBOARD ============
const pdEn = {
  "services.packagingspecsdashboard.badge": "Packaging Specifications",
  "services.packagingspecsdashboard.title_prefix": "Packaging ",
  "services.packagingspecsdashboard.subtitle": "Our packaging chemical purity limits, structural toughness credentials, corrosion barrier duration, and ERP-integrated traceability benchmarks.",
  "services.packagingspecsdashboard.footnote": "All specifications measured under ISTA 2A/3A transit testing, ASTM D1749 corrosion simulation, and TAPPI T 509 purity standards. Actual results depend on component geometry, shipping route, and environmental conditions.",
  "services.packagingspecsdashboard.metric0.label": "Liner Purity Index",
  "services.packagingspecsdashboard.metric0.desc": "100% acid-free chemical boundaries ensuring zero microscopic degradation on anodized films — pH 6.5–7.5 certified per TAPPI T 509 for all foam and liner contact materials.",
  "services.packagingspecsdashboard.metric1.label": "Transit Drop Protection",
  "services.packagingspecsdashboard.metric1.desc": "Fully compliant under strict ISTA 2A / 3A sequential shock and drop configurations — validated via accelerometer-instrumented package testing for global freight conditions.",
  "services.packagingspecsdashboard.metric2.label": "VCI Shield Lifespan",
  "services.packagingspecsdashboard.metric2.desc": "Securing up to 24 Months continuous anti-corrosion barrier tracking inside harsh cargo holds — validated per ASTM D1749 marine environment simulation at 40°C, 95% RH.",
  "services.packagingspecsdashboard.metric3.label": "Bay Sorting Traceability",
  "services.packagingspecsdashboard.metric3.desc": "100% digital labeling integration compatible with customer-side ERP/SAP scanning grids — custom barcodes, QR codes, and serialized labels for reverse auditing to raw Heat Numbers."
};

// ============ SMEARING WAREHOUSE INTERLOCK KNOW-HOW ============
const swEn = {
  "services.smearingwarehouseinterlockknowhow.badge": "Logistics Engineering",
  "services.smearingwarehouseinterlockknowhow.title_prefix": "Smearing Prevention & ",
  "services.smearingwarehouseinterlockknowhow.subtitle": "Two critical packaging challenges — conquering transit smear damage on polished surfaces and locking down full ERP traceability from outfeed packing to customer receipt.",
  "services.smearingwarehouseinterlockknowhow.card1.title": "Molecular Anti-Friction Liners",
  "services.smearingwarehouseinterlockknowhow.card1.problem": "During transit, micro-vibrations from truck/sea freight cause polished titanium surfaces to slide against standard packaging foams, generating fine metallic smear tracks — compromising mirror-finish surfaces and requiring costly re-polishing before customer acceptance.",
  "services.smearingwarehouseinterlockknowhow.card1.solution": "Ultra-Clean Low-Friction Films or Medical Non-Woven Sheets Before Foam Nesting — Bleeding Off Friction Stress to Lock Out Transport Scuffs",
  "services.smearingwarehouseinterlockknowhow.card1.detail0": "Polished titanium components are first enclosed in ultra-clean low-friction films (PE micro-perforated slip film, µ_k < 0.15) or medical-grade non-woven spunbond polyester sheets (50 g/m², pH neutral)",
  "services.smearingwarehouseinterlockknowhow.card1.detail1": "Primary low-friction layer bleeds off tangential sliding stress (coefficient of friction < 0.2) preventing metal-to-foam abrasion during shock events",
  "services.smearingwarehouseinterlockknowhow.card1.detail2": "Secondary foam cavity (CNC-machined EPE/EVA) provides structural vibration damping — load path isolated from polished surfaces by the anti-friction interface layer",
  "services.smearingwarehouseinterlockknowhow.card1.detail3": "Validated via 1,000 km simulated truck transport (ISTA 3E) with zero smear tracks on Ra 0.02 µm polished titanium witness coupons — verified by white light interferometry",
  "services.smearingwarehouseinterlockknowhow.card2.title": "ERP-Linked Branding & Client Barcoding",
  "services.smearingwarehouseinterlockknowhow.card2.problem": "Traditional manual labeling during outfeed packaging introduces data transcription errors, lost traceability chains, and inability to rapidly reverse-audit shipped components back to specific raw material heat numbers for quality incident investigations.",
  "services.smearingwarehouseinterlockknowhow.card2.solution": "Syncing Outfeed Packing Tracking with Digital Databases — Custom Branded Logos Alongside User-Specific Barcodes/QR Codes for Seamless Reverse Material Auditing",
  "services.smearingwarehouseinterlockknowhow.card2.detail0": "Outfeed packing station integrated with customer ERP/SAP via API — each package label is auto-generated with PO number, line item, heat number, and serialized UID",
  "services.smearingwarehouseinterlockknowhow.card2.detail1": "Custom-branded packaging with customer logos, part numbers, and handling instructions printed directly onto labels — eliminating manual stenciling and mislabeling risk",
  "services.smearingwarehouseinterlockknowhow.card2.detail2": "2D Data Matrix / QR codes encoding full traceability chain: raw material heat → manufacturing batch → inspection results → packaging date → shipping tracking number",
  "services.smearingwarehouseinterlockknowhow.card2.detail3": "Reverse material auditing capability: scanning any shipped component QR code retrieves full manufacturing history back to original titanium ingot Heat Number and mill certificate within 3 seconds",
  "services.smearingwarehouseinterlockknowhow.footer": "Every packaging project is backed by anti-friction interface engineering, ERP-integrated labeling systems, and full chain-of-custody traceability."
};

// ============ PACKAGING DEDICATED CTA ============
const pcEn = {
  "services.packagingdedicatedcta.badge": "24-Hour Packaging Quote",
  "services.packagingdedicatedcta.desc": "Aerospace procurement managers, defense program leads, and high-value medical device developers — upload your shipping protocols, component CAD files, and delivery requirements for a rapid 24-hour packaging quote with full logistics engineering assessment. Fully confidential under NDA.",
  "services.packagingdedicatedcta.trust0": "NDA Protected",
  "services.packagingdedicatedcta.trust1": "ISTA 2A/3A / ISPM-15 Certified",
  "services.packagingdedicatedcta.trust2": "Response Within 24 Hours"
};

// ============ MARKING PROCESS SPECTRUM ============
const mpEn = {
  "services.markingprocessspectrum.badge": "Marking Technologies",
  "services.markingprocessspectrum.title_prefix": "Marking ",
  "services.markingprocessspectrum.subtitle": "Three dedicated titanium laser personalization and traceability workflows — engineered for pigment-free annealing, permanent deep engraving, and production-scale serialization.",
  "services.markingprocessspectrum.card1.title": "Laser Annealing",
  "services.markingprocessspectrum.card1.desc": "Inducing localized subsurface phase transformations to grow dense, pigment-free dark TiO₂ layers, custom-built to retain 100% sterile anti-corrosion bounds on medical tools.",
  "services.markingprocessspectrum.card1.cap0": "Low-power pulsed fiber laser (10–30 W, 1064 nm) induces controlled subsurface Ti→TiO₂ phase transformation without ablating surface material",
  "services.markingprocessspectrum.card1.cap1": "Produces dense, pigment-free dark marks (charcoal to black) via oxide layer thickness interference — zero added inks or chemical pigments",
  "services.markingprocessspectrum.card1.cap2": "Mark retains 100% of original surface anti-corrosion properties — validated via ASTM B117 salt spray (1,000+ hours zero-fading)",
  "services.markingprocessspectrum.card1.cap3": "Ideal for medical instruments: mark depth < 5 µm leaves no crevices for bacterial colonization, fully sterilizable via autoclave, gamma, and EtO cycles",
  "services.markingprocessspectrum.card2.title": "Architectural Deep Engraving",
  "services.markingprocessspectrum.card2.desc": "Vaporizing designated metal matrices under controlled multi-pass frequencies to generate physical micro-grooves that outlast heavy post-blasting and chemical etching runs.",
  "services.markingprocessspectrum.card2.cap0": "Multi-pass Q-switched fiber laser (30–100 W) with galvo scanning head — each pass removes 5–15 µm of material for controlled depth engraving (20–500 µm)",
  "services.markingprocessspectrum.card2.cap1": "Physical micro-grooves create tactile, permanent marks that withstand post-processing blasting, chemical etching, and passivation baths",
  "services.markingprocessspectrum.card2.cap2": "Engraving depth and width independently programmable — fine text (0.2 mm stroke) to deep serial numbers (0.5 mm deep) on the same part",
  "services.markingprocessspectrum.card2.cap3": "Process validated for titanium alloys Grade 2, 5 (Ti-6Al-4V), and 23 (Ti-6Al-4V ELI) with consistent ±5 µm depth repeatability",
  "services.markingprocessspectrum.card3.title": "UID & DataMatrix Serialization",
  "services.markingprocessspectrum.card3.desc": "Executing high-speed, synchronized dynamic array engraving to print individual barcodes directly linked to production databases for instant tracking readout profiles.",
  "services.markingprocessspectrum.card3.cap0": "Synchronized dynamic marking at speeds up to 200 characters/second — each part receives a unique serialized UID or 2D DataMatrix code in < 1 second cycle time",
  "services.markingprocessspectrum.card3.cap1": "Direct database integration: serial numbers auto-generated and synced to ERP/MES — no operator data entry, zero transcription errors",
  "services.markingprocessspectrum.card3.cap2": "DataMatrix codes compliant with MIL-STD-130 (defense UID) and UDI (Unique Device Identification) per FDA 21 CFR Part 830",
  "services.markingprocessspectrum.card3.cap3": "Readable at > 99.5% first-pass scan rate across all titanium surface conditions (polished, anodized, matte, passivated) — verified across 10,000+ production parts"
};

// ============ THERMAL STRESS CONTRAST KNOW-HOW ============
const tsEn = {
  "services.thermalstresscontrastknowhow.badge": "Contrast Control Engineering",
  "services.thermalstresscontrastknowhow.subtitle": "Two critical laser marking challenges — preventing thermal stress micro-cracking during deep engraving and achieving contrast consistency across batch runs and varying titanium surface conditions.",
  "services.thermalstresscontrastknowhow.card1.title": "Thermal Stress Micro-Crack Prevention",
  "services.thermalstresscontrastknowhow.card1.problem": "During high-power laser deep engraving (30–100 W), rapid localized heating and cooling cycles generate thermal shock stress micro-cracks in the heat-affected zone — compromising component fatigue life and creating sites for corrosion initiation in mission-critical titanium parts.",
  "services.thermalstresscontrastknowhow.card1.solution": "Multi-Pass Low-Energy Scanning Loops + Cryogenic Air Assist Cooling (+5°C to -10°C) to Absorb Thermal Shock Between Each Pass",
  "services.thermalstresscontrastknowhow.card1.detail0": "Multi-pass strategy: instead of single-pass deep engraving, 10–50 shallow passes (5–15 µm per pass) distribute thermal load over multiple cycles — peak temperature per pass reduced by 60% vs. single-pass approach",
  "services.thermalstresscontrastknowhow.card1.detail1": "Cryogenic air assist cooling nozzle delivers chilled air stream (+5°C to -10°C) directly to the engraving zone between passes — extracting heat before it diffuses into the substrate and creates thermal gradient stress",
  "services.thermalstresscontrastknowhow.card1.detail2": "Inter-pass dwell time (50–200 ms) programmed into the marking sequence — allowing the localized heat to dissipate before the next laser pass begins, preventing cumulative heat build-up",
  "services.thermalstresscontrastknowhow.card1.detail3": "Validated via metallographic cross-section examination: zero micro-cracks in heat-affected zone across 1,000+ engraved titanium samples (Grade 2, 5, 23) — verified by SEM at 500× magnification",
  "services.thermalstresscontrastknowhow.card2.title": "Contrast Consistency Across Batches",
  "services.thermalstresscontrastknowhow.card2.problem": "Titanium surface condition variations (as-machined Ra 0.4–3.2 µm, anodized colors, passivated layers, or heat-treated oxide films) cause inconsistent laser energy absorption — resulting in variable mark darkness, readability failures, and aesthetic rejection across batch runs.",
  "services.thermalstresscontrastknowhow.card2.solution": "Dynamic Laser Power Modulation (50–100% Peak) via Real-Time Surface Reflectivity Feedback — Auto-Compensating for Surface Condition Variations",
  "services.thermalstresscontrastknowhow.card2.detail0": "Real-time surface reflectivity monitoring via co-axial photodiode — laser power is dynamically modulated (50–100% of peak) within microseconds to compensate for surface condition variations across the marking field",
  "services.thermalstresscontrastknowhow.card2.detail1": "Pre-scan calibration routine: a low-power test pulse matrix maps surface reflectivity across the entire marking area — power profile adjustments are computed and applied before the main marking pass begins",
  "services.thermalstresscontrastknowhow.card2.detail2": "Closed-loop contrast verification: integrated vision system captures mark contrast immediately after marking — if below ΔE threshold (> 40% contrast vs. background), an automated re-mark cycle is triggered with adjusted parameters",
  "services.thermalstresscontrastknowhow.card2.detail3": "Validated across 50+ production batches: consistent mark contrast ΔE > 40% across as-machined, anodized (gold, blue, purple), passivated, and heat-treated titanium surfaces — zero readability failures in automated vision inspection",
  "services.thermalstresscontrastknowhow.footer": "Every laser marking project is backed by thermal stress simulation, cryogenic cooling validation, and real-time contrast quality assurance."
};

// ============ MARKING SPECS DASHBOARD + CTA ============
const msEn = {
  "services.markingspecsdashboard.badge": "Laser Marking Specifications",
  "services.markingspecsdashboard.subtitle": "Our laser marking processing resolutions — annealing depth limits, engraving depth boundaries, serialization speed, and contrast quality thresholds.",
  "services.markingspecsdashboard.footnote": "All specifications measured under ISO/IEC 15416 barcode grading, ASTM B117 corrosion testing, and controlled laboratory conditions. Actual results depend on titanium grade, surface finish, and marking geometry.",
  "services.markingspecsdashboard.metric0.label": "Annealing Penetration Depth",
  "services.markingspecsdashboard.metric0.desc": "Ultrathin subsurface oxide layer depth for pigment-free dark marks — preserving surface integrity and anti-corrosion properties for medical and aerospace components.",
  "services.markingspecsdashboard.metric1.label": "Engraving Depth Range",
  "services.markingspecsdashboard.metric1.desc": "Controlled material removal depth span for tactile, permanent marks — from fine text to deep serial numbers, independently programmable on the same component.",
  "services.markingspecsdashboard.metric2.label": "Serialization Throughput",
  "services.markingspecsdashboard.metric2.desc": "High-speed dynamic marking throughput for production-scale UID/DataMatrix serialization — each part uniquely identified in under one second.",
  "services.markingspecsdashboard.metric3.label": "Mark Contrast Threshold",
  "services.markingspecsdashboard.metric3.desc": "Minimum achievable contrast ratio between laser mark and surrounding surface — ensuring reliable first-pass readability across all titanium surface conditions.",
  "services.markingdedicatedcta.badge": "24-Hour Engineering Review",
  "services.markingdedicatedcta.desc": "Medical device engineers, aerospace traceability managers, and defense contractors — submit your part drawings, marking specifications, and serialization requirements for a rapid 24-hour engineering review with full laser process feasibility assessment. Fully confidential under NDA.",
  "services.markingdedicatedcta.trust0": "NDA Protected",
  "services.markingdedicatedcta.trust1": "MIL-STD-130 / FDA UDI Compliant",
  "services.markingdedicatedcta.trust2": "Response Within 24 Hours"
};

// ============ ALL ENGLISH KEYS ============
const allEn = {...ppEn, ...pdEn, ...swEn, ...pcEn, ...mpEn, ...tsEn, ...msEn};
const allKeys = Object.keys(allEn);

console.log(`Total new keys to add: ${allKeys.length}`);

function updateEn() {
  const en = JSON.parse(fs.readFileSync(EN, 'utf-8'));
  for (const [k,v] of Object.entries(allEn)) { en[k] = v; }
  const s = {};
  for (const k of Object.keys(en).sort()) { s[k] = en[k]; }
  fs.writeFileSync(EN, JSON.stringify(s, null, 2), 'utf-8');
  console.log('  en.json: Updated');
}

function updateJa() {
  // Use DeepSeek API to translate all keys to Japanese since there are so many
  // We'll handle JA in the translate step along with other languages
  console.log('  ja.json: Will be translated via API with other languages');
}

function updateHeroJa() {
  // Translate the hardcoded hero badge/subtitle for both pages
  const jaPath = path.resolve(DIR, 'ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  
  // These exist already from previous translations, adding defaults
  // if they don't exist (will be translated via API anyway)
  const heroDefaults = {
    "branded-custom-packaging-services.hero.badge": "Industrial Logistics Protection",
    "branded-custom-packaging-services.hero.subtitle": "End-to-end titanium logistics and structural asset protection solutions — from CNC-machined foam cavities and VCI anti-corrosion barriers to ISPM-15 export crating with full ERP traceability integration."
  };
  for (const [k, v] of Object.entries(heroDefaults)) {
    if (!(k in ja) || ja[k] === "") { ja[k] = v; }
  }
  
  const s = {};
  for (const k of Object.keys(ja).sort()) { s[k] = ja[k]; }
  fs.writeFileSync(jaPath, JSON.stringify(s, null, 2), 'utf-8');
}

async function translateAllLangs() {
  for (const lang of ['ja', ...LANGS]) {
    const en = JSON.parse(fs.readFileSync(EN, 'utf-8'));
    const lf = path.resolve(DIR, `${lang}.json`);
    const ld = JSON.parse(fs.readFileSync(lf, 'utf-8'));
    
    const untranslated = allKeys.filter(k => !(k in ld) || ld[k] === en[k]);
    if (untranslated.length === 0) { console.log(`  ${lang}: none`); continue; }
    
    const toT = {};
    for (const k of untranslated) { toT[k] = en[k]; }
    const entries = Object.entries(toT);
    
    const BS = 30;
    const batches = [];
    for (let i = 0; i < entries.length; i += BS) batches.push(entries.slice(i, i+BS));
    
    let tr = 0, errs = 0;
    for (let i = 0; i < batches.length; i++) {
      const ji = JSON.stringify(Object.fromEntries(batches[i]), null, 2);
      const prompt = `Professional ${LN[lang]||'Japanese'} translator for industrial titanium manufacturing/packaging/laser marking website.
Translate English JSON to ${LN[lang]||'Japanese'}.

RULES:
- Keep: CNC, VCI, EPE, EVA, ISPM-15, ISTA, ERP, SAP, FEA, CMM, HAZ, SEM, UDI, UID, MIL-STD, FDA, ASTM, TAPPI, Ra, pH, mm, kg, W, nm, µm
- Keep measurements: "±0.5 A", "150 mm", "60,000 PSI", "ø 1.0 mm", "5,000 kg", "M16"
- Keep special chars: "—", "±", "×", ">", "<", "°", "ø", "µm", "nm", "→", "%"
- Translate VALUES only, keep KEYS as-is
- Return ONLY valid JSON

Batch ${i+1}/${batches.length}:
\`\`\`json
${ji}
\`\`\``;

      try {
        const r = await fetch(API_URL, {
          method:'POST',
          headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEY}`},
          body: JSON.stringify({
            model:'deepseek-chat',
            messages:[
              {role:'system',content:`Professional ${LN[lang]||'Japanese'} translator for industrial content. Return ONLY valid JSON.`},
              {role:'user',content:prompt}
            ],
            temperature:0.1, max_tokens:16000
          })
        });
        if (!r.ok) throw new Error(`API ${r.status}`);
        const d = await r.json();
        const c = d.choices[0].message.content.trim();
        const m = c.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || c.match(/{[\s\S]*}/);
        const res = JSON.parse(m ? m[1]||m[0] : c);
        for (const [k,v] of Object.entries(res)) { if (v && typeof v === 'string') { ld[k] = v; tr++; } }
      } catch (err) { console.error(`  ✗ ${lang} batch ${i+1}: ${err.message}`); errs++; }
      if (i < batches.length-1) await new Promise(r => setTimeout(r, 500));
    }
    
    const s = {};
    for (const k of Object.keys(ld).sort()) { s[k] = ld[k]; }
    fs.writeFileSync(lf, JSON.stringify(s, null, 2), 'utf-8');
    console.log(`  ${lang}: +${tr}, err: ${errs}`);
  }
}

async function main() {
  console.log('Step 1: Update en.json'); updateEn();
  console.log('Step 2: Translate all languages (9 langs, 1 batch each)...');
  await translateAllLangs();
  console.log('\nALL DONE!');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });