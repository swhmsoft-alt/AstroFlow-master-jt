---
title: "Titanium CNC Hole Design: Diameter, Depth, Blind Holes and Position"
description: "Engineering guide to designing drilled, bored, and gun-drilled holes in titanium CNC parts — standard drill sizes, depth-to-diameter limits, blind vs through holes, hole-pattern GD&T, and the inspection cost of position tolerance."
pubDate: 2026-10-10
author: Boze Titanium Manufacturing Center
category: Design & DFM
tags: [Hole Design, Depth-to-Diameter, Blind Hole, Gun Drilling, GD&T, Position Tolerance, Titanium CNC, DFM, Drill Geometry]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-hole-design-cover.jpg
coverImageAlt: PLACEHOLDER — cross-section diagram of a titanium part with blind and through holes. To be replaced with the final image.
featured: false
---

Holes account for more than half of the features on most titanium aerospace, medical, and chemical-processing drawings. They drive tool selection, fixture strategy, cycle time, and inspection cost more than any other feature class, and they are also the feature most often revised after the first quote. Designing a hole pattern correctly at the drawing level avoids three downstream problems: drilling-tool breakage in titanium (low thermal conductivity concentrates heat at the cutting edge), blind-hole chip packing (no chip evacuation in deep bores), and GD&T ambiguity at the hole pattern (datum-referenced position versus free +/− tolerancing).

This article focuses on the four hole-design decisions that determine whether a titanium part is buildable on a 3-axis mill or needs a 5-axis cell, gun drill, or EDM: diameter, depth-to-diameter ratio, blind vs through, and position tolerance. It assumes familiarity with the [GD&T article on position and datums](/blog/gdt-titanium-cnc-parts/) and the [general DFM guide](/blog/dfm-guide-titanium-parts-design-for-manufacturability/) — those cover the inspection and tolerance framing; here we focus on the geometric decisions specific to holes. For the machining-process envelope (speeds, feeds, coolant pressure) that executes these designs, see the [titanium machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/).

