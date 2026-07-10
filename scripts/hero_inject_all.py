"""Comprehensive script: Add ALL keyMetrics/entityChips to hero.ts"""
import json, shutil, os

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts'

with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# Build insertions: { 'route': (metrics_json, chips_json) }
# All routes from the original text with exact matching
insertions = {}

def add(route, metrics, chips):
    insertions[route] = (json.dumps(metrics, indent=6), json.dumps(chips, indent=6))

# === 9 Main Pages ===
add('/services', [
    {"value": "6", "label": "Service Pillars"},
    {"value": "35+", "label": "CNC Machines"},
    {"value": "3", "label": "Quality Certs"},
], ['CNC Machining', 'Additive Manufacturing', 'Fabrication', 'Forming & Heavy', 'Surface Treatment'])

add('/materials', [
    {"value": "30+", "label": "Titanium Grades"},
    {"value": "15+", "label": "ASTM/AMS Standards"},
    {"value": "6", "label": "Alloy Classes"},
], ['Grade 5 Ti-6Al-4V', 'Grade 23 ELI', 'Grade 2 CP', 'AMS 4928', 'ASTM B348'])

add('/capabilities', [
    {"value": "5", "label": "Capability Pillars"},
    {"value": "AS9100D", "label": "Aerospace Standard"},
    {"value": "±0.005 mm", "label": "Dimensional Limits"},
], ['Manufacturing', 'Engineering', 'Capacity', 'Quality', 'Inspection', 'Traceability', 'Certifications'])

add('/industries', [
    {"value": "8", "label": "Target Industries"},
    {"value": "AS9100D", "label": "Aerospace Certified"},
    {"value": "ISO 13485", "label": "Medical Compliant"},
], ['Aerospace', 'Medical & Dental', 'Defense', 'Automotive', 'Energy', 'AI Infrastructure'])

add('/resources', [
    {"value": "50+", "label": "Technical Documents"},
    {"value": "100+", "label": "Engineering Pages"},
    {"value": "Free", "label": "CAD Resources"},
], ['Whitepapers', 'CAD Downloads', 'Engineering Guides', 'Compliance Docs', 'Knowledge Base'])

add('/rfq', [
    {"value": "24-48", "label": "Hr Quote Turnaround"},
    {"value": "100%", "label": "NDA Protected"},
    {"value": "Secure", "label": "CAD Upload"},
], ['DFM Review', 'CAD Files', 'MTR Required', 'NDA Available', 'Global Shipping'])

add('/facilities', [
    {"value": "15+", "label": "Global Facilities"},
    {"value": "50,000+", "label": "Sq Meters"},
    {"value": "24/7", "label": "Operations"},
], ['Manufacturing Plants', 'Inspection Labs', 'Warehousing', 'Global Logistics', 'ISO Certified'])

add('/equipment', [
    {"value": "35+", "label": "CNC Machines"},
    {"value": "5-Axis", "label": "Multi-Axis Centers"},
    {"value": "CMM", "label": "Inspection Systems"},
], ['5-Axis Machining', 'Swiss Lathe', 'Wire EDM', 'CMM Metrology', 'Automated Pallet'])

add('/about', [
    {"value": "500+", "label": "Global Clients"},
    {"value": "15+", "label": "Years Experience"},
    {"value": "3", "label": "Active Certifications"},
], ['AS9100D', 'ISO 13485', 'ISO 9001', 'OEM/ODM', 'Global Supply Chain'])

# === Capabilities Sub-pages ===
add('/capabilities/manufacturing', [
    {"value": "±0.005 mm", "label": "Dimensional Tolerance"},
    {"value": "Ra 0.4 μm", "label": "Surface Finish"},
    {"value": "1,200 mm", "label": "Max Machining Size"},
], ['5-Axis CNC Milling', 'Swiss Lathe Turning', 'Wire EDM', 'Ti-6Al-4V', 'Grade 23 ELI'])

