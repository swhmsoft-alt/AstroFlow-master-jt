---
title: How to Choose the Right Titanium Grade — A 5-Step Selection Procedure
slug: how-to-choose-titanium-grade
description: A procurement engineer's 5-step procedure for selecting the correct titanium grade (CP Grade 1-4, Grade 5 Ti-6Al-4V, Grade 23 Ti-6Al-4V ELI, beta alloys) for aerospace, medical, chemical and industrial components. Cross-references ASTM, ASME, AMS and ISO standards with first-hand MTR and shop-floor data.
pubDate: 2026-08-25
author: Boze Titanium Manufacturing Center
category: Materials Engineering
tags: [Titanium Grades, Grade Selection, Ti-6Al-4V, Material Selection, ASTM B265, AMS 4911, ASTM F136]
coverImage: /uploads/blog-how-to-choose-titanium-grade-cover.jpg
coverImageAlt: Engineer selecting titanium bar stock from a rack of CP, alpha-beta and beta alloys
featured: true

# ── AIO (Google AI Overviews) — HowTo schema ──
howto:
  name: "How to Choose the Right Titanium Grade"
  description: "Five-step procurement procedure to select the correct commercially-pure or alloyed titanium grade (Grade 1, 2, 5, 23 or higher) for an aerospace, medical, chemical, or industrial component. References real ASTM/ASME/AMS/ISO standards and first-hand shop-floor constraints."
  totalTime: PT15M
  tool:
    - Material requirements checklist (strength, corrosion, temperature, biocompatibility)
    - End-use environment profile (media, temperature, fatigue, sterilization)
    - Standards reference (ASTM B265 / B348, ASME SB-265, AMS 4911, AMS 4928, ASTM F136, ISO 5832-3)
    - Supplier MTR (Mill Test Report) sample
  steps:
    - position: 1
      name: "Define the operating environment"
      text: "Document service temperature, pressure, corrosive media, fatigue life and sterilization regime. CP grades (Grade 1-4) suit chemical and marine service; Ti-6Al-4V (Grade 5) suits high-strength aerospace structural parts; Grade 23 (Ti-6Al-4V ELI) suits surgical implants and fracture-critical aerospace; near-alpha alloys (Ti-6242) suit elevated-temperature service above 400 °C."
      url: https://cnc.bozemetal.com/blog/how-to-choose-titanium-grade/#step-1
    - position: 2
      name: "Identify the governing standard"
      text: "Match the end-use to its mandatory specification. Aerospace structural: AMS 4911 / AMS 4928. Aerospace landing-gear and fracture-critical: AMS 4930 (ELI variant). Medical implants: ASTM F136 or ISO 5832-3 (Ti-6Al-4V ELI). Industrial chemical: ASTM B265 / ASME SB-265. Marine / subsea: ASTM B348 or B381."
      url: https://cnc.bozemetal.com/blog/how-to-choose-titanium-grade/#step-2
    - position: 3
      name: "Match mechanical-property envelope to grade"
      text: "Select by yield strength, ultimate tensile strength and elongation. CP Grade 1 is the softest (~170 MPa UTS); CP Grade 2 reaches ~345 MPa; Ti-6Al-4V (Grade 5) reaches ~895 MPa UTS after heat treatment; Grade 23 (ELI) trades ~10 % peak strength for superior fracture toughness and ~14 % minimum elongation."
      url: https://cnc.bozemetal.com/blog/how-to-choose-titanium-grade/#step-3
    - position: 4
      name: "Verify traceability and certification"
      text: "For AS9100 / ISO 13485 programs, request a Mill Test Report (MTR) with full heat-lot and VAR-ingot traceability per ASME Section VIII, plus EN 10204 3.1 (mill-issued) or 3.2 (independent third-party) inspection certificate. Reject EN 10204 2.1 / 2.2 for aerospace or medical programs."
      url: https://cnc.bozemetal.com/blog/how-to-choose-titanium-grade/#step-4
    - position: 5
      name: "Confirm manufacturability with the supplier"
      text: "Send the 3D model plus ASME Y14.5-2018 drawing to the manufacturer for DFM review on 5-axis CNC machining. Confirm machine tolerance (typically ±0.005 mm on critical aerospace features per AS9102), CMM inspection scope, and lead time before releasing the PO."
      url: https://cnc.bozemetal.com/blog/how-to-choose-titanium-grade/#step-5

