# coding: utf-8
"""Add keyMetrics and entityChips to all service sub-page routes in hero.ts"""
import json, os, shutil

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts'
bak = fp + '.svcbak'
shutil.copy2(fp, bak)

with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# All service routes with their metrics/chips
svc = {
    '/titanium-cnc-machining-services': [
        [{"value":"5","label":"CNC Services"},{"value":"±0.005mm","label":"Tolerance"},{"value":"AS9100D","label":"Certified"}],
        ['3/5-Axis Milling','Swiss Turning','Wire EDM','Custom Components','CAM Sim'],
    ],
    '/titanium-cnc-machining-services/3-5-axis-cnc-machining': [
        [{"value":"3/4/5-Axis","label":"Simultaneous"},{"value":"±0.005mm","label":"Tolerance"},{"value":"HSK-A63","label":"Spindle"}],
        ['5-Axis Milling','3-Axis Milling','HSK Tooling','CAM Sim','In-Process Probing'],
    ],
    '/titanium-cnc-machining-services/cnc-milling-turning': [
        [{"value":"±0.005mm","label":"Tolerance"},{"value":"Cpk≥1.67","label":"Repeatability"},{"value":"ø0.5mm","label":"Micro-Min"}],
        ['CNC Turning','Multi-Tasking','Swiss Lathe','Bone Screws','Prismatic Parts'],
    ],
    '/titanium-cnc-machining-services/wire-edm-machining': [
        [{"value":"±0.002mm","label":"Accuracy"},{"value":"Ra0.25μm","label":"Finish"},{"value":"ø0.1mm","label":"Wire Dia"}],
        ['Wire EDM','Zero Stress','Sharp Corners','Hardened Alloys','EDM Sinking'],
    ],
    '/titanium-cnc-machining-services/custom-industrial-components': [
        [{"value":"AS9100D","label":"Quality"},{"value":"Complex","label":"Assemblies"},{"value":"High-Vacuum","label":"Chambers"}],
        ['Structural Assemblies','Fluid Manifolds','Vacuum Chambers','Micro-Components','Custom Alloys'],
    ],
    '/titanium-additive-manufacturing': [
        [{"value":"3","label":"Additive Services"},{"value":"≥99.5%","label":"Density"},{"value":"3-5 Days","label":"Proto LT"}],
        ['SLM/DMLS','Rapid Prototyping','Low-Volume','Ti-6Al-4V','ASTM F2924'],
    ],
    '/titanium-additive-manufacturing/3d-printing-slm': [
        [{"value":"≥99.5%","label":"Density"},{"value":"20-60μm","label":"Layer Thk"},{"value":"950-1050MPa","label":"Tensile"}],
        ['SLM/DMLS','Yb-Fiber Laser','Ti-6Al-4V','ASTM F2924','Support-Free'],
    ],
    '/titanium-additive-manufacturing/rapid-prototyping': [
        [{"value":"3-5 Days","label":"Lead Time"},{"value":"≥99.5%","label":"Density"},{"value":"Zero","label":"Tooling Cost"}],
        ['Rapid Prototyping','Design Iterations','Single-Unit MOQ','SLM Tech','DFAM Review'],
    ],
    '/titanium-additive-manufacturing/low-volume-production': [
        [{"value":"10-1000+","label":"Units"},{"value":"≥95%","label":"Matl Util"},{"value":"Zero","label":"Tooling Cost"}],
        ['Low-Volume Prod','SPC Validation','Multi-Laser Sync','2-4 Week LT','AS9100D'],
    ],
    '/titanium-fabrication-services': [
        [{"value":"3","label":"Fab Services"},{"value":"AWS D1.6","label":"Weld Std"},{"value":"AS9100D","label":"Certified"}],
        ['Laser Cutting','Waterjet','TIG Welding','Assembly','CNC Profiling'],
    ],
    '/titanium-fabrication-services/laser-cutting': [
        [{"value":"±0.03mm","label":"Accuracy"},{"value":"3000x1500mm","label":"Sheet Cap"},{"value":"0.1mm","label":"Kerf"}],
        ['Fiber Laser','Sheet Metal','Tube Cutting','Weld-Ready','0.5-20mm Thk'],
    ],
    '/titanium-fabrication-services/waterjet-cutting': [
        [{"value":"60,000PSI","label":"Pressure"},{"value":"120mm","label":"Thickness"},{"value":"ZERO HAZ","label":"Heat Zone"}],
        ['Abrasive Waterjet','Thick Plate','Complex Shapes','No HAZ','Cold Cutting'],
    ],
    '/titanium-fabrication-services/titanium-welding-assembly': [
        [{"value":"AWS D1.6","label":"Standard"},{"value":"AS9100D","label":"Certified"},{"value":"Full Argon","label":"Purge"}],
        ['TIG Welding','Laser Welding','Assembly','Anti-Galling','CMM Verify'],
    ],
    '/titanium-forming-heavy-manufacturing': [
        [{"value":"4","label":"Forming Services"},{"value":"8,000MT","label":"Press Cap"},{"value":"12m","label":"Max Length"}],
        ['Forging','Extrusion','Hot Rolling','Plate Forming','AS9100D'],
    ],
    '/titanium-forming-heavy-manufacturing/titanium-forging': [
        [{"value":"8,000MT","label":"Press"},{"value":"ø2,500mm","label":"Ring Size"},{"value":"≥95%","label":"Equiaxed"}],
        ['Closed-Die','Open-Die','Seamless Rings','AMS 2631','Hot Forming'],
    ],
    '/titanium-forming-heavy-manufacturing/titanium-extrusion': [
        [{"value":"6,000T","label":"Press"},{"value":"12m","label":"Length"},{"value":"ø350mm","label":"Envelope"}],
        ['Profile Extrusion','Seamless Tubes','Hollow Shapes','Complex Profiles','AS9100D'],
    ],
    '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing': [
        [{"value":"ø800mm","label":"Saw Cap"},{"value":"PMI","label":"Validated"},{"value":"AS9100D","label":"Compliant"}],
        ['CNC Band Saw','Surface Peeling','Chemical Decon','MTR Verified','Lot Tracking'],
    ],
    '/titanium-surface-treatment': [
        [{"value":"3","label":"Treatment Types"},{"value":"AMS 2488","label":"Anodizing"},{"value":"ISO 13485","label":"Medical"}],
        ['Anodizing','Passivation','Micro-Arc','Sandblasting','AMS 2488'],
    ],
    '/titanium-surface-treatment/anodizing': [
        [{"value":"AMS 2488","label":"Type II/III"},{"value":"Anti-Galling","label":"Coating"},{"value":"Color Coding","label":"Option"}],
        ['Anodizing','MAO Coating','AMS 2488D','Wear Resistance','Corrosion Protect'],
    ],
    '/titanium-surface-treatment/chemical-passivation': [
        [{"value":"ASTM F86","label":"Std"},{"value":"Nitric/Citric","label":"Acid"},{"value":"Bio-Compatible","label":"Grade"}],
        ['Passivation','Acid Pickling','Nitric Acid','Citric Acid','ASTM A967'],
    ],
    '/titanium-surface-treatment/polishing-sandblasting': [
        [{"value":"Ra0.01μm","label":"Mirror Polish"},{"value":"Medical","label":"Grade"},{"value":"Zero-Contam","label":"Certified"}],
        ['Mirror Polishing','Abrasive Blasting','Anchor Grids','Medical Grade','Mechanical Finish'],
    ],
    '/laser-marking-custom-logo': [
        [{"value":"MIL-STD-130","label":"Std"},{"value":"≤0.01mm","label":"Beam Prec"},{"value":"UDI","label":"Compliant"}],
        ['Laser Anneal','Deep Engraving','DataMatrix','UID Marking','Traceability'],
    ],
    '/branded-custom-packaging-services': [
        [{"value":"ISTA 2A/3A","label":"Certified"},{"value":"ERP","label":"Traceable"},{"value":"VCI","label":"Corrosion"}],
        ['CNC Foam Milling','VCI Barriers','ISPM-15 Crating','Corrosion Protection','ERP Tracked'],
    ],
}

