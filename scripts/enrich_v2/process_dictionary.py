"""
PROCESS 词典 — 每个工艺有其独特的工业极限参数和描述文本。
"""
import re

PROCESS_DICT = {}

def _reg(name, **kw):
    PROCESS_DICT[name] = kw

# ═══ 1. 5-Axis CNC ═══
_reg("5-axis", category="Machining",
    specs={
        "tolerance": "±0.005 mm (positioning) / ±0.01 mm (contour)",
        "thicknessRange": "Up to Ø800 mm × 500 mm (5-axis envelope)",
        "surfaceFinish": "Ra 0.4–0.8 µm (machined) / Ra 0.05 µm (polished)",
    },
    processDescription=(
        "Simultaneous 5-axis CNC milling enables complex freeform geometries to be machined in a single setup, "
        "eliminating positional errors from multiple fixtures. The rotary A and C axes provide full access to "
        "undercut features and compound-angle surfaces while maintaining optimal tool engagement angles for titanium."
    ),
    heatControl=(
        "Through-spindle coolant at 70 bar with cryogenic CO\u2082 assist. "
        "Tool engagement angles continuously optimized by CAM to avoid work-hardening of Ti-6Al-4V."
    ),
    flatnessControl=(
        "Roughing/finishing strategy with 10% radial engagement and adaptive trochoidal toolpaths. "
        "Post-process CMM verification ensures flatness within 0.005 mm over 200 mm."
    ),
    comparison=[
        {"dimension": "Axes Simultaneous", "laser": "5 axes (X/Y/Z + A/C rotary)", "waterjet": "3+2 axes (positional)"},
        {"dimension": "Best For", "laser": "Blisk, impeller, turbine blade, complex bracket", "waterjet": "Prismatic mill-turn parts"},
        {"dimension": "Surface Finish (Ti)", "laser": "Ra 0.4 µm with small-step finishing", "waterjet": "Ra 1.6\u20133.2 µm"},
        {"dimension": "Cycle Time", "laser": "30\u201370% faster than 3+2 for complex surfaces", "waterjet": "Faster for simple prismatic features"},
    ],
    holeTypes=["Freeform 3D contoured holes", "Compound-angle coolant passages", "Threaded holes in non-orthogonal faces"],
    downstreamBase=[
        {"name": "CMM 5-Axis Inspection", "description": "Full 5-axis CMM inspection with scanning probes for profile tolerance verification per ASME Y14.5."},
        {"name": "Surface Finishing", "description": "CNC polishing or micro-blasting to achieve specified Ra on aerodynamic surfaces."},
    ],
)

_reg("5-axis cnc milling", category="Machining",
    specs={
        "tolerance": "±0.01 mm (positional) / ±0.02 mm (contour)",
        "thicknessRange": "Up to Ø600 mm × 400 mm",
        "surfaceFinish": "Ra 0.8 µm (standard) / Ra 0.2 µm (precision)",
    },
    processDescription=(
        "5-axis CNC milling centers provide simultaneous multi-axis interpolation for complex titanium components. "
        "The ability to tilt the tool relative to the workpiece surface maintains optimal chip load and extends tool life, "
        "critical for difficult-to-machine titanium alloys."
    ),
    heatControl=(
        "High-pressure coolant-through-spindle (50\u201370 bar) with coated carbide tooling. "
        "Adaptive trochoidal milling paths reduce radial engagement to control heat generation."
    ),
    flatnessControl=(
        "Stress-relieved raw material and sequenced roughing/finishing passes. "
        "Heat-sink fixturing for thin-wall sections minimizes thermal distortion."
    ),
    comparison=[
        {"dimension": "Kinematics", "laser": "Full 5-axis simultaneous interpolation", "waterjet": "3+2 positional indexing"},
        {"dimension": "Surface Finish", "laser": "Ra 0.8 µm standard; Ra 0.2 µm with finishing pass", "waterjet": "Ra 1.6\u20136.3 µm"},
        {"dimension": "Tool Access", "laser": "Unrestricted \u2014 tool can approach from any angle", "waterjet": "Limited \u2014 each setup indexes the part"},
    ],
    holeTypes=["Coolant passages", "Threaded holes at compound angles", "Counterbored fastener holes"],
    downstreamBase=[
        {"name": "Deburring", "description": "Manual or robotic deburring of sharp edges and thread protection."},
    ],
)

