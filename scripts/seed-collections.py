"""
Extract data from ReverseEngineerTool.tsx and seed the Knowledge Graph collections.
Phase 1: Systems, Materials, Capabilities
"""
import re, json, os, unicodedata

TSX_PATH = 'src/components/react/ReverseEngineerTool.tsx'
OUT_DIR = 'src/content'

with open(TSX_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Extract ALLOYS map ──
alloy_match = re.search(r'const ALLOYS:\s*Record<string,\s*string>\s*=\s*{([^}]+)}', content)
alloys = {}
if alloy_match:
    for line in alloy_match.group(1).split('\n'):
        m = re.match(r"\s*'(\w+)':\s*'([^']+)'", line)
        if m:
            alloys[m.group(1)] = m.group(2)

# Write materials
for alloy_id, desc in alloys.items():
    name = desc.split(' — ')[0].strip() if ' — ' in desc else desc.strip()
    slug = f'grade-{alloy_id}' if not alloy_id.startswith('ti') else alloy_id
    
    # Determine category
    if 'CP' in name or 'Pure' in name:
        cat = 'Commercially Pure'
    elif 'Beta' in name or 'beta' in name.lower():
        cat = 'Beta Alloy'
    elif 'Near-alpha' in desc:
        cat = 'Near-Alpha Alloy'
    elif 'Alpha-beta' in desc or 'General alpha-beta' in desc or 'alpha-beta' in desc.lower():
        cat = 'Alpha-Beta Alloy'
    elif 'Intermetallic' in desc:
        cat = 'Intermetallic'
    elif 'Superelastic' in desc or 'Shape Memory' in desc or 'Nitinol' in desc:
        cat = 'Shape Memory Alloy'
    else:
        cat = 'Alpha-Beta Alloy'
    
    material = {
        'title': name,
        'aliases': [alloy_id],
        'category': cat,
        'description': desc.split(' — ')[1] if ' — ' in desc else desc,
        'standards': [],
        'relatedCapabilities': [],
    }
    fname = f'{OUT_DIR}/materials/{slug}.json'
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(material, f, indent=2, ensure_ascii=False)
    print(f'Material: {fname}')

# ── 2. Extract PART_DB entries (Systems) ──
# Find all entries between PART_DB: PartProfile[] = [...] and ];
entries_raw = re.search(r'const PART_DB:\s*PartProfile\[\]\s*=\s*\[(.+?)\];\s*/\*\s*─+ Main Component ─+\s*/', content, re.DOTALL)
if not entries_raw:
    # Try simpler pattern
    entries_raw = re.search(r'const PART_DB:\s*PartProfile\[\]\s*=\s*\[(.+?)\];', content, re.DOTALL)

if entries_raw:
    block = entries_raw.group(1)
    # Split by top-level { ... },
    depth = 0
    entry_chunks = []
    current = []
    for ch in block:
        if ch == '{':
            depth += 1
            current.append(ch)
        elif ch == '}':
            depth -= 1
            current.append(ch)
            if depth == 0:
                # End of an entry object
                entry_chunks.append(''.join(current))
                current = []
        elif depth > 0:
            current.append(ch)
    # Also handle entries with trailing comma
    # Filter empty
    entry_chunks = [e for e in entry_chunks if len(e) > 10]
    print(f'\nFound {len(entry_chunks)} system entries')
    
    for idx, chunk in enumerate(entry_chunks):
        # Extract fields
        def get_field(name):
            m = re.search(rf"^\s*{name}:\s*'([^']+)'", chunk, re.MULTILINE)
            return m.group(1) if m else ''
        def get_array(name):
            m = re.search(rf"^\s*{name}:\s*\[([^\]]+)\]", chunk, re.MULTILINE)
            if m:
                items = re.findall(r"'([^']+)'", m.group(1))
                return items
            return []
        
        title = get_field('category')
        if not title:
            continue
        emoji = get_field('image')
        industry = get_field('industries')[:1]
        if get_array('industries'):
            industry = get_array('industries')[0]
        desc = get_field('geometry')
        alloyReason = get_field('alloyReason')
        formReason = get_field('formReason')
        process = get_array('process')
        tollServices = get_array('tollServices')
        pitfalls = get_array('pitfalls')
        specNote = get_field('specNote')
        keywords = get_array('keywords')
        
        # Generate slug — fully collapse consecutive hyphens so titles with "/"
        # produce clean single-hyphen slugs (e.g. "Brackets / Fittings / Connectors" → brackets-fittings-connectors).
        # NOTE: when re-seeding, delete the old "--" filename variants in src/content/systems/ afterwards.
        slug = title.lower().replace(' & ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').replace('  ', ' ').replace(' ', '-').strip('-')
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        slug = re.sub(r'-+', '-', slug)
        
        # Determine industry mapping
        ind_map = {
            'Aerospace': 'Aerospace & Defense',
            'Defense': 'Aerospace & Defense',
            'Medical Device': 'Medical Device',
            'Chemical Processing': 'Chemical Processing',
            'Energy': 'Energy',
            'Electroplating': 'Electroplating & Surface Finishing',
            'PCB Manufacturing': 'Electronics Manufacturing',
            'Wastewater Treatment': 'Environmental Engineering',
            'Semiconductor': 'Semiconductor',
            'Marine': 'Marine & Offshore',
            'Oil & Gas': 'Oil & Gas',
            'Cycling': 'Cycling / Bicycle',
            'Automotive': 'Automotive & Motorsports',
            'Consumer': 'Consumer Electronics',
            'Other': 'General Industrial',
        }
        ind_title = ind_map.get(industry, industry)
        
        system = {
            'title': title,
            'emoji': emoji,
            'industry': ind_title,
            'description': desc[:300] if len(desc) > 300 else desc,
            'designPrinciples': [f'Material: {alloyReason[:200]}', f'Form: {formReason[:200]}'],
            'engineeringTrends': [f'Process: {p}' for p in process[:3]],
            'comparisonNotes': f'Standards: {specNote[:200]}' if specNote else '',
            'productEntities': [],
            'relatedCapabilities': process[:3],
            'relatedMaterials': [],
            'relatedStandards': [],
        }
        fname = f'{OUT_DIR}/systems/{slug}.json'
        with open(fname, 'w', encoding='utf-8') as f:
            json.dump(system, f, indent=2, ensure_ascii=False)
        print(f'System: {fname}')

# ── 3. Extract unique capabilities from all entries ──
unique_caps = set()
for chunk in entry_chunks:
    process = re.findall(r"'([^']+)'", (re.search(r'process:\s*\[([^\]]+)\]', chunk) or [''])[0]) if 'process' in chunk else []
    services = re.findall(r"'([^']+)'", (re.search(r'tollServices:\s*\[([^\]]+)\]', chunk) or [''])[0]) if 'tollServices' in chunk else []
    for p in process + services:
        unique_caps.add(p.strip())

cap_categories = {
    'CNC': 'Machining', 'Milling': 'Machining', 'Turning': 'Machining', 'Grinding': 'Machining',
    'Thread': 'Fastener Manufacturing', 'Forging': 'Forging', 'Cold heading': 'Fastener Manufacturing',
    'EDM': 'EDM', 'Laser': 'Laser Processing', 'Waterjet': 'Laser Processing',
    'Welding': 'Welding', 'TIG': 'Welding', 'Weld': 'Welding',
    'SLM': 'Additive Manufacturing', '3D Printing': 'Additive Manufacturing',
    'Stamping': 'Forming', 'Drawing': 'Forming', 'Bending': 'Forming',
    'Inspection': 'Inspection', 'Testing': 'Inspection', 'CMM': 'Inspection',
    'Heat Treatment': 'Heat Treatment', 'Annealing': 'Heat Treatment',
    'Coating': 'Surface Treatment', 'Anodizing': 'Surface Treatment', 'PVD': 'Surface Treatment',
    'Polishing': 'Surface Treatment', 'Passivation': 'Surface Treatment',
    'Rolling': 'Forming', 'Extrusion': 'Forming',
}

for cap in sorted(unique_caps):
    # Determine category
    cat = 'General Manufacturing'
    for kw, c in cap_categories.items():
        if kw.lower() in cap.lower():
            cat = c
            break
    
    slug = cap.lower().replace(' / ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').replace(' ', '-').replace('--', '-').strip('-')
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    
    capability = {
        'title': cap,
        'aliases': [],
        'category': cat,
        'description': f'{cap} capability for titanium components',
        'materials': [],
        'industries': [],
        'relatedInspection': [],
    }
    fname = f'{OUT_DIR}/capabilities/{slug}.json'
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(capability, f, indent=2, ensure_ascii=False)

print(f'\nCapabilities: {len(unique_caps)}')

# ── 4. Seed industries ──
industries_data = [
    {'title': 'Aerospace & Defense', 'aliases': ['Aerospace', 'Defense', 'Aviation'],
     'description': 'Aircraft engines, airframe structures, missile systems, and military vehicles requiring high-strength lightweight titanium components.',
     'systems': [], 'applications': ['Engine components', 'Airframe structures', 'Landing gear', 'Missile hardware', 'Armor plates']},
    {'title': 'Medical Device', 'aliases': ['Medical', 'Biomedical', 'Orthopedic', 'Dental'],
     'description': 'Orthopedic implants, dental prosthetics, surgical instruments, and interventional medical devices requiring biocompatible titanium alloys.',
     'systems': [], 'applications': ['Joint replacements', 'Bone fixation', 'Dental implants', 'Surgical tools', 'Cardiovascular stents']},
    {'title': 'Cycling / Bicycle', 'aliases': ['Bicycle', 'Bike', 'Cycling', 'E-bike'],
     'description': 'High-performance bicycle frames, drivetrain components, cockpit hardware, and suspension systems for road, mountain, and gravel cycling.',
     'systems': [], 'applications': ['Drivetrain components', 'Braking systems', 'Suspension hardware', 'Cockpit & steering', 'Wheel components']},
    {'title': 'Consumer Electronics', 'aliases': ['Consumer', '3C', 'Electronics', 'Wearable'],
     'description': 'Smartphone chassis, smartwatch bezels, foldable device hinges, and premium consumer hardware requiring lightweight, durable titanium.',
     'systems': [], 'applications': ['Watch cases & bezels', 'Phone mid-frames', 'Hinge mechanisms', 'Earbud components', 'Keycaps']},
    {'title': 'Chemical Processing', 'aliases': ['Chemical', 'Petrochemical', 'Pharmaceutical'],
     'description': 'Chemical reactors, heat exchangers, piping systems, and process equipment for corrosive chemical environments.',
     'systems': [], 'applications': ['Reactor internals', 'Pipe fittings', 'Heat exchanger tubes', 'Valve components', 'Storage tanks']},
    {'title': 'Semiconductor', 'aliases': ['Semiconductor', 'Chip', 'Wafer fabrication', 'UHV'],
     'description': 'Vacuum chamber components, gas delivery fittings, plasma shields, and precision instrumentation for semiconductor manufacturing.',
     'systems': [], 'applications': ['Chamber liners', 'Gas fittings', 'Wafer handling', 'Plasma shields', 'Metrology components']},
    {'title': 'Marine & Offshore', 'aliases': ['Marine', 'Naval', 'Offshore', 'Shipbuilding'],
     'description': 'Propellers, shafts, seawater piping, subsea equipment, and naval propulsion components for marine environments.',
     'systems': [], 'applications': ['Propeller systems', 'Shafting', 'Seawater piping', 'Subsea hardware', 'Naval components']},
    {'title': 'Energy', 'aliases': ['Energy', 'Power', 'Nuclear', 'Hydrogen', 'Renewable'],
     'description': 'Nuclear power components, hydrogen energy infrastructure, oil & gas equipment, and desalination plant hardware.',
     'systems': [], 'applications': ['Condenser tubes', 'Hydrogen storage', 'PEM electrolyzer plates', 'Valve components', 'Heat exchangers']},
    {'title': 'Automotive & Motorsports', 'aliases': ['Automotive', 'Motorsports', 'Racing', 'F1'],
     'description': 'Suspension linkages, engine components, exhaust systems, and performance hardware for racing and high-end automotive.',
     'systems': [], 'applications': ['Suspension rods', 'Engine valves', 'Exhaust systems', 'Wheel hardware', 'Turbochargers']},
    {'title': 'Electroplating & Surface Finishing', 'aliases': ['Electroplating', 'Surface finishing', 'PCB'],
     'description': 'Anode baskets, plating racks, jigs, and fixtures for electroplating and PCB manufacturing requiring acid-resistant titanium.',
     'systems': [], 'applications': ['Anode baskets', 'Plating racks', 'PCB fixtures', 'Heater sheaths', 'Piping systems']},
    {'title': 'Environmental Engineering', 'aliases': ['Wastewater', 'Environmental', 'Water treatment'],
     'description': 'Wastewater treatment components, filtration systems, and environmental engineering hardware requiring corrosion-resistant titanium.',
     'systems': [], 'applications': ['Filter elements', 'Pump components', 'Sludge handling', 'Mist eliminators', 'Dosing systems']},
    {'title': 'General Industrial', 'aliases': ['Industrial', 'General', 'Manufacturing'],
     'description': 'Standard industrial fasteners, flanges, and hardware components for general manufacturing and maintenance.',
     'systems': [], 'applications': ['Fasteners & hardware', 'Pipe flanges', 'Structural brackets', 'Handling equipment', 'Machine components']},
]
for ind in industries_data:
    # Collapse consecutive hyphens → clean single-hyphen slugs (e.g. "Cycling / Bicycle" → cycling-bicycle).
    # NOTE: when re-seeding, delete the old "cycling---bicycle.json" file in src/content/industries/ afterwards.
    slug = re.sub(r'-+', '-', ind['title'].lower().replace(' & ', '-').replace('/', '-').replace(' ', '-'))
    fname = f'{OUT_DIR}/industries/{slug}.json'
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(ind, f, indent=2, ensure_ascii=False)
print(f'Industries: {len(industries_data)}')

print('\n--- Seeding complete ---')
