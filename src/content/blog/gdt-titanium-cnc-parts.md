---
title: "GD&T for Titanium CNC Parts: Position, Profile and Datum Strategy"
description: "Engineering guide to applying ASME Y14.5 GD&T — position, profile, and datum strategy — to titanium CNC machined parts. Covers datum selection on thin-wall features, profile tolerance vs surface finish, and the inspection cost trade-off when MMC vs RFS is specified."
pubDate: 2026-10-10
author: Boze Titanium Manufacturing Center
category: Design & DFM
tags: [GD&T, ASME Y14.5, Position Tolerance, Profile Tolerance, Datum Strategy, Titanium CNC, DFM, Engineering Drawing]
coverImage: /uploads/PLACEHOLDER-blog-gdt-titanium-cnc-parts-cover.jpg
coverImageAlt: PLACEHOLDER — engineering drawing showing GD&T callouts on a titanium CNC part. To be replaced with the final image.
featured: false
---

GD&T (Geometric Dimensioning and Tolerancing) per ASME Y14.5 is not a refinement of conventional +/− tolerancing — it is a different language. Where conventional tolerancing controls the size of individual features in isolation, GD&T controls the relationship between features against a datum reference frame. For titanium parts, that distinction is functional, not academic: the material's low elastic modulus (Ti-6Al-4V at roughly 110 GPa, versus about 200 GPa for steel and 70 GPa for aluminum) means small geometric deviations translate into measurable assembly shifts, and its low thermal conductivity concentrates residual stress at machined surfaces — both of which make datum selection, position tolerance, and profile tolerance load-bearing decisions rather than cosmetic ones.

This article focuses on three GD&T callouts that frequently drive rework, scrap, and quote escalation on titanium CNC parts: position tolerance, profile tolerance, and datum strategy. It assumes familiarity with the [general titanium CNC tolerance guide](/blog/titanium-cnc-tolerance-guide-engineering-specifications/) (ISO 2768, ASME Y14.5 default tolerance grades, surface finish bands); here we treat those as the floor and go straight to functional geometric control. For broader DFM rules covering wall thickness, corner radii, and pocket depth, see the [DFM guide for titanium parts](/blog/dfm-guide-titanium-parts-design-for-manufacturability/).

