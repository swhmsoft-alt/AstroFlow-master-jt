"""hero.ts: insert keyMetrics/entityChips AFTER badge line, BEFORE closing brace."""
import json, os

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts'

with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# All insertions: { 'route_key': (metrics_array, chips_array, compact_flag) }
data = {}
def add(r, m, c, compact=False):
    data[r] = (m, c, compact)

add('/services', [{'value':'6','label':'Service Pillars'},{'value':'35+','label':'CNC Machines'},{'value':'3','label':'Quality Certs'}], ['CNC Machining','Additive Manufacturing','Fabrication','Forming & Heavy','Surface Treatment'])
add('/materials', [{'value':'30+','label':'Titanium Grades'},{'value':'15+','label':'ASTM/AMS'},{'value':'6','label':'Alloy Classes'}], ['Grade 5 Ti-6Al-4V','Grade 23 ELI','Grade 2 CP','AMS 4928','ASTM B348'])
add('/capabilities', [{'value':'5','label':'Capability Pillars'},{'value':'AS9100D','label':'Aerospace'},{'value':'±0.005mm','label':'Dimensional'}], ['Manufacturing','Engineering','Capacity','Quality','Inspection','Traceability','Certifications'])
add('/industries', [{'value':'8','label':'Target Industries'},{'value':'AS9100D','label':'Aerospace'},{'value':'ISO 13485','label':'Medical'}], ['Aerospace','Medical & Dental','Defense','Automotive','Energy','AI Infrastructure'])
add('/resources', [{'value':'50+','label':'Technical Docs'},{'value':'100+','label':'Pages'},{'value':'Free','label':'CAD'}], ['Whitepapers','CAD Downloads','Engineering Guides','Compliance Docs'])
add('/rfq', [{'value':'24-48','label':'Hr Quote'},{'value':'100%','label':'NDA'},{'value':'Secure','label':'CAD Upload'}], ['DFM Review','CAD Files','MTR Required','NDA Available','Global Shipping'])
add('/facilities', [{'value':'15+','label':'Facilities'},{'value':'50,000+','label':'Sq Meters'},{'value':'24/7','label':'Operations'}], ['Manufacturing Plants','Inspection Labs','Warehousing','Global Logistics'])
add('/equipment', [{'value':'35+','label':'CNC Machines'},{'value':'5-Axis','label':'Centers'},{'value':'CMM','label':'Inspection'}], ['5-Axis Machining','Swiss Lathe','Wire EDM','CMM Metrology','Automated Pallet'])
add('/about', [{'value':'500+','label':'Clients'},{'value':'15+','label':'Years'},{'value':'3','label':'Certs'}], ['AS9100D','ISO 13485','ISO 9001','OEM/ODM','Global Supply Chain'])

# Capabilities
add('/capabilities/manufacturing', [{'value':'±0.005mm','label':'Tolerance'},{'value':'Ra 0.4um','label':'Finish'},{'value':'1200mm','label':'Max Size'}], ['5-Axis CNC Milling','Swiss Lathe Turning','Wire EDM','Ti-6Al-4V','Grade 23'])
add('/capabilities/engineering', [{'value':'24-48Hr','label':'DFM Review'},{'value':'15-25%','label':'Cycle Red'},{'value':'<3:1','label':'Buy-Fly'}], ['DFM Review','Mastercam Sim','Value Engineering','GD&T','FEA'])
add('/capabilities/capacity', [{'value':'45,000+','label':'Parts/Yr'},{'value':'8,500+','label':'Hrs/Mo'},{'value':'35+','label':'CNC Units'},{'value':'24/7','label':'Lights-Out'}], ['High-Volume','Multi-Pallet','Rapid Proto','Resilience'])
add('/capabilities/quality', [{'value':'±0.0015mm','label':'CMM Acc'},{'value':'100%','label':'MTR'},{'value':'99.9%','label':'On-Time'}], ['AS9100D','ISO 13485','EN 10204 3.1','FAIR','SPC'])
add('/capabilities/inspection', [{'value':'±1.9um','label':'CMM'},{'value':'<30s','label':'OES'},{'value':'Ra 0.2um','label':'Roughness'}], ['ZEISS CMM','XRF','FPI/UT','Optical Comp','ISO 17025'])
add('/capabilities/traceability', [{'value':'100%','label':'EN 10204'},{'value':'10+Yrs','label':'Archival'},{'value':'24Hr','label':'Audit'}], ['DFARS','Heat Lot','PMI','Laser Marked','Chain of Custody'])
add('/capabilities/certifications', [{'value':'3','label':'Active'},{'value':'Annual','label':'Audits'},{'value':'SGS/TUV','label':'Registrars'}], ['AS9100D','ISO 13485','ISO 9001','Nadcap','CAPA'])

