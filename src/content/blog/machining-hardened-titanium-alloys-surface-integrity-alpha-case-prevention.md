---
title: "Machining Hardened Titanium Alloys: Surface Integrity and Alpha-Case Prevention"
slug: machining-hardened-titanium-alloys-surface-integrity-alpha-case-prevention
description: "A process engineering guide to surface integrity in machined titanium components. Covers alpha-case formation mechanism, white layer on machined titanium, residual stress profiles, and the cutting parameter / coolant envelope that prevents surface damage."
pubDate: 2026-08-29
author: Boze Titanium Manufacturing Center
category: Machining Processes
tags: [Titanium Surface Integrity, Alpha Case, White Layer, Residual Stress, Machining Parameters, Aerospace Machining]
featured: false
---

# Machining Hardened Titanium Alloys: Surface Integrity and Alpha-Case Prevention

**Executive summary:** Surface integrity in machined titanium is governed by the thermal and mechanical load imposed on the cut surface during chip formation. The two failure modes are alpha-case formation (oxygen-enriched hard surface layer, typically 5 to 50 µm deep, produced when the cut surface exceeds about 600 °C in air) and white layer formation (untempered martensite-like alpha phase, produced when the cut surface cools rapidly from a high peak temperature). Both are fatigue liabilities; both are preventable with the right cutting parameter envelope and the right coolant strategy. The mistake many machining shops make is to optimize for tool life or cycle time without checking the surface integrity of the cut, particularly on thin-wall sections where the cut surface is a large fraction of the part cross-section. The right approach is to define the surface integrity requirement on the drawing (residual stress limit, alpha-case depth limit, microhardness profile) and to qualify the machining process against that requirement, not against tool life alone.

## Alpha-case formation: mechanism and depth

Alpha-case is an oxygen-enriched alpha-stabilized surface layer that forms when titanium is heated above about 600 °C in an oxidizing atmosphere. The mechanism is diffusion: oxygen diffuses into the titanium matrix, stabilizes the alpha phase, and produces a hard, brittle layer with reduced fatigue life. The depth of the alpha-case scales with the square root of time at temperature — a rule of thumb is that 30 minutes at 700 °C produces about 25 µm of alpha-case on Ti-6Al-4V.

In machining, the cut surface can exceed 600 °C briefly during chip formation, particularly at low cutting speeds, high feed rates, or with interrupted cuts. The exposure time is short (milliseconds), but the peak temperature is high (700 to 900 °C in the cut zone), so a thin alpha-case can still form. The depth in machined surfaces is typically 5 to 25 µm — shallow relative to heat-treat-induced alpha-case (which can be 50 to 200 µm) but mechanically significant for fatigue-critical components.

The mechanical consequence: the alpha-case layer is hard (typically 450 to 550 HV versus 320 to 350 HV for the base metal) and brittle. In cyclic loading, the layer cracks first, and the crack propagates into the base metal. For an aerospace bracket with a fatigue requirement of 10^7 cycles at 500 MPa, the presence of alpha-case can reduce the fatigue life by 30 to 70 percent. See the [alpha-case formation prevention and removal](/blog/alpha-case-formation-titanium-prevention-removal/) guide for the broader mechanism and the chemical milling removal process.

## White layer formation: a different failure mode

White layer, also called untempered martensite or alpha-prime layer, forms when the cut surface is heated above the beta transus (about 995 °C for Ti-6Al-4V) and then cooled rapidly. The rapid cooling produces a hard, untempered alpha-prime phase that appears white under microscopic examination after etching. The depth is typically 1 to 5 µm — thinner than alpha-case but mechanically similar in its fatigue liability.

White layer is more common in high-speed machining (HSM) of titanium where the peak cutting temperature can exceed the beta transus briefly. The mechanism is favored by low feed (thin chips, high temperature per unit volume), high cutting speed, and insufficient coolant. The remedy is the opposite: reduce cutting speed, increase feed, and apply high-pressure coolant aimed at the cut zone.

White layer and alpha-case can coexist on the same surface: alpha-case from the cumulative time above 600 °C, white layer from the peak temperature above the beta transus. Both are detected by metallographic cross-section; both appear as a distinct layer between the cut surface and the base metal. The standard inspection is a polished and etched cross-section examined at 200 to 500x magnification. See the [titanium surface finish guide](/blog/titanium-surface-finish-achieving-ra-04um/) for the broader surface integrity discussion.

## The cutting parameter envelope for surface integrity

The parameter envelope for surface integrity is different from the envelope for tool life or cycle time. Optimizing for cycle time often pushes outside the surface integrity envelope; optimizing for surface integrity often requires accepting longer cycle times. The right answer depends on which requirement dominates the drawing.

**Table 1: Cutting parameter envelopes for different surface integrity outcomes**

| Optimization target | Cutting speed | Feed per tooth | Coolant pressure | Expected alpha-case |
| --- | --- | --- | --- | --- |
| Cycle time (minimum) | High (60 to 80 m/min) | High (0.08 to 0.12 mm) | Moderate (50 to 80 bar) | 5 to 15 µm possible |
| Tool life (maximum) | Moderate (40 to 60 m/min) | Moderate (0.05 to 0.08 mm) | High (80 to 150 bar) | 5 to 10 µm |
| Surface integrity (minimum damage) | Moderate to high (50 to 70 m/min) | High (0.08 to 0.12 mm) | Very high (120 to 200 bar) | &lt; 5 µm |

