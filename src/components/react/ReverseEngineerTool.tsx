import { useState, useMemo } from 'react';

/* ── Knowledge Base ── */

interface PartProfile {
  keywords: string[];            // 匹配关键词
  industries: string[];          // Industries
  category: string;              // Category
  geometry: string;              // Geometry
  painPoints: string[];          // Pain points
  alloyId: string;               // Recommended alloy
  alloyReason: string;           // Selection reason
  formId: string;                // Raw material form
  formReason: string;            // Form selection reason
  process: string[];             // Recommended process
  tollServices: string[];        // Toll processing services
  pitfalls: string[];            // Pitfalls
  specNote: string;              // Procurement spec notes
  servicePage: string;           // Related service page
  image: string;                 // Emoji icon
}

const ALLOYS: Record<string, string> = {
  'cp1': 'Grade 1 CP-Ti — Pure Ti, highest ductility',
  'cp2': 'Grade 2 CP-Ti — Industrial pure Ti, general corrosion resistance',
  'cp3': 'Grade 3 CP-Ti — Medium strength CP Ti',
  'tc4': 'Grade 5 Ti-6Al-4V — General alpha-beta alloy, high strength',
  'tc4eli': 'Grade 23 Ti-6Al-4V ELI — Ultra-low interstitial, implant grade',
  'ta9': 'Grade 7 Ti-0.15Pd — Pd modified, strong acid resistant',
  'ta10': 'Grade 12 Ti-0.3Mo-0.8Ni — Mo-Ni modified, chemical grade',
  'ta18': 'Grade 9 Ti-3Al-2.5V — Medium strength, good formability',
  'betac': 'Beta-C (Ti-3Al-8V-6Cr-4Mo-4Zr) — High-strength beta alloy, excellent spring properties, high fatigue life',

  'ti6242': 'Ti-6242 (Ti-6Al-2Sn-4Zr-2Mo) — Near-alpha, high-temp creep resistance up to 520C',
  'ti1100': 'Ti-1100 — Creep-resistant near-alpha alloy, service up to 600C',
  'gammatial': 'Gamma-TiAl (Ti-48Al-2Cr-2Nb) — Intermetallic, 50% lighter than Ni superalloys, up to 750C',
  'ti1023': 'Ti-1023 (Ti-10V-2Fe-3Al) — Beta alloy, ultra-high strength >1100MPa, high fracture toughness',
  'ti153': 'Ti-15V-3Cr-3Sn-3Al — Beta alloy, high strength, excellent cold formability',
  'ti65': 'Ti-65 (Ti-6Al-4Sn-9Zr-1Mo-1W-0.3Si) — High-temp titanium for 600-650C service',
  'ti52sn': 'Ti-5Al-2.5Sn ELI — Near-alpha alloy, cryogenic grade, excellent low-temp toughness',
  'nitinol': 'Nitinol (Ni-Ti Shape Memory Alloy) — Superelastic, shape memory effect, high damping',
};

const FORMS: Record<string, string> = {
  'bar': 'Round Bar / Rod — for turning, fasteners',
  'plate': 'Plate / Sheet — for welding, machined housings',
  'tube': 'Seamless Tube — for fluid systems, heat exchangers',
  'forging': 'Die Forging / Ring — for high-stress critical parts',
  'wire': 'Wire / Small Bar — for fasteners, springs, medical',
};

/* ── Part Knowledge Base ── */

