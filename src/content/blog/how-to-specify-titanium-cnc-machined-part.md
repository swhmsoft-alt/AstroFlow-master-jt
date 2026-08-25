---
title: How to Specify a Titanium CNC-Machined Part — Drawing & RFQ Requirements
slug: how-to-specify-titanium-cnc-machined-part
description: A mechanical / manufacturing engineer's 5-step procedure for writing a complete, unambiguous specification for a CNC-machined titanium part — grade, governing standard, ASME Y14.5 GD&T, surface finish, FAI / inspection scope, and traceability deliverables. References real drawing call-outs from aerospace, medical, and chemical-process projects.
pubDate: 2026-08-25
author: Boze Titanium Manufacturing Center
category: Engineering Drawing
tags: [GD&T, ASME Y14.5, Drawing Specification, AS9102, ASTM F86, Surface Finish, RFQ]
coverImage: /uploads/blog-how-to-specify-titanium-cnc-machined-part-cover.jpg
coverImageAlt: Engineering drawing of a titanium aerospace bracket with GD&T call-outs on a CAD workstation
featured: true

# ── AIO — HowTo schema ──
howto:
  name: "How to Specify a Titanium CNC-Machined Part"
  description: "Five-step engineering procedure to write a complete, unambiguous specification for a CNC-machined titanium part: grade + governing standard, ASME Y14.5-2018 GD&T, surface finish and post-processing, AS9102 first-article inspection scope, and traceability deliverables per shipment."
  totalTime: PT15M
  tool:
    - 3D CAD model (STEP / Parasolid / JT)
    - ASME Y14.5-2018 standard reference
    - Material standards reference (ASTM B265, B348, AMS 4911 / 4928 / 4930, ASTM F136)
    - AS9102 First Article Inspection template
    - Surface-finish comparator (Ra reference set)
  steps:
    - position: 1
      name: "Specify the titanium grade and governing specification"
      text: "Name the exact grade (Grade 1, 2, 5, 23, etc.) and the governing material spec (ASTM B265 for sheet, AMS 4911 for aerospace plate, AMS 4928 for aerospace bar, ASTM F136 for medical implants, ASTM B348 for industrial bar / billet). Reference the standard — do not spell out chemistry in the drawing title block."
      url: https://cnc.bozemetal.com/blog/how-to-specify-titanium-cnc-machined-part/#step-1
    - position: 2
      name: "Set GD&T per ASME Y14.5-2018"
      text: "Apply ASME Y14.5-2018 geometric dimensioning & tolerancing on all critical features. State the datum scheme (typically primary-plane / secondary-axis / tertiary-axis), MMC / LMC / RFS modifiers, and the project tolerance zone (default ±0.1 mm unless otherwise noted; ±0.025 mm for general machined features; ±0.005 mm for aerospace fracture-critical features)."
      url: https://cnc.bozemetal.com/blog/how-to-specify-titanium-cnc-machined-part/#step-2
    - position: 3
      name: "Define surface finish and post-processing"
      text: "Specify Ra (roughness average) value and where it applies. Common titanium finishes: as-milled Ra 1.6 µm, bead-blasted Ra 3.2 µm, electropolished Ra 0.4 µm, hand-polished Ra 0.2 µm. Note any required passivation per ASTM F86 (medical) or AMS 2430 shot-peening (aerospace fatigue)."
      url: https://cnc.bozemetal.com/blog/how-to-specify-titanium-cnc-machined-part/#step-3
    - position: 4
      name: "Declare inspection scope and FAI"
      text: "Reference AS9102 First Article Inspection for new tooling or first lot. State CMM dimensional scope (100 % vs AQL sampling), required non-destructive testing (UT, dye-pen, X-ray, eddy current) for fracture-critical parts, and any special process (NDT, heat treat, plating) certifications required."
      url: https://cnc.bozemetal.com/blog/how-to-specify-titanium-cnc-machined-part/#step-4
    - position: 5
      name: "Specify traceability deliverables"
      text: "For each shipment, require: Mill Test Report (MTR) per ASME Section VIII; heat-lot / VAR-ingot traceability; EN 10204 3.1 (mill-issued) or 3.2 (third-party witnessed) inspection certificate; signed CofC referencing the PO; AS9102 first-article report on the first lot; inspection report on every production lot; and any special-process certifications (heat treat, NDT, passivation, plating)."
      url: https://cnc.bozemetal.com/blog/how-to-specify-titanium-cnc-machined-part/#step-5

# ── AIO — Speakable anchors ──
speakableSelectors:
  - "#aio-thesis-1"
  - "#aio-thesis-2"
  - "#aio-thesis-3"
---