# ── AIO — Speakable anchors (3 thesis-first paragraphs at the top of the body) ──
speakableSelectors:
  - "#aio-thesis-1"
  - "#aio-thesis-2"
  - "#aio-thesis-3"

# ── AIO — Comparison-table ItemList (Grade 5 vs Grade 23) ──
comparisonList:
  name: "Grade 5 vs Grade 23 — Ti-6Al-4V vs Ti-6Al-4V ELI"
  description: "Side-by-side comparison of Grade 5 (Ti-6Al-4V) and Grade 23 (Ti-6Al-4V ELI) titanium alloys across chemistry, mechanical properties, governing standards and primary applications. Sourced from the Boze Titanium material registry."
  items:
    - "@id": https://cnc.bozemetal.com/materials/grade-5/#product
      name: "Grade 5 (Ti-6Al-4V)"
      description: "Workhorse alpha-beta titanium alloy for aerospace structural, chemical process, marine, automotive and defense applications."
    - "@id": https://cnc.bozemetal.com/materials/grade-23/#product
      name: "Grade 23 (Ti-6Al-4V ELI)"
      description: "Extra-low-interstitial variant of Ti-6Al-4V for surgical implants and fracture-critical aerospace."
  criteria:
    - name: Common name
      values:
        "Grade 5 (Ti-6Al-4V)": "Ti-6Al-4V (workhorse α+β alloy)"
        "Grade 23 (Ti-6Al-4V ELI)": "Ti-6Al-4V ELI (extra-low interstitial)"
    - name: UNS number
      values:
        "Grade 5 (Ti-6Al-4V)": "R56400"
        "Grade 23 (Ti-6Al-4V ELI)": "R56401"
    - name: Max oxygen (wt %)
      values:
        "Grade 5 (Ti-6Al-4V)": 0.20
        "Grade 23 (Ti-6Al-4V ELI)": 0.13
    - name: Max iron (wt %)
      values:
        "Grade 5 (Ti-6Al-4V)": 0.30
        "Grade 23 (Ti-6Al-4V ELI)": 0.25
    - name: Tensile strength (MPa, min)
      values:
        "Grade 5 (Ti-6Al-4V)": 895
        "Grade 23 (Ti-6Al-4V ELI)": 860
    - name: Yield strength (MPa, min)
      values:
        "Grade 5 (Ti-6Al-4V)": 828
        "Grade 23 (Ti-6Al-4V ELI)": 795
    - name: Elongation (% min)
      values:
        "Grade 5 (Ti-6Al-4V)": 10
        "Grade 23 (Ti-6Al-4V ELI)": 14
    - name: Primary standards
      values:
        "Grade 5 (Ti-6Al-4V)": "ASTM B265, B348, AMS 4911, AMS 4928, ASME SB-265"
        "Grade 23 (Ti-6Al-4V ELI)": "ASTM F136, ISO 5832-3"
    - name: Primary applications
      values:
        "Grade 5 (Ti-6Al-4V)": "Aerospace structural, chemical process, marine, automotive, defense"
        "Grade 23 (Ti-6Al-4V ELI)": "Surgical implants, medical devices, fracture-critical aerospace"
    - name: Cost benchmark
      values:
        "Grade 5 (Ti-6Al-4V)": "Baseline"
        "Grade 23 (Ti-6Al-4V ELI)": "~10–20 % higher (tighter ELI chemistry + medical-grade traceability)"
---

Selecting a titanium grade for a component is one of the highest-leverage decisions in the design-to-quote cycle — the wrong grade costs weeks of rework or, worse, a field failure. The selection is rarely about strength alone. Operating environment, manufacturing method, dimensional tolerances, regulatory regime and cost structure all constrain which of the 30+ commercially available grades will perform reliably. This procedure is the one we use internally at Boze when a new buyer sends a drawing without a grade call-out, distilled from MTR reviews on hundreds of shipments and AS9102 first-article inspections on aerospace, medical and chemical-process parts.

