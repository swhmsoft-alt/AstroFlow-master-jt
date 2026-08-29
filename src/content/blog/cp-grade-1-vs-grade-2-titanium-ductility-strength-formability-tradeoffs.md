---
title: "CP Grade 1 vs Grade 2 Titanium: Ductility, Strength, and Formability Trade-Offs"
slug: cp-grade-1-vs-grade-2-titanium-ductility-strength-formability-tradeoffs
description: "A materials engineering comparison of commercially pure Grade 1 and Grade 2 titanium. Covers the oxygen-driven strength-formability trade-off, deep draw ratios, weldability, service stiffness requirements, and procurement rules for selecting between the two softest CP grades."
pubDate: 2026-08-29
author: Boze Titanium Manufacturing Center
category: Titanium Grades
tags: [Grade 1 Titanium, Grade 2 Titanium, Commercially Pure Titanium, Formability, ASTM B348, ASTM B265, Ductility]
featured: false
---

# CP Grade 1 vs Grade 2 Titanium: Ductility, Strength, and Formability Trade-Offs

**Executive summary:** Commercially pure Grade 1 and Grade 2 titanium are the two softest unalloyed CP grades, and the procurement decision between them is rarely about strength in the absolute sense — both are weak compared to Grade 5. The decision is about formability and the cost of forming operations. Grade 1 has the lowest strength of the four CP grades (170 MPa yield minimum) and the highest ductility (24 percent minimum elongation), which makes it the easiest to deep draw, spin, and roll-form into complex shapes. Grade 2 trades a small amount of that formability for higher strength (275 MPa yield minimum, 20 percent elongation), making it the better choice when the part must carry modest mechanical load or maintain stiffness in service. The error many specifiers make is defaulting to Grade 2 because it is "the industry standard," when Grade 1 would form more easily and at lower cost. The reverse error is specifying Grade 1 for a part that needs the stiffness Grade 2 provides and ending up with a deformed or wrinkled component.

## The strength-formability trade-off in numerical terms

The chemistry of CP grades is the same in the major alloying elements (titanium balance, iron ≤ 0.30 percent, oxygen ≤ 0.18 to 0.25 percent depending on grade, nitrogen ≤ 0.03 percent, carbon ≤ 0.08 percent, hydrogen ≤ 0.015 percent). What differs is the oxygen ceiling — the interstitials that control strength through solid solution strengthening. Other interstitial elements are held within tight ranges; oxygen is the engineering variable that distinguishes the CP grades from each other. The same mechanism is at work in the ELI grades for medical applications, where the interstitial ceiling is tightened in the opposite direction — see the [ELI titanium guide](/blog/what-does-eli-mean-in-titanium/) for the parallel discussion.

Grade 1 has the lowest oxygen ceiling (0.18 percent maximum), producing the lowest strength and highest ductility. Grade 2 increases the oxygen ceiling to 0.25 percent, gaining about 60 percent in yield strength while losing about 17 percent in minimum elongation. Grades 3 and 4 raise oxygen further, gaining more strength at the cost of additional formability. The relationship is monotonic: more oxygen, more strength, less ductility. No alloying tricks are used; the four CP grades are essentially the same material with controlled interstitial chemistry.

The practical consequence is in the cold-forming operation. A deep-drawn hemisphere in Grade 1 can typically achieve draw ratios of 2.0 to 2.2 without intermediate annealing. The same geometry in Grade 2 might require an intermediate anneal at draw ratios above about 1.8 to 2.0. For a stamping operation with multiple stations, that intermediate anneal is a significant process cost. For a simple brake form, the difference is irrelevant. The formability cost of Grade 2 is therefore situation-dependent — large only when the operation pushes the material near its forming limit.

## Forming behavior in real production

In sheet and plate forming, the choice between Grade 1 and Grade 2 is driven by the formability requirement. Spinning, deep drawing, and hydroforming operations prefer Grade 1 because the lower yield strength reduces the forming force and the higher ductility tolerates higher total strain before necking. The tool loads are also lower, which allows lighter tooling and less press tonnage — a secondary cost benefit that often goes unmentioned in the grade selection memo.

In bar and billet machining, the choice is less about formability and more about whether the part needs the modest strength gain of Grade 2 to handle service loads. A machined fitting or valve body that sees internal pressure benefits from the higher strength of Grade 2. A machined flange or cover that primarily seals against a gasket does not — Grade 1 is sufficient and machines more easily. The machining behavior is similar but the cutting forces are slightly lower for Grade 1 because the yield strength is lower. For shop-floor operators, this is a small benefit, not a step change.

In welding, both grades behave identically. CP titanium welds are not strengthened by the weld thermal cycle in the way that steel welds are; the heat-affected zone actually loses some strength and gains ductility, which is generally favorable. The weld filler choice (typically Grade 1 or Grade 2 ERTi-1 / ERTi-2 weld wire) follows the base metal. For the broader forming and machining context, see the [CP titanium grades 1-2-3-4 comparison](/blog/cp-titanium-grades-1-2-3-4-comparison/) and the [titanium machinability guide](/blog/is-titanium-difficult-to-machine/).

**Table 1: Grade 1 vs Grade 2 mechanical property and forming comparison**

| Property | Grade 1 | Grade 2 |
| --- | --- | --- |
| Tensile strength, minimum | 240 MPa | 345 MPa |
| Yield strength, 0.2% offset, minimum | 170 MPa | 275 MPa |
| Elongation, minimum | 24% | 20% |
| Oxygen maximum | 0.18% | 0.25% |
| Iron maximum | 0.20% | 0.30% |
| Deep draw ratio (typical, without anneal) | 2.0 to 2.2 | 1.6 to 1.9 |
| Bending radius (sheet, 90° cold) | 1.5 to 2.0 × thickness | 2.0 to 2.5 × thickness |
| Weldability | Excellent | Excellent |
| Machinability rating (relative) | Best in CP family | Slightly lower than Grade 1 |