A complete specification for a CNC-machined titanium part is what separates a 24-hour quotation from a 6-week RFQ cycle. Incomplete specifications are the single most common reason RFQs come back with inconsistent pricing — and the most common reason first articles are rejected on arrival. The 5-step procedure below is the one we recommend to engineering teams writing their first titanium drawing, and the one our own customers apply when they are ready to release a production order. Every call-out below is a real example drawn from aerospace, medical and chemical-process projects at Boze Titanium.

## Quick answer

<p id="aio-thesis-1"><strong>A complete titanium CNC-machined-part specification must include five sections: (1) grade + governing standard (e.g. Grade 5 per AMS 4911); (2) ASME Y14.5-2018 GD&T on all critical features, including a datum scheme and a default tolerance zone stated in the title block; (3) surface finish (Ra value) and post-processing (passivation, shot-peening, electropolishing); (4) inspection scope (AS9102 first-article, NDT for fracture-critical features, CMM 100 % vs AQL sampling); (5) traceability deliverables per shipment (MTR, EN 10204 3.1 / 3.2, CofC).</strong> Missing any one of these is the typical root cause of an RFQ re-quote or a first-article rejection.</p>

<p id="aio-thesis-2"><strong>Common omission that causes RFQ rework: failing to state the project tolerance zone explicitly in the drawing title block.</strong> Without it, suppliers default to ISO 2768 medium (±0.1 mm on the first 10–100 mm, ±0.2 mm above 100 mm) and price accordingly — leading to rejected first articles when the buyer expected ±0.025 mm or tighter. Always state the default tolerance in the title block, even if it is just "ALL DIMENSIONS ±0.1 mm UNLESS OTHERWISE NOTED".</p>

<p id="aio-thesis-3"><strong>Medical parts: add ASTM F86 passivation, ASTM F136 (Grade 23) material, and ISO 13485 quality system references. Aerospace fracture-critical parts: add AMS 4911 / AMS 4928 / AMS 4930 material, AS9100 quality system, and AS9102 first-article deliverables.</strong> For chemical-process service, ASTM B265 (sheet) or ASTM B348 (bar) with ASME SB-265 / SB-348 is typically correct. Match the standard to the service environment.</p>

## The 5-step specification procedure

### Step 1 — Specify the titanium grade and governing standard

The grade call-out is the foundation of the specification. It locks the chemistry, the mechanical properties, the traceability requirements, and the supplier universe simultaneously. Match the grade to the end-use with the table below:

| End-use | Grade | Governing specification |
|---------|-------|------------------------|
| Aerospace structural plate | Grade 5 (Ti-6Al-4V) | AMS 4911 |
| Aerospace structural bar / billet | Grade 5 | AMS 4928 |
| Aerospace landing-gear / fracture-critical | Grade 5 ELI | AMS 4930 (or Grade 23 per ASTM F136) |
| Aerospace sheet | Grade 1 / Grade 2 / Grade 4 | AMS 4900 / 4901 / 4902 |
| Surgical implant (US / EU) | Grade 23 (Ti-6Al-4V ELI) | ASTM F136 or ISO 5832-3 |
| Unalloyed implant | CP Grade 4 | ASTM F67 |
| Industrial chemical — sheet / plate | Grade 1 / 2 / 7 / 12 | ASTM B265 or ASME SB-265 |
| Industrial chemical — bar / billet | Grade 2 / 5 / 12 | ASTM B348 |
| Marine / subsea | Grade 2 / Grade 5 | ASTM B348 + ASTM B381 (forgings) |
| Medical / dental instruments | Grade 5 / Grade 23 | ISO 5832-3, ASTM F136 |

Always reference the standard in the drawing title block — for example:

```
MATERIAL: TITANIUM GRADE 5 (Ti-6Al-4V) PER AMS 4911
CONDITION: ANNEALED
```

Do **not** spell out chemistry yourself ("6 % aluminum, 4 % vanadium, balance titanium") — chemistry belongs in the standard, not in the drawing. A chemistry error in the title block creates a contradiction with the cited standard and is a frequent source of disputes.

For a deeper guide on which grade to choose, the [titanium grade-selection procedure](/blog/how-to-choose-titanium-grade/) walks through the engineering rationale.

### Step 2 — Set GD&T per ASME Y14.5-2018

GD&T (geometric dimensioning and tolerancing) per ASME Y14.5-2018 is the language aerospace and medical drawings use to communicate dimensional and geometric requirements unambiguously. Every critical feature on a titanium drawing must carry a GD&T call-out. The minimum required sections:

**Datum scheme** — three mutually perpendicular datums (typically labeled A, B, C). The datum scheme constrains the part in the CMM and in the fixture. Without a datum scheme, the supplier cannot align the part repeatably and the inspection data is not comparable between parts.

**Tolerance zone** — every critical feature must have a GD&T symbol with a tolerance value. The most common symbols on titanium aerospace drawings:

