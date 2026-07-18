/**
 * Master Generator — All Remaining Industries (177 products, 10 industries)
 * Generates complete B2B product specification pages.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, '..', '..', 'src', 'content', 'product-entities');
const OUT_DIR = join(__dirname);

// ── Material DB ──
const M = {
  'Grade 5 Ti-6Al-4V':     { uns:'UNS R56400', wnr:'W.Nr. 3.7165', d:'4.43 g/cm³', ts:'Min. 895 MPa', ys:'Min. 828 MPa', el:'Min. 10%', hd:'HRC 36', mod:'114 GPa', std:'ASTM B348 / ASME SB348 / AMS 4928 / ISO 5832-3', tc:'6.7 W/m·K', cte:'8.6 µm/m·°C', mt:'315°C (continuous)' },
  'Grade 2 CP-Ti':          { uns:'UNS R50400', wnr:'W.Nr. 3.7035', d:'4.51 g/cm³', ts:'Min. 345 MPa', ys:'Min. 275 MPa', el:'Min. 20%', hd:'HRB 80', mod:'105 GPa', std:'ASTM B348 / ASME SB348 / ISO 5832-2', tc:'16.4 W/m·K', cte:'8.6 µm/m·°C', mt:'315°C (continuous)' },
  'Grade 9 Ti-3Al-2.5V':   { uns:'UNS R56320', wnr:'W.Nr. 3.7195', d:'4.48 g/cm³', ts:'Min. 620 MPa', ys:'Min. 483 MPa', el:'Min. 15%', hd:'HRC 32', mod:'100 GPa', std:'ASTM B348 / AMS 4934 / ASTM B863', tc:'7.8 W/m·K', cte:'9.0 µm/m·°C', mt:'315°C (continuous)' },
  'Grade 23 Ti-6Al-4V ELI':{ uns:'UNS R56401', wnr:'W.Nr. 3.7165', d:'4.43 g/cm³', ts:'Min. 860 MPa', ys:'Min. 795 MPa', el:'Min. 10%', hd:'HRC 34', mod:'114 GPa', std:'ASTM F136 / ASTM B348 / ISO 5832-3', tc:'6.7 W/m·K', cte:'8.6 µm/m·°C', mt:'315°C (continuous)' },
};
const TYPE = { 'Grade 5 Ti-6Al-4V':'Titanium Alloy', 'Grade 2 CP-Ti':'Commercially Pure Titanium', 'Grade 9 Ti-3Al-2.5V':'Titanium Alloy', 'Grade 23 Ti-6Al-4V ELI':'Titanium Alloy (ELI)' };
const DM = M['Grade 5 Ti-6Al-4V'];
function gm(g) { return M[g] || DM; }

// ── Industry-specific helpers (all functions taking title) ──
function genApp(industry, t, mat) {
  const m = {
    'Consumer Electronics': `consumer electronics enclosures, hinge mechanisms, and structural frames. Titanium's native TiO₂ passive layer provides complete immunity to galvanic corrosion when mated with aluminum or stainless steel chassis components in sweat, humidity, and salt-fog environments (MIL-STD-810H certified).`,
    'Medical Device': `medical implant and surgical instrument applications where the component must survive cyclic physiological loading, repeated autoclave sterilization (134°C, >200 cycles), and direct tissue contact. Titanium's TiO₂ passive layer provides complete biocompatibility (ISO 10993-4) with zero nickel ion release.`,
    'Marine & Offshore': `continuous seawater immersion, hydrostatic pressure up to 600 bar (6000m depth), and highly corrosive chloride environments. Titanium provides complete immunity to crevice corrosion and pitting in seawater up to 315°C, unlike 316L which pits above 10°C in stagnant seawater.`,
    'Aerospace & Defense': `extreme thermal gradients (-253°C to +315°C), high-cycle vibration (5-2000 Hz), and aggressive fluid exposure (jet fuel, hydraulic fluid, de-icing agents). Titanium provides immunity to exfoliation corrosion and stress corrosion cracking.`,
    'Automotive & Motorsports': `engine bay temperatures up to 315°C, high-RPM vibration (up to 12,000 RPM), and road salt exposure. Titanium provides immunity to corrosion from road salt, brake fluid, glycol coolants, and engine oil degradation byproducts.`,
    'Electroplating & Surface Finishing': `continuous immersion in sulfuric acid (10-25% H₂SO₄ at 60°C), chromic acid (100-300 g/L CrO₃), and chlorine gas environments. Titanium provides zero measurable corrosion vs 316L which pits within weeks.`,
    'Chemical Processing': `continuous exposure to wet chlorine gas, oxidizing acids (HNO₃ > 65%), seawater brine, and organic acids at temperatures up to 315°C. Titanium's TiO₂ layer maintains corrosion rates below 0.025 mm/year.`,
    'Energy': `hydrogen embrittlement environments (H₂ gas at >100 bar), nuclear radiation (neutron flux > 10¹² n/cm²·s), and supercritical CO₂ power cycles. Titanium's TiO₂ layer provides hydrogen barrier with H pickup < 0.002 wt%.`,
    'General Industrial': `general industrial environments including humid factory conditions, mild chemical exposure, and outdoor weather. Titanium eliminates the need for periodic coating, painting, or galvanizing maintenance.`,
    'Environmental Engineering': `wastewater environments containing H₂S, NH₃, Cl₂, and microbiologically influenced corrosion (MIC). Titanium provides zero MIC and immunity to H₂S stress corrosion cracking.`,
  };
  return m[industry] || `demanding industrial applications requiring titanium's corrosion resistance, strength-to-weight ratio, and long service life.`;
}

function genApp2(industry, t) {
  const m = {
    'Consumer Electronics': 'When mating with aluminum mid-frames or steel hinges, titanium\'s electrochemical potential avoids galvanic acceleration. The TiO₂ passive layer (maintained via ASTM F86 passivation) provides electrical isolation for antenna window compatibility.',
    'Medical Device': 'Titanium\'s modulus (105-114 GPa) reduces stress shielding at bone-implant interfaces vs 316L (193 GPa). Passivation (ASTM F86) and Type II anodizing enhance osseointegration. MRI compatibility (zero ferromagnetic response) is guaranteed.',
    'Marine & Offshore': 'The TiO₂ passive layer prevents galvanic corrosion when coupled with passive stainless steels. For connections to carbon steel, electrical isolation using PTFE/PEEK washers prevents hydrogen embrittlement of titanium.',
    'Aerospace & Defense': 'For CFRP-to-titanium joints, titanium\'s low CTE (8.6 µm/m·°C) matches carbon-epoxy composites, reducing thermal stress in bonded assemblies. The TiO₂ passivation prevents galvanic coupling with carbon fiber.',
    'Automotive & Motorsports': 'For titanium-to-aluminum connections, CTE matching with proper clearance design prevents binding. Galvanic protection via insulating polymer washers at all aluminum interface points.',
    'Electroplating & Surface Finishing': 'Titanium basket hooks maintain full electrical conductivity through the TiO₂ layer (< 0.001 Ω contact resistance). Ti-to-Cu transition plates using explosive welding eliminate galvanic issues at buss bar connections.',
    'Chemical Processing': 'For titanium-to-stainless steel piping connections, use transition joints (explosive-bonded Ti/SS plates per ASTM B899). PTFE gaskets at flanged connections prevent galvanic coupling in electrolyte environments.',
    'Energy': 'For PEM electrolyzer bipolar plates, titanium provides <10 µΩ·cm² contact resistance with Pt-coated surface. The TiO₂ layer prevents metallic ion contamination of the proton exchange membrane.',
    'General Industrial': 'For titanium-to-steel connections, use nylon isolation washers. The self-healing TiO₂ film regenerates the passive layer within minutes in aerated environments after surface scratches.',
    'Environmental Engineering': 'No galvanic isolation needed for titanium-to-concrete or PVC connections. For carbon steel tank connections, use EPDM isolation gaskets. TiO₂ provides 100% UV stability for outdoor installations.',
  };
  return m[industry] || 'The TiO₂ passive layer (maintained via ASTM F86 passivation) provides corrosion protection and galvanic isolation across dissimilar material interfaces.';
}

function genLifecycle(industry, wtReduc) {
  const m = {
    'Consumer Electronics': `(1) zero corrosion in sweat/salt environments, (2) ${wtReduc} reducing device mass, (3) fatigue endurance >500 MPa for 200,000+ fold cycles, (4) scratch resistance 3x greater than anodized aluminum.`,
    'Medical Device': `(1) zero nickel/chromium ion leaching, (2) MRI-safe (non-ferromagnetic), (3) fatigue endurance >10⁷ cycles at physiological loads, (4) ${wtReduc}.`,
    'Marine & Offshore': `(1) zero measurable corrosion in seawater after 30+ years, (2) ${wtReduc} reducing buoyancy-compensated payload, (3) fatigue endurance 2x 316L in seawater with no corrosion fatigue knock-down, (4) elimination of coating/CP maintenance.`,
    'Aerospace & Defense': `(1) 3-5x longer fatigue life vs aluminum, (2) ${wtReduc} increasing payload/range, (3) zero corrosion in jet fuel and hydraulic fluid, (4) superior damage tolerance vs aluminum alloys.`,
    'Automotive & Motorsports': `(1) ${wtReduc} reducing unsprung mass, (2) fatigue life 3x steel under suspension loads, (3) zero corrosion from road salt and track debris, (4) valve spring fatigue >10⁸ cycles.`,
    'Electroplating & Surface Finishing': `(1) 5-10x longer service life vs lead-lined steel, (2) zero metallic contamination of plating baths, (3) eliminate anode sludging, (4) ${wtReduc} reducing handling fatigue.`,
    'Chemical Processing': `(1) 8-15 year service life vs 1-3 years for 316L, (2) ${wtReduc} reducing piping support, (3) zero corrosion product contamination, (4) elimination of wall thickness inspection for 10+ years.`,
    'Energy': `(1) 20+ year design life in nuclear/H₂ service, (2) ${wtReduc} reducing offshore wind top mass, (3) zero hydrogen embrittlement, (4) no corrosion allowance for pure water/steam cycles.`,
    'General Industrial': `(1) 25+ year service life with zero maintenance, (2) ${wtReduc} reducing handling costs, (3) no recurring coating/painting, (4) full material recyclability.`,
    'Environmental Engineering': `(1) 30+ year service life in wastewater, (2) zero biofilm on anodized surfaces, (3) ${wtReduc} reducing structural loading, (4) no painting/coating maintenance.`,
  };
  return m[industry] || '(1) extended service life, (2) weight savings, (3) zero corrosion, (4) reduced lifecycle maintenance costs.';
}

// ── Industry Config ──
function getCfg(name) {
  return CFG_DICT[name];
}

const CFG_DICT = {
  'Consumer Electronics': {
    sku:'TI-CE',
    sub:'Precision Cosmetic & Structural Components | Optimized for Premium Consumer Devices',
    faq1_title:'What surface finish is achievable for cosmetic consumer electronics?',
    faq1:'Ra ≤ 0.2 µm mirror polish achievable via diamond turning + tumble finishing. For matte finishes, bead blasting with 50 µm glass beads (Ra 0.6-0.8 µm) followed by Type II anodizing (AMS 2488) provides uniform color and abrasion resistance. PVD coating per ISO 27874 (1.5 µm) can achieve custom colors with hardness >2000 HV.',
    faq2_title:'How does titanium compare to 7000-series aluminum for structural frames?',
    faq2:'Grade 5 Ti-6Al-4V has 2.5x higher yield strength (828 MPa vs 340 MPa for 7075-T6), 45% lower density-adjusted weight, and 10x better corrosion resistance. TCO break-even at >2-year product lifecycle factoring in zero corrosion returns vs 3-5% aluminum failure rates.',
    q3q:'What anti-galling measures are needed for titanium hinge pins in foldable devices?',
    q3a:'Apply DLC coating (2-3 µm, hardness 1500-2500 HV) to hinge pin sliding surfaces. Torque: M2 = 0.3-0.4 Nm, M2.5 = 0.5-0.6 Nm. Use PTFE-impregnated anodizing for the hinge bore counterface.',
    ndt:'Dimensional CMM per ISO 10360; Surface profilometry per ISO 4287; PMI per ASTM E1476',
    ud: s => {
      if(s.includes('fold')||s.includes('hinge')) return { up:['Foldable Phone Hinge Assembly', 'Display Flex Cable Routing System'], down:['Stainless Steel Hinge Brackets', 'PTFE Grease (Krytox GPL 205)', 'Micro Torx T4/T5 Driver Bits'] };
      if(s.includes('phone')||s.includes('smartphone')||s.includes('mid-frame')||s.includes('chassis')) return { up:['Smartphone Mid-Frame Assembly', 'RF Antenna Tuning System'], down:['Stainless SIM Tray Eject Pins', 'EMI Shielding Foam Gaskets', 'LDS Antenna Module'] };
      if(s.includes('watch')||s.includes('bezel')||s.includes('wearable')) return { up:['Smartwatch Case Assembly', 'Display Module Seal System'], down:['Fluorosilicone O-Ring Seals', 'Sapphire Crystal Lens', 'Micro Pogo Pin Connectors'] };
      if(s.includes('audio')||s.includes('earbud')||s.includes('tws')) return { up:['TWS Earbud Housing Assembly', 'Wireless Charging Coil Module'], down:['Silicone Ear Tips', 'Gold-Plated Charging Pins', 'UV-Cured Adhesive (Loctite 4311)'] };
      return { up:['Consumer Device Enclosure Assembly', 'Internal Structural Skeleton'], down:['Stainless Steel Spring Contacts', 'Micro Pogo Pin Connectors', 'UV-Cured Adhesive Assembly'] };
    }
  },
  'Medical Device': {
    sku:'TI-MD', sub:'Surgical & Implantable Medical Components | Optimized for Biocompatibility & MRI Compatibility',
    faq1_title:'Is this component MRI-safe?', faq1:'Yes. Titanium is non-ferromagnetic (magnetic permeability < 1.0001 μ) with zero torque or image artifact in 1.5-7T MRI fields. 100% ferromagnetic inclusion tested per ASTM B348 using magnaflux inspection. Ferritescope calibrated to < 0.5% ferrite content.',
    faq2_title:'What sterilization methods are compatible?', faq2:'Compatible with: (1) Steam autoclave (134°C, 3-4 bar, 20 min), (2) Gamma irradiation (25-50 kGy per ISO 11137), (3) ETO sterilization per ISO 11135, (4) H₂O₂ plasma per STERRAD. TiO₂ layer unaffected by all methods.',
    q3q:'What surface treatment for bone-contacting surfaces?', q3a:'Cementless fixation: Type II anodizing (AMS 2488) produces 0.5-2.0 µm porous oxide for osseointegration. Cemented: Ra 1.0-2.0 µm blasted. Articulating: polished to Ra ≤ 0.05 µm. All surfaces ASTM F86 passivated.',
    ndt:'Ultrasonic Cleaning validation; Dimensional CMM per ISO 10360; PMI per ASTM E1476; 100% visual per ISO 14971',
    ud: s => {
      if(s.includes('implant')||s.includes('stent')||s.includes('cage')||s.includes('screw')||s.includes('plate')||s.includes('fixation')) return { up:['Orthopedic Fixation Assembly', 'Spinal Fusion System'], down:['Bone Cement (PMMA per ISO 5833)', 'Surgical Driver Bits (Hex/Torx)', 'Cannulated Drill Guide Wires'] };
      if(s.includes('surgical')||s.includes('instrument')||s.includes('forcep')||s.includes('scissor')||s.includes('retractor')) return { up:['Surgical Instrument Set', 'Laparoscopic Access System'], down:['Ultrasonic Cleaning Trays', 'Surgical Grade Lubricant', 'Autoclave Sterilization Packaging'] };
      if(s.includes('dental')||s.includes('abutment')||s.includes('implant')) return { up:['Dental Implant Crown & Bridge', 'CAD/CAM Milling System'], down:['Zirconia Crown', 'Titanium Abutment Screw', 'Surgical Guide Sleeve'] };
      if(s.includes('cardiovascular')||s.includes('stent')||s.includes('tavi')) return { up:['Cardiovascular Stent Delivery System', 'TAVI Valve Frame Assembly'], down:['PTFE Balloon Catheter', 'Nitinol Guidewire', 'Crimping Tool Interface'] };
      return { up:['Medical Device Assembly', 'Surgical Navigation System'], down:['Sterilization Tray & Wrap', 'Silicone Surgical Mats', 'ISO 13485 Packaging'] };
    }
  },
  'Marine & Offshore': {
    sku:'TI-MRN', sub:'Deep-Sea & Subsea Engineering Components | Optimized for Seawater Immersion up to 6000m Depth',
    faq1_title:'What is the maximum operating depth?', faq1:'Grade 5 Ti-6Al-4V: rated to 600 bar (6000m) per ASME BPVC VIII Div. 3. Grade 2 CP-Ti: 300 bar (3000m). All subsea components 100% hydrostatically tested per API 6A / ISO 10423 to 1.5x rated depth.',
    faq2_title:'How is crevice corrosion prevented at sealing interfaces?', faq2:'Prevented by: (1) noble metal surface activation (Pd ion implantation), (2) crevice gaps <0.1 mm or >3.0 mm to eliminate O₂ concentration cells, (3) PTFE/EPDM backup seals. ASTM G78 testing per NACE TM0177.',
    q3q:'What torque values for subsea bolted connections?', q3a:'M16 = 150-180 Nm, M20 = 290-330 Nm, M24 = 500-560 Nm (lubricated Cu anti-seize per NORSOK M-001). Use 316L or Inconel 625 nuts. RTV sealant per API 6A.',
    ndt:'Hydrostatic pressure test per API 6A; Dye Penetrant (PT) per ASTM E1417; Ultrasonic wall thickness per ASTM A578; 100% CMM',
    ud: s => {
      if(s.includes('propeller')||s.includes('shaft')) return { up:['Marine Propulsion System', 'Stern Tube & Seal Assembly'], down:['Water-Lubricated Cutless Bearings', 'Propeller Shaft Grounding Rings', 'Oil-Filled Stern Tube Lubricant'] };
      if(s.includes('subsea')||s.includes('deep')||s.includes('rov')||s.includes('underwater')||s.includes('battery')||s.includes('clamp')) return { up:['ROV/AUV Manipulator Arm', 'Subsea Control Module'], down:['FKM O-Ring Seals (NORSOK M-710)', 'Hydraulic Subsea Connectors', 'PTFE/PEEK Isolation Washers'] };
      if(s.includes('seawater')||s.includes('pipe')||s.includes('fitting')||s.includes('flange')||s.includes('valve')) return { up:['Seawater Intake & Cooling System', 'Offshore Piping Manifold'], down:['EPDM Gaskets (NORSOK M-710)', 'Monel Fasteners', 'Seawater Strainer Mesh'] };
      return { up:['Marine Platform Assembly', 'Subsea Production System'], down:['FKM O-Ring Seals', 'CuNi Hydraulic Lines', 'ROV Hot-Stab Tooling'] };
    }
  },
  'Aerospace & Defense': {
    sku:'TI-AERO', sub:'Aircraft & Defense Structural Components | Optimized for Extreme Temperature & Fatigue Loading',
    faq1_title:'What is the high-cycle fatigue performance at elevated temperatures?', faq1:'Grade 5 STA: endurance limit 500-600 MPa at 10⁷ cycles (R=-1) at 20°C, 400-450 MPa at 315°C. 100% ultrasonic inspected (UT per AMS 2630 Class A). Proof-cycle tested per MIL-STD-1312. Surface finish Ra ≤ 0.4 µm.',
    faq2_title:'How does titanium perform against ballistic threats?', faq2:'Ti-6Al-4V per MIL-DTL-46077G: 30-40% weight saving vs RHA steel at equivalent V50. Heat treated to 36-42 HRC. Ballistically tested per MIL-STD-662F. PVD coating for wear resistance; bead blasting for spall reduction.',
    q3q:'What anti-galling treatment for aerospace threaded fasteners?', q3a:'Silver plating per AMS 2410 (0.01-0.02 mm) or MoS₂ dry-film per MIL-PRF-46010. Lubricated torque per NASM 1312-7. Torque reduction: 20-25% vs dry. Thread rolling per AMS 4993 mandatory.',
    ndt:'Ultrasonic Testing (UT) per AMS 2630 Class A; MPI per ASTM E1444; Dimensional CMM per AS9102',
    ud: s => {
      if(s.includes('engine')||s.includes('blade')||s.includes('blisk')||s.includes('turbine')||s.includes('compressor')) return { up:['Gas Turbine Engine Module', 'Compressor Rotor Assembly'], down:['Inconel 718 Blade Locks', 'Ceramic TBC Coatings', 'High-Temp Ni Anti-Seize'] };
      if(s.includes('landing')||s.includes('gear')) return { up:['Landing Gear Shock Strut', 'Wheel & Brake System'], down:['Parker Chromassure Seals', 'MIL-PRF-83282 Hydraulic Fluid', 'Corrosion Preventive MIL-PRF-16173'] };
      if(s.includes('airframe')||s.includes('pylon')||s.includes('fuselage')||s.includes('duct')||s.includes('bracket')) return { up:['Aircraft Fuselage Section', 'Environmental Control System'], down:['Monel Lockwire MS20995', 'PTFE Sealant Tape', 'MIL-SPEC NAS Fasteners'] };
      if(s.includes('missile')||s.includes('rocket')||s.includes('hypersonic')||s.includes('motor')) return { up:['Missile Airframe Section', 'Guidance & Control Housing'], down:['Ceramic Radome Interface Gaskets', 'HTPB Propellant Grain', 'Pyrotechnic Fastener Release'] };
      return { up:['Aerospace Vehicle Assembly', 'Structural Airframe'], down:['Aerospace Fasteners NAS6704', 'MIL-PRF-7808 Lubricating Oil', 'Encapsulated Seals AMS7276'] };
    }
  },
  'Automotive & Motorsports': {
    sku:'TI-AUTO', sub:'High-Performance Racing & Automotive Components | Optimized for Extreme RPM & Temperature',
    faq1_title:'What titanium alloy is used for connecting rods in high-RPM engines?', faq1:'Grade 5 STA for up to 8,500 RPM. For >9,000 RPM: Ti-6Al-2Sn-4Zr-2Mo with shot peening to >800 MPa compressive stress. 100% MPI per ASTM E1444. ARP 2000 bolts at 80-85 Nm. Weight savings: 35-40% vs 4340 steel.',
    faq2_title:'What is the exhaust system temperature limit?', faq2:'Grade 5: continuous 315°C (peak 480°C). Ti-6Al-2Sn-4Zr-2Mo: >480°C exhaust headers. All welded per AWS D10.6 with ERTi-2 filler. 100% dye penetrant (ASTM E1417).',
    q3q:'What torque for titanium wheel studs and lug nuts?', q3a:'M12×1.5 = 80-90 Nm, M14×1.5 = 100-115 Nm (lubricated Molykote M77). Use steel or Ti mating nuts only — never aluminum. Re-torque after first heat cycle. Thread rolling required per SAE J429.',
    ndt:'MPI crack detection per ASTM E1444; Dimensional CMM; Tensile testing per ASTM E8; Salt spray ASTM B117',
    ud: s => {
      if(s.includes('engine')||s.includes('valve')||s.includes('connecting')||s.includes('spring')||s.includes('rocker')) return { up:['High-Performance Engine', 'Valve Train System'], down:['Valve Spring Retainer Locks', '10W-60 Racing Oil', 'NAS 6603 Chromoly Fasteners'] };
      if(s.includes('suspension')||s.includes('linkage')||s.includes('tie')||s.includes('wishbone')||s.includes('anti-roll')) return { up:['Racing Suspension Assembly', 'Damper & Spring System'], down:['PTFE Spherical Bearings', 'Polyurethane Bushings', 'M14 Rod Ends'] };
      if(s.includes('exhaust')||s.includes('baffle')) return { up:['Racing Exhaust System', 'Silencer Assembly'], down:['Titanium Exhaust Wrap', 'V-Band Clamps (T304SS)', 'O₂ Sensor Bung Plug'] };
      if(s.includes('brake')||s.includes('rotor')||s.includes('caliper')) return { up:['Racing Brake System', 'Caliper Assembly'], down:['Carbon-Ceramic Brake Pads', 'DOT 5.1 Brake Fluid', 'Banjo Bolt Copper Washers'] };
      return { up:['Motorsport Vehicle Assembly', 'Performance Drivetrain'], down:['ARP Chromoly Fasteners', 'Molykote M77 Assembly Lube', 'Safety Wire MS20995'] };
    }
  },
  'Electroplating & Surface Finishing': {
    sku:'TI-EP', sub:'Electroplating & PCB Manufacturing Hardware | Optimized for Acid & Chlorine Resistance',
    faq1_title:'What is the corrosion rate in 10% sulfuric acid at 60°C?', faq1:'Grade 2 CP-Ti: <0.05 mm/year. Grade 7 (Ti-0.15Pd): <0.01 mm/year. 316L: >1.5 mm/year. 100% PMI verified per ASTM E1476.',
    faq2_title:'Does titanium anode basket hook provide sufficient conductivity?', faq2:'Yes. Basket contact cross-section sized for <0.5V drop at 500A. Contact resistance at Ti-Cu interface: < 0.001 Ω.',
    q3q:'What cleaning procedure for titanium jigs returning from production?', q3a:'1. Rinse DI water (60°C), 2. Immerse in 10% HNO₃ + 2% HF for 2-5 min at 25°C, 3. DI water rinse (18 MΩ·cm), 4. Hot air dry (80°C). Never use HCl or FeCl₃. Inspect monthly.',
    ndt:'PMI per ASTM E1476; Dimensional CMM; Thickness gauge verification; 100% visual inspection',
    ud: s => {
      if(s.includes('anode')||s.includes('basket')) return { up:['Electroplating Rectifier System', 'Plating Tank Anode Rail Assembly'], down:['Nickel S-DEP Sulfate Anodes', 'Polypropylene Basket Lining', 'Ti Buss Bar Clamps'] };
      if(s.includes('rack')||s.includes('jig')) return { up:['Electroplating Conveyor System', 'Process Tank Line'], down:['PVC/PVDF Rack Insulation', 'Titanium Contact Springs', 'Stainless Steel Rack Frame'] };
      return { up:['PCB Plating Line', 'Electrolytic Cell System'], down:['Phosphor Bronze Contacts', 'PTFE Heater Sheaths', 'Polypropylene Filter Cartridges'] };
    }
  },
  'Chemical Processing': {
    sku:'TI-CHEM', sub:'Chemical Reactor & Piping System Components | Optimized for Corrosive Media up to 315°C',
    faq1_title:'What is the maximum operating temperature in oxidizing acids?', faq1:'Grade 2 CP-Ti in 20-70% HNO₃: 315°C at <0.1 mm/year. Grade 7 (Ti-0.15Pd): 315°C in reducing acids (HCl, H₂SO₄). Design per ASME B31.3 with 3mm corrosion allowance.',
    faq2_title:'How does titanium perform in wet chlorine gas?', faq2:'Titanium is the only cost-effective metal for wet chlorine (Cl₂ with >0.5% H₂O). Corrosion <0.01 mm/year up to 230°C. DRY chlorine (H₂O <0.1%) causes rapid attack — use Hastelloy C-276. Moisture monitoring per ASTM D512.',
    q3q:'What gasket for titanium flanges in reducing acid service?', q3a:'Expanded PTFE (ePTFE) per ASME B16.20. >200°C: flexible graphite with 316L inner ring. Metallic RTJ gaskets in titanium R-24 for Class 1500+. Torque per ASME PCC-1.',
    ndt:'Hydrostatic test per ASME B31.3; PMI per ASTM E1476; Dimensional CMM; 100% wall thickness UT per ASTM A578',
    ud: s => {
      if(s.includes('pipe')||s.includes('fitting')||s.includes('flange')||s.includes('tee')||s.includes('reducer')||s.includes('stub')) return { up:['Chemical Piping Network', 'Heat Exchanger Tube Bundle'], down:['PTFE Envelope Gaskets (ASME B16.20)', 'Monel/Inconel Fasteners', 'Thermowell Instrumentation'] };
      if(s.includes('reactor')||s.includes('tank')||s.includes('agitator')||s.includes('coil')||s.includes('sparger')||s.includes('quill')) return { up:['Chemical Reactor Vessel', 'Agitator Mixer System'], down:['PTFE Lined Pipe Spools', 'Hastelloy C-276 Blades', 'Glass-Lined Steel Vessel'] };
      if(s.includes('valve')||s.includes('stem')||s.includes('strainer')) return { up:['Chemical Process Valve Assembly', 'Control Valve Train'], down:['PTFE/Graphite Packing', 'FKM/FFKM Seat Seals (Kalrez)', 'Stainless Valve Stem Extension'] };
      return { up:['Chemical Process Skid', 'Acid/Caustic Transfer System'], down:['PP/PVDF Pipe Supports', 'PTFE Tape Sealant', '304SS Corrosion Tags'] };
    }
  },
  'Energy': {
    sku:'TI-EN', sub:'Nuclear, Hydrogen & Power Generation Components | Optimized for Extreme Environment Reliability',
    faq1_title:'What is the hydrogen embrittlement resistance?', faq1:'Grade 2 CP-Ti: H pickup <0.002 wt% at 200°C in 100 bar H₂ (10,000h). Grade 5: H threshold <0.015 wt% vs <0.001 wt% for 316L. NACE MR0175/ISO 15156 compliant for sour service.',
    faq2_title:'How does titanium perform in supercritical CO₂ power cycles?', faq2:'Grade 5: corrosion <0.01 mm/year in sCO₂ at 550°C/250 bar — superior to 316L (0.15 mm/year) and comparable to Inconel 625 at 1/3 cost.',
    q3q:'What material for PEM electrolyzer bipolar plates?', q3a:'Grade 2 CP-Ti with 0.5-1.0 µm Pt coating (sputtered). Contact resistance <10 µΩ·cm² per DOE targets. Corrosion <0.1 µA/cm² at 2V in 80°C H₂SO₄. Service life >40,000h. Alternative: 2-3 µm TiN PVD.',
    ndt:'UT per ASTM A388; PMI per ASTM E1476; 100% dimensional CMM; Hydrostatic test per ASME Section VIII',
    ud: s => {
      if(s.includes('nuclear')||s.includes('control')||s.includes('reactor')||s.includes('fuel')||s.includes('spent')) return { up:['Nuclear Reactor Core Internals', 'Control Rod Drive System'], down:['Inconel 718 Grid Spacers', 'Zircaloy-4 Fuel Cladding', 'Alloy 600 SG Tubing'] };
      if(s.includes('hydrogen')||s.includes('h2')||s.includes('electrolyzer')||s.includes('pem')||s.includes('fuel-cell')||s.includes('end-plate')) return { up:['PEM Electrolyzer Stack', 'H₂ Compression System'], down:['Pt-Coated Bipolar Plates', 'PFSA Membrane (Nafion®)', 'Inconel 625 H₂ Vessels'] };
      if(s.includes('oil')||s.includes('gas')||s.includes('downhole')||s.includes('wellhead')||s.includes('tubing')) return { up:['Christmas Tree Assembly', 'Subsea Production Module'], down:['316L Hydraulic Lines', 'FKM Seals (NORSOK M-710)', 'Al-Zn-In Galvanic Anodes'] };
      return { up:['Power Turbine Assembly', 'Thermal Management System'], down:['Inconel 718 Blades', 'Steam Seal Carbon Rings', 'Wear Sleeves (Thermal Spray)'] };
    }
  },
  'General Industrial': {
    sku:'TI-IND', sub:'Standard Industrial Hardware & Fasteners | Optimized for Corrosion Resistance & Reliability',
    faq1_title:'Are titanium standard fasteners compatible with steel tooling?', faq1:'Yes. All drives conform to ISO 272/DIN 912. Compatible with standard hex keys/sockets. Torque per VDI 2230. Recommended reduction: 15% vs 8.8 steel. Thread rolling per DIN 13-1, 6g tolerance.',
    faq2_title:'Strength comparison to Grade 8.8 / 10.9 steel?', faq2:'Grade 5 Ti-6Al-4V (STA): UTS 1,034 MPa = equivalent to 10.9 steel at 45% lower weight. Grade 2 CP-Ti: UTS 345 MPa = Grade 4.6 steel. Use Grade 5 or 9 for structural bolting. 100% MPI inspected.',
    q3q:'What anti-seize for titanium industrial fasteners?', q3a:'Nickel-based (Never-Seez NSWT-7100) or copper-based (Loctite C5-A). Avoid MoS₂ in oxygen service. Food-grade: Ni-free PTFE paste. Torque factor: 0.75-0.85 of steel lubricated values.',
    ndt:'MPI per ASTM E1444; 6g Go/No-Go ring gauge; Tensile testing per ASTM E8; Dimensional CMM',
    ud: s => {
      if(s.includes('fastener')||s.includes('bolt')||s.includes('screw')||s.includes('washer')||s.includes('stud')||s.includes('pin')||s.includes('cotter')) return { up:['General Machinery Assembly', 'Structural Steel Framework'], down:['ISO 4762 Socket Keys', 'Loctite 243 Threadlocker', '316L Flat Washers'] };
      if(s.includes('flange')||s.includes('fitting')) return { up:['Industrial Piping Rack', 'Process Equipment Installation'], down:['PTFE Gasket Sheet (ASME B16.21)', 'Nickel Anti-Seize', 'PTFE Pipe Thread Sealant'] };
      if(s.includes('bracket')||s.includes('mount')) return { up:['Machine Frame Assembly', 'Conveyor Structure'], down:['SS Rivet Nuts', 'Nylon Isolation Washers', '316L Hex Bolts'] };
      return { up:['Industrial Equipment Assembly', 'Manufacturing Line'], down:['Metric Hardware Kit', 'Industrial Threadlocker', 'Stainless Tagging'] };
    }
  },
  'Environmental Engineering': {
    sku:'TI-ENV', sub:'Wastewater & Environmental Treatment Components | Optimized for Biocorrosion & Chemical Resistance',
    faq1_title:'How does titanium resist MIC (microbiologically influenced corrosion)?', faq1:'Complete immunity — TiO₂ prevents bacterial biofilm adhesion that causes under-deposit corrosion. 316L in wastewater: 0.1-0.5 mm/year MIC rates. Titanium: <0.001 mm/year. Verified per ASTM G170.',
    faq2_title:'Service life in H₂S-containing anaerobic digester?', faq2:'Grade 2 CP-Ti: unlimited at H₂S <10,000 ppm. No SSC per NACE TM0177. 316L threshold: <100 ppm at 25°C. Preferred for digester gas piping, sludge scrapers, diffuser bodies.',
    q3q:'What surface finish for sludge-handling components?', q3a:'Ra ≤ 0.8 µm with Type II anodizing to minimize solids adhesion. Scraper blades: Ra 0.4 µm polished to reduce torque. Sludge pipe: Ra 0.8 µm with 3mm min wall per B31.3. 100% UT thickness tested.',
    ndt:'Ultrasonic wall thickness per ASTM A578; Dimensional CMM; 100% dye penetrant per ASTM E1417',
    ud: s => {
      if(s.includes('filter')||s.includes('screen')||s.includes('strainer')||s.includes('element')) return { up:['Wastewater Filtration System', 'Rotary Drum Screen Assembly'], down:['Polypropylene Filter Cloth', 'EPDM Gasket Seals', 'SS Backwash Spray Nozzles'] };
      if(s.includes('sludge')||s.includes('scraper')||s.includes('digester')||s.includes('blade')) return { up:['Anaerobic Digester System', 'Sludge Collection Mechanism'], down:['EPT Rubber Squeegees', 'H₂S Gas Monitoring Sensors', 'FRP Pipe Supports'] };
      if(s.includes('pump')||s.includes('impeller')||s.includes('dosing')||s.includes('strainer')) return { up:['Chemical Dosing Station', 'Effluent Pump Station'], down:['Viton/FKM Pump Seals', 'PVC Schedule 80 Feed Lines', '316L Fasteners'] };
      return { up:['Water Treatment Plant', 'Chemical Feed System'], down:['EPDM Gaskets', 'CPVC Pipe Fittings', 'HDPE Concrete Tank Lining'] };
    }
  }
};

// ── Page Generation ──
function page(entity) {
  const { title, aliases, industry, system, category, function: funcDesc, material, alloyReason, process, surfaceTreatment, inspection, standards, faq } = entity;
  const mat = gm(material);
  const type = TYPE[material] || 'Titanium Alloy';
  const slug = title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const cfg = CFG_DICT[industry];
  if (!cfg) return null;

  const t = title.toLowerCase();
  const sku = `${cfg.sku}-${(category||'GEN').substring(0,3).toUpperCase()}-${slug.split('-').slice(-3).join('').toUpperCase().substring(0,6)}`;

  const sf = surfaceTreatment?.length ? surfaceTreatment.join('; ') : 'Passivation ASTM F86';
  const inspText = inspection?.length ? inspection.join('; ') : 'Dimensional inspection per ISO 2768-m';
  const procText = process?.length ? process.join(', ') : 'Precision CNC machining';
  const wtReduc = mat.d === '4.43 g/cm³' ? '45% weight reduction vs steel (7.85 g/cm³)' : '42% weight reduction vs 316L Stainless Steel (8.0 g/cm³)';
  const appText = genApp(industry, t, mat);
  const app2Text = genApp2(industry, t);
  const lifecycleText = genLifecycle(industry, wtReduc);

  const q1 = faq?.[1] ? { q:faq[1].q, a:faq[1].a } : { q:cfg.faq1_title, a:cfg.faq1 };
  const q2 = faq?.[2] ? { q:faq[2].q, a:faq[2].a } : { q:cfg.faq2_title, a:cfg.faq2 };
  const q3 = { q:cfg.q3q, a:cfg.q3a };
  const ud = typeof cfg.ud === 'function' ? cfg.ud(system||'') : { up:['System Assembly'], down:['Mating Components'] };

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
density: "${mat.d}"
tensile_strength: "${mat.ts}"
yield_strength: "${mat.ys}"
elongation: "${mat.el}"
hardness: "${mat.hd}"
modulus: "${mat.mod}"
thermal_conductivity: "${mat.tc}"
max_service_temp: "${mat.mt}"
standards: ${JSON.stringify(standards || ['ASTM B348'])}
compliance: ["EN 10204 3.1", "REACH", "RoHS 3", "ISO 2768-m", "ISO 9001:2015", "AS9100D"]
surface_finish: "${sf}"
manufacturing_process: "${procText}"
weight_reduction: "${wtReduc}"
function: "${funcDesc || ''}"
aliases: ${JSON.stringify(aliases || [])}
pubDate: "2026-07-18"
---

# ${title}
**${cfg.sub}**

- **SKU/Part Number Series:** ${sku}
- **Supply Availability:** In-Stock / Custom OEM Blueprint Fabrication (MOQ: 1 pc)
- **Key Certifications:** EN 10204 3.1 MTC Available / REACH & RoHS 3 Compliant / ISO 9001:2015 / AS9100D
- **Material:** ${material} (${mat.uns} / ${mat.wnr}) — ${(alloyReason||'').substring(0, 200)}...

---

### 1. Technical Specifications Matrix (The Engineering Gate)

| Technical Parameter | Specification Value | Associated Industrial Standard |
| :--- | :--- | :--- |
| **Component Category** | ${category || 'Precision Component'} | ${industry} Industry Classification |
| **Material Designation** | ${material} — ${type} | **${mat.uns} / ${mat.wnr}** |
| **International Standards** | Conforms to ${mat.std} | Full manufacturing and material testing compliance |
| **Tensile Strength ($R_m$)** | ${mat.ts} | Conforms to standard mechanical minima |
| **Yield Strength ($R_{p0.2}$)** | ${mat.ys} | Guarantees structural load boundaries |
| **Elongation ($A5$)** | ${mat.el} | Ensures ductility for forming and assembly |
| **Hardness** | ${mat.hd} | Consistent machinability and wear resistance |
| **Density & Weight Profile** | ${mat.d} | ${wtReduc} |
| **Modulus of Elasticity** | ${mat.mod} | Determines stiffness and deflection under load |
| **Thermal Conductivity** | ${mat.tc} | Critical for thermal management in service |
| **Dimensional Tolerances** | ISO 2768-m (Medium) / Threads: Class 6g (DIN 13-1 / ISO 965-2) | Guarantees interchangeability in assemblies |
| **Surface Treatment** | ${sf} | ASTM F86 / Industry-specific standard |
| **Max Continuous Service Temp** | ${mat.mt} | Safe operating envelope verified |
| **NDT & Inspection** | ${inspText} | ${cfg.ndt} |

---

### 2. Supply Chain, Traceability & Quality Compliance (The Procurement Gate)

- **Material Traceability (EN 10204 3.1):** Every production batch is 100% traceable from raw ingot to finished ${t}. Shipments include a complete **EN 10204 3.1 Mill Test Certificate (MTC)** detailing heat analysis chemical composition and destructive mechanical testing results per ASTM B348 specification.
- **Non-Destructive Testing (NDT):** Components undergo ${cfg.ndt} to guarantee zero sub-surface voids, micro-cracks, or structural anomalies. Threaded features verified with Go/No-Go ring gauges (Class 6g) per DIN 13-1 / ISO 965-2.
- **Environmental Compliance:** 100% compliant with **REACH Regulation (EC No 1907/2006)** and **RoHS 3 Directive (2015/863/EU)**. Certificate of Conformity (CoC) issued with every shipment.
- **Quality Management:** Manufactured in ISO 9001:2015 and AS9100D-certified facilities. First Article Inspection (FAI) reports available upon request per AS9102.

---

### 3. Application Dynamics & Alternative Displacement (Why Titanium?)

- **Corrosion Kinetics & Operating Boundaries:** In ${industry.toLowerCase()} applications, ${t} is exposed to ${appText} The material's low thermal conductivity (${mat.tc}) provides critical thermal isolation and dimensional stability.

- **Galvanic Isolation & Material Compatibility:** ${app2Text} The TiO₂ passive layer is maintained via ASTM F86 passivation (20-30% HNO₃ bath, 30 min at 50°C) which removes iron contamination and restores the full oxide barrier.

- **Lifecycle Cost Benefit:** While the initial acquisition cost is 2-4x that of 316L or aluminum equivalents, the lifecycle TCO favors titanium: ${lifecycleText}

---

### 4. Advanced Manufacturing & Mechanical Stress Control

- **CNC Tooling & Execution Strategy:** Titanium's low thermal conductivity (${mat.tc} — approximately 10% of aluminum) and high chemical reactivity require strict CNC parameter controls to prevent work-hardening and tool failure. Our machining strategy employs: (a) **Cutting speed** $V_c$ = 40-60 m/min for roughing, 60-80 m/min for finishing using grade K313 cemented carbide inserts with TiAlN PVD coating; (b) **Feed rate** $f$ = 0.08-0.15 mm/rev maintaining constant chip load to avoid work-hardening zones; (c) **High-pressure flood coolant** (>70 bar / 1000 psi) directed at the cutting interface to suppress adiabatic shear band formation; (d) **Rigid setups** with minimum tool overhang (<3:1 ratio) to eliminate deflection-induced taper and chatter.

- **Residual Stress Mitigation:** Every ${t} batch undergoes post-machining vacuum stress-relieving annealing at 540-675°C for 1-2 hours under argon atmosphere (O₂ < 50 ppm) to eliminate residual tensile stresses induced by CNC material removal. This thermal cycle reduces microstructural distortion risk by >70% and prevents premature **stress corrosion cracking (SCC)** during field service. All threaded features are produced via **thread rolling** (not thread cutting), which induces compressive residual stresses at the thread root and maintains uninterrupted grain flow — increasing fatigue strength by 30-50% compared to cut threads. ISO 965-2 Class 6g tolerance is verified with calibrated Go/No-Go ring gauges on 100% of production.

---

### 5. Technical FAQ for System Engineers

#### Q1: ${q1.q}
- **A1:** ${q1.a}

#### Q2: ${q2.q}
- **A2:** ${q2.a}

#### Q3: ${q3.q}
- **A3:** ${q3.a}

---

### 6. Semantic Graph & Component Topology (The AI Search Optimization)

- **Primary Industrial Entity:** ${(category||'').includes('Fastener')||(category||'').includes('Bolt')||(category||'').includes('Screw') ? 'MechanicalFastener / IndustrialHardware' : (category||'').includes('Flange')||(category||'').includes('Fitting')||(category||'').includes('Tee')||(category||'').includes('Reducer') ? 'PipeFitting / IndustrialConnector' : (category||'').includes('Valve')||(category||'').includes('Stem')||(category||'').includes('Seal') ? 'ValveComponent / FlowControl' : 'PrecisionMachinedComponent / ' + industry.replace(/[/,&]/g,'').replace(/\\s+/g,'')}
- **Upstream System Integration:** ${ud.up.join('; ')}
- **Downstream Consumables & Tooling:** ${ud.down.join('; ')}

**Cross-Reference Classification:**
- **Industry:** ${industry}
- **System:** ${system || 'General Application'}
- **Material Classification:** ${material} — ${mat.uns} / ${mat.wnr}
- **Manufacturing Processes:** ${procText}
- **Inspection Standards:** ${inspText}
`;
}

// ── Main ──
const REMAINING = ['Consumer Electronics', 'Medical Device', 'Marine & Offshore', 'Aerospace & Defense', 'Automotive & Motorsports', 'Electroplating & Surface Finishing', 'Chemical Processing', 'Energy', 'General Industrial', 'Environmental Engineering'];

const files = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.json'));
const entities = [];

for (const file of files) {
  const raw = readFileSync(join(ENTITIES_DIR, file), 'utf-8');
  try {
    const entity = JSON.parse(raw);
    if (REMAINING.includes(entity.industry)) {
      entities.push(entity);
    }
  } catch (e) {
    console.error(`Error parsing ${file}: ${e.message}`);
  }
}

console.log(`\nFound ${entities.length} products across ${REMAINING.length} remaining industries.\n`);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let byInd = {};
for (const entity of entities) { byInd[entity.industry] = (byInd[entity.industry]||0)+1; }
for (const [ind, cnt] of Object.entries(byInd).sort((a,b)=>b[1]-a[1])) {
  console.log(`  ${ind}: ${cnt} products`);
}
console.log('');

const startTime = Date.now();
let count = 0;

for (const entity of entities) {
  const slug = entity.title.toLowerCase().replace(/[()]/g, '').replace(/[\s/]+/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
  const content = page(entity);
  if (content) {
    writeFileSync(join(OUT_DIR, `${slug}.md`), content, 'utf-8');
    count++;
    if (count % 10 === 0) process.stdout.write(`\r  [${count}/${entities.length}] ${entity.industry}: ${entity.title}                `);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\r  [${count}/${entities.length}] Complete.                                            `);
console.log(`\n✅ All remaining batches complete. ${count} product spec pages generated in ${elapsed}s.`);
console.log(`   Output directory: ${OUT_DIR}\n`);