- [Why hole design is the first decision on most titanium drawings](#why-hole-design-is-the-first-decision-on-most-titanium-drawings)
- [Diameter — preferred standards, minimum practical, and tolerance](#diameter-preferred-standards-minimum-practical-and-tolerance)
- [Depth-to-diameter ratio — shallow versus deep, and where the rule breaks](#depth-to-diameter-ratio-shallow-versus-deep-and-where-the-rule-breaks)
- [Blind versus through holes — chip evacuation and drill geometry](#blind-versus-through-holes-chip-evacuation-and-drill-geometry)
- [Hole position and pattern — datum reference and GD&T](#hole-position-and-pattern-datum-reference-and-gdt)
- [Hole quality — roundness, surface finish, work hardening, alpha case](#hole-quality-roundness-surface-finish-work-hardening-alpha-case)
- [Inspection and documentation for hole patterns](#inspection-and-documentation-for-hole-patterns)
- [Hole-design checklist](#hole-design-checklist)

## Why hole design is the first decision on most titanium drawings

The hole-design decisions on a titanium drawing propagate into every downstream process: tool selection (standard twist drill vs coolant-through vs gun drill vs indexable insert), fixturing (drilling direction vs milling direction), cycle time (peck retract cycles dominate blind holes), inspection (CMM probe length and stylus type), and quality (work hardening, alpha case, roundness). A drawing that gets the hole pattern wrong forces re-engineering at the CAM stage, not at the design stage — and the rework typically surfaces as a quote escalation rather than a quote rejection.

The four geometric parameters that determine whether a hole pattern is buildable are well-specified by the brief: diameter, depth, blind/through, and position. Each has a default value that works for most cases and a regime where a different process is required. The remainder of this article walks through each parameter in that order.

## Diameter: preferred standards, minimum practical, and tolerance

The most common DFM error on titanium hole patterns is specifying a non-standard diameter. A Ø 5.7 mm hole that "almost matches" a Ø 6 mm clearance pattern forces a custom drill; a Ø 6.0 mm or Ø 6.1 mm hole uses a standard off-the-shelf drill with standard tolerance.

Standard metric drill sizes per ISO 494 (and the inch equivalent per ASME B94.11M) cover the bulk of clearance, tap, and pin holes. Where the part is metric-dominant, prefer the ISO 494 series in 0.1 mm increments above Ø 1.0 mm and 0.5 mm increments above Ø 5.0 mm. Where the part follows ANSI clearance hole tables (ASME B18.2.8 for clearance holes for metric bolts, ASME B18.2.6 for imperial), select from the standard clearance table.

| Application | Preferred diameter series | Tolerance class |
|---|---|---|
| Metric clearance hole for bolt | ISO 273 medium clearance | ±0.10 mm standard; ±0.05 mm precision |
| Imperial clearance hole for bolt | ASME B18.10 medium clearance | ±0.005 in standard; ±0.002 in precision |
| Tap drill (pre-tap) | ISO 230/1 tap drill chart | Tap drill tolerance per ISO 230; cut thread standard, roll thread ±0.05 mm |
| Dowel / reamed pin | ISO 8734 (parallel pin) or ASME B18.8.2 | ±0.01 mm reamed; ±0.005 mm ground |
| Helicoil / threaded insert | Manufacturer tap drill chart (e.g. Tanged/Helicoil) | ±0.05 mm tap drill |

Minimum practical diameter on titanium is governed less by drill availability than by drill rigidity. A Ø 1.0 mm carbide drill can produce a 5 mm deep hole in Ti-6Al-4V with peck cycles and high-pressure coolant, but the same drill at 30 mm depth will fail within a few parts because titanium's cutting forces deflect the drill into a wandering path and the flute area is too small to evacuate chips. Practical minimum for production runs:

| Diameter | Practical depth without specialized tooling | Practical depth with gun drill |
|---|---|---|
| Ø 1.0 mm | 3×D | 30×D |
| Ø 2.0 mm | 4×D | 50×D |
| Ø 3.0 mm | 6×D | 100×D |
| Ø 6.0 mm | 8×D | 100×D+ |
| Ø 10.0 mm | 10×D | 100×D+ |

For deep small-diameter holes (depth-to-diameter above 8:1 and diameter below 6 mm), the design should specify gun drilling (single-point or two-flute gun drill, with internal coolant channels). Standard twist drills are not appropriate.

For shallow holes, the more common diameter trap is over-specifying diameter tolerance. Tightening a Ø 6.0 mm clearance hole from ±0.10 mm to ±0.025 mm adds a reaming step and a CMM inspection step; the benefit is rarely functional unless the hole mates to a precision dowel. For clearance holes that locate a bolt, ISO 273 medium clearance is the right starting point.

## Depth-to-diameter ratio: shallow versus deep, and where the rule breaks

The depth-to-diameter ratio (D:d, sometimes L:d or depth:diameter) is the single geometric parameter that determines whether a hole is drilled, gun-drilled, EDM'd, or turned. For titanium, four regimes are useful:

| Regime | D:d range | Typical process | Notes |
|---|---|---|---|
| Shallow | Up to 4:1 | Standard twist drill or indexable insert | Straightforward; standard coolant sufficient |
| Medium | 4:1 to 8:1 | Indexable insert with peck cycle | Coolant pressure matters more than flow rate |
| Deep | 8:1 to 30:1 | Coolant-through twist drill or two-flute gun drill | Peck cycle mandatory; coolant pressure 70+ bar |
| Very deep | Above 30:1 | Single-point gun drill or EDM | Specialized tooling; reaming and boring after |

The rule breaks at one specific point: through-holes in titanium sheet or plate. A Ø 10 mm through-hole in a 25 mm plate has an effective depth-to-diameter ratio of 2.5:1, but the entry and exit surfaces behave differently from a continuous deep bore because the drill breaks through the back face. The exit side forms a burr that is sharper than on steel or aluminum (titanium chips do not plastically deform at low temperature). Through-holes should be specified with one of:

- A back-face chamfer (typically 0.5 × 90° on the exit side) to break the burr.
- A counterbore or spot face if a bolt head or washer needs to seat flush.
- An explicit "no burr" callout, which obligates a deburring step (tumbling, hand deburr, or brush deburr depending on access).

Blind holes (non-through) are governed by different rules. The drill cannot exit, so chip evacuation happens only through the flutes, and chip packing is the dominant failure mode. Practical maximum blind-hole depth for standard carbide drilling in titanium:

| Diameter | Maximum blind depth without specialized tooling |
|---|---|
| Ø 1.0–2.0 mm | 4×D |
| Ø 3.0–5.0 mm | 6×D |
| Ø 6.0–10.0 mm | 8×D |
| Above Ø 10 mm | 10×D |

Beyond these limits, specify the hole as through, or budget for a deep-hole-specific drill cycle with retract-and-blow peck (G83 in Fanuc-style G-code).

## Blind versus through holes: chip evacuation and drill geometry

The decision between blind and through holes is the most consequential hole-design choice on a titanium part. The two cases have very different ends:

- **Through-hole** — coolant and chips exit at the back, drill breaks through cleanly with one peck, no chip packing. Acceptable for almost any depth-to-diameter ratio on titanium IF the exit side can tolerate a burr.
- **Blind-hole** — coolant and chips must evacuate through the flutes; chip packing is the dominant failure mode. Restricted to the limits above unless specialized tooling is budgeted.

DFM rule: prefer through-holes wherever the design permits. The classic exception is a fastener that must seat in a recess — and even there, a counterbored through-hole often outperforms a blind recess. The reasons:

1. Through-holes allow through-spindle coolant at 70+ bar pressure; blind holes depend on flood or side-mounted nozzle, which rarely maintains effective pressure at the cutting edge.
2. Chip evacuation in a blind hole requires retract peck cycles that consume a meaningful share of cycle time. On a Ti-6Al-4V part with 8 blind holes at 6×D, the peck retract alone can account for 15–25% of the drilling cycle.
3. Inspection is simpler on through-holes because the CMM probe can enter from one side. Blind holes require a probe with sufficient length and a hole-type stylus, which adds cost.

Drill geometry on titanium differs from steel and aluminum. Three rules that apply:

- **Point angle 130–140°**, not the 118° common on mild steel. A steeper point angle reduces the cutting force at the center (where heat concentrates in titanium) and reduces wandering on entry.
- **Polished or coated flutes** (TiN, TiAlN, or diamond-like carbon). A polished flute reduces friction against the chip, which is the dominant heat-transfer surface in titanium drilling.
- **Coolant-through** (also called internal-coolant or through-coolant) for any hole above Ø 3.0 mm or deeper than 4×D. External flood cannot sustain enough pressure at the cutting edge to clear the chip; titanium chips weld to the flute when heat builds.

The drill-process envelope (speeds, feeds, peck cycles) is covered in the [titanium machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/).

## Hole position and pattern: datum reference and GD&T

Hole position is the GD&T decision on the drawing, and the article on [GD&T for titanium CNC parts](/blog/gdt-titanium-cnc-parts/) covers the position-tolerance callout in detail. The two decisions specific to hole patterns are:

1. **Datum scheme.** A hole pattern that mates to another part must have its position datum referenced to the assembly's primary mounting face, not to a local datum on the part. A common error: position tolerance is called out relative to a side face that is convenient to machine, but the assembly loads the part on the opposite face. The holes pass inspection and the assembly does not fit.

2. **Pattern tolerance versus feature tolerance.** For a flange with 8 holes on a bolt circle, position each hole relative to the bolt circle center (a derived datum from the pattern), not relative to a primary feature. ASME Y14.5-2018 uses the pattern-locating datum feature symbol to indicate the derived center.

For a typical aerospace flange, the position tolerance stack is:

| Feature | Position tolerance | Material condition |
|---|---|---|
| Bolt-circle center | Ø 0.05 mm to primary mounting face | RFS |
| Each bolt hole | Ø 0.25 mm to bolt-circle center | MMC |
| Concentricity of each bolt hole to local boss | Ø 0.05 mm | RFS |

For multi-pattern holes (different bolt circles on the same part), each pattern gets its own derived datum and the position callouts reference them. Mixing per-hole datums with per-pattern datums is the most common source of drawing ambiguity that costs inspection time downstream.

For procurement, ask the supplier how the position tolerance will be inspected. On a 3-axis machine, the part must be re-fixtured to a CMM between each pattern; on a 5-axis machine with tomographic probing, the patterns are measured in one setup. The CMM cycle time difference is real and shows up in the inspection line item of the quote.

## Hole quality: roundness, surface finish, work hardening, alpha case

Hole quality on titanium is governed by four specific failure modes that don't appear the same way on steel or aluminum:

1. **Roundness.** A hole drilled with a worn tool or excessive feed becomes oblong rather than round. For Ø 6.0 mm holes with tolerance ±0.05 mm, the roundness error from drilling alone is typically 0.01–0.02 mm. Beyond that, the hole must be reamed, bored, or honed — each adds a setup and an inspection step.

2. **Surface finish.** Standard twist drilling on titanium produces Ra 0.8–3.2 µm depending on material, feed, and tool condition. Where Ra 0.4 µm or finer is specified (typical for hydraulic manifold interfaces), the hole needs a secondary finishing pass — reaming, boring, or honing. Boring is preferred over reaming for titanium because reaming tools can deflect on low-rigidity boring heads.

3. **Work hardening.** A drill that dwells at the bottom of a blind hole (typical of inadequate peck retract) creates a work-hardened layer on the cut surface that is harder than the bulk material. A subsequent tap or reaming pass on that work-hardened surface fails rapidly. The fix is the peck cycle: retract to clear, return to depth, repeat. Peck retract should clear at least one flute length above the previous cut.

4. **Alpha case.** Excessive heat at the cutting edge (above about 600 °C at the tool–chip interface) produces alpha-case formation in titanium — a hard, brittle oxygen-diffused layer at the surface that reduces fatigue life. Drilling parameters that hold cutting temperature below the alpha-case threshold are standard for aerospace parts; the [titanium machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/) covers the parameter envelope.

For procurement, when a drawing calls for Ra 0.8 µm and roundness 0.01 mm on a hole pattern, ask whether the hole is being specified for functional reasons (seal interface, bearing seat) or cosmetic reasons. If functional, specify the secondary operation; if cosmetic, the supplier may relax the spec without functional penalty.

## Inspection and documentation for hole patterns

CMM inspection of a hole pattern is bounded by the access style of the holes:

- Through-holes can be measured with a standard M2 or M3 ruby probe from either side.
- Blind holes require probe length up to the hole depth plus a few millimeters; beyond 4×D, a star probe or specialized stylus is required, which adds CMM cycle time and probe calibration steps.
- Very deep blind holes (above 10×D) are often inspected by eddy-current or ultrasonic probe rather than tactile CMM, with reduced positional accuracy.

For AS9100 programs, each hole pattern's first-article inspection is documented per AS9102 (First Article Inspection requirement), which records the measured position, the actual position tolerance consumed, and the datum alignment used for the measurement — three pieces of data that determine whether the part is acceptable and whether the inspection method is equivalent across part numbers.

For documentation, the hole-pattern callouts in the FAI must mirror the drawing exactly. If the drawing says "⌖ | Ø 0.25 | A | B | M", the FAI records position vs MMC and the departure from MMC.

## Hole-design checklist

- Use standard drill sizes (ISO 494 metric, ASME B94.11M inch) wherever possible. Avoid odd diameters.
- Specify through-holes wherever the assembly permits. Avoid blind holes beyond 8×D without budgeting for specialized tooling.
- For depth-to-diameter ratios above 8:1, budget for gun drilling or EDM rather than specifying a deep standard twist drill.
- Specify point geometry (130–140°) and coolant-through drills for any titanium hole above Ø 3.0 mm or above 4×D.
- Apply position tolerance at MMC for clearance hole patterns, RFS for press-fit and bearing seats. Reference the bolt-circle center as a derived datum for flange patterns.
- Specify surface finish and roundness only where functional. Cosmetic surface finish on internal holes adds a secondary operation and CMM time without functional gain.
- Match drill material to grade: standard carbide drills work for CP and Grade 5; for Grade 23 ELI and beta alloys, specify the carbide grade and coating per the supplier's tool list.

For a hole-design review against these rules, send the STEP file and the drawing to our [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with the drill process, depth strategy, and inspection plan flagged for cycle time and inspection cost. Hole-pattern cost varies widely across suppliers, and the [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) define drill process before any tooling is ordered. For Ti-6Al-4V [Grade 5](/materials/grade-5/) parts in particular, the drill process chosen (twist vs gun vs EDM) typically determines whether the part is on a 3-axis mill, a turn-mill, or a dedicated deep-hole cell.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Standard drill geometry comparison: Side-by-side profile of a 118° point (steel) vs 130–140° point (titanium) drill with annotated rake and flute geometry. Supports queries about why titanium drills differ from steel drills.
Fig 2 — Chip evacuation in blind vs through holes: Cross-section schematic showing chip flow through flute in a blind hole (with packing at depth) vs through-hole (clean exit at back face). Supports queries about blind-hole depth limits in titanium.
Fig 3 — Datum scheme for a bolt-circle pattern: Top-down view of a flange with bolt circle, showing pattern-locating datum feature symbol on the bolt-circle center, individual hole positions at MMC, and primary/secondary datums on the mounting face and a perpendicular feature. Supports queries about hole-pattern GD&T callouts.
-->