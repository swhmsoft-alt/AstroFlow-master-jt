"""
FAQ Seed Script
Generates engineering FAQ content for each Product Entity based on its data fields.
"""
import json, glob, os, random

ENT_DIR = 'src/content/product-entities'

def generate_faqs(entity):
    """Generate relevant FAQ items from entity data."""
    d = entity
    title = d['title']
    material = d.get('material', 'titanium')
    process = d.get('process', [])
    failures = d.get('commonFailures', [])
    alloy_reason = d.get('alloyReason', '')
    inspection = d.get('inspection', [])
    standards = d.get('standards', [])
    
    faqs = []
    
    # FAQ 1: Why titanium?
    if alloy_reason:
        faqs.append({
            'q': f'Why use titanium for {title.lower()}?',
            'a': alloy_reason[:300]
        })
    
    # FAQ 2: Manufacturing process
    if process:
        process_list = '; '.join(process[:4])
        faqs.append({
            'q': f'How is a {title.lower()} manufactured?',
            'a': f'A typical {title.lower()} is manufactured using {process_list}. Each step is critical to achieving the required mechanical properties and dimensional tolerances.'
        })
    
    # FAQ 3: Material alternatives
    mat_alternatives = {
        'Grade 5': 'Stainless steel (heavier, less fatigue life), aluminum (lower strength)',
        'Grade 2': 'Stainless steel (corrosion risk), carbon steel (rapid rusting), plastic (low strength)',
        'Grade 23': 'Standard Grade 5 (higher iron content, lower fracture toughness), Co-Cr alloy (stiffer, stress shielding)',
        'Nitinol': 'Stainless steel (no superelasticity), polymer (insufficient strength)',
    }
    alt = 'Other materials such as steel or aluminum are significantly heavier and lack the corrosion resistance required for long-term service.'
    for k, v in mat_alternatives.items():
        if k.lower() in material.lower():
            alt = v
            break
    faqs.append({
        'q': f'What are the alternatives to {material} for {title.lower()}?',
        'a': alt
    })
    
    # FAQ 4: Standards
    if standards:
        stds = ', '.join(standards[:3])
        faqs.append({
            'q': f'What standards apply to {title.lower()}?',
            'a': f'{title} components are typically manufactured to {stds}. Additional customer-specific specifications may apply depending on the application and regulatory requirements.'
        })
    
    # FAQ 5: Common failures
    if failures:
        fail_list = '; '.join(failures[:2])
        faqs.append({
            'q': f'What are common failure modes for {title.lower()}?',
            'a': f'Common failure modes include {fail_list}. Proper material selection, manufacturing process control, and inspection mitigate these risks.'
        })
    else:
        faqs.append({
            'q': f'What are common failure modes for {title.lower()}?',
            'a': f'With proper material selection (Grade 5 Ti-6Al-4V) and manufacturing process control (thread rolling, heat treatment), titanium {title.lower()} components exhibit excellent fatigue life and corrosion resistance in service.'
        })
    
    # FAQ 6: Surface treatment
    st = d.get('surfaceTreatment', [])
    if st:
        st_list = ', '.join(st[:2])
        faqs.append({
            'q': f'What surface treatments are available for {title.lower()}?',
            'a': f'Common surface treatments include {st_list}. These enhance corrosion resistance, wear properties, and aesthetic appearance.'
        })
    
    # FAQ 7: Inspection
    if inspection:
        insp_list = '; '.join(inspection[:3])
        faqs.append({
            'q': f'How is {title.lower()} inspected for quality?',
            'a': f'Inspection typically includes {insp_list}. Every batch is verified to ensure compliance with dimensional tolerances and material specifications.'
        })
    
    # FAQ 8: Typical applications
    category = d.get('category', '')
    if category:
        faqs.append({
            'q': f'What are typical applications for {title.lower()}?',
            'a': f'{title} is commonly used in {category.lower()} applications within the {d.get("industry", "")} industry. The exact application determines specific material grade and processing requirements.'
        })
    
    # FAQ 9: RFQ requirements
    faqs.append({
        'q': f'What information is needed to request a quote for {title.lower()}?',
        'a': f'To request a quote, please provide: 1) 2D drawing or 3D CAD model with dimensions and tolerances, 2) Quantity and delivery schedule, 3) Material specification (if other than standard), 4) Surface treatment requirements, 5) Any applicable standards or certifications. Our engineering team typically responds within 24 hours.'
    })
    
    return faqs[:6]  # Max 6 FAQs per entity

# Process all entities
total = 0
for f in glob.glob(os.path.join(ENT_DIR, '*.json')):
    with open(f, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
    
    if d.get('faq') and len(d['faq']) >= 3:
        continue  # Skip if already has FAQs
    
    d['faq'] = generate_faqs(d)
    
    with open(f, 'w', encoding='utf-8') as fh:
        json.dump(d, fh, indent=2, ensure_ascii=False)
    total += 1

print(f'FAQ seeded for {total} entities')
print(f'Total entities with FAQ: {sum(1 for f in glob.glob(os.path.join(ENT_DIR, "*.json")) if json.load(open(f, "r", encoding="utf-8")).get("faq"))}')
