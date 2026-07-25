"""
COMPONENT 词典 — 每种部件有其专属的加工难点、应用场景和后道工序。

策略:
  - 精确匹配: 标题中的具体部件词
  - 包含匹配: 标题中的类别词
  - Fallback: 按行业/工艺推断
"""
import re

COMPONENT_DICT = {}

def _reg(name, **kw):
    COMPONENT_DICT[name] = kw

# ═══════════════════════════════════════════════
# AEROSPACE COMPONENTS
# ═══════════════════════════════════════════════
_reg("blade", industry="Aerospace",
    challenge="Thin-walled aerofoil sections (0.5–3 mm) are prone to chatter and deflection during machining. Profile tolerance of ±0.05 mm over 500 mm length requires adaptive toolpath strategies.",
    typical_apps=["Turbine engine fan blades", "Compressor blades", "Propeller blades", "Gas turbine buckets"],
    downstream=["Leading Edge Polishing", "Shot Peening", "Fluorescent Penetrant Inspection"],
    mapped_products=["titanium-compressor-blade", "titanium-compressor-blisk"],
)

_reg("blisk", industry="Aerospace",
    challenge="Integral blade-and-disk design leaves no access for tooling between blades. Deep pocket (3–5× depth-to-width ratio) requires custom lollipop cutters and 5-axis simultaneous roughing.",
    typical_apps=["Compressor blisks", "Fan blisks", "Integrally bladed rotors"],
    downstream=["Blend & Polish", "5-axis CMM Blisk Inspection", "FOD Prevention"],
    mapped_products=["titanium-compressor-blisk"],
)

_reg("impeller", industry="Aerospace, Industrial",
    challenge="Closed impeller channels with depth ratios > 5:1 create chip evacuation difficulties. Split toolpaths with 3 mm ballnose cutters at 0.1 mm stepover required for surface finish.",
    typical_apps=["Turbocharger impellers", "Centrifugal compressor impellers", "Waterjet pump impellers"],
    downstream=["Flow Bench Testing", "Spin Pit Balancing", "Hand Blend & Polish"],
    mapped_products=["titanium-chlorine-compressor-impeller", "titanium-waterjet-impeller"],
)

_reg("nozzle", industry="Aerospace, Chemical",
    challenge="Small internal orifices (Ø1–6 mm) with tight position tolerances (±0.05 mm) require gun drilling or EDM. Internal surface finish critical for flow characteristics.",
    typical_apps=["Fuel injector nozzles", "Spray dryer nozzles", "Propellant injectors"],
    downstream=["Flow Calibration", "Hydrostatic Pressure Test", "Ultrasonic Cleaning"],
    mapped_products=["titanium-eductor-nozzle", "titanium-steam-generator-nozzle"],
)

_reg("housing", industry="Aerospace, Marine",
    challenge="Thin-wall cylindrical sections (1.5–4 mm) with multiple mounting bosses require stress-relieved cast/wrought stock and sequenced roughing to prevent distortion.",
    typical_apps=["Gearbox housings", "Sensor housings", "Undersea instrument housings", "Camera housings"],
    downstream=["Pressure Test", "Helium Leak Detection", "Anodizing"],
    mapped_products=["titanium-underwater-camera-housing", "titanium-control-rod-seal-housing"],
)

_reg("bracket", industry="Aerospace",
    challenge="Complex organic geometry with multiple thin-wall lugs. 5-axis simultaneous machining required to eliminate second op setup errors.",
    typical_apps=["Engine mount brackets", "Avionics brackets", "Hydraulic manifold brackets"],
    downstream=["CMM First Article Inspection", "Surface Enhancement (Shot Peen)"],
    mapped_products=["titanium-bell-crank-rocker-arm", "titanium-brake-caliper-mounting-bolt"],
)

_reg("plate", industry="Aerospace, Chemical",
    challenge="Large thin plate (up to 3000 × 1500 × 3 mm) prone to vibration during machining. Vacuum fixture and fly-cutting strategy required.",
    typical_apps=["Base plates", "Cover plates", "Baffle plates", "Heat shield plates"],
    downstream=["Stress Relief Annealing", "Laser/Waterjet Trimming", "Flatness Inspection"],
    mapped_products=["titanium-anode-basket-bottom-plate", "titanium-ballistic-armor-plate"],
)

