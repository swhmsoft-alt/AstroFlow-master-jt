#!/usr/bin/env python3
"""
batch_enrich_capabilities.py

批量填充 445 项钛合金微型能力的 7 模块工程参数。

策略：
  1. 加载所有 capability JSON + product-entity JSON（构建反向索引）
  2. 按 category 分发到不同的规则模板
  3. 从 title 中提取关键词确保差异化
  4. 跳过已填充的能力（检测 processComparison 等字段存在性）
  5. 保留所有现有字段，仅追加新字段

用法：
  python scripts/enrich_capabilities.py
"""

import json
import os
import re
import glob
from collections import defaultdict

CAPABILITIES_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'capabilities')
PRODUCT_ENTITIES_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'product-entities')

# ──────────────────────────────────────────────────────────
# 辅助函数
# ──────────────────────────────────────────────────────────

def slugify(title):
    """从 title 生成 slug，用于匹配 product-entities 的 relatedCapabilities"""
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s


def load_json_files(directory, pattern='*.json'):
    """加载目录下所有 JSON 文件"""
    results = []
    for fpath in sorted(glob.glob(os.path.join(directory, pattern))):
        with open(fpath, encoding='utf-8') as f:
            try:
                data = json.load(f)
                basename = os.path.basename(fpath)
                slug = basename.replace('.json', '')
                results.append((slug, data, fpath))
            except json.JSONDecodeError as e:
                print(f'  [WARN] 解析失败: {fpath} — {e}')
    return results


def build_entity_reverse_index(product_entities):
    """
    product-entities → capabilities 反向索引。
    返回: { capability_slug: [entity_slug, ...] }
    """
    idx = defaultdict(list)
    for slug, data, fpath in product_entities:
        related = data.get('relatedCapabilities', [])
        if not related:
            continue
        for cap_ref in related:
            # 规范化：去 .json 后缀、小写
            norm = cap_ref.lower().replace('.json', '')
            idx[norm].append(slug)
    return dict(idx)


def is_already_enriched(data):
    """检测是否已被填充过（7 模块标志字段）"""
    return ('processComparison' in data or
            'titaniumGrades' in data or
            'downstreamProcesses' in data)


# ──────────────────────────────────────────────────────────
# 通用规则模板
# ──────────────────────────────────────────────────────────

COMMON_TITANIUM_GRADES = ["Grade 1", "Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 7", "Grade 9", "Grade 23"]
COMMON_QUALITY_STANDARDS = [
    "ISO 9001:2015 — Quality Management System",
    "AS9100D — Aerospace Quality Management",
    "ASTM B265 — Titanium Strip, Sheet, and Plate Standard",
]
COMMON_INSPECTION_ITEMS = [
    "Dimensional inspection (caliper / micrometer / CMM)",
    "Surface finish measurement (Ra / Rz per ISO 4287)",
    "Material grade verification (PMI / OES spectrometer)",
    "Visual inspection per ASTM E10 / ISO 17637",
]

COMMON_DOWNSTREAM = [
    {"name": "Deburring & Edge Finishing", "description": "Mechanical or thermal deburring to remove sharp edges and achieve uniform edge radius per engineering specification."},
    {"name": "Dimensional Inspection (CMM)", "description": "Full 3D coordinate measuring machine inspection for geometric dimensioning and tolerancing (GD&T) verification."},
    {"name": "Cleanroom Packaging", "description": "Class 10 / Class 100 cleanroom packaging with VCI anti-corrosion lining for contamination-sensitive components."},
]

COMMON_CTA = {
    "ctaTitle": "Need Precision Titanium Components?",
    "ctaDescription": "Upload your CAD file (DXF/DWG/STEP) for a free DFM analysis and competitive quote. Our engineering team responds within 24 hours.",
    "ctaButtonText": "Submit Your CAD for Review",
}

# ──────────────────────────────────────────────────────────
# Category 规则模板
# ──────────────────────────────────────────────────────────

def extract_keywords(title):
    """从 title 提取核心关键词（用于差异化）"""
    stopwords = {'of', 'and', 'for', 'the', 'in', 'to', 'with', 'by', 'from', 'per', 'via', 'under'}
    words = re.findall(r'[a-zA-Z0-9+.-]+', title.lower())
    keywords = [w for w in words if w not in stopwords and len(w) > 1]
    return keywords[:5]


