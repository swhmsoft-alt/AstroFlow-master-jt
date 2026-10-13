---
title: "Titanium CNC Drilling: Deep Holes, Tooling and Chip Evacuation"
description: "Process engineering guide to drilling titanium alloys on CNC mills and turn-mill cells — drill point geometry, coolant-through vs gun drill selection by depth class, peck cycle strategy, high-pressure coolant pressure, chip evacuation, and the most common drilling defects and how to prevent them."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Machining Processes
tags: [CNC Drilling, Titanium Drilling, Deep Hole Drilling, Gun Drill, Coolant Through Drill, Chip Evacuation, Speeds and Feeds, Titanium Machining, Peck Cycle, Coolant Pressure]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-drilling-guide-cover.jpg
coverImageAlt: PLACEHOLDER — close-up of a coolant-through drill bit engaged in a titanium aerospace part with chip evacuation visible. To be replaced with the final image.
featured: false
---

Drilling titanium is the operation where the cost of a parameter mistake is highest and the time window to fix it is shortest. A drill that runs a few seconds too long past its wear limit does not produce a worn hole — it produces a broken drill, a scrapped part, and a workpiece that needs to be extracted from the casting. The reason is the same thermal story that affects every titanium cutting operation, amplified by the geometry of a drill: heat concentrates at the cutting edge, the chip is forced to evacuate up the flutes past the freshly cut hole wall, and the drill is the most rigid body in the cut but also the most fragile. In a mixed-material shop, drill breakage data is unforgiving — roughly 60–70% of broken drills across a typical month trace back to titanium or stainless work, even though titanium is a smaller share of throughput than aluminum or steel.

This article works through the five process decisions that determine whether a titanium drilling cycle is stable: drill geometry, drill selection by depth class, cutting parameters, peck cycle strategy, and coolant pressure. It assumes the [titanium machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/) and the [hole design article](/blog/titanium-cnc-hole-design/) as background — those cover the part-design side of drill selection and depth-to-diameter limits; here we focus on the cutting-side decisions and the chip-evacuation discipline that distinguish a stable cycle from a broken-drill event. For the broader thermal-mechanics rationale, the [why titanium is difficult to machine article](/blog/why-titanium-is-difficult-to-machine/) covers the heat-concentration physics that drives most drilling failures.