# Process route by route
count = 0
for route_key, (metrics, chips) in svc.items():
    pattern = f"  '{route_key}': {{"
    idx = content.find(pattern)
    if idx < 0:
        print(f'  NOT FOUND: {route_key}')
        continue
    
    # Find the closing brace of this entry
    end_idx = idx + len(pattern)
    brace_count = 1
    while end_idx < len(content) and brace_count > 0:
        if content[end_idx] == '{': brace_count += 1
        if content[end_idx] == '}': brace_count -= 1
        end_idx += 1
    
    entry_text = content[idx:end_idx]
    
    if 'keyMetrics' in entry_text:
        print(f'  SKIP (exists): {route_key}')
        continue
    
    # Build metrics/chips block
    indent = '    '
    m_str = json.dumps(metrics, indent=6).replace('\n', f'\n{indent}')
    c_str = json.dumps(chips, indent=6).replace('\n', f'\n{indent}')
    
    insert = f'\n{indent}keyMetrics: {m_str},\n{indent}entityChips: {c_str},\n  '
    
    # Insert before the closing '},'
    new_entry = entry_text[:-3] + insert + '},'
    content = content[:idx] + new_entry + content[end_idx:]
    count += 1
    print(f'  ADDED: {route_key}')

with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'\nDone! {count} routes updated')