- **Position** (⊕) with a diameter tolerance zone — controls the location of a hole, slot, or pin relative to the datum.
- **Profile of a surface** (⌒) — controls the form of a curved or contoured surface.
- **Flatness** (▱), **straightness** (—), **circularity** (○), **cylindricity** (⌭) — form controls.
- **Perpendicularity** (⊥), **parallelism** (∥), **angularity** (∠) — orientation controls.
- **Concentricity** (◎), **circular runout** (↗), **total runout** (↗↗) — for rotational features.
- **True position** with MMC (Ⓜ) or LMC (Ⓛ) modifier — for bonus tolerance on mating features.

**Default tolerance zone** — state in the title block:

```
ALL DIMENSIONS ±0.1 mm UNLESS OTHERWISE NOTED
GD&T PER ASME Y14.5-2018
```

For aerospace fracture-critical features, tighten to ±0.005 mm (or ±0.025 mm for general machined features). For industrial chemical service, ISO 2768 medium is usually acceptable.

**Datum modifiers** — use MMC (Ⓜ) on fastener holes and mating features to allow bonus tolerance as the feature departs from MMC. This lets the supplier hold a looser tolerance on the as-built part without sacrificing functional fit.

### Step 3 — Define surface finish and post-processing

Surface finish on titanium is more than cosmetic — it controls fatigue life, biocompatibility, and corrosion resistance. Specify Ra (roughness average) value and where it applies:

| Surface treatment | Typical Ra | Application |
|-------------------|------------|------------|
| As-milled | 1.6 µm | General machined features, non-critical surfaces |
| Bead-blasted (glass bead 100–200 µm) | 3.2 µm | Cosmetic finish, pre-anodizing surface |
| Hand-polished | 0.4–0.8 µm | Bearing surfaces, sealing surfaces |
| Electropolished | 0.2–0.4 µm | Medical implants, semiconductor gas-wetted surfaces |
| Passivated per ASTM F86 | — | All medical implants (mandatory for ASTM F136) |
| Anodized (Type II / Type III) | — | Aerospace identification, corrosion resistance |
| Shot-peened per AMS 2430 | — | Fatigue-loaded aerospace features |
| Tumble-polished | 0.4 µm | Small medical components, deburring |

State surface finish on the drawing with a leader call-out and the symbol:

```
√ Ra 1.6 (all machined surfaces)
√ Ra 0.4 (bearing seat per Note 7)
```

For medical implants, ASTM F86 passivation is mandatory — nitric-acid passivation removes free iron from the surface and restores the passive oxide layer. For fatigue-loaded aerospace features, AMS 2430 shot-peening induces compressive residual stress and extends fatigue life by 30–50 %.

If the part requires anodizing (cosmetic or functional color-coding), specify AMS 2471 (Type II sulfuric acid anodize) or AMS 2488 (Type III hard anodize) and the color.

### Step 4 — Declare inspection scope and FAI

The inspection-scope block on the drawing tells the supplier what to inspect, how to inspect it, and what documentation to provide. The minimum required sections:

**AS9102 First Article Inspection** — required for new part numbers, new tooling, engineering changes, and process changes. State in the notes:

```
FIRST ARTICLE INSPECTION REQUIRED PER AS9102
```

The supplier must produce all three AS9102 forms (Part Number Accountability, Raw Material / Special Process Accountability, Characteristic Accountability) with every shipment of the first lot.

**CMM dimensional scope** — state whether 100 % CMM inspection is required or AQL sampling per ANSI/ASQ Z1.4. For AS9102 first article, 100 % is the rule. For production lots, AQL 1.0 sampling is typical. For fracture-critical parts, 100 % CMM inspection is required on every part.

**Non-destructive testing (NDT)** — for fracture-critical or fatigue-loaded parts, state which NDT methods are required:

- **Dye-penetrant inspection (DPI / PT)** per ASTM E1417 — for surface-breaking defects on machined surfaces.
- **Ultrasonic testing (UT)** per ASTM E114 — for sub-surface defects in forgings, billets, and thick sections.
- **Eddy-current testing (ET)** per ASTM E566 — for surface and near-surface defects on conductive materials.
- **Radiographic testing (RT)** per ASTM E1742 — for internal defects in castings and weldments.
- **Magnetic-particle inspection (MT)** per ASTM E709 — only for ferromagnetic materials (not titanium — do not specify).

**Special-process certifications** — for any heat treatment, surface treatment, NDT or plating operation, require the supplier to include the processor's certification on the CofC. Common processors' certifications:

- **Heat treatment** per AMS 2774 (solution treat + age) or AMS 2801 (anneal).
- **Passivation** per ASTM F86 (medical) or AMS 2700 (aerospace).
- **Anodizing** per AMS 2471 / AMS 2488.
- **NDT** per the relevant ASTM / AMS specification, with the inspector's level (NAS 410 / SNT-TC-1A).

