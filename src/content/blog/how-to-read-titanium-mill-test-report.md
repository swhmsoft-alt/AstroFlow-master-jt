---
title: How to Read a Titanium Mill Test Report (MTR) — Field-by-Field Guide
slug: how-to-read-titanium-mill-test-report
description: "A quality engineer's 5-step procedure for validating a titanium Mill Test Report (MTR): heat-lot / VAR-ingot traceability, chemistry vs specification, mechanical properties vs specification, EN 10204 inspection-certificate type, and sign-off. Includes real MTR field-value examples for Grade 2 / Grade 5 / Grade 23."
pubDate: 2026-08-25
author: Boze Titanium Manufacturing Center
category: Quality & Traceability
tags: [MTR, Mill Test Report, EN 10204, Heat Lot, Titanium Chemistry, AS9100, Material Traceability]
coverImage: /uploads/blog-how-to-read-titanium-mill-test-report-cover.jpg
coverImageAlt: Quality inspector reviewing a titanium Mill Test Report against an engineering drawing
featured: true

# ── AIO — HowTo schema ──
howto:
  name: "How to Read a Titanium Mill Test Report (MTR)"
  description: "Five-step quality-engineer procedure to validate a titanium Mill Test Report: heat-lot / VAR-ingot traceability, chemistry versus specification, mechanical properties versus specification, EN 10204 inspection-certificate type, and sign-off / cross-reference to shipment."
  totalTime: PT10M
  tool:
    - Titanium grade specification (ASTM B265 / B348, AMS 4911 / 4928 / 4930, ASTM F136, ISO 5832-3)
    - EN 10204 standard reference
    - Heat-lot / VAR-ingot cross-reference table
    - Receiving-inspection record
  steps:
    - position: 1
      name: "Confirm heat-lot and VAR-ingot traceability"
      text: "The MTR header must list the heat number, lot number, VAR-ingot number, and producer. For AS9100D / ISO 13485 programs, all four identifiers must trace back to the original VAR melt. Cross-reference the heat number on the MTR to the receiving-inspection record and to the supplier's CofC. A broken chain at any link is grounds for rejection."
      url: https://cnc.bozemetal.com/blog/how-to-read-titanium-mill-test-report/#step-1
    - position: 2
      name: "Verify chemistry against the grade specification"
      text: "Cross-check the reported chemistry (C, N, H, Fe, plus alloying elements for Grade 5 / Grade 23) against the grade spec limits. Out-of-spec O, N or Fe in Grade 23 ELI (Ti-6Al-4V ELI) is the most common rejection cause we see at Boze. Standard Grade 5 O limit is 0.20 wt %; ELI Grade 23 O limit is 0.13 wt % — the difference is small on paper but changes the grade call-out."
      url: https://cnc.bozemetal.com/blog/how-to-read-titanium-mill-test-report/#step-2
    - position: 3
      name: "Validate mechanical properties"
      text: "Confirm tensile strength, yield strength and elongation values meet the minimum requirements for the grade. For Grade 5 (Ti-6Al-4V): UTS ≥ 895 MPa, YS ≥ 828 MPa, elong ≥ 10 %. For Grade 23 (Ti-6Al-4V ELI): UTS ≥ 860 MPa, YS ≥ 795 MPa, elong ≥ 14 %. For CP Grade 2 (ASTM B348): UTS ≥ 345 MPa, YS ≥ 275 MPa, elong ≥ 20 %."
      url: https://cnc.bozemetal.com/blog/how-to-read-titanium-mill-test-report/#step-3
    - position: 4
      name: "Confirm EN 10204 inspection-certificate type"
      text: "Specify EN 10204 3.1 (mill-issued test report) or 3.2 (independent inspection by a third party). Type 2.1 / 2.2 are NOT acceptable for aerospace or medical programs — they are non-specific statements of compliance with no test data. The certificate type must be explicitly printed on the MTR or in an accompanying letter."
      url: https://cnc.bozemetal.com/blog/how-to-read-titanium-mill-test-report/#step-4
    - position: 5
      name: "Sign off and cross-reference the shipment"
      text: "Sign and date the MTR, cross-reference the heat-lot to the receiving-inspection record, and attach to the CofC for the specific shipment. Reject the lot if any of the above checks fail. For AS9100D programs, file the MTR for at least 7 years (longer for aerospace fracture-critical parts per customer contract)."
      url: https://cnc.bozemetal.com/blog/how-to-read-titanium-mill-test-report/#step-5

# ── AIO — Speakable anchors ──
speakableSelectors:
  - "#aio-thesis-1"
  - "#aio-thesis-2"
  - "#aio-thesis-3"
---

A titanium Mill Test Report (MTR) is the documentary proof that the bar, billet, plate or sheet you received matches the chemistry and mechanical properties you ordered. It is the single most common source of disputes between buyers and mills, and the most common point of failure in supplier qualification audits. The 5-step procedure below walks through every field on a real titanium MTR in the order a quality engineer should review it — and shows the typical values you should expect for Grade 2, Grade 5 and Grade 23 ELI.