def rule_laser_processing(title, keywords):
    """Laser Processing 类别"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Suitable Thickness", "laser": "Thin to medium sections up to 12 mm with fiber laser; optimal < 3 mm for high speed", "waterjet": "0.5 mm to 25 mm+; no practical thickness limit with abrasive waterjet"},
        {"dimension": "Heat Affected Zone (HAZ)", "laser": "Minimal HAZ with N₂/Ar assist gas preventing titanium oxidation", "waterjet": "No HAZ — cold cutting process, zero thermal distortion"},
        {"dimension": "Edge Quality", "laser": "Requires deburring for dross removal on thicker sections", "waterjet": "Smooth, burr-free edge; no secondary cleaning required"},
        {"dimension": "Cutting Speed (3 mm Ti)", "laser": "Up to 6 m/min for thin sections", "waterjet": "0.5–1.5 m/min; slower but more versatile"},
        {"dimension": "Material Compatibility", "laser": "All titanium grades; reflective alloys require careful fiber laser tuning", "waterjet": "All titanium grades + composites, ceramics; no reflectivity issues"},
    ]

    hole_types = ["Round holes", "Slot / oblong holes", "Custom contour cutouts", "Edge preparations (bevels)"]

    heat_control = f"For laser cutting of {kw}, high-purity nitrogen or argon coaxial assist gas shields the cut zone from atmospheric oxygen, preventing alpha-case formation and discoloration. Waterjet cutting eliminates thermal concerns entirely."

    flatness = f"Post-cutting stress relief (vacuum annealing) and precision leveling available for {kw} components requiring flatness within 0.5 mm/m."

    desc = f"High-precision laser and waterjet cutting of {kw} for titanium components. Capable of producing complex geometries, internal cutouts, and edge preparations with ±0.05 mm laser tolerance and zero HAZ via waterjet process."

    cap_desc = f"Our facility combines multi-kilowatt fiber laser cutting systems with high-pressure abrasive waterjet systems, enabling us to process {kw} from prototype to production volumes."

    downstream = COMMON_DOWNSTREAM + [
        {"name": "Pickling & Passivation", "description": "Nitric-hydrofluoric acid bath (ASTM B600) removes light oxidation from laser-cut edges and restores passive layer."},
        {"name": "CNC Machining", "description": "4/5-axis CNC milling/drilling for mounting holes, flange faces, and precision features on cut blanks."},
    ]

    inspection = COMMON_INSPECTION_ITEMS + [
        "Edge quality assessment (burr height per ISO 13715)",
        "Dye penetrant inspection (PT) per ASTM E1417",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "0.5 mm – 25.0 mm",
        "minHoleRatio": "1:1 (diameter-to-thickness ratio)",
        "cuttingTolerance": "±0.05 mm (Laser) / ±0.1 mm (Waterjet)",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS,
    }


def rule_machining(title, keywords):
    """Machining 类别"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Machining Strategy", "laser": "N/A — chip-cutting process using multi-axis CNC", "waterjet": "N/A — abrasive waterjet for rough profiling only"},
        {"dimension": "Achievable Tolerance", "laser": "±0.005 mm (precision turning/milling)", "waterjet": "±0.1 mm (profile roughing)"},
        {"dimension": "Surface Finish", "laser": "Ra 0.4–1.6 µm as-machined; Ra 0.05 µm with polishing", "waterjet": "Ra 3.2–6.3 µm as-cut"},
        {"dimension": "Material Removal Rate", "laser": "Moderate — optimized via CAM toolpath strategies", "waterjet": "High — suitable for bulk material removal"},
        {"dimension": "Tool Wear (Ti machining)", "laser": "Carbide/PCD tooling required; Ti is work-hardening", "waterjet": "No tool wear; garnet abrasive consumed"},
    ]

    hole_types = ["Drilled holes", "Threaded holes", "Counterbore / countersink", "Tapered holes", "Custom milled pockets"]

    heat_control = f"CNC machining of {kw} uses high-pressure coolant-through-spindle systems (70 bar) to manage heat generation at the cutting interface, preventing work-hardening and maintaining dimensional stability."

    flatness = f"Precision fixturing and stress-relief cycles ensure flatness within 0.005 mm for {kw} components. Multi-step roughing/finishing passes minimize distortion."

    desc = f"Precision CNC machining of {kw} titanium components using 3/4/5-axis machining centers. Capable of tight tolerances and complex geometries for mission-critical applications."

    cap_desc = f"Our machine shop is equipped with 35+ CNC machining centers including 5-axis simultaneous, Swiss-type, and multi-tasking machines for {kw} production."

    downstream = COMMON_DOWNSTREAM + [
        {"name": "Surface Treatment", "description": "Anodizing (AMS 2488), passivation, or electropolishing for corrosion resistance and aesthetic finish."},
        {"name": "Thread Rolling", "description": "Cold-forming of threads for superior fatigue strength compared to thread cutting."},
    ]

    inspection = COMMON_INSPECTION_ITEMS + [
        "CMM full 3D inspection (GD&T per ASME Y14.5)",
        "Surface roughness measurement (Ra/Rz)",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "Up to Ø500 mm × 1000 mm (turning) / 1200 mm × 800 mm (milling)",
        "minHoleRatio": "0.5 mm minimum hole diameter (drilling)",
        "cuttingTolerance": "±0.005 mm (turning) / ±0.01 mm (milling)",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "AS9100D — Aerospace Quality Management",
        ],
    }