add('/capabilities/engineering', [
    {"value": "24-48 Hrs", "label": "DFM Review Turnaround"},
    {"value": "15-25%", "label": "Cycle Time Reduction"},
    {"value": "< 3:1", "label": "Buy-to-Fly Ratio"},
], ['DFM Review', 'Mastercam Simulation', 'Value Engineering', 'GD&T Analysis', 'FEA Validation'])

add('/capabilities/capacity', [
    {"value": "45,000+", "label": "Parts / Year"},
    {"value": "8,500+", "label": "Spindle Hrs / Month"},
    {"value": "35+", "label": "CNC Units"},
    {"value": "24/7", "label": "Lights-Out"},
], ['High-Volume Production', 'Multi-Pallet Systems', 'Rapid Prototyping', 'Supply Chain Resilience'])

add('/capabilities/quality', [
    {"value": "±0.0015 mm", "label": "CMM Accuracy"},
    {"value": "100%", "label": "MTR Traceability"},
    {"value": "99.9%", "label": "On-Time Delivery"},
], ['AS9100D', 'ISO 13485', 'EN 10204 3.1', 'FAIR AS9102', 'SPC Control'])

add('/capabilities/inspection', [
    {"value": "±1.9 μm", "label": "CMM Volumetric"},
    {"value": "< 30s", "label": "OES PMI Analysis"},
    {"value": "Ra 0.2 μm", "label": "Surface Roughness"},
], ['ZEISS CMM', 'XRF Spectrometer', 'FPI / UT', 'Optical Comparator', 'ISO 17025'])

add('/capabilities/traceability', [
    {"value": "100%", "label": "EN 10204 3.1 MTRs"},
    {"value": "10+ Yrs", "label": "Record Retention"},
    {"value": "< 24 Hrs", "label": "Audit Retrieval"},
], ['DFARS Compliant', 'Heat Lot Tracking', 'PMI Verified', 'Laser Marked', 'Chain of Custody'])

add('/capabilities/certifications', [
    {"value": "3", "label": "Active Certifications"},
    {"value": "Annually", "label": "Surveillance Audits"},
    {"value": "SGS/TÜV", "label": "Accredited Registrars"},
], ['AS9100D', 'ISO 13485:2016', 'ISO 9001:2015', 'Nadcap NDT', 'CAPA System'])

# === Service Sub-pages ===
add('/titanium-cnc-machining-services', [
    {"value": "5", "label": "CNC Services"}, {"value": "±0.005mm", "label": "Tolerance"}, {"value": "AS9100D", "label": "Certified"}
], ['3/5-Axis Milling', 'Swiss Turning', 'Wire EDM', 'Custom Components', 'CAM Sim'])

add('/titanium-cnc-machining-services/3-5-axis-cnc-machining', [
    {"value": "3/4/5-Axis", "label": "Simultaneous"}, {"value": "±0.005mm", "label": "Tolerance"}, {"value": "HSK-A63", "label": "Spindle"}
], ['5-Axis Milling', '3-Axis Milling', 'HSK Tooling', 'CAM Sim', 'In-Process Probing'])

add('/titanium-cnc-machining-services/cnc-milling-turning', [
    {"value": "±0.005mm", "label": "Tolerance"}, {"value": "Cpk≥1.67", "label": "Repeatability"}, {"value": "ø0.5mm", "label": "Micro-Min"}
], ['CNC Turning', 'Multi-Tasking', 'Swiss Lathe', 'Bone Screws', 'Prismatic Parts'])

add('/titanium-cnc-machining-services/wire-edm-machining', [
    {"value": "±0.002mm", "label": "Accuracy"}, {"value": "Ra0.25μm", "label": "Finish"}, {"value": "ø0.1mm", "label": "Wire Dia"}
], ['Wire EDM', 'Zero Stress', 'Sharp Corners', 'Hardened Alloys', 'EDM Sinking'])

add('/titanium-cnc-machining-services/custom-industrial-components', [
    {"value": "AS9100D", "label": "Quality"}, {"value": "Complex", "label": "Assemblies"}, {"value": "High-Vacuum", "label": "Chambers"}
], ['Structural Assemblies', 'Fluid Manifolds', 'Vacuum Chambers', 'Micro-Components', 'Custom Alloys'])

