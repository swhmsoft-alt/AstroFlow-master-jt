"""Patch process_dictionary.py with additional process entries."""
import re

filepath = __file__.replace('patch_process_dict.py', 'process_dictionary.py')

with open(filepath, encoding='utf-8') as f:
    code = f.read()

additions = r'''

_reg("waterjet cutting", category="Laser Processing",
    specs={"tolerance": "+0.1 mm", "thicknessRange": "0.5 mm - 100 mm+", "surfaceFinish": "Ra 3.2-6.3 um as-cut"},
    processDescription="Abrasive waterjet cutting of titanium uses a high-pressure stream of water mixed with garnet abrasive to erode material. The cold-cutting process produces zero heat-affected zone, ideal for titanium grades sensitive to thermal cracking.",
    heatControl="No heat generated - room temperature waterjet stream. HAZ-free process preserves titanium microstructure.",
    flatnessControl="No thermal distortion. Flatness depends on incoming stock condition.",
    comparison=[
        {"dimension": "Cutting Mechanism", "laser": "High-pressure water + garnet abrasive", "waterjet": "Focused laser beam melts/vaporizes"},
        {"dimension": "HAZ", "laser": "Zero - cold cutting", "waterjet": "0.05-0.15 mm with N2 assist"},
        {"dimension": "Max Thickness", "laser": "100 mm+ (abrasive waterjet)", "waterjet": "15 mm (fiber laser)"},
        {"dimension": "Kerf Width", "laser": "0.7-1.2 mm", "waterjet": "0.1-0.3 mm"},
    ],
    holeTypes=["Large cutouts", "Thick plate piercing"],
    downstreamBase=[{"name": "Drying", "description": "Hot air drying to remove residual moisture from cut surfaces."}],
)

_reg("laser drilling", category="Laser Processing",
    specs={"tolerance": "+0.02 mm (hole diameter)", "thicknessRange": "0.1-8.0 mm", "surfaceFinish": "Spatter ring under 10 um"},
    processDescription="Laser drilling of titanium uses pulsed laser energy to create precise holes through percussion or trepanning methods. Hole diameters range from 0.05 mm to 3 mm with aspect ratios up to 20:1.",
    heatControl="Pulsed fiber laser with nitrogen assist gas. Pulse energy and frequency controlled to minimize recast layer.",
    flatnessControl="Non-contact process; no mechanical distortion. Vacuum fixturing for thin foil.",
    comparison=[
        {"dimension": "Hole Diameter", "laser": "0.05-3 mm", "waterjet": "0.5 mm min (abrasive)"},
        {"dimension": "Aspect Ratio", "laser": "Up to 20:1", "waterjet": "3:1"},
        {"dimension": "Speed", "laser": "0.1-2 sec/hole (percussion)", "waterjet": "N/A"},
    ],
    holeTypes=["Micro-holes", "Cooling holes", "Filter perforations"],
    downstreamBase=[{"name": "Recast Removal", "description": "Chemical etching to remove laser recast layer."}],
)

_reg("sinker edm", category="EDM",
    specs={"tolerance": "+0.005 mm", "thicknessRange": "Cavity depth up to 200 mm", "surfaceFinish": "Ra 1.6 um"},
    processDescription="Sinker EDM uses a shaped graphite or copper electrode to erode complex 3D cavities in titanium by electrical discharge in dielectric oil. Ideal for mold cavities, blind features, and sharp internal corners.",
    heatControl="Hydrocarbon dielectric oil with temperature control +0.5 C. Flushing through electrode for deep cavities.",
    flatnessControl="Multi-electrode roughing to finishing strategy. Graphite wear compensation.",
    comparison=[
        {"dimension": "Electrode", "laser": "Custom-shaped graphite/copper", "waterjet": "Traveling brass wire"},
        {"dimension": "Cavity Shape", "laser": "Blind cavities, 3D contours", "waterjet": "Through-cut profiles"},
        {"dimension": "Surface", "laser": "Ra 1.6 um rough to Ra 0.4 um finish", "waterjet": "Ra 0.2-0.8 um"},
    ],
    holeTypes=["Blind cavities", "Sharp internal corners", "Threaded holes in hardened Ti"],
    downstreamBase=[{"name": "Re-cast Removal", "description": "Chemical etching to remove EDM recast layer."}],
)

_reg("edm drilling", category="EDM",
    specs={"tolerance": "+0.01 mm", "thicknessRange": "Up to 100 mm depth", "surfaceFinish": "Ra 1.6-3.2 um"},
    processDescription="EDM hole drilling uses a rotating tubular electrode with high-pressure dielectric flushing to drill small deep holes in titanium. Ideal for cooling holes, vent holes, and wire threading holes.",
    heatControl="Deionized water dielectric through electrode at high pressure. No bulk heating of workpiece.",
    flatnessControl="Non-contact; no mechanical force. Suitable for thin-wall and delicate structures.",
    comparison=[{"dimension": "Hole Diameter", "laser": "0.3-3 mm", "waterjet": "0.1-0.5 mm (laser)"}],
    holeTypes=["Cooling holes", "Vent holes", "Start holes for wire EDM"],
    downstreamBase=[{"name": "De-burr", "description": "Light manual deburring of hole entries."}],
)

_reg("cnc turning", category="Machining",
    specs={"tolerance": "+0.01 mm (diameter)", "thicknessRange": "Up to 400 mm diameter x 1000 mm length", "surfaceFinish": "Ra 0.4-1.6 um"},
    processDescription="CNC turning of titanium on multi-axis lathes produces cylindrical components with precision diameters and surface finishes. Live tooling enables milling and drilling in the same setup.",
    heatControl="High-pressure coolant-through-tool for chip breaking and heat evacuation.",
    flatnessControl="Steady rests for long slender parts. Stress-relieved stock recommended.",
    comparison=[{"dimension": "Setup", "laser": "Single setup with live tooling", "waterjet": "Multiple ops required"}],
    holeTypes=["Bored holes", "Threaded IDs and ODs"],
    downstreamBase=[{"name": "Deburring", "description": "Manual or robotic edge finishing."}],
)

_reg("laser welding", category="Welding",
    specs={"tolerance": "Weld seam +0.1 mm", "thicknessRange": "0.2-6.0 mm", "surfaceFinish": "Silver/gold acceptable"},
    processDescription="Laser beam welding of titanium uses a focused fiber laser to create deep, narrow welds with minimal heat input. Keyhole mode welding achieves depth-to-width ratios up to 10:1.",
    heatControl="Argon shielding at weld zone and trailing shield. Interpass temperature kept below 100 C.",
    flatnessControl="Vacuum or magnetic fixturing for thin-gauge weldments.",
    comparison=[
        {"dimension": "Heat Input", "laser": "Very low - narrow HAZ", "waterjet": "Higher - wider HAZ"},
        {"dimension": "Speed", "laser": "Up to 5 m/min", "waterjet": "100-300 mm/min (TIG)"},
        {"dimension": "Depth:Width", "laser": "Up to 10:1 (keyhole mode)", "waterjet": "1:1 typical (TIG)"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[{"name": "Weld Inspection", "description": "Visual, PT, or UT inspection per applicable code."}],
)

_reg("eb welding", category="Welding",
    specs={"tolerance": "Weld seam +0.05 mm", "thicknessRange": "Up to 100 mm single-pass", "surfaceFinish": "Silver/gold acceptable"},
    processDescription="Electron beam welding of titanium in vacuum produces deep, narrow welds with minimal distortion. Single-pass welds up to 100 mm thickness without filler metal.",
    heatControl="Vacuum chamber at 10e-4 torr eliminates oxidation. Precision beam positioning.",
    flatnessControl="Zero atmospheric contamination. Fixture maintains alignment under vacuum.",
    comparison=[{"dimension": "Penetration", "laser": "Up to 100 mm single-pass", "waterjet": "Up to 12 mm (laser welding)"}],
    holeTypes=["N/A"],
    downstreamBase=[{"name": "Post-Weld Heat Treatment", "description": "Stress relief annealing in vacuum furnace."}],
)
'''

