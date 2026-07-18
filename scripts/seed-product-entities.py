"""
Phase 2: Seed Product Entities for 3 pilot industries.
Output: src/content/product-entities/*.json
"""
import json, os, re

OUT_DIR = 'src/content/product-entities'
os.makedirs(OUT_DIR, exist_ok=True)

# Read TSX to extract existing alloyReason, process, pitfalls etc per system
tsx = open('src/components/react/ReverseEngineerTool.tsx', 'r', encoding='utf-8').read()

# Extract all PART_DB entries for reference
entries_raw = re.search(r'const PART_DB:\s*PartProfile\[\]\s*=\s*\[(.+?)\];', tsx, re.DOTALL)
systems_data = {}
if entries_raw:
    block = entries_raw.group(1)
    depth = 0
    chunk = ''
    for ch in block:
        if ch == '{': depth += 1; chunk += ch
        elif ch == '}':
            depth -= 1; chunk += ch
            if depth == 0:
                # Parse this entry
                def gf(name):
                    m = re.search(rf"^\s*{name}:\s*'([^']+)'", chunk, re.MULTILINE)
                    return m.group(1) if m else ''
                def ga(name):
                    m = re.search(rf"^\s*{name}:\s*\[([^\]]+)\]", chunk, re.MULTILINE)
                    return re.findall(r"'([^']+)'", m.group(1)) if m else []
                title = gf('category')
                if title:
                    systems_data[title] = {
                        'industry': ga('industries')[0] if ga('industries') else '',
                        'material': gf('alloyId'),
                        'alloyReason': gf('alloyReason'),
                        'process': ga('process'),
                        'tollServices': ga('tollServices'),
                        'pitfalls': ga('pitfalls'),
                        'specNote': gf('specNote'),
                        'formReason': gf('formReason'),
                    }
                chunk = ''
        elif depth > 0:
            chunk += ch

# ── Product Entity definitions ──
# Each entry: title, category, industry, system, material, process, etc.

PRODUCTS = []

# ════════════════════════════════════════════
# BICYCLE
# ════════════════════════════════════════════

BICYCLE_SYSTEM = 'Bicycle Braking System Components'
BICYCLE_MAT = 'Grade 5 Ti-6Al-4V'
BICYCLE_PROC = ['Hot forging', 'CNC turning', 'Thread rolling (DIN 13-1 / ISO 965-2, 6g)']
BICYCLE_INSP = ['MPI crack detection', '6g Go/No-Go ring gauge', 'Salt spray ASTM B117', 'Torque-to-tension verification']

bicycle_braking = [
    ('Titanium Disc Brake Rotor Bolt', 'Disc brake rotor mounting bolt, M6x12mm T25 Torx', 'Brake Rotor Hardware', ['Brake rotor bolt', 'Rotor screw', 'Disc brake bolt']),
    ('Titanium Brake Caliper Mounting Bolt', 'Frame post-mount brake caliper bolt, M6x16mm', 'Brake Caliper Hardware', ['Caliper bolt', 'Post-mount bolt', 'Frame mounting bolt']),
    ('Titanium Brake Pad Retaining Pin', 'Brake pad retention spring pin for disc caliper', 'Brake Pad Hardware', ['Pad pin', 'Brake pad clip', 'Retaining pin']),
    ('Titanium Brake Caliper Piston Insert', 'Thermal barrier piston core insert for disc caliper', 'Brake Caliper Hardware', ['Piston insert', 'Caliper piston', 'Thermal barrier']),
    ('Titanium Hydraulic Brake Banjo Bolt', 'Hollow-core banjo bolt for hydraulic brake hose', 'Brake Hydraulic Hardware', ['Banjo bolt', 'Hose fitting', 'Brake line bolt']),
    ('Titanium Brake Lever Pivot Pin', 'Brake lever pivot pin for shift/brake lever assembly', 'Brake Control Hardware', ['Lever pin', 'Pivot pin', 'Brake lever axle']),
    ('Titanium Brake Bleed Port Screw', 'Calip bleed port taper-seal screw', 'Brake Caliper Hardware', ['Bleed screw', 'Bleed port', 'Calip bleed valve']),
    ('Titanium Flat-Mount Brake Adapter', '3D-printed flat-mount disc brake adapter bracket', 'Brake Adapter Hardware', ['Brake adapter', 'Flat-mount adapter', 'Disc brake adapter']),
    ('Titanium Brake Rotor (Disc)', 'Lightweight ventilated disc brake rotor', 'Brake Rotor Hardware', ['Disc rotor', 'Brake disc', 'Rotor']),
]