add('/titanium-additive-manufacturing', [
    {"value": "3", "label": "Additive Services"}, {"value": "≥99.5%", "label": "Density"}, {"value": "3-5 Days", "label": "Proto LT"}
], ['SLM/DMLS', 'Rapid Prototyping', 'Low-Volume', 'Ti-6Al-4V', 'ASTM F2924'])

add('/titanium-additive-manufacturing/3d-printing-slm', [
    {"value": "≥99.5%", "label": "Density"}, {"value": "20-60μm", "label": "Layer Thk"}, {"value": "950-1050MPa", "label": "Tensile"}
], ['SLM/DMLS', 'Yb-Fiber Laser', 'Ti-6Al-4V', 'ASTM F2924', 'Support-Free'])

add('/titanium-additive-manufacturing/rapid-prototyping', [
    {"value": "3-5 Days", "label": "Lead Time"}, {"value": "≥99.5%", "label": "Density"}, {"value": "Zero", "label": "Tooling Cost"}
], ['Rapid Prototyping', 'Design Iterations', 'Single-Unit MOQ', 'SLM Tech', 'DFAM Review'])

add('/titanium-additive-manufacturing/low-volume-production', [
    {"value": "10-1000+", "label": "Units"}, {"value": "≥95%", "label": "Matl Util"}, {"value": "Zero", "label": "Tooling Cost"}
], ['Low-Volume Prod', 'SPC Validation', 'Multi-Laser Sync', '2-4 Week LT', 'AS9100D'])

add('/titanium-fabrication-services', [
    {"value": "3", "label": "Fab Services"}, {"value": "AWS D1.6", "label": "Weld Std"}, {"value": "AS9100D", "label": "Certified"}
], ['Laser Cutting', 'Waterjet', 'TIG Welding', 'Assembly', 'CNC Profiling'])

add('/titanium-fabrication-services/laser-cutting', [
    {"value": "±0.03mm", "label": "Accuracy"}, {"value": "3000x1500mm", "label": "Sheet Cap"}, {"value": "0.1mm", "label": "Kerf"}
], ['Fiber Laser', 'Sheet Metal', 'Tube Cutting', 'Weld-Ready', '0.5-20mm Thk'])

add('/titanium-fabrication-services/waterjet-cutting', [
    {"value": "60,000PSI", "label": "Pressure"}, {"value": "120mm", "label": "Thickness"}, {"value": "ZERO HAZ", "label": "Heat Zone"}
], ['Abrasive Waterjet', 'Thick Plate', 'Complex Shapes', 'No HAZ', 'Cold Cutting'])

add('/titanium-fabrication-services/titanium-welding-assembly', [
    {"value": "AWS D1.6", "label": "Standard"}, {"value": "AS9100D", "label": "Certified"}, {"value": "Full Argon", "label": "Purge"}
], ['TIG Welding', 'Laser Welding', 'Assembly', 'Anti-Galling', 'CMM Verify'])

add('/titanium-forming-heavy-manufacturing', [
    {"value": "4", "label": "Forming Services"}, {"value": "8,000MT", "label": "Press Cap"}, {"value": "12m", "label": "Max Length"}
], ['Forging', 'Extrusion', 'Hot Rolling', 'Plate Forming', 'AS9100D'])

add('/titanium-forming-heavy-manufacturing/titanium-forging', [
    {"value": "8,000MT", "label": "Press"}, {"value": "ø2,500mm", "label": "Ring Size"}, {"value": "≥95%", "label": "Equiaxed"}
], ['Closed-Die', 'Open-Die', 'Seamless Rings', 'AMS 2631', 'Hot Forming'])

add('/titanium-forming-heavy-manufacturing/titanium-extrusion', [
    {"value": "6,000T", "label": "Press"}, {"value": "12m", "label": "Length"}, {"value": "ø350mm", "label": "Envelope"}
], ['Profile Extrusion', 'Seamless Tubes', 'Hollow Shapes', 'Complex Profiles', 'AS9100D'])

