import json, os, re

# Read the TS file
with open('src/data/titanium-standards.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Category templates
astm_props = '[{label: "Applicable Standard Edition", value: "Latest ASTM Revision"},{label: "Tensile Strength (min)", value: "240-950 MPa (Grade Dependent)"},{label: "Yield Strength 0.2% (min)", value: "170-880 MPa (Grade Dependent)"},{label: "Elongation (min)", value: "10-24% (Grade Dependent)"},{label: "Available Diameter Range", value: "Ø3 mm - Ø500 mm"},{label: "Length Range", value: "Up to 6,000 mm"}]'
astm_faqs = '[{question: "What titanium grades does this standard cover?", answer: "This standard covers Grades 1 through 23 and specialty titanium alloys, including CP-Ti grades (1-4) and alloyed grades such as Grade 5 (Ti-6Al-4V) and Grade 23 (Ti-6Al-4V ELI). The specific grade determines mechanical properties and applicable industries."},{question: "Can you machine certified material into custom parts?", answer: "Yes. We source 100% certified material and utilize multi-axis CNC milling, turning, and wire EDM to transform raw stock into precision-engineered components per your drawings. Full material traceability with MTRs is provided with every order."},{question: "What tolerance can you achieve on machined titanium components?", answer: "We consistently hold machining tolerances up to ±0.005 mm (±0.0002 in) on CNC milling and turning operations, verified by CMM dimensional inspection reports."}]'
astm_why = '"At BOZE CNC Ti, we combine decades of metallurgical expertise with a fully integrated manufacturing facility to deliver precision components that meet the strictest requirements of this standard. Our advantage lies in three pillars: (1) Certified Material Sourcing — every batch is verified with PMI/OES spectrometry and accompanied by EN 10204 Type 3.1 MTRs; (2) Advanced Multi-Axis Machining — our 5-axis DMG Mori and Mazak centers achieve tolerances up to ±0.005 mm with surface finishes down to Ra 0.4 µm; (3) Full-Spectrum Quality Assurance — from in-house CMM inspection to NADCAP-compliant NDT, every component is documented and traceable from mill to finished part."'

ams_props = '[{label: "Applicable Standard Edition", value: "Latest AMS Revision"},{label: "Tensile Strength (min)", value: "895-1,170 MPa (Grade 5)"},{label: "Yield Strength 0.2% (min)", value: "825-1,100 MPa (Grade 5)"},{label: "Elongation (min)", value: "8-10% (Grade 5)"},{label: "Hardness (HRC)", value: "32-39 (Grade 5, annealed)"},{label: "Available Thickness Range", value: "0.5 mm - 150 mm"}]'
ams_faqs = '[{question: "What is the difference between AMS and ASTM standards?", answer: "AMS (Aerospace Material Specifications) are published by SAE International and carry stricter chemical composition limits, tighter mechanical property ranges, and more rigorous testing requirements than general ASTM standards. AMS specifications are mandatory for aerospace critical components."},{question: "Does your facility hold the certifications needed for aerospace work?", answer: "Yes. We are AS9100D certified with NADCAP-accepted NDT processes. Our heat treatment is performed to AMS 2750F Class 2 pyrometry standards. Full material traceability and first article inspection reports per AS9102 are provided with every aerospace order."},{question: "Can you machine thin-gauge aerospace titanium without distortion?", answer: "Yes. Our 5-axis machining centers with high-pressure coolant systems and advanced workholding strategies minimize heat input and mechanical stress, preventing distortion on thin-gauge aerospace sheet and plate components down to 0.5 mm thickness."}]'
ams_why = '"BOZE CNC Ti is a trusted partner for aerospace and defense manufacturers, combining AS9100D-certified quality systems with deep metallurgical expertise across all AMS-specified titanium alloys. Our manufacturing floor is equipped with 5-axis simultaneous machining centers, vacuum heat treatment furnaces (AMS 2750F Class 2), and CMM inspection capabilities that meet the most stringent aerospace requirements. Every component we ship is backed by full material traceability, AS9102 first article inspection, and NADCAP-accepted NDT reports."'

med_props = '[{label: "Applicable Standard Edition", value: "Latest ISO/ASTM Revision"},{label: "Tensile Strength (min)", value: "860-950 MPa (Grade 23/5)"},{label: "Yield Strength 0.2% (min)", value: "795-880 MPa (Grade 23/5)"},{label: "Elongation (min)", value: "10-15% (Grade 23/5 ELI)"},{label: "Surface Finish (implants)", value: "Ra 0.1-0.2 µm"},{label: "Biocompatibility", value: "ISO 10993 Compliant"}]'
med_faqs = '[{question: "What makes medical-grade titanium different from commercial grades?", answer: "Medical-grade titanium (ASTM F136 / ISO 5832-3) uses Extra Low Interstitial (ELI) chemistry with tightly controlled oxygen, nitrogen, and carbon limits. This delivers superior fracture toughness, fatigue resistance, and biocompatibility required for implantable devices."},{question: "Do you manufacture implants in a controlled environment?", answer: "Yes. Our medical-grade manufacturing follows ISO 13485 quality systems. Surface finishing per ASTM F86, passivation, cleaning, and UDI laser marking are performed under strict process controls with full batch traceability."},{question: "What documentation comes with medical device components?", answer: "Each order includes EN 10204 Type 3.1 Material Test Reports, CMM dimensional inspection reports, surface finish measurements, and passivation certification. UDI-compliant labeling and DHR traceability are available for FDA/ISO 13485 compliance."}]'
med_why = '"BOZE CNC Ti delivers precision medical components trusted by leading orthopedic, dental, and surgical device manufacturers. Our ISO 13485-certified quality management system governs every stage — from certified ASTM F136/ISO 5832 material sourcing through Swiss-type CNC turning and 5-axis milling to final passivation and UDI laser marking. We specialize in complex geometries: bone screws, spinal implants, surgical instruments, and custom prosthetics, all produced with full material traceability and biocompatibility documentation."'

add_props = '[{label: "Applicable Standard Edition", value: "Latest ASTM Revision"},{label: "Tensile Strength (as-built, stress-relieved)", value: "≥950 MPa (Grade 5)"},{label: "Yield Strength 0.2% (as-built)", value: "≥860 MPa (Grade 5)"},{label: "Elongation (as-built)", value: "≥8% (Grade 5)"},{label: "Maximum Build Volume", value: "250 × 250 × 300 mm"},{label: "Layer Thickness", value: "20-60 µm"},{label: "Post-Machined Surface Finish", value: "Ra 0.4-0.8 µm"}]'
add_faqs = '[{question: "What additive manufacturing process do you use for titanium?", answer: "We use Selective Laser Melting (SLM) with Yb-fiber laser sources. This powder bed fusion process builds fully dense (>99.5%) Ti-6Al-4V components layer by layer from certified spherical powder feedstocks per ASTM F2924/F3001."},{question: "Can you combine additive with CNC machining?", answer: "Absolutely. We offer a hybrid workflow: SLM near-net-shape printing followed by 5-axis CNC post-machining for critical surfaces, threaded features, and tight-tolerance mating interfaces. This combines design freedom with precision tolerances."},{question: "What post-processing do you perform on additively manufactured parts?", answer: "Standard post-processing includes stress-relief vacuum heat treatment (per AMS 2750F), Hot Isostatic Pressing (HIP) for porosity closure, support removal, CNC post-machining, and surface finishing. Full mechanical property validation per ASTM F2924/F3001 is provided."}]'
add_why = '"BOZE CNC Ti offers end-to-end additive manufacturing solutions that combine the design freedom of SLM with the precision of traditional CNC machining. Our workflow begins with certified Ti-6Al-4V powder feedstocks and continues through build optimization, vacuum heat treatment, HIP, and 5-axis CNC post-machining. Every component is validated with mechanical test reports, CMM inspection, and CT scanning for internal structure verification when required."'

# Mapping of entries to categories
entry_map = {
    'astm-b348': 'astm', 'astm-b265': 'astm', 'astm-b381': 'astm',
    'astm-b338': 'astm', 'astm-b861': 'astm',
    'astm-f67': 'med', 'astm-f136': 'med', 'astm-f86': 'med',
    'iso-5832-3': 'med', 'iso-5832-11': 'med',
    'astm-f2924': 'add', 'astm-f3001': 'add',
    'ams-4911': 'ams', 'ams-4928': 'ams', 'ams-4943': 'ams',
    'ams-4944': 'ams', 'ams-2488': 'ams', 'mil-t-9047': 'ams',
}

category_templates = {
    'astm': {'props': astm_props, 'faqs': astm_faqs, 'why': astm_why},
    'ams': {'props': ams_props, 'faqs': ams_faqs, 'why': ams_why},
    'med': {'props': med_props, 'faqs': med_faqs, 'why': med_why},
    'add': {'props': add_props, 'faqs': add_faqs, 'why': add_why},
}

# For each entry, find its ctaDescription line and add the new fields after it
for entry_key, cat_key in entry_map.items():
    cat = category_templates[cat_key]
    search = f'ctaDescription: "{entry_key.replace("-", " ")}'  
    # We need to find the unique pattern for each entry
    # Actually, let's find by key name and then locate the ctaDescription line
    
# Find each entry and add fields
for entry_key, cat_key in entry_map.items():
    cat = category_templates[cat_key]
    
    # Build the fields block
    fields_block = f'''technicalProperties: {cat["props"]},
  faqs: {cat["faqs"]},
  whyChooseUs: {cat["why"]},'''
    
    # Insert after ctaDescription line for this entry
    # Find the entry marker
    marker = f'"{entry_key}":'
    pos = content.find(marker)
    if pos == -1:
        print(f'{entry_key}: NOT FOUND')
        continue
    
    # From the entry, find the ctaDescription line
    entry_start = content[:pos].rfind('  },\n')
    if entry_start == -1:
        entry_start = pos
    entry_section = content[pos:pos+3000]
    
    # Find ctaDescription: in this section
    cta_pos = entry_section.rfind('ctaDescription:')
    if cta_pos == -1:
        print(f'{entry_key}: ctaDescription not found')
        continue
    
    # Find the end of the ctaDescription line (the comma + newline after it)
    line_end = entry_section.find(',\n', cta_pos)
    if line_end == -1:
        line_end = entry_section.find('\n', cta_pos)
    
    # Calculate absolute position
    abs_insert = pos + line_end + 2  # after the comma + newline
    
    # Insert the fields
    before = content[:abs_insert]
    after = content[abs_insert:]
    
    # Check if already has technicalProperties
    if 'technicalProperties:' in entry_section[:cta_pos + 100]:
        print(f'{entry_key}: already has AIO fields, skipping')
        continue
    
    content = before + '\n    ' + fields_block + '\n  ' + after
    print(f'{entry_key}: added AIO fields')

with open('src/data/titanium-standards.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('\nAll done!')