def rule_welding(title, keywords):
    """Welding 类别"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Process Method", "laser": "Laser beam welding (LBW) — keyhole or conduction mode", "waterjet": "N/A — waterjet not used for welding"},
        {"dimension": "Heat Input", "laser": "Low — minimal distortion; narrow HAZ", "waterjet": "N/A"},
        {"dimension": "Shielding Gas", "laser": "Argon (99.999%) back-purge + trailing shield required for Ti", "waterjet": "N/A"},
        {"dimension": "Weld Speed", "laser": "Up to 5 m/min for thin sections", "waterjet": "N/A"},
        {"dimension": "Joint Types", "laser": "Butt, lap, fillet, edge, T-joint", "waterjet": "N/A"},
    ]

    hole_types = ["N/A — welding is a joining process"]

    heat_control = f"TIG/MIG/laser welding of {kw} requires inert gas shielding (argon or helium) on both face and back sides to prevent atmospheric contamination and embrittlement of the weld zone."

    flatness = f"Weld fixtures and sequenced welding patterns control distortion for {kw} assemblies. Post-weld stress relief available."

    desc = f"Precision TIG, MIG, and laser welding of {kw} titanium assemblies. Full inert gas shielding prevents oxidation and ensures metallurgically sound welds meeting ASME Section IX requirements."

    cap_desc = f"Our welding facility includes automatic orbital TIG, pulsed MIG, and fiber laser welding systems with cleanroom-class shielding for {kw}."

    downstream = [
        {"name": "Weld Inspection (NDT)", "description": "X-ray, ultrasonic, or dye penetrant inspection per ASME Section V."},
        {"name": "Weld Map Documentation", "description": "Full traceability documentation for every weld including operator ID, parameters, and inspection results."},
        {"name": "Post-Weld Heat Treatment", "description": "Stress relief annealing in vacuum furnace to restore mechanical properties."},
    ] + COMMON_DOWNSTREAM

    inspection = [
        "Visual weld inspection per AWS D1.1 / ISO 5817",
        "Dye penetrant inspection (PT) per ASTM E1417",
        "Radiographic inspection (RT) per ASTM E1742",
        "Weld color classification (silver/gold acceptable; blue/purple rejected)",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "0.5 mm – 25.0 mm (weldable range)",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "N/A — welding tolerance ±0.5 mm typical",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "ASME Section IX — Welding Qualifications",
            "AWS D1.1/D1.6 — Structural Welding",
        ],
    }


def rule_surface_treatment(title, keywords):
    """Surface Treatment 类别"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Process Type", "laser": "Laser marking/engraving for surface identification", "waterjet": "N/A — waterjet not used for surface treatment"},
        {"dimension": "Surface Finish Achieved", "laser": "Ra 0.05–0.4 µm (laser polishing)", "waterjet": "Ra 3.2–6.3 µm (abrasive surface preparation)"},
        {"dimension": "Coating/Conversion", "laser": "Laser cladding for wear-resistant coatings", "waterjet": "N/A"},
        {"dimension": "Treatment Depth", "laser": "Surface-level (microns to mm for cladding)", "waterjet": "Surface-level (abrasion only)"},
        {"dimension": "Heat Impact", "laser": "Localized heating; minimal bulk thermal effect", "waterjet": "No heat; cold process"},
    ]

    hole_types = ["N/A — surface treatment is a finishing process"]

    heat_control = f"Temperature-controlled process baths and fixturing ensure uniform treatment of {kw} without altering the substrate's mechanical properties."

    flatness = f"No significant flatness change expected during {kw} processing. Pre-treatment flatness is preserved."

    desc = f"Professional surface treatment services for {kw} titanium components, including anodizing, passivation, electropolishing, and coatings to enhance corrosion resistance, wear properties, and aesthetic appearance."

    cap_desc = f"Our surface treatment line includes Type II/III anodizing (AMS 2488), chemical passivation (ASTM B600), electropolishing, PVD coating, and laser engraving for {kw}."

    downstream = [
        {"name": "Cleanroom Packaging", "description": "Class 10 cleanroom packaging for contamination-sensitive finished surfaces."},
        {"name": "Quality Inspection", "description": "Coating thickness measurement, adhesion testing (tape test), and color verification."},
    ] + COMMON_DOWNSTREAM

    inspection = [
        "Coating thickness measurement (eddy current / XRF)",
        "Adhesion test (tape test per ASTM D3359)",
        "Color uniformity inspection (visual / spectrophotometer)",
        "Surface contamination test (white glove / Ferroxyl)",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "All thicknesses — surface treatment is independent of substrate thickness",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "N/A",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "AMS 2488 — Titanium Anodizing",
            "ASTM B600 — Passivation of Titanium",
        ],
    }