add('/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing', [
    {"value": "ø800mm", "label": "Saw Cap"}, {"value": "PMI", "label": "Validated"}, {"value": "AS9100D", "label": "Compliant"}
], ['CNC Band Saw', 'Surface Peeling', 'Chemical Decon', 'MTR Verified', 'Lot Tracking'])

add('/titanium-surface-treatment', [
    {"value": "3", "label": "Treatment Types"}, {"value": "AMS 2488", "label": "Anodizing"}, {"value": "ISO 13485", "label": "Medical"}
], ['Anodizing', 'Passivation', 'Micro-Arc', 'Sandblasting', 'AMS 2488'])

add('/titanium-surface-treatment/anodizing', [
    {"value": "AMS 2488", "label": "Type II/III"}, {"value": "Anti-Galling", "label": "Coating"}, {"value": "Color Coding", "label": "Option"}
], ['Anodizing', 'MAO Coating', 'AMS 2488D', 'Wear Resistance', 'Corrosion Protect'])

add('/titanium-surface-treatment/chemical-passivation', [
    {"value": "ASTM F86", "label": "Std"}, {"value": "Nitric/Citric", "label": "Acid"}, {"value": "Bio-Compatible", "label": "Grade"}
], ['Passivation', 'Acid Pickling', 'Nitric Acid', 'Citric Acid', 'ASTM A967'])

add('/titanium-surface-treatment/polishing-sandblasting', [
    {"value": "Ra0.01μm", "label": "Mirror Polish"}, {"value": "Medical", "label": "Grade"}, {"value": "Zero-Contam", "label": "Certified"}
], ['Mirror Polishing', 'Abrasive Blasting', 'Anchor Grids', 'Medical Grade', 'Mechanical Finish'])

add('/laser-marking-custom-logo', [
    {"value": "MIL-STD-130", "label": "Std"}, {"value": "≤0.01mm", "label": "Beam Prec"}, {"value": "UDI", "label": "Compliant"}
], ['Laser Anneal', 'Deep Engraving', 'DataMatrix', 'UID Marking', 'Traceability'])

add('/branded-custom-packaging-services', [
    {"value": "ISTA 2A/3A", "label": "Certified"}, {"value": "ERP", "label": "Traceable"}, {"value": "VCI", "label": "Corrosion"}
], ['CNC Foam Milling', 'VCI Barriers', 'ISPM-15 Crating', 'Corrosion Protection', 'ERP Tracked'])

# Apply insertions - for each route, find the closing brace and insert before it
processed = 0
for route, (m_json, c_json) in insertions.items():
    pattern = f"  '{route}': {{"
    idx = content.find(pattern)
    if idx < 0:
        print(f'  NOT FOUND: {route}')
        continue
    
    # Find the entry's closing brace
    end = idx + len(pattern)
    depth = 1
    while end < len(content) and depth > 0:
        if content[end] == '{': depth += 1
        if content[end] == '}': depth -= 1
        end += 1
    
    block = content[idx:end]
    
    # Skip if already has metrics
    if 'keyMetrics' in block:
        print(f'  SKIP (exists): {route}')
        processed += 1
        continue
    
    # Build insertion text
    indent = '    '
    insert = f',\n{indent}compact: true' if route in [
        '/capabilities/engineering', '/capabilities/capacity', '/capabilities/quality',
        '/capabilities/traceability', '/capabilities/certifications', '/equipment'
    ] else ''
    
    insertion = f',\n{indent}keyMetrics: {m_json.replace(chr(10), chr(10)+indent)},\n{indent}entityChips: {c_json.replace(chr(10), chr(10)+indent)}{insert}'
    
    # Insert before the closing '}'
    new_block = block[:-1] + insertion + '\n  }'
    content = content[:idx] + new_block + content[end:]
    processed += 1
    print(f'  ADDED: {route}')

# Write result
with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nDone! {processed} routes processed')
