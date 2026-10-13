---
title: "Titanium CNC Tolerance vs. Cost: How Tight Is Tight Enough?"
description: "Engineering framework for specifying machining tolerances on titanium parts — ISO 2768 medium vs fine vs explicit functional tolerances, how tighter tolerances raise machining time and inspection cost, and the three questions a designer must answer before tightening a print."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Design & DFM
tags: [Machining Tolerance, ISO 2768, Tolerance Specification, Cost Driver, GD&T, Inspection, RFQ, Titanium CNC, DFM]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-tolerance-cost-cover.jpg
coverImageAlt: PLACEHOLDER — close-up of a titanium bracket with micrometer inspection showing tolerance callout. To be replaced with the final image.
featured: false
---

The most expensive line item on a titanium CNC quote is rarely the material and rarely the tool wear. It is the tolerance the print asks for that the standard shop floor cannot routinely hold. The drawing states ±0.05 mm. The shop makes the part to ±0.10 mm. The buyer pays for ±0.05 mm, and the gap between "as specified" and "as produced" becomes scrap, rework, or schedule slip. Titanium amplifies this gap because low thermal conductivity concentrates heat at the cutting interface (around 7 W/m·K for Ti-6Al-4V, versus roughly 16 W/m·K for 304 stainless) and low elastic modulus (about 110 GPa versus 200 GPa for steel) lets thin features deflect under fixture clamping. Both effects push the achievable tolerance band wider than the print assumes.

This article works through the cost consequence of tolerance on titanium parts, the default bands the shop floor can actually hold, and the three questions a designer or buyer should answer before tightening a print. It assumes the [general DFM guide](/blog/dfm-guide-titanium-parts-design-for-manufacturability/) and the [GD&T article](/blog/gdt-titanium-cnc-parts/) on datum strategy, position, and profile tolerance as background — those cover the geometric language; here we focus on the ± values themselves, and how to specify the right band without paying for what the assembly does not need. For the broader cost-driver picture beyond tolerance, the [titanium CNC cost factors article](/blog/titanium-cnc-machining-cost-factors/) and the [tolerance guide](/blog/titanium-cnc-tolerance-guide-engineering-specifications/) cover the rest of the envelope.

