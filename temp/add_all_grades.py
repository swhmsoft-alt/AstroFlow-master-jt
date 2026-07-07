import re, sys

with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')

# Templates for each grade type
grade_data = {
    'grade-1': {
        'faqs': [
            {'q': 'What is Grade 1 titanium and what are its key advantages?', 'a': 'Grade 1 is the lowest-strength, softest, and most ductile grade in the commercially pure titanium family. It offers the highest formability and corrosion resistance among CP grades, making it ideal for applications requiring severe forming operations and exposure to corrosive environments such as chemical processing and desalination.'},
            {'q': 'Can you machine and form Grade 1 titanium into complex components?', 'a': 'Yes. Grade 1 offers excellent cold formability and can be deeply drawn or severely formed without intermediate annealing. We machine Grade 1 on our CNC centers with tolerances up to ±0.005 mm, and our fabrication team performs TIG welding, laser cutting, and bending per AWS D1.6 standards.'},
            {'q': 'What industries commonly use Grade 1 titanium components?', 'a': 'Grade 1 is widely used in chemical processing equipment, desalination plants, heat exchangers, marine components, architectural cladding, and medical devices (non-load-bearing implants per ISO 5832-2).'},
        ],
        'why': 'BOZE CNC Ti is a precision manufacturer of Grade 1 commercially pure titanium components for the chemical processing, desalination, marine, and architectural industries. Our facility processes certified CP-Ti Grade 1 stock through CNC machining, precision forming, TIG welding, and custom fabrication. Every component is backed by full material traceability, EN 10204 Type 3.1 MTRs, and CMM dimensional inspection.'
    },
    'grade-3': {
        'faqs': [
            {'q': 'What is Grade 3 titanium and how does it compare to Grade 2?', 'a': 'Grade 3 is a medium-strength commercially pure titanium grade positioned between Grade 2 and Grade 4 in the CP family. It offers significantly higher tensile strength than Grade 2 while maintaining good ductility and the excellent corrosion resistance characteristic of unalloyed titanium.'},
            {'q': 'What tolerances can you achieve on Grade 3 titanium machined parts?', 'a': 'We consistently achieve machining tolerances up to ±0.005 mm (±0.0002 in) on Grade 3 CP-Titanium components using our multi-axis CNC machining centers. Grade 3 machines similarly to other CP grades with good chip control and surface finish.'},
            {'q': 'Which industries typically specify Grade 3 titanium?', 'a': 'Grade 3 is commonly used in chemical processing vessels and piping requiring higher strength than Grade 2, marine components for offshore platforms, oil & gas production water handling, desalination pump housings, and structural components in coastal infrastructure.'},
        ],
        'why': 'BOZE CNC Ti manufactures precision Grade 3 commercially pure titanium components for demanding industrial applications. Our facility processes certified CP-Ti Grade 3 stock through multi-axis CNC machining, precision turning, and custom fabrication, backed by full material traceability with EN 10204 Type 3.1 MTRs and CMM dimensional inspection.'
    },
    'grade-4': {
        'faqs': [
            {'q': 'What is Grade 4 titanium and what makes it the strongest CP grade?', 'a': 'Grade 4 is the highest-strength grade in the commercially pure titanium family, with increased oxygen content (up to 0.40%) providing higher tensile and yield strengths while retaining excellent corrosion resistance. It is often specified for applications demanding maximum strength within the CP series.'},
            {'q': 'What machining capabilities do you offer for Grade 4 titanium?', 'a': 'We machine Grade 4 CP-Titanium on our 5-axis CNC machining centers and precision turning machines, achieving tolerances up to ±0.005 mm. Grade 4 work-hardens more rapidly than lower CP grades, so our machining strategies use sharp carbide tooling with high-pressure coolant.'},
            {'q': 'What are the primary applications for Grade 4 titanium?', 'a': 'Grade 4 is used in medical implants per ASTM F67, surgical instruments, heat exchanger tubing requiring higher strength, chemical processing equipment, marine fasteners and fittings, and automotive performance components.'},
        ],
        'why': 'BOZE CNC Ti delivers precision-machined Grade 4 commercially pure titanium components for medical, marine, and industrial applications. Our facility processes certified CP-Ti Grade 4 stock with full material traceability, EN 10204 Type 3.1 MTRs, and CMM dimensional verification. Our engineering team provides 24-hour DFM review for your critical components.'
    },
    'grade-4-eli': {
        'faqs': [
            {'q': 'What is ELI Grade 4 titanium and how is it different from standard Grade 4?', 'a': 'ELI (Extra Low Interstitial) Grade 4 is a modified version of standard CP-Ti Grade 4 with strictly controlled lower limits of interstitial elements — oxygen, nitrogen, carbon, and hydrogen. This controlled chemistry delivers significantly improved ductility, fracture toughness, and fatigue properties while maintaining strength near standard Grade 4 levels.'},
            {'q': 'What medical applications use ELI Grade 4 titanium?', 'a': 'ELI Grade 4 is preferred for implantable medical devices requiring high reliability, including trauma plates, bone screws, spinal fixation hardware, dental implants and abutments, and surgical instruments demanding high toughness.'},
            {'q': 'What certifications do you provide for ELI Grade 4 medical components?', 'a': 'Each medical order includes EN 10204 Type 3.1 MTRs per ASTM F67 ELI requirements, CMM dimensional inspection, surface finish measurements, and passivation certification per ASTM F86. Full batch traceability and DHR documentation are available.'},
        ],
        'why': 'BOZE CNC Ti is a medical-grade precision manufacturer of ELI Grade 4 titanium components for orthopedic, dental, and surgical applications. Our ISO 13485-compliant facility processes certified ASTM F67 ELI material through Swiss-type CNC turning and 5-axis milling, with surface finishing per ASTM F86 and full material traceability from certified mill sources.'
    },
    'grade-6': {
        'faqs': [
            {'q': 'What is Grade 6 titanium (Ti-5Al-2.5Sn) and what are its key properties?', 'a': 'Grade 6 (Ti-5Al-2.5Sn) is a near-alpha titanium alloy stabilized with 5% aluminum and 2.5% tin. It offers excellent elevated-temperature strength, oxidation resistance, and creep performance up to 480°C (900°F), along with superior weldability compared to alpha-beta alloys.'},
            {'q': 'What aerospace applications use Grade 6 titanium?', 'a': 'Grade 6 is used in gas turbine engine components such as compressor cases and stators, airframe structures near engine nacelles, high-temperature fasteners, rocket and missile components exposed to aerodynamic heating, and elevated-temperature chemical processing equipment.'},
            {'q': 'Can you machine and weld Grade 6 titanium?', 'a': 'Yes. We machine Grade 6 on our multi-axis CNC centers and perform TIG welding with appropriate filler metals. Grade 6 offers good machinability for an alpha alloy. Post-weld heat treatment is typically required to restore mechanical properties.'},
        ],
        'why': 'BOZE CNC Ti manufactures precision Grade 6 (Ti-5Al-2.5Sn) components for aerospace and high-temperature applications. Our AS9100D-certified facility processes certified stock through 5-axis CNC machining, heat treatment, and NADCAP NDT inspection, with full material traceability and CMM dimensional verification.'
    },
    'grade-9': {
        'faqs': [
            {'q': 'What is Grade 9 titanium (Ti-3Al-2.5V) and what makes it unique?', 'a': 'Grade 9 (Ti-3Al-2.5V) is a medium-strength alpha-beta titanium alloy offering an excellent balance of strength and formability. Also known as "half 6-4," it is significantly more formable than Grade 5 while offering higher strength than CP grades, making it the standard for aerospace hydraulic tubing.'},
            {'q': 'What tube and pipe capabilities do you offer for Grade 9 titanium?', 'a': 'We process Grade 9 titanium tubing through CNC bending, orbital TIG welding, laser cutting, and hydroforming. Our capabilities include tube diameters from 6 mm to 220 mm with tight bend radii. Hydrostatic testing and helium leak testing are available.'},
            {'q': 'What industries commonly use Grade 9 titanium?', 'a': 'Grade 9 is widely used in aerospace hydraulic and pneumatic systems, chemical processing instrumentation tubing, bicycle frames and sporting goods, automotive exhaust systems, marine seawater piping, and oil & gas control line tubing.'},
        ],
        'why': 'BOZE CNC Ti is a precision manufacturer of Grade 9 (Ti-3Al-2.5V) titanium components, specializing in aerospace tubing assemblies, formed sheet metal parts, and machined components. Our facility processes certified Grade 9 stock with full material traceability, AS9100D quality systems, and comprehensive NDT inspection capabilities.'
    },
    'grade-19': {
        'faqs': [
            {'q': 'What is Grade 19 beta titanium (Ti-10V-2Fe-3Al)?', 'a': 'Grade 19 (Ti-10V-2Fe-3Al) is a beta-rich titanium alloy specifically designed for high-strength forged components. It offers deep hardenability enabling uniform mechanical properties through thick sections — a critical advantage over alpha-beta alloys for heavy-section landing gear and airframe components.'},
            {'q': 'What strengths can Grade 19 titanium achieve?', 'a': 'Grade 19 achieves tensile strengths up to 1,240 MPa (180 ksi) with good fracture toughness. This combination of deep hardenability and high strength makes it ideal for critical aerospace structural forgings where through-section property uniformity is essential.'},
            {'q': 'What forging and machining capabilities do you offer for Grade 19?', 'a': 'We perform precision forging and CNC machining of Grade 19 titanium, with vacuum heat treatment (solution treat and age) per AMS 2750F Class 2. Our 5-axis machining centers achieve tolerances up to ±0.005 mm on post-forge machined surfaces.'},
        ],
        'why': 'BOZE CNC Ti is a precision manufacturer of Grade 19 (Ti-10V-2Fe-3Al) beta titanium components for aerospace and defense applications. Our AS9100D-certified facility offers closed-die forging, precision CNC machining, and vacuum heat treatment per AMS 2750F, with full material traceability and NADCAP NDT inspection.'
    },
    'grade-21': {
        'faqs': [
            {'q': 'What is Grade 21 beta titanium (Ti-15V-3Cr-3Sn-3Al)?', 'a': 'Grade 21 (Ti-15V-3Cr-3Sn-3Al, also known as Ti-15-3) is a metastable beta titanium alloy designed for applications requiring exceptional room-temperature formability combined with very high strength after aging. In the solution-treated condition it can be cold formed like CP titanium, then aged to over 1,170 MPa (170 ksi).'},
            {'q': 'What applications benefit from Grade 21 titanium?', 'a': 'Grade 21 is ideal for aerospace sheet metal structures requiring complex forming, honeycomb sandwich panels, aircraft springs, high-strength fasteners, missile skin panels, lightweight armor, and automotive suspension components.'},
            {'q': 'Can you form and machine Grade 21 titanium?', 'a': 'Yes. In the solution-treated condition, Grade 21 offers exceptional cold formability similar to CP titanium. After forming, we perform vacuum aging to achieve full strength. Our 5-axis CNC centers machine Grade 21 in both ST and aged conditions with tolerances up to ±0.005 mm.'},
        ],
        'why': 'BOZE CNC Ti manufactures precision Grade 21 (Ti-15V-3Cr-3Sn-3Al) beta titanium components for aerospace and high-performance applications. Our facility specializes in forming complex sheet metal geometries followed by vacuum heat treatment and precision CNC machining, with full material traceability and AS9100D quality systems.'
    },
    'grade-6242': {
        'faqs': [
            {'q': 'What is Grade 6242 titanium (Ti-6Al-2Sn-4Zr-2Mo)?', 'a': 'Grade 6242 (Ti-6Al-2Sn-4Zr-2Mo, also known as Ti-6242) is a near-alpha titanium alloy designed for high-temperature service up to 540°C (1,000°F). It combines the alpha-phase strength from aluminum and tin with solid-solution strengthening from zirconium and molybdenum for exceptional creep resistance.'},
            {'q': 'What gas turbine engine components use Grade 6242?', 'a': 'Grade 6242 is used for compressor disks, blades, stators, and casings in gas turbine engines, where it operates at significantly higher temperatures than Ti-6Al-4V. It is also used in airframe structures for high-speed aircraft and rocket engine turbopump components.'},
            {'q': 'What processing capabilities do you offer for Grade 6242?', 'a': 'We process Grade 6242 through precision forging, 5-axis CNC machining, and vacuum heat treatment per aerospace specifications. Our vacuum furnaces provide controlled atmosphere processing at up to 1,100°C per AMS 2750F Class 2.'},
        ],
        'why': 'BOZE CNC Ti delivers precision-machined Grade 6242 (Ti-6Al-2Sn-4Zr-2Mo) components for gas turbine engines and high-speed aerospace structures. Our AS9100D-certified facility offers forging, 5-axis CNC machining, vacuum heat treatment per AMS 2750F, and NADCAP NDT inspection with full material traceability.'
    },
}

