import re

with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')

# Grade data templates (same as before)
grade_data = {
    'grade-1': {
        'faqs': [
            'What is Grade 1 titanium and what are its key advantages?',
            'Grade 1 is the lowest-strength, softest, and most ductile grade in the commercially pure titanium family. It offers the highest formability and corrosion resistance among CP grades, making it ideal for applications requiring severe forming operations and exposure to corrosive environments.',
            'Can you machine and form Grade 1 titanium into complex components?',
            'Yes. Grade 1 offers excellent cold formability and can be deeply drawn without intermediate annealing. We machine Grade 1 on our CNC centers with tolerances up to ±0.005 mm, and our fabrication team performs TIG welding, laser cutting, and forming per AWS D1.6 standards.',
            'What industries commonly use Grade 1 titanium?',
            'Grade 1 is widely used in chemical processing equipment, desalination plants, heat exchangers, marine components, architectural cladding, and medical devices per ISO 5832-2.',
        ],
        'why': 'BOZE CNC Ti is a precision manufacturer of Grade 1 commercially pure titanium components for the chemical processing, desalination, marine, and architectural industries. Our facility processes certified CP-Ti Grade 1 stock with full material traceability, EN 10204 Type 3.1 MTRs, and CMM dimensional inspection.'
    },
    'grade-3': {
        'faqs': [
            'What is Grade 3 titanium and how does it compare to Grade 2?',
            'Grade 3 is a medium-strength CP titanium grade between Grade 2 and Grade 4. It offers significantly higher tensile strength than Grade 2 while maintaining good ductility and the excellent corrosion resistance of unalloyed titanium.',
            'What tolerances can you achieve on Grade 3 titanium parts?',
            'We achieve machining tolerances up to ±0.005 mm on Grade 3 CP-Titanium components using our multi-axis CNC machining centers.',
            'Which industries typically specify Grade 3 titanium?',
            'Grade 3 is used in chemical processing vessels requiring higher strength than Grade 2, marine components for offshore platforms, oil & gas production water handling, and desalination pump housings.',
        ],
        'why': 'BOZE CNC Ti manufactures precision Grade 3 CP-Titanium components for industrial applications. Our facility processes certified stock through multi-axis CNC machining and fabrication, backed by full material traceability with EN 10204 Type 3.1 MTRs.'
    },
    'grade-4': {
        'faqs': [
            'What is Grade 4 titanium and what makes it the strongest CP grade?',
            'Grade 4 is the highest-strength grade in the CP titanium family, with increased oxygen content providing higher tensile and yield strengths while retaining excellent corrosion resistance.',
            'What machining capabilities do you offer for Grade 4 titanium?',
            'We machine Grade 4 on 5-axis CNC centers with tolerances up to ±0.005 mm. Grade 4 work-hardens rapidly, so we use sharp carbide tooling with high-pressure coolant.',
            'What are primary applications for Grade 4 titanium?',
            'Grade 4 is used in medical implants per ASTM F67, surgical instruments, heat exchanger tubing, chemical processing equipment, marine fasteners, and automotive components.',
        ],
        'why': 'BOZE CNC Ti delivers precision-machined Grade 4 CP-Titanium components for medical, marine, and industrial applications with full material traceability and CMM verification.'
    },
    'grade-4-eli': {
        'faqs': [
            'What is ELI Grade 4 titanium?',
            'ELI Grade 4 is a modified version of standard CP-Ti Grade 4 with strictly controlled lower limits of interstitial elements, delivering significantly improved ductility and fracture toughness.',
            'What medical applications use ELI Grade 4?',
            'ELI Grade 4 is preferred for trauma plates, bone screws, spinal fixation hardware, dental implants, and surgical instruments.',
            'What certifications do you provide for ELI Grade 4?',
            'Each order includes EN 10204 Type 3.1 MTRs per ASTM F67 ELI, CMM inspection, surface finish measurements, and passivation certification per ASTM F86.',
        ],
        'why': 'BOZE CNC Ti is a medical-grade manufacturer of ELI Grade 4 components. Our ISO 13485 facility processes certified ASTM F67 ELI material with full traceability from certified mill sources.'
    },
    'grade-6': {
        'faqs': [
            'What is Grade 6 titanium (Ti-5Al-2.5Sn)?',
            'Grade 6 is a near-alpha titanium alloy offering excellent elevated-temperature strength, oxidation resistance, and creep performance up to 480°C.',
            'What aerospace applications use Grade 6?',
            'Grade 6 is used in gas turbine engine components, airframe structures near engine nacelles, high-temperature fasteners, and rocket components.',
            'Can you machine and weld Grade 6 titanium?',
            'Yes. We machine Grade 6 on multi-axis CNC centers and perform TIG welding. Post-weld heat treatment is typically required to restore properties.',
        ],
        'why': 'BOZE CNC Ti manufactures precision Grade 6 components for aerospace and high-temperature applications with AS9100D quality systems and NADCAP NDT.'
    },
    'grade-9': {
        'faqs': [
            'What is Grade 9 titanium (Ti-3Al-2.5V)?',
            'Grade 9 is a medium-strength alpha-beta alloy offering an excellent balance of strength and formability, making it the standard for aerospace hydraulic tubing.',
            'What tube capabilities do you offer for Grade 9?',
            'We process Grade 9 tubing through CNC bending, orbital TIG welding, and laser cutting with tube diameters from 6 mm to 220 mm.',
            'What industries use Grade 9 titanium?',
            'Grade 9 is used in aerospace hydraulic systems, chemical processing tubing, bicycle frames, automotive exhaust, and marine piping.',
        ],
        'why': 'BOZE CNC Ti specializes in Grade 9 titanium tubing assemblies and machined components with full material traceability and AS9100D quality systems.'
    },
    'grade-19': {
        'faqs': [
            'What is Grade 19 beta titanium (Ti-10V-2Fe-3Al)?',
            'Grade 19 is a beta-rich titanium alloy designed for high-strength forgings with deep hardenability for thick-section aerospace components.',
            'What strengths can Grade 19 achieve?',
            'Grade 19 achieves tensile strengths up to 1,240 MPa with good fracture toughness through solution treatment and aging.',
            'What processing for Grade 19?',
            'We offer precision forging, 5-axis CNC machining, and vacuum heat treatment per AMS 2750F Class 2.',
        ],
        'why': 'BOZE CNC Ti manufactures Grade 19 beta titanium components for aerospace and defense with AS9100D certification and NADCAP NDT.'
    },
    'grade-21': {
        'faqs': [
            'What is Grade 21 beta titanium (Ti-15V-3Cr-3Sn-3Al)?',
            'Grade 21 is a metastable beta alloy offering exceptional cold formability in the solution-treated condition, then aging to over 1,170 MPa.',
            'What applications benefit from Grade 21?',
            'Grade 21 is ideal for aerospace sheet metal structures, honeycomb panels, aircraft springs, and high-strength fasteners.',
            'Can you form Grade 21 titanium?',
            'Yes. In solution-treated condition it forms like CP titanium. After forming we perform vacuum aging to achieve full strength.',
        ],
        'why': 'BOZE CNC Ti manufactures Grade 21 beta titanium components for aerospace with precision forming, vacuum heat treatment, and AS9100D quality systems.'
    },
    'grade-6242': {
        'faqs': [
            'What is Grade 6242 titanium (Ti-6Al-2Sn-4Zr-2Mo)?',
            'Grade 6242 is a near-alpha titanium alloy designed for service up to 540°C with exceptional creep resistance for gas turbine engines.',
            'What engine components use Grade 6242?',
            'Grade 6242 is used for compressor disks, blades, stators, and casings in gas turbine engines.',
            'What processing for Grade 6242?',
            'We offer precision forging, 5-axis CNC machining, and vacuum heat treatment per AMS 2750F Class 2.',
        ],
        'why': 'BOZE CNC Ti delivers Grade 6242 components for gas turbine engines with AS9100D quality systems and NADCAP NDT inspection.'
    },
}

