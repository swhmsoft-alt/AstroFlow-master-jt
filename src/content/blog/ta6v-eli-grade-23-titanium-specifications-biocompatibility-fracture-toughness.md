---
title: "TA6V ELI (Grade 23) Titanium Specifications: Biocompatibility and Fracture Toughness"
slug: ta6v-eli-grade-23-titanium-specifications-biocompatibility-fracture-toughness
description: "A materials engineering analysis of Grade 23 (Ti-6Al-4V ELI) titanium. Covers the interstitial ceiling reductions vs Grade 5, ASTM F136 and ISO 5832-3 medical standards, fracture toughness at cryogenic temperatures, and procurement rules for implant and aerospace cryogenic applications."
pubDate: 2026-08-29
author: Boze Titanium Manufacturing Center
category: Titanium Grades
tags: [Grade 23 Titanium, Ti-6Al-4V ELI, ASTM F136, ISO 5832-3, Biocompatibility, Fracture Toughness, Cryogenic]
featured: false
---

# TA6V ELI (Grade 23) Titanium Specifications: Biocompatibility and Fracture Toughness

**Executive summary:** Grade 23 is the extra-low interstitial (ELI) variant of Ti-6Al-4V, with oxygen, nitrogen, carbon, and iron ceilings tightened to roughly half the levels permitted in standard Grade 5. The trade is a small reduction in tensile strength (typically 795 MPa minimum versus 895 MPa for Grade 5) in exchange for a meaningful improvement in fracture toughness, ductility, and fatigue performance — particularly at cryogenic temperatures and in long-term implant service. The two standards that govern Grade 23 are ASTM F136 (U.S. medical implants) and ISO 5832-3 (international, including Europe). For aerospace cryogenic or fracture-critical structures, the equivalent standard is typically AMS 4930 or a customer-specific aerospace specification. The procurement distinction matters because material certified to Grade 5 cannot be used where Grade 23 is mandated by a medical device or aerospace fracture-critical drawing. Material certified to Grade 5 has no upgrade path to Grade 23 without a re-melt or a re-casting campaign — the interstitial ceiling is set at the melt, not at the mill.

## What ELI actually constrains

The ELI designation sets maximum interstitial (oxygen, nitrogen, carbon, hydrogen) and iron limits. The exact numbers vary slightly between standards, but the principle is the same: tighter ceilings than standard Grade 5 produce a cleaner matrix with fewer sites for crack initiation. The mechanism is interstitial locking — oxygen and nitrogen atoms pin dislocations and create brittle-appearing features at grain boundaries. Reducing the interstitial content allows more dislocation motion and more ductile behavior before fracture.

Typical Grade 23 limits compared to Grade 5:

- Oxygen: 0.13 percent maximum (Grade 23) vs 0.20 percent maximum (Grade 5)

- Nitrogen: 0.03 percent maximum (Grade 23) vs 0.05 percent maximum (Grade 5)

- Carbon: 0.08 percent maximum (Grade 23) vs 0.08 percent maximum (Grade 5) — similar

- Iron: 0.25 percent maximum (Grade 23) vs 0.30 percent maximum (Grade 5)

- Hydrogen: 0.0125 percent maximum (Grade 23) vs 0.015 percent maximum (Grade 5)

The mechanical consequence: minimum tensile strength drops from 895 MPa to 795 MPa, but fracture toughness (typically measured as K_IC per ASTM E399) rises from about 55 MPa√m for Grade 5 to about 75 MPa√m for Grade 23. In cyclic loading, the fatigue endurance limit improves by approximately 10 to 15 percent. The fatigue improvement is the most underappreciated benefit; many procurement decisions focus on the strength loss without considering the fatigue gain.

For medical implants, the ELI specification also supports biocompatibility. The tighter interstitial limits reduce the potential for adverse biological response over decades of in-service exposure. ASTM F136 is the governing standard for surgical implants in the United States, with ISO 5832-3 governing in most other markets. Both standards share the same chemistry limits but differ in supplementary testing, traceability documentation, and quality system requirements. For the broader context of interstitial-controlled grades, see the [what does ELI mean in titanium](/blog/what-does-eli-mean-in-titanium/) guide.