# Also add ti-5553 (special entry, not "grade-" prefix)
grade_data['ti-5553'] = {
    'faqs': [
        {'q': 'What is Ti-5Al-5V-5Mo-3Cr (Ti-5553) high-strength titanium?', 'a': 'Ti-5Al-5V-5Mo-3Cr, commonly known as Ti-5553, is a metastable beta titanium alloy developed as a successor to Ti-10V-2Fe-3Al (Grade 19). It offers excellent through-hardenability in thick sections up to 150 mm, combined with strengths up to 1,310 MPa (190 ksi) and superior fracture toughness.'},
        {'q': 'What aerospace applications use Ti-5553?', 'a': 'Ti-5553 is increasingly specified for large landing gear forgings, airframe structural components, helicopter rotor components, and high-strength fasteners in next-generation aircraft programs. Its deep hardenability makes it ideal for heavy-section structural forgings.'},
        {'q': 'What processing capabilities do you have for Ti-5553?', 'a': 'We offer precision forging, 5-axis CNC machining, and vacuum heat treatment (solution treat and age) for Ti-5553 components. Our AS9100D-compliant facility provides full material traceability, CMM dimensional verification, and NADCAP NDT inspection.'},
    ],
    'why': 'BOZE CNC Ti is a precision manufacturer of Ti-5Al-5V-5Mo-3Cr (Ti-5553) high-strength beta titanium components for aerospace landing gear and structural applications. Our AS9100D-certified facility offers precision forging, 5-axis CNC machining, and vacuum heat treatment with full material traceability and NADCAP NDT inspection.'
}