bicycle_cockpit = [
    ('Titanium Stem Faceplate Bolt', 'M5x16mm Torx T25 tapered head stem clamping bolt', 'Stem Hardware', ['Faceplate bolt', 'Stem bolt', 'Handlebar clamp bolt']),
    ('Titanium Stem Steerer Clamp Bolt', 'Stem steerer tube clamping bolt, M6x20mm', 'Stem Hardware', ['Steerer bolt', 'Stem clamp', 'Fork clamp bolt']),
    ('Titanium Headset Top Cap Screw', 'M6x35mm hex tapered head top cap preload bolt', 'Headset Hardware', ['Top cap bolt', 'Headset preload', 'Star nut bolt']),
    ('Titanium Headset Compression Plug', 'Internal steerer tube compression plug expansion wedge', 'Headset Hardware', ['Compression plug', 'Steerer plug', 'Expansion wedge']),
    ('Titanium Headset Crown Race', '1-1/8" split crown race for fork interface', 'Headset Hardware', ['Crown race', 'Fork race', 'Headset race']),
    ('Titanium Headset Spacer', 'Micro-adjusting headset spacer 1/3/5mm', 'Headset Hardware', ['Headset spacer', 'Steerer spacer', 'Fork spacer']),
    ('Titanium Handlebar End Plug', 'Handlebar end plug core screw', 'Handlebar Hardware', ['Bar end plug', 'Handlebar plug', 'End cap']),
    ('Titanium Handlebar Grip Lock Ring', 'Lock-on handlebar grip clamping ring with M4 screw', 'Handlebar Hardware', ['Grip lock ring', 'Grip clamp', 'Lock-on ring']),
    ('Titanium GPS Mount Bolt', 'Computer/GPS mount dual-fixing M5 extension bolt', 'Cockpit Accessory Hardware', ['GPS mount bolt', 'Computer mount', 'Accessory bolt']),
    ('Titanium Shift Lever Clamp Band', 'Shift lever handlebar clamp band', 'Shift Hardware', ['Clamp band', 'Shifter clamp', 'Lever mount band']),
    ('Titanium Derailleur Pivot Pin', 'Rear derailleur parallelogram linkage pivot pin', 'Derailleur Hardware', ['Derailleur pin', 'Pivot pin', 'Linkage pin']),
]

bicycle_suspension = [
    ('Titanium Rear Shock Coil Spring', 'Progressive rear shock coil spring (Beta-C alloy)', 'Suspension Hardware', ['Shock spring', 'Coil spring', 'Rear spring']),
    ('Titanium Main Pivot Axle', 'Full-suspension main pivot hollow axle 15mm OD', 'Suspension Hardware', ['Pivot axle', 'Main pivot', 'Frame pivot']),
    ('Titanium Rear Shock Mounting Bolt', 'M8x35mm countersunk flat head rear shock mount bolt', 'Suspension Hardware', ['Shock bolt', 'Mounting bolt', 'Eyelet bolt']),
    ('Titanium Linkage Pivot Bolt', 'Suspension linkage pivot bolt set', 'Suspension Hardware', ['Linkage bolt', 'Pivot screw', 'Frame bolt']),
    ('Titanium Pivot Bearing Spacer Sleeve', 'Suspension pivot bearing crush spacer sleeve', 'Suspension Hardware', ['Bearing spacer', 'Pivot sleeve', 'Crush tube']),
    ('Titanium Derailleur Hanger', 'Rear derailleur hanger dropout interface', 'Frame Hardware', ['RD hanger', 'Dropout', 'Mech hanger']),
    ('Titanium Bell Crank Rocker Arm', 'Linear suspension linkage bell crank rocker arm', 'Suspension Hardware', ['Rocker arm', 'Bell crank', 'Linkage arm']),
    ('Titanium Pivot Bearing Retainer Circlip', 'Suspension pivot bearing retaining internal circlip', 'Suspension Hardware', ['Circlip', 'Retaining ring', 'Snap ring']),
    ('Titanium Fork Air Chamber Top Cap', 'Suspension fork air chamber top cap', 'Fork Hardware', ['Air cap', 'Fork cap', 'Air spring cap']),
    ('Titanium Bottom Bracket Shell', 'Threaded bottom bracket shell sleeve for frame', 'Frame Hardware', ['BB shell', 'Bottom bracket', 'Threaded insert']),
    ('Titanium Frame Flip Chip', 'Integrated frame geometry adjustment flip-chip', 'Frame Hardware', ['Flip chip', 'Geometry chip', 'Adjustment plate']),
]