## Manufacturing implications of the tighter ELI limits

The tighter chemistry of Grade 23 does not change the basic manufacturing sequence — the alloy is still Ti-6Al-4V with the same alpha + beta microstructure, the same hot working range, the same annealing temperature — but it does change the supplier qualification. The melt shop that produces Grade 23 has tighter process control on raw material selection, vacuum arc remelting practice, and atmosphere control during hot working. The cost of that process discipline is reflected in the material price.

Mills that produce Grade 23 typically operate as dual-certified (Grade 5 + Grade 23) or single-certified (Grade 23 only). The ELI chemistry is harder to hit consistently, particularly at the low oxygen end of the range, and the mill must control raw material selection, melt practice, and hot work atmosphere to stay within specification. Not every titanium mill produces Grade 23; the qualified supplier list is shorter than for Grade 5. A buyer who specifies Grade 23 without confirming the qualified mill list will discover that lead times are longer than expected.

For the machining shop, the difference between Grade 5 and Grade 23 in the cutting zone is negligible. Both alloys behave the same in milling, turning, and drilling. The Grade 23 advantage is downstream of machining — in service life, in fracture performance, in fatigue — not in production efficiency. The same cutting parameters apply; the same tooling works; the same coolant strategy is required. The advantage is realized years after the part leaves the shop. For the machining-side discussion, see the [titanium machining difficulty guide](/blog/why-is-titanium-hard-to-machine/) and the [titanium CNC machining cost factors](/blog/titanium-cnc-machining-cost-factors/).

## Where Grade 23 is mandatory and where it is over-specified

Grade 23 is mandatory in several documented contexts. The list is finite and the procurement specification should reference the standard that applies to the specific application.

- Surgical implants manufactured under ASTM F136 or ISO 5832-3. For spinal cages, hip stems, trauma plates, dental implants, and similar long-term implant applications, ELI is the standard specification. The biocompatibility argument is supported by decades of clinical use.

- Cryogenic aerospace structures, particularly liquid hydrogen or liquid oxygen pressure vessels in launch vehicles, where fracture toughness at -253 °C must meet a defined minimum. The lower oxygen content preserves ductility at cryogenic temperatures; standard Grade 5 can become brittle in this regime.

- Fracture-critical airframe structures where AS9100-mandated damage tolerance analysis requires higher K_IC than Grade 5 delivers. The damage tolerance framework in FAR 25.571 and equivalent regulations penalizes materials with lower fracture toughness.

- Deep-sea submersible pressure hulls where the combination of low temperature and high hydrostatic pressure demands maximum toughness.

Grade 23 is over-specified in conventional aerospace structural parts where the fracture margin of Grade 5 is already adequate, in non-implant medical device housings where biocompatibility is not a requirement, and in industrial applications where the additional cost of ELI material (typically 20 to 40 percent above Grade 5) does not buy any additional in-service performance. The procurement signal here is "we want the best" without a documented engineering driver — the correct response is to specify Grade 5 unless an actual requirement demands Grade 23. The cost differential is large enough that the over-specification shows up in material budgets.

**Table 1: Grade 5 vs Grade 23 specification comparison**

| Parameter | Grade 5 | Grade 23 (ELI) |
| --- | --- | --- |
| Oxygen, maximum | 0.20% | 0.13% |
| Nitrogen, maximum | 0.05% | 0.03% |
| Iron, maximum | 0.30% | 0.25% |
| Hydrogen, maximum | 0.015% | 0.0125% |
| Tensile strength, minimum | 895 MPa | 795 MPa |
| Yield strength, minimum | 828 MPa | 755 MPa |
| Elongation, minimum | 10% | 12% |
| Fracture toughness K_IC, typical | 55 MPa√m | 75 MPa√m |
| Fatigue endurance (10^7 cycles), typical | 500 MPa | 575 MPa |
| Typical premium over Grade 5 | — | +20 to +40% |

