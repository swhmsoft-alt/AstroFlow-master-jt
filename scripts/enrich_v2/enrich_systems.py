"""
enrich_systems.py — Enrich 62 system detail pages with unique content.

Strategy:
  - Load each system + its related product-entities + capabilities
  - Generate processDescription from system description + industry + related capabilities
  - Generate typicalMaterials from product entity data
  - Generate qualityStandards from product entities and standards
  - Generate FAQs from system context
  - Target: each system page < 30% similarity with any other system page
"""
import json, os, glob, re

SYSTEMS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'systems')
PRODUCTS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'product-entities')
CAP_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'capabilities')

# Load all product-entities and capabilities for cross-referencing
def load_all_products():
    products = {}
    for f in glob.glob(os.path.join(PRODUCTS_DIR, '*.json')):
        slug = os.path.basename(f).replace('.json', '')
        d = json.load(open(f, encoding='utf-8'))
        products[slug] = d
    return products

def load_all_caps():
    caps = {}
    for f in glob.glob(os.path.join(CAP_DIR, '*.json')):
        slug = os.path.basename(f).replace('.json', '')
        d = json.load(open(f, encoding='utf-8'))
        caps[slug] = d
    return caps

# ── Industry-specific description templates ──
INDUSTRY_CONTEXT = {
    "aerospace & defense": "Aerospace & Defense applications require titanium components with certified material traceability, AS9100D quality management, and strict adherence to AMS and ASTM specifications.",
    "medical device": "Medical Device applications demand biocompatible titanium materials (ASTM F136 ELI), ISO 13485 quality management, and validated manufacturing processes for implantable and surgical instrumentation.",
    "watchmaking": "Watchmaking applications require aesthetic-grade titanium with precise cosmetic finishing, material consistency, and corrosion resistance for long-term wear against skin.",
    "automotive": "Automotive and motorsport applications utilize titanium for weight reduction, high strength-to-weight ratio, and corrosion resistance in exhaust, suspension, and powertrain systems.",
}

def get_industry_context(industry):
    il = industry.lower()
    for key, ctx in INDUSTRY_CONTEXT.items():
        if key in il:
            return ctx
    return f"The {industry} industry utilizes titanium components for their exceptional strength-to-weight ratio, corrosion resistance, and biocompatibility."

# ── Generate processDescription ──
def gen_process_description(data, related_caps, products):
    """Generate 2-3 paragraph process description from available data."""
    paras = []
    # Para 1: System overview from description
    desc = data.get('description', '')
    industry_ctx = get_industry_context(data.get('industry', ''))
    title = data.get('title', '')
    
    # Count related products
    prod_count = len(data.get('productEntities', []))
    cap_count = len(data.get('relatedCapabilities', []))
    
    para1 = f"A {title} system comprises multiple precision titanium components engineered to work together for {industry_ctx}. {desc[:200]}"
    paras.append(para1)
    
    # Para 2: Manufacturing approach from related capabilities
    if related_caps:
        cap_names = [c.get('title', '') for c in related_caps[:5]]
        cap_summary = ', '.join(cap_names[:-1]) + f" and {cap_names[-1]}" if len(cap_names) > 1 else cap_names[0]
        paras.append(f"Manufacturing of {title} components involves {cap_summary}. Each process step is optimized for titanium-specific requirements including tool selection, coolant strategy, and fixturing design.")
    
    # Para 3: Applications
    if prod_count > 0:
        paras.append(f"With {prod_count} distinct component types in the system, {title} spans applications across {data.get('industry', 'multiple')} sectors. Each component is designed with specific functional requirements and manufactured to exacting tolerances.")
    
    return ' '.join(paras)

# ── Generate typicalMaterials ──
def gen_typical_materials(data, products):
    """Aggregate materials from related product entities."""
    materials = []
    for slug in data.get('productEntities', []):
        p = products.get(slug)
        if p and p.get('material'):
            m = p['material']
            if m not in materials:
                materials.append(m)
    if materials:
        return ', '.join(materials[:6])
    return "Titanium Grades 1-5, 7, 9, 23 (specific grade depends on component functional requirements)"

# ── Generate qualityStandards ──
def gen_quality_standards(data, products):
    """Aggregate standards from related products + systems."""