bicycle_drivetrain = [
    ('Titanium Cassette Cog', 'Lightweight cassette sprocket cog', 'Drivetrain Hardware', ['Cassette sprocket', 'Rear cog', 'Gear']),
    ('Titanium Chainring', 'Dished chainring for 1x/2x drivetrain', 'Drivetrain Hardware', ['Chainring', 'Crankset ring', 'Front sprocket']),
    ('Titanium Chainring Bolt', 'Chainring fixing bolt set (M6)', 'Drivetrain Hardware', ['Chainring bolt', 'Crank bolt', 'Bolt set']),
    ('Titanium Bottom Bracket Spindle', 'Hollow bottom bracket axle spindle', 'Drivetrain Hardware', ['BB spindle', 'Crank axle', 'Bottom bracket axle']),
    ('Titanium Derailleur Pulley', 'Rear derailleur guide pulley with bearing', 'Derailleur Hardware', ['Pulley wheel', 'Guide pulley', 'Jockey wheel']),
    ('Titanium Derailleur Limit Screw', 'Front/rear derailleur H/L limit adjustment screw', 'Derailleur Hardware', ['Limit screw', 'Adjustment screw', 'Set screw']),
]

bicycle_wheels = [
    ('Titanium Thru-Axle', 'Quick-release thru-axle shaft for wheel retention', 'Wheel Hardware', ['Thru axle', 'Quick release', 'Wheel axle']),
    ('Titanium Wheel Spoke', 'Aerodynamic bladed wheel spoke', 'Wheel Hardware', ['Spoke', 'Wheel spoke', 'Bladed spoke']),
    ('Titanium Spoke Nipple', 'Hexagonal spoke nipple for rim interface', 'Wheel Hardware', ['Nipple', 'Spoke nut', 'Rim nipple']),
    ('Titanium Wheel Hub Pawl Spring', 'Hub ratchet pawl leaf spring (Nitinol)', 'Wheel Hardware', ['Pawl spring', 'Ratchet spring', 'Hub spring']),
    ('Titanium Hub Freehub Body Spline', 'Freehub body anti-bite spline strip', 'Wheel Hardware', ['Freehub spline', 'Driver body', 'Anti-bite ring']),
    ('Titanium Pedal Spindle', 'Clipless pedal replacement spindle axle', 'Pedal Hardware', ['Pedal axle', 'Pedal shaft', 'Spindle']),
    ('Titanium Pedal Cleat Screw', 'Shoe cleat fixing screw set', 'Pedal Hardware', ['Cleat screw', 'Shoe cleat bolt', 'Pedal cleat nut']),
    ('Titanium Pedal Traction Pin', 'Flat pedal replaceable anti-slip traction pin', 'Pedal Hardware', ['Traction pin', 'Pedal pin', 'Grip pin']),
    ('Titanium Saddle Rail Clamp Bolt', 'Saddle rail clamping cradle bolt (seatpost)', 'Seat Hardware', ['Saddle bolt', 'Rail clamp', 'Seatpost clamp']),
    ('Titanium Seatpost Collar Bolt', 'Seatpost collar quick-release binder bolt', 'Seat Hardware', ['Seatpost clamp', 'Collar bolt', 'Binder bolt']),
    ('Titanium Saddle Clamp Washer', 'Saddle cradle half-round tilt adjustment washer', 'Seat Hardware', ['Clamp washer', 'Tilt washer', 'Saddle washer']),
    ('Titanium Water Bottle Cage', 'Tubular titanium water bottle cage', 'Accessories', ['Bottle cage', 'Cage', 'Water bottle holder']),
    ('Titanium Water Bottle Cage Bolt', 'M5x12mm bottle cage mounting frame screw', 'Accessories', ['Cage bolt', 'Bottle screw', 'Frame mount']),
    ('Titanium Fender Mounting Bolt', 'Fender/rack eyelet mounting bolt', 'Accessories', ['Fender bolt', 'Rack bolt', 'Eyelet mount']),
]