# CNC
add('/titanium-cnc-machining-services', [{'value':'5','label':'CNC Services'},{'value':'±0.005mm','label':'Tolerance'},{'value':'AS9100D','label':'Certified'}], ['3/5-Axis Milling','Swiss Turning','Wire EDM','Custom Comp','CAM Sim'])
add('/titanium-cnc-machining-services/3-5-axis-cnc-machining', [{'value':'3/4/5-Axis','label':'Simultaneous'},{'value':'±0.005mm','label':'Tolerance'},{'value':'HSK-A63','label':'Spindle'}], ['5-Axis Milling','3-Axis Milling','HSK Tooling','CAM Sim','In-Process'])
add('/titanium-cnc-machining-services/cnc-milling-turning', [{'value':'±0.005mm','label':'Tolerance'},{'value':'Cpk≥1.67','label':'Repeat'},{'value':'ø0.5mm','label':'Micro'}], ['CNC Turning','Multi-Tasking','Swiss Lathe','Bone Screws','Prismatic'])
add('/titanium-cnc-machining-services/wire-edm-machining', [{'value':'±0.002mm','label':'Accuracy'},{'value':'Ra0.25um','label':'Finish'},{'value':'ø0.1mm','label':'Wire'}], ['Wire EDM','Zero Stress','Sharp Corners','Hardened Alloys','EDM Sinking'])
add('/titanium-cnc-machining-services/custom-industrial-components', [{'value':'AS9100D','label':'Quality'},{'value':'Complex','label':'Assemblies'},{'value':'Hi-Vac','label':'Chambers'}], ['Structural','Fluid Manifolds','Vacuum','Micro-Components','Custom Alloys'])

# Other service groups...
add('/titanium-additive-manufacturing', [{'value':'3','label':'Additive'},{'value':'≥99.5%','label':'Density'},{'value':'3-5D','label':'Proto'}], ['SLM/DMLS','Rapid Proto','Low-Volume','Ti-6Al-4V','ASTM F2924'])
add('/titanium-additive-manufacturing/3d-printing-slm', [{'value':'≥99.5%','label':'Density'},{'value':'20-60um','label':'Layer'},{'value':'950MPa','label':'Tensile'}], ['SLM/DMLS','Yb-Fiber Laser','Ti-6Al-4V','ASTM F2924','Support-Free'])
add('/titanium-additive-manufacturing/rapid-prototyping', [{'value':'3-5D','label':'Lead'},{'value':'≥99.5%','label':'Density'},{'value':'Zero','label':'Tooling'}], ['Rapid Proto','Design Iterations','Single-Unit','SLM Tech','DFAM'])
add('/titanium-additive-manufacturing/low-volume-production', [{'value':'10-1k+','label':'Units'},{'value':'≥95%','label':'Util'},{'value':'Zero','label':'Tooling'}], ['Low-Volume','SPC','Multi-Laser','2-4Week','AS9100D'])

add('/titanium-fabrication-services', [{'value':'3','label':'Fab'},{'value':'AWS D1.6','label':'Weld'},{'value':'AS9100D','label':'Cert'}], ['Laser Cutting','Waterjet','TIG Welding','Assembly','Profiling'])
add('/titanium-fabrication-services/laser-cutting', [{'value':'±0.03mm','label':'Acc'},{'value':'1500x3000','label':'Sheet'},{'value':'0.1mm','label':'Kerf'}], ['Fiber Laser','Sheet Metal','Tube Cutting','Weld-Ready'])
add('/titanium-fabrication-services/waterjet-cutting', [{'value':'60kPSI','label':'Press'},{'value':'120mm','label':'Thick'},{'value':'No HAZ','label':'Heat'}], ['Abrasive WJ','Thick Plate','Complex','Cold Cutting'])
add('/titanium-fabrication-services/titanium-welding-assembly', [{'value':'AWS D1.6','label':'Std'},{'value':'AS9100D','label':'Cert'},{'value':'Full Ar','label':'Purge'}], ['TIG Welding','Laser Welding','Assembly','Anti-Galling'])

