---
title: "Titanium CNC Thread Design: Engagement, Depth and Tolerance"
description: "Engineering guide to designing internal and external threads on titanium CNC parts — UN / UNF / UNJ / ISO metric / MJ form selection, engagement length for steel-into-titanium vs titanium-into-titanium, tap drill depth, and thread tolerance classes."
pubDate: 2026-10-10
author: Boze Titanium Manufacturing Center
category: Design & DFM
tags: [Thread Design, Tap Drill, UNJ, MJ, ISO Metric, Engagement Length, Thread Tolerance, Titanium CNC, DFM]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-thread-design-cover.jpg
coverImageAlt: PLACEHOLDER — cross-section of a tapped hole in titanium showing engagement length and thread relief. To be replaced with the final image.
featured: false
---

Threads on titanium parts behave under three constraints that don't apply the same way to steel or aluminum: low modulus causes thread roots to deflect under preload (so engagement length must be greater), low thermal conductivity traps heat at the cutting edge during tapping (so chip evacuation and cutting parameters matter more), and titanium's chemistry makes it prone to galling under metallic contact (so thread form and surface treatment need to be chosen deliberately). Get the thread design wrong at the drawing level and the failure mode is not "bolt loosens" — it is "tap breaks in the hole on the third part" or "thread strips on first assembly."

This article covers the four thread-design decisions that determine whether a titanium part is buildable: thread form selection, engagement length, tapped-hole geometry (tap drill and depth), and tolerance class. It assumes familiarity with the [GD&T article](/blog/gdt-titanium-cnc-parts/) and the [hole design article](/blog/titanium-cnc-hole-design/) — those cover hole geometry and position tolerance; here we focus on the thread itself. For the cutting parameters that execute these designs, see the [titanium machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/).