# ════════════════════════════════════════════
# CONSUMER ELECTRONICS
# ════════════════════════════════════════════

CONSUMER_SYSTEM = 'Premium Consumer Electronics & Wearables'
CONSUMER_MAT = 'Grade 5 Ti-6Al-4V'
CONSUMER_PROC = ['CNC milling', 'Diamond-cut beveling', 'PVD coating (ISO 27874, Delta-E <=1.0)', 'Oleophobic AFP nano-coating']
CONSUMER_INSP = ['Water contact angle (>110 deg)', 'Spectrophotometer color audit', 'Drop impact test (1.5m)', 'Steel wool abrasion (5000 cycles)']

consumer_electronics = [
    ('Titanium Smartwatch Bezel', 'Premium smart watch outer chassis bezel ring', 'Wearable Hardware', ['Watch bezel', 'Smartwatch ring', 'Watch case rim']),
    ('Titanium Smartphone Mid-Frame', 'Smartphone internal structural mid-frame chassis', 'Phone Hardware', ['Phone frame', 'Mid-plate', 'Chassis frame']),
    ('Titanium Foldable Phone Hinge', 'Foldable device micro-mechanical screen hinge (Beta-Ti)', 'Phone Hardware', ['Fold hinge', 'Screen hinge', 'Folding mechanism']),
    ('Titanium TWS Earbud Grille', 'Premium TWS earbud sound nozzle micro-grille', 'Audio Hardware', ['Earbud mesh', 'Speaker grille', 'Nozzle mesh']),
    ('Titanium Action Camera Lens Bezel', 'Action camera external protective lens bezel ring', 'Camera Hardware', ['Lens ring', 'Camera bezel', 'Lens protector']),
    ('Titanium Mechanical Keyboard Keycap', 'Custom artisan keycap base (anodized)', 'Input Device Hardware', ['Keycap', 'Keyboard cap', 'Artisan keycap']),
    ('Titanium SSD Armor Enclosure', 'Solid state drive lightweight armor enclosure case', 'Storage Hardware', ['SSD case', 'Drive enclosure', 'External SSD shell']),
    ('Titanium SIM Tray Eject Pin', 'Micro-SIM/NVMe tray ejector pin M1.0', 'Phone Hardware', ['SIM pin', 'Eject pin', 'Tray tool']),
    ('Titanium Stylus Pen Core Rod', 'Stylus pen inner structural reinforcement tube', 'Input Device Hardware', ['Stylus tube', 'Pen rod', 'Digital pen core']),
    ('Titanium Smart Glasses Temple Arm', 'Smart glasses hinged temple core arm (Beta-Ti)', 'Wearable Hardware', ['Glasses arm', 'Temple tip', 'Eyewear hinge']),
    ('Titanium 3D-Printed Ergonomic Mouse', 'Custom 3D-printed ergonomic mouse top shell (SLM)', 'Input Device Hardware', ['Mouse shell', 'Gaming mouse', 'Ergonomic mouse body']),
    ('Titanium Dive Watch Case', 'Professional dive watch case body >40mm', 'Wearable Hardware', ['Watch case', 'Diver watch', 'Watch body']),
    ('Titanium Dive Watch Crown', 'Threaded screw-down crown for dive watch', 'Wearable Hardware', ['Watch crown', 'Screw-down crown', 'Winding crown']),
]

# ════════════════════════════════════════════
# MEDICAL
# ════════════════════════════════════════════

MED_MAT = 'Ti-6Al-4V ELI (ASTM F136 / ISO 5832-3)'
MED_PROC = ['VAR melting', 'Closed-die hot forging', 'CNC swiss turning', 'Thread rolling', 'Passivation (ASTM F86)']
MED_INSP = ['100% CMM dimensional', 'Mechanical testing per ASTM F543', 'MRI artifact (3T phantom)', 'Class 10,000 cleanroom packaging']

