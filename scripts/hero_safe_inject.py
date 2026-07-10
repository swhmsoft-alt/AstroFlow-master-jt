"""Hero.ts injector - line-based, no corruption risk"""
import json, os

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts'
with open(fp, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# All insertions: { 'route_key': (metrics_list, chips_list, compact_bool_or_none) }
all = {}

def add(route, metrics, chips, compact=None):
    all[route] = (metrics, chips, compact)

add('/services', [{'value':'6','label':'Service Pillars'},{'value':'35+','label':'CNC Machines'},{'value':'3','label':'Quality Certs'}], ['CNC Machining','Additive Manufacturing','Fabrication','Forming & Heavy','Surface Treatment'])
add('/materials', [{'value':'30+','label':'Titanium Grades'},{'value':'15+','label':'ASTM/AMS'},{'value':'6','label':'Alloy Classes'}], ['Grade 5 Ti-6Al-4V','Grade 23 ELI','Grade 2 CP','AMS 4928','ASTM B348'])
add('/capabilities', [{'value':'5','label':'Capability Pillars'},{'value':'AS9100D','label':'Aerospace'},{'value':'0.005mm','label':'Dimensional'}], ['Manufacturing','Engineering','Capacity','Quality','Inspection','Traceability','Certifications'])
add('/industries', [{'value':'8','label':'Target Industries'},{'value':'AS9100D','label':'Aerospace'},{'value':'ISO 13485','label':'Medical'}], ['Aerospace','Medical & Dental','Defense','Automotive','Energy','AI'])
add('/resources', [{'value':'50+','label':'Technical Docs'},{'value':'100+','label':'Engineering Pages'},{'value':'Free','label':'CAD Resources'}], ['Whitepapers','CAD Downloads','Engineering Guides','Compliance Docs'])
add('/rfq', [{'value':'24-48','label':'Hr Quote'},{'value':'100%','label':'NDA'},{'value':'Secure','label':'CAD Upload'}], ['DFM Review','CAD Files','MTR Required','NDA Available'])
add('/facilities', [{'value':'15+','label':'Global Facilities'},{'value':'50,000+','label':'Sq Meters'},{'value':'24/7','label':'Operations'}], ['Manufacturing Plants','Inspection Labs','Warehousing','Global Logistics','ISO Certified'])
add('/equipment', [{'value':'35+','label':'CNC Machines'},{'value':'5-Axis','label':'Multi-Axis'},{'value':'CMM','label':'Inspection'}], ['5-Axis Machining','Swiss Lathe','Wire EDM','CMM Metrology','Automated Pallet'], True)
add('/about', [{'value':'500+','label':'Global Clients'},{'value':'15+','label':'Years'},{'value':'3','label':'Certifications'}], ['AS9100D','ISO 13485','ISO 9001','OEM/ODM'])

# Capabilities
add('/capabilities/manufacturing', [{'value':'0.005mm','label':'Tolerance'},{'value':'Ra 0.4um','label':'Finish'},{'value':'1200mm','label':'Max Size'}], ['5-Axis CNC Milling','Swiss Lathe','Wire EDM','Ti-6Al-4V','Grade 23'])
add('/capabilities/engineering', [{'value':'24-48 Hrs','label':'DFM Review'},{'value':'15-25%','label':'Cycle Red'},{'value':'3:1','label':'Buy-to-Fly'}], ['DFM Review','Mastercam Sim','Value Engineering','GD&T','FEA'], True)
add('/capabilities/capacity', [{'value':'45,000+','label':'Parts/Year'},{'value':'8,500+','label':'Hours/Month'},{'value':'35+','label':'CNC Units'},{'value':'24/7','label':'Lights-Out'}], ['High-Volume','Multi-Pallet','Rapid Prototyping','Resilience'])
add('/capabilities/quality', [{'value':'0.0015mm','label':'CMM Acc'},{'value':'100%','label':'MTR Trace'},{'value':'99.9%','label':'On-Time'}], ['AS9100D','ISO 13485','EN 10204 3.1','FAIR','SPC'], True)
add('/capabilities/inspection', [{'value':'1.9um','label':'CMM'},{'value':'30s','label':'OES PMI'},{'value':'Ra 0.2um','label':'Roughness'}], ['ZEISS CMM','XRF','FPI/UT','Optical Comp','ISO 17025'])
add('/capabilities/traceability', [{'value':'100%','label':'EN 10204'},{'value':'10+ Yrs','label':'Archival'},{'value':'24 Hrs','label':'Audit'}], ['DFARS','Heat Lot','PMI Verified','Laser Marked','Chain of Custody'], True)
add('/capabilities/certifications', [{'value':'3','label':'Active Certs'},{'value':'Annually','label':'Audits'},{'value':'SGS/TUV','label':'Registrars'}], ['AS9100D','ISO 13485','ISO 9001','Nadcap NDT','CAPA'], True)

# CNC
add('/titanium-cnc-machining-services', [{'value':'5','label':'CNC Services'},{'value':'0.005mm','label':'Tolerance'},{'value':'AS9100D','label':'Certified'}], ['3/5-Axis Milling','Swiss Turning','Wire EDM','Custom Comp','CAM Sim'])
add('/titanium-cnc-machining-services/3-5-axis-cnc-machining', [{'value':'3/4/5-Axis','label':'Simultaneous'},{'value':'0.005mm','label':'Tolerance'},{'value':'HSK-A63','label':'Spindle'}], ['5-Axis Milling','3-Axis Milling','HSK Tooling','CAM Sim','In-Process'])
add('/titanium-cnc-machining-services/cnc-milling-turning', [{'value':'0.005mm','label':'Tolerance'},{'value':'Cpk1.67','label':'Repeat'},{'value':'0.5mm','label':'Micro'}], ['CNC Turning','Multi-Tasking','Swiss Lathe','Bone Screws','Prismatic'])
add('/titanium-cnc-machining-services/wire-edm-machining', [{'value':'0.002mm','label':'Accuracy'},{'value':'Ra0.25um','label':'Finish'},{'value':'0.1mm','label':'Wire'}], ['Wire EDM','Zero Stress','Sharp Corners','Hardened Alloys','EDM Sinking'])
add('/titanium-cnc-machining-services/custom-industrial-components', [{'value':'AS9100D','label':'Quality'},{'value':'Complex','label':'Assemblies'},{'value':'High-Vac','label':'Chambers'}], ['Structural Assemblies','Fluid Manifolds','Vacuum Chambers','Micro Comp','Custom Alloys'])

# Additive
add('/titanium-additive-manufacturing', [{'value':'3','label':'Additive'},{'value':'99.5%','label':'Density'},{'value':'3-5 Days','label':'Proto'}], ['SLM/DMLS','Rapid Proto','Low-Volume','Ti-6Al-4V','ASTM F2924'])
add('/titanium-additive-manufacturing/3d-printing-slm', [{'value':'99.5%','label':'Density'},{'value':'20-60um','label':'Layer'},{'value':'950MPa','label':'Tensile'}], ['SLM/DMLS','Yb-Fiber Laser','Ti-6Al-4V','ASTM F2924','Support-Free'])
add('/titanium-additive-manufacturing/rapid-prototyping', [{'value':'3-5 Days','label':'Lead Time'},{'value':'99.5%','label':'Density'},{'value':'Zero','label':'Tooling'}], ['Rapid Proto','Design Iterations','Single-Unit MOQ','SLM Tech','DFAM'])
add('/titanium-additive-manufacturing/low-volume-production', [{'value':'10-1000+','label':'Units'},{'value':'95%','label':'Matl Util'},{'value':'Zero','label':'Tooling'}], ['Low-Volume','SPC','Multi-Laser','2-4 Week','AS9100D'])

# Fabrication
add('/titanium-fabrication-services', [{'value':'3','label':'Fab Services'},{'value':'AWS D1.6','label':'Weld'},{'value':'AS9100D','label':'Certified'}], ['Laser Cutting','Waterjet','TIG Welding','Assembly'])
add('/titanium-fabrication-services/laser-cutting', [{'value':'0.03mm','label':'Accuracy'},{'value':'3000x1500','label':'Sheet'},{'value':'0.1mm','label':'Kerf'}], ['Fiber Laser','Sheet Metal','Tube Cutting','Weld-Ready'])
add('/titanium-fabrication-services/waterjet-cutting', [{'value':'60,000PSI','label':'Pressure'},{'value':'120mm','label':'Thick'},{'value':'Zero HAZ','label':'Heat Zone'}], ['Abrasive Waterjet','Thick Plate','Complex Shapes','No HAZ'])
add('/titanium-fabrication-services/titanium-welding-assembly', [{'value':'AWS D1.6','label':'Standard'},{'value':'AS9100D','label':'Certified'},{'value':'Full Argon','label':'Purge'}], ['TIG Welding','Laser Welding','Assembly','Anti-Galling'])

# Forming
add('/titanium-forming-heavy-manufacturing', [{'value':'4','label':'Forming'},{'value':'8,000MT','label':'Press'},{'value':'12m','label':'Length'}], ['Forging','Extrusion','Hot Rolling','Plate Forming','AS9100D'])
add('/titanium-forming-heavy-manufacturing/titanium-forging', [{'value':'8,000MT','label':'Press'},{'value':'2,500mm','label':'Ring'},{'value':'95%','label':'Equiaxed'}], ['Closed-Die','Open-Die','Seamless Rings','AMS 2631'])
add('/titanium-forming-heavy-manufacturing/titanium-extrusion', [{'value':'6,000T','label':'Press'},{'value':'12m','label':'Length'},{'value':'350mm','label':'Envelope'}], ['Profile Extrusion','Seamless Tubes','Hollow Shapes','AS9100D'])
add('/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing', [{'value':'800mm','label':'Saw'},{'value':'PMI','label':'Validated'},{'value':'AS9100D','label':'Compliant'}], ['CNC Band Saw','Surface Peeling','Chemical Decon','MTR','Lot Tracking'])

# Surface
add('/titanium-surface-treatment', [{'value':'3','label':'Treatment'},{'value':'AMS 2488','label':'Anodizing'},{'value':'ISO 13485','label':'Medical'}], ['Anodizing','Passivation','Micro-Arc','Sandblasting'])
add('/titanium-surface-treatment/anodizing', [{'value':'AMS 2488','label':'Type II/III'},{'value':'Anti-Galling','label':'Coating'},{'value':'Color','label':'Option'}], ['Anodizing','MAO Coating','AMS 2488D','Wear Resistance'])
add('/titanium-surface-treatment/chemical-passivation', [{'value':'ASTM F86','label':'Std'},{'value':'Nitric','label':'Acid'},{'value':'Bio-Comp','label':'Grade'}], ['Passivation','Acid Pickling','Nitric Acid','Citric Acid'])
add('/titanium-surface-treatment/polishing-sandblasting', [{'value':'Ra0.01um','label':'Mirror'},{'value':'Medical','label':'Grade'},{'value':'Zero-Contam','label':'Cert'}], ['Mirror Polishing','Abrasive Blasting','Anchor Grids','Medical Grade'])

# Value-Added
add('/laser-marking-custom-logo', [{'value':'MIL-STD-130','label':'Std'},{'value':'0.01mm','label':'Beam'},{'value':'UDI','label':'Compliant'}], ['Laser Anneal','Deep Engraving','DataMatrix','UID Marking'])
add('/branded-custom-packaging-services', [{'value':'ISTA 2A/3A','label':'Cert'},{'value':'ERP','label':'Track'},{'value':'VCI','label':'Corrosion'}], ['CNC Foam','VCI Barriers','ISPM-15','Corrosion Protect'])

# Process each route - find the closing line and insert before it
processed = 0
for route, (metrics, chips, compact) in all.items():
    # Find the route key line
    route_line = f"  '{route}': {{"
    
    found = False
    for i, line in enumerate(lines):
        stripped = line.rstrip()
        if stripped == route_line:
            # Found the route - now find the closing '  },' or '  }' line
            depth = 0
            for j in range(i, len(lines)):
                l = lines[j]
                # Count braces (rough)
                for ch in l:
                    if ch == '{': depth += 1
                    if ch == '}': depth -= 1
                if depth == 0:
                    # This is the closing line of the route entry
                    # Build insertion text
                    indent = '    '
                    m_str = json.dumps(metrics, indent=6).replace('\n', f'\n{indent}')
                    c_str = json.dumps(chips, indent=6).replace('\n', f'\n{indent}')
                    
                    insert = f',\n{indent}keyMetrics: {m_str},\n{indent}entityChips: {c_str}'
                    if compact:
                        insert += f',\n{indent}compact: true'
                    insert += '\n'
                    
                    # Insert BEFORE the closing line
                    lines[j] = insert + lines[j]
                    found = True
                    processed += 1
                    print(f'  INSERTED: {route}')
                    break
            break
    
    if not found:
        print(f'  NOT FOUND: {route}')

with open(fp, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'\nDone! {processed} routes processed')