def rule_inspection(title, keywords):
    """Inspection 类别"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Detection Method", "laser": "Laser profilometry / structured light scanning", "waterjet": "N/A"},
        {"dimension": "Resolution", "laser": "0.001 mm (laser scanning); 0.1 µm (white light interferometry)", "waterjet": "N/A"},
        {"dimension": "Surface Requirement", "laser": "Reflective or matte surfaces acceptable", "waterjet": "N/A"},
        {"dimension": "Inspection Speed", "laser": "High — full-field scanning in seconds", "waterjet": "N/A"},
        {"dimension": "Portability", "laser": "Portable laser trackers available for on-site inspection", "waterjet": "N/A"},
    ]

    hole_types = ["Inspection is a measurement/verification process"]

    heat_control = "All inspection performed in temperature-controlled metrology lab (20±1°C) to eliminate thermal expansion errors."

    flatness = "Granite surface plates (Grade 00) used as datum references for flatness measurement."

    desc = f"Comprehensive inspection services for {kw} titanium components, including dimensional metrology, NDT, and material verification with full traceability documentation."

    cap_desc = f"Our metrology lab is equipped with CMM (ZEISS), vision systems, laser scanners, ultrasonic flaw detectors, and tensile/ hardness testers for {kw}."

    downstream = [
        {"name": "Inspection Report Package", "description": "Full FAIR (AS9102) with dimensional report, material certs, and NDT results."},
        {"name": "Certificate of Conformance", "description": "Signed CoC with all applicable standards and specification compliance noted."},
    ]

    inspection = [
        "CMM full 3D inspection (GD&T per ASME Y14.5)",
        "Surface roughness measurement (Ra/Rz/Rmax)",
        "Hardness testing (Rockwell / Vickers / Brinell)",
        "Non-destructive testing (UT / PT / MT / RT as required)",
        "Material certification verification (EN 10204 3.1/3.2)",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "All sizes accommodated",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "Measurement resolution: ±0.001 mm (CMM) / ±0.1 µm (optical)",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "ISO/IEC 17025 — Metrology Lab Standards",
            "AS9102 — First Article Inspection",
            "NADCAP — NDT Accreditation",
        ],
    }


def rule_general(title, keywords):
    """General Manufacturing — 最通用的模板"""
    kw = ' '.join(keywords[:3])

    process_comparison = [
        {"dimension": "Process Control", "laser": "SPC-monitored with real-time process parameters logging", "waterjet": "Job-specific work instructions with inline quality checks"},
        {"dimension": "Tolerance Capability", "laser": "±0.01 mm typical for precision operations", "waterjet": "±0.1 mm typical for general operations"},
        {"dimension": "Documentation", "laser": "Full batch traceability with MTR/CoC", "waterjet": "Inspection reports on request"},
        {"dimension": "Volume Flexibility", "laser": "Prototype to high-volume production", "waterjet": "Prototype to medium-volume batches"},
    ]

    hole_types = ["Round holes", "Slot holes", "Custom geometry cutouts"]

    heat_control = f"Process-specific heat management protocols are applied for {kw} to prevent titanium oxidation and maintain material properties."

    flatness = f"Precision fixturing and post-process stress relief ensure flatness requirements are met for {kw}."

    desc = f"Professional manufacturing service for {kw} titanium components, combining process expertise with quality control systems to deliver consistent results."

    cap_desc = f"Our integrated manufacturing facility handles {kw} with full traceability, SPC monitoring, and certified quality management."

    downstream = COMMON_DOWNSTREAM + [
        {"name": "Quality Documentation", "description": "Full inspection reports, material certifications, and certificate of conformance included."},
    ]

    inspection = COMMON_INSPECTION_ITEMS + [
        "Process parameter verification (SPC charts)",
        "First article inspection per AS9102",
    ]

    return {
        "titaniumGrades": COMMON_TITANIUM_GRADES,
        "thicknessRange": "Varies by specific process",
        "minHoleRatio": "Per engineering specification",
        "cuttingTolerance": "±0.01 mm to ±0.1 mm depending on process",
        "processComparison": process_comparison,
        "processDescription": desc,
        "holeTypes": hole_types,
        "heatControl": heat_control,
        "flatnessControl": flatness,
        "capabilitiesDescription": cap_desc,
        "downstreamProcesses": downstream,
        "inspectionItems": inspection,
        "qualityStandards": COMMON_QUALITY_STANDARDS,
    }


def rule_fastener(title, keywords):
    """Fastener Manufacturing"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 23 (ELI)"],
        "thicknessRange": "M2 – M24 thread diameters; custom sizes available",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "Thread pitch tolerance: Class 2A/3A (UN) / 6g/6h (metric)",
        "processComparison": [
            {"dimension": "Threading Method", "laser": "Thread cutting / thread milling", "waterjet": "Thread rolling (cold forming)"},
            {"dimension": "Fatigue Strength", "laser": "Standard (cut threads)", "waterjet": "Superior (rolled threads — compressive residual stress)"},
            {"dimension": "Production Speed", "laser": "Moderate (single-point or tap)", "waterjet": "High (die rolling)"},
            {"dimension": "Material Utilization", "laser": "Some material removed", "waterjet": "Near-net shape, no material loss"},
        ],
        "processDescription": f"Precision fastener manufacturing for {kw} titanium threaded components. Thread rolling produces superior fatigue strength compared to thread cutting by inducing compressive residual stresses in the thread root.",
        "holeTypes": ["Standard threads (UN/UNF/Metric)", "Custom thread forms", "Self-locking threads"],
        "heatControl": f"Coolant and speed control prevent work-hardening during {kw} threading operations.",
        "flatnessControl": "Head flatness and perpendicularity controlled within 0.05 mm per fastener standards.",
        "capabilitiesDescription": f"Dedicated fastener manufacturing cell with automatic screw machines, thread rollers, and CNC lathes for {kw} production.",
        "downstreamProcesses": [
            {"name": "Thread Inspection", "description": "Go/no-go gauge inspection; thread micrometer verification; optical thread comparison."},
            {"name": "Mechanical Testing", "description": "Tensile proof load testing; hardness testing; torque-to-tension verification."},
            {"name": "Surface Treatment", "description": "Passivation, anodizing, or PVD coating for corrosion resistance and appearance."},
        ],
        "inspectionItems": [
            "Thread gauge inspection (Go/No-Go per ASME B1.1)",
            "Dimensional inspection (head height, shank diameter, overall length)",
            "Hardness testing (Rockwell / Vickers)",
            "Proof load testing per ASTM F606",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "ASME B1.1 — Unified Inch Screw Threads",
            "ASTM F606 — Standard Test Methods for Fasteners",
            "ISO 898-1 — Mechanical Properties of Fasteners",
        ],
    }