# ═══ 2. Swiss Turning ═══
_reg("swiss turning", category="Machining",
    specs={
        "tolerance": "±0.005 mm (diameter) / ±0.01 mm (length)",
        "thicknessRange": "Ø0.5 mm \u2013 Ø32 mm bar stock; up to 200 mm length",
        "surfaceFinish": "Ra 0.2\u20130.8 µm as-turned",
    },
    processDescription=(
        "Swiss-type automatic lathes use a sliding headstock and fixed guide bushing to machine slender titanium components. "
        "The guide bushing supports the bar stock immediately behind the cutting tool, eliminating deflection for high length-to-diameter ratios."
    ),
    heatControl=(
        "Synchronized guide bushing with high-pressure oil coolant. "
        "Tool engagement is distributed across multiple axes simultaneously, spreading thermal load."
    ),
    flatnessControl=(
        "Guide bushing support eliminates deflection for L:D ratios up to 20:1. "
        "Straightness within 0.005 mm over 100 mm length."
    ),
    comparison=[
        {"dimension": "Bar Support", "laser": "Guide bushing supports stock at tool contact point", "waterjet": "Chuck-only \u2014 no bushing"},
        {"dimension": "L:D Ratio", "laser": "Up to 20:1 without chatter", "waterjet": "< 4:1 typical"},
        {"dimension": "Cycle Time", "laser": "Single op \u2014 mill, drill, turn simultaneously", "waterjet": "Multiple ops, longer cycle"},
    ],
    holeTypes=["Cross-drilled holes", "Eccentric bores", "Threaded holes (internal/external)", "Hexagonal/star drives"],
    downstreamBase=[
        {"name": "Thread Rolling", "description": "Cold-forming of threads for superior fatigue performance."},
        {"name": "Centerless Grinding", "description": "OD grinding for precision diameters (±0.002 mm)."},
    ],
)

_reg("watch turning", category="Machining",
    specs={
        "tolerance": "±0.003 mm (diameter) / ±0.005 mm (length)",
        "thicknessRange": "Ø0.3 mm \u2013 Ø12 mm bar stock (watch-scale)",
        "surfaceFinish": "Ra 0.1\u20130.4 µm as-turned; mirror finish available",
    },
    processDescription=(
        "Micro-Swiss turning for horological components demands sub-0.005 mm tolerances on features as small as Ø0.3 mm. "
        "Watch pinions, balance staffs, and screw blanks require burr-free edges and mirror-grade surface finishes "
        "achieved through precision-ground CBN tooling and micron-level axis control."
    ),
    heatControl=(
        "Micro-lubrication with precision oil mist; minimal heat generation at micro-scale. "
        "Thermal growth compensated by real-time spindle load monitoring."
    ),
    flatnessControl=(
        "Guide bushing with sub-micron runout for watch-scale components. "
        "Optical post-process inspection for runout < 2 µm."
    ),
    comparison=[
        {"dimension": "Part Scale", "laser": "Micro-turning (Ø0.3\u201312 mm)", "waterjet": "Standard turning (Ø5\u201332 mm)"},
        {"dimension": "Tolerance", "laser": "±0.003 mm", "waterjet": "±0.01 mm"},
        {"dimension": "Surface Finish", "laser": "Ra 0.1 µm (mirror)", "waterjet": "Ra 0.4 µm"},
    ],
    holeTypes=["Watch-pinion pivot holes Ø0.08\u20130.5 mm", "Jewel-setting bores"],
    downstreamBase=[
        {"name": "Micro-Deburring", "description": "Precision drag finishing or electrochemical deburring for watch components."},
        {"name": "Optical Inspection", "description": "Automated vision inspection at microscopic scale."},
    ],
)