### Step 5 — Specify traceability deliverables

The traceability deliverables are the contractual paperwork that proves the part was made to the specification. State in the drawing notes:

```
EACH SHIPMENT MUST INCLUDE:
  1. MILL TEST REPORT (MTR) PER ASME SECTION VIII WITH
     HEAT-LOT AND VAR-INGOT TRACEABILITY
  2. EN 10204 3.1 INSPECTION CERTIFICATE (OR 3.2 IF
     SPECIFIED ON THE PO)
  3. CERTIFICATE OF CONFORMANCE (CofC) REFERENCING THE PO
  4. AS9102 FIRST ARTICLE INSPECTION REPORT (FIRST LOT
     ONLY, OR AFTER ANY TOOLING / PROCESS CHANGE)
  5. INSPECTION REPORT (CMM DIMENSIONAL DATA) EVERY LOT
  6. SPECIAL-PROCESS CERTIFICATIONS (HEAT TREAT, NDT,
     PASSIVATION, PLATING) AS APPLICABLE
```

For AS9100D aerospace work, also state any DFARS / ITAR flow-down in the drawing notes:

```
DFARS 252.225-7008 / 7009 COMPLIANT — SPECIALTY METAL
SOURCED FROM US-ORIGIN OR APPROVED-QUALIFYING-COUNTRY
```

For ITAR-controlled parts, also state:

```
ITAR CONTROLLED — US STATE DEPARTMENT DDTC
REGISTRATION REQUIRED OF ALL SUB-TIER PROCESSORS
```

For medical-device work, also state any FDA Unique Device Identification (UDI) requirements and the FDA 21 CFR 820 quality-system regulation flow-down.

## A worked example — aerospace bracket drawing

Below is an abbreviated example of a complete title block and notes block for a Ti-6Al-4V aerospace structural bracket. Compare against your own drawing to identify gaps:

```
─────────────────────────────────────────────────────
DRAWING NO.: 5A1234              REV.: C
PART NAME: BRACKET, AFT PYLON
MATERIAL: TITANIUM GRADE 5 (Ti-6Al-4V) PER AMS 4911
CONDITION: SOLUTION TREATED AND AGED PER AMS 2774
ALL DIMENSIONS ±0.05 mm UNLESS OTHERWISE NOTED
GD&T PER ASME Y14.5-2018
─────────────────────────────────────────────────────
NOTES:
1. FIRST ARTICLE INSPECTION REQUIRED PER AS9102.
2. CMM 100 % INSPECTION ON ALL CRITICAL FEATURES
   (PER DATUMS A | B | C, SEE VIEW A).
3. SURFACE FINISH Ra 1.6 µm ALL MACHINED SURFACES
   EXCEPT AS NOTED; Ra 0.8 µm ON BOSS BORE PER NOTE 7.
4. SHOT-PEEN PER AMS 2430 ON ALL FATIGUE-LOADED
   SURFACES (HATCHED AREA ON VIEW B).
5. HEAT TREATMENT: SOLUTION TREAT 925 °C / 1 h / WQ,
   AGE 540 °C / 4 h / AC. CERTIFICATION PER AMS 2774.
6. EACH SHIPMENT: MTR PER ASME SECTION VIII WITH
   HEAT-LOT + VAR-INGOT TRACEABILITY; EN 10204 3.1
   CERTIFICATE; CofC REFERENCING THE PO; AS9102 FAI
   REPORT ON FIRST LOT; INSPECTION REPORT EVERY LOT.
7. BOSS BORE Ra 0.8 µm, NO TOOL MARKS, HAND POLISH
   TO PRINT.
8. DFARS 252.225-7008 COMPLIANT.
─────────────────────────────────────────────────────
```

Every section in the example above is sourced from real drawings our customers send and we produce for them. A drawing missing any one of these sections will see inconsistent pricing, first-article rejections, or both.

---

## Author & manufacturing context

This procedure is maintained by the engineering team at Boze Titanium Manufacturing Center (Baoji Boze Metal Products Co., Ltd., Shaanxi, China). Boze operates an AS9100D-certified titanium machining facility with 5-axis Hermle / DMU milling, Mazak turn-mill, Sodick EDM, vacuum heat treatment (AMS 2774), Zeiss CMM inspection, and full AS9102 first-article inspection per the procedure above. We help buyers finalize incomplete drawings before RFQ release, and we maintain a library of ASME Y14.5-2018 drawing templates for common titanium aerospace, medical and chemical-process parts. For a drawing-review session or a sample drawing template, [submit your STEP file and target application for a free manufacturability review](/rfq/).