add('/titanium-forming-heavy-manufacturing', [{'value':'4','label':'Forming'},{'value':'8kMT','label':'Press'},{'value':'12m','label':'Length'}], ['Forging','Extrusion','Hot Rolling','Plate Forming','AS9100D'])
add('/titanium-forming-heavy-manufacturing/titanium-forging', [{'value':'8kMT','label':'Press'},{'value':'2.5m','label':'Ring'},{'value':'95%','label':'Eqx'}], ['Closed-Die','Open-Die','Seamless Rings','AMS 2631'])
add('/titanium-forming-heavy-manufacturing/titanium-extrusion', [{'value':'6kT','label':'Press'},{'value':'12m','label':'Length'},{'value':'350mm','label':'Envelope'}], ['Profile Extrusion','Seamless Tubes','Hollow Shapes','AS9100D'])
add('/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing', [{'value':'800mm','label':'Saw'},{'value':'PMI','label':'Valid'},{'value':'AS9100D','label':'Comp'}], ['CNC Band Saw','Surface Peel','Chemical Decon','MTR'])

add('/titanium-surface-treatment', [{'value':'3','label':'Treatments'},{'value':'AMS 2488','label':'Anodize'},{'value':'ISO 13485','label':'Medical'}], ['Anodizing','Passivation','Micro-Arc','Sandblasting','AMS 2488'])
add('/titanium-surface-treatment/anodizing', [{'value':'AMS 2488','label':'Type II/III'},{'value':'Anti-Gall','label':'Coat'},{'value':'Color','label':'Option'}], ['Anodizing','MAO','AMS 2488D','Wear Resist'])
add('/titanium-surface-treatment/chemical-passivation', [{'value':'ASTM F86','label':'Std'},{'value':'Nitric','label':'Acid'},{'value':'BioComp','label':'Grade'}], ['Passivation','Acid Pickling','Nitric Acid','Citric Acid'])
add('/titanium-surface-treatment/polishing-sandblasting', [{'value':'Ra0.01','label':'Mirror'},{'value':'Medical','label':'Grade'},{'value':'Zero-Cont','label':'Cert'}], ['Mirror Polish','Abrasive','Anchor Grids','Medical Grade'])

add('/laser-marking-custom-logo', [{'value':'MIL-STD-130','label':'Std'},{'value':'≤0.01mm','label':'Beam'},{'value':'UDI','label':'Comp'}], ['Laser Anneal','Deep Engrave','DataMatrix','UID','Track'])
add('/branded-custom-packaging-services', [{'value':'ISTA 2A','label':'Cert'},{'value':'ERP','label':'Trace'},{'value':'VCI','label':'Corr'}], ['CNC Foam','VCI Barriers','ISPM-15','Corr Protect'])

# Process: find each route in HERO_CONFIG (only lines matching "  '/route': {")
processed = 0
for route, (metrics, chips, compact) in data.items():
    # Build the route line exactly
    route_line = f"  '{route}': {{"
    idx = content.find(route_line)
    if idx < 0:
        print(f'  NOT FOUND: {route}')
        continue
    # Verify this is HERO_CONFIG entry (not subPageMeta) by checking context
    # HERO_CONFIG entries have 'badge:' nearby
    ctx = content[idx-200:idx]
    if 'badge:' not in ctx and 'h1:' not in ctx:
        # Might be subPageMeta - check next 50 chars after route
        after = content[idx:idx+200]
        if 'title:' in after and 'h1:' not in after:
            print(f'  SKIP (subPageMeta?): {route}')
            continue
    
    # Find next "  }," after this route line (closing the HERO_CONFIG entry)
    close_marker = '  },\n'
    close_idx = content.find(close_marker, idx)
    if close_idx < 0:
        close_marker = '  }\n'  # Maybe no trailing comma for last entry
        close_idx = content.find(close_marker, idx)
    
    if close_idx < 0:
        print(f'  NO CLOSE FOUND: {route}')
        continue
    
    # Build insertion block
    indent = '    '
    m_str = json.dumps(metrics, indent=6).replace('\n', f'\n{indent}')
    c_str = json.dumps(chips, indent=6).replace('\n', f'\n{indent}')
    
    insert = f',\n{indent}keyMetrics: {m_str},\n{indent}entityChips: {c_str}'
    if compact:
        insert += f',\n{indent}compact: true'
    insert += '\n'
    
    # Insert BEFORE the closing marker
    content = content[:close_idx] + insert + content[close_idx:]
    processed += 1
    print(f'  ADDED: {route}')

with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nDone! {processed} routes')