## Quick answer

<p id="aio-thesis-1"><strong>A valid titanium MTR must contain 5 things: (1) full heat-lot + VAR-ingot traceability, (2) chemistry values within the grade specification, (3) mechanical properties meeting grade minimums (e.g. Grade 5 UTS ≥ 895 MPa, YS ≥ 828 MPa, elong ≥ 10 %), (4) EN 10204 3.1 or 3.2 inspection-certificate type, and (5) a mill-issued signature.</strong> Anything missing one of these is cause for rejection, regardless of the chemistry or strength values shown on the document.</p>

<p id="aio-thesis-2"><strong>Common rejection cause for Grade 23 (ELI): oxygen above 0.13 wt % or nitrogen above 0.03 wt %.</strong> ELI is defined by tight interstitial limits that improve fracture toughness; relaxing the spec converts Grade 23 into Grade 5. MTR review must specifically call out O and N values, not just the alloying elements (Al, V).</p>

<p id="aio-thesis-3"><strong>EN 10204 certificate types: 3.1 = mill-issued test report (acceptable for most programs), 3.2 = independent inspection by a third party (required for some aerospace / nuclear programs). Types 2.1 / 2.2 are non-specific statements of compliance with no test data and are NOT acceptable for aerospace or medical work.</strong> The certificate type must be explicitly stated on the MTR or in an accompanying letter.</p>

## Anatomy of a titanium Mill Test Report

A typical titanium MTR is laid out in six sections. Use this as your checklist before you sign off:

### Section A — Header (product identification)

- **Producer / mill** — full corporate name and address of the mill that issued the MTR (not a distributor).
- **Heat number** — the unique identifier of the original vacuum-arc-remelt (VAR) batch. Used to trace chemistry and mechanical properties back to the melt.
- **Lot number** — the mill's internal lot identifier, may be the same as the heat number or a downstream subdivision.
- **VAR-ingot number** — identifier of the specific VAR-ingot produced from the heat; multiple ingots per heat are common.
- **Product form** — bar, billet, plate, sheet, wire, tube, forging stock, etc.
- **Grade and specification** — e.g. "Grade 5 per AMS 4911" or "Grade 23 per ASTM F136". Must match the drawing call-out exactly.
- **Size** — diameter / thickness × width × length, with applicable tolerance.
- **Condition** — mill-annealed, solution-treated, solution-treated-and-aged (STA), cold-worked, etc.
- **Date of issue** — when the mill issued the MTR.

### Section B — Chemistry (heat analysis)

The chemistry table on the MTR shows measured values for each element in the heat. Cross-reference each value against the grade-specification limits. Below are typical reference values for the three most-procured titanium grades:

| Element | Grade 2 (CP-Ti, ASTM B348) | Grade 5 (Ti-6Al-4V, AMS 4911) | Grade 23 (Ti-6Al-4V ELI, ASTM F136) |
|---------|----------------------------|--------------------------------|--------------------------------------|
| Nitrogen (N), max wt % | 0.03 | 0.05 | 0.03 |
| Carbon (C), max wt % | 0.08 | 0.08 | 0.08 |
| Hydrogen (H), max wt % | 0.015 | 0.015 | 0.012 |
| Iron (Fe), max wt % | 0.30 | 0.30 | 0.25 |
| Oxygen (O), max wt % | 0.25 | 0.20 | 0.13 |
| Aluminum (Al) | — | 5.5–6.75 | 5.5–6.50 |
| Vanadium (V) | — | 3.5–4.5 | 3.5–4.5 |
| Titanium (Ti) | balance | balance | balance |

Pay particular attention to **oxygen (O)**, **nitrogen (N)** and **iron (Fe)** on Grade 23 ELI — these are the interstitial elements that define "ELI" and that are most often over-spec in practice. A Grade 5 sample with O = 0.15 wt % is in spec; a Grade 23 sample with the same O is **out of spec** and must be rejected or downgraded.

### Section C — Mechanical properties (room-temperature tensile)

The mechanical-properties table reports the tensile-test results from a test bar machined from the same heat. The values must meet the **minimum** specification for the grade:

| Property | Grade 2 (CP-Ti) | Grade 5 (Ti-6Al-4V) annealed | Grade 23 (Ti-6Al-4V ELI) annealed |
|----------|------------------|--------------------------------|------------------------------------|
| UTS min (MPa) | 345 | 895 | 860 |
| YS min (MPa) | 275 | 828 | 795 |
| Elongation min (%) | 20 | 10 | 14 |
| Reduction of area min (%) | 30 | 25 | 30 |
| Hardness max (HV) | — | — | — |

For aerospace fracture-critical parts, also require **reduction of area** (RA) and **fracture toughness (K_IC)** data. K_IC for Grade 5 annealed is typically 55–75 MPa·√m; for Grade 23 ELI, 70–90 MPa·√m. If the customer drawing calls out a minimum K_IC, the MTR alone is not sufficient — a separate fracture-mechanics test report is required.