## Quick answer

<p id="aio-thesis-1"><strong>Pick Grade 2 (CP-Ti, ASTM B348) for general chemical and marine corrosion resistance, Grade 5 (Ti-6Al-4V, AMS 4911) for high-strength aerospace structural parts, and Grade 23 (Ti-6Al-4V ELI, ASTM F136) for surgical implants and fracture-critical aerospace.</strong> If the component operates above 400 °C or requires elevated creep life, move to near-alpha Ti-6242 or Ti-1100 instead. Anything below 550 MPa ultimate tensile strength is almost certainly a CP grade; anything above 1100 MPa requires a beta alloy such as Ti-1023 (TIMETAL 10-2-3).</p>

<p id="aio-thesis-2"><strong>The two most common procurement mistakes are (a) over-specifying Grade 5 when Grade 2 would be adequate — inflating cost and tool-wear, and (b) using Grade 5 on a fracture-critical implant application where Grade 23 ELI is mandatory.</strong> Over-spec adds 30–80 % to material cost; under-spec triggers AS9102 first-article rejection. Always start by listing the regulatory standard, then the strength band, then the corrosion environment — in that order.</p>

<p id="aio-thesis-3"><strong>ELI means "extra-low interstitial" — oxygen ≤ 0.13 wt % and iron ≤ 0.25 wt % (versus 0.20 % / 0.30 % for standard Grade 5).</strong> The tighter interstitial limits improve fracture toughness and fatigue life, which is why ASTM F136 and ISO 5832-3 (both surgical-implant standards) mandate the ELI composition. Do not substitute standard Grade 5 for Grade 23 on load-bearing implants: the chemistry difference is small on paper but clinically significant.</p>

## The 5-step grade-selection procedure

The five steps below are designed to converge on a single grade through engineering constraints rather than intuition. They mirror the `HowTo` schema embedded in this page so that the procedure can be extracted directly by AI search and voice assistants.

### Step 1 — Define the operating environment

Before comparing grades on a data sheet, document the service conditions:

- **Service temperature** — CP grades are stable to ~315 °C, Ti-6Al-4V to ~315 °C continuous (with excursions to 400 °C), Ti-6242 to ~540 °C, Ti-1100 to ~590 °C. Above 600 °C, titanium loses creep resistance and the design must switch to nickel-based superalloys.
- **Corrosive media** — CP Grade 2 is adequate for seawater, nitric acid, and most oxidizing environments. For hot hydrochloric acid or hot sulfuric acid at moderate concentration, Grade 7 (Ti-0.15Pd) or Grade 12 (Ti-0.3Mo-0.8Ni) are required — they shift the corrosion potential into the passive range. For oxidizing chloride service (e.g. wet chlorine, chlorides + heat), CP grades can suffer crevice corrosion; Grade 7 or Grade 12 are again the safe choice.
- **Fatigue and fracture-toughness regime** — Fatigue-limited components (aerospace brackets, landing gear, drive shafts) require a fracture-toughness data sheet, not just UTS. Grade 23 ELI consistently outperforms Grade 5 on plane-strain fracture toughness (K_IC ~75 MPa·√m versus ~55 MPa·√m) at the cost of ~4 % peak strength.
- **Biocompatibility / sterilization** — If the part contacts human tissue, regulatory constraints dominate: ASTM F136 (Grade 23 ELI) for surgical implants, ASTM F67 (CP Grade 4) for unalloyed implant applications, ISO 5832-3 for international equivalence. Sterilization regime also matters: autoclave (steam at 134 °C) and gamma irradiation both pass on titanium; repeated autoclaving of CP Grade 1 surfaces can degrade oxide-layer integrity.

Document these four parameters first; the grade choice becomes almost mechanical once they are pinned down.

### Step 2 — Identify the governing standard