_reg("flange", industry="Aerospace, Chemical, Oil & Gas",
    challenge="Large diameter (up to 600 mm) with bolt hole pattern PCD tolerance ±0.1 mm. Face flatness critical for seal integrity.",
    typical_apps=["Pipe flanges", "Vacuum flanges (ConFlat)", "Blind flanges", "Weld neck flanges"],
    downstream=["CNC Drilling of Bolt Holes", "Face Milling", "Hydrostatic Pressure Test"],
    mapped_products=["titanium-conflat-knife-edge-ring", "titanium-blind-flange-asme-b165"],
)

# ═══════════════════════════════════════════════
# MEDICAL COMPONENTS
# ═══════════════════════════════════════════════
_reg("implant", industry="Medical",
    challenge="Biocompatibility requires strict control of surface finish (Ra < 0.2 µm) and absence of burrs. Material certification per ASTM F136 (Ti-6Al-4V ELI) mandatory.",
    typical_apps=["Dental implants", "Hip stems", "Interbody fusion cages", "Bone plates"],
    downstream=["Electropolishing", "Passivation per ASTM F86", "Sterile Packaging"],
    mapped_products=["titanium-dental-implant-fixture", "titanium-spinal-interbody-cage"],
)

_reg("bone screw", industry="Medical",
    challenge="Self-tapping thread form requires sharp crest with no rolled edge. Dimensional tolerance ±0.02 mm on thread major diameter.",
    typical_apps=["Pedicle screws", "Cortical bone screws", "Cannulated screws"],
    downstream=["Thread Rolling", "Passivation", "Sterilization Validation"],
    mapped_products=["titanium-bone-screw", "titanium-spinal-pedicle-screw"],
)

_reg("cup", industry="Medical",
    challenge="Porous coating interface (EBM or plasma spray) for bone ingrowth. Sphericity tolerance ±0.01 mm for acetabular shell.",
    typical_apps=["Acetabular cups", "Resurfacing cups"],
    downstream=["Porous Coating", "Sterilization", "Final CMM"],
    mapped_products=["titanium-acetabular-cup"],
)

_reg("watch case", industry="Watchmaking, Consumer",
    challenge="Cosmetic surface finish (mirror polish, brush, or bead blast) with sub-mm feature detail. Material traceability from mill to finished case.",
    typical_apps=["Dive watch cases", "Dress watch cases", "Smartwatch cases", "Watch bezels"],
    downstream=["CNC Engraving (Logo/Text)", "PVD Coating", "Water Resistance Testing"],
    mapped_products=["titanium-dive-watch-case", "titanium-smartwatch-bezel"],
)

_reg("bezel", industry="Watchmaking, Consumer",
    challenge="Rotating bezel detent system requires precise index angles (±0.1°). Scratch resistance via surface hardening or coating.",
    typical_apps=["Watch bezels", "Camera lens bezels", "Instrument bezels"],
    downstream=["Laser Engraving (Markers)", "PVD/DLC Coating"],
    mapped_products=["titanium-smartwatch-bezel", "titanium-action-camera-lens-bezel"],
)

_reg("screw", industry="Fastener",
    challenge="Thread form accuracy per ASME B1.1 with Class 3A fit. Micro-screws (< M2) require Swiss turning with CBN tooling.",
    typical_apps=["Cap screws", "Set screws", "Micro-screws for electronics", "Bone screws"],
    downstream=["Thread Rolling", "Passivation", "Go/No-Go Gauge Inspection"],
    mapped_products=["titanium-socket-head-cap-screw-iso-4762", "titanium-count ersunk-screw-iso-10642"],
)

_reg("fastener", industry="Fastener",
    challenge="Lot traceability per ASTM F606. Proof load testing required for structural fasteners. Galling prevention during assembly requires surface treatment.",
    typical_apps=["Bolts", "Nuts", "Washers", "Studs", "Pins"],
    downstream=["Thread Rolling", "Anodizing", "Torque-to-Tension Testing"],
    mapped_products=["titanium-threaded-rod-1m", "titanium-u-bolt"],
)