- [Why drilling titanium is the most failure-prone titanium operation](#why-drilling-titanium-is-the-most-failure-prone-titanium-operation)
- [Drill geometry: point angle, flute, margin, coolant-through](#drill-geometry-point-angle-flute-margin-coolant-through)
- [Drill selection by depth class: standard, coolant-through, gun drill](#drill-selection-by-depth-class-standard-coolant-through-gun-drill)
- [Cutting parameters: Vc, fn, peck cycle](#cutting-parameters-vc-fn-peck-cycle)
- [Coolant pressure and chip evacuation](#coolant-pressure-and-chip-evacuation)
- [Common drilling defects and fixes](#common-drilling-defects-and-fixes)
- [Drilling parameter reference](#drilling-parameter-reference)
- [Drilling checklist](#drilling-checklist)

## Why drilling titanium is the most failure-prone titanium operation

Three forces converge in a titanium drilling cycle, and all three push the process toward the breakage limit:

**1. Heat concentration at the cutting edges.** A standard twist drill has two cutting edges, each generating heat at the same rate as a turning insert. The drill's flute volume is too small to carry the heat away through the chip, and titanium's low thermal conductivity (around 7 W/m·K) means the heat stays at the cutting edge. Cutting edge temperature in a titanium drilling operation typically runs 200–300 °C higher than in steel drilling at the same Vc, which is why uncoated or aluminium-coated drills fail in a single hole on titanium.

**2. Chip evacuation up the flutes past the freshly cut wall.** Unlike a turning insert, where the chip leaves the cut on the side opposite the workpiece, a drill's chip must travel up the flute — across the surface of the hole that was cut milliseconds earlier. If the chip is hot, long, or packed, it work-hardens the freshly cut wall. The next pass of the chip across that wall creates a deeper work-hardened layer, which makes the next cut harder, which generates more heat, which produces a longer chip — a positive-feedback loop that ends with a broken drill or a hole that is out of tolerance.

**3. Low rigidity versus high cutting force.** A drill is a slender column under side load. The cutting force at each lip varies with chip thickness, point geometry, and workpiece hardness, and any lateral force on a slender drill produces lateral deflection. The deflection makes the hole oversized on one side and undersized on the other, which in turn concentrates cutting force on the heavy side, which deflects the drill more. The cycle is exactly the same as the one that produces taper and ovality in turning thin-wall features, but on a smaller scale and with less time to recover.

The shop-floor consequence is that drilling titanium tolerates almost no parameter drift. A turning operation might run for 10 minutes with an under-rated insert before the operator notices chatter; a drilling operation will break a drill within 5–15 seconds of a parameter excursion. The fix is a discipline of conservative parameters, high coolant pressure, and frequent chip-evacuation cycles, applied uniformly across the production run rather than dialed in for the first part and forgotten.

## Drill geometry: point angle, flute, margin, coolant-through

Drill geometry in titanium is more constrained than in steel because the cutting edge has to do three things at once — cut, evacuate the chip, and survive the heat — and a feature that helps one task usually hurts another. The geometry choices that consistently work for titanium:

**Point angle.** The standard point angle for steel drilling (118°) is too acute for titanium. The 118° point concentrates cutting force at the chisel edge, which promotes wandering on entry and high thrust load on small-diameter drills. Titanium drilling uses a 130–140° point angle (per ISO 230/1 conventions), which distributes the cutting force across a wider area, reduces thrust, and produces a more aggressive chip geometry that evacuates more easily.

**Flute geometry.** Flutes in titanium drills are typically polished (low-friction surface treatment) and wider than in steel drills of the same diameter, to provide chip clearance. The wider flute reduces the drill's cross-sectional core, which lowers rigidity — a trade-off that is acceptable for shallow holes but constrains depth capability for larger-diameter drills. For deep holes, a drill with a parabolic flute profile evacuates chip better than a standard straight flute, at the cost of slightly reduced stiffness.

**Margin.** The margin (the narrow cylindrical land that guides the drill in the hole) should be as narrow as practical to reduce friction against the hole wall. Excess margin width generates heat through friction and contributes to hole-wall work hardening. A polished margin with a 0.05–0.15 mm land width is typical for titanium.

**Web thinning.** For drills below 3 mm diameter, web thinning (grinding a relief at the chisel edge) reduces thrust force and improves chip formation. The technique is standard for any drill under 3 mm in titanium, because the as-supplied chisel edge on a small drill is too blunt for the cut to start cleanly.

**Coolant-through.** For any titanium drill above 3 mm diameter, internal coolant channels are non-negotiable. The standard specification is per ISO 5419 (coolant-through drills), with two lateral exits near the cutting edge or, in premium drills, a single exit at the chisel edge. The drill itself must be ordered as a coolant-through design — retrofitting a standard drill with external coolant nozzles is a workaround that loses 30–50% of the coolant pressure at the cutting edge.

**Coatings.** TiAlN or AlTiN coatings, identical to those used for turning inserts, are standard for titanium drills. CrAlN and TiSiN appear in premium drills for high-Vc finishing. Uncoated drills are not used for production titanium work.

The applicable standards are ASME B94.11M for inch-series jobber drills, ISO 230/1 for general drill geometry and point-angle conventions, and NAS 907 for the aerospace-specific series that includes split-point, coolant-through, and titanium-grade specifications.


## Drill selection by depth class: standard, coolant-through, gun drill

The drill selected for a given hole is set by the depth-to-diameter ratio first, the diameter second, and the workpiece material third. The selection table below is a shop-floor decision aid — it assumes standard production tolerances on aerospace or medical titanium parts, and the goal is the lowest-cost tool that runs the cycle without breakage.

| Depth / diameter | Recommended drill | Notes |
|---|---|---|
| < 2×D | Standard carbide drill (coolant-through if Ø > 3 mm) | Entry-level; one-shot drill, no peck cycle required for shallow holes |
| 2×D to 4×D | Coolant-through carbide drill | Standard shop practice; peck every 1.5–2×D |
| 4×D to 8×D | High-performance carbide drill with internal coolant, parabolic flutes | Mandatory peck cycle; consider indexable-insert drill for Ø > 12 mm |
| 8×D to 20×D | Indexable insert drill (single-flute or two-flute) for Ø > 12 mm, or extended-length coolant-through solid carbide | Peck cycle every 1×D; verify spindle has the rigidity to drive the extended tool |
| > 20×D | Gun drill (single-flute) or BTA drill | Required for depth-to-diameter > 20:1; cycle time 3–10× a standard drill cycle |
| Non-round or micro holes (Ø < 1 mm, EDM-quality edge) | EDM or laser | Standard drilling is not economic below 1 mm in titanium |

The two deep-hole methods deserve a note. A gun drill is a single-flute tool with internal coolant that exits at the cutting edge, with the chip evacuating externally through a V-flute on the opposite side. A BTA (Boring and Trepanning Association) drill is a multi-flute tool with internal coolant that exits behind the cutting edge, with the chip evacuating externally through the bore of the drill. The trade-off: gun drill for smaller diameters (typically below 30 mm) and shorter depths; BTA for larger diameters and longer depths, where the multi-flute geometry provides better chip-breaking. For most titanium aerospace and medical parts, the depth-to-diameter ratio is below 8:1 and a standard coolant-through carbide drill is the right tool. The cost of a gun drill cycle — 5–10× the per-hole cost of a standard drill — only makes sense for the holes that cannot be made any other way.

The [hole design article](/blog/titanium-cnc-hole-design/) covers the part-design decisions around depth-to-diameter and whether to specify through vs blind holes, including the depth limits above which a standard drill should be replaced by a gun drill or EDM.

## Cutting parameters: Vc, fn, peck cycle

The starting parameters for titanium drilling are roughly 50–60% of the Vc used for the same diameter in 17-4PH stainless, with the same proportional reduction in fn. Peck cycle strategy is part of the parameter set — for shallow holes, "peck every X diameter" is a starting number, but the right answer depends on chip shape, coolant pressure, and the depth-to-diameter ratio.

| Diameter | Vc (m/min) | fn (mm/rev) | Peck cycle (retract to clear chip) |
|---|---|---|---|
| < 3 mm | 20–40 | 0.02–0.05 | Every 0.5–1×D |
| 3–6 mm | 30–50 | 0.05–0.10 | Every 1.0–1.5×D |
| 6–12 mm | 40–60 | 0.10–0.20 | Every 1.5–2×D |
| 12–25 mm | 40–70 | 0.15–0.30 | Every 2–2.5×D |
| > 25 mm | 50–80 | 0.20–0.40 | Every 2.5–3×D |

The peck cycle is not optional. A drill that runs to full depth without retracting packs the flutes, generates heat, work-hardens the wall, and breaks — usually within 1–3 seconds of the chip-packing event. The peck frequency on the table is conservative; in production, the rule is to peck at the first sign of chip crowding, not at a fixed cycle interval. The drill's flute capacity, the coolant pressure, and the chip shape all interact, and a fixed cycle is a starting point, not a guarantee.

The peck cycle rule on breakthrough is also important: retract the drill by 0.5×D at the breakthrough point and re-feed at half the in-cut feed rate. The reduced feed at breakthrough prevents the exit-side burr that is the most common drilling defect on titanium parts and that the deburring article on burrs and deburring covers in detail.

For through-holes where the exit side is not visible or is buried in a fixture, a "punch-through" cycle with reduced feed and a short dwell at breakthrough is the safe default. For blind holes, the rule is to stop the drill 0.3–0.5 mm short of the specified depth, then complete the cut at 50% feed — the reduced feed prevents the drill from dwelling at the bottom of the hole, which work-hardens the bottom and ruins the drill.


## Coolant pressure and chip evacuation

Coolant in titanium drilling has two distinct functions, and a single setting rarely satisfies both. The first function is heat removal: coolant enters the cutting zone, contacts the hot chip and the cutting edge, and carries heat away as it flows out. The second function is chip evacuation: coolant flow pushes the chip up the flutes and out of the hole, which prevents packing. Heat removal wants high volume; chip evacuation wants high velocity. The compromise is high pressure, not high volume — pressurize the coolant so a small flow at the cutting edge has the velocity to clear the chip.

The pressure bands below assume a coolant-through drill with internal channels sized per ISO 5419, and a machine tool with a high-pressure coolant pump rated to 200 bar. Standard flood coolant (5–10 L/min at 3–5 bar) is not adequate for titanium drilling above 3 mm diameter, and it is dangerous on deep holes because the low-velocity flow cannot evacuate the chip against gravity.

| Drill diameter | Minimum coolant pressure | Typical coolant pressure | Coolant type |
|---|---|---|---|
| < 3 mm | 50 bar | 70–100 bar | Coolant-through or flood with high-pressure nozzle aimed at cutting edge |
| 3–6 mm | 70 bar | 100–150 bar | Coolant-through, oil-based emulsion 8–10% |
| 6–12 mm | 100 bar | 120–180 bar | Coolant-through, oil-based emulsion 8–10% |
| 12–25 mm | 120 bar | 150–200 bar | Coolant-through, oil-based emulsion 8–10% |
| > 25 mm | 150 bar | 180–200 bar (machine limit) | Coolant-through, oil-based emulsion 8–10%; verify pump capacity |
| Gun drill | 80 bar | 100–150 bar | Coolant-through, oil-based; filtration ≤ 25 µm |

The filtration grade matters more in drilling than in turning, because the coolant channels in a drill are smaller than the chip-breaker pocket on a turning insert, and a chip fragment lodged in a coolant channel destroys the drill as surely as a packed flute. The standard filtration target is 50 µm or finer for diameters below 12 mm, and 25 µm for gun drills and BTA drills. The [high-pressure coolant strategy article](/blog/high-pressure-coolant-strategy-titanium-cnc-machining/) covers pump selection, filtration, and concentration in more detail.

A practical sign of inadequate coolant pressure is the chip shape and color. A stable titanium drilling cycle produces short, free-flowing chips that are straw or light blue in color. A cycle that produces long, stringy, dark blue or purple chips is running too hot, and the first place to look is the coolant pressure at the cutting edge. The [chip control and fire prevention article](/blog/titanium-chip-control-fire-prevention-cnc-machining/) covers the chip-evacuation discipline across all titanium operations.

## Common drilling defects and fixes

The defect table below covers the eight failure modes that show up most often on titanium drilling cycles. Each row is something we see in first-article runs at our shop, with the cheapest fix that does not require re-drilling the part.

| Symptom | Most likely cause | First fix |
|---|---|---|
| Drill breakage in the hole | Chip packing, insufficient coolant pressure, or fn too aggressive | Verify coolant pressure reaches the cutting edge; reduce fn by 30%; shorten peck interval by 30% |
| Oversized hole (diameter above tolerance) | Drill wandering, worn margin, or excessive runout | Use a spotting drill or pilot drill first; replace drill at first wear band; check spindle runout ≤ 0.02 mm |
| Tapered hole (one side oversized) | Drill deflection under cutting load, fixture not supporting the workpiece, or drill overhang too long | Reduce drill overhang to under 4×D; support the workpiece directly under the hole; reduce fn by 20% |
| Poor surface finish inside the hole | Built-up edge (BUE), worn drill, or insufficient coolant | Increase Vc by 10–20%; verify coolant concentration ≥ 8%; replace drill |
| Work-hardened layer on the hole wall | Chip packing and recutting; insufficient peck cycles | Add more frequent peck cycles; verify chip is breaking cleanly; consider increasing Vc |
| Exit-side burr | Insufficient peck or feed reduction at breakthrough | Add a 0.5×D retract-and-re-feed at 50% feed at breakthrough |
| Drill wandering on entry | No spotting drill; chisel edge too blunt; entry surface not perpendicular to drill axis | Use a spotting drill or 140° point short drill first; verify setup perpendicularity |
| Hole position out of tolerance | Fixture repeatability, drill runout, or thermal growth on a long cycle | Verify fixture locates within ±0.02 mm; check spindle runout; consider in-process probing between holes |
| Tool life below target (drills failing before 50 holes) | Vc too high, coolant pressure too low, or wrong drill grade for the material | Derate Vc by 15%; verify coolant pressure at the cutting edge; switch to a TiAlN or AlTiN coated drill |
| Drill entry side chipping | Entry surface has a hardened layer from upstream forming or heat treatment | Mill or face the entry surface first; use a piloted entry; verify heat treatment is uniform |

The single most useful diagnostic on a failing drilling cycle is to stop the cycle after 5 holes, remove the drill, and inspect the chip packing in the flutes. Packing visible in the lower third of the flutes means chip evacuation is the problem; packing in the upper third means coolant pressure is the problem; no packing but rapid wear means Vc is too high for the drill grade.


## Drilling parameter reference

The card below condenses the parameter table in Section 4 to a one-line-per-case format suitable for posting at the machine. Use it as a starting point; the bands reflect typical shop-floor conditions and should be tightened or loosened based on first-article results and tool-wear data.

| Diameter (mm) | Vc (m/min) | fn (mm/rev) | Peck interval | Coolant pressure | Drill type |
|---|---|---|---|---|---|
| 1.0 | 25 | 0.02 | 0.5×D | 70 bar | Solid carbide, web thinned, TiAlN |
| 2.0 | 30 | 0.04 | 0.7×D | 80 bar | Solid carbide, web thinned, TiAlN |
| 3.0 | 35 | 0.06 | 1.0×D | 100 bar | Coolant-through carbide, TiAlN |
| 5.0 | 40 | 0.10 | 1.2×D | 120 bar | Coolant-through carbide, TiAlN |
| 8.0 | 50 | 0.15 | 1.5×D | 140 bar | Coolant-through carbide, parabolic flute, TiAlN |
| 12.0 | 55 | 0.20 | 2.0×D | 160 bar | Coolant-through carbide, parabolic flute, AlTiN |
| 16.0 | 60 | 0.25 | 2.0×D | 180 bar | Indexable insert drill or extended-length coolant-through, AlTiN |
| 20.0 | 65 | 0.30 | 2.5×D | 190 bar | Indexable insert drill, AlTiN |
| 25.0 | 70 | 0.35 | 2.5×D | 200 bar | Indexable insert drill, AlTiN |
| 30.0+ | 75 | 0.40 | 3.0×D | 200 bar (machine limit) | Indexable insert drill or BTA, AlTiN |

For deeper holes (above 8×D) the peck interval shortens, the drill geometry shifts to indexable or extended-length, and the cycle time grows non-linearly. Above 20×D, plan a gun drill cycle and budget 5–10× the standard-drill cycle time per hole.

## Drilling checklist

- Select drill geometry for titanium: 130–140° point angle, polished wide flutes, narrow polished margin, web thinned for Ø < 3 mm.
- Use coolant-through drills for any diameter above 3 mm. Order as coolant-through per ISO 5419, not retrofitted.
- Choose the drill by depth class: standard for < 2×D, coolant-through for 2–4×D, high-performance coolant-through for 4–8×D, indexable or extended-length for 8–20×D, gun drill or BTA for > 20×D.
- Set Vc at 50–60% of the value used for 17-4PH stainless at the same diameter; derate 20% for the first article and tighten once tool-wear data confirms.
- Apply a peck cycle on every hole deeper than 2×D. Peck at the first sign of chip crowding, not at a fixed interval.
- Use a spotting drill or short 140° point drill for any hole where the entry surface is not pre-machined, or where hole-position tolerance is below ±0.05 mm.
- Use high-pressure coolant (100–200 bar) for any titanium drill above 6 mm diameter. Filter coolant to 50 µm or finer.
- Reduce feed by 50% at breakthrough (0.5×D retract-and-re-feed) to minimize exit burr.
- For blind holes, stop 0.3–0.5 mm short at full feed, then complete at 50% feed.
- Stop the cycle after 5 holes on a new program and inspect chip packing in the flutes. Packing in the lower third = chip-evacuation problem; packing in the upper third = coolant-pressure problem.
- Replace the drill at the first sign of margin wear, not at the end of tool life. A worn drill on titanium produces a work-hardened layer that the next drill cannot cut.
- For hole-position-critical parts, verify spindle runout ≤ 0.02 mm and fixture locates within ±0.02 mm before starting a production run.

For a drilling review against your specific hole pattern, send the STEP file and the print to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with drill selection, peck cycle, and coolant-pressure recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every drilling and turn-mill RFQ against the checklist above before any tooling is ordered, and the typical outcome is a drill-class pass that catches 1–2 over-aggressive depth-to-diameter specifications per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the drill selection and peck cycle are what determine whether the hole pattern runs on a 3-axis mill, a turn-mill cell, or a dedicated deep-hole cell — and that decision drives the rest of the cycle time.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Drill point geometry comparison: Side-by-side annotated profile of a 118° steel drill point vs a 130–140° titanium drill point, with cutting force vectors and chip-flow direction. Supports queries about why titanium drills differ from steel drills.
Fig 2 — Depth-to-diameter decision tree: Decision flowchart from depth/D ratio through drill type (standard → coolant-through → indexable → gun drill/BTA) with cycle-time and cost annotations. Supports queries about how to choose a deep-hole drill.
Fig 3 — Coolant pressure vs drill diameter chart: Bar chart with drill diameter on X axis (1 mm to 30 mm) and required coolant pressure on Y axis (50 to 200 bar), highlighting the 3 mm threshold above which coolant-through becomes mandatory. Supports queries about coolant pressure for titanium drilling.
-->