- [Why thread design on titanium is different](#why-thread-design-on-titanium-is-different)
- [Thread forms: UN, UNF, UNJ, ISO metric, MJ, ACME](#thread-forms-un-unf-unj-iso-metric-mj-acme)
- [Engagement length: why titanium needs more than steel](#engagement-length-why-titanium-needs-more-than-steel)
- [Tapped hole design: tap drill, depth, chip evacuation](#tapped-hole-design-tap-drill-depth-chip-evacuation)
- [Thread tolerance classes](#thread-tolerance-classes)
- [Cut vs roll vs mill threads](#cut-vs-roll-vs-mill-threads)
- [Galling and anti-seize](#galling-and-anti-seize)
- [Inspection and documentation](#inspection-and-documentation)
- [Thread-design checklist](#thread-design-checklist)

## Why thread design on titanium is different

The constraints from titanium's material properties converge on the thread interface. Low modulus (about 110 GPa for Ti-6Al-4V versus 200 GPa for steel) means each thread pitch shares more of the preload load than it would in a steel nut, so the shear stress on each thread is higher — and the joint needs more engaged turns to distribute the load. Low thermal conductivity (around 7 W/m·K) means heat from the tap cutting edge has no path through the workpiece; the heat concentrates at the cutting edge, accelerating tap wear and pushing cutting temperature toward the alpha-case threshold. Titanium's tribochemistry means two titanium surfaces in contact under load and motion will cold-weld (transfer material) rather than slide smoothly — this is galling, and it dominates the assembly-side risk.

These three constraints translate into four drawing decisions that determine whether the part is buildable:

1. **Thread form** — UN/UNF (sharp root), UNJ/MJ (rounded root for fatigue), or ACME.
2. **Engagement length** — how many thread pitches the bolt reaches into the tapped hole.
3. **Tap drill depth** — the drilled depth behind the threads, accounting for engagement, relief, and drill point.
4. **Tolerance class** — how tight the thread fit is.

The remainder of this article walks through each.

## Thread forms: UN, UNF, UNJ, ISO metric, MJ, ACME

The first decision is which thread standard to specify. The choice is constrained by the assembly-side standard (the mating nut or fitting), not by machining convenience.

| Standard | Common designation | Application |
|---|---|---|
| Unified National Coarse | UNC (per ASME B1.1) | General-purpose bolts, standard fasteners |
| Unified National Fine | UNF (per ASME B1.1) | Aerospace thin-wall fasteners, higher preload per unit depth |
| Unified National J-form | UNJC, UNJF (per MIL-S-8879) | Aerospace critical — rounded root for fatigue life |
| ISO metric coarse | M (per ISO 261, ISO 262) | General-purpose metric assemblies |
| ISO metric fine | Mf | Thin-walled metric assemblies |
| MJ (per ISO 5855) | MJ | Aerospace metric — rounded root, controlled radius |
| ACME | ACME (per ASME B1.8) | Lead screws, slow motion, not for holding preload |

The titanium-specific consideration is fatigue. Both UNJ (per MIL-S-8879) and MJ (per ISO 5855) specify a controlled thread root radius (rounded root rather than the sharp root of UNC/M) — this roughly doubles the fatigue life of the threaded joint for the same minor diameter and engagement length. For aerospace structural joints where fatigue dominates the design, UNJF or MJ is preferred over UNF or M. The cost difference is in the tap or thread mill, not the material — the supplier must own the right tooling.

For chemical processing, marine, and medical assemblies where the thread is sealed (PTFE tape, O-ring, anaerobic sealant) and not fatigue-critical, UNC/UNF or metric coarse/fine is fine. The standard choice from the assembly-side usually settles the question.

For external threads on titanium studs, the same standards apply. The advantage of rolled external threads (formed by pressing rather than cutting) is that the cold work hardens the surface and improves fatigue strength — typical for aerospace studs.

## Engagement length: why titanium needs more than steel

The minimum thread engagement for a bolted joint depends on the shear strength of the internal thread material, the bolt strength, and the thread geometry. For titanium tapped holes receiving steel bolts, the engagement length must be longer than for steel-in-steel because titanium's thread shear strength is roughly 60% of medium-carbon steel's, and because titanium's modulus (about 110 GPa) is half of steel's, so the threads share load over more turns.

The standard rule for titanium:

- For steel bolts (10.9 grade per ISO 898-1 / SAE J429 grade 8) into Ti-6Al-4V tapped holes: minimum engagement 1.5×D, target 2.0×D.
- For titanium bolts into titanium tapped holes: minimum engagement 2.0×D, target 2.5×D.
- For fatigue-critical joints per aerospace structural integrity programs (e.g., MIL-STD-1530 USAF Aircraft Structural Integrity Program): minimum 2.5×D, with controlled thread root radius (UNJ or MJ).
- For medical implants (ASTM F136, ISO 5832-3): engagement per the implant specification; typically 1.5–2.0×D for bone screws, longer for spinal cages.

Below 1.5×D engagement, the joint becomes sensitive to thread quality, lubrication, and torque variation. Below 1.0×D, the joint is unreliable and should not be specified for production parts.

A practical table:

| Bolt grade | Tapped material | Min engagement | Target engagement |
|---|---|---|---|
| 8.8 / 10.9 (medium carbon) | Ti-6Al-4V annealed | 1.5×D | 2.0×D |
| 12.9 (alloy) | Ti-6Al-4V annealed | 1.5×D | 2.0×D |
| 8.8 / 10.9 | CP titanium (Grade 2) | 1.5×D | 2.0×D |
| Ti-6Al-4V bolt | Ti-6Al-4V tapped | 2.0×D | 2.5×D |
| Any | Beta titanium (e.g. Ti-10V-2Fe-3Al) | 2.0×D | 2.5×D |

Longer engagement reduces the risk of thread stripping but adds tapped depth, which adds blind-hole depth, which (per the [hole design article](/blog/titanium-cnc-hole-design/)) increases the risk of tap breakage from chip packing.

## Tapped hole design: tap drill, depth, chip evacuation

The tap drill diameter determines the percentage of thread (the ratio of cut material area to theoretical full-thread area) and the cutting torque during tapping. For titanium, the trade-off is between:

- **Higher thread percentage** (75–80%): stronger joint, higher tap torque, more chip evacuation demand. Standard ISO 230/1 metric tap drills and the inch equivalent specify around 75% for general use.
- **Lower thread percentage** (60–65%): weaker joint, lower tap torque, easier chip evacuation. Used for deep blind holes or for materials that work-harden aggressively.

For titanium, the standard 75% thread tap drill is appropriate for shallow holes (depth-to-diameter less than 4:1). For deep blind holes, drop to 65% thread to reduce tap torque. The trade-off in joint strength is recovered by the longer engagement length (2.0×D instead of 1.5×D).

Tap drill tolerance for titanium follows the tap manufacturer chart (e.g., OSG, Kennametal, Guhring). For Ti-6Al-4V, the tap drill tolerance is typically ±0.025 mm or ±0.001 in, depending on the tap tolerance class.

Tap depth in a blind hole must include:

- The required thread engagement length (1.5–2.0×D per above).
- A thread relief (run-out) at the bottom of 1.5–2.0 additional pitches to allow the tap chamfer to clear.
- A drill point allowance at the very bottom of the drilled hole (1×D for a standard 118° point drill, more for a flat drill).

So for an M6 × 1.0 thread at 2.0×D engagement in a blind tapped hole, the total drilled depth is roughly 2×D (engagement) + 2×pitch (relief) + 1×D (drill point) = 12 + 2 + 6 = 20 mm minimum. For an M6 × 1.0 tap drill diameter (Ø 5.0 mm tap drill for 75% thread), the depth-to-diameter ratio is 20/5.0 = 4.0×D, which is at the upper limit of standard tapping on titanium. For deeper, specify thread milling instead.

Tap geometry for titanium differs from steel:

- **Spiral-point taps** (Bull nose / "bullhead") for through-holes; they push chips forward through the hole.
- **Spiral-flute taps** for blind holes; they pull chips up the flutes and out of the hole. The spiral angle is typically 15–30° for titanium (less than for aluminum, which uses 40–45°).
- **Straight-flute taps** for short, brittle chips or hardened material; common for short chip materials but not optimal for titanium's long stringy chips.
- **Coatings**: TiN, TiCN, TiAlN, or DLC. TiAlN is preferred for titanium because it tolerates the high cutting temperature at the tap edge.
- **Coolant-through** for any tap above Ø 4 mm or deeper than 2×D. External flood is inadequate.

## Thread tolerance classes

Thread tolerance is the looseness or tightness of the thread fit, separate from the thread form. For titanium, the standard classes are:

| Standard | Internal thread | External thread | Typical use |
|---|---|---|---|
| ISO metric | 6H | 6g | General-purpose assemblies, default choice |
| ISO metric | 5H 6H | 6g | Closer fit, used when alignment matters |
| ISO metric | 4H 5H | 4h 6g | Precision fit, instrumentation |
| Unified (ASME B1.1) | 2B | 2A | General-purpose (default) |
| Unified (ASME B1.1) | 3B | 3A | Precision fit |
| Unified | 1B | 1A | Loose fit (legacy, avoid) |

For most titanium assemblies, ISO 6H/6g or UNF/UNC 2B/2A is the default. Tighter classes (ISO 5H/6g or UN 3A/3B) are reserved for alignment-critical features (bearing housings, optical mounts, instrumentation interfaces).

For titanium, specifying tighter than 6H/2B typically increases tap cost by 30–60% because the tap manufacturer must hold a tighter thread tolerance, and the threading cycle time increases because chip evacuation is harder at tight tolerances. For procurement, ask the supplier what tolerance class is being quoted — a "M6 × 1.0" thread callout is ambiguous without the tolerance class.

## Cut vs roll vs mill threads

The three thread production methods have different cost, fatigue, and DFM profiles:

| Method | Best for | Limitation | Cost driver |
|---|---|---|---|
| Cut (tapping) | Through-holes; shallow blind holes; small batches | Chip evacuation in deep blind holes; tap breakage risk on titanium | Tap cost, cycle time per hole |
| Roll | External threads on studs and bolts; high-volume | Limited to ductile materials (CP, Grade 5 work well); not for thin sections | Cold-forming force; requires heading/rolling equipment |
| Mill (thread mill) | Hardened material; large diameter; deep blind holes; tight tolerance | Slower cycle per hole; requires CNC with helical interpolation | Tool cost; programming complexity |

For titanium internal threads, thread milling is the safest choice for deep blind holes because the cutter (a small thread mill) evacuates chips better than a tap and can be retracted without chip packing. The trade-off is cycle time: thread milling typically takes 3–6× the time of tapping for the same feature. For high-volume production of shallow blind holes, tapping remains faster and cheaper.

For external threads on titanium, thread rolling is preferred when the part geometry allows it (round cross-section, no undercuts). Rolled threads have higher fatigue strength than cut threads because the cold work produces a beneficial compressive residual stress at the thread root.

## Galling and anti-seize

Galling is the dominant failure mode for titanium threaded joints under metallic contact. When two titanium surfaces slide against each other under load (during tightening), the contact zones cold-weld and tear, producing localized seizure. The result is a fastener that seizes before reaching the specified torque, or that sticks so firmly during disassembly that the tool rounds the head off.

Three countermeasures that work:

1. **Dissimilar materials at the thread interface.** Steel bolts in titanium tapped holes (or vice versa) gall less than titanium-in-titanium because the metallurgy differs. This is the most common aerospace practice.
2. **Thread form coatings.** Dry-film lubricant (PTFE-based, per MIL-PRF-46010 or similar), graphite, or MoS₂ coatings applied to the threads reduce the contact friction coefficient below the galling limit. Aerospace fastener standards (e.g., AS8879 for UNJ) often specify coating per the application.
3. **Anti-seize compounds.** Copper-based, nickel-based, or PTFE-based pastes applied at assembly. These work but are process-sensitive — the wrong compound or under-application accelerates galling. Specify the compound on the drawing or in the assembly procedure.

Avoid: oil or grease only (not enough), chrome plating of titanium threads (chromium-on-titanium galling is worse than titanium-on-titanium), and cadmium plating (banned for many aerospace programs).

## Inspection and documentation

Thread inspection is bounded by three methods, in increasing cost:

1. **Go/No-Go thread plug or ring gage.** Fast (under 5 seconds per feature), qualitative, and standard for production acceptance. The plug gage confirms the internal thread; the ring gage confirms the external thread. The "Go" gage must enter/engage freely; the "No-Go" must not enter more than 2 turns. This is the standard for AS9100 production parts.
2. **Optical comparator / vision system.** Measures thread profile, pitch diameter, and lead. Used for first-article inspection and for periodic calibration of the thread plug/ring gages. Typically 5–10 minutes per feature.
3. **CMM with thread probe.** Direct measurement of thread parameters per ASME B1.1 or ISO 965. Slowest (15–60 minutes per feature) but produces a complete thread parameter report. Reserved for qualification, FAI, or dispute resolution.

For AS9100 programs, the FAI report per AS9102 records the thread class, the actual measured values for pitch diameter and thread profile, and the gage used for acceptance.

## Thread-design checklist

- Specify thread form per the assembly-side standard. Use UNJ/MJ for fatigue-critical joints; UNC/UNF or M/Mf for general-purpose.
- Engagement length: minimum 1.5×D for steel-into-titanium, 2.0×D for titanium-into-titanium, 2.5×D for fatigue-critical.
- Tap drill per ISO 230/1 or ASME B1.1 tap chart. For deep blind holes, drop thread percentage to 60–65% to reduce tap torque.
- For deep blind holes (>4×D), consider thread milling instead of tapping to avoid tap breakage.
- Apply thread tolerance class ISO 6H/6g or UN 2A/2B by default. Specify tighter only when alignment is functionally critical.
- For external threads on titanium, prefer thread rolling when the geometry allows it.
- For titanium-into-titanium joints, specify a thread coating or anti-seize compound per the assembly procedure.

For a thread-design review against these rules, send the STEP file and the drawing to our [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with the tap process, depth strategy, and thread class flagged for tap cost and assembly risk. Thread cost varies widely across suppliers, and the [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) define thread process before any tooling is ordered. For Ti-6Al-4V [Grade 5](/materials/grade-5/) parts, thread cost is typically dominated by the tap selection (standard vs custom) and the depth strategy (tapping vs thread milling).

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Thread form comparison: Side-by-side profile of UNF (sharp root), UNJ (rounded root), MJ (rounded root + larger crest truncation), and ACME (trapezoidal). Annotations show pitch diameter and root radius. Supports queries about thread form selection for fatigue-critical joints.
Fig 2 — Engagement length vs material: Bar chart showing minimum engagement length for steel-into-steel (1.0×D), steel-into-titanium (1.5–2.0×D), titanium-into-titanium (2.0×D), fatigue-critical titanium (2.5×D). Supports queries about why titanium needs longer engagement.
Fig 3 — Tap drill depth components: Annotated cross-section showing engagement length, thread relief run-out, and drill point allowance. Supports queries about how to size drilled depth for a blind tapped hole.
-->