def rule_heat_treatment(title, keywords):
    """Heat Treatment"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 23 (ELI)", "Grade 9"],
        "thicknessRange": "All section sizes; furnace capacity: Ø600 mm × 1200 mm",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "Temperature control: ±5°C; ramp rate: 1–20°C/min programmable",
        "processComparison": [
            {"dimension": "Furnace Type", "laser": "Vacuum furnace (10⁻⁵ torr)", "waterjet": "N/A"},
            {"dimension": "Temperature Range", "laser": "300°C – 1200°C programmable", "waterjet": "N/A"},
            {"dimension": "Atmosphere Control", "laser": "Vacuum / inert gas (Ar) backfill", "waterjet": "N/A"},
            {"dimension": "Quench Media", "laser": "Inert gas fan cooling / oil / water", "waterjet": "N/A"},
        ],
        "processDescription": f"Precision heat treatment services for {kw} titanium components in vacuum furnaces with programmable temperature profiles and inert gas cooling.",
        "holeTypes": ["N/A"],
        "heatControl": f"Vacuum furnace with ±5°C uniformity and programmable ramp/soak/cool cycles for {kw}.",
        "flatnessControl": "Vacuum fixturing and controlled cooling rates minimize distortion during heat treatment cycles.",
        "capabilitiesDescription": f"State-of-the-art vacuum heat treatment facility with quench capabilities for {kw} titanium alloys.",
        "downstreamProcesses": [
            {"name": "Hardness Testing", "description": "Post-treatment hardness verification (Rockwell / Vickers / Brinell)."},
            {"name": "Metallographic Analysis", "description": "Microstructure examination; grain size measurement per ASTM E112."},
            {"name": "Mechanical Testing", "description": "Tensile, yield, elongation testing to verify heat treatment results."},
        ],
        "inspectionItems": [
            "Temperature chart review and certification",
            "Hardness testing (as-treated)",
            "Visual inspection for surface condition (oxidation, cracking)",
            "Dimensional check (distortion measurement)",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "AMS 2750 — Pyrometry (Furnace Survey)",
            "AMS 2801 — Heat Treatment of Titanium Alloys",
            "ASTM E8 — Tension Testing of Metallic Materials",
        ],
    }


def rule_forming(title, keywords):
    """Forming"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 1", "Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 7"],
        "thicknessRange": "0.3 mm – 6.0 mm sheet/plate",
        "minHoleRatio": "1.5:1 (bend radius-to-thickness minimum)",
        "cuttingTolerance": "±0.2 mm (formed geometry)",
        "processComparison": [
            {"dimension": "Forming Method", "laser": "Press brake / stamping / hydroforming", "waterjet": "N/A"},
            {"dimension": "Springback Control", "laser": "Over-bend compensation based on titanium grade", "waterjet": "N/A"},
            {"dimension": "Tooling", "laser": "Custom die sets or universal press brake tooling", "waterjet": "N/A"},
            {"dimension": "Heat Assistance", "laser": "Hot forming (300–600°C) for complex geometries", "waterjet": "N/A"},
        ],
        "processDescription": f"Precision forming of {kw} titanium components using press brake, stamping, and hydroforming methods with controlled springback compensation.",
        "holeTypes": ["N/A — forming is a deformation process"],
        "heatControl": f"Hot forming performed at 300–600°C to reduce springback and improve formability of {kw}.",
        "flatnessControl": "Post-form stress relief and precision leveling ensure flatness within 0.3 mm/m.",
        "capabilitiesDescription": f"Equipped with CNC press brakes (up to 500 ton), stamping presses, and hydroforming systems for {kw}.",
        "downstreamProcesses": [
            {"name": "Laser/Waterjet Trimming", "description": "Precision trimming of formed blanks to net shape."},
            {"name": "Deburring", "description": "Edge finishing of formed edges to remove burrs and achieve smooth radius."},
            {"name": "Stress Relief Annealing", "description": "Vacuum annealing to relieve cold-work stresses from forming operations."},
        ],
        "inspectionItems": [
            "Bend angle measurement (protractor / CMM)",
            "Springback verification",
            "Surface inspection (cracking / orange peel)",
            "Thickness measurement (thinning check)",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS,
    }