_reg("pin", industry="Fastener, Medical",
    challenge="Cylindrical OD tolerance ±0.005 mm with chamfer/radius control. Tight straightness (< 0.02 mm over 50 mm) for press-fit applications.",
    typical_apps=["Cotter pins", "Hinge pins", "Pivot pins", "K-wires (orthopedic)"],
    downstream=["Centerless Grinding", "Chamfering"],
    mapped_products=["titanium-cotter-pin-din-94", "titanium-derailleur-pivot-pin"],
)

_reg("spring", industry="General, Aerospace",
    challenge="Consistent wire diameter (±0.01 mm) and coil spacing. Fatigue life > 10⁷ cycles for aerospace springs. Surface defects (seams, pits) cause early failure.",
    typical_apps=["Coil springs", "Wave springs", "Belleville washers", "Clock springs"],
    downstream=["Shot Peening", "Stress Relief", "Fatigue Testing (S-N curve)"],
    mapped_products=["titanium-coilover-spring", "titanium-spring-lock-washer-din-127"],
)

_reg("tube", industry="Chemical, Aerospace, Medical",
    challenge="Wall thickness uniformity (±0.05 mm) over long lengths. Internal surface finish Ra < 0.8 µm for fluid flow. Bent tube ovality control.",
    typical_apps=["Heat exchanger tubes", "Hydraulic lines", "Structural tubes", "Catheter tubes"],
    downstream=["Tube Bending", "Weld Preparation (End Bevelling)", "Hydrostatic Pressure Test"],
    mapped_products=["titanium-bleed-air-duct", "titanium-uhp-hydrogen-tube-fitting"],
)

_reg("ring", industry="General, Aerospace",
    challenge="Roundness tolerance ±0.01 mm on large diameter rings (> 300 mm). Heat treatment distortion management.",
    typical_apps=["Seal rings", "Snap rings", "Retaining rings", "Bearing races"],
    downstream=["Heat Treatment", "OD/ID Grinding", "Dye Penetrant Inspection"],
    mapped_products=["titanium-split-ring-quick-flange", "titanium-centering-ring-kf-iso"],
)

_reg("shaft", industry="General, Automotive",
    challenge="Straightness ±0.01 mm over 300 mm length. Bearing journal surface finish Ra < 0.2 µm. Keyway positional tolerance ±0.05 mm.",
    typical_apps=["Drive shafts", "Propeller shafts", "Electric motor shafts", "Valve stems"],
    downstream=["Centerless Grinding", "Straightening Press", "Magnetic Particle Inspection"],
    mapped_products=["titanium-anti-roll-bar-droplink", "titanium-connecting-rod"],
)

_reg("valve", industry="Oil & Gas, Chemical",
    challenge="Seat leakage Class VI (ANSI FCI 70-2) requires lapped sealing surfaces. Stem straightness ±0.02 mm over 500 mm.",
    typical_apps=["Ball valves", "Gate valves", "Check valves", "Needle valves", "Pressure relief valves"],
    downstream=["Lapping (Seat)", "Hydrostatic Test", "Helium Leak Test"],
    mapped_products=["titanium-ball-valve-stem", "titanium-eccs-valve-stem"],
)

_reg("filter", industry="Chemical, Food, Water",
    challenge="Hole size uniformity ±0.02 mm across perforated plate. Burr-free holes critical for filtration efficiency.",
    typical_apps=["Filter plates", "Filter screens", "Strainer baskets", "Sintered wire mesh"],
    downstream=["Ultrasonic Cleaning", "Flow Rate Testing", "Bubble Point Test"],
    mapped_products=["titanium-anode-basket-bottom-plate", "titanium-valve-strainer-basket"],
)

# ═══════════════════════════════════════════════
# GENERAL / FALLBACK
# ═══════════════════════════════════════════════
_reg("general component", industry="General",
    challenge="Balancing dimensional accuracy with cost per part. Process selection (mill vs. turn vs. EDM vs. laser) optimized for each feature.",
    typical_apps=["Custom machined parts", "Prototype components", "Replacement parts"],
    downstream=["Deburring", "Dimensional Inspection", "Surface Treatment as Required"],
    mapped_products=[],
)

