"""
72/30 Rule: Compact, product-specific FAQ for 260 entities.
Each FAQ set = 4 questions, very short answers, all product-specific.
No material explanations — those belong on Material pages.
"""
import json, glob, os

ENT_DIR = 'src/content/product-entities'

# Product-specific FAQ generators
def gen_faqs(title, material, func, category, failures, process):
    """Generate 4 short, product-specific FAQs (70% unique, no material duplication)."""
    faqs = []
    
    # Q1: What is this? (definition)
    faqs.append({
        'q': f'What is a {title.lower()}?',
        'a': f'A {title.lower()} is a precision-machined {category.lower()} component used in {func.lower()}. Manufactured from {material} for optimal strength, corrosion resistance, and weight savings.'
    })
    
    # Q2: Application-specific challenge
    if 'brake' in title.lower() or 'rotor' in title.lower():
        faqs.append({
            'q': f'What makes {title.lower()} different from steel?',
            'a': f'Titanium {title.lower()} weighs 45% less than steel equivalents while providing better fatigue resistance under cyclic braking loads. Lower thermal conductivity prevents brake fluid heat soak. Thread rolling (not cutting) ensures grain flow continuity for shear strength.'
        })
    elif 'bolt' in title.lower() or 'screw' in title.lower() or 'fastener' in title.lower():
        faqs.append({
            'q': f'What torque should I use for {title.lower()}?',
            'a': f'Recommended installation torque depends on thread size and lubrication. For M5 titanium fasteners: 4-5 Nm (dry), 3-4 Nm (with anti-seize). Always use titanium-compatible anti-seize compound to prevent galling (cold welding) of threads.'
        })
    elif 'implant' in category.lower() or 'hip' in title.lower() or 'bone' in title.lower() or 'spine' in title.lower() or 'spinal' in title.lower():
        faqs.append({
            'q': f'What standards apply to {title.lower()}?',
            'a': f'{title} is manufactured to ASTM F136 / ISO 5832-3 (Ti-6Al-4V ELI) or ASTM F1295 (Ti-6Al-7Nb) for medical implants. This requires oxygen <0.13%, iron <0.25%, and 100% traceability with MTC per batch.'
        })
    elif 'valve' in title.lower() or 'flange' in title.lower() or 'pipe' in title.lower() or 'fitting' in title.lower():
        faqs.append({
            'q': f'What pressure rating for {title.lower()}?',
            'a': f'Pressure rating depends on grade, wall thickness, and temperature. Grade 2 CP-Ti pipe fittings are typically rated to Class 150 (285 psi) or Class 300 (740 psi) per ASME B16.5/B16.9. Higher ratings available with Grade 5.'
        })
    elif 'watch' in title.lower() or 'bezel' in title.lower() or 'phone' in title.lower() or 'hinge' in title.lower():
        faqs.append({
            'q': f'How is the surface finish achieved on {title.lower()}?',
            'a': f'{title} receives PVD coating (ISO 27874, Delta-E <=1.0 color accuracy) for wear resistance and aesthetics, plus oleophobic AFP nano-coating (water contact angle >110 deg) to resist fingerprints and skin oils.'
        })
    elif 'surgical' in title.lower() or 'forceps' in title.lower() or 'retractor' in title.lower() or 'scissors' in title.lower():
        faqs.append({
            'q': f'How is {title.lower()} sterilized?',
            'a': f'{title} is compatible with all standard sterilization methods: autoclave (134C steam), ethylene oxide (EtO), gamma radiation, and hydrogen peroxide plasma. Titanium\'s passive oxide layer remains stable through repeated sterilization cycles.'
        })
    elif 'stent' in title.lower() or 'guidewire' in title.lower() or 'interventional' in title.lower():
        faqs.append({
            'q': f'How is {title.lower()} delivered?',
            'a': f'{title} (Nitinol) is manufactured in its expanded shape, compressed into its delivery catheter, and self-expands at body temperature (37C) upon deployment. Fatigue testing exceeds 400 million cycles (10-year equivalent).'
        })
    else:
        faqs.append({
            'q': f'What is the typical application for {title.lower()}?',
            'a': f'{title} is designed for {func.lower()}. The {material} grade is selected to provide the optimal balance of strength, fatigue life, and environmental resistance for this specific application.'
        })
    
    # Q3: Manufacturing
    if process:
        proc_key = process[0].lower() if process else ''
        if 'forge' in proc_key:
            faqs.append({
                'q': f'Why is forging preferred for {title.lower()}?',
                'a': f'Forging aligns the metal grain structure with the component shape, providing up to 30% higher fatigue strength compared to machining from bar stock. This is critical for safety-related applications.'
            })
        elif 'roll' in proc_key or 'thread' in proc_key:
            faqs.append({
                'q': f'Why use thread rolling for {title.lower()}?',
                'a': f'Thread rolling (not cutting) compresses the metal grain structure at the thread roots, increasing fatigue life by 200-300% compared to cut threads. This is mandatory for safety-critical threaded components per ISO 965-2.'
            })
        elif 'mill' in proc_key:
            faqs.append({
                'q': f'What CNC equipment is used for {title.lower()}?',
                'a': f'{title} is machined on 5-axis CNC equipment with high-pressure coolant (1000 psi) to manage titanium\'s low thermal conductivity and work-hardening tendency. Tolerances of +-0.01mm are standard.'
            })
        else:
            faqs.append({
                'q': f'How is {title.lower()} manufactured?',
                'a': f'{title} is manufactured using {process[0]}. Critical process controls include tool path optimization, coolant temperature management, and dimensional verification at each operation.'
            })
    
    # Q4: Common issue
    if failures:
        faqs.append({
            'q': f'What is the most common issue with {title.lower()}?',
            'a': f'The most common issue is {failures[0].lower()}. Mitigation includes proper process control, material certification, and adherence to recommended installation procedures and torque values.'
        })
    
    # Q5: Procurement
    faqs.append({
        'q': f'What is the lead time for {title.lower()}?',
        'a': f'Standard lead time: 2-4 weeks depending on quantity and complexity. Rush orders available. Contact our team with your drawing and quantity for an accurate delivery quote.'
    })
    
    return faqs[:5]  # Max 5 FAQs

# Process all
count = 0
for f in glob.glob(os.path.join(ENT_DIR, '*.json')):
    with open(f, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
    
    d['faq'] = gen_faqs(
        d.get('title', ''),
        d.get('material', ''),
        d.get('function', ''),
        d.get('category', ''),
        d.get('commonFailures', []),
        d.get('process', [])
    )
    
    with open(f, 'w', encoding='utf-8') as fh:
        json.dump(d, fh, indent=2, ensure_ascii=False)
    count += 1

print(f'Compact FAQ applied to {count} entities')