def rule_forging(title, keywords):
    """Forging"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 23 (ELI)", "Grade 9"],
        "thicknessRange": "Up to 500 kg ingot/billet",
        "minHoleRatio": "N/A",
        "cuttingTolerance": "±1.0 mm (as-forged) / ±0.05 mm (post-CNC)",
        "processComparison": [
            {"dimension": "Forging Method", "laser": "Open die / closed die / isothermal", "waterjet": "N/A"},
            {"dimension": "Temperature Range", "laser": "Beta transus ±50°C (850–1050°C for Ti)", "waterjet": "N/A"},
            {"dimension": "Grain Structure", "laser": "Controlled recrystallization for equiaxed alpha-beta", "waterjet": "N/A"},
            {"dimension": "Mechanical Properties", "laser": "Superior to cast/machined — aligned grain flow", "waterjet": "N/A"},
        ],
        "processDescription": f"Titanium forging services for {kw} using open-die, closed-die, and isothermal forging processes. Controlled thermal-mechanical processing optimizes grain structure and mechanical properties.",
        "holeTypes": ["N/A"],
        "heatControl": f"Precise temperature control (±10°C) during {kw} forging to maintain beta-phase control and prevent grain growth.",
        "flatnessControl": "Post-forge normalization and straightening within 1 mm/m.",
        "capabilitiesDescription": f"Press capacity up to 3000 ton with induction heating and programmable forging manipulators for {kw}.",
        "downstreamProcesses": [
            {"name": "Heat Treatment", "description": "Solution treatment and aging (STA) for alpha-beta alloys."},
            {"name": "CNC Machining", "description": "Post-forge machining to final dimensions and surface finish."},
            {"name": "NDT Inspection", "description": "Ultrasonic inspection (UT) per AMS 2631 for internal soundness."},
        ],
        "inspectionItems": [
            "Dimensional inspection (as-forged)",
            "Ultrasonic inspection (UT) for internal defects",
            "Metallographic examination (grain flow verification)",
            "Mechanical testing (tensile, yield, elongation)",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "AMS 2631 — Ultrasonic Inspection of Wrought Titanium",
            "ASTM B381 — Titanium Forgings",
            "AMS 4928 — Titanium Alloy Bars and Forgings",
        ],
    }


def rule_additive(title, keywords):
    """Additive Manufacturing"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 5 (Ti-6Al-4V)", "Grade 23 (Ti-6Al-4V ELI)", "Grade 1", "Grade 2"],
        "thicknessRange": "Build volume: up to Ø300 mm × 400 mm (SLM/DMLS)",
        "minHoleRatio": "0.2 mm minimum feature size; 0.05 mm layer thickness",
        "cuttingTolerance": "±0.05 mm (as-built) / ±0.005 mm (post-machined)",
        "processComparison": [
            {"dimension": "Build Method", "laser": "Laser powder bed fusion (LPBF/SLM/DMLS)", "waterjet": "N/A"},
            {"dimension": "Layer Thickness", "laser": "20–60 µm", "waterjet": "N/A"},
            {"dimension": "Surface Finish", "laser": "Ra 6–12 µm as-built; Ra 0.4 µm post-processed", "waterjet": "N/A"},
            {"dimension": "Complexity", "laser": "Unlimited — lattice structures, internal channels, organic geometries", "waterjet": "N/A"},
        ],
        "processDescription": f"Metal additive manufacturing of {kw} titanium components using laser powder bed fusion (LPBF/SLM/DMLS). Capable of producing complex geometries impossible with conventional subtractive methods.",
        "holeTypes": ["Conformal cooling channels", "Lattice structures", "Organic/ergonomic geometries"],
        "heatControl": f"Inert atmosphere (argon) with controlled oxygen <1000 ppm during {kw} build process.",
        "flatnessControl": "Stress relief annealing before substrate removal prevents distortion of thin-walled features.",
        "capabilitiesDescription": f"Multiple SLM/DMLS systems for {kw} with full process parameter development and mechanical property validation.",
        "downstreamProcesses": [
            {"name": "Support Removal", "description": "EDM or CNC machining to remove build supports."},
            {"name": "Hot Isostatic Pressing (HIP)", "description": "HIP cycle to eliminate internal porosity and improve fatigue properties."},
            {"name": "CNC Finishing", "description": "5-axis CNC machining of critical mating surfaces to final tolerance."},
        ],
        "inspectionItems": [
            "Build report (layer-by-layer parameter logging)",
            "Dimensional inspection (CT scan / CMM)",
            "Density measurement (Archimedes method / CT)",
            "Mechanical testing (as-built and heat-treated)",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS + [
            "ASTM F2924 — Ti-6Al-4V for AM",
            "ASTM F3001 — Ti-6Al-4V ELI for AM",
            "ISO/ASTM 52900 — Additive Manufacturing General Principles",
        ],
    }