medical = [
    ('Titanium Hip Stem', 'Total hip replacement femoral stem', 'Orthopedic Joints', ['Femoral stem', 'Hip implant', 'Hip replacement stem'], 'tc4eli'),
    ('Titanium Acetabular Cup', 'Porous biomimetic acetabular cup (EBM 3D-printed)', 'Orthopedic Joints', ['Hip cup', 'Acetabular shell', 'Bone ingrowth cup'], 'tc4eli'),
    ('Titanium Bone Screw', 'Cortical/cancellous locking compression bone screw', 'Trauma Fixation', ['Bone screw', 'Cortical screw', 'Cancellous screw', 'Locking screw'], 'tc4eli'),
    ('Titanium Femoral Condyle', 'Total knee femoral condyle component (Ti-6Al-7Nb)', 'Orthopedic Joints', ['Knee implant', 'Femoral component', 'Knee condyle'], 'ti67nb'),
    ('Titanium Intramedullary Nail', 'Tibial/femoral intramedullary nail with locking holes', 'Trauma Fixation', ['IM nail', 'Intramedullary rod', 'Bone nail'], 'tc4eli'),
    ('Titanium Bone Plate', 'Modular locking compression bone plate', 'Trauma Fixation', ['Bone plate', 'Compression plate', 'Fixation plate'], 'tc4eli'),
    ('Titanium Spinal Pedicle Screw', 'Polyaxial pedicle screw for spinal fixation', 'Spine Fixation', ['Pedicle screw', 'Spine screw', 'Vertebral screw'], 'tc4eli'),
    ('Titanium Spinal Interbody Cage', 'Lumbar interbody fusion cage with porous lattice', 'Spine Fixation', ['Spinal cage', 'Fusion cage', 'Interbody spacer'], 'tc4eli'),
    ('Titanium Spinal Fixation Rod', 'Spinal fixation connection rod (Grade 9 / Beta-Ti)', 'Spine Fixation', ['Spinal rod', 'Fixation rod', 'Connector rod'], 'ta18'),
    ('Titanium Craniofacial Mesh', 'Reconstruction mesh for craniofacial repair (CP-Ti)', 'Craniofacial', ['Bone mesh', 'Facial implant', 'Skull mesh'], 'cp2'),
    ('Titanium Dental Implant Fixture', 'Endosseous dental implant fixture screw (Grade 4)', 'Dental', ['Dental screw', 'Implant fixture', 'Tooth implant'], 'cp4'),
    ('Titanium Dental Abutment', 'Modular dental abutment retaining screw', 'Dental', ['Abutment screw', 'Dental abutment', 'Implant abutment'], 'tc4eli'),
    ('Titanium Dental Abutment (Angled)', 'Custom multi-unit angled dental abutment', 'Dental', ['Angled abutment', 'Custom abutment', 'Multi-unit abutment'], 'tc4eli'),
    ('Titanium Orthodontic Archwire', 'Self-adjusting orthodontic archwire (Nitinol)', 'Dental', ['Braces wire', 'Archwire', 'Ortho wire'], 'nitinol'),
    ('Titanium Cardiovascular Stent', 'Self-expanding cardiovascular stent (Nitinol)', 'Cardiovascular', ['Stent', 'Vascular stent', 'Artery stent'], 'nitinol'),
    ('Titanium TAVI Frame', 'Transcatheter aortic valve replacement frame (Nitinol)', 'Cardiovascular', ['TAVI stent', 'Heart valve frame', 'Aortic valve stent'], 'nitinol'),
    ('Titanium Neuro Guidewire', 'Neurovascular micro-guidewire core (Nitinol)', 'Interventional', ['Guidewire', 'Brain wire', 'Micro-guidewire'], 'nitinol'),
    ('Titanium Embolization Coil Mandrel', 'Embolization coil delivery mandrel (Nitinol)', 'Interventional', ['Coil pusher', 'Embolization wire', 'Detachment wire'], 'nitinol'),
    ('Titanium Pacemaker Enclosure', 'Permanent pacemaker outer hermetic enclosure', 'Implantable Device', ['Pacemaker case', 'IPG housing', 'Implant shell'], 'cp2'),
    ('Titanium Surgical Forceps', 'Microsurgical forceps handle (ophthalmic)', 'Surgical Instruments', ['Forceps', 'Micro forceps', 'Tissue forceps'], 'tc4'),
    ('Titanium Surgical Scissors Pivot Pin', 'Microsurgical scissors central pivot pin', 'Surgical Instruments', ['Scissors pin', 'Pivot screw', 'Instrument axle'], 'tc4'),
    ('Titanium Endoscope Sheath', 'Rigid endoscope outer protective sheath', 'Surgical Instruments', ['Endoscope tube', 'Laparoscope sheath', 'Optical tube'], 'ta18'),
    ('Titanium Surgical Retractor Blade', 'Lightweight surgical retractor blade', 'Surgical Instruments', ['Retractor', 'Wound retractor', 'Tissue retractor'], 'ta18'),
    ('Titanium Laparoscopic Stapler Anvil', 'Laparoscopic stapler anvil plate', 'Surgical Instruments', ['Stapler anvil', 'Surgical anvil', 'Endoscopic anvil'], 'tc4'),
]