# Process each grade
for grade_key in grade_data:
    g_pos = content.find(f'"{grade_key}"', data_start)
    if g_pos == -1:
        print(f'{grade_key}: NOT FOUND')
        continue
    
    # Get the section from this grade to the next
    # Find next grade key after this position
    data = grade_data[grade_key]
    
    # Find alternativeTo section
    alt_start = content.find('alternativeTo', g_pos)
    if alt_start == -1:
        print(f'{grade_key}: no alternativeTo section')
        continue
    
    # Find items: [ within alternativeTo
    items_start = content.find('items: [', alt_start)
    if items_start == -1:
        print(f'{grade_key}: no items in alternativeTo')
        continue
    
    # Find closing ] of items array
    items_close = content.find(']', items_start)
    if items_close == -1:
        print(f'{grade_key}: no items close bracket')
        continue
    
    # Check if already has faqs
    if 'faqs:' in content[alt_start:alt_start+1000]:
        print(f'{grade_key}: already has faqs')
        continue
    
    # Build insert text
    faq_items = data['faqs']
    faq_pairs = []
    for i in range(0, len(faq_items), 2):
        q = faq_items[i]
        a = faq_items[i+1]
        faq_pairs.append(f'      {{ question: "{q}", answer: "{a}" }}')
    
    faq_block = ',\n'.join(faq_pairs)
    why_text = data['why']
    
    insert_text = f''',
    faqs: [
{faq_block}
    ],
    whyChooseUs: "{why_text}"
'''
    
    # Insert after the items close bracket
    before = content[:items_close+1]
    after = content[items_close+1:]
    content = before + insert_text + after
    print(f'{grade_key}: AIO fields added')

with open('src/data/titanium-grades.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('All done!')
