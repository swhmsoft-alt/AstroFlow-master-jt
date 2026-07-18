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