# ═══ 3. Laser Cutting ═══
_reg("laser cutting", category="Laser Processing",
    specs={
        "tolerance": "±0.05 mm (thin sheet < 3 mm) / ±0.1 mm (plate 3\u201312 mm)",
        "thicknessRange": "0.2 mm \u2013 15.0 mm (fiber laser)",
        "surfaceFinish": "Ra 1.6 µm (post-deburring)",
    },
    processDescription=(
        "Fiber laser cutting of titanium uses a focused 1 µm wavelength beam to melt and expel material through a coaxial "
        "assist gas jet. The narrow kerf (0.1\u20130.3 mm) and small heat-affected zone make it suitable for precision profiles "
        "in sheet and thin-plate titanium components."
    ),
    heatControl=(
        "Coaxial N\u2082 (99.999%) assist gas at 12\u201320 bar prevents titanium oxidation by displacing oxygen. "
        "Laser power modulation controls heat input to minimize HAZ to 0.05\u20130.15 mm."
    ),
    flatnessControl=(
        "Thin-gauge titanium (< 2 mm) may release residual stress during cutting, causing distortion. "
        "Vacuum annealing stress relief at 540\u2013650\u00b0C and roller leveling available."
    ),
    comparison=[
        {"dimension": "Cut Speed (3 mm Ti)", "laser": "Up to 6 m/min", "waterjet": "0.5\u20131.5 m/min"},
        {"dimension": "Kerf Width", "laser": "0.1\u20130.3 mm", "waterjet": "0.7\u20131.2 mm"},
        {"dimension": "HAZ", "laser": "0.05\u20130.15 mm with N\u2082 assist", "waterjet": "Zero HAZ (cold cut)"},
        {"dimension": "Max Thickness", "laser": "15 mm (fiber laser)", "waterjet": "100 mm+"},
    ],
    holeTypes=["Round holes (\u2265 0.5 mm diameter)", "Slots / oblongs", "Micro-perforation arrays"],
    downstreamBase=[
        {"name": "Deburring", "description": "Drag finishing or chemical deburring to remove laser-cut dross."},
        {"name": "Pickling & Passivation", "description": "Nitric-HF acid bath (ASTM B600) to remove heat tint."},
    ],
)

_reg("laser marking", category="Laser Processing",
    specs={
        "tolerance": "Marking depth: 5\u201350 µm; line width 0.05\u20130.5 mm",
        "thicknessRange": "All thicknesses \u2014 surface process only",
        "surfaceFinish": "Contrast: dark/white depending on laser parameters",
    },
    processDescription=(
        "Fiber laser marking on titanium produces high-contrast, permanent identification marks by controlled surface oxidation "
        "or micro-engraving. UDI codes, serial numbers, 2D DataMatrix codes, and logos are marked without cutting into the material, "
        "preserving structural integrity."
    ),
    heatControl=(
        "Pulsed nanosecond fiber laser with galvo scanner. "
        "Marking depth controlled by pulse energy and repetition rate; no bulk heating of the component."
    ),
    flatnessControl=(
        "Non-contact process \u2014 no mechanical force applied. "
        "Focal distance maintained within ±0.5 mm across marking field via autofocus."
    ),
    comparison=[
        {"dimension": "Marking Method", "laser": "Surface oxidation / micro-engraving", "waterjet": "N/A"},
        {"dimension": "Depth", "laser": "5\u201350 µm (engraving mode)", "waterjet": "N/A"},
        {"dimension": "Readability", "laser": "High contrast; permanent; readable after anodizing", "waterjet": "N/A"},
        {"dimension": "Speed", "laser": "Up to 10,000 characters/min (galvo scanner)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Contrast Verification", "description": "Barcode/DataMatrix grade verification per ISO/IEC 15415."},
    ],
)

