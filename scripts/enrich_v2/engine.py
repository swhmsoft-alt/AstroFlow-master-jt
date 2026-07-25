#!/usr/bin/env python3
"""
enrich_v2/engine.py — Title-driven capability enrichment engine.

Architecture:
  process_dictionary.py  ───┐
                             ├──→ Composition Engine → enriched JSON
  component_dictionary.py ───┘

For each capability:
  1. Parse title → extract {PROCESS}, {COMPONENT}, {FEATURE}, {INDUSTRY}
  2. Lookup PROCESS entry → get process-specific specs, heat/ flatness control
  3. Lookup COMPONENT entry → get component-specific challenges, apps, products
  4. Compose: COMPONENT data OVERRIDES PROCESS defaults where applicable
  5. Apply negative filter: purge any vocabulary from FOREIGN processes
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))

from process_dictionary import find_process_entry, PROCESS_DICT
from component_dictionary import find_component_entry

# ── Common shared data ──
COMMON_QUALITY = [
    "ISO 9001:2015 — Quality Management System",
    "AS9100D — Aerospace Quality Management",
    "ASTM B265 — Titanium Strip, Sheet, and Plate Standard",
]

COMMON_CTA = {
    "ctaTitle": "Need Precision Titanium Components?",
    "ctaDescription": "Upload your CAD file (DXF/DWG/STEP) for a free DFM analysis and competitive quote. Our engineering team responds within 24 hours.",
    "ctaButtonText": "Submit Your CAD for Review",
}

COMMON_GRADES = ["Grade 1", "Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 7", "Grade 9", "Grade 23"]


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def extract_variables(title, category):
    """
    Parse title into {PROCESS}, {COMPONENT}, {FEATURE}, {INDUSTRY}.
    """
    lower = title.lower()
    
    # Industry inference
    industry = "General"
    for kw, ind in [
        ("aerospace", "Aerospace"), ("aero", "Aerospace"), ("blade", "Aerospace"),
        ("medical", "Medical"), ("dental", "Medical"), ("surgical", "Medical"),
        ("watch", "Watchmaking"), ("horolog", "Watchmaking"),
        ("automotive", "Automotive"), ("motor", "Automotive"),
        ("marine", "Marine"), ("subsea", "Marine"), ("submarine", "Marine"),
        ("chemical", "Chemical Processing"), ("hydro", "Energy"),
        ("hydrogen", "Energy"), ("fuel", "Energy"),
        ("semiconductor", "Semiconductor"), ("vacuum", "Semiconductor"),
        ("oil", "Oil & Gas"), ("gas", "Oil & Gas"),
        ("consumer", "Consumer Electronics"),
        ("sport", "Sporting"), ("bike", "Cycling"), ("bicycle", "Cycling"),
    ]:
        if kw in lower:
            industry = ind
            break
    
    # Feature extraction
    features = []
    for kw in ["thin", "micro", "miniature", "precision", "heavy-duty",
               "high-temperature", "cryogenic", "corrosion-resistant",
               "high-strength", "lightweight", "porous", "complex",
               "large", "thick", "deep", "contoured", "tapered"]:
        if kw in lower:
            features.append(kw.capitalize())
    feature = features[0] if features else "Precision"
    
    # Component: extract from title words
    component = "Component"
    # The component dictionary will do more detailed parsing
    
    # Process: the main verb/process word
    process = title  # fallback
    
    return {
        "PROCESS": process,
        "COMPONENT": component,
        "FEATURE": feature,
        "INDUSTRY": industry,
    }


# ── Negative vocabulary filter ──
# Processes and their allowed vocabulary; anything outside = contamination
FOREIGN_VOCAB = {
    "laser cutting": {"waterjet", "abrasive", "garnet", "kerf", "nozzle"},
    "waterjet": {"laser", "haz", "heat-affected", "fiber laser"},
    "laser marking": {"waterjet", "cutting", "kerf", "abrasive", "garnet"},
    "laser engraving": {"waterjet", "cutting", "kerf", "abrasive"},
    "tig welding": {"waterjet", "laser cutting", "fiber laser"},
    "wire edm": {"laser cutting", "waterjet cutting", "milling"},
    "swiss turning": {"waterjet", "laser cutting"},
    "5-axis": {"waterjet", "abrasive waterjet"},
    "anodizing": {"waterjet", "laser cutting", "milling", "turning", "grinding"},
    "passivation": {"waterjet", "laser", "cutting", "milling"},
    "slm 3d printing": {"waterjet", "subtractive", "cnc"},
    "ultrasonic cleaning": {"waterjet", "laser", "cutting", "milling"},
    "thread rolling": {"waterjet", "laser cutting", "milling"},
}

# Common words that are safe across all processes
SAFE_WORDS = {"titanium", "grade", "component", "manufacturing", "precision",
              "quality", "inspection", "tolerance", "surface", "finish",
              "process", "capability", "engineering", "production"}


def apply_negative_filter(process_key, text):
    """
    Remove foreign vocabulary from generated text based on the process.
    """
    if process_key not in FOREIGN_VOCAB:
        return text
    banned = FOREIGN_VOCAB[process_key]
    words = text.split()
    filtered = [w for w in words if w.lower() not in banned and 
                all(b not in w.lower() for b in banned)]
    return ' '.join(filtered)


def compose(title, category, description, enriched_slugs=None):
    """
    Main composition: PROCESS × COMPONENT → enriched data.
    """
    lower = title.lower()
    vars_ = extract_variables(title, category)
    
    # 1. Lookup PROCESS (try title first, fall back to category)
    process_entry, matched_process = find_process_entry(lower)
    # If fell through to generic, try matching by category
    if matched_process == 'general fabrication':
        cat_keywords = {
            "inspection": "cmm inspection", "inspect": "cmm inspection",
            "testing": "cmm inspection", "test": "cmm inspection",
            "surface treatment": "anodizing", "surface": "anodizing",
            "coating": "anodizing", "pvd": "anodizing", "dlc": "anodizing",
            "electropolish": "anodizing", "polish": "anodizing",
            "machining": "5-axis cnc milling",
            "forming": "bend forming", "stamp": "bend forming",
            "forging": "closed-die forging", "forg": "closed-die forging",
            "welding": "tig welding", "weld": "tig welding",
            "heat treatment": "vacuum heat treatment", "anneal": "vacuum heat treatment",
            "heat treat": "vacuum heat treatment",
            "fastener": "thread rolling", "fasten": "thread rolling",
            "additive": "slm 3d printing",
            "edm": "wire edm", "laser": "laser cutting",
            "waterjet": "waterjet cutting", "water jet": "waterjet cutting",
            "general manufacturing": "general fabrication",
        }
        for kw, lookup_key in cat_keywords.items():
            if kw in category.lower() or kw in lower:
                if lookup_key in PROCESS_DICT:
                    process_entry = PROCESS_DICT[lookup_key]
                    matched_process = lookup_key
                    break
    if not process_entry:
        process_entry = {"specs": {}, "processDescription": "", "heatControl": "",
                        "flatnessControl": "", "comparison": [], "holeTypes": [],
                        "downstreamBase": [], "inspectionBase": [], "qualityBase": []}
    
    # 2. Lookup COMPONENT
    comp_entry, matched_component, comp_industry = find_component_entry(lower, title)
    if not comp_entry:
        comp_entry = {"challenge": "", "typical_apps": [], "downstream": [], "mapped_products": []}
    
    # 3. Determine target industry
    target_industry = vars_["INDUSTRY"] if vars_["INDUSTRY"] != "General" else comp_industry
    
    # 4. Compose process description
    feature = vars_["FEATURE"]
    industry_phrase = f"for {target_industry}" if target_industry != "General" else ""
    # For generic fallback pages, generate description from title
    if matched_process == 'general fabrication':
        # Detect what kind of capability from title keywords
        kw_suffixes = {
            "test": "testing procedure", "testing": "testing procedure",
            "inspect": "inspection process", "inspection": "inspection process",
            "coat": "coating application", "pvd": "coating application",
            "dlc": "coating application", "polish": "polishing process",
            "finish": "finishing operation", "vibratory": "finishing operation",
            "assembl": "assembly process", "rivet": "assembly process",
            "clean": "cleaning process", "ultrasonic": "cleaning process",
            "dry": "drying process", "packag": "packaging process",
            "steril": "sterilization process",
            "heat": "heat treatment process", "anneal": "heat treatment process",
            "mark": "marking application", "engrav": "marking application",
            "weld": "welding process", "braze": "joining process",
            "shot": "surface treatment process", "peen": "surface treatment process",
            "bend": "forming process", "form": "forming process",
            "drill": "drilling process", "bore": "machining process",
            "grind": "grinding process", "lap": "lapping process",
            "turn": "turning process", "mill": "milling process",
            "cut": "cutting process", "trim": "cutting process",
            "cast": "casting process", "mold": "molding process",
            "sinter": "sintering process", "hip": "densification process",
        }
        suffix = "manufacturing process"
        for kw, s in kw_suffixes.items():
            if kw in lower:
                suffix = s
                break
        process_description = f"Professional {suffix} for {industry_phrase} titanium components. {title} is performed by certified technicians following approved procedures and specifications." if industry_phrase else f"Professional {suffix} for titanium components. {title} is performed by certified technicians following approved procedures and specifications."
    else:
        base_pd = process_entry.get("processDescription", "")
        comp_name = matched_component if matched_component != "general component" else "titanium components"
        process_description = base_pd
        if comp_name in base_pd.lower():
            pass
        elif comp_name != "general component":
            challenge = comp_entry.get("challenge", "")
            process_description = f"{base_pd.rstrip('.')}, specifically for {comp_name}. {feature} {comp_name} {industry_phrase} present unique challenges: {challenge}" if challenge else f"{base_pd.rstrip('.')}, specifically for {comp_name} {industry_phrase}."
        else:
            process_description = base_pd
    
    # For generic fallback pages, also differentiate heat/flatness/comparison from title
    if matched_process == 'general fabrication':
        kw_prefixes = {
            "test": "testing", "inspect": "inspection", "coat": "coating",
            "polish": "polishing", "assembl": "assembly", "clean": "cleaning",
            "steril": "sterilization", "heat": "heat treatment",
            "mark": "marking", "weld": "welding", "shot": "shot peening",
            "bend": "forming", "forg": "forging", "cast": "casting",
            "grind": "grinding", "drill": "drilling", "bore": "boring",
            "turn": "turning", "mill": "milling", "cut": "cutting",
            "braze": "brazing", "sinter": "sintering",
        }
        prefix = "manufacturing"
        for kw, p in kw_prefixes.items():
            if kw in lower:
                prefix = p
                break
        HEAT_TEMPLATES = {
            "testing": f"Specimen preparation and testing environment are controlled per applicable ASTM/ISO standards. Temperature and humidity are monitored during {prefix} to ensure result repeatability.",
            "inspection": f"Inspection is performed in a temperature-controlled metrology lab at 20+1C. Components are stabilized before measurement to eliminate thermal expansion error.",
            "coating": f"Coating application is performed in a controlled environment with temperature and humidity monitoring. Curing cycles follow defined time-temperature profiles.",
            "cleaning": f"Cleaning solution temperature is maintained at 50-70C for optimal cavitation and contaminant removal. Sequential wash-rinse-dry cycles prevent recontamination.",
            "assembly": f"Assembly operations are performed in a clean environment with controlled temperature. Torque tools are calibrated daily to ensure consistent clamp loads.",
            "heat treatment": f"Furnace temperature is controlled within +5C uniformity across the working zone. Multiple thermocouples provide real-time temperature profiling.",
            "welding": f"Interpass temperature is monitored with IR pyrometer and maintained below specified maximum. Argon shielding gas flow rate is verified before each weld pass.",
            "grinding": f"Coolant flow rate and concentration are monitored to prevent thermal damage to the workpiece surface. Wheel dressing frequency is tracked per part count.",
            "marking": f"Laser power and pulse frequency are calibrated before each production run. Focal distance is maintained via autofocus system.",
        }
        heat_control = HEAT_TEMPLATES.get(prefix, f"Process parameters are monitored and controlled to ensure consistent quality. Environmental conditions are maintained within specified ranges.")
        FLAT_TEMPLATES = {
            "testing": f"Test fixtures are designed to maintain specimen alignment within +0.1 mm. Dimensional verification of test setup is performed before each test series.",
            "inspection": f"Granite surface plate Grade 00 provides reference datum. Components are fixtured to eliminate deflection during measurement.",
            "coating": f"Coating thickness uniformity is controlled via fixturing design and rotational fixturing. No mechanical distortion expected from coating process.",
            "cleaning": f"Cleaning process applies no mechanical force. Components are supported in purpose-built baskets to prevent surface contact damage.",
            "assembly": f"Assembly fixtures maintain datum alignment within +0.05 mm. Sequenced tightening patterns prevent part distortion during bolting.",
            "heat treatment": f"Ceramic or metallic fixtures support components during thermal cycling. Controlled cooling rate minimizes thermal gradient distortion.",
            "welding": f"Welding fixtures with copper backup bars provide heat sinking. Sequenced stitch welding pattern balances thermal stresses.",
            "grinding": f"Multi-pass grinding strategy with decreasing depth of cut. In-process gauging ensures diameter control within tolerance.",
            "marking": f"Non-contact process with no mechanical force applied. Components remain in existing fixture throughout marking operation.",
        }
        flatness_control = FLAT_TEMPLATES.get(prefix, f"Components are fixtured to maintain dimensional stability throughout the process. Post-process inspection verifies conformance.")
        process_entry["comparison"] = [{"dimension": "Process Type", "laser": title, "waterjet": "N/A"}]
    else:
        # 6. Compose heat control
        heat = process_entry.get("heatControl", "")
        comp_heat_override = None
        for key in [matched_component, vars_["COMPONENT"].lower()]:
            if key in COMPONENT_HEAT_OVERRIDES:
                comp_heat_override = COMPONENT_HEAT_OVERRIDES[key]
                break
        heat_control = comp_heat_override if comp_heat_override else heat
        
        # 7. Compose flatness control
        flatness = process_entry.get("flatnessControl", "")
        comp_flatness_override = None
        for key in [matched_component, vars_["COMPONENT"].lower()]:
            if key in COMPONENT_FLATNESS_OVERRIDES:
                comp_flatness_override = COMPONENT_FLATNESS_OVERRIDES[key]
                break
        flatness_control = comp_flatness_override if comp_flatness_override else flatness
    
    # 5. Compose capabilities description (category-based templates)
    cap_desc = process_entry.get("capabilitiesDescription", "")
    if not cap_desc:
        CAT_TEMPLATES = {
            "machining": f"Precision machining capability for {title}, utilizing multi-axis CNC centers with in-process inspection and SPC quality control.",
            "welding": f"Certified welding capability for {title}, with full inert gas shielding, weld procedure qualification, and operator certification.",
            "inspection": f"NDT and dimensional inspection service for {title}, performed by certified technicians per applicable standards.",
            "testing": f"Mechanical and physical testing service for {title}, with calibrated equipment and certified reporting per EN 10204 3.1.",
            "surface treatment": f"Surface engineering capability for {title}, with process control, bath chemistry monitoring, and batch consistency validation.",
            "heat treatment": f"Vacuum heat treatment capability for {title}, with programmable temperature profiling, inert gas cooling, and metallographic verification.",
            "additive": f"Metal additive manufacturing capability for {title}, with powder traceability, parameter development, and post-processing integration.",
            "edm": f"Wire and sinker EDM capability for {title}, achieving burr-free results with multi-pass finishing strategy and submerged machining.",
            "forging": f"Hydraulic and mechanical press capability for {title}, with induction heating, die temperature control, and grain flow optimization.",
            "laser": f"Laser processing capability for {title}, with precision beam delivery, gas assist systems, and process monitoring for repeatable quality.",
            "forming": f"Metal forming capability for {title}, with CNC press brake, die design, and springback compensation for titanium alloys.",
            "fastener": f"Fastener manufacturing capability for {title}, with cold forming, thread rolling, and 100% dimensional inspection.",
            "general": f"Integrated manufacturing capability for {title}, supported by in-house QC, material certification, and engineering review.",
        }
        cat_lower = category.lower()
        matched_template = CAT_TEMPLATES.get("general")
        for key in CAT_TEMPLATES:
            if key in cat_lower or key in lower:
                matched_template = CAT_TEMPLATES[key]
                break
        cap_desc = matched_template
    
    if matched_process != 'general fabrication':
        # 6. Compose heat control
        heat = process_entry.get("heatControl", "")
        comp_heat_override = None
        for key in [matched_component, vars_["COMPONENT"].lower()]:
            if key in COMPONENT_HEAT_OVERRIDES:
                comp_heat_override = COMPONENT_HEAT_OVERRIDES[key]
                break
        heat_control = comp_heat_override if comp_heat_override else heat
        
        # 7. Compose flatness control  
        flatness = process_entry.get("flatnessControl", "")
        comp_flatness_override = None
        for key in [matched_component, vars_["COMPONENT"].lower()]:
            if key in COMPONENT_FLATNESS_OVERRIDES:
                comp_flatness_override = COMPONENT_FLATNESS_OVERRIDES[key]
                break
        flatness_control = comp_flatness_override if comp_flatness_override else flatness
    
    # 8. Build specs
    specs = dict(process_entry.get("specs", {}))
    # Add component-specific specs if relevant
    if matched_component in COMPONENT_SPECS:
        specs.update(COMPONENT_SPECS[matched_component])
    
    # 9. Build process comparison
    comparison = process_entry.get("comparison", [])
    
    # 10. Build hole types
    hole_types = process_entry.get("holeTypes", [])[:]
    
    # 11. Build downstream
    downstream = list(process_entry.get("downstreamBase", []))
    comp_downstream = comp_entry.get("downstream", [])
    for ds in comp_downstream:
        if not any(ds in d["name"] for d in downstream):
            downstream.append({"name": ds, "description": f"{ds} for {title.lower()} components."})
    
    # 12. Build applications
    apps = comp_entry.get("typical_apps", [])
    
    # 13. Build inspection items
    inspection = list(process_entry.get("inspectionBase", []))
    inspection += [
        f"{title} specific dimensional verification (CMM / vision)",
        "Material grade verification (PMI / OES spectrometer)",
    ]
    if "Aerospace" in target_industry:
        inspection.append("Fluorescent Penetrant Inspection (FPI) per ASTM E1417")
    if "Medical" in target_industry:
        inspection.append("Biocompatibility validation per ISO 10993")
    
    # 14. Build quality standards
    quality = list(process_entry.get("qualityBase", COMMON_QUALITY))
    if "Aerospace" in target_industry and "AS9100D" not in "".join(quality):
        quality.append("AS9100D — Aerospace Quality Management")
    if "Medical" in target_industry:
        quality.append("ISO 13485 — Medical Device Quality Management")
    
    # 15. Build SEO title/description
    seo_title = f"{title} | Precision Titanium {category} | BOZE"
    seo_desc = f"{title} for {target_industry} applications. {feature} titanium component manufacturing with {specs.get('tolerance', 'tight tolerances')}. ISO 9001:2015 & AS9100D certified."
    
    # ── Apply negative filter to prose fields ──
    process_description = apply_negative_filter(matched_process, process_description)
    heat_control = apply_negative_filter(matched_process, heat_control)
    flatness_control = apply_negative_filter(matched_process, flatness_control)
    cap_desc = apply_negative_filter(matched_process, cap_desc)
    
    # ── Assemble output ──
    result = {
        "title": title,
        "category": category,
        "description": description,
        "titaniumGrades": COMMON_GRADES,
        "thicknessRange": specs.get("thicknessRange", ""),
        "cuttingTolerance": specs.get("tolerance", ""),
        "tolerance": specs.get("tolerance", ""),
        "maxSize": specs.get("maxSize", ""),
        "surfaceFinish": specs.get("surfaceFinish", ""),
        "processComparison": comparison,
        "processDescription": process_description,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness_control,
        "capabilitiesDescription": cap_desc,
        "typicalApplications": apps,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": quality,
        "relatedEntities": comp_entry.get("mapped_products", []),
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
    }
    result.update(COMMON_CTA)
    
    # Customize CTA title
    comp_phrase = matched_component.replace(" general component", "").replace("general component", "").strip()
    if comp_phrase:
        result["ctaTitle"] = f"Need Precision {comp_phrase.title()} Components?"
    else:
        words = title.split()[:3]
        result["ctaTitle"] = f'Need Precision {" ".join(words)}?'
    
    return result


# ── Component-specific overrides ──
COMPONENT_HEAT_OVERRIDES = {
    "blade": "Thin aerofoil sections generate heat rapidly due to continuous tool engagement. High-pressure coolant (70 bar) directed at the cutting zone with through-tool cooling for deep cavities.",
    "blisk": "Restricted chip evacuation in deep blade channels traps heat. Minimum quantity lubrication (MQL) with cryogenic CO\u2082 assist recommended for Ti-6Al-4V blisks.",
    "implant": "Heat generation during machining must be strictly controlled to prevent surface microstructure alteration. Copious coolant flooding and low feed rates maintain surface integrity.",
    "watch case": "Minimal heat generation due to fine finishing passes. Air blast for chip clearing sufficient; coolant not required for cosmetic finishing passes.",
}

COMPONENT_FLATNESS_OVERRIDES = {
    "blade": "Thin aerofoil sections (< 1 mm) prone to distortion during machining. Fixturing with vacuum or wax potting; stress relief between roughing and finishing passes.",
    "flange": "Face flatness critical for seal integrity. Sequenced bolt-hole drilling pattern (opposite poles) prevents flange warpage.",
    "plate": "Large surface area prone to vibration. Vacuum fixture with gasket sealing; fly-cutting strategy with < 0.02 mm flatness over 1000 mm.",
}

COMPONENT_SPECS = {
    "blade": {"tolerance": "+0.02 mm (profile) / +0.05 mm (position)", "surfaceFinish": "Ra 0.4 µm on aerofoil"},
    "blisk": {"tolerance": "+0.01 mm (blade profile) / +0.02 mm (channel)", "surfaceFinish": "Ra 0.8 µm in channels"},
    "implant": {"tolerance": "+0.01 mm (mating surface) / +0.005 mm (thread)", "surfaceFinish": "Ra < 0.2 µm (bone-contact)"},
    "watch case": {"tolerance": "+0.01 mm (case diameter) / +0.005 mm (crystal seat)", "surfaceFinish": "Ra 0.1 µm (mirror polish)"},
    "screw": {"tolerance": "Class 3A thread fit; +0.005 mm on shank diameter", "surfaceFinish": "Ra 0.4 µm on thread"},
    "valve": {"tolerance": "+0.01 mm (seat) / +0.02 mm (stem)", "surfaceFinish": "Ra 0.2 µm (sealing surface)"},
    "flange": {"tolerance": "+0.05 mm (bolt PCD) / +0.02 mm (face flatness)", "surfaceFinish": "Ra 0.8 µm (gasket face)"},
    "spring": {"tolerance": "+0.01 mm (wire diameter) / +0.1 mm (free length)", "surfaceFinish": "Ra 0.4 µm (no surface defects)"},
}