const PART_DB: PartProfile[] = [
  {
    keywords: ['阀针', '阀杆', '阀芯', '阀门', 'valve', 'needle', 'stem', 'nozzle'],
    industries: ['Energy', 'Chemical', 'Hydrogen', 'Oil & Gas'],
    category: 'Valves / Fluid Control Components',
    geometry: 'Slender shaft, small diameter, high aspect ratio, precision conical/spherical sealing surface',
    painPoints: ['High-pressure sealing', 'High-frequency switching impact', 'Media corrosion', 'Hydrogen embrittlement', 'Micro-leakage'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers high strength (yield>=830MPa) and good toughness with superior hydrogen embrittlement resistance vs CP-Ti. Use TC4 ELI for biocompatibility requirements.',
    formId: 'bar',
    formReason: 'Slender shafts suitable for Swiss-type turning from bar stock, 60-70% material utilization, 50% cost reduction vs plate cutting + welding.',
    process: ['Swiss-type precision turning', 'CBN tool finishing', 'High-precision grinding'],
    tollServices: ['Cylindrical / centerless grinding', 'PVD / DLC coating', 'Laser marking (traceability code)'],
    pitfalls: ['Aspect ratio >10:1 causes tool deflection; use step machining or steady rest', 'Taper sealing surface requires Ra<=0.2um; ultra-precision grinding needed'],
    specNote: 'Annealed (A), UT Class B, Ra<=0.4um, sealing surface Ra<=0.2um',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🔧',
  },
  {
    keywords: ['叶片', '叶轮', 'impeller', 'blade', 'fan', '涡轮', 'propeller'],
    industries: ['Aerospace', 'Energy', 'Marine'],
    category: 'Impellers / Blades (Rotational)',
    geometry: 'Complex 3D curved surfaces, thin-wall twisted blades, integral hub-blade structure',
    painPoints: ['High-speed centrifugal force', 'Cyclic fatigue', 'High temperature', 'Cavitation erosion', 'Dynamic balancing'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers excellent specific strength (~230MPa/g·cm-3) and fatigue life (10^7 cycles >=500MPa). Industry standard for aero engine and compressor impellers.',
    formId: 'forging',
    formReason: 'Die forging optimizes grain flow along blade contour, improving fatigue life by 30%+ vs bar milling, reducing waste by 90%.',
    process: ['5-axis simultaneous CNC milling', 'Adaptive machining', 'Vibratory finishing'],
    tollServices: ['5-axis machining center', 'CMM inspection', 'Dynamic balancing test', 'FPI (fluorescent penetrant inspection)'],
    pitfalls: ['Thin blade (<1mm) risks distortion; use high-speed milling with stress-relief toolpath', 'G2.5 balance grade is challenging; requires iterative compensation'],
    specNote: 'Die forging, AMS 4928, Annealed, 100% FPI + UT Class A, Balance G2.5',
    servicePage: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    image: '🌀',
  },
  {
    keywords: ['植入', '骨钉', '骨板', '髋关节', '膝关节', '脊柱', 'implant', 'screw', 'plate', 'hip', 'knee'],
    industries: ['Medical Device'],
    category: 'Medical Implants',
    geometry: 'Small precision part, complex curved surfaces (articular), hex/cross drive, self-tapping thread',
    painPoints: ['Biocompatibility', 'Fatigue fracture', 'Osseointegration', 'Sterile processing', 'Stress shielding'],
    alloyId: 'tc4eli',
    alloyReason: 'Grade 23 ELI (ASTM F136) is the standard for surgical implants. Extra-low interstitials (O<=0.13%) improve fracture toughness. Do not substitute industrial TC4.',
    formId: 'bar',
    formReason: 'Bar is the standard form for bone screws/plates. Single-setup Swiss turning, good surface quality, batch consistency.',
    process: ['Automatic Swiss turning', 'Thread rolling / forming', 'Electrochemical polishing'],
    tollServices: ['Passivation (ASTM F86)', 'Cleaning & packaging (Class 8 cleanroom)', 'Laser marking (UDI code)'],
    pitfalls: ['Self-tapping threads require no burrs; use thread rolling instead of cutting', 'Implant surface must be free of iron contamination; use dedicated Ti-alloy tooling'],
    specNote: 'ASTM F136, Annealed, 100% dimensional inspection + surface contamination test, sterile packaging',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🏥',
  },
  {
    keywords: ['换热器', '热交换', '管板', '管道', '冷却', '反应釜', 'heat exchanger', 'tube', 'pipe'],
    industries: ['Chemical', 'Energy', 'Marine', 'Desalination'],
    category: 'Heat Exchangers / Piping Systems',
    geometry: 'Tube/plate assembly structure, tube sheet + bundle + shell, extensive drilled holes',
    painPoints: ['Crevice corrosion', 'Fluid erosion', 'Tube sheet sealing', 'Thermal stress', 'Chloride stress corrosion'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 (CP-Ti) offers excellent corrosion resistance in seawater and chlorides (potential >+0.8V vs SCE) at moderate cost. Upgrade to Grade 7/12 for strong reducing acids.',
    formId: 'tube',
    formReason: 'Seamless tube is standard for heat exchanger bundles. Mature sizes (OD 6-50mm), short lead time, controlled cost.',
    process: ['Tube sheet drilling', 'Tube end expansion / seal welding', 'Shell and channel welding'],
    tollServices: ['Deep hole drilling (tube sheet)', 'Automatic TIG welding (tube end)', 'Hydrostatic test', 'Pickling & passivation'],
    pitfalls: ['Ti tube-to-sheet weld requires 99.999% argon; back-purge to prevent oxidation', 'Tube sheet hole tolerance H8 or better for expansion joint sealing integrity'],
    specNote: 'ASTM B338 Gr2 seamless tube, Annealed, 100% hydrostatic test + eddy current (ET)',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🔥',
  },
  {
    keywords: ['外壳', '腔体', '容器', '箱体', 'housing', 'chamber', 'enclosure', 'vessel'],
    industries: ['Aerospace', 'Medical', 'Chemical', 'Semiconductor'],
    category: 'Housings / Chambers / Enclosures',
    geometry: 'Box/cylindrical thin-wall structure with mounting lugs, flanges, viewports',
    painPoints: ['Overall stiffness', 'Sealing integrity', 'Welding distortion', 'Weight reduction', 'Internal cleanliness'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers 45% weight reduction vs stainless steel. For aerospace/medical housings. Use Grade 2 CP-Ti if only corrosion resistance needed.',
    formId: 'plate',
    formReason: 'Plate welding is most economical for housings. CNC cutting + automated welding reduces allowance. Consider investment casting for high volume.',
    process: ['CNC cutting / profile cutting', 'TIG/MIG welding', '5-axis milling of faces', 'Stress relief heat treatment'],
    tollServices: ['Laser / waterjet cutting', 'Vacuum brazing (if required)', 'Pressure test', 'Surface blasting / passivation'],
    pitfalls: ['Ti alloy welding distortion is significant; use fixtures and pre-set compensation', 'Post-weld stress relief annealing required (600-650°C / 2h)'],
    specNote: 'ASTM B265 Gr5 annealed plate, post-weld stress relief, 100% PT',
    servicePage: '/titanium-fabrication-services/',
    image: '📦',
  },
  {
    keywords: ['螺栓', '螺母', 'Fasteners', '螺钉', '螺柱', '垫圈', 'bolt', 'nut', 'fastener', 'screw', 'stud'],
    industries: ['Aerospace', 'Chemical', 'Marine', '医疗'],
    category: 'Fasteners',
    geometry: 'Standard/custom threaded parts, small sizes, various head types (hex/socket/flat)',
    painPoints: ['Thread strength', 'Galling', 'Hydrogen embrittlement', 'Torque control', 'Heat-resistant loosening'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) is standard for aerospace fasteners. Lower strength than TC4 but better cold heading formability. Grade 5 for high-strength bolts.',
    formId: 'wire',
    formReason: 'Wire/small bar is the standard form for fasteners. Direct cold/hot heading, material utilization >95%.',
    process: ['Cold / hot heading forming', 'Thread rolling', 'Heat treatment', 'Surface treatment'],
    tollServices: ['Vacuum annealing', 'Anodizing (AMS 2488)', 'Batch testing (mechanical + metallographic)'],
    pitfalls: ['Ti fasteners require anti-galling coating (Al-bronze plating, MoS2 coating)', 'Thread rolling gives 30% higher strength than cutting; rolling is mandatory'],
    specNote: 'AMS 4934 / ASTM B348 Gr9, solution+aged (STA), 100% thread inspection',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🔩',
  },
  {
    keywords: ['支架', ' bracket', 'fitting', '连接件', '接头', 'connector', 'adapter'],
    industries: ['Aerospace', 'Automotive', 'General Industry'],
    category: 'Brackets / Fittings / Connectors',
    geometry: 'L/T-shaped or irregular structural parts with mounting holes, weight reduction pockets, ribs',
    painPoints: ['Vibration fatigue', 'Multi-axial stress', 'Weight reduction', 'Installation alignment precision'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers excellent mechanical properties and weight reduction (4.43g/cm3). Standard for aerospace brackets.',
    formId: 'plate',
    formReason: 'CNC milled from plate is common for brackets. Flexible for small batches. Die forging for high volume.',
    process: ['4/5-axis CNC milling', 'Drilling / tapping', 'Deburring / edge rounding'],
    tollServices: ['Waterjet cutting', 'Vibratory finishing', 'Anodizing', 'Dimensional inspection'],
    pitfalls: ['Thin walls (<2mm) cause chatter; use high speed, light depth strategy', 'Hole position tolerance +-0.05mm requires single-setup machining'],
    specNote: 'AMS 4928 TC4 annealed plate, 100% dimensional inspection, anodized',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '📐',
  },
  {
    keywords: ['弹簧', 'spring', '弹性', '卡箍', 'clip'],
    industries: ['Aerospace', 'Medical', 'Chemical'],
    category: 'Springs / Elastic Elements',
    geometry: 'Fine wire coil/special section, high elastic deflection',
    painPoints: ['Elastic relaxation', 'Fatigue fracture', 'Stress relaxation', 'Operating temperature'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) has ~110GPa modulus (half of steel) but high elastic limit. Standard for Ti springs. Solution+aging for optimal elastic properties.',
    formId: 'wire',
    formReason: 'Wire is the only raw material form for springs. Direct coiling, high efficiency.',
    process: ['Automatic spring coiling', 'Precision end grinding', 'Solution + aging heat treatment', 'Surface shot peening'],
    tollServices: ['Vacuum heat treatment', 'Shot peening', 'Fatigue testing', 'Stiffness sorting'],
    pitfalls: ['Spring design stress should be 40-50% of shear yield strength; do not use steel spring design rules', 'Post-coiling stress relief annealing mandatory; otherwise severe elastic relaxation'],
    specNote: 'AMS 4934 / ASTM B863 Gr9, solution+aged (STA)',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '〰️',
  },
  {
    keywords: ['焊接', '超声', 'horn', 'sonotrode', 'ultrasonic', 'welding', 'booster'],
    industries: ['Automotive', 'Consumer', 'Medical Device'],
    category: 'Ultrasonic Welding Components',
    geometry: 'Cylindrical/prismatic stepped profile, threaded mounting stud, precision contact face, tuned half-wave length',
    painPoints: ['Acoustic fatigue', 'Contact face wear', 'Thread stripping at high amplitude', 'Frequency drift', 'Heat generation'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) has excellent acoustic properties (low damping, high fatigue strength at 20kHz), making it the standard for ultrasonic welding horns and boosters.',
    formId: 'bar',
    formReason: 'Large diameter bar stock allows CNC turning of the stepped profile. Minimal machining waste compared to forging for small-medium production runs.',
    process: ['CNC turning & profiling', 'Thread cutting', 'Precision grinding of contact face', 'Frequency tuning'],
    tollServices: ['CMM inspection', 'Impedance / frequency analysis', 'DLC coating (wear resistance)', 'Laser marking'],
    pitfalls: ['Half-wave resonance tuning must be within +-50Hz of target frequency', 'Contact face flatness must be <0.005mm for consistent weld quality'],
    specNote: 'ASTM B348 Grade 5, solution-treated (STA), frequency-tuned to customer specification, Ra<=0.4um contact face',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🔊',
  },
  {
    keywords: ['高尔夫', 'golf', 'head', 'club', 'face', 'bike', 'frame', 'bicycle', 'sports', '赛车'],
    industries: ['Consumer', 'Automotive', 'Other'],
    category: 'Sports & Recreation Equipment',
    geometry: 'Thin-wall contoured shapes (golf club heads, bike frames, tennis racket frames), often with variable wall thickness',
    painPoints: ['Impact fatigue', 'Weight distribution', 'Surface finish aesthetics', 'Stress concentration at joints'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers the best strength-to-weight ratio for premium sports equipment. Grade 9 for frames requiring more forming.',
    formId: 'forging',
    formReason: 'Near-net-shape forging for golf heads ensures optimal grain flow and consistent weight. Tube forming for bike frames.',
    process: ['Precision forging', 'CNC milling of face/sole', 'Surface polishing', 'Laser marking'],
    tollServices: ['Investment casting (alternative)', 'Anodizing (colors)', 'Shot peening', 'Weight sorting'],
    pitfalls: ['Variable wall thickness makes forging die design critical', 'Golf club face thickness tolerance +-0.1mm affects Coefficient of Restitution (COR)'],
    specNote: 'ASTM B348 Grade 5 / Grade 9, annealed, 100% dimensional + weight check, anodized finish',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '⛳',
  },
  {
    keywords: ['propeller', '船桨', '螺旋桨', 'shaft', '传动轴', 'marine', 'underwater', 'subsea', '舵'],
    industries: ['Marine', 'Oil & Gas', 'Energy'],
    category: 'Marine Propellers & Shafting',
    geometry: 'Large-diameter, complex blade curvature, tapered shaft with keyway, flanged couplings',
    painPoints: ['Cavitation erosion', 'Seawater corrosion fatigue', 'Impact from debris', 'Galvanic corrosion at shaft/propeller interface'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 (CP-Ti) offers excellent seawater corrosion resistance (no pitting after years of immersion) at lower cost than Grade 5. Grade 5 for high-thrust propellers.',
    formId: 'forging',
    formReason: 'Large propellers are investment cast or fabricated from welded plates. Shafting uses forged bar stock for strength and grain flow.',
    process: ['5-axis CNC machining of blades', 'TIG welding of built-up propellers', 'Dynamic balancing', 'Hydrostatic testing'],
    tollServices: ['Investment casting', 'CMM blade profiling', 'Static & dynamic balancing', 'PT/UT inspection'],
    pitfalls: ['Propeller blade tip clearance tolerance +-1mm on >1m diameter requires precision 5-axis machining', 'Shaft surface must be free of iron contamination to prevent galvanic corrosion'],
    specNote: 'ASTM B367 Grade C-2 (cast) / ASTM B348 Grade 2 (shaft), annealed, 100% FPI + balancing',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🚢',
  },
  {
    keywords: ['duct', 'ducting', 'aircraft', 'aerospace', 'bleed', 'air', '环境控制', 'ECS', 'pneumatic'],
    industries: ['Aerospace', 'Automotive'],
    category: 'Aerospace Ducting & Pneumatic Systems',
    geometry: 'Thin-wall tube/duct assemblies with formed bends, flanges, bellows, and branch connections',
    painPoints: ['Vibration fatigue at joints', 'Thermal cycling (-55 to +300C)', 'Pressure containment', 'Weight optimization'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) has excellent formability and weldability, making it ideal for thin-wall ducting that requires bending and welding. Higher strength than CP-Ti.',
    formId: 'tube',
    formReason: 'Seamless tube is the standard starting form for ducting. Can be CNC bent, end-formed, and welded into complex assemblies.',
    process: ['CNC tube bending', 'End forming / flaring', 'TIG orbital welding', 'Pressure testing'],
    tollServices: ['Vacuum brazing', 'X-ray inspection', 'Flow testing', 'Helium leak detection'],
    pitfalls: ['Thin-wall titanium tubes (0.5mm) require mandrel bending to prevent collapse', 'Weld zone must be argon-purged inside and out to prevent oxidation'],
    specNote: 'AMS 4934 Grade 9 seamless tube, annealed, 100% X-ray of welds + helium leak test',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🔧',
  },
  {
    keywords: ['dental', '牙科', 'implant', 'abutment', 'bridge', 'crown', 'denture', '口腔'],
    industries: ['Medical Device'],
    category: 'Dental Implants & Prosthetics',
    geometry: 'Small threaded conical/cylindrical body, internal hex/octagonal drive, precision mating surface for abutment',
    painPoints: ['Osseointegration failure', 'Micro-gap at implant-abutment interface', 'Crevice corrosion in oral environment', 'Fracture under masticatory load'],
    alloyId: 'tc4eli',
    alloyReason: 'Grade 23 ELI (ASTM F136) is the standard for dental implants. Better fatigue performance than CP grades and essential for osseointegration. Never substitute industrial Grade 5.',
    formId: 'bar',
    formReason: 'Small diameter bar (3-6mm) is ideal for Swiss-type automatic lathe production of dental implants. High precision and batch consistency.',
    process: ['Swiss-type automatic turning', 'Thread rolling / whirling', 'Surface texturing (SLA/TPS coating)', 'Cleaning & passivation'],
    tollServices: ['Surface roughening / coating', 'Sterile packaging', 'Torsion testing', 'Surface analysis (SEM)'],
    pitfalls: ['Internal hex drive tolerance +-0.02mm required for driver engagement', 'Surface contamination (Fe, Ni) must be <0.05% per ASTM F86'],
    specNote: 'ASTM F136 Grade 23 ELI bar, annealed, 100% dimensional inspection + surface analysis, sterile packaged',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🦷',
  },
  {
    keywords: ['surgical', '手术', 'instrument', 'forceps', 'scissors', '钳', '剪', 'retractor', '骨科', 'orthopedic'],
    industries: ['Medical Device'],
    category: 'Surgical Instruments',
    geometry: 'Ergonomic handles, slender jaws/shanks, pivot joints, ratchet mechanisms, often one-piece construction',
    painPoints: ['Repeated sterilization (autoclave) degradation', 'Edge retention', 'Corrosion from bodily fluids', 'Weight balance for surgeon comfort'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 (CP-Ti) is widely used for surgical instruments due to its excellent corrosion resistance in autoclave environments and adequate strength. Grade 5 for high-stress instruments.',
    formId: 'plate',
    formReason: 'Plate/sheet allows profile cutting and forming of instrument shapes. Bar for handle stocks and pivot pins.',
    process: ['Waterjet / laser cutting of profiles', 'CNC milling of ergonomic contours', 'Passivation', 'Assembly & riveting'],
    tollServices: ['Electropolishing', 'Laser engraving (marking)', 'Hardness testing', 'Function testing'],
    pitfalls: ['Titanium-titanium pivot joints require clearance of 0.02-0.05mm to prevent galling', 'Edge sharpness of scissors must be Ra<0.1um, requiring specialized grinding'],
    specNote: 'ASTM B348 Grade 2 / Grade 5, annealed, passivated per ASTM F86, 100% function tested',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🔪',
  },
  {
    keywords: ['热处', 'fixture', 'tray', 'basket', 'furnace', '热处理', '真空', 'vacuum', 'rack'],
    industries: ['Other', 'Aerospace', 'Automotive'],
    category: 'Heat Treatment Fixtures & Racks',
    geometry: 'Open grid/weldment construction, stackable trays, locating pins, threaded studs for part suspension',
    painPoints: ['Thermal creep at high temperature', 'Weight of fixture reducing batch size', 'Thermal expansion mismatch with parts', 'Oxidation scaling'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 (CP-Ti) is cost-effective for fixtures operating below 300C. Grade 5 for higher temperature (up to 400C) and higher load applications.',
    formId: 'plate',
    formReason: 'Plate/sheet with welded construction is most economical for custom fixture fabrication. Bar for pins and studs.',
    process: ['Laser / plasma cutting of plate', 'TIG welding of assemblies', 'Stress relief annealing', 'Straightening'],
    tollServices: ['Custom fabrication to drawing', 'Pickling to remove oxide scale', 'Dimensional inspection'],
    pitfalls: ['Titanium fixtures must not contact steel in furnaces (eutectic melting at 980C)', 'Welding distortion requires post-weld straightening within +-1mm'],
    specNote: 'ASTM B265 Grade 2 plate, stress-relieved, welded per AWS D1.6',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🔥',
  },
  {
    keywords: ['反应釜', 'reactor', 'vessel', '搅拌', 'agitator', 'impeller', '搅拌器', 'autoclave', '高压釜'],
    industries: ['Chemical', 'Energy', 'Oil & Gas'],
    category: 'Chemical Reactor Internals & Agitators',
    geometry: 'Shaft with impeller blades, support baffles, dip tubes, spargers — often as welded assemblies',
    painPoints: ['Corrosion from aggressive chemicals', 'Erosion from slurry', 'Fatigue at blade roots', 'Product contamination (metal ions)'],
    alloyId: 'ta10',
    alloyReason: 'Grade 12 (Ti-0.3Mo-0.8Ni) offers superior corrosion resistance in reducing acid environments at lower cost than Grade 7. High strength and good weldability.',
    formId: 'plate',
    formReason: 'Plate and tube construction is standard for agitator assemblies. Shaft uses bar or tube depending on torque requirements.',
    process: ['CNC profiling of impeller blades', 'TIG welding of assemblies', 'Dynamic balancing', 'Hydrostatic testing'],
    tollServices: ['Magnetic particle inspection (MPI)', 'Weld map documentation', 'Material certification (EN 10204 3.1)'],
    pitfalls: ['Impeller blade-to-shaft weld must be full-penetration, verified by UT', 'Surface finish inside reactor vessels must be Ra<3.2um to prevent product buildup'],
    specNote: 'ASTM B265 Grade 12 plate, stress-relieved, 100% weld inspection (PT/UT), material cert 3.1',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🧪',
  },
  {
    keywords: ['armor', '装甲', 'ballistic', '防弹', 'plate', 'military', 'vehicle', '防护'],
    industries: ['Defense', 'Other'],
    category: 'Ballistic Armor & Protection',
    geometry: 'Large flat/curved plates, multi-curvature shaped panels, bolt holes for mounting',
    painPoints: ['Ballistic impact energy absorption', 'Multi-hit capability', 'Weight reduction vs steel armor', 'Edge effect / cracking'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) is the standard for military vehicle armor (MIL-DTL-46077), offering 40% weight savings vs rolled steel armor at equivalent ballistic protection.',
    formId: 'plate',
    formReason: 'Hot-rolled plate is the standard armor form. Curved panels require hot forming or thermo-mechanical processing.',
    process: ['Waterjet / abrasive cutting', 'Hot forming of curved panels', 'Drilling of mounting holes', 'Surface preparation & painting'],
    tollServices: ['Ballistic testing (per NIJ/MIL-STD)', 'Heat treatment to optimize hardness', 'X-ray inspection (for welds)'],
    pitfalls: ['Ballistic performance is highly directional — plate must be tested in the rolling direction', 'Welding reduces ballistic performance by 30% in HAZ — avoid welds in critical areas'],
    specNote: 'MIL-DTL-46077 Grade 5 armor plate, solution-treated + aged, 100% Brinell hardness + ballistic sample test',
    servicePage: '/titanium-forming-heavy-manufacturing/',
    image: '🛡️',
  },
  {
    keywords: ['cryogenic', '低温', '深冷', 'LNG', 'liquid', 'gas', 'valve', '低温阀', 'storage', 'tank'],
    industries: ['Energy', 'Chemical', 'Oil & Gas'],
    category: 'Cryogenic & LNG Components',
    geometry: 'Valve bodies, stems, seal rings, piping, bellows — often with extended stems for cold box penetration',
    painPoints: ['Brittle fracture at low temperature', 'Thermal contraction mismatch', 'Seal leakage at cryogenic temperature', 'Material certification traceability'],
    alloyId: 'cp1',
    alloyReason: 'Grade 1 (CP-Ti) has excellent cryogenic toughness (KV >60J at -196C) and low thermal conductivity, making it ideal for LNG and liquid hydrogen service.',
    formId: 'bar',
    formReason: 'Bar stock for valve stems and small components. Plate for flanges and valve bodies. Tube for piping.',
    process: ['CNC turning of valve stems', 'Seal face grinding/lapping', 'Cryogenic proof testing', 'Helium leak testing'],
    tollServices: ['Cryogenic testing (-196C)', 'Helium mass spectrometer leak test', 'Impact testing at cryogenic temperature', 'Material certification (EN 10204 3.1)'],
    pitfalls: ['Valve stem extension length must account for thermal contraction of 0.2% from ambient to -196C', 'Seal materials (PCTFE, PEEK) must be qualified for cryogenic service'],
    specNote: 'ASTM B348 Grade 1, annealed, Charpy V-notch tested at -196C (min 27J), helium leak tested',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '❄️',
  },
  {
    keywords: ['additive', '增材', '3D打印', 'print', 'SLM', 'DMLS', 'laser', 'powder', 'EBM', 'electron'],
    industries: ['Aerospace', 'Medical Device', 'Automotive', 'Other'],
    category: 'Additive Manufacturing (AM) Builds',
    geometry: 'Near-net-shape lattice/porous structures, organic contours, internal channels impossible with subtractive methods',
    painPoints: ['Residual stress / distortion', 'Surface roughness (as-built)', 'Porosity control', 'Support removal difficulty', 'Fatigue performance vs wrought'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) is the most common AM titanium alloy. Grade 23 ELI for medical implants requiring higher ductility and lower oxygen content.',
    formId: 'bar',
    formReason: 'AM builds start from atomized metal powder (Grade 5 / Grade 23 powder). Substrate plates are standard bar/plate stock.',
    process: ['SLM/DMLS printing', 'Stress relief annealing', 'Support removal (EDM/machining)', 'Hot isostatic pressing (HIP)'],
    tollServices: ['Powder characterization', 'CT scanning (internal defect detection)', 'HIP densification', 'Surface finishing'],
    pitfalls: ['As-built surface roughness (Ra 6-12um) requires post-processing for fatigue-critical applications', 'Support structures for overhangs >45 degrees must be optimized to reduce material waste'],
    specNote: 'ASTM F2924 (Grade 5) / ASTM F3001 (Grade 23 ELI), HIP + annealed, 100% CT scan + mechanical test coupons',
    servicePage: '/titanium-additive-manufacturing/3d-printing-slm/',
    image: '🖨️',
  },
  {
    keywords: ['semiconductor', '半导体', 'chamber', '溅射', 'sputter', 'etch', '刻蚀', 'PVD', 'CVD', 'wafer', '晶圆'],
    industries: ['Semiconductor'],
    category: 'Semiconductor Process Chamber Components',
    geometry: 'Large diameter rings, liner shields, focus rings, clamp rings, gas distribution plates — thin-wall, high-purity',
    painPoints: ['Plasma erosion', 'Particle generation', 'Metal contamination of wafers', 'Thermal uniformity', 'Cost of frequent replacement'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 (CP-Ti) is preferred for chamber components due to its low sputter yield and minimal particle generation in plasma environments. Grade 5 for structural rings.',
    formId: 'plate',
    formReason: 'Plate stock for large diameter rings and shields. Tube for gas distribution lines. Bar for fasteners.',
    process: ['CNC turning/boring of rings', 'Precision drilling of gas holes', 'Surface treatment (anodizing)', 'Ultra-sonic cleaning'],
    tollServices: ['Class 10 cleanroom packaging', 'Particle count testing', 'Surface roughness measurement', 'Helium leak testing'],
    pitfalls: ['Gas distribution hole diameter tolerance +-0.01mm required for uniform plasma', 'All surfaces must be electropolished to Ra<0.4um to minimize particle generation'],
    specNote: 'ASTM B265 Grade 2, double-melted (VAR), electropolished, Class 10 cleanroom packaged, particle count certified',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '💻',
  },

  {
    keywords: ['blisk', 'blade', 'compressor', '压气机', '整体叶盘', 'aerofoil', 'rotor'],
    industries: ['Aerospace', 'Defense'],
    category: 'Aero Engine Compressor Blisks & Blades',
    geometry: 'Integral bladed-disk (blisk) with complex 3D aerofoil contours, thin trailing edges, platform and root attachment features',
    painPoints: ['High-cycle fatigue at blade root', 'Foreign object damage (FOD)', 'Creep at elevated temperature (400-520C)', 'Resonant vibration', 'Bird strike resistance'],
    alloyId: 'ti6242',
    alloyReason: 'Ti-6242 (Ti-6Al-2Sn-4Zr-2Mo) is the industry standard for compressor blisks, offering high creep strength up to 520C and excellent low-cycle fatigue life. Replaces heavy Ni superalloys.',
    formId: 'forging',
    formReason: 'Precision die forging of the blisk blank followed by 5-axis CNC milling of aerofoil profiles. Near-net forging reduces machining time by 60% vs billet machining.',
    process: ['Isothermal die forging', '5-axis CNC milling of aerofoils', 'Contour inspection (CMM/bluelight)', 'Surface enhancement (shot peening)'],
    tollServices: ['X-ray / CT inspection', 'Fluorescent penetrant inspection (FPI)', 'Fatigue testing', 'Surface roughness measurement'],
    pitfalls: ['Thin trailing edges (<0.5mm) require adaptive machining strategies to avoid deflection', 'Blade root fillet radius must be >0.5mm to prevent stress concentration cracks'],
    specNote: 'AMS 4919 Ti-6242, forged + solution-treated + aged, 100% FPI + CT scan of aerofoils',
    servicePage: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    image: '🌀',
  },
  {
    keywords: ['turbine', '涡轮', '低压', 'LPT', 'blade', 'low pressure', 'gamma', 'TiAl'],
    industries: ['Aerospace', 'Defense'],
    category: 'Low-Pressure Turbine Blades (Gamma-TiAl)',
    geometry: 'Thin-wall hollow or solid aerofoil with complex internal cooling passages (or solid for LPT), fir-tree root attachment',
    painPoints: ['High-temperature creep (650-750C)', 'Centrifugal stress at high RPM', 'Oxidation at elevated temperature', 'Thermal fatigue', 'Weight reduction'],
    alloyId: 'gammatial',
    alloyReason: 'Gamma-TiAl (Ti-48Al-2Cr-2Nb) offers 50% weight reduction vs Ni-based superalloys while maintaining adequate strength up to 750C. Enables lighter turbine rotors and reduced disc loading.',
    formId: 'forging',
    formReason: 'Investment casting is the primary forming method for Gamma-TiAl blades due to the materials low ductility and difficulty in forging. HIP + heat treatment follows casting.',
    process: ['Investment casting', 'Hot isostatic pressing (HIP)', 'Precision grinding of root form', 'Surface coating (if required)'],
    tollServices: ['X-ray / CT inspection', 'Metallographic evaluation', 'Creep testing', 'Flow testing (cooled blades)'],
    pitfalls: ['Gamma-TiAl has <2% elongation at RT — machining must be done with PCD tooling at low speeds', 'Surface cracks >0.1mm are rejectable; require 100% FPI inspection'],
    specNote: 'AMS 6900 / ASTM F3069, investment cast + HIP, 100% X-ray + FPI, creep sample per batch',
    servicePage: '/titanium-forming-heavy-manufacturing/titanium-forging/',
    image: '🔥',
  },
  {
    keywords: ['landing', '起落架', 'landing gear', 'strut', 'bogie', 'truck', 'axle', 'beam'],
    industries: ['Aerospace', 'Defense'],
    category: 'Landing Gear Structural Components',
    geometry: 'Large-section forged struts, links, and beams with complex internal bores, trunnion pins, and lug attachments',
    painPoints: ['Ultra-high tensile and compressive stress during landing', 'Stress corrosion cracking from runway de-icing chemicals', 'Impact fatigue from repeated landing cycles', 'Weight reduction for fuel economy'],
    alloyId: 'ti1023',
    alloyReason: 'Ti-1023 (Ti-10V-2Fe-3Al) is the premier landing gear titanium alloy, offering tensile strength >1100MPa with fracture toughness >50MPa.m0.5 — directly replacing 300M steel at 40% weight saving.',
    formId: 'forging',
    formReason: 'Large closed-die forging is mandatory to achieve the required grain flow orientation along principal stress axes. No alternative forming method achieves the needed mechanical properties.',
    process: ['Closed-die forging', 'Solution treatment + aging', 'CNC machining of bores and attachment holes', 'Surface enhancement (shot peening)'],
    tollServices: ['Ultrasonic inspection (UT)', 'Magnetic particle inspection (MPI)', 'Tensile/fracture toughness testing', 'Corrosion testing'],
    pitfalls: ['Ti-1023 is sensitive to inclusion content — VAR + ESR double-melt required', 'Forging temperature window is narrow (+-15C); precise control essential to avoid beta fleck'],
    specNote: 'AMS 4984 / AMS 4986 Ti-1023, STA condition, 100% UT Class A + mechanical test per lot',
    servicePage: '/titanium-forming-heavy-manufacturing/titanium-forging/',
    image: '🛬',
  },
  {
    keywords: ['rocket', '火箭', '导弹', 'missile', 'motor', 'case', 'engine', 'casing', 'chamber', 'skirt'],
    industries: ['Defense', 'Aerospace'],
    category: 'Missile & Rocket Motor Hardware',
    geometry: 'Cylindrical/conical thin-wall casings, flanged rings, domed end closures with polar bosses and attachment lugs',
    painPoints: ['High-pressure combustion (up to 20MPa)', 'Shock loading during ignition', 'Weight optimization for range', 'Thermal protection system interface', 'Thread galling in closures'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers the best balance of strength, toughness, and weldability for rocket motor cases. Higher strength beta alloys for ultra-high pressure applications.',
    formId: 'forging',
    formReason: 'Ring forgings for case sections and flanges. Plate rolled and welded for large-diameter cases. Spin forming for domed closures.',
    process: ['Ring rolling / forging', 'CNC machining of mating flanges', 'TIG / EB welding of case sections', 'Hydrostatic proof testing'],
    tollServices: ['Helium leak testing', 'X-ray of weld joints', 'Dimensional certification', 'Hydrostatic burst testing'],
    pitfalls: ['Motor case weld joints require 100% X-ray — porosity >0.5mm is rejectable', 'Thread galling in titanium closures requires dry-film lubricant (MoS2) coating'],
    specNote: 'AMS 4928 Grade 5, annealed, 100% X-ray of welds + hydrostatic proof test to 1.5x MEOP',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🚀',
  },
  {
    keywords: ['hypersonic', '高超', '高超声速', 'missile', 'fin', 'control', 'surface', 'rudder', 'elevon'],
    industries: ['Defense', 'Aerospace'],
    category: 'Hypersonic Vehicle Control Surfaces',
    geometry: 'Thin swept/delta planform with internal stiffening ribs, leading edge with high-temperature oxidation protection, actuation lug',
    painPoints: ['Extreme aerodynamic heating (600-650C)', 'Thermal shock on ascent/re-entry', 'High dynamic pressure flutter', 'Oxidation resistance at sustained high temperature', 'Thermal stress mismatch with substructure'],
    alloyId: 'ti65',
    alloyReason: 'Ti-65 (Ti-6Al-4Sn-9Zr-1Mo-1W-0.3Si) is a high-temperature titanium specifically developed for sustained 600-650C service, offering 40% weight saving vs Inconel 718 for control surfaces.',
    formId: 'plate',
    formReason: 'Plate stock for skin panels and ribs, with welded/fastened assembly. Hot sizing of formed panels to achieve aerodynamic contour accuracy.',
    process: ['Hot forming of skin panels', '5-axis CNC contour milling', 'EB / laser welding of rib-skin assembly', 'High-temperature氧化防护涂层'],
    tollServices: ['High-temperature wind tunnel testing', 'CMM contour inspection (+-0.2mm)', 'Thermal imaging (bond line integrity)', 'Oxidation testing'],
    pitfalls: ['Ti-65 requires protective atmosphere during heat treatment to prevent alpha case formation', 'Leading edge temperature may exceed Ti-65 limit (>650C) — requires TPS or cooled leading edge'],
    specNote: 'Ti-65 per customer specification, STA condition, 100% FPI + dimensional inspection',
    servicePage: '/titanium-forming-heavy-manufacturing/',
    image: '✈️',
  },
  {
    keywords: ['cryogenic', '低温', 'propellant', '贮箱', 'tank', 'clamp', 'band', 'collar', 'liner'],
    industries: ['Aerospace', 'Energy'],
    category: 'Cryogenic Propellant Tank Hardware',
    geometry: 'Thin-section curved bands/rings with precision bolt-hole patterns, often with PTFE liner interface for clamping',
    painPoints: ['Cryogenic embrittlement (-253C liquid H2)', 'Thermal contraction during fill/drain cycles', 'Vibration-induced loosening during launch', 'Galvanic corrosion with tank material'],
    alloyId: 'ti52sn',
    alloyReason: 'Ti-5Al-2.5Sn ELI is specifically formulated for cryogenic service, retaining Charpy impact energy >60J at -253C (liquid hydrogen). Standard Ti alloys become brittle at these temperatures.',
    formId: 'plate',
    formReason: 'Plate stock for bands and collars. Sheet for shims. Bar for fasteners. All material must be ELI grade with guaranteed low-temperature impact properties.',
    process: ['Waterjet / laser cutting of band profiles', 'Drilling of bolt holes with jig', 'PTFE bonding / insert molding', 'Cryogenic proof testing'],
    tollServices: ['Charpy impact testing at -253C', 'Cryogenic dimensional inspection', 'Tensile testing at cryogenic temperature', 'Material traceability per NASA SP-R-0022'],
    pitfalls: ['ELI grade verification is critical — standard Ti-5Al-2.5Sn does NOT guarantee cryogenic performance', 'Contamination with hydrogen (>100ppm) causes hydride embrittlement at cryogenic temperature'],
    specNote: 'AMS 4926 / MIL-T-9046 Ti-5Al-2.5Sn ELI, annealed, 100% Charpy tested at -253C (min 27J), hydrogen content <100ppm',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🌡️',
  },
  {
    keywords: ['submarine', '潜艇', 'sonar', '声呐', 'bearing', 'bushing', 'shaft', 'propulsion', 'naval'],
    industries: ['Marine', 'Defense'],
    category: 'Submarine & Naval Propulsion Components',
    geometry: 'Large-diameter thin-wall cylindrical bushings/bearings with precision bore tolerance, keyway slots, threaded mounting holes',
    painPoints: ['Seawater corrosion', 'Silent operation (acoustic signature)', 'Magnetic stealth (non-magnetic required)', 'Wear resistance under boundary lubrication', 'Fatigue from fluctuating thrust loads'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) is non-magnetic (mu <1.00001), preventing detection by MAD sensors. Excellent seawater corrosion resistance eliminates the need for protective coatings that can degrade.',
    formId: 'bar',
    formReason: 'Large-diameter heavy-wall tube or forged bar is the standard starting form for stern tube bushings. Centrifugal casting for very large diameters.',
    process: ['CNC turning & boring of ID/OD', 'Keyway broaching', 'Precision honing of bearing surface', 'Ultrasonic cleaning'],
    tollServices: ['Magnetic permeability testing', 'Dimensional certification', 'Hardness testing', 'Coating (if required)'],
    pitfalls: ['Bearing clearance for seawater lubrication must be 2x that of oil-lubricated steel bearings', 'Surface finish Ra<0.4um required for proper hydrodynamic film formation in seawater'],
    specNote: 'MIL-T-9046 Grade 5, annealed, magnetic permeability <1.01, 100% dimensional + surface finish inspection',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🚤',
  },
  {
    keywords: ['riser', '立管', 'drilling', '钻井', 'offshore', '深海', 'subsea', 'deepwater'],
    industries: ['Oil & Gas', 'Marine', 'Energy'],
    category: 'Deepwater Drilling Risers & Components',
    geometry: 'Long tubular sections (15-25m each) with threaded/fastened couplings, buoyancy module attachment rings, choke/kill line ports',
    painPoints: ['Tension fatigue from vortex-induced vibration (VIV)', 'Corrosion in H2S/CO2 environment', 'Extreme hydrostatic pressure at 3000m depth', 'Weight-induced tension at surface', 'Gallings in threaded connections'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers the best combination of high strength, low density (45% lighter than steel), and corrosion resistance for deepwater risers. Eliminates need for cathodic protection.',
    formId: 'tube',
    formReason: 'Seamless tube or rolled-and-welded plate is standard for riser sections. Threaded couplings are machined from heavy-wall tube or bar stock.',
    process: ['Tube rolling & longitudinal seam welding (for large diameters)', 'CNC machining of threaded couplings', 'Full-length UT inspection', 'Hydrostatic testing'],
    tollServices: ['VIV fatigue analysis', 'Full-scale tension testing', 'Charpy impact at -20C', 'Material certification (EN 10204 3.1)'],
    pitfalls: ['Threaded connections require 100% MPI inspection after each make/break cycle', 'Riser buoyancy module attachment must allow for 0.15% thermal expansion differential'],
    specNote: 'API 5L / ASTM B348 Grade 5, STA condition, 100% UT + hydrostatic test, sour service certified per NACE MR0175',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🛢️',
  },
  {
    keywords: ['stent', '支架', 'TAVI', '瓣膜', 'valve', 'heart', '心脏', 'cardiovascular', 'aortic'],
    industries: ['Medical Device'],
    category: 'Cardiovascular Stent & TAVI Frames',
    geometry: 'Thin-strut lattice/expanding cage structure (struts 0.1-0.5mm), crimped delivery configuration, self-expanding or balloon-expandable',
    painPoints: ['Fatigue fracture under 400M cardiac cycles', 'Corrosion in chloride-rich blood environment', 'Delivery profile minimization', 'Radial strength vs flexibility trade-off', 'MRI compatibility'],
    alloyId: 'nitinol',
    alloyReason: 'Nitinol (Ni-Ti shape memory alloy) provides the unique superelasticity required for self-expanding stents and TAVI frames. The alloy undergoes martensitic transformation at body temperature.',
    formId: 'tube',
    formReason: 'Nitinol begins as precision-ground tube (OD 1-8mm). Laser cutting of the stent pattern, followed by shape-setting heat treatment and electropolishing.',
    process: ['Laser micro-cutting of tube', 'Shape-setting heat treatment', 'Electropolishing', 'Crimping & loading into delivery system'],
    tollServices: ['AF temperature measurement (DSC)', 'Radial force testing', 'Fatigue testing (accelerated 400M cycles)', 'Sterilization validation'],
    pitfalls: ['Austenite finish temperature (Af) must be tuned to 25+-3C for self-expanding behavior at body temperature', 'Surface defects >5um after electropolishing can cause fatigue crack initiation'],
    specNote: 'ASTM F2063 Nitinol, superelastic condition, Af 25+-3C, 100% dimensional + corrosion testing, sterile packaged',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '❤️',
  },
  {
    keywords: ['guidewire', '导丝', 'guide wire', 'catheter', '导管', 'neuro', '脑血管', 'aneurysm', 'embolic'],
    industries: ['Medical Device'],
    category: 'Neuro-Interventional Guidewires & Catheters',
    geometry: 'Extremely slender wire (OD 0.2-1.0mm) with a shaped distal tip, tapered core, and PTFE/hydrophilic coating',
    painPoints: ['Kink resistance in tortuous anatomy', 'Torque transmission (1:1 response)', 'Tip shape retention', 'Pushability vs flexibility balance', 'Visibility under fluoroscopy'],
    alloyId: 'nitinol',
    alloyReason: 'Nitinol core wire provides the superelasticity needed to navigate tortuous cerebral vasculature without permanent deformation. Steel guidewires kink permanently when bent beyond 90 degrees.',
    formId: 'wire',
    formReason: 'Nitinol wire is precision-drawn to final diameter. Core grinding creates a tapered distal segment for flexibility. Shape-setting heat treatment forms the custom distal tip geometry.',
    process: ['Wire drawing & straightening', 'Centerless grinding of core taper', 'Shape-setting of distal tip', 'PTFE / hydrophilic coating application'],
    tollServices: ['Tensile testing', 'Kink resistance testing', 'Torque response testing', 'Sterilization (EtO)'],
    pitfalls: ['Core taper transition zone must be gradual (>20:1 ratio) to prevent stress concentration', 'PTFE coating thickness tolerance +-2um required for consistent lubricity'],
    specNote: 'ASTM F2063 Nitinol core wire, superelastic, 100% dimensional + torque response tested, sterile',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🧠',
  },
  {
    keywords: ['MRI', '核磁', 'cranial', '颅', 'skull', 'fixation', 'clamp', 'stereotactic', 'frame', '头架'],
    industries: ['Medical Device'],
    category: 'MRI-Compatible Cranial Fixation & Stereotactic Frames',
    geometry: 'Ring-shaped frame with 4-point pin fixation, adjustable arc/quadrant for probe targeting, vernier scales for coordinate positioning',
    painPoints: ['Zero magnetic susceptibility (no MRI artifact)', 'Rigid fixation without micro-motion', 'Patient comfort during awake procedures', 'Sterilization compatibility', 'Coordinate accuracy'],
    alloyId: 'cp1',
    alloyReason: 'Grade 1 (CP-Ti) is non-magnetic and MRI-compatible, producing zero image artifact. Higher strength than plastics but without the magnetic susceptibility of steel or even Grade 5.',
    formId: 'bar',
    formReason: 'Bar and plate stock for ring fabrication. Small diameter bar for fixation pins. All material must be certified MRI-safe (magnetic susceptibility <10^-5).',
    process: ['CNC machining of ring and frame components', 'Precision drilling of pin guides', 'Coordinate measurement of fiducial markers', 'Passivation & cleaning'],
    tollServices: ['MRI artifact testing (3T phantom)', 'Coordinate accuracy verification (+-0.1mm)', 'Sterilization validation', 'Material certification'],
    pitfalls: ['Fixation pin tips must be sharpened to 30-degree cone with Ra<0.2um to minimize patient discomfort', 'Frame coordinate zero-point must be reproducible within 0.1mm after repeated sterilization cycles'],
    specNote: 'ASTM B348 Grade 1 CP-Ti, annealed, MRI compatibility certified, 100% coordinate inspection + passivated',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🧲',
  },
  {
    keywords: ['electrolyzer', '电解', 'PEM', 'proton', 'hydrogen', '制氢', 'bipolar', 'plate', '双极板'],
    industries: ['Energy', 'Chemical'],
    category: 'PEM Electrolyzer Bipolar Plates',
    geometry: 'Thin flat plate (0.3-2mm) with flow-field channels (parallel/serpentine/interdigitated), port holes for fluid distribution, large surface area up to 2m2',
    painPoints: ['High anodic potential (>2V) causing passivation and increased contact resistance', 'Acidic environment (pH 2-3 at 80C)', 'Hydrogen embrittlement on cathodic side', 'Contact resistance must be <10 mohm.cm2', 'Cost reduction for mass adoption'],
    alloyId: 'cp1',
    alloyReason: 'Grade 1 (CP-Ti) is the base material for PEM electrolyzer bipolar plates due to its native oxide passivation at high anodic potential. Coated with Pt or Au to reduce contact resistance.',
    formId: 'plate',
    formReason: 'Thin sheet (0.3-1mm) for flow-field plates. Precision stamping or etching of channel patterns. Coating (Pt/Au) applied via PVD or electroplating.',
    process: ['Sheet stamping / chemical etching of flow fields', 'Laser cutting of port holes', 'PVD coating (Pt or Au)', 'Contact resistance testing'],
    tollServices: ['Contact resistance measurement (CNT method)', 'Corrosion testing (potentiodynamic)', 'Helium leak testing', 'Accelerated aging test (1000h)'],
    pitfalls: ['Plate flatness must be <0.05mm over 1m2 to ensure uniform compression of PTL/MEA', 'Coating pinholes >1um2 lead to localized corrosion and cation contamination of the membrane'],
    specNote: 'ASTM B265 Grade 1 sheet, Pt-coated (0.5-2um), contact resistance <10 mohm.cm2@1N/cm2, 100% leak tested',
    servicePage: '/titanium-fabrication-services/',
    image: '⚡',
  },
  {
    keywords: ['MOCVD', '外延', 'wafer', '晶圆', 'susceptor', '托盘', 'support', 'arm', '反应腔', 'epitaxial'],
    industries: ['Semiconductor'],
    category: 'MOCVD Wafer Susceptor & Support Hardware',
    geometry: 'Large-diameter disk/susceptor (up to 300mm) with pocket recesses for wafers, support arms with precision alignment features',
    painPoints: ['High-temperature stability (400-500C)', 'Thermal expansion match with SiC-coated graphite susceptor', 'Low outgassing in vacuum', 'High rigidity at temperature', 'Cleanroom compatibility'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) has a thermal expansion coefficient close to SiC-coated graphite, minimizing thermal stress. High strength at temperature and excellent corrosion resistance to process gases.',
    formId: 'plate',
    formReason: 'Plate stock machined to final geometry. The support arm requires precision boring and threading for alignment adjustment.',
    process: ['CNC milling / turning of susceptor and arms', 'Precision boring of wafer pockets', 'Surface anodizing (optional)', 'Ultra-sonic cleaning in Class 10'],
    tollServices: ['CMM dimensional inspection', 'Surface roughness measurement (Ra<0.8um)', 'Outgassing test (ASTM E595)', 'Particle count certification'],
    pitfalls: ['Wafer pocket depth tolerance +-0.05mm required for uniform heating across wafer', 'Anodized coating thickness must be <5um to maintain pocket dimensional tolerance'],
    specNote: 'AMS 4928 Grade 5, annealed, 100% dimensional + surface finish inspection, Class 10 cleaned & packaged',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '💻',
  },
  {
    keywords: ['robot', '机器人', 'collaborative', 'cobot', '协作', 'gearbox', '减速机', 'harmonic', 'actuator'],
    industries: ['Automotive', 'Consumer', 'Other'],
    category: 'Collaborative Robot (Cobot) Actuator Housings',
    geometry: 'Thin-wall complex housings with integrated bearing journals, precision gear mounting features, sealing surfaces, and connector ports',
    painPoints: ['Weight reduction for low-inertia control', 'High stiffness-to-weight ratio for accuracy', 'Thermal dissipation from motor/gearbox', 'Wear resistance at joint interfaces', 'Cost competitive with aluminum'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) provides 45% weight saving vs steel and 2x the strength of 6061-T6 aluminum, enabling lighter cobot arms with higher payload capacity and better safety.',
    formId: 'bar',
    formReason: 'Bar stock for small actuator housings (<100mm dia). Forged blanks for larger housings requiring enhanced mechanical properties.',
    process: ['CNC turning & milling of housing', 'Precision boring of bearing journals', 'Thread milling of connector ports', 'Surface anodizing / painting'],
    tollServices: ['CMM dimensional inspection', 'Concentricity measurement', 'Pressure testing (seal integrity)', 'Surface coating'],
    pitfalls: ['Bearing journal runout must be <0.02mm TIR for proper gear mesh', 'Housing wall thickness <2mm requires rigid fixturing to avoid chatter during machining'],
    specNote: 'ASTM B348 Grade 5, STA condition, 100% dimensional + concentricity inspection, anodized finish',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🤖',
  },
  {
    keywords: ['foldable', '折叠', 'hinge', '铰链', 'phone', '手机', 'screen', 'display', 'mobile', 'fold'],
    industries: ['Consumer'],
    category: 'Foldable Phone Hinge & Fold Mechanisms',
    geometry: 'Miniature precision assembly with multiple interlocking links, gear segments, spring-loaded cams, and pin joints — all toleranced to micron level',
    painPoints: ['Ultra-high cycle fatigue (200,000+ folds)', 'Freiting wear at pivot interfaces', 'Dust ingress protection', 'Extreme dimensional precision (+-5um)', 'Thin cross-section (0.2-0.8mm)'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) via MIM or precision forging enables thin, strong hinge links that withstand 200k+ folding cycles. Aluminum fails by wear; steel adds unacceptable weight.',
    formId: 'bar',
    formReason: 'MIM (metal injection molding) is the preferred process for complex miniature hinge parts. Precision bar stock for pins and shafts. CNC machining of larger link plates.',
    process: ['Metal injection molding (MIM)', 'Debinding & sintering', 'CNC machining of critical surfaces', 'DLC coating for wear resistance'],
    tollServices: ['CMM / vision inspection', 'Cycle testing (200,000 cycles)', 'Wear measurement', 'Dust ingress testing'],
    pitfalls: ['Hinge pin-to-link clearance must be 5-10um for smooth articulation without play', 'DLC coating thickness 1-3um must not bridge at sharp edges or cause dimensional interference'],
    specNote: 'ASTM B348 Grade 5 (or MIM equivalent), solution + aged, 100% dimensional + cycle tested, DLC coated',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '📱',
  },
  {
    keywords: ['mid-frame', '中框', 'phone', '手机', 'chassis', 'frame', 'enclosure', 'housing', 'body'],
    industries: ['Consumer'],
    category: 'Smartphone Mid-Frame & Structural Chassis',
    geometry: 'Large thin-walled perimeter frame with complex internal ribbing, threaded inserts, antenna bands, and precision locator features',
    painPoints: ['Drop impact protection', 'Structural rigidity against bending', 'Heat dissipation from SoC/battery', 'Antenna window integration', 'Surface finish aesthetics'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers 3x the yield strength of 6061 aluminum at similar density, enabling thinner cross-sections for lighter phones with better drop protection.',
    formId: 'plate',
    formReason: 'Plate stock for CNC machining the complex mid-frame geometry from solid. Near-net-shape forging for higher-volume production runs.',
    process: ['CNC milling from plate (or near-net forging)', 'Thread insert installation', 'Surface anodizing / PVD coating', 'CNC pocket milling for weight reduction'],
    tollServices: ['3D CMM inspection', 'Drop testing (MIL-STD-810)', 'Torsional rigidity testing', 'Surface hardness / scratch testing'],
    pitfalls: ['Antenna band gaps must be held to +-0.05mm for consistent RF performance', 'Anodized layer thickness (8-12um) must be accounted for in thread and pocket tolerances'],
    specNote: 'ASTM B348 Grade 5, STA condition, 100% dimensional inspection, anodized / PVD finished',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '📱',
  },
  {
    keywords: ['valve', '气门', 'engine', '发动机', 'valve spring', 'retainer', 'keeper', '锁夹', '汽缸'],
    industries: ['Automotive', 'Aerospace'],
    category: 'Engine Valve Train Components (Spring Retainers & Keepers)',
    geometry: 'Small precision conical/cylindrical parts with internal taper for valve stem locking, external spring seat shoulder, lightweighting grooves',
    painPoints: ['Inertia at high RPM (>10,000 RPM)', 'Impact fatigue from valve closure', 'High temperature under hood (150-250C)', 'Wear at stem keeper interface', 'Weight for valvetrain dynamics'],
    alloyId: 'ti153',
    alloyReason: 'Ti-153 (Ti-15V-3Cr-3Sn-3Al) is a beta alloy offering ultra-high strength (>1200MPa) with excellent fatigue life, providing 40% weight reduction vs steel retainers for high-RPM engines.',
    formId: 'bar',
    formReason: 'Small diameter bar stock for CNC turning of retainers and keepers. Multi-spindle automatic lathes enable high-volume production.',
    process: ['CNC multi-spindle turning', 'Heat treatment (STA)', 'Surface shot peening', '100% crack detection'],
    tollServices: ['Eddy current inspection', 'Hardness testing (HRC)', 'Fatigue testing', 'Dimensional sorting'],
    pitfalls: ['Valve stem collet groove concentricity must be <0.025mm TIR to prevent uneven loading', 'Shot peening intensity must be carefully controlled to avoid peening-induced cracking'],
    specNote: 'AMS 4914 Ti-153, STA to >1200MPa, 100% eddy current + dimensional inspection, shot peened',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '⚙️',
  },
  {
    keywords: ['suspension', '悬挂', 'pushrod', '拉杆', 'F1', '赛车', 'race', 'wishbone', 'control arm', 'rocker'],
    industries: ['Automotive', 'Aerospace'],
    category: 'Racing Suspension & Chassis Components',
    geometry: 'Slender precision-machined rods/tubes with spherical bearing ends, threaded adjustment sections, and lightweighting profiles',
    painPoints: ['High-cycle fatigue from road/spa', 'Impact loads from kerbs/potholes', 'Corrosion from track chemicals', 'Weight reduction for unsprung mass', 'Buckling resistance in compression'],
    alloyId: 'ti1023',
    alloyReason: 'Ti-1023 (Ti-10V-2Fe-3Al) provides the highest strength-to-weight ratio of any commercial titanium alloy, enabling unsprung mass reduction that directly improves tire contact patch control.',
    formId: 'bar',
    formReason: 'Heavy-wall tube or bar stock for pushrods and rockers. Spherical bearing housings are machined from bar, then welded or threaded onto tube sections.',
    process: ['CNC turning of rod ends', 'Thread milling of adjustment sections', 'Welding of bearing housings', 'Surface coating (anodizing/Teflon)'],
    tollServices: ['Magnetic particle inspection', 'Tensile testing of weld samples', '3D CMM inspection (+-0.1mm)', 'Fatigue testing'],
    pitfalls: ['Weld zone of bearing housing to tube must be 100% X-ray inspected for porosity', 'Thread adjustment section must have rolled (not cut) threads for maximum fatigue life'],
    specNote: 'AMS 4984 Ti-1023, STA condition, 100% MPI of weld zones + tensile samples, anodized',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🏎️',
  },
  {
    keywords: ['watch', '手表', 'dive', '潜水', 'case', '壳体', 'lug', 'crown', 'bezel', 'timepiece'],
    industries: ['Consumer', 'Marine'],
    category: 'Professional Dive Watch Cases & Components',
    geometry: 'Large-diameter case body (>40mm) with crown guards, threaded crown tube, drilled lug holes, caseback threading, and bezel interface',
    painPoints: ['Deep-sea pressure resistance (1000m+)', 'Corrosion from saltwater and sweat', 'Hypoallergenic (skin contact)', 'Aesthetic surface finish', 'Thread galling of caseback'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) is known as "Grade 5 titanium" in watchmaking, offering superior scratch resistance vs pure Ti, deep anodizing colors, and full hypoballergenic properties.',
    formId: 'bar',
    formReason: 'Bar stock is CNC machined to form the case body. The high strength of Grade 5 allows thinner case walls at equivalent pressure rating compared to CP-Ti or steel.',
    process: ['CNC turning of case profile', 'CNC milling of lugs and crown guards', 'Caseback threading', 'Bead blasting / anodizing / PVD'],
    tollServices: ['Water pressure testing (to rated depth x 1.25 safety factor)', 'Thread gauge inspection', 'Surface finish measurement', 'Magnetic field testing'],
    pitfalls: ['Caseback thread must be 10+ full turns with 0.5mm pitch for reliable sealing', 'Crown tube O-ring groove must have Ra<0.4um to prevent leakage over time'],
    specNote: 'ASTM B348 Grade 5, annealed, 100% pressure tested to 1.25x rated depth, anodized finish',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '⌚',
  },

  {
    keywords: ['bicycle', 'bike', 'cycling', 'drivetrain', 'cassette', 'chainring', 'chain', 'derailleur', 'bottom bracket', 'pulley'],
    industries: ['Cycling', 'Consumer'],
    category: 'Bicycle Drivetrain & Drivetrain Hardware',
    geometry: 'Precision-machined thin-profile toothed rings (cogs/chainrings), small-diameter pins/shafts, threaded fasteners with rolled threads, hollow spindles with bearing interfaces',
    painPoints: ['Rotational inertia reduction', 'Wear resistance against chain rollers', 'Sweat/rainwater corrosion', 'Thread galling in aluminum frames', 'Fatigue under sprint torque 1500W+'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) provides ideal wear resistance, fatigue strength, and 40% weight saving vs steel for drivetrain components. Grade 9 for fasteners requiring cold heading.',
    formId: 'bar',
    formReason: 'CNC machining from plate/bar for cogs and chainrings. Swiss-type turning for pins and spindles. Rolled thread forming for bolts ensures continuous grain flow for fatigue safety.',
    process: ['CNC machining of tooth profiles', 'Thread rolling of all fasteners', 'Swiss-type turning of spindles/pins', 'Anodizing/DLC coating'],
    tollServices: ['CMM tooth profile inspection', 'Hardness testing', 'Fatigue testing (sprint load simulation)', 'MPI of threads'],
    pitfalls: ['Chainring tooth profile must match chain roller diameter to +-0.05mm for silent shifting', 'BB spindle taper requires +-0.01mm concentricity for bearing preload accuracy'],
    specNote: 'ASTM B348 Grade 5, STA, rolled threads, 100% dimensional + crack inspection',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '⚙️',
  },
  {
    keywords: ['bicycle', 'bike', 'cycling', 'stem', 'handlebar', 'steerer', 'headset', 'cockpit', 'lever'],
    industries: ['Cycling', 'Consumer'],
    category: 'Bicycle Cockpit, Steering & Control Hardware',
    geometry: 'Precision fasteners M4-M6 with low-profile Torx heads, thin-wall tubular spacers, complex 3D-printed structural brackets, small-diameter pivot pins',
    painPoints: ['Safety-critical bolts under vibration and impact', 'Sweat corrosion attacking steel fasteners', 'Weight reduction for rotational/unsprung mass', 'Carbon steerer tube protection from over-tightening'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) mandatory for all cockpit safety-critical fasteners (stem bolts, lever pivot pins). Grade 9 for non-structural fasteners. Never use aluminum for stem bolts.',
    formId: 'bar',
    formReason: 'Bar stock for precision fasteners with rolled threads. 3D-printed (SLM) Grade 23 for custom stem bodies — zero material waste, optimized topology.',
    process: ['CNC turning of bolt heads and threads', 'Thread rolling (all safety-critical bolts)', 'SLM 3D printing of custom stem/adapter bodies', 'Anodizing/DLC coating'],
    tollServices: ['Torque-to-tension verification', 'CMM dimensional inspection', 'Fatigue testing (10^6 cycles at 10Nm)', 'Salt spray corrosion testing ASTM B117'],
    pitfalls: ['Stem faceplate bolts require Torx T25 drive for consistent torque — never use hex', 'Thread rolling gives 30% higher fatigue strength vs cutting — mandatory for stem bolts'],
    specNote: 'ASTM B348 Grade 5, rolled threads, Torx T25 drive, 100% MPI crack inspection, anodized',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🚲',
  },
  {
    keywords: ['bicycle', 'bike', 'brake', 'disc', 'rotor', 'caliper', 'piston', 'banjo'],
    industries: ['Cycling', 'Consumer'],
    category: 'Bicycle Braking System Components',
    geometry: 'Thin disc rotors with vented/spider webs, precision-machined piston inserts, hollow banjo bolts with sealing washers, multi-position adapters',
    painPoints: ['High thermal load up to 300C at rotor', 'Brake fluid overheating causing lever fade', 'Pad contamination from corroded pins', 'Weight on rotating unsprung mass', 'Thread galling in aluminum calipers'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) offers high shear strength for rotor bolts, low thermal conductivity (7 W/mK vs 105 for Al) to insulate brake fluid, excellent corrosion resistance.',
    formId: 'plate',
    formReason: 'Plate stock for rotor machining and adapter fabrication. Bar stock for bolts, piston inserts, and banjo fittings. All threads rolled for fatigue safety.',
    process: ['CNC machining of rotor profile/brake track', 'Precision turning of piston Ti inserts', 'Thread rolling of all bolts and banjo fittings', 'Hard anodizing for rotors'],
    tollServices: ['Shear strength testing of rotor bolts', 'Thermal imaging of brake track', 'Salt spray corrosion testing', 'Pressure testing of banjo bolt assemblies'],
    pitfalls: ['Rotor brake track thickness +-0.05mm for consistent pad wear — warp >0.1mm causes brake judder', 'Caliper piston Ti insert reduces heat transfer to brake fluid by 7x vs aluminum'],
    specNote: 'ASTM B348 Grade 5, rolled threads, T25 Torx, 100% MPI + pressure tested',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🛎️',
  },
  {
    keywords: ['bicycle', 'bike', 'mountain', 'suspension', 'shock', 'fork', 'pivot', 'linkage', 'derailleur hanger'],
    industries: ['Cycling', 'Consumer'],
    category: 'Bicycle Suspension, Frame Hardware & Linkage',
    geometry: 'Large-diameter coil springs with variable rate winding, precision hollow axles with stepped bores, complex forged/machined linkage plates, small precision spacer sleeves',
    painPoints: ['Unsprung mass reducing damper response', 'Pivot bearing preload consistency', 'Shock coil weight (steel is 500g+)', 'Linkage bolt fatigue under bottom-out loads', 'Derailleur hanger alignment for 12-speed'],
    alloyId: 'tc4',
    alloyReason: 'Grade 5 (Ti-6Al-4V) for axles, bolts, and hangers. Beta-C titanium for rear shock coils provides linear spring characteristics at 50% weight saving vs steel. Never use aluminum for pivot axles.',
    formId: 'bar',
    formReason: 'Bar stock for pivot axles and linkage hardware. Beta-C wire for shock coil winding. SLM 3D printing for custom hangers with optimized topology.',
    process: ['CNC turning of pivot axles stepped diameters', 'CNC milling of linkage plates', 'Beta-C wire winding + shape setting for coils', 'SLM 3D printing of hangers/linkages'],
    tollServices: ['Coaxiality measurement of pivot axles <0.02mm', 'Spring rate testing of shock coils', 'Fatigue testing 10^5 cycles', 'CMM alignment of hanger interface'],
    pitfalls: ['Pivot axle to bearing fit must be H7/h6 transition fit — too tight binds, too loose causes frame creak', 'Derailleur hanger alignment tolerance +-0.1mm for perfect 12-speed indexing'],
    specNote: 'ASTM B348 Grade 5 / Beta-C Ti wire, rolled threads, 100% dimensional + crack inspection',
    servicePage: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    image: '🔩',
  },
  {
    keywords: ['bicycle', 'bike', 'wheel', 'spoke', 'nipple', 'axle', 'pedal', 'saddle', 'seatpost', 'bottle cage'],
    industries: ['Cycling', 'Consumer'],
    category: 'Bicycle Wheels, Saddle, Pedals & Accessories',
    geometry: 'Long thin wire 200-300mm, small hexagonal nipples with internal threading, hollow axles with cam mechanisms, thin-wall tubing for cages/rails, small cleat plates',
    painPoints: ['Rotational mass 4x more impactful than frame mass', 'Spoke tensile fatigue under road vibration', 'Saddle rail corrosion from sweat/rain', 'Pedal spindle bending under sprint load', 'Bottle cage vibration cracking on gravel'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) is ideal for spokes — higher strength than CP-Ti, excellent cold drawability, 40% lighter than steel. Grade 5 for axles and pedal spindles.',
    formId: 'wire',
    formReason: 'Wire drawing for spokes and saddle rails. Bar stock for axles and pedal spindles. Tube forming for bottle cages.',
    process: ['Wire drawing to precise diameter +-0.02mm', 'CNC swaging/j-bend forming of spoke ends', 'CNC turning of axle/spindle profiles', 'Ti tube bending + welding for bottle cages'],
    tollServices: ['Spoke tensile testing each to 1200N', 'Axle bending fatigue testing 10^6 cycles', 'Saddle rail compression testing 200kg', 'Salt spray corrosion testing 100h ASTM B117'],
    pitfalls: ['Spoke nipple thread requires MoS2 dry lubricant to prevent galling at 120kgf tension', 'Pedal spindle to crank thread must use anti-seize to prevent cold welding'],
    specNote: 'ASTM B863 Grade 9 wire / ASTM B348 Grade 5 axles, 100% tensile tested spokes, anodized',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🚴',
  },

];

/* ── Main Component ── */

export default function ReverseEngineerTool() {
  const [input, setInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    const kw = input.toLowerCase().split(/[\s,，、]+/);
    const matched: { profile: PartProfile; score: number }[] = [];

    for (const p of PART_DB) {
      let score = 0;
      for (const k of kw) {
        for (const pk of p.keywords) {
          if (pk.toLowerCase().includes(kw) || kw.includes(pk.toLowerCase())) {
            score += 10;
          }
        }
        for (const ind of p.industries) {
          if (ind.toLowerCase().includes(kw) || kw.includes(ind.toLowerCase())) {
            score += 5;
          }
        }
      }
      // Industry filter bonus
      if (industry && p.industries.some(i => industry.includes(i))) {
        score += 3;
      }
      if (score > 0) matched.push({ profile: p, score });
    }

    return matched.sort((a, b) => b.score - a.score);
  }, [input, industry]);

  const display = selectedIdx !== null ? [results[selectedIdx]].filter(Boolean) : results;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSelectedIdx(null);
  };

  return (
    <div className="w-full">
      {/* Form */}
      <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
        <form onSubmit={handleSearch} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
              Component / Part Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. hydrogen valve needle, turbine impeller, bone screw, heat exchanger tube sheet..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
            >
              <option value="">All Industries</option>
              <option value="Aerospace">✈️ Aerospace</option>
              <option value="Medical Device">🏥 Medical Device</option>
              <option value="Chemical">🧪 Chemical / Petrochemical</option>
              <option value="Energy">⚡ Energy / Hydrogen</option>
              <option value="Marine">🚢 Marine / Offshore</option>
              <option value="Semiconductor">💻 Semiconductor</option>
              <option value="Automotive">🚗 Automotive</option>
              <option value="Oil & Gas">🛢️ Oil & Gas</option>
              <option value="Defense">🛡️ Defense / Military</option>
              <option value="Consumer">📱 Consumer Electronics</option>
              <option value="Cycling">🚴 Cycling / Bicycle</option>
              <option value="Other">❓ Other / General</option>
            </select>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all text-base whitespace-nowrap"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >🔍 Find Matching Solution</button>
          </div>
        </form>

        {/* Quick entry */}
        {!searched && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <p className="text-xs mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Or browse common titanium parts:</p>
            <div className="flex flex-wrap gap-2">
              {PART_DB.map((p, i) => (
                <button key={i} onClick={() => { setInput(p.keywords[0]); setSearched(true); setSelectedIdx(0); }}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
                >{p.image} {p.category}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search results */}
      {searched && results.length === 0 && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm mb-4" style={{ color: 'var(--theme-text)' }}>No matching solution found.</p>
          <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Try different keywords or contact our engineering team for a custom solution.</p>
          <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white"
            style={{ backgroundColor: 'var(--theme-primary)' }}>📩 Contact Engineering Team</a>
        </div>
      )}

      {/* Result list */}
      {searched && results.length > 0 && selectedIdx === null && (
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
            Found {results.length} matching result(s). Click to view:
          </p>
          {results.slice(0, 5).map((r, i) => (
            <button key={i} onClick={() => setSelectedIdx(results.indexOf(r))}
              className="w-full text-left rounded-xl p-4 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.profile.image}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{r.profile.category}</div>
                  <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Match: {Math.min(100, r.score * 10)}% · {r.profile.industries.join(' / ')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail view */}
      {display.map((r, i) => {
        const p = r.profile;
        const alloyName = ALLOYS[p.alloyId as keyof typeof ALLOYS] || p.alloyId;
        const formName = FORMS[p.formId as keyof typeof FORMS] || p.formId;
        return (
          <div key={i} className="rounded-2xl p-6 md:p-8 mb-6" style={{ backgroundColor: 'var(--theme-surface)', border: '2px solid var(--theme-primary)' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{p.image}</span>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>{p.category}</h3>
                <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>{p.industries.join(' · ')}</p>
              </div>
            </div>

            {/* 1. Part Feature */}
            <Section title="1. Part Feature Analysis" content={p.geometry} />
            <ul className="text-sm space-y-1 mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}>
              {p.painPoints.map((pt, j) => <li key={j}>⚠️ {pt}</li>)}
            </ul>

            {/* 2. Material */}
            <Section title="2. Material Selection Rationale" content={alloyName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.alloyReason}</p>

            {/* 3. Form */}
            <Section title="3. Form Selection Rationale" content={formName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.formReason}</p>

            {/* 4. Process */}
            <Section title="4. Manufacturing Process & Services" content="" />
            <div className="ml-4 mb-4">
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Core Processes:</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.process.map((pr, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', color: 'var(--theme-primary)' }}>{pr}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Toll Processing Services:</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.tollServices.map((ts, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)', color: '#22c55e' }}>{ts}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Process Pitfalls:</p>
              <ul className="text-xs space-y-1" style={{ color: 'color-mix(in srgb, #ef4444, 70%)' }}>
                {p.pitfalls.map((pf, j) => <li key={j}>⚠️ {pf}</li>)}
              </ul>
            </div>

            {/* 5. Procurement */}
            <Section title="5. Procurement Specifications" content={p.specNote} />

            {/* CTA */}
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-center" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <a href={p.servicePage} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all"
                style={{ color: 'var(--theme-primary)', border: '1px solid var(--theme-primary)' }}>
                View Related Services →
              </a>
              <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ backgroundColor: 'var(--theme-primary)' }}>
                📩 Get Formal Quote
              </a>
            </div>

            {selectedIdx !== null && (
              <div className="mt-4 text-center">
                <button onClick={() => setSelectedIdx(null)}
                  className="text-xs underline" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                  ← Back to all results
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-2">
      <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--theme-text)' }}>{title}</h4>
      {content && <p className="text-sm ml-4" style={{ color: 'var(--theme-primary)', fontWeight: 600 }}>{content}</p>}
    </div>
  );
}