The governing material specification locks the chemistry, mechanical properties and traceability requirements simultaneously. Use the table below to identify the standard before quoting:

| End-use | Mandatory specification | Grade |
|---------|------------------------|-------|
| Aerospace structural plate | AMS 4911 | Grade 5 |
| Aerospace structural bar / billet | AMS 4928 | Grade 5 |
| Aerospace landing-gear / fracture-critical | AMS 4930 (ELI variant) | Grade 5 ELI / Grade 23 |
| Aerospace sheet | AMS 4900 / AMS 4901 / AMS 4902 | CP Grade 1 / 2 / 4 |
| Surgical implant (US / EU) | ASTM F136, ISO 5832-3 | Grade 23 ELI |
| Unalloyed implant | ASTM F67 | CP Grade 4 |
| Industrial chemical (sheet / plate) | ASTM B265, ASME SB-265 | CP Grade 1 / 2 / 7 / 12 |
| Industrial chemical (bar / billet) | ASTM B348 | CP Grade 1 / 2 / 5 / 12 |
| Marine / subsea | ASTM B348 + ASTM B381 (forgings) | CP Grade 2 / Grade 5 |
| Medical / dental instruments | ISO 5832-3, ASTM F136 | Grade 5 / Grade 23 |
| Forged valves and fittings | ASTM B381 | Grade 2 / Grade 5 / Grade 12 |

If you cannot identify a governing standard from the table above, the part likely falls back to ASTM B348 (general bar / billet) or ASTM B265 (general sheet / plate) with a buyer-specified grade. Always reference the standard in the drawing title block — never spell out chemistry yourself.

### Step 3 — Match mechanical-property envelope to the grade

Once the environment and the standard are locked, compare mechanical-property windows. The reference values below are taken from the ASTM and AMS specifications (not supplier marketing data) and are the minimum values that a Mill Test Report (MTR) must meet:

| Grade | Common name | UTS min (MPa) | YS min (MPa) | Elong. min (%) | Typical hardness (HV) |
|-------|-------------|---------------|---------------|----------------|----------------------|
| Grade 1 | CP-Ti (softest) | 240 | 170 | 24 | 120 |
| Grade 2 | CP-Ti (workhorse) | 345 | 275 | 20 | 150 |
| Grade 3 | CP-Ti | 450 | 380 | 18 | 180 |
| Grade 4 | CP-Ti (strongest CP) | 550 | 483 | 15 | 220 |
| Grade 5 | Ti-6Al-4V | 895 | 828 | 10 | 335 |
| Grade 7 | Ti-0.15Pd | 345 | 275 | 20 | 150 |
| Grade 9 | Ti-3Al-2.5V | 620 | 483 | 15 | 250 |
| Grade 12 | Ti-0.3Mo-0.8Ni | 483 | 345 | 18 | 200 |
| Grade 23 | Ti-6Al-4V ELI | 860 | 795 | 14 | 320 |
| Ti-6242 | Ti-6Al-2Sn-4Zr-2Mo | 900 | 830 | 10 | 340 |
| Ti-1023 | Ti-10V-2Fe-3Al (beta) | 1170 | 1100 | 8 | 380 |

When the required strength falls **between two grades**, do not interpolate — the material cost difference is small (typically 5–15 % between adjacent grades) but the qualification effort to switch is large. Pick the higher grade and derate the design. Conversely, if the calculated design margin is 50 % or more above the higher grade, down-select to the lower grade and gain machinability and weldability.

### Step 4 — Verify traceability and certification

For AS9100D aerospace, ISO 13485 medical, and most prime-contractor programs, the Mill Test Report (MTR) is a contractual deliverable, not paperwork. Each shipment must include:

- **Heat number, lot number, VAR-ingot number, and producer** — all four identifiers trace back to the original vacuum-arc-remelt batch. Cross-reference with the receiving-inspection record and the Certificate of Conformance (CofC).
- **Chemistry** — actual values for C, N, H, Fe, O, plus alloying elements (Al, V, Mo, Pd, Ni, etc.) compared against the specification limits. Out-of-spec O or N on Grade 23 ELI is the most common lot-rejection cause we see; mill-cert limits are 0.13 wt % O max and 0.03 wt % N max for ELI, 0.20 wt % O for standard Grade 5.
- **Mechanical properties** — tensile strength, yield strength, elongation (and reduction of area for fracture-critical parts) reported on the MTR and traceable to the test-bar heat.
- **EN 10204 inspection certificate type** — **3.1** (mill-issued test report, acceptable for most programs) or **3.2** (independent third-party inspection, required for some aerospace / nuclear / prime-contractor programs). **Type 2.1 and 2.2 are not acceptable** for aerospace or medical — they are non-specific statements of compliance with no test data.
- **Heat-treatment condition** — mill, solution-treated, solution-treated-and-aged (STA). Grade 5 in annealed condition (~895 MPa UTS) versus STA (~1100 MPa UTS) is a 20 % strength difference that must be specified on the drawing.

A detailed walkthrough of every MTR field is in our [titanium Mill Test Report field-by-field guide](/blog/how-to-read-titanium-mill-test-report/). For deeper standard-by-standard traceability detail, the [AS9100D aerospace quality guide](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/) explains what AS9100D does — and does not — require of an MTR.

### Step 5 — Confirm manufacturability with the supplier

The grade is selected, but two parts that share a drawing can have very different manufacturability profiles. Before releasing a PO, run a manufacturability review with the supplier on:

- **Machine tolerance capability** — Confirm the supplier's standard machining tolerance (typically ±0.025 mm on milled features and ±0.005 mm on critical aerospace features per AS9102). Our shop-floor baseline for [5-axis titanium machining](/capabilities/manufacturing/) is ±0.005 mm on critical aerospace features, verified by Zeiss CMM calibrated to ISO 10360-2:2009.
- **Tooling and coolant** — Titanium machining requires high-pressure coolant (70 bar minimum, 100+ bar preferred) and rigid tooling. A shop without through-spindle coolant will struggle to hold ±0.025 mm and surface-finish targets on thin-wall sections; this is why the [titanium machining capability matrix](/capabilities/manufacturing/) is a primary filter.
- **Surface finish and post-processing** — Specify Ra values explicitly. Common titanium finishes: as-milled Ra 1.6 µm, bead-blasted Ra 3.2 µm, electropolished Ra 0.4 µm, passivated per ASTM F86 (medical). For medical implants, ASTM F86 passivation is mandatory; for aerospace fracture-critical parts, AMS 2430 shot-peening is often required.
- **Inspection scope** — 100 % CMM inspection versus sampling. For AS9102 first article, full dimensional on every feature is the rule; for production lots, AQL 1.0 sampling (per ANSI/ASQ Z1.4) is typical.
- **Lead time** — Raw-stock lead time is 4–8 weeks for standard bar / billet, 10–14 weeks for non-standard sizes or ELI variants. Build lead time on top is 2–6 weeks depending on complexity.

When the grade, standard, traceability requirements and manufacturability are all aligned, the procurement is ready to release. A structured [RFQ request](/rfq/) with the grade, standard, AS9102 / FAI requirements and MTR specification will return comparable quotations for direct comparison.

---

## Author & manufacturing context

This procedure is maintained by the engineering team at Boze Titanium Manufacturing Center (Baoji Boze Metal Products Co., Ltd., Shaanxi, China). Boze is an AS9100D- and ISO 9001:2015-certified titanium machining facility operating 5-axis Hermle C25 / DMU 50 milling, Mazak Integrex i-200S turn-mill, Sodick AQ400LS wire EDM and Zeiss Contura CMM inspection. We ship Grade 2 / Grade 5 / Grade 12 / Grade 23 titanium components to aerospace (commercial, defense, UAV), medical (implants, instruments), chemical-process (valves, reactors), subsea (ROV, manifolds) and semiconductor (vacuum chambers, gas-distribution) customers worldwide with full MTR and EN 10204 3.1 / 3.2 documentation. For help on a specific grade-selection question, [submit your drawing and target application for a formal quotation](/rfq/); typical engineering response is under 48 hours.