## Inspection and traceability for Grade 23

The inspection chain for Grade 23 mirrors Grade 5 with two additions:

- Chemistry verification at the heat level is more rigorous. The mill must report actual interstitial values, not just confirm the grade. The actual oxygen and nitrogen numbers matter for downstream performance; the buyer should request them on the MTR.

- Fracture toughness testing may be required by the customer specification, with documented K_IC values for the heat. This is a destructive test (typically per ASTM E399) and adds cost; not every heat is tested. For a procurement order that requires K_IC, the testing scope and the acceptance criterion must be specified on the purchase order.

For medical-grade material, additional traceability is required: full heat-to-implant traceability, bioburden control documentation, and in some cases clean-room packaging for the final machined implant. The traceability chain must flow unbroken from the ingot to the implanted device. The chain is auditable, and FDA inspections regularly include it. For the implant-specific context, see the [Ti-6Al-4V ELI Grade 23 in spinal surgery implants](/blog/ti-6al-4v-eli-grade-23-in-spinal-surgery-implants/) guide and the [medical titanium implants manufacturing standards](/blog/medical-titanium-implants-manufacturing-standards/) guide.

## Procurement rules for Grade 23

**Rule 1 — Specify Grade 23 only when ELI performance is required.** Medical implants, cryogenic aerospace, fracture-critical airframe, deep-sea pressure hulls. Each of these has a documented engineering driver; the buyer should be able to cite the driver in the RFQ.

**Rule 2 — Match the standard to the application.** ASTM F136 for medical implants (U.S. market), ISO 5832-3 for international medical, AMS 4930 or customer specification for aerospace. The ISO vs ASTM distinction matters in regulated markets; a part certified to ASTM F136 cannot be sold in Europe without ISO 5832-3 documentation.

**Rule 3 — Confirm the mill is dual or ELI certified.** A Grade-5-only mill cannot ship Grade 23. Verify before RFQ. The mill qualification certificate must show ELI scope, not just Grade 5 scope.

**Rule 4 — Require interstitial values on the MTR, not just the grade.** The actual oxygen and nitrogen numbers matter for downstream performance. A Grade 23 MTR that shows only the grade and not the actual values is incomplete for any application where the ELI distinction drives the engineering decision.

**Rule 5 — Specify fracture toughness testing when the design requires it.** For fracture-critical structures, K_IC testing per ASTM E399 on representative samples from each heat is not optional. The cost is real but small relative to the consequence of a fracture-critical failure in service.

**Rule 6 — Engineer contradiction — ELI is not "better" Grade 5.** Grade 23 trades strength for toughness and fatigue. A buyer who specifies Grade 23 in a stiffness-critical application has over-specified and under-performed — the part will deflect more than the same geometry in Grade 5. The engineering question is which property dominates the design, and the grade follows from that question, not from a generic preference for "better" material.

For the medical-implant-specific context, see the [Ti-6Al-4V ELI Grade 23 in spinal surgery implants](/blog/ti-6al-4v-eli-grade-23-in-spinal-surgery-implants/) guide. For the broader Grade 23 vs Grade 5 vs Grade 4 comparison, see the [Grade 23 vs Grade 4 vs Grade 5 comparison](/blog/titanium-grade-23-vs-grade-4-vs-grade-5-comparison/). To specify Grade 23 material for an aerospace cryogenic or implant project, [request a material review](/rfq/) with the engineering team.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)

Fig 1 — Interstitial ceiling comparison chart. Side-by-side bar chart of O, N, C, H, Fe maximums for Grade 5 vs Grade 23.

Fig 2 — Fracture toughness vs temperature plot. K_IC curves from -253 °C to 200 °C for Grade 5 and Grade 23 showing ELI advantage widening at low temperature.

Fig 3 — Grade 23 application decision matrix. Decision tree from application type to required standard (F136 / ISO 5832-3 / AMS 4930).

-->