For elevated-temperature service (Ti-6242, Ti-1100, etc.), also require **creep-rupture** and **stress-rupture** data at the design temperature.

### Section D — Inspection certificate type (EN 10204)

The EN 10204 certificate type must be explicitly stated on the MTR or in an accompanying letter. The four types you will see in practice:

- **Type 2.1** — Statement of compliance with the order, no test data. NOT acceptable for aerospace / medical.
- **Type 2.2** — Statement of compliance with the order, with test data on the basis of non-specific inspection. NOT acceptable for aerospace / medical.
- **Type 3.1** — Mill-issued test report, with actual test results from the heat. Acceptable for most programs.
- **Type 3.2** — Independent third-party witnessed test report (e.g. Lloyds, TÜV, DNV). Required for some aerospace / nuclear / prime-contractor programs.

If the certificate type is missing or only says "MTR" without an EN 10204 designation, request clarification from the mill before accepting the shipment.

### Section E — Additional certifications

Depending on the end-use, the MTR may also need to include:

- **ASME Section VIII** compliance statement (for pressure-vessel applications).
- **DFARS 252.225-7008 / 7009** specialty-metal compliance (for US-defense work — restricts sourcing to US-origin or approved-qualifying-country sources).
- **AMS 2774** heat-treatment certification (for solution-treated and aged condition).
- **AMS 2430** shot-peening certification (for fatigue-loaded parts).
- **ASTM F86** passivation certification (for medical implants).

### Section F — Signature

The MTR must be signed by an authorized representative of the mill (typically the Quality Manager or Mill Metallurgist). The signature certifies that the values reported are accurate and traceable to the heat. An unsigned or stamped-only MTR is not a valid document and must be rejected.

## The 5-step MTR validation procedure

### Step 1 — Confirm heat-lot and VAR-ingot traceability

Cross-reference the heat number, lot number, and VAR-ingot number on the MTR to:

- The supplier's CofC for this shipment.
- The supplier's receiving-inspection record (heat number received against the mill's lot number).
- The supplier's ERP / job-traveler system (heat number flowed through every operation).
- The customer's PO (the heat / lot must match the PO line item).

If any link in the chain is broken, the supplier cannot prove that the part you received was made from the heat on the MTR. Reject the lot or quarantine pending investigation.

### Step 2 — Verify chemistry against the grade specification

Walk through every element in Section B and compare against the grade specification. Use a highlighter or a digital annotation tool — do not try to do this from memory. Common errors:

- MTR lists "Grade 5" but does not specify AMS 4911, AMS 4928 or AMS 4930. These are three different specifications with slightly different chemistry limits; the drawing call-out must match exactly.
- Oxygen value is reported to 2 decimal places but the specification limit is to 1 decimal place. Mill labs typically report to higher precision; round before comparing.
- Iron or oxygen is borderline. If it is within 0.01 wt % of the limit, request a check analysis from an independent lab.

### Step 3 — Validate mechanical properties

Cross-check UTS, YS, elongation and reduction of area against the grade-specification minimums. The values on the MTR must **equal or exceed** the minimum — the spec is a floor, not a target.

If the part requires solution-treated-and-aged (STA) condition (UTS ~1100 MPa for Grade 5), verify the heat-treatment cycle on the MTR or in a separate heat-treatment certification. A "mill-annealed" condition reported on a STA drawing call-out is grounds for rejection.

For fracture-critical parts, also require a fracture-toughness (K_IC) test report. The MTR alone does not satisfy this requirement.

### Step 4 — Confirm EN 10204 inspection-certificate type

If the PO specifies EN 10204 3.1, accept 3.1 or 3.2 (3.2 satisfies 3.1). Reject 2.1 or 2.2. If the PO specifies 3.2, only 3.2 is acceptable. If the certificate type is missing, reject pending clarification.

### Step 5 — Sign off and cross-reference the shipment

After all five sections have been validated, sign and date the MTR. File it against:

- The PO line item.
- The supplier's CofC.
- The receiving-inspection record.
- The shipment's AS9102 first-article report (if applicable).

For AS9100D programs, retain the MTR for at least 7 years (longer for aerospace fracture-critical parts per customer contract). For medical-device programs, retain per FDA 21 CFR 820.180 (typically 2 years past the product's expected life, or as specified in the quality manual).

If any step fails, **reject the lot**. Do not accept out-of-spec material on the rationale that the part can be re-graded — once the heat is out of spec for the specified grade, the only options are downgrade to a less-restricted specification, or scrap.

---

## Author & manufacturing context

This procedure is maintained by the quality and engineering team at Boze Titanium Manufacturing Center (Baoji Boze Metal Products Co., Ltd., Shaanxi, China). Our AS9100D-certified facility reviews every inbound titanium MTR against this 5-step checklist before any material enters production. We issue EN 10204 3.1 / 3.2 mill-issued test reports for every outbound shipment, with full heat-lot / VAR-ingot traceability from raw-stock receipt through final inspection. For a sample MTR package, EN 10204 certificate type letter, or an AS9102 first-article report template, [submit an RFQ](/rfq/) and request the document package.