_reg("laser engraving", category="Laser Processing",
    specs={
        "tolerance": "Engraving depth: 10\u2013200 µm; line width 0.05\u20130.8 mm",
        "thicknessRange": "Surface process \u2014 all part sizes",
        "surfaceFinish": "Matte cavity; raised or recessed text/logo",
    },
    processDescription=(
        "Laser engraving on titanium removes material by ablation to create permanent, tactile markings. "
        "Unlike laser marking (surface oxidation), engraving produces a measurable cavity depth suitable for "
        "logos, part numbers, and decorative features that must withstand wear or post-processing."
    ),
    heatControl=(
        "Nanosecond or picosecond pulsed laser with air/gas assist to eject ablated material. "
        "Multiple-pass strategy for depth control without thermal accumulation."
    ),
    flatnessControl=(
        "Autofocus maintains consistent depth across contoured surfaces. "
        "No mechanical distortion \u2014 non-contact process."
    ),
    comparison=[
        {"dimension": "Depth", "laser": "10\u2013200 µm (removes material)", "waterjet": "0.5\u20135 µm (surface oxidation only)"},
        {"dimension": "Tactile Feel", "laser": "Yes \u2014 detectable by touch", "waterjet": "No \u2014 surface level"},
        {"dimension": "Durability", "laser": "Survives anodizing, passivation, and wear", "waterjet": "May fade with abrasion"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Depth Verification", "description": "Optical profilometer measurement of engraving depth and edge definition."},
    ],
)

# ═══ 4. Laser Perforation ═══
_reg("laser micro-perforation", category="Laser Processing",
    specs={
        "tolerance": "±0.02 mm (hole diameter) / ±0.05 mm (hole position)",
        "thicknessRange": "0.1 mm \u2013 3.0 mm sheet/foil",
        "surfaceFinish": "Bare; spatter ring < 10 µm if present",
    },
    processDescription=(
        "Laser micro-perforation drills high-density hole arrays in titanium sheet for filtration, flow control, "
        "and acoustic applications. Percussion and trepanning strategies produce hole diameters from 0.05 mm to 2 mm "
        "with positional accuracy within ±0.02 mm over the entire pattern."
    ),
    heatControl=(
        "Pulsed femtosecond or nanosecond laser with < 50 µm HAZ per hole. "
        "Galvanometer scanner with nitrogen assist clears ejecta from each hole in real time."
    ),
    flatnessControl=(
        "Vacuum fixture holds thin foil flat during perforation. "
        "Post-process roller leveling for residual stress equalization."
    ),
    comparison=[
        {"dimension": "Min Hole Diameter", "laser": "0.05 mm (percussion drilling)", "waterjet": "0.5 mm (abrasive cutting)"},
        {"dimension": "Hole Density", "laser": "Up to 10,000 holes/cm\u00b2", "waterjet": "Limited by nozzle spacing"},
        {"dimension": "Taper", "laser": "< 5\u00b0 (trepanning strategy)", "waterjet": "0.5\u20131\u00b0 natural taper"},
    ],
    holeTypes=["Micro-holes Ø0.05\u20132 mm", "Conical entrance holes", "Slotted perforations"],
    downstreamBase=[
        {"name": "Ultrasonic Cleaning", "description": "Removes particulate and spatter from micro-holes."},
        {"name": "Optical Inspection", "description": "Automated vision for hole diameter, roundness, position verification."},
    ],
)

# ═══ 5. EDM ═══
_reg("wire edm", category="EDM",
    specs={
        "tolerance": "+0.002 mm (positional) / +0.003 mm (profile)",
        "thicknessRange": "Up to 300 mm (wire); up to 200 mm cavity depth (sinker)",
        "surfaceFinish": "Ra 0.2\u20130.8 µm (multi-pass wire); Ra 1.6 µm (sinker)",
    },
    processDescription=(
        "Wire EDM uses a continuously traveling brass or coated wire electrode under precision CNC control to erode titanium "
        "along a programmed path. Submerged in deionized water dielectric, the process cuts intricate profiles and "
        "sharp internal corners that are impossible with conventional milling."
    ),
    heatControl=(
        "Deionized water dielectric with < 5 µS/cm conductivity and temperature control (+0.5°C). "
        "Multi-pass roughing to finishing with decreasing energy settings."
    ),
    flatnessControl=(
        "Multi-pass cutting strategy and stress-relieved material for thin-walled components. "
        "Anti-vibration wire tensioning for tall cuts up to 300 mm."
    ),
    comparison=[
        {"dimension": "Min Internal Corner R", "laser": "0.015 mm (wire radius)", "waterjet": "0.5 mm (milling)"},
        {"dimension": "Taper Angle", "laser": "+30° (5-axis wire EDM)", "waterjet": "0° (straight cut)"},
        {"dimension": "Re-cast Layer", "laser": "1\u20135 µm; removable by etching", "waterjet": "No re-cast layer"},
    ],
    holeTypes=["Tapered through-holes", "Micro-holes Ø0.1 mm (sinker)", "Keyway slots", "Sharp internal corners"],
    downstreamBase=[
        {"name": "Re-cast Layer Removal", "description": "Chemical etching or electropolishing to remove 1\u20135 µm re-cast layer."},
        {"name": "Surface Polishing", "description": "Micro-blasting or CNC polishing to achieve Ra < 0.4 µm."},
    ],
)

# ═══ 6. TIG Welding ═══
_reg("tig welding", category="Welding",
    specs={
        "tolerance": "Weld distortion: +0.5 mm typical; +0.1 mm with fixture",
        "thicknessRange": "0.5 mm \u2013 12.0 mm weldable",
        "surfaceFinish": "Silver/gold weld color per AMS 4901; blue = oxidation rejection",
    },
    processDescription=(
        "Gas Tungsten Arc Welding (GTAW/TIG) for titanium uses a non-consumable tungsten electrode with argon shielding "
        "at the torch face, trailing shield, and backup purge. Titanium's reactivity above 600°C demands complete "
        "oxygen exclusion until the weld zone cools below 300°C."
    ),
    heatControl=(
        "Triple-shield argon protection: torch nozzle, trailing shield (10\u201320 L/min), and backup purge. "
        "Interpass temperature monitored with IR pyrometer; max 120°C between passes."
    ),
    flatnessControl=(
        "Welding fixture with copper backup bars for heat sinking. "
        "Sequenced stitch welding pattern to balance thermal stresses."
    ),
    comparison=[
        {"dimension": "Heat Input", "laser": "Low \u2014 narrow HAZ (1\u20133 mm)", "waterjet": "N/A"},
        {"dimension": "Shielding", "laser": "Argon face + trailing shield + backup purge", "waterjet": "N/A"},
        {"dimension": "Weld Speed", "laser": "100\u2013300 mm/min (manual); 1000 mm/min (orbital)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Dye Penetrant Inspection", "description": "PT per ASTM E1417 for weld surface defects."},
        {"name": "Weld Color Inspection", "description": "Classification per AMS 4901: silver/gold acceptable; blue/purple rejected."},
    ],
)

# ═══ 7. Vacuum Heat Treatment ═══
_reg("vacuum heat treatment", category="Heat Treatment",
    specs={
        "tolerance": "Temperature: +5°C uniformity; ramp 1\u201320°C/min",
        "thicknessRange": "Furnace: Ø600 × 1200 mm; up to 500 kg load",
        "surfaceFinish": "No oxidation (vacuum < 10\u207b\u2075 torr); bright surface retained",
    },
    processDescription=(
        "Vacuum heat treatment of titanium in a controlled environment prevents oxygen/nitrogen pickup that causes "
        "alpha-case embrittlement. Programmable temperature profiles with inert gas fan cooling enable "
        "solution treatment, aging, stress relief, and annealing in a single cycle."
    ),
    heatControl=(
        "Graphite heating elements with molybdenum radiation shields. "
        "Partial pressure argon backfill during cooling for uniform thermal distribution."
    ),
    flatnessControl=(
        "Ceramic or titanium fixtures maintain component geometry during thermal cycling. "
        "Controlled cooling rate minimizes thermal gradient distortion."
    ),
    comparison=[
        {"dimension": "Atmosphere", "laser": "Vacuum < 10\u207b\u2075 torr", "waterjet": "N/A"},
        {"dimension": "Cooling", "laser": "Inert gas fan cooling (2 bar Ar); oil/water quench", "waterjet": "N/A"},
        {"dimension": "Max Temp", "laser": "1200°C (beta solution treatment)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Hardness Testing", "description": "Rockwell C or Vickers hardness verification post-treatment."},
        {"name": "Metallographic Analysis", "description": "Microstructure examination per ASTM E112."},
    ],
)

# ═══ 8. Anodizing ═══
_reg("anodizing", category="Surface Treatment",
    specs={
        "tolerance": "Coating: 0.5\u20135 µm (Type II) / 5\u201325 µm (Type III); no dimensional change",
        "thicknessRange": "Tank: 1200 × 800 × 600 mm; all part sizes",
        "surfaceFinish": "Retains substrate finish; matte to satin appearance",
    },
    processDescription=(
        "Titanium anodizing (AMS 2488) grows a controlled oxide layer through electrochemical conversion "
        "in an electrolyte bath. Type II produces interference colors (gold, blue, purple, green) for identification "
        "and cosmetics. Type III (hard anodizing) produces a thicker, abrasion-resistant oxide."
    ),
    heatControl=(
        "Electrolyte bath at 20\u201324°C (Type II) or \u20135\u20130°C (Type III). "
        "Voltage ramp programmed to prevent localized overheating and burning."
    ),
    flatnessControl=(
        "No dimensional change \u2014 surface conversion only. "
        "Pre-treatment finish is preserved through the process."
    ),
    comparison=[
        {"dimension": "Coating", "laser": "Electrochemical oxide conversion; not a deposit", "waterjet": "N/A"},
        {"dimension": "Thickness", "laser": "Type II: 0.5\u20135 µm / Type III: 5\u201325 µm", "waterjet": "N/A"},
        {"dimension": "Colors", "laser": "Gold (15V), blue (40V), green (70V), purple (90V)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Sealing", "description": "Hot water or nickel acetate sealing to close micro-porosity."},
        {"name": "Laser Marking", "description": "Post-anodize laser marking for UDI or part ID on oxide layer."},
    ],
)

_reg("passivation", category="Surface Treatment",
    specs={
        "tolerance": "No dimensional change; removes < 1 µm contamination",
        "thicknessRange": "Tank: 1200 × 800 × 600 mm",
        "surfaceFinish": "Strips discoloration; restores uniform matte appearance",
    },
    processDescription=(
        "Chemical passivation of titanium per ASTM B600 removes surface contamination (embedded iron, heat tint) "
        "and restores the natural passive oxide layer. The nitric-hydrofluoric acid bath preferentially dissolves "
        "contaminant particles without attacking the base titanium."
    ),
    heatControl=(
        "Solution at 50\u201360°C with acid concentration monitored by titration. "
        "Parts fully immersed with agitation for uniform exposure."
    ),
    flatnessControl=(
        "Chemical process \u2014 no mechanical force. Dimensional stability maintained."
    ),
    comparison=[
        {"dimension": "Mechanism", "laser": "Chemical dissolution of contaminants in acid bath", "waterjet": "N/A"},
        {"dimension": "Material Removed", "laser": "< 1 µm (contaminant layer only)", "waterjet": "N/A"},
        {"dimension": "Standards", "laser": "ASTM B600 / AMS 2700", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Surface Inspection", "description": "Ferroxyl test to verify absence of free iron contamination."},
    ],
)

# ═══ 9. SLM/3D Printing ═══
_reg("slm 3d printing", category="Additive Manufacturing",
    specs={
        "tolerance": "+0.05 mm (as-built) / +0.005 mm (post-machined)",
        "thicknessRange": "Build: Ø300 × 400 mm; layer 20\u201360 µm",
        "surfaceFinish": "Ra 6\u201312 µm (as-built) / Ra 0.4 µm (post-processed)",
    },
    processDescription=(
        "Selective Laser Melting (SLM/DMLS) builds titanium components layer-by-layer from metal powder using a "
        "fiber laser. Internal lattice structures, conformal cooling channels, and organic geometries "
        "are achievable that are unattainable with subtractive manufacturing."
    ),
    heatControl=(
        "Build chamber inerted with argon to < 1000 ppm O\u2082. "
        "Build plate preheated to 200°C to reduce thermal gradients between layers."
    ),
    flatnessControl=(
        "Stress relief annealing (540°C / 2 hr) before substrate removal. "
        "HIP for critical aerospace/medical components to eliminate internal porosity."
    ),
    comparison=[
        {"dimension": "Technology", "laser": "Laser powder bed fusion (LPBF/SLM/DMLS)", "waterjet": "N/A"},
        {"dimension": "Min Feature", "laser": "0.2 mm wall / 0.05 mm layer height", "waterjet": "N/A"},
        {"dimension": "Porosity", "laser": "< 0.5% as-built; < 0.01% after HIP", "waterjet": "N/A"},
        {"dimension": "Properties", "laser": "\u2265 98% of wrought with proper heat treatment", "waterjet": "N/A"},
    ],
    holeTypes=["Conformal cooling channels", "Lattice structures (diamond, gyroid)", "Organic geometries"],
    downstreamBase=[
        {"name": "Support Removal", "description": "EDM or CNC machining to remove build supports from substrate plate."},
        {"name": "Hot Isostatic Pressing (HIP)", "description": "HIP at 920°C / 100 MPa to close internal porosity."},
        {"name": "CNC Finish Machining", "description": "5-axis CNC machining of critical mating surfaces."},
    ],
)

# ═══ 10. Forming ═══
_reg("bend forming", category="Forming",
    specs={
        "tolerance": "+0.2 mm (bend position) / +0.5° (bend angle)",
        "thicknessRange": "0.3 mm \u2013 6.0 mm sheet/plate",
        "surfaceFinish": "No surface damage with polyurethane tooling",
    },
    processDescription=(
        "Press brake forming of titanium sheet uses CNC-controlled backgauges and variable-radius tooling to produce "
        "precision bends. Titanium's high springback (10\u201320° for Grade 5) requires "
        "over-bend compensation calculated from the specific alloy's elastic modulus."
    ),
    heatControl=(
        "Hot forming at 300\u2013600°C for complex bends using resistance-heated tooling. "
        "Temperature controlled +10°C across the bend line."
    ),
    flatnessControl=(
        "Post-form stress relief at 540°C for CP grades. "
        "Multi-stage forming with intermediate stress relief for tight radii."
    ),
    comparison=[
        {"dimension": "Method", "laser": "CNC press brake with air bending / bottoming", "waterjet": "N/A"},
        {"dimension": "Springback (Gr5)", "laser": "10\u201320° depending on R/T ratio", "waterjet": "N/A"},
        {"dimension": "Min Bend R", "laser": "2×T (Grade 2) / 3×T (Grade 5)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Stress Relief", "description": "Vacuum annealing to relieve cold-work stresses."},
        {"name": "Laser Trimming", "description": "Fiber laser cutting of formed blanks to net shape."},
    ],
)

# ═══ 11. Forging ═══
_reg("closed-die forging", category="Forging",
    specs={
        "tolerance": "+1.0 mm (as-forged) / +0.05 mm (post-CNC)",
        "thicknessRange": "Up to 500 kg ingot/billet; press capacity 3000 ton",
        "surfaceFinish": "As-forged scale; machined surfaces available",
    },
    processDescription=(
        "Closed-die forging of titanium uses shaped dies to compress heated billet into a net-shape or near-net-shape "
        "component. The process aligns grain flow with the component contour, producing superior mechanical properties "
        "compared to machined-from-bar stock."
    ),
    heatControl=(
        "Induction heating with +10°C uniformity across the billet. "
        "Beta transus control (995°C for Ti-6Al-4V) to optimize alpha-beta microstructure."
    ),
    flatnessControl=(
        "Post-forge normalization at 700°C for CP grades. "
        "Straightening within 1 mm/m for long components."
    ),
    comparison=[
        {"dimension": "Method", "laser": "Closed-die / open-die / isothermal", "waterjet": "N/A"},
        {"dimension": "Temperature", "laser": "850\u20131050°C (below beta transus)", "waterjet": "N/A"},
        {"dimension": "Grain Flow", "laser": "Aligned with component contour", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Heat Treatment", "description": "Solution treatment and aging (STA) for alpha-beta alloys."},
        {"name": "CNC Machining", "description": "Post-forge machining to final dimensions."},
        {"name": "NDT Inspection", "description": "Ultrasonic inspection (UT) per AMS 2631."},
    ],
)

# ═══ 12. Inspection ═══
_reg("cmm inspection", category="Inspection",
    specs={
        "tolerance": "Measurement uncertainty: +(1.0 + L/300) µm per ISO 10360",
        "thicknessRange": "CMM envelope: 1200 × 1000 × 800 mm",
        "surfaceFinish": "Contact or non-contact (laser/white light) scanning",
    },
    processDescription=(
        "Coordinate Measuring Machine (CMM) inspection provides quantitative dimensional verification of titanium components "
        "against GD&T specifications per ASME Y14.5. Touch-trigger probes, scanning heads, and non-contact laser sensors "
        "accommodate geometries from simple prismatic to complex freeform surfaces."
    ),
    heatControl=(
        "Temperature-controlled metrology lab at 20+1°C. "
        "Components stabilized on granite surface plate for minimum 4 hours before measurement."
    ),
    flatnessControl=(
        "Granite surface plate Grade 00 (flatness < 1 µm/m) as reference datum."
    ),
    comparison=[
        {"dimension": "Probe Type", "laser": "Touch-trigger / scanning / non-contact laser", "waterjet": "N/A"},
        {"dimension": "Uncertainty", "laser": "+(1.0 + L/300) µm per ISO 10360", "waterjet": "N/A"},
        {"dimension": "GD&T", "laser": "Full: form, orientation, location, runout", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "Inspection Report", "description": "Full FAIR (AS9102) with graphical pass/fail color map."},
        {"name": "CoC", "description": "Certificate of Conformance with material certification traceability."},
    ],
)

# ═══ 13. Thread Rolling ═══
_reg("thread rolling", category="Fastener Manufacturing",
    specs={
        "tolerance": "Thread pitch: Class 2A/3A (UN) / 6g/6h (metric)",
        "thicknessRange": "M2 \u2013 M24 thread diameters",
        "surfaceFinish": "Ra 0.4\u20130.8 µm on rolled threads",
    },
    processDescription=(
        "Thread rolling cold-forms threads by displacing material between two reciprocating or rotary dies, "
        "rather than cutting it away. Compressive residual stress at the thread root increases "
        "fatigue strength by 30\u201350% compared to cut threads."
    ),
    heatControl=(
        "Cold forming process \u2014 no heat generated. "
        "Water-soluble lubricant applied to dies for galling prevention on titanium."
    ),
    flatnessControl=(
        "Head flatness and perpendicularity within 0.05 mm per fastener standards. "
        "Die alignment verified with optical setup microscope."
    ),
    comparison=[
        {"dimension": "Method", "laser": "Cold-forming: material displaced, not removed", "waterjet": "Thread cutting / milling"},
        {"dimension": "Fatigue Strength", "laser": "30\u201350% higher than cut threads", "waterjet": "Standard (notch-sensitive)"},
        {"dimension": "Surface Finish", "laser": "Ra 0.4\u20130.8 µm; work-hardened", "waterjet": "Ra 1.6\u20133.2 µm"},
    ],
    holeTypes=["UN/UNF/Metric threads per ASME B1.1", "Custom thread forms"],
    downstreamBase=[
        {"name": "Thread Inspection", "description": "Go/no-go gauge inspection per ASME B1.1."},
        {"name": "Proof Load Testing", "description": "Tensile proof load per ASTM F606."},
    ],
)

# ═══ 14. Cleaning ═══
_reg("ultrasonic cleaning", category="General Manufacturing",
    specs={
        "tolerance": "No dimensional change",
        "thicknessRange": "Tank: Ø400 × 500 mm",
        "surfaceFinish": "Cleaned surface; no mechanical alteration",
    },
    processDescription=(
        "Ultrasonic cleaning uses high-frequency (25\u2013130 kHz) sound waves to create cavitation bubbles in a cleaning "
        "solution. The implosion of these bubbles on the titanium surface dislodges contaminants (oil, chips, polishing "
        "compound) from blind holes, threads, and complex internal features."
    ),
    heatControl=(
        "Solution at 50\u201370°C for optimal cavitation. "
        "Sequential wash-rinse-dry with DI water final rinse."
    ),
    flatnessControl=(
        "No mechanical force applied \u2014 dimensional stability maintained."
    ),
    comparison=[
        {"dimension": "Mechanism", "laser": "Cavitation implosion dislodges contaminants", "waterjet": "Pressure spray washing"},
        {"dimension": "Penetration", "laser": "Blind holes, threads, internal passages", "waterjet": "Line-of-sight only"},
        {"dimension": "Frequency", "laser": "25 kHz (heavy) / 40 kHz (general) / 130 kHz (delicate)", "waterjet": "N/A"},
    ],
    holeTypes=["N/A"],
    downstreamBase=[
        {"name": "HEPA Drying", "description": "HEPA-filtered hot air drying in Class 100 environment."},
        {"name": "Cleanroom Packaging", "description": "Double-bagged in Class 10/100 with VCI lining."},
    ],
)

# ═══ 15. General ═══
_reg("general fabrication", category="General Manufacturing",
    specs={
        "tolerance": "+0.1 mm (standard fabrication)",
        "thicknessRange": "Varies by process",
        "surfaceFinish": "As-fabricated; per customer spec",
    },
    processDescription=(
        "Custom fabrication of titanium components combining multiple processes: cutting, forming, machining, and welding "
        "to deliver complete assemblies. Each project is engineered to print with process routing documentation."
    ),
    heatControl=(
        "Process-specific heat management applied per operation."
    ),
    flatnessControl=(
        "Post-fabrication stress relief and leveling available. "
        "Fixturing designed to maintain datum references through multiple ops."
    ),
    comparison=[
        {"dimension": "Integration", "laser": "Multi-process: cut, form, machine, weld, finish", "waterjet": "Single-process only"},
    ],
    holeTypes=["Per engineering drawing"],
    downstreamBase=[
        {"name": "Quality Documentation", "description": "Full inspection report, material certs, and CoC included."},
    ],
)




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


def find_process_entry(title_lower):
    """
    Title-driven PROCESS matching.
    Returns (entry_dict, matched_keyword)
    """
    # Exact phrase match (longest first)
    for key in sorted(PROCESS_DICT.keys(), key=len, reverse=True):
        if key in title_lower:
            return PROCESS_DICT[key], key

    # Word-level match
    candidates = []
    for key in PROCESS_DICT.keys():
        words = key.split()
        matched = sum(1 for w in words if w in title_lower)
        if matched >= min(2, len(words)):
            candidates.append((matched / len(words), key, PROCESS_DICT[key]))
    if candidates:
        candidates.sort(key=lambda x: -x[0])
        return candidates[0][2], candidates[0][1]

    # Category fallback
    for cat_key, lookup_key in [
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
    ]:
        if cat_key in title_lower and lookup_key in PROCESS_DICT:
            return PROCESS_DICT[lookup_key], lookup_key

    return PROCESS_DICT["general fabrication"], "general fabrication"