- [Why GD&T matters more for titanium than for steel or aluminum](#why-gdt-matters-more-for-titanium-than-for-steel-or-aluminum)
- [Position tolerance: when coaxiality is more important than size](#position-tolerance-when-coaxiality-is-more-important-than-size)
- [Profile tolerance: controlling form, orientation, and assembly interface](#profile-tolerance-controlling-form-orientation-and-assembly-interface)
- [Datum strategy: choosing features that survive the manufacturing process](#datum-strategy-choosing-features-that-survive-the-manufacturing-process)
- [MMC vs RFS: how material condition modifiers change the cost](#mmc-vs-rfs-how-material-condition-modifiers-change-the-cost)
- [Inspection method drives GD&T cost as much as tolerance value](#inspection-method-drives-gdt-cost-as-much-as-tolerance-value)
- [GD&T checklist for titanium CNC drawings](#gdt-checklist-for-titanium-cnc-drawings)

## Why GD&T matters more for titanium than for steel or aluminum

The elastic and thermal properties of titanium conspire against conventional tolerancing in three ways. First, low modulus (about 110 GPa for Ti-6Al-4V in the typical annealed condition) means a thin flange dimples more under fixture clamping than the same flange in steel or aluminum. If the datum feature happens to be the dimpled face, every downstream measurement inherits a systematic offset. Second, low thermal conductivity (around 7 W/m·K for Ti-6Al-4V, versus 16 for 304 stainless and 167 for 6061-T6 aluminum) means heat from cutting concentrates locally and distorts the part differentially. A surface measured hot against a datum measured cold returns a different answer than the same part at thermal equilibrium. Third, titanium's work hardening response means a feature that was re-cut to "clean up" a geometric deviation often returns a worse surface and harder-than-stock, defeating the rework.

GD&T addresses these problems by separating functional requirements from manufacturing convenience: datums are declared explicitly (rather than inferred from the machine setup), tolerances are expressed as geometric zones relative to those datums (rather than as +/− bands per feature), and material condition modifiers (MMC, LMC, RFS) absorb the small feature-size variations that low-modulus parts exhibit during machining and inspection. ASME Y14.5-2018 is the controlling standard for US-issued drawings; ISO 1101:2017 and ISO 5459:2011 cover the equivalent ISO-aligned convention. Where both apply on the same program, the callout syntax differs but the geometric intent is interchangeable.

## Position tolerance: when coaxiality is more important than size

Position tolerance locates the axis or center plane of a feature relative to datums. For a clearance hole pattern on a titanium bracket, the question is rarely "is the hole Ø6.30 mm?" — it is "is the bolt pattern aligned to the mating part?" Position tolerance answers the assembly question directly, with a smaller total tolerance zone than an equivalent +/− specification.

ASME Y14.5-2018 expresses position tolerance as a diametrical zone (Ø) at the true position, in the order: feature of size, position symbol, tolerance value, datums, material condition modifiers (MMC, LMC, RFS). A typical callout reads:

> ⌖ | Ø 0.25 | A | B | M

This says the bolt pattern axes must lie within a Ø 0.25 mm cylindrical zone referenced to datums A and B, with the MMC (M) modifier applied. The MMC modifier grants a bonus tolerance equal to the departure from MMC up to the specified tolerance value, which can materially widen the available tolerance band for a clearance hole without increasing scrap at the inspection gate.

For titanium, four position-tolerance patterns cover most of the callouts seen on engineering drawings:

| Pattern | Typical position tolerance | Why it matters for titanium |
|---|---|---|
| Fastener clearance holes | Ø 0.25–0.50 mm at MMC | Bonus tolerance at MMC absorbs thermal drift during inspection and small elastic deflection under clamping |
| Press-fit or pinned holes | Ø 0.05–0.10 mm at MMC | Tight functional tolerance cannot absorb geometric variation, so the modifier matters less than the band size |
| Bearing seat bores | Ø 0.02–0.05 mm | Combined with profile and runout; bearing life is sensitive to micro-misalignment |
| Optical or instrumentation features | Ø 0.01–0.02 mm | Datum scheme and inspection method dominate over machine repeatability |

Position tolerance is inspected on a coordinate measuring machine (CMM) using the same datum reference frame as the manufacturing setup, or calculated by aligning the measured feature to the datum targets. The accuracy of the inspection is bounded by the datum scheme — which is why datum strategy cannot be separated from position tolerance.

## Profile tolerance: controlling form, orientation, and assembly interface

Profile tolerance controls the form of a surface or the boundary of a feature. ASME Y14.5 distinguishes between profile of a surface (the envelope of a 3D form) and profile of a line (a 2D cross-section). For titanium machined parts, the more common callout is profile of a surface applied to:

- Sealing surfaces (flange faces, O-ring grooves, gasket interfaces) where the mating interface controls leak rate.
- Aerodynamic or hydrodynamic surfaces where surface waviness affects flow or boundary layer behavior.
- Conjugate surfaces where the titanium part mates to a composite, honeycomb, or another titanium part without fasteners.

Profile of a surface is specified with a tolerance value, the profile symbol, and (when applicable) datums. A flange face might read:

> ⌭ | 0.10 | A | B

This means the entire flange surface must lie between two parallel surfaces 0.10 mm apart, both parallel to datum A and referenced to datum B. With a profile tolerance, the part is not "checked at three points" — it is checked across the full surface via CMM scan or optical comparator, which is why profile tolerance raises inspection cost faster than +/− tolerance.

For titanium sealing surfaces, a common DFM trap is specifying profile tolerance 0.05 mm and surface finish Ra 0.8 µm simultaneously. Both are achievable individually, but the combination forces a two-pass strategy (separate semi-finishing and finishing) plus a final lapping or honing step, because the cutting tool leaves a form error larger than the profile band even at the finish pass. The fix is rarely a tighter machine — it is a different cutter geometry, a different cutter engagement angle, or a more conservative finishing stock allowance.

## Datum strategy: choosing features that survive the manufacturing process

Datum strategy is the most consequential GD&T decision and the one most often deferred to the inspector rather than the designer. ASME Y14.5-2018 defines a datum reference frame as the ordered set of primary, secondary, and tertiary datums (A, B, C) used to establish the part for inspection. ISO 5459:2011 establishes the equivalent datum systems for ISO 1101 drawings.

For titanium parts, the datum features must satisfy three conditions that do not apply the same way to steel or aluminum:

1. **Repeatability under clamping.** A datum surface that visibly dimples under fixture clamping force is a bad datum. Titanium's springback at low modulus means a vise jaw can mark or deflect a thin flange by 0.02–0.05 mm, which becomes the systematic error of every downstream measurement. Datum targets (small milled pads specified on the drawing) let the design isolate the datum from the clamping interface.

2. **Thermal stability.** A datum established on a thin wall that has not reached thermal equilibrium will move during inspection. For tight-tolerance titanium parts, the inspection itself can take long enough that the part temperature drifts. Establishing the datum on a thick boss or on a feature with high thermal mass reduces this drift.

3. **Functional relevance.** The datum should match how the part is loaded in service. A bracket that bolts to a primary structure on face X should have datum A on face X, regardless of which face is easier to machine. Inspecting against a non-functional datum can pass parts that fail in assembly because the inspection did not see the loaded direction.

For multi-feature titanium brackets, a robust 3-2-1 datum scheme typically uses:

- **Primary (A):** a planar face on the thickest section of the part, machined flat in a single setup, with three datum targets separated to maximize stability.
- **Secondary (B):** a perpendicular planar face or a precision-bored hole, registered to A with two datum targets.
- **Tertiary (C):** a feature that prevents rotation around the A-B intersection, typically a second hole or a side face.

On thin-wall titanium parts (aspect ratio above 8:1), the practical advice is to specify datum targets rather than whole-surface datums. Whole-surface datums on a deflectable feature shift between setups; targets, by contrast, define small machined pads that the fixture and CMM locate against. Process-side practices that keep datum features stable during machining are covered in the [thin-wall titanium machining guide](/blog/cnc-machining-thin-wall-titanium/), and the [titanium CNC deformation analysis](/blog/titanium-cnc-machining-deformation-causes-and-prevention/) details the springback mechanisms that make target-based datums necessary.

## MMC vs RFS: how material condition modifiers change the cost

ASME Y14.5 material condition modifiers — Maximum Material Condition (MMC, Ⓜ) and Least Material Condition (LMC, Ⓛ), and the default Regardless of Feature Size (RFS) — change whether the tolerance band grows as the feature departs from its stated size.

For a Ø 6.30 ± 0.10 mm clearance hole with position tolerance Ø 0.40 at MMC, the effective inspection limit is:

- At MMC (Ø 6.20): position must be within Ø 0.40 mm
- At LMC (Ø 6.40): position can be up to Ø 0.60 mm (Ø 0.40 + Ø 0.20 bonus)

For titanium, MMC is the most common modifier because it grants bonus tolerance that absorbs the small geometric drift that low modulus and thermal expansion introduce during machining. RFS (no modifier) is preferred for features that must locate regardless of size variation — bearing seats, sealing bores, and pinned holes.

Specifying RFS on a clearance hole pattern typically doubles the scrap rate on a tight-tolerance titanium part, because the inspection rejects parts that would have assembled cleanly with MMC. If you do not need RFS for a functional reason, MMC almost always produces a more manufacturable drawing for titanium.

## Inspection method drives GD&T cost as much as tolerance value

CMM cycle time scales with the number of datums, the number of features, and the tolerance value. For a titanium aerospace bracket with 30 inspected features and a 3-2-1 datum scheme, a typical CMM cycle runs 45–90 minutes; with optical scanning for profile surfaces, that can extend to several hours. The cost of that cycle is included in the inspection line item of the quote — and it is the line item most often underestimated by buyers comparing quotes on unit price alone.

Practical rules for keeping GD&T cost aligned with functional need:

- Specify profile tolerance only on surfaces that mate to another part. Free surfaces do not need it.
- Specify position tolerance at MMC for clearance hole patterns, RFS for press-fit and bearing seats.
- Use datum targets rather than whole-surface datums on flexible features.
- For high-feature-count parts, group GD&T-controlled features under a single datum scheme rather than mixing per-feature datums, which forces the CMM to re-fixture between measurements.

For procurement teams comparing quotes that include GD&T-controlled titanium parts, ask for a feature-by-feature GD&T callout list and a separate CMM cycle time estimate. Two quotes with the same unit price can differ substantially on the inspection line item (often 20–50%) depending on how GD&T is specified. Our [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) define datum scheme and inspection plan as part of the [RFQ review](/rfq/) before tooling is ordered. For Ti-6Al-4V [Grade 5](/materials/grade-5/) parts in particular, the inspection line item usually determines whether the part is on a 5-axis milling cell or a 3-axis cell with secondary CMM inspection.

## GD&T checklist for titanium CNC drawings

- Establish the datum scheme from the assembly, not from the machine. Primary datum = functional mounting face.
- Specify position tolerance at MMC for clearance holes; RFS only for press-fits and bearing seats.
- Apply profile tolerance on sealing and conjugate surfaces only; avoid blanket profile tolerance across free surfaces.
- Use datum targets on flexible features (thin walls, flanges) instead of whole-surface datums.
- Keep the GD&T-controlled feature count consistent with the CMM cycle time the program is funding.
- On drawings issued to ISO 1101 convention, mirror the GD&T intent (datum targets, MMC, profile) but use the ISO 1101 / ISO 5459 callout syntax.

For a drawing review against these rules, send the STEP file and the marked-up drawing to our [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with the GD&T callouts flagged for inspection cost, datum stability, and downstream assembly risk.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Position tolerance callout anatomy: Annotated diagram of "⌖ | Ø 0.25 | A | B | M" with each token (symbol, value, datums, MMC) labeled. Supports queries about how to read ASME Y14.5 position callouts on a titanium drawing.
Fig 2 — Datum scheme on a thin-wall bracket: Side-by-side schematic of whole-surface datum (showing shift under clamping) vs datum targets on a deflectable flange. Supports queries about datum strategy on flexible titanium parts.
Fig 3 — MMC bonus tolerance diagram: Feature-size axis from MMC to LMC with position tolerance band growing linearly from Ø 0.40 to Ø 0.60 mm. Supports queries about how MMC absorbs feature variation.
-->