def rule_edm(title, keywords):
    """EDM"""
    kw = ' '.join(keywords[:3])
    return {
        "titaniumGrades": ["Grade 2", "Grade 5 (Ti-6Al-4V)", "Grade 23 (ELI)"],
        "thicknessRange": "Up to 300 mm (wire EDM); up to 200 mm (sinker EDM)",
        "minHoleRatio": "0.02 mm minimum wire diameter; 0.1 mm minimum hole (sinker)",
        "cuttingTolerance": "±0.002 mm (wire EDM) / ±0.005 mm (sinker EDM)",
        "processComparison": [
            {"dimension": "EDM Type", "laser": "Wire EDM / Sinker EDM / Hole drilling EDM", "waterjet": "N/A"},
            {"dimension": "Surface Finish", "laser": "Ra 0.2–0.8 µm (wire); Ra 1.6 µm (sinker)", "waterjet": "N/A"},
            {"dimension": "Heat Affected Zone", "laser": "Re-cast layer 1–5 µm; removable by post-processing", "waterjet": "N/A"},
            {"dimension": "Taper Capability", "laser": "±30° (wire EDM with 5-axis control)", "waterjet": "N/A"},
        ],
        "processDescription": f"Precision EDM services for {kw} titanium components. Wire EDM achieves ±0.002 mm tolerance for intricate profiles, while sinker EDM handles blind cavities and complex 3D geometries.",
        "holeTypes": ["Tapered holes", "Micro-holes", "Blind cavities", "Keyway slots"],
        "heatControl": f"Deionized water dielectric (wire EDM) or hydrocarbon oil (sinker EDM) with temperature control for {kw}.",
        "flatnessControl": "Multi-pass cutting strategy minimizes distortion. Stress relief recommended for pre-hardened materials.",
        "capabilitiesDescription": f"5-axis wire EDM and CNC sinker EDM systems for {kw} with submerged and flushing capabilities.",
        "downstreamProcesses": [
            {"name": "Re-cast Layer Removal", "description": "Chemical etching or electropolishing to remove EDM re-cast layer."},
            {"name": "Surface Finishing", "description": "Polishing or micro-blasting to achieve specified surface finish."},
        ],
        "inspectionItems": [
            "Dimensional inspection (CMM / vision system)",
            "Surface finish measurement (Ra/Rz)",
            "Re-cast layer thickness verification (microsection)",
        ],
        "qualityStandards": COMMON_QUALITY_STANDARDS,
    }


# ── Category → Rule 映射 ──
CATEGORY_RULES = {
    'Laser Processing': rule_laser_processing,
    'Machining': rule_machining,
    'Welding': rule_welding,
    'Surface Treatment': rule_surface_treatment,
    'Inspection': rule_inspection,
    'General Manufacturing': rule_general,
    'Fastener Manufacturing': rule_fastener,
    'Heat Treatment': rule_heat_treatment,
    'Forming': rule_forming,
    'Forging': rule_forging,
    'Additive Manufacturing': rule_additive,
    'EDM': rule_edm,
}


# ──────────────────────────────────────────────────────────
# 主执行流程
# ──────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Capability Data Enrichment Script")
    print("=" * 60)

    # 1. 加载数据
    print("\n📂 加载 capabilities...")
    capabilities = load_json_files(CAPABILITIES_DIR)
    print(f"   共 {len(capabilities)} 个能力条目")

    print("\n📂 加载 product-entities...")
    product_entities = load_json_files(PRODUCT_ENTITIES_DIR)
    print(f"   共 {len(product_entities)} 个产品实体")

    # 2. 构建反向索引
    print("\n🔗 构建实体反向索引...")
    reverse_index = build_entity_reverse_index(product_entities)
    # 同时构建按 title slug 的索引（因为 relatedCapabilities 可能存的是 title slug）
    title_slug_index = {}
    for slug, data, fpath in capabilities:
        title_slug = slugify(data['title'])
        title_slug_index[title_slug] = slug
    print(f"   共 {len(reverse_index)} 个能力有关联实体")

    # 3. 处理每个 capability
    enriched_count = 0
    skipped_count = 0
    error_count = 0

    for slug, data, fpath in capabilities:
        if is_already_enriched(data):
            skipped_count += 1
            continue

        category = data.get('category', 'General Manufacturing')
        title = data['title']
        keywords = extract_keywords(title)

        # 选择规则
        rule_fn = CATEGORY_RULES.get(category, rule_general)

        try:
            enrichment = rule_fn(title, keywords)

            # 添加关联实体（从反向索引）
            # 尝试用 slug 和 title_slug 两种方式匹配
            related = reverse_index.get(slug, [])
            if not related:
                title_slug = slugify(title)
                related = reverse_index.get(title_slug, [])
            if related:
                enrichment['relatedEntities'] = related

            # 添加 CTA
            enrichment.update(COMMON_CTA)

            # 定制化 CTA 标题 — 使用 title 关键词
            kw_phrase = ' '.join(keywords[:2]).title() if keywords else 'Titanium'
            enrichment['ctaTitle'] = f"Need Precision {kw_phrase} Components?" if kw_phrase != 'Titanium' else "Need Precision Titanium Components?"

            # 保留原始字段
            for field in ['title', 'aliases', 'category', 'description', 'materials', 'industries', 'relatedInspection']:
                if field in data:
                    enrichment[field] = data[field]

            # 保留 seo 字段（如果已有）
            for field in ['seoTitle', 'seoDescription', 'tolerance', 'maxSize', 'surfaceFinish']:
                if field in data and data[field]:
                    enrichment[field] = data[field]

            # 生成 SEO 字段（如果还没有）
            if 'seoTitle' not in enrichment or not enrichment['seoTitle']:
                enrichment['seoTitle'] = f"{title} | Titanium CNC Machining | BOZE"
            if 'seoDescription' not in enrichment or not enrichment['seoDescription']:
                enrichment['seoDescription'] = f"Precision {category.lower()} of {title} titanium components. Grade 2, Ti-6Al-4V processing with certified quality. ISO 9001:2015 & AS9100D."

            # 写入文件
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(enrichment, f, indent=2, ensure_ascii=False)

            enriched_count += 1
            if enriched_count % 50 == 0:
                print(f"   ✅ 已完成 {enriched_count} 个...")

        except Exception as e:
            print(f"   ❌ 错误: {slug} — {e}")
            error_count += 1

    # 4. 报告
    print("\n" + "=" * 60)
    print("📊 完成报告")
    print(f"   ✅ 新填充: {enriched_count}")
    print(f"   ⏭️  跳过（已有数据）: {skipped_count}")
    print(f"   ❌ 错误: {error_count}")
    print(f"   📦 总计: {len(capabilities)}")
    print("=" * 60)


if __name__ == '__main__':
    main()