# ════════════════════════════════════════════
# Write all Product Entities
# ════════════════════════════════════════════

# Build lookup: system title → slug
sys_slug_lookup = {}
tsx_systems = re.findall(r"category:\s*'([^']+)'", tsx)
for s in tsx_systems:
    slug = s.lower().replace(' & ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').replace('  ', ' ').replace(' ', '-').strip('-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    sys_slug_lookup[s] = slug

def write_entity(title, func, category, aliases, industry, system_name, material_id, process, inspection, mat_override=''):
    """Generate and write a product entity JSON file."""
    slug = title.lower().replace(' ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').strip('-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    
    # Look up system info from TSX data
    sys_info = systems_data.get(system_name, {})
    sys_slug = sys_slug_lookup.get(system_name, '')
    
    # Determine material name
    mat_name = mat_override
    if not mat_name:
        ref = {'tc4': 'Grade 5 Ti-6Al-4V', 'tc4eli': 'Ti-6Al-4V ELI (ASTM F136)', 'cp2': 'Grade 2 CP-Ti',
               'cp4': 'Grade 4 CP-Ti', 'ta18': 'Grade 9 Ti-3Al-2.5V', 'nitinol': 'Nitinol (ASTM F2063)',
               'ti67nb': 'Ti-6Al-7Nb (ASTM F1295)', 'cp1': 'Grade 1 CP-Ti', 'cp3': 'Grade 3 CP-Ti',
               'betac': 'Beta-C Ti (Ti-15V-3Cr-3Sn-3Al)', 'ta9': 'Grade 7 Ti-0.15Pd',
               'ta10': 'Grade 12 Ti-0.3Mo-0.8Ni', 'gammatial': 'Gamma-TiAl', 'ti1023': 'Ti-1023 (Beta)',
               'ti6246': 'Ti-6246', 'ti65': 'Ti-65', 'ti52sn': 'Ti-5Al-2.5Sn ELI', 'ti6242': 'Ti-6242',
               'ti153': 'Ti-15-3-3-3 (Beta)'}
        mat_name = ref.get(material_id, material_id)
    
    proc = process or sys_info.get('process', [])
    insp = inspection or sys_info.get('tollServices', [])
    failures = [p for p in sys_info.get('pitfalls', [])][:3]
    
    entity = {
        'title': title,
        'aliases': aliases,
        'industry': industry,
        'system': system_name,
        'category': category,
        'function': func,
        'material': mat_name,
        'alloyReason': (sys_info.get('alloyReason', '')[:300] or f'Optimal material choice for {title} due to superior strength-to-weight ratio and corrosion resistance.'),
        'process': proc[:6],
        'surfaceTreatment': ['Passivation ASTM F86'],
        'inspection': insp[:4],
        'commonFailures': failures,
        'designConsiderations': [],
        'standards': ['ASTM B348'],
        'typicalRfqRequirements': [],
        'faq': [],
        'relatedProducts': [],
        'relatedCapabilities': [p.lower().replace(' / ', '-').replace('/', '-').replace(' ', '-').replace('--', '-').strip('-') for p in proc[:3]],
        'relatedMaterials': [],
        'relatedIndustries': [industry.lower().replace(' & ', '-').replace('/', '-').replace(' ', '-')],
        'seoTitle': f'{title} - {mat_name} - Precision CNC Titanium Component',
        'seoDescription': f'{title} - {func} Manufactured from {mat_name}. Precision CNC machined with {", ".join(proc[:3])}. AS9100D & ISO 9001 certified.',
        'order': 0,
        'pubDate': '2026-07-18',
    }
    
    fpath = os.path.join(OUT_DIR, f'{slug}.json')
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(entity, f, indent=2, ensure_ascii=False)

# Write all
count = 0

# Bicycle
for title, func, cat, aliases in bicycle_braking:
    write_entity(title, func, cat, aliases, 'Cycling / Bicycle', BICYCLE_SYSTEM, 'tc4', BICYCLE_PROC, BICYCLE_INSP)
    count += 1
for title, func, cat, aliases in bicycle_cockpit:
    write_entity(title, func, cat, aliases, 'Cycling / Bicycle', 'Bicycle Cockpit, Steering & Control Hardware', 'tc4', BICYCLE_PROC, BICYCLE_INSP)
    count += 1
for title, func, cat, aliases in bicycle_suspension:
    write_entity(title, func, cat, aliases, 'Cycling / Bicycle', BICYCLE_SYSTEM.replace('Bicycle Braking', 'Bicycle Suspension, Frame Hardware & Linkage'), 'tc4', BICYCLE_PROC, BICYCLE_INSP)
    count += 1
for title, func, cat, aliases in bicycle_drivetrain:
    write_entity(title, func, cat, aliases, 'Cycling / Bicycle', 'Bicycle Drivetrain & Drivetrain Hardware', 'tc4', 
                 ['CNC machining of tooth profile', 'Thread rolling', 'Swiss-type turning'],
                 ['CMM tooth profile inspection', 'Hardness testing'])
    count += 1
for title, func, cat, aliases in bicycle_wheels:
    write_entity(title, func, cat, aliases, 'Cycling / Bicycle', 'Bicycle Wheels, Saddle, Pedals & Accessories', 'tc4',
                 ['Wire drawing', 'CNC swaging', 'CNC turning', 'Thread rolling'],
                 ['Tensile testing', 'Salt spray ASTM B117'])
    count += 1

# Consumer Electronics
for title, func, cat, aliases in consumer_electronics:
    write_entity(title, func, cat, aliases, 'Consumer Electronics', CONSUMER_SYSTEM, 'tc4', CONSUMER_PROC, CONSUMER_INSP)
    count += 1

# Medical
for title, func, cat, aliases, mat_id in medical:
    ind = 'Medical Device'
    sys = 'Medical Implants'
    proc = MED_PROC
    insp = MED_INSP
    if cat in ['Dental']:
        sys = 'Dental Implants & Prosthetics'
    elif cat in ['Cardiovascular', 'Interventional']:
        sys = 'Cardiovascular Stent & TAVI Frames'
        proc = ['Laser micro-cutting', 'Shape-setting heat treatment', 'Electropolishing']
        insp = ['AF temperature measurement (DSC)', 'Fatigue testing (400M cycles)']
    elif cat in ['Surgical Instruments']:
        sys = 'Surgical Instruments'
    elif cat in ['Spine Fixation']:
        sys = 'Trauma & Spine Fixation Hardware'
    elif cat in ['Implantable Device']:
        sys = 'Medical Implants'
    
    write_entity(title, func, cat, aliases, ind, sys, mat_id, proc, insp)
    count += 1

# Fix suspension system slug
# Re-write suspension entries with correct system
bicycle_suspension_sys = 'Bicycle Suspension, Frame Hardware & Linkage'
for title, func, cat, aliases in bicycle_suspension:
    slug = title.lower().replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').strip('-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    fpath = os.path.join(OUT_DIR, f'{slug}.json')
    if os.path.exists(fpath):
        d = json.load(open(fpath, 'r', encoding='utf-8'))
        d['system'] = bicycle_suspension_sys
        json.dump(d, open(fpath, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)

print(f'Total Product Entities generated: {count}')
print(f'Location: {OUT_DIR}/')