# ── Generate FAQs ──
def gen_faqs(data, products, related_caps):
    """Generate 4-5 FAQs from system context."""
    title = data.get('title', '')
    industry = data.get('industry', '')
    materials_list = gen_typical_materials(data, products)
    standards = data.get('relatedStandards', [])
    
    faqs = []
    
    faqs.append({
        "q": f"What titanium grades are used in {title}?",
        "a": f"{title} components are typically manufactured from {materials_list}. The specific grade selection depends on mechanical property requirements, corrosion resistance needs, and industry-specific regulations."
    })
    
    if standards:
        std_str = ', '.join(standards[:3])
        faqs.append({
            "q": f"What standards apply to {title} components?",
            "a": f"{title} components are manufactured to {std_str} and other applicable specifications. Full material certification and traceability documentation are provided with each shipment."
        })
    else:
        faqs.append({
            "q": f"What certifications are available for {title} components?",
            "a": f"All {title} components are manufactured under ISO 9001:2015 and AS9100D certified quality management systems. Material certifications (EN 10204 3.1) and inspection reports are provided."
        })
    
    faqs.append({
        "q": f"What manufacturing processes are used for {title}?",
        "a": f"{title} components are produced using {', '.join([c.get('title','') for c in related_caps[:4]])}. Each process is selected and controlled to meet the specific dimensional, metallurgical, and surface finish requirements of each component."
    })
    
    faqs.append({
        "q": f"Can you provide DFM feedback for {title} designs?",
        "a": f"Yes. Our engineering team provides free Design for Manufacturability (DFM) analysis for all new {title} projects. Upload your CAD file (STEP, DXF, or DWG) and we will review your design within 24 hours."
    })
    
    return faqs[:5]

def main():
    all_products = load_all_products()
    all_caps = load_all_caps()
    
    files = sorted(glob.glob(os.path.join(SYSTEMS_DIR, '*.json')))
    print(f"Found {len(files)} systems")
    
    success = 0
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, encoding='utf-8') as f:
            data = json.load(f)
        
        # Get related capability data
        related_caps = []
        for cap_title in data.get('relatedCapabilities', []):
            for slug, cap in all_caps.items():
                if cap.get('title') == cap_title:
                    related_caps.append(cap)
                    break
        
        modified = False
        
        # Generate processDescription
        if not data.get('processDescription'):
            data['processDescription'] = gen_process_description(data, related_caps, all_products)
            modified = True
        
        # Generate typicalMaterials
        if not data.get('typicalMaterials'):
            data['typicalMaterials'] = gen_typical_materials(data, all_products)
            modified = True
        
        # Generate qualityStandards
        if not data.get('qualityStandards'):
            qs = list(data.get('relatedStandards', []))
            for slug in data.get('productEntities', []):
                p = all_products.get(slug)
                if p and p.get('standards'):
                    for s in p['standards']:
                        if s not in qs:
                            qs.append(s)
            if qs:
                data['qualityStandards'] = qs[:8]
                modified = True
        
        # Generate FAQs
        if not data.get('faqs'):
            faqs = gen_faqs(data, all_products, related_caps)
            if faqs:
                data['faqs'] = faqs
                modified = True
        
        if modified:
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            success += 1
    
    print(f"Enriched: {success}/{len(files)}")
    
    # Verify differentiation
    print("\n--- Full page similarity check (first 10 systems) ---")
    from difflib import SequenceMatcher
    
    def get_full_text(fp):
        d = json.load(open(fp, encoding='utf-8'))
        parts = [d.get('title',''), d.get('description',''), d.get('processDescription','')]
        parts.extend(d.get('designPrinciples', []))
        parts.extend(d.get('engineeringTrends', []))
        parts.append(d.get('comparisonNotes', ''))
        parts.append(d.get('typicalMaterials', ''))
        parts.extend(d.get('qualityStandards', []))
        for faq in d.get('faqs', []):
            parts.append(faq.get('q',''))
            parts.append(faq.get('a',''))
        return ' '.join(parts).lower()
    
    first_10 = sorted(glob.glob(os.path.join(SYSTEMS_DIR, '*.json')))[:10]
    total_pairs = 0
    high_sim = 0
    total_sim = 0
    
    for i in range(len(first_10)):
        for j in range(i+1, len(first_10)):
            t1 = get_full_text(first_10[i])
            t2 = get_full_text(first_10[j])
            # Token-based Jaccard
            def tok(s):
                import re
                return set(re.findall(r'[a-z]{3,}', s))
            s1, s2 = tok(t1), tok(t2)
            if not s1 or not s2:
                sim = 0
            else:
                inter = len(s1 & s2)
                union = len(s1 | s2)
                sim = inter / union if union > 0 else 0
            total_pairs += 1
            total_sim += sim
            if sim > 0.30:
                high_sim += 1
                if high_sim <= 3:
                    n1 = os.path.basename(first_10[i]).replace('.json','')
                    n2 = os.path.basename(first_10[j]).replace('.json','')
                    print(f"  HIGH: {sim:.0%} {n1[:35]} | {n2[:35]}")
    
    avg = total_sim / total_pairs if total_pairs > 0 else 0
    print(f"\nPairs: {total_pairs}, High(>30%): {high_sim}, Avg: {avg:.1%}")

if __name__ == '__main__':
    main()