# For each grade that doesn't have faqs yet, add them
for grade_key in grade_data:
    # Find the grade in the DATA section
    g_pos = content.find(f'"{grade_key}"', data_start)
    if g_pos == -1:
        print(f'{grade_key}: NOT FOUND')
        continue
    
    # Check if already has faqs
    end_section = content.find(f'"grade-', g_pos + len(grade_key) + 5)
    if end_section == -1:
        end_section = len(content)
    
    section = content[g_pos:end_section]
    if 'faqs:' in section:
        print(f'{grade_key}: already has faqs, skipping')
        continue
    
    # Find the closing of alternativeTo (last items array)
    last_items = section.rfind('items: [')
    if last_items == -1:
        print(f'{grade_key}: no items array found')
        continue
    
    last_close = section.rfind(']', last_items)
    if last_close == -1:
        print(f'{grade_key}: no items closing bracket')
        continue
    
    # Find the closing brace + comma of the grade entry
    close_pattern = ']'
    insert_at = g_pos + last_close + 1  # after the ]
    
    data_info = grade_data[grade_key]
    # Build FAQ text
    faq_items = data_info['faqs']
    why_text = data_info['why']
    
    faq_lines = []
    for item in faq_items:
        faq_lines.append(f'      {{ question: "{item["q"]}", answer: "{item["a"]}" }}')
    
    faq_block = ',\n'.join(faq_lines)
    
    insert_text = f'''
    }},
    faqs: [{faq_block}
    ],
    whyChooseUs: "{why_text}"
  '''
    
    # Insert after the closing bracket of the items array
    before = content[:insert_at]
    after = content[insert_at:]
    
    # Need to handle the fact that after the ] there's usually \n    }
    # We need to replace that pattern with our new content
    if after.startswith('\n    }'):
        content = before + insert_text + after
    else:
        # Just append after ]
        content = before + insert_text + after
    
    print(f'{grade_key}: AIO fields added')

with open('src/data/titanium-grades.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('\nAll done!')