- [Why tolerance is the first cost decision a designer makes](#why-tolerance-is-the-first-cost-decision-a-designer-makes)
- [Default tolerance bands: what ISO 2768 actually buys you](#default-tolerance-bands-what-iso-2768-actually-buys-you)
- [Tightening tolerance beyond ISO 2768: what changes in the quote](#tightening-tolerance-beyond-iso-2768-what-changes-in-the-quote)
- [Functional tolerance: the three questions a designer must answer](#functional-tolerance-the-three-questions-a-designer-must-answer)
- [The "tightest possible" trap: where buyers over-spec](#the-tightest-possible-trap-where-buyers-over-spec)
- [Geometric vs dimensional: why GD&T matters more than ± values](#geometric-vs-dimensional-why-gdt-matters-more-than--values)
- [What tolerance data to attach to the RFQ](#what-tolerance-data-to-attach-to-the-rfq)
- [Tolerance specification checklist](#tolerance-specification-checklist)

## Why tolerance is the first cost decision a designer makes

Tolerance controls three cost variables simultaneously, and on titanium all three move in the same direction when the print tightens. The machinist must run slower (more passes, lighter depth of cut, sharper tool). The inspector must verify more carefully (CMM cycle time scales with both feature count and tolerance value). And the scrap rate rises because tight-tolerance parts fail first-article at a higher rate than the same part at standard tolerance. A 5% scrap rate at ±0.05 mm is a routine cost of doing business; the same scrap rate at ±0.01 mm makes a production run uneconomic for most buyers, because [titanium raw-material cost is 3 to 5 times the cost of stainless steel per kg](/blog/titanium-cnc-machining-cost-factors/) and the material is the part of the scrap that cannot be recovered.

The three variables interact. A machinist who runs slower finishes a part at higher cost; the inspector who measures longer adds an inspection line item the buyer did not budget; the part that fails FAI triggers rework, which doubles the cycle time on the affected unit. The buyer sees the total cost in the quote but not the breakdown by variable — and most quotes do not break it down. The right question to ask a supplier is: of the unit price, what fraction is machining, what fraction is inspection, and what fraction is scrap reserve. The tolerance band determines the split.

## Default tolerance bands: what ISO 2768 actually buys you

ISO 2768-1 is the default band most international buyers reference when they want a part "to print" without specifying every dimension. It groups tolerances into classes that the shop floor can hold with standard tooling and standard inspection:

- **ISO 2768-m (medium)**: the workshop default. ±0.1 mm up to 6 mm, ±0.2 mm up to 30 mm, ±0.3 mm up to 100 mm, ±0.5 mm up to 1000 mm.
- **ISO 2768-c (coarse)**: typically for fabricated or welded assemblies, seldom appropriate for CNC-machined titanium.
- **ISO 2768-f (fine)**: half of medium. ±0.05 mm up to 6 mm, ±0.1 mm up to 30 mm, ±0.15 mm up to 100 mm, ±0.2 mm up to 1000 mm.
- **ISO 2768-2**: applies to machined features only (holes, slots, faces) with the same banding structure but tighter defaults than 2768-1.

For titanium Grade 5 (Ti-6Al-4V) and most CP grades on a 3-axis CNC mill, the achievable shop-floor band is closer to ISO 2768-m than to -f on features that depend on tool wear (long walls, deep pockets) and closer to -f on features that depend on machine accuracy (short faces, hole diameters, slot widths). The [grade 5 material guide](/materials/grade-5/) notes that the alloy's combination of low modulus and high strength at temperature is what widens the achievable band relative to steel — the print can call for -f, but the shop must derate to a slightly looser band on features where tool wear accumulates across a cut.

A pragmatic convention used in many titanium shops: if a tolerance is not specified on the print, ISO 2768-m applies. Writing the print callout as "Tolerances per ISO 2768-m unless otherwise noted" sets the default band explicitly and removes ambiguity at quote time. Without the callout, the shop may quote to its own default (which is closer to ISO 2768-f in some shops, closer to ±0.1 mm in others) and the discrepancy becomes a quality dispute later.

| Class | 0.5–6 mm | >6–30 mm | >30–100 mm | >100–1000 mm | When to apply |
|---|---|---|---|---|---|
| ISO 2768-m (medium) | ±0.1 | ±0.2 | ±0.3 | ±0.5 | Default for non-functional dimensions, cosmetic surfaces, mount envelopes |
| ISO 2768-f (fine) | ±0.05 | ±0.1 | ±0.15 | ±0.2 | Functional fits, sealing surfaces, register features |
| ISO 2768-2 f (fine) | ±0.05 | ±0.1 | ±0.15 | ±0.2 | Machined features only — holes, slots, faces |
| Explicit ±0.02 mm | ±0.02 | ±0.02 | ±0.02 | ±0.02 | Bearing seats, gauge-fit features — only when functional |
| Explicit ±0.01 mm | ±0.01 | ±0.01 | ±0.01 | ±0.01 | Optical interfaces, metrology tooling — rarely on production titanium parts |

## Tightening tolerance beyond ISO 2768: what changes in the quote

The relationship between tolerance and cost is not linear. Halving the tolerance from ±0.05 mm to ±0.025 mm on a single feature rarely doubles the machining time; on most features it triples or quadruples it. Three things change in the cycle:

- The machinist reduces radial depth of cut, increases the number of finishing passes, and often switches to a smaller-diameter or coated finishing tool that costs more and wears faster.
- The machinist waits for thermal stabilization between cuts because titanium's low thermal conductivity keeps heat at the cutting interface, distorting the part until it cools.
- An in-process probing cycle triggers, usually between roughing and finishing, to verify dimension before continuing. Each probe cycle adds 30–90 seconds, and on a part with several critical features the cycles add up.

Beyond ±0.025 mm, the cost driver shifts from machining to inspection. CMM cycle time for a part with 30 inspected features runs 45–90 minutes at ±0.05 mm; the same part at ±0.005 mm runs 2–3 hours because probe selection changes, datum alignment tightens, and re-measurement frequency increases. Optical scanning replaces CMM for some surface-finish-critical features but adds 30–60 minutes per scanned area and typically costs more per cycle than tactile CMM at this tolerance band.

The third cost driver is scrap. A 5% scrap rate at ±0.05 mm is manageable; the same scrap rate at ±0.01 mm makes the program uneconomic. Most shops will not quote ±0.01 mm on a production run without a written acceptance that the buyer absorbs the additional scrap cost, or without a clearly bounded scrap reserve line item on the quote.

| Tolerance band | Machining time multiplier | Inspection line item | Typical application |
|---|---|---|---|
| ±0.1 mm (ISO 2768-m) | 1.0x baseline | Caliper / height gage / plug gage | Cosmetic, non-functional |
| ±0.05 mm (ISO 2768-f) | 1.2–1.5x | CMM on key features | Functional fits, mount interfaces |
| ±0.025 mm | 1.5–2.5x | CMM with probe qualification, optical comparator | Bearing seats, register pins |
| ±0.01 mm | 2.5–4x | CMM + environmental control, gauge calibration | Gauge blocks, optical mounts |
| ±0.005 mm | 4x+, requires grinding or EDM | CMM in climate-controlled room, sub-micron probe | Not standard for production titanium — gauge, metrology only |

The numbers are deliberately ranges, not fixed multipliers, because the multiplier depends on the feature type (a ±0.025 mm hole is cheaper than a ±0.025 mm flatness), the lot size, and the machine's qualification. The order of magnitude is consistent: each halving of tolerance past ISO 2768-f typically adds 25–60% to the part cost. A buyer who halves tolerance on 5 features pays roughly twice the unit cost on those 5 features — not twice the unit cost on the part.

## Functional tolerance: the three questions a designer must answer

The fastest way to right-size tolerance is to answer three functional questions in order.

**1. What does this feature do in the assembly?** A hole pattern that mates to a bolt circle, a flange face that seals against an O-ring, and a register pin that locates a mating part have functional tolerances. A cosmetic surface, a clearance hole for cable routing, and a label-pad flat do not. Most titanium parts in our shop have 3–5 functional features and 8–15 cosmetic ones — the print usually lists them at the same tolerance, which is the source of the cost problem. A typical drawing review surfaces 2–3 features per part where loosening the spec from ±0.025 mm to ISO 2768-f saves 20–30 minutes of cycle time without changing the assembly fit.

**2. What is the next operation's tolerance?** If a hole is going to be reamed, honed, or ground downstream, the as-machined tolerance can be ±0.05 mm because the finishing operation will tighten it. If the hole is the final state, the as-machined tolerance must equal the functional tolerance. Many "over-tolerance" prints come from designers specifying the final-state tolerance on a feature that is going to be reamed downstream — paying for tight as-machined tolerance and then paying again for the reaming operation. The fix is to specify the as-machined tolerance at the print and the final-state tolerance at the process step.

**3. What can the inspection line item absorb?** A part with 30 features at ±0.05 mm has an inspection cost of roughly $80–$200 on a typical aerospace bracket (CMM cycle plus operator time). The same 30 features at ±0.01 mm has an inspection cost of $300–$800 because of probe qualification, datum re-alignment, and re-measurement loops. The tolerance the buyer specifies must be matched by the inspection budget the program is funding — otherwise the shop will skip inspections to stay on price, which defeats the purpose of the tight tolerance. The [CMM total cost of ownership article](/blog/5-year-cmm-total-cost-of-ownership-aerospace-startup/) covers what inspection capacity actually costs to maintain, which is often the binding constraint on tight-tolerance programs.

## The "tightest possible" trap: where buyers over-spec

Three patterns drive over-spec on titanium prints. Each has a downstream cost consequence the buyer does not see in the initial quote.

**Pattern 1 — copying the previous drawing.** A buyer issues a print for a new titanium part by copying a similar print and updating the material callout. The original part was a different geometry with different functional requirements, but the tolerance callouts are reused verbatim. The new part has cosmetic features inherited at ±0.025 mm, the machining time doubles, and the quote is twice the buyer's target. The fix is a tolerance review against the new part's assembly fit, not the old part's print.

**Pattern 2 — specifying ±0.01 mm "to be safe."** A designer adds tighter tolerance to features they are uncertain about, on the rationale that the part can always be machined to a looser tolerance. This is backwards: tighter tolerance raises cost and cycle time, and the shop is not allowed to loosen the spec without a print revision. A safer default is to specify the loosest functional tolerance and tighten only features that need it.

**Pattern 3 — stacking tolerances across features.** A print lists ±0.025 mm on a hole position, ±0.05 mm on the mating register face, and ±0.1 mm on the mount pattern. Individually, each is achievable. Stacked, they require the CMM to verify three datum schemes per assembly, and the part slips out of tolerance at one of the datums on roughly 8% of the first articles — triggering rework the buyer pays for. The fix is to consolidate the datum scheme (3-2-1) under a single tolerance frame, as covered in the [GD&T article](/blog/gdt-titanium-cnc-parts/).

The over-spec penalty is not theoretical. A 2024 internal review of titanium RFQs at our shop showed that roughly 35% of prints had at least one feature tightened beyond what the assembly fit required, and the average cost recovery from a tolerance review on those prints was 18% of the unit price. The buyer is paying for inspection the part does not need, and the shop is generating inspection data the buyer does not use.

## Geometric vs dimensional: why GD&T matters more than ± values

A part specified entirely in ± values can be manufactured to size and still not assemble. The reason is that ± controls the size of each feature in isolation; GD&T controls the relationship between features against a datum reference frame. For titanium parts, the relationship is what determines assembly fit, not the size.

The functional difference shows up in the [GD&T article](/blog/gdt-titanium-cnc-parts/) on position, profile, and datum strategy. The cost dimension is straightforward: a part specified in ± values requires the inspector to measure every feature. A part specified in GD&T requires the inspector to measure the relationships — fewer measurements, tighter assembly control, lower total inspection cost. The buyer who invests in GD&T specification up front typically spends less on inspection than the buyer who relies on ± values, even when the GD&T tolerance band is tighter.

For the part designer, the practical rule is: use ± for individual feature sizes, use GD&T for relationships (position, profile, orientation, runout). On a part with 30 features, the GD&T approach typically uses 8–12 datum-referenced callouts instead of 30 ± callouts, and the inspection cycle runs 20–30% faster. The [AS9102 first-article inspection article](/blog/as9102-fai-titanium-parts/) covers how GD&T-defined parts are verified at first article, and why the verification cost is lower than for ±-defined parts at the same functional tolerance.

## What tolerance data to attach to the RFQ

The fastest way to get a usable quote is to attach the following to the RFQ package:

- The drawing with all tolerance callouts and the default tolerance band (ISO 2768-m or -f) clearly noted.
- A 3D STEP file with datum features and functional surfaces marked.
- A list of 3–5 functional features and their required tolerance.
- The inspection method the program expects (CMM, optical comparator, hand gauges, or combination).
- The next operation downstream if any feature is to be reamed, honed, or ground.
- The acceptable scrap rate or the cost-sharing agreement for out-of-tolerance parts.

The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review each RFQ against this checklist before any tooling is ordered, and the typical outcome is a tolerance review that surfaces 2–3 over-specified features per drawing — saving the buyer 15–30% on the part cost without changing the functional design.

## Tolerance specification checklist

- Specify the default tolerance band on the print: ISO 2768-m unless otherwise noted.
- Distinguish functional features (bearing seats, sealing surfaces, register pins) from cosmetic features; use ISO 2768-f or tighter only on functional features.
- Apply GD&T for relationships (position, profile, orientation), not for individual feature sizes.
- For features going to a downstream finishing operation, specify the as-machined tolerance, not the final-state tolerance.
- For ±0.025 mm or tighter, budget the inspection line item explicitly; otherwise the shop will skip inspections to stay on price.
- Avoid stacked ± values across features that share a datum — consolidate under a single datum scheme.
- On drawings issued to ISO convention, mirror the GD&T intent (datum targets, MMC, profile) but use ISO 1101 / ISO 5459 callout syntax.
- Attach the default tolerance band, the functional feature list, the downstream operations, and the inspection method to the RFQ.

For a tolerance review against these rules, send the drawing and STEP file to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with the tolerance callouts flagged for cost, cycle time, and inspection budget. Tolerance is the line item most often under-estimated in titanium RFQs, and the [AS9100D quality management process](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/) that backs the engineering review treats tolerance as a first-class design input rather than a back-end QA check. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the tolerance band determines whether the part runs on a 3-axis mill, a 5-axis cell, or a dedicated mill-grind cell — and that decision drives the rest of the cost stack.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — ISO 2768 tolerance bands chart: Visual band diagram showing m / c / f classes for linear dimensions, with the typical titanium machinability floor marked for each feature type.
Fig 2 — Tolerance vs cost curve: Bar chart with tolerance band on X axis (0.1 mm down to 0.005 mm) and relative cost multiplier on Y axis (1x to 4x+). Helps buyers see the non-linear cost impact of each halving.
Fig 3 — Datum scheme consolidation: Side-by-side diagram of a print with stacked ± callouts vs the same part with a 3-2-1 datum frame and consolidated GD&T — showing the inspection callout reduction and the cost impact on CMM cycle time.
-->