"""
Phase 3: Seed Product Entities for ALL remaining industries.
Generates ~400+ entities across Aerospace, Semiconductor, Chemical, Marine, Energy, etc.
"""
import json, os, re

OUT_DIR = 'src/content/product-entities'
os.makedirs(OUT_DIR, exist_ok=True)

# ── Helper ──
def write_entity(title, func, category, aliases, industry, system_name, mat_name, process, inspection, failures=None):
    slug = title.lower().replace(' ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').strip('-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    
    entity = {
        'title': title,
        'aliases': aliases,
        'industry': industry,
        'system': system_name,
        'category': category,
        'function': func,
        'material': mat_name,
        'alloyReason': f'{mat_name} offers the optimal balance of strength, corrosion resistance, and fatigue life for {title.lower()}.',
        'process': process[:6],
        'surfaceTreatment': ['Passivation ASTM F86'],
        'inspection': inspection[:4],
        'commonFailures': failures or [],
        'designConsiderations': [],
        'standards': ['ASTM B348', 'ASME'],
        'typicalRfqRequirements': [],
        'faq': [],
        'relatedProducts': [],
        'relatedCapabilities': [p.lower().replace(' / ', '-').replace('/', '-').replace(' ', '-').replace('--', '-').strip('-') for p in process[:3]],
        'relatedMaterials': [],
        'relatedIndustries': [industry.lower().replace(' & ', '-').replace('/', '-').replace(' ', '-')],
        'seoTitle': f'{title} - {mat_name} - Precision CNC Titanium Component',
        'seoDescription': f'{title} - {func} Manufactured from {mat_name}. {", ".join(process[:3])}. AS9100D & ISO 9001 certified.',
        'order': 0,
        'pubDate': '2026-07-18',
    }
    fpath = os.path.join(OUT_DIR, f'{slug}.json')
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(entity, f, indent=2, ensure_ascii=False)

# ════════════════════════════════════════════
# AEROSPACE & DEFENSE
# ════════════════════════════════════════════
AERO_IND = 'Aerospace & Defense'
AERO_MAT = 'Grade 5 Ti-6Al-4V'
AERO_PROC = ['Closed-die forging', '5-axis CNC machining', 'Heat treatment (STA)', 'Shot peening']
AERO_INSP = ['FPI (fluorescent penetrant)', 'X-ray / CT inspection', 'Ultrasonic inspection', 'CMM dimensional']

aero_blisk = [
    ('Titanium Compressor Blisk', 'Integral bladed compressor disk (blisk)', 'Engine Component', ['Blisk', 'Compressor disk', 'IBR', 'Integral blade rotor']),
    ('Titanium Compressor Blade', 'Axial compressor rotor blade', 'Engine Component', ['Compressor blade', 'Rotor blade', 'Aerofoil']),
    ('Titanium Compressor Casing Segment', 'Compressor case aft section', 'Engine Component', ['Compressor housing', 'Gas path casing', 'Engine case']),
    ('Titanium LPT Blade (Gamma-TiAl)', 'Low-pressure turbine blade, gamma-TiAl intermetallic', 'Engine Component', ['Turbine blade', 'LPT blade', 'Gamma blade']),
]

aero_landing = [
    ('Titanium Landing Gear Strut', 'Main landing gear shock strut forging', 'Landing Gear', ['Landing gear', 'Shock strut', 'Oleo strut']),
    ('Titanium Landing Gear Truck Beam', 'Bogie beam for main landing gear', 'Landing Gear', ['Bogie beam', 'Truck beam', 'Axle beam']),
    ('Titanium Landing Gear Side Brace', 'Landing gear folding side brace link', 'Landing Gear', ['Side brace', 'Retract brace', 'Drag brace']),
]

aero_missile = [
    ('Titanium Rocket Motor Case', 'Solid rocket motor case section ring', 'Missile Hardware', ['Motor case', 'Rocket case', 'SRM casing']),
    ('Titanium Missile Airframe Skin', 'Missile body skin panel', 'Missile Hardware', ['Missile skin', 'Airframe panel', 'Body section']),
    ('Titanium Hypersonic Control Surface', 'Hypersonic missile all-moving fin (Ti-65)', 'Missile Hardware', ['Control fin', 'Hypersonic rudder', 'Aero surface']),
    ('Titanium Launch Canister Rail', 'Missile launch tube guide rail', 'Missile Hardware', ['Launch rail', 'Guide rail', 'Canister rail']),
]

aero_duct = [
    ('Titanium Bleed Air Duct', 'Engine bleed air duct (Grade 9 Ti tube)', 'Pneumatic System', ['Bleed duct', 'Bleed air line', 'Pneumatic tube']),
    ('Titanium Environmental Control Duct', 'ECS ducting for cabin pressurization', 'Pneumatic System', ['ECS duct', 'A/C duct', 'Cabin air duct']),
    ('Titanium Engine Pylon Bracket', 'Engine mounting pylon bracket/lug', 'Engine Component', ['Pylon bracket', 'Engine mount', 'Thrust link']),
]

aero_other = [
    ('Titanium Ballistic Armor Plate', 'Vehicle/personnel ballistic armor plate', 'Armor', ['Armor plate', 'Ballistic panel', 'Protection plate']),
    ('Titanium Cryogenic Tank Clamp Band', 'Propellant tank clamp band (Ti-5Al-2.5Sn ELI)', 'Cryogenic Hardware', ['Clamp band', 'Tank band', 'Collar']),
    ('Titanium Satellite Deployment Shaft', 'Satellite release mechanism shaft', 'Space Hardware', ['Deployment shaft', 'Release shaft', 'Separation pin']),
    ('Titanium Helicopter Rotor Hub', 'Main rotor hub for rotorcraft', 'Rotorcraft', ['Rotor hub', 'Helicopter hub', 'Rotor head']),
]

# ════════════════════════════════════════════
# SEMICONDUCTOR
# ════════════════════════════════════════════
SEMI_IND = 'Semiconductor'
SEMI_MAT = 'Grade 2 CP-Ti (Ultra-High Purity)'
SEMI_PROC = ['Precision CNC turning', 'Electropolishing', 'Class 100 cleanroom cleaning', 'Helium leak testing']
SEMI_INSP = ['Helium leak test (1e-9 mbar.L/s)', 'Surface roughness (Ra<0.2um)', 'PMI verification', 'Particle count (Class 100)']

semi_uhv = [
    ('Titanium VCR Male Gland', 'VCR male gland fitting for UHV gas lines', 'Gas Delivery', ['VCR fitting', 'Male gland', 'UHV connector']),
    ('Titanium VCR Female Nut', 'VCR female nut coupling for UHV gas lines', 'Gas Delivery', ['VCR nut', 'Female coupling', 'UHV nut']),
    ('Titanium VCR Micro-Gasket', 'Titanium micro-gasket for VCR knife-edge seal', 'Gas Delivery', ['VCR gasket', 'Seal ring', 'UHV gasket']),
    ('Titanium Double Ferrule Front Sleeve', 'Front ferrule for compression tube fitting', 'Gas Delivery', ['Front ferrule', 'Swage sleeve', 'Tube ferrule']),
    ('Titanium Double Ferrule Back Ring', 'Back ring for compression tube fitting', 'Gas Delivery', ['Back ferrule', 'Compression ring', 'Swage back']),
    ('Titanium Multi-Port Gas Manifold', 'Monoblock multi-port gas mixing manifold', 'Gas Delivery', ['Gas manifold', 'Mix block', 'Distribution block']),
    ('Titanium Gas Check Valve Plunger', 'Gas line check valve plunger', 'Gas Delivery', ['Check valve', 'Plunger', 'Valve poppet']),
    ('Titanium Micro-Orifice Restrictor', 'Laser-drilled micro-aperture gas restrictor disc', 'Gas Delivery', ['Orifice disc', 'Restrictor', 'Flow restrictor']),
    ('Titanium Gas Quick-Disconnect Coupler', 'Utility quick-disconnect vacuum coupler', 'Gas Delivery', ['QD coupler', 'Quick connect', 'Disconnect fitting']),
    ('Titanium Gas Y-Splitter Connector', 'Y-shaped forged gas splitting connector', 'Gas Delivery', ['Y-connector', 'Splitter', 'Branch fitting']),
]

semi_chamber = [
    ('Titanium Conflat Knife-Edge Ring', 'Conflat flange knife-edge sealing ring', 'Chamber Seal', ['CF ring', 'Knife edge', 'Conflat seal']),
    ('Titanium Segmented Clamping Ring', 'Segmented circular flange clamping ring', 'Chamber Seal', ['Clamp ring', 'Segmented ring', 'Flange clamp']),
    ('Titanium Centering Ring (KF/ISO)', 'KF/ISO centering ring for vacuum seals', 'Chamber Seal', ['Centering ring', 'KF centering', 'ISO ring']),
    ('Titanium Vented Vacuum Screw', 'Center-bored vented screw for UHV blind holes', 'Chamber Hardware', ['Vented screw', 'UHV screw', 'Vacuum bolt']),
    ('Titanium High-Load Flange Washer', 'High-load washer for vacuum flange bolting', 'Chamber Hardware', ['Flange washer', 'Vacuum washer', 'Load washer']),
    ('Titanium Gate Valve Seal Retainer', 'Gate valve dynamic seal retainer ring', 'Chamber Hardware', ['Seal retainer', 'Valve retainer', 'Dynamic seal ring']),
    ('Titanium Slit-Valve Oval Bezel', 'Oval slit-valve sealing bezel for wafer transfer', 'Chamber Hardware', ['Slit bezel', 'Valve bezel', 'Oval frame']),
    ('Titanium Quartz Window Retainer', 'Quartz window retaining bezel ring', 'Chamber Hardware', ['Window retainer', 'Viewport ring', 'Optical port ring']),
    ('Titanium Split-Ring Quick Flange', 'Split-ring quick-release flange segment', 'Chamber Hardware', ['Quick flange', 'Split ring', 'Clamp segment']),
]

semi_shield = [
    ('Titanium Chamber Liner (Upper)', 'Upper chamber wall protective plasma liner', 'Chamber Shield', ['Chamber liner', 'Wall shield', 'Plasma liner']),
    ('Titanium Exhaust Baffle Plate', 'Lower exhaust plenum baffle plate', 'Chamber Shield', ['Baffle plate', 'Exhaust baffle', 'Flow baffle']),
    ('Titanium Shadow Ring Bracket', 'Arc-shaped shadow ring support bracket', 'Chamber Shield', ['Shadow ring', 'Edge ring', 'Focus ring bracket']),
    ('Titanium Ceramic Heater Clamp Plate', 'Ceramic heater core clamping plate', 'Chamber Shield', ['Heater clamp', 'Ceramic clamp', 'Pedestal plate']),
    ('Titanium RF Grounding Spring Finger', 'RF grounding spring contact finger (Nitinol)', 'Chamber Shield', ['Ground finger', 'RF spring', 'Contact finger']),
    ('Titanium Shield Stand-off Bushing', 'Plasma shield stand-off spacer bushing', 'Chamber Shield', ['Stand-off', 'Spacer bushing', 'Shield spacer']),
    ('Titanium Slit-Valve Protection Shunt', 'Slit-valve plasma deposition protection shunt', 'Chamber Shield', ['Deposition shield', 'Valve shunt', 'Coating protector']),
    ('Titanium Threaded Blind Stud (Interior)', 'Chamber interior threaded blind mounting stud', 'Chamber Hardware', ['Blind stud', 'Interior stud', 'Mounting pin']),
]

semi_parts = [
    ('Titanium Wafer Handling End-Effector', 'Robot end-effector vacuum pad for wafer handling', 'Wafer Handling', ['End-effector', 'Wafer pad', 'Vacuum gripper']),
    ('Titanium Ion Implantation Electrode', 'Ion extraction electrode disk for implanter', 'Ion Implant', ['Extraction electrode', 'Ion disk', 'Beam electrode']),
    ('Titanium MOCVD Susceptor Support Arm', 'Wafer susceptor support arm for MOCVD reactor', 'MOCVD', ['Susceptor arm', 'Wafer support', 'Reactor arm']),
    ('Titanium Lithography Stage Flexure', 'Monolithic flexure mount for lithography mirror stage', 'Lithography', ['Flexure mount', 'Stage flexure', 'Mirror mount']),
    ('Titanium Lens Retaining Ring (Metrology)', 'Optical lens retaining ring for metrology tools', 'Metrology', ['Lens ring', 'Optical ring', 'Retainer ring']),
]

# ════════════════════════════════════════════
# CHEMICAL PROCESSING & ENERGY
# ════════════════════════════════════════════
CHEM_IND = 'Chemical Processing'
CHEM_MAT = 'Grade 2 CP-Ti'
CHEM_PROC = ['Seamless tube extrusion', 'CNC machining', 'TIG welding (ERTi-2 filler)', 'Hydrostatic testing']
CHEM_INSP = ['Hydrostatic pressure test', 'PMI verification', 'Dimensional per ASME B16.9', 'MTR (EN 10204 3.1)']

chem_pipe = [
    ('Titanium Blind Flange (ASME B16.5)', 'Class 150/300 blind flange for chemical piping', 'Pipe Fitting', ['Blind flange', 'ASME flange', 'Blank flange']),
    ('Titanium Weld Neck Flange', 'Raised face weld neck flange for high-pressure lines', 'Pipe Fitting', ['Weld neck', 'WN flange', 'RTJ flange']),
    ('Titanium Slip-On Flange', 'Slip-on flange for low-pressure chemical ducting', 'Pipe Fitting', ['Slip-on flange', 'SO flange', 'Lap joint flange']),
    ('Titanium Long Radius Elbow (ASME B16.9)', '90-degree seamless long radius elbow', 'Pipe Fitting', ['Elbow', '90 deg bend', 'Tube bend']),
    ('Titanium Equal Tee (ASME B16.9)', 'Seamless equal tee for pipe branching', 'Pipe Fitting', ['Pipe tee', 'Equal tee', 'Branch fitting']),
    ('Titanium Concentric Reducer', 'Seamless concentric pipe reducer', 'Pipe Fitting', ['Reducer', 'Concentric reducer', 'Pipe reducer']),
    ('Titanium Threaded NPT Nipple', 'NPT threaded pipe nipple', 'Pipe Fitting', ['Nipple', 'Threaded pipe', 'NPT fitting']),
    ('Titanium Stub End (Lap Joint)', 'Lap joint stub end for flanged connections', 'Pipe Fitting', ['Stub end', 'Lap joint stub', 'Flange adapter']),
    ('Titanium Ball Valve Stem', 'Ball valve stem (Grade 5) for chemical valve', 'Valve Component', ['Valve stem', 'Ball stem', 'Valve shaft']),
    ('Titanium Valve Strainer Basket', 'Perforated valve strainer basket', 'Valve Component', ['Strainer', 'Filter basket', 'Valve screen']),
    ('Titanium Pipe U-Bolt', 'Heavy-duty U-bolt for titanium pipe support', 'Pipe Support', ['U-bolt', 'Pipe clamp', 'Support bolt']),
]

chem_reactor = [
    ('Titanium Reactor Agitator Shaft', 'Autoclave agitator shaft (Grade 5)', 'Reactor Hardware', ['Agitator shaft', 'Mixer shaft', 'Impeller shaft']),
    ('Titanium Reactor Impeller Blade', 'Autoclave impeller mixing blade', 'Reactor Hardware', ['Impeller', 'Mixer blade', 'Agitator blade']),
    ('Titanium Reactor Lining Plate', 'Explosion-bonded PTA reactor lining plate (Gr 7 clad)', 'Reactor Hardware', ['Lining plate', 'Clad plate', 'Reactor liner']),
    ('Titanium Chlorine Compressor Impeller', 'Wet chlorine gas compressor impeller', 'Reactor Hardware', ['Compressor impeller', 'Cl2 impeller', 'Gas impeller']),
    ('Titanium Sulfuric Acid Injection Quill', 'Dosing injection quill for sulfuric acid (Grade 7)', 'Reactor Hardware', ['Injection quill', 'Acid quill', 'Dosing lance']),
    ('Titanium Catalyst Basket Mesh Liner', 'Woven mesh liner for catalyst basket', 'Reactor Hardware', ['Catalyst basket', 'Mesh liner', 'Catalyst screen']),
    ('Titanium Heat Exchanger Tube Bundle', 'Seamless tube bundle for shell & tube HX', 'Heat Exchanger', ['Heat exchanger tube', 'HX tube bundle', 'Condenser tube']),
    ('Titanium Heat Exchanger Tube Sheet', 'Tube sheet for shell & tube heat exchanger', 'Heat Exchanger', ['Tube sheet', 'Tube plate', 'HX baffle']),
]

chem_tank = [
    ('Titanium Immersion Heater Sheath', 'Electric immersion heater protective sheath tube', 'Tank Hardware', ['Heater sheath', 'Immersion heater', 'Heating element']),
    ('Titanium Steam Heating Coil', 'Steam heating coil U-bend assembly', 'Tank Hardware', ['Steam coil', 'Heating coil', 'Thermal coil']),
    ('Titanium Air Sparger Pipe', 'Perforated air agitation sparger pipe', 'Tank Hardware', ['Sparger', 'Air sparge', 'Gas sparger']),
    ('Titanium Eductor Nozzle', 'Venturi eductor nozzle for tank mixing', 'Tank Hardware', ['Eductor', 'Venturi nozzle', 'Jet mixer']),
    ('Titanium Thermowell', 'Temperature sensor protective thermowell', 'Tank Hardware', ['Thermowell', 'Sensor well', 'Temperature sleeve']),
    ('Titanium Liquid Level Float', 'Hollow ball float switch for chemical tank', 'Tank Hardware', ['Float switch', 'Level float', 'Buoyancy ball']),
    ('Titanium Tank Rim Mounting Bracket', 'Over-the-side tank rim mounting bracket', 'Tank Hardware', ['Mounting bracket', 'Tank hook', 'Rim mount']),
]

chem_energy = [
    ('Titanium PEM Bipolar Plate', 'PEM electrolyzer bipolar plate (Grade 1, Pt-coated)', 'Hydrogen Hardware', ['Bipolar plate', 'PEM plate', 'Electrolyzer plate']),
    ('Titanium PEM Gas Diffusion Layer', 'PEM electrolyzer liquid-gas diffusion layer (sintered)', 'Hydrogen Hardware', ['LGDL', 'Diffusion layer', 'Porous transport']),
    ('Titanium Hydrogen Storage Valve Stem', 'High-pressure hydrogen valve stem (Grade 23 ELI)', 'Hydrogen Hardware', ['H2 valve stem', 'Hydrogen valve', 'Storage valve']),
    ('Titanium Cryogenic H2 Flange Bolt', 'Liquid hydrogen cryogenic flange bolt (Grade 23)', 'Hydrogen Hardware', ['LH2 bolt', 'Cryogenic bolt', 'H2 flange bolt']),
    ('Titanium Fuel Cell End Plate', 'Hydrogen fuel cell stack end pressure plate', 'Hydrogen Hardware', ['Fuel cell plate', 'Stack end plate', 'Compression plate']),
    ('Titanium Hydrogen Flame Arrestor', 'Sintered titanium flame arrestor micro-porous disc', 'Hydrogen Hardware', ['Flame arrestor', 'Flashback arrestor', 'Porous disc']),
    ('Titanium UHP Hydrogen Tube Fitting', 'Ultra-high purity hydrogen tube compression fitting', 'Hydrogen Hardware', ['UHP fitting', 'H2 fitting', 'High purity connector']),
]

nuclear = [
    ('Titanium Main Condenser Tube', 'Nuclear main condenser seamless cooling tube', 'Nuclear Hardware', ['Condenser tube', 'Steam condenser', 'Cooling tube']),
    ('Titanium Fuel Pool Rack Spacer', 'Nuclear fuel storage rack spacer grid', 'Nuclear Hardware', ['Fuel rack spacer', 'Pool grid', 'Storage rack']),
    ('Titanium Steam Generator Nozzle', 'Steam generator feedwater venturi nozzle', 'Nuclear Hardware', ['SG nozzle', 'Feedwater nozzle', 'Steam nozzle']),
    ('Titanium ECCS Valve Stem', 'Emergency core cooling system valve stem', 'Nuclear Hardware', ['ECCS stem', 'Safety valve', 'Core cooling valve']),
    ('Titanium Spent Fuel Cask Bolt', 'Spent fuel transport cask high-strength bolt', 'Nuclear Hardware', ['Cask bolt', 'Fuel bolt', 'Transport bolt']),
    ('Titanium Control Rod Seal Housing', 'Control rod drive mechanism housing seal ring', 'Nuclear Hardware', ['CRDM seal', 'Rod housing', 'Control rod flange']),
]

# ════════════════════════════════════════════
# MARINE & OFFSHORE
# ════════════════════════════════════════════
MARINE_IND = 'Marine & Offshore'
MARINE_MAT = 'Grade 5 Ti-6Al-4V'
MARINE_PROC = ['Ring forging', 'CNC machining', 'TIG welding', 'Hydrostatic testing']
MARINE_INSP = ['Ultrasonic inspection', 'FPI', 'Hydrostatic pressure test', 'Magnetic permeability (mu<1.01)']

marine = [
    ('Titanium Propeller Shaft', 'Marine propulsion propeller shaft (CP-Ti Grade 2)', 'Propulsion', ['Prop shaft', 'Screw shaft', 'Tail shaft']),
    ('Titanium Waterjet Impeller', 'Waterjet propulsion inducer impeller', 'Propulsion', ['Waterjet impeller', 'Jet pump impeller', 'Inducer']),
    ('Titanium Propeller Hub Cap', 'Quiet-running submarine propeller hub cap', 'Propulsion', ['Hub cap', 'Propeller cap', 'Nose cone']),
    ('Titanium Submarine Steering Rudder Pin', 'Marine steering rudder actuator pivot pin', 'Propulsion', ['Rudder pin', 'Steering pin', 'Actuator pin']),
    ('Titanium Propeller Pitch Linkage', 'Controllable pitch propeller drive hub linkage', 'Propulsion', ['Pitch link', 'Hub linkage', 'Blade actuator link']),
    ('Titanium Submarine Engine Mount Stud', 'Noise-dampening submarine engine mounting stud', 'Propulsion', ['Mounting stud', 'Engine stud', 'Vibration mount']),
    ('Titanium Trim Tab Hydraulic Ram End', 'High-speed trim tab hydraulic cylinder ram end', 'Propulsion', ['Ram end', 'Hydraulic end', 'Trim tab shaft']),
]

subsea = [
    ('Titanium Submersible Pressure Hull', 'Manned submersible pressure shell segment (Grade 23)', 'Deep Sea', ['Pressure hull', 'Submersible sphere', 'Manned capsule']),
    ('Titanium ROV Manipulator Knuckle', 'ROV scientific payload manipulator arm knuckle', 'Deep Sea', ['Manipulator joint', 'Arm knuckle', 'Underwater joint']),
    ('Titanium ROV Tether Swivel Joint', 'ROV tether management system swivel joint', 'Deep Sea', ['Tether swivel', 'Cable joint', 'Umbilical swivel']),
    ('Titanium Underwater Camera Housing', 'Deep-sea camera/sensor pressure housing', 'Deep Sea', ['Camera housing', 'Sensor canister', 'Pressure vessel']),
    ('Titanium Subsea Battery Clamp Ring', 'Subsea battery pod sealing clamp ring', 'Deep Sea', ['Battery clamp', 'Seal ring', 'Pod clamp']),
    ('Titanium Deep-Sea Release Hook Pin', 'Deep-sea instrument release mechanism hook pin', 'Deep Sea', ['Release pin', 'Hook pin', 'Lander release']),
    ('Titanium AUV Propeller Shaft', 'Autonomous underwater vehicle propeller shaft', 'Deep Sea', ['AUV shaft', 'Underwater shaft', 'Propulsion shaft']),
    ('Titanium Subsea Manifold Swivel Flange', 'Subsea manifold piping swivel flange', 'Oil & Gas', ['Swivel flange', 'Manifold flange', 'Rotating flange']),
    ('Titanium Subsea Wellhead Valve Block', 'Subsea Christmas tree core block valve', 'Oil & Gas', ['Wellhead valve', 'Xmas tree', 'Gate valve block']),
    ('Titanium Downhole Production Tubing', 'Downhole production tubing liner joint (Grade 28)', 'Oil & Gas', ['Tubing joint', 'Production tube', 'Liner']),
    ('Titanium Downhole Wireline Barrel', 'Downhole wireline logging tool pressure barrel', 'Oil & Gas', ['Wireline barrel', 'Logging tool', 'Pressure housing']),
    ('Titanium Subsea Chemical Injection Mandrel', 'Subsea chemical injection mandrel orifice (Grade 7)', 'Oil & Gas', ['Injection mandrel', 'Chemical orifice', 'Injection point']),
    ('Titanium Offshore Firewater Nozzle', 'Offshore platform firewater deluge nozzle', 'Oil & Gas', ['Firewater nozzle', 'Deluge head', 'Spray nozzle']),
    ('Titanium Seawater Strainer Housing', 'Seawater strainer basket outer housing', 'Marine Piping', ['Strainer housing', 'Filter body', 'Sea chest strainer']),
    ('Titanium Pipeline Repair Sleeve', 'Subsea pipeline repair sleeve gripper segment', 'Oil & Gas', ['Repair sleeve', 'Pipe clamp', 'Gripper segment']),
]

# ════════════════════════════════════════════
# AUTOMOTIVE / MOTORSPORTS
# ════════════════════════════════════════════
AUTO_IND = 'Automotive & Motorsports'
AUTO_MAT = 'Grade 5 Ti-6Al-4V'
AUTO_PROC = ['Hot forging', 'CNC machining', 'Thread rolling', 'DLC coating']
AUTO_INSP = ['MPI crack test', 'Tensile testing', 'Dimensional CMM']

auto_parts = [
    ('Titanium Connecting Rod', 'High-RPM engine connecting rod', 'Engine Component', ['Con rod', 'Piston rod', 'H-beam rod']),
    ('Titanium Exhaust Muffler Tip', 'High-performance exhaust muffler outlet tip', 'Exhaust', ['Exhaust tip', 'Muffler outlet', 'Tailpipe tip']),
    ('Titanium Wheel Lug Nut', 'Performance wheel hub lightweight lug nut', 'Wheel Hardware', ['Lug nut', 'Wheel nut', 'Hub nut']),
    ('Titanium Turbocharger Compressor Wheel', 'Turbocharger compressor billet wheel', 'Engine Component', ['Turbo wheel', 'Compressor wheel', 'Turbine impeller']),
    ('Titanium Exhaust Manifold Collector', '3D-printed exhaust manifold collector (SLM)', 'Exhaust', ['Manifold collector', 'Exhaust merge', 'Header collector']),
    ('Titanium Roll Cage Gusset Plate', 'Multi-point roll cage reinforcement gusset (Grade 9)', 'Chassis', ['Gusset plate', 'Cage bracket', 'Reinforcement plate']),
    ('Titanium Active Wing Actuator Hub', 'Supercar active aerodynamic wing actuator hub', 'Chassis', ['Wing hub', 'Spoiler actuator', 'Aero linkage']),
    ('Titanium Mesh Grille Insert', 'Titanium mesh fire-retardant grille insert', 'Exterior', ['Grille mesh', 'Radiator grille', 'Mesh insert']),
    ('Titanium Brake Caliper Bleed Screw', 'Brake caliper anti-heat bleed port screw', 'Brake', ['Bleed screw', 'Calip bleed', 'Port screw']),
    ('Titanium Suspension Tie Rod', 'Race suspension double-ended adjustable tie rod', 'Suspension', ['Tie rod', 'Track rod', 'Steering link']),
    ('Titanium Anti-Roll Bar Droplink', 'Anti-roll bar adjustable droplink body', 'Suspension', ['Droplink', 'ARB link', 'Sway bar link']),
    ('Titanium Upper Wishbone Clevis', 'Front upper wishbone rear leg chassis clevis (Ti-6246)', 'Suspension', ['Wishbone clevis', 'A-arm bracket', 'Suspension clevis']),
    ('Titanium Hub Bolt (M12)', 'M12x1.25 high-tensile suspension pivot hub bolt (Ti-1023)', 'Suspension', ['Hub bolt', 'Wheel bearing bolt', 'Knuckle bolt']),
    ('Titanium Camber Adjustment Shim', 'Suspension geometry camber-adjusting shim stack', 'Suspension', ['Camber shim', 'Alignment shim', 'Adjustment plate']),
    ('Titanium Coilover Spring', 'High-performance racing coil suspension spring (Beta-C)', 'Suspension', ['Coil spring', 'Race spring', 'Suspension spring']),
]

# ════════════════════════════════════════════
# ELECTROPLATING / SURFACE FINISHING
# ════════════════════════════════════════════
ELEC_IND = 'Electroplating & Surface Finishing'
ELEC_MAT = 'Grade 2 CP-Ti'
ELEC_PROC = ['Expanded mesh forming', 'TIG welding (ERTi-2)', 'Sheet metal bending', 'CNC drilling']
ELEC_INSP = ['Weld color inspection', 'Dimensional check', 'Electrical continuity test']

electro = [
    ('Titanium Anode Basket (Expanded Mesh)', 'Expanded mesh anode basket for electroplating', 'Anode System', ['Anode basket', 'Mesh basket', 'Plating basket']),
    ('Titanium Anode Basket Hook', 'Solid rectangular knife hook busbar for anode', 'Anode System', ['Anode hook', 'Busbar hook', 'Knife hook']),
    ('Titanium Anode Basket Bottom Plate', 'Double-layer micro-perforated anode basket bottom', 'Anode System', ['Bottom plate', 'Perforated plate', 'Sludge retention']),
    ('Titanium Anode Basket Stiffener Rib', 'Reinforced side stiffener rib for anode basket', 'Anode System', ['Stiffener rib', 'Side rail', 'Reinforcement bar']),
    ('Titanium Copper-Cored Busbar', 'Copper-cored titanium conductor busbar', 'Anode System', ['Busbar', 'Conductor bar', 'Current bar']),
    ('Titanium Plating Rack Spline', 'Spring-loaded spline contact (V-prong) for PCB rack', 'Plating Rack', ['Spline', 'V-prong', 'Spring contact']),
    ('Titanium Plating Rack Thumb Screw', 'Modular thumb-screw clamp for plating rack', 'Plating Rack', ['Thumb screw', 'Quick clamp', 'PCB clamp']),
    ('Titanium Plating Rack Cross Bar', 'Cross-bar support bracket for plating rack frame', 'Plating Rack', ['Cross bar', 'Support bracket', 'Rack frame']),
    ('Titanium PCB Edge Grip', 'High-density board edge grip for PCB plating', 'Plating Rack', ['Edge grip', 'Board holder', 'PCB finger']),
    ('Titanium Plating Crane Lifting Eye', 'Heavy-duty crane lifting eye for plating line', 'Plating Rack', ['Lifting eye', 'Crane hook', 'Hoist ring']),
]

# ════════════════════════════════════════════
# WASTEWATER / ENVIRONMENTAL
# ════════════════════════════════════════════
ENV_IND = 'Environmental Engineering'
ENV_MAT = 'Grade 2 CP-Ti'
ENV_PROC = ['Powder sintering', 'CNC machining', 'Sheet fabrication', 'TIG welding']
ENV_INSP = ['Porosity test', 'Hydrostatic test', 'PMI verification']

env_parts = [
    ('Titanium Sintered Filter Element', 'Sintered titanium porous filter element', 'Filtration', ['Sintered filter', 'Porous tube', 'Metal filter']),
    ('Titanium Filter Press Tie Rod', 'Filter press high-tensile tie rod (Grade 5)', 'Filtration', ['Tie rod', 'Press rod', 'Hydraulic tie bar']),
    ('Titanium Dosing Pump Impeller', 'Chemical dosing pump impeller (Grade 5)', 'Pump', ['Pump impeller', 'Dosing impeller', 'Chemical impeller']),
    ('Titanium Pump Shaft Sleeve', 'Pump shaft protective wear sleeve (Grade 5)', 'Pump', ['Shaft sleeve', 'Wear sleeve', 'Pump sleeve']),
    ('Titanium MMO-Coated Substrate Plate', 'Mixed metal oxide coated substrate mesh/plate', 'Electrochemical', ['MMO substrate', 'Coated plate', 'Electrode substrate']),
    ('Titanium Sludge Scraper Blade', 'Clarifier sludge scraper blade', 'Wastewater', ['Scraper blade', 'Sludge scraper', 'Clarifier blade']),
    ('Titanium Mist Eliminator Frame', 'Mist eliminator demister grid frame', 'Wastewater', ['Demister frame', 'Mist pad holder', 'Grid frame']),
    ('Titanium Orifice Plate (Flow Meter)', 'Flow metering orifice plate', 'Instrumentation', ['Orifice plate', 'Flow meter plate', 'Restriction orifice']),
]

# ════════════════════════════════════════════
# CONSUMER remaining
# ════════════════════════════════════════════
CONS_IND = 'Consumer Electronics'
CONS_MAT = 'Grade 5 Ti-6Al-4V'
CONS_PROC = ['CNC milling', 'PVD coating (ISO 27874)', 'Diamond-cut beveling', 'AFP nano-coating']
CONS_INSP = ['Drop test (1.5m)', 'Spectrophotometer (Delta-E<=1)', 'Water contact angle (>110 deg)']

consumer_remaining = [
    ('Titanium Smartphone Volume Button', 'Smartphone side button taper pin (M2)', 'Phone Hardware', ['Volume button', 'Side button', 'Power button']),
    ('Titanium Smartphone SIM Tray', 'Smartphone SIM card / NVMe tray', 'Phone Hardware', ['SIM tray', 'Card tray', 'NVMe tray']),
    ('Titanium Laptop Hinge Shaft', 'Ultrabook display hinge pivot shaft', 'Laptop Hardware', ['Display hinge', 'Lid pivot', 'Screen hinge']),
    ('Titanium Laptop Hinge Bracket', 'Ultrabook display hinge mounting bracket', 'Laptop Hardware', ['Hinge bracket', 'Display mount', 'Screen bracket']),
    ('Titanium Camera Lens Filter Ring', 'Camera lens filter thread adapter ring', 'Camera Hardware', ['Filter ring', 'Lens adapter', 'Filter thread']),
    ('Titanium Camera Hot Shoe Mount', 'Camera accessory hot shoe mounting plate', 'Camera Hardware', ['Hot shoe', 'Accessory shoe', 'Flash mount']),
    ('Titanium Headphone Driver Enclosure', 'Premium headphone driver chamber housing', 'Audio Hardware', ['Headphone housing', 'Driver chamber', 'Earcup shell']),
    ('Titanium EDC Pen Body', 'Everyday carry bolt-action pen body', 'EDC', ['EDC pen', 'Tactical pen', 'Bolt pen']),
    ('Titanium EDC Utility Knife Handle', 'Everyday carry utility knife handle scales', 'EDC', ['Utility knife', 'EDC blade', 'Box cutter body']),
    ('Titanium Pocket Comb', 'Premium titanium pocket comb', 'EDC', ['Comb', 'Pocket comb', 'Grooming tool']),
    ('Titanium Wallet Card Case', 'Ultra-slim titanium wallet card holder', 'EDC', ['Wallet', 'Card case', 'Money clip']),
    ('Titanium Key Organizer Screw', 'Key organizer frame screw (M3)', 'EDC', ['Key screw', 'Organizer bolt', 'Key holder pin']),
    ('Titanium Flashlight Body', 'Premium EDC flashlight body tube', 'EDC', ['Flashlight body', 'Torch tube', 'Light housing']),
    ('Titanium Pen Clip', 'Deep-carry pen pocket clip', 'EDC', ['Pen clip', 'Pocket clip', 'Deep carry clip']),
]

# ════════════════════════════════════════════
# FASTENERS (cross-industry)
# ════════════════════════════════════════════
FAST_IND = 'General Industrial'
FAST_MAT = 'Grade 5 Ti-6Al-4V'
FAST_PROC = ['Cold heading', 'Thread rolling (DIN 13-1)', 'Heat treatment', 'Passivation']
FAST_INSP = ['6g Go/No-Go ring gauge', 'Tensile testing', 'MPI crack detection']

fasteners = [
    ('Titanium Hex Bolt (ISO 4014)', 'Heavy hex structural bolt M12-M30', 'Fastener', ['Hex bolt', 'Structural bolt', 'Heavy hex bolt']),
    ('Titanium Hex Nut (ISO 4032)', 'Heavy hex nut M12-M30 (Grade 2 CP-Ti)', 'Fastener', ['Hex nut', 'Structural nut', 'Heavy hex nut']),
    ('Titanium Flat Washer (ISO 7089)', 'Precision flat washer for bolted assemblies', 'Fastener', ['Flat washer', 'Plain washer', 'Load washer']),
    ('Titanium Spring Lock Washer (DIN 127)', 'Spring lock washer for vibration resistance', 'Fastener', ['Lock washer', 'Spring washer', 'Split washer']),
    ('Titanium Socket Head Cap Screw (ISO 4762)', 'Socket head cap screw M5-M24', 'Fastener', ['SHCS', 'Allen bolt', 'Socket screw']),
    ('Titanium Countersunk Screw (ISO 10642)', 'Countersunk flat head screw for flush mounting', 'Fastener', ['Flat head', 'CSK screw', 'Countersunk bolt']),
    ('Titanium Threaded Rod (1m)', 'Continuous threaded rod (1m length, Grade 2)', 'Fastener', ['Threaded rod', 'Studding', 'All-thread']),
    ('Titanium Stud Bolt (ASTM A193)', 'Double-ended threaded stud bolt', 'Fastener', ['Stud bolt', 'Double-end stud', 'Tap end stud']),
    ('Titanium Cotter Pin (DIN 94)', 'Split cotter pin for hinge/clevis retention', 'Fastener', ['Cotter pin', 'Split pin', 'Clevis pin']),
    ('Titanium Serrated Lock Washer', 'External tooth serrated lock washer (Beta-C)', 'Fastener', ['Serrated washer', 'Tooth lock washer', 'External lock']),
    ('Titanium U-Bolt', 'Heavy-duty U-bolt for pipe/conduit mounting', 'Fastener', ['U-bolt', 'Pipe U-bolt', 'Conduit clamp']),
    ('Titanium PEEK-Insulated Hybrid Bolt', 'PEEK-insulated titanium hybrid smart screw', 'Fastener', ['Hybrid bolt', 'Insulated screw', 'PEEK bolt']),
]

# ════════════════════════════════════════════
# ULTRASONIC
# ════════════════════════════════════════════
ULTRA_IND = 'Automotive & Motorsports'
ULTRA_MAT = 'Grade 5 Ti-6Al-4V (Triaxially Forged)'
ULTRA_PROC = ['Triaxial forging', 'CNC turning', 'Digital frequency tuning (+-50Hz)', 'Dynamic balancing']
ULTRA_INSP = ['DFA frequency analyzer', 'Impedance measurement', 'Nodal line CMM', 'Surface Ra<0.4um']

ultrasonic = [
    ('Titanium Ultrasonic Horn 20kHz', '20kHz cylindrical ultrasonic welding horn (sonotrode)', 'Ultrasonic Tooling', ['Sonotrode', 'Welding horn', '20kHz horn']),
    ('Titanium Ultrasonic Booster 35kHz', '35kHz high-gain step booster amplitude modifier', 'Ultrasonic Tooling', ['Booster', 'Amplitude modifier', '35kHz booster']),
    ('Titanium Ultrasonic Slot-Patterned Horn', 'Rectangular slot-patterned textile welding horn', 'Ultrasonic Tooling', ['Textile horn', 'Slot horn', 'Wide horn']),
    ('Titanium Ultrasonic Rotary Horn', 'Monobloc ultrasonic rotary horn core for continuous seal', 'Ultrasonic Tooling', ['Rotary horn', 'Seal horn', 'Rotary sonotrode']),
    ('Titanium Ultrasonic Connecting Stud', 'M12x1.25 horn-to-booster connecting stud', 'Ultrasonic Tooling', ['Stud connector', 'Horn stud', 'Booster stud']),
    ('Titanium Ultrasonic Nodal Clamp Ring', 'Stack clamping nodal ring flange (Grade 4)', 'Ultrasonic Tooling', ['Nodal ring', 'Clamp flange', 'Mounting ring']),
    ('Titanium Ultrasonic Knurled Insert', 'Plunge-welding knurled face replacement insert', 'Ultrasonic Tooling', ['Knurled tip', 'Weld insert', 'Face insert']),
    ('Titanium Ultrasonic Medical Sonotrode 40kHz', '40kHz miniature medical device sealing sonotrode', 'Ultrasonic Tooling', ['Medical horn', 'Surgical sonotrode', 'Seal horn']),
    ('Titanium Acoustic Waveguide Extension', 'Acoustic waveguide extension bar', 'Ultrasonic Tooling', ['Waveguide bar', 'Extension bar', 'Acoustic coupler']),
    ('Titanium Ultrasonic Food Cutting Blade', 'Ultrasonic food cutting guillotine blade', 'Ultrasonic Tooling', ['Cutting blade', 'Guillotine blade', 'Food cutter']),
]

# ════════════════════════════════════════════
# WRITE ALL ENTITIES
# ════════════════════════════════════════════

all_groups = [
    ('Aerospace & Defense', 'Aero Engine Compressor Blisks & Blades', AERO_MAT, AERO_PROC, AERO_INSP, aero_blisk),
    ('Aerospace & Defense', 'Low-Pressure Turbine Blades (Gamma-TiAl)', 'Gamma-TiAl', AERO_PROC, AERO_INSP, aero_missile[:1]),
    ('Aerospace & Defense', 'Landing Gear Structural Components', AERO_MAT, AERO_PROC, AERO_INSP, aero_landing),
    ('Aerospace & Defense', 'Missile & Rocket Motor Hardware', AERO_MAT, AERO_PROC, AERO_INSP, aero_missile),
    ('Aerospace & Defense', 'Hypersonic Vehicle Control Surfaces', 'Ti-65', AERO_PROC, AERO_INSP, [aero_missile[2]]),
    ('Aerospace & Defense', 'Aerospace Ducting & Pneumatic Systems', 'Grade 9 Ti-3Al-2.5V', AERO_PROC, AERO_INSP, aero_duct),
    ('Aerospace & Defense', 'Ballistic Armor & Protection', AERO_MAT, AERO_PROC, AERO_INSP, [aero_other[0]]),
    ('Aerospace & Defense', 'Cryogenic Propellant Tank Hardware', 'Ti-5Al-2.5Sn ELI', AERO_PROC, AERO_INSP, [aero_other[1]]),
    ('Aerospace & Defense', 'Housings / Chambers / Enclosures', AERO_MAT, AERO_PROC, AERO_INSP, [aero_other[3]]),
    ('Aerospace & Defense', 'Fasteners', AERO_MAT, AERO_PROC, AERO_INSP, []),
    ('Aerospace & Defense', 'Springs / Elastic Elements', 'Beta-C Ti', AERO_PROC, AERO_INSP, []),
    ('Aerospace & Defense', 'Brackets / Fittings / Connectors', AERO_MAT, AERO_PROC, AERO_INSP, [aero_other[2]]),
    ('Aerospace & Defense', 'Additive Manufacturing (AM) Builds', AERO_MAT, ['SLM 3D printing', 'HIP', 'Stress relief annealing'], AERO_INSP, []),
    ('Semiconductor', 'Semiconductor Vacuum Chamber Structural Hardware', 'Grade 5 Ti-6Al-4V', SEMI_PROC, SEMI_INSP, semi_chamber[:3]),
    ('Semiconductor', 'UHV Gas Delivery Fittings & Manifolds', 'Grade 2 CP-Ti (UHP Melt)', SEMI_PROC, SEMI_INSP, semi_uhv),
    ('Semiconductor', 'UHV Sealing Rings & Chamber Compression Hardware', 'Grade 5 Ti-6Al-4V', SEMI_PROC, SEMI_INSP, semi_chamber[3:]),
    ('Semiconductor', 'Plasma Chamber Liners, Shields & Thermal Hardware', 'Grade 2 CP-Ti (Bead Blasted)', SEMI_PROC, SEMI_INSP, semi_shield),
    ('Semiconductor', 'Precision Instrumentation & Optical Metrology Components', 'Grade 5 Ti-6Al-4V ELI', SEMI_PROC, SEMI_INSP, semi_parts[4:]),
    ('Semiconductor', 'Semiconductor Process Chamber Components', 'Grade 5 Ti-6Al-4V', SEMI_PROC, SEMI_INSP, [semi_parts[0], semi_parts[1], semi_parts[3]]),
    ('Semiconductor', 'MOCVD Wafer Susceptor & Support Hardware', 'Grade 5 Ti-6Al-4V', SEMI_PROC, SEMI_INSP, [semi_parts[2]]),
    ('Chemical Processing', 'Chemical Reactor Internals & Agitators', 'Grade 12 Ti-0.3Mo-0.8Ni', CHEM_PROC, CHEM_INSP, chem_reactor),
    ('Chemical Processing', 'Chemical Pipe Fittings & Flow Control Components', 'Grade 2 CP-Ti', CHEM_PROC, CHEM_INSP, chem_pipe),
    ('Chemical Processing', 'Industrial Standard Fasteners, Flanges & Hardware', 'Grade 2 CP-Ti', CHEM_PROC, CHEM_INSP, chem_pipe[:3] + fasteners[:4]),
    ('Electroplating & Surface Finishing', 'Electroplating Anode Baskets & Current Delivery Systems', 'Grade 2 CP-Ti', ELEC_PROC, ELEC_INSP, electro[:6]),
    ('Electroplating & Surface Finishing', 'Electroplating Racks, Jigs & PCB Fixtures', 'Grade 2 CP-Ti', ELEC_PROC, ELEC_INSP, electro[6:]),
    ('Electroplating & Surface Finishing', 'Tank Internals, Heating & Agitation Systems', 'Grade 2 CP-Ti', CHEM_PROC, CHEM_INSP, chem_tank),
    ('Environmental Engineering', 'Wastewater Treatment & Environmental Engineering Hardware', 'Grade 2 CP-Ti', ENV_PROC, ENV_INSP, env_parts),
    ('Energy', 'Valves / Fluid Control Components', 'Grade 5 Ti-6Al-4V', CHEM_PROC, CHEM_INSP, chem_pipe[9:11]),
    ('Energy', 'Cryogenic & LNG Components', 'Grade 1 CP-Ti', AERO_PROC, AERO_INSP, []),
    ('Energy', 'PEM Electrolyzer Bipolar Plates', 'Grade 1 CP-Ti (Pt-coated)', CHEM_PROC[:3], CHEM_INSP, [chem_energy[0], chem_energy[1]]),
    ('Energy', 'Nuclear Power & Hydrogen Energy Infrastructure', 'Grade 2 CP-Ti', CHEM_PROC[:3], CHEM_INSP, nuclear + chem_energy[2:]),
    ('Marine & Offshore', 'Marine Propellers & Shafting', 'Grade 5 Ti-6Al-4V', MARINE_PROC, MARINE_INSP, marine[:3]),
    ('Marine & Offshore', 'Submarine & Naval Propulsion Components', 'Grade 5 Ti-6Al-4V', MARINE_PROC, MARINE_INSP, marine[3:]),
    ('Marine & Offshore', 'Deepwater Drilling Risers & Components', 'Grade 5 Ti-6Al-4V ELI', MARINE_PROC, MARINE_INSP, subsea[7:]),
    ('Marine & Offshore', 'Deep-Sea Exploration & ROV/AUV Hardware', 'Grade 5 Ti-6Al-4V ELI', MARINE_PROC, MARINE_INSP, subsea[:7]),
    ('Automotive & Motorsports', 'Racing Suspension Rods, Linkages & Hardware', 'Grade 5 Ti-6Al-4V', AUTO_PROC, AUTO_INSP, auto_parts[9:]),
    ('Automotive & Motorsports', 'Engine Valve Train Components (Spring Retainers & Keepers)', 'Grade 5 Ti-6Al-4V', AUTO_PROC, AUTO_INSP, auto_parts[:1]),
    ('Automotive & Motorsports', 'Collaborative Robot (Cobot) Actuator Housings', 'Grade 5 Ti-6Al-4V', AUTO_PROC, AUTO_INSP, []),
    ('Automotive & Motorsports', 'Ultrasonic Welding Components', ULTRA_MAT, ULTRA_PROC, ULTRA_INSP, ultrasonic),
    ('Consumer Electronics', 'Consumer Electronics', CONS_MAT, CONS_PROC, CONS_INSP, consumer_remaining),
    ('General Industrial', 'Heat Treatment Fixtures & Racks', 'Grade 2 CP-Ti', CHEM_PROC, CHEM_INSP, []),
]

count = 0
for ind, sys_name, mat, proc, insp, items in all_groups:
    if not items:
        continue
    for item in items:
        title, func, cat, aliases = item[0], item[1], item[2], item[3:]
        aliases = aliases if isinstance(aliases, list) else list(aliases)
        write_entity(title, func, cat, aliases, ind, sys_name, mat, proc, insp)
        count += 1

# Also write fasteners and remaining consumer
for item in fasteners:
    title, func, cat, aliases = item[0], item[1], item[2], item[3] if len(item)>3 else []
    aliases = aliases if isinstance(aliases, list) else []
    write_entity(title, func, cat, aliases, FAST_IND, 'Industrial Standard Fasteners, Flanges & Hardware', FAST_MAT, FAST_PROC, FAST_INSP)
    count += 1

print(f'Total new entities: {count}')

# Count total
total = len(glob.glob(os.path.join(OUT_DIR, '*.json')))
print(f'Grand total entities: {total}')