_reg("thin wall", industry="Aerospace, Medical",
    challenge="Wall thickness < 1 mm prone to chatter and deflection. Negative tool rake and reduced radial engagement (5%) required. Vacuum fixturing or wax/pitch potting for stability.",
    typical_apps=["Thin-walled sleeves", "Cylinders < 1 mm wall", "Aerodynamic fairings"],
    downstream=["Stress Relief", "CMM Inspection on Reference Fixture"],
    mapped_products=[],
)

_reg("micro feature", industry="Medical, Watchmaking",
    challenge="Feature sizes < 0.2 mm require micro-tools (Ø0.1–0.5 mm) operating at 40,000+ RPM. Tool breakage detection via spindle load monitoring essential.",
    typical_apps=["Micro-holes", "Micro-slots", "Micro-threads", "Watch components"],
    downstream=["Optical Inspection", "Electrochemical Deburring"],
    mapped_products=[],
)


def find_component_entry(title_lower, title_original):
    """
    Title-driven COMPONENT matching.
    Returns (entry_dict, matched_keyword, industry)
    """
    # 0. Industry-first override: watch, horological, horology
    for ind_kw, fb_key in [("watch", "watch case"), ("horolog", "watch case")]:
        if ind_kw in title_lower and fb_key in COMPONENT_DICT:
            return COMPONENT_DICT[fb_key], fb_key, COMPONENT_DICT[fb_key]["industry"]

    # 0b. 'thin' should match thin-wall, not blade
    if "thin" in title_lower and "blade" in title_lower:
        # Check if title is specifically about cutting thin blades vs. machining them
        if "cut" in title_lower or "edm" in title_lower or "aperture" in title_lower or "shutter" in title_lower:
            return COMPONENT_DICT["thin wall"], "thin wall", "General"

    # 1. Direct phrase match (longest first)
    for key in sorted(COMPONENT_DICT.keys(), key=len, reverse=True):
        if key in title_lower:
            return COMPONENT_DICT[key], key, COMPONENT_DICT[key]["industry"]

    # 2. Partial word match
    for key in sorted(COMPONENT_DICT.keys(), key=len, reverse=True):
        words = key.split()
        if all(w in title_lower for w in words if len(w) > 2):
            return COMPONENT_DICT[key], key, COMPONENT_DICT[key]["industry"]

    # 3. Significant single-word match
    significant = ["blade", "blisk", "impeller", "nozzle", "housing", "bracket",
                   "plate", "flange", "implant", "screw", "pin", "spring",
                   "tube", "ring", "shaft", "valve", "filter", "bezel",
                   "cup", "fastener", "wire", "foil", "disc",
                   "disk", "cage", "mesh", "basket", "cap", "button",
                   "case", "frame", "cavity", "channel", "port", "manifold",
                   "duct", "vane", "spar", "rib", "strut", "clamp",
                   "bracket", "assembly", "housing"]
    for word in significant:
        if word in title_lower:
            for key in COMPONENT_DICT.keys():
                if key.startswith(word) or word in key.split():
                    return COMPONENT_DICT[key], key, COMPONENT_DICT[key]["industry"]

    # 4. Industry-based inference
    industry_map = {
        "aerospace": "blade",
        "medical": "implant",
        "dental": "implant",
        "fuel": "nozzle",
        "hydraulic": "valve",
        "oil": "valve",
        "gas": "valve",
    }
    for keyword, fallback_key in industry_map.items():
        if keyword in title_lower and fallback_key in COMPONENT_DICT:
            return COMPONENT_DICT[fallback_key], fallback_key, COMPONENT_DICT[fallback_key]["industry"]

    # 5. Descriptor-based
    if "thin" in title_lower:
        return COMPONENT_DICT["thin wall"], "thin wall", "General"
    if "micro" in title_lower or "miniature" in title_lower:
        return COMPONENT_DICT["micro feature"], "micro feature", "Medical, Watchmaking"

    # 6. Ultimate fallback
    return COMPONENT_DICT["general component"], "general component", "General"