The interesting result is that the surface integrity optimum is at higher feed than the tool life optimum. Higher feed produces a thicker chip with the same cutting energy, which lowers the peak temperature per unit volume and reduces both alpha-case and white layer formation. The shop that programs conservative feeds to protect the tool may be producing more surface damage than the shop that programs aggressive feeds with high-pressure coolant. This is counterintuitive but well documented in titanium machining research.

## Inspection methods for surface integrity

Four inspection methods cover most surface integrity requirements on machined titanium aerospace components.

**Metallographic cross-section.** The reference method. A sample is sectioned, mounted, polished, and etched to reveal the alpha-case and white-layer zones. The depth is measured under a microscope at 200 to 500x magnification. The method is destructive but quantitative; the result is in micrometers. Typical acceptance limits for aerospace structural components are alpha-case less than 10 to 25 µm, white layer less than 5 µm.

**Microhardness traverse.** A Knoop or Vickers microhardness profile is taken from the cut surface into the base metal at 5 to 10 µm increments. The alpha-case appears as a hardness spike near the surface (typically 450+ HV versus 320 to 350 HV base). The method is destructive and complementary to the metallographic cross-section. The acceptance limit is typically a maximum surface hardness or a maximum case depth defined by the hardness profile.

**X-ray diffraction residual stress measurement.** Non-destructive, measures residual stress in the surface layer. Useful for confirming that the machining process has not introduced tensile residual stresses that would reduce fatigue life. The acceptance limit depends on the design requirement.

**Surface roughness measurement.** Not a direct indicator of alpha-case or white layer, but a useful process control parameter. A change in surface roughness often indicates a change in the cutting condition that may also affect surface integrity. See the [titanium surface finish guide](/blog/titanium-surface-finish-achieving-ra-04um/) for the Ra specification framework.

## Surface treatments that follow machining

For fatigue-critical components, surface treatments are often specified after machining to restore or improve the surface integrity. The treatments remove or modify the affected layer.

**Chemical milling.** An acid bath (typically a hydrofluoric / nitric acid mixture) removes a controlled depth from the surface, taking the alpha-case with it. Typical removal is 50 to 150 µm per side. The process is well established for aerospace structural components and is covered in the [alpha-case prevention guide](/blog/alpha-case-formation-titanium-prevention-removal/).

**Shot peening.** Introduces compressive residual stress in the surface layer, which improves fatigue life even if some alpha-case remains. Standard aerospace treatment for fatigue-critical surfaces.

**Laser shock peening.** Deeper compressive residual stress than shot peening, with no surface roughness penalty. Used on high-performance aerospace components where the additional fatigue margin justifies the cost.

**Anodizing.** Primarily a corrosion protection treatment, but also produces a thin oxide layer that can mask surface defects. Type II (sulfuric acid) and Type III (hardcoat) anodizing are both used on titanium aerospace components. See the [titanium surface treatments guide](/blog/ultimate-guide-titanium-surface-treatments-aerospace/) for the broader treatment framework.

## Procurement rules for surface integrity

**Rule 1 — Specify the surface integrity requirement on the drawing.** "Surface roughness Ra 0.8 µm" is not a surface integrity requirement. The drawing should specify alpha-case depth limit, microhardness limit, or residual stress limit as applicable.

**Rule 2 — Require metallographic validation on first article.** For fatigue-critical components, the first article should include a metallographic cross-section from a representative coupon. The result is the baseline for production parts.

**Rule 3 — Specify the coolant pressure on the RFQ.** Below 70 bar, the alpha-case depth is unpredictable. The RFQ should state the minimum coolant pressure and the coolant type.

**Rule 4 — Require surface integrity validation for production parts.** Random sampling on production lots is the standard practice for aerospace structural components. The sampling rate depends on the criticality of the part.

**Rule 5 — Engineer contradiction — longer cycle time is not always better surface integrity.** A shop that slows the cut to protect the tool may be producing more alpha-case than a shop that runs at higher feed with high-pressure coolant. The cycle time alone is not a quality indicator; the cutting parameter envelope and the coolant strategy are.

For the alpha-case mechanism and chemical milling removal process, see the [alpha-case formation prevention and removal guide](/blog/alpha-case-formation-titanium-prevention-removal/). For the broader surface treatment framework, see the [titanium surface treatments guide](/blog/ultimate-guide-titanium-surface-treatments-aerospace/). To specify a surface integrity requirement for a critical component, [request a process review](/rfq/) with the engineering team.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)

Fig 1 — Alpha-case formation mechanism diagram. Schematic of oxygen diffusion profile into titanium at elevated temperature, with depth vs time curves.

Fig 2 — Cutting parameter envelope chart. Spider chart comparing cycle time, tool life, and surface integrity optimums on the speed-feed-coolant axes.

Fig 3 — Microhardness traverse plot. Hardness vs depth from cut surface for as-machined, chemical-milled, and shot-peened conditions.

-->