## Failure modes when the wrong grade is selected

The most common failure when Grade 2 is specified where Grade 1 should have been is splitting or wrinkling in deep draw operations. The formability window is too narrow for the geometry, and intermediate anneals are added late in the production development, costing schedule and tool life. The recovery is usually to drop one oxygen range (Grade 2 to Grade 1) and accept the small strength reduction in service. This is the corrective action that should have been the original specification.

The most common failure when Grade 1 is specified where Grade 2 should have been is bulging or wrinkling in service — the part lacks the stiffness to resist internal pressure or external load. In pressure vessel applications, this can be a safety issue, and the remedy is upgrading the part to Grade 2 or increasing the wall thickness (which adds weight and cost). For a chemical processing flange or a heat exchanger cover, the failure mode is usually a visible distortion after a few thermal cycles; the part still seals but no longer looks right.

A subtle failure mode is in fatigue. CP grades have similar fatigue endurance limits in the annealed condition, but the higher strength of Grade 2 means it tolerates higher mean stresses in cyclic loading. For a part with sustained cyclic loading and modest stress amplitudes, Grade 2 has a longer fatigue life. For a part with high strain amplitudes, Grade 1's higher ductility may absorb plastic strain more gracefully. The difference is real but rarely dominates the grade selection; fatigue-critical parts usually migrate to an alpha-beta alloy such as Grade 5 or Grade 23.

## Machining and joining notes

Both Grade 1 and Grade 2 machine similarly. The dominant considerations are the same as for other CP grades: sharp tools, positive rake, low cutting speeds compared to aluminum, generous coolant, and shallow depths of cut. The lower strength of Grade 1 produces slightly lower cutting forces and slightly better chip formation, but the difference is small enough that production lines typically machine both grades with the same parameters. The chip morphology is also similar — segmented chips with a tendency to re-cut, mitigated by sharp tools and high-pressure coolant. For a detailed discussion of cutting parameters, see the [titanium CNC machining cost factors](/blog/titanium-cnc-machining-cost-factors/) guide, and for the chip control issue, see the [titanium chip control and fire prevention](/blog/titanium-chip-control-fire-prevention-cnc-machining/) guide.

Welding follows standard CP titanium practice: gas-shielded TIG or plasma, oxygen-free backing gas, and post-weld cleaning to eliminate iron contamination from tooling. No special procedures are required for one grade versus the other. The weld color after the trailing shield passes is the visual quality indicator — straw color indicates marginal shielding (light oxide), blue indicates unacceptable shielding (heavy oxide), and silver indicates proper shielding (no visible oxide). For welds that must meet ASME Section IX or aerospace weld specifications, the silver requirement is strict.

## Procurement rules for CP grade selection

**Rule 1 — Specify by forming operation, not by habit.** If the part is deep drawn, spun, or heavily formed, Grade 1 is the right default. If the part carries mechanical load with minimal forming, Grade 2 is the right default.

**Rule 2 — Match the grade to the standard for the product form.** Bar to B348, plate to B265, tubing to B338, pipe to B861. Each form has its own standard and its own revisions. Cross-referencing standards is a frequent source of procurement error, particularly when a part is specified as "titanium Grade 2" without naming the product form.

**Rule 3 — Confirm the oxygen ceiling on the MTR.** A mill that ships at the upper end of the oxygen range for Grade 1 (0.18 percent) produces stronger material than a mill at 0.12 percent. For formability-critical parts, request the actual oxygen value, not just the grade name. The formability window is set by the actual chemistry, not the nominal grade.

**Rule 4 — Consider Grade 3 or Grade 4 before specifying an alloy.** When the load demands higher strength than Grade 2, the next step up is often Grade 4 (550 MPa yield minimum) within the CP family, not Grade 5 (Ti-6Al-4V). The formability cost of Grade 4 is significant, but the corrosion resistance advantage over Grade 5 is real. The grade-selection logic should walk up the CP family before leaving it.

**Rule 5 — Document the selection rationale in the RFQ.** Specifying "Grade 2 because that's what we always use" is not defensible engineering. Specifying "Grade 2 for higher stiffness in service, with formability verified at draw ratio 1.7" is. The RFQ is the audit trail; the rationale belongs in it.

**Rule 6 — Engineer contradiction — Grade 2 is not always the safe default.** In some procurement organizations, Grade 2 is treated as the "no surprises" choice because it is widely available and well understood. For a heavily formed part, Grade 2 is the conservative choice only if the formability window has been verified; otherwise it is a procurement default that risks splitting during forming. The conservative choice depends on the operation, not on the procurement culture.

For a side-by-side comparison across all four CP grades, see the [CP titanium grades 1-2-3-4 comparison](/blog/cp-titanium-grades-1-2-3-4-comparison/). For the difference between Grade 2 and Grade 3 (the next strength step up), see the [Grade 3 vs Grade 4 comparison](/blog/titanium-grade-3-vs-grade-4-comparison/). To request a forming feasibility review for a specific geometry, [submit your drawing for review](/rfq/).

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)

Fig 1 — Formability window chart. Plot of draw ratio against oxygen content for Grade 1, 2, 3, 4, with feasible / marginal / failure zones annotated.

Fig 2 — Stiffness vs formability trade-off diagram. Two-axis diagram for CP grades with arrows indicating "more formable" and "stronger."

Fig 3 — Service environment selection matrix. Decision tree from forming operation type and mechanical load requirement to recommended CP grade.

-->