# Insert before find_process_entry
insert_pos = code.rfind('def find_process_entry')
if insert_pos > 0:
    code = code[:insert_pos] + additions + '\n\n' + code[insert_pos:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Patched: inserted {len(additions)} chars before find_process_entry")
else:
    print("ERROR: Could not find find_process_entry")

# Also add waterjet and other keywords to the category fallback
code = open(filepath, encoding='utf-8').read()
old_fallback = '''    for cat_key, lookup_key in [
        ("inspect", "cmm inspection"), ("laser", "laser cutting"),
        ("weld", "tig welding"), ("machin", "5-axis cnc milling"),
        ("turn", "swiss turning"), ("anneal", "vacuum heat treatment"),
        ("heat", "vacuum heat treatment"),
        ("surface", "anodizing"), ("additive", "slm 3d printing"),
        ("form", "bend forming"), ("forg", "closed-die forging"),
        ("edm", "wire edm"), ("mark", "laser marking"),
        ("thread", "thread rolling"),
        ("clean", "ultrasonic cleaning"),
    ]:'''
new_fallback = '''    for cat_key, lookup_key in [
        ("inspect", "cmm inspection"), ("laser", "laser cutting"),
        ("weld", "tig welding"), ("machin", "5-axis cnc milling"),
        ("turn", "swiss turning"), ("anneal", "vacuum heat treatment"),
        ("heat", "vacuum heat treatment"),
        ("waterjet", "waterjet cutting"), ("water", "waterjet cutting"),
        ("surface", "anodizing"), ("additive", "slm 3d printing"),
        ("form", "bend forming"), ("forg", "closed-die forging"),
        ("edm", "wire edm"), ("mark", "laser marking"),
        ("drill", "laser drilling"), ("engrav", "laser engraving"),
        ("stamp", "bend forming"), ("punch", "bend forming"),
        ("thread", "thread rolling"),
        ("clean", "ultrasonic cleaning"),
    ]:'''
if old_fallback in code:
    code = code.replace(old_fallback, new_fallback)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Updated category fallback keywords")
else:
    print("WARNING: Could not find old fallback to replace")
    # Show what we found
    import re
    match = re.search(r'for cat_key, lookup_key in \[.*?\]:', code, re.DOTALL)
    if match:
        print(f"Found: {match.group()[:80]}...")
