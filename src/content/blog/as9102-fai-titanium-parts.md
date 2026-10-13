---
title: "AS9102 First Article Inspection for Titanium CNC Parts"
description: "Engineering guide to AS9102 First Article Inspection (FAI) for titanium CNC parts — the three forms (Design, Detailed, Assembly), the required characteristics (catalog of features, dimensional, material, process, inspection method), the report preparation workflow, common findings and how to prevent them, and the integration with AS9100D quality management."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Quality & Standards
tags: [AS9102, First Article Inspection, FAI, Aerospace Quality, AS9100D, Dimensional Layout, Material Certification, Process Documentation, AS9100, Aerospace Documentation]
coverImage: /uploads/PLACEHOLDER-blog-as9102-fai-titanium-parts-cover.jpg
coverImageAlt: PLACEHOLDER — AS9102 first article inspection report on a titanium aerospace part. To be replaced with the final image.
featured: false
---

AS9102 First Article Inspection (FAI) is the aerospace industry standard for verifying that the first part off a new production cycle meets every requirement on the print. For titanium CNC parts in AS9100D programs, the FAI is the formal record of the design freeze, the process qualification, and the inspection baseline — the report that links the print, the material certificate, the process documentation, and the measured dimensions into a single document that the buyer's quality team reviews before the production run is released. A correctly executed FAI prevents the most common aerospace quality failures (drawing misinterpretation, material mix-up, tolerance stack-up errors) and is the foundation of the per-lot AS9102 re-verification that AS9100D requires for production runs. An incorrectly executed FAI is the most expensive document error in the production cycle, because every subsequent part on the production order is measured against an FAI that may not reflect the actual part.

This article works through the four decisions that determine whether an AS9102 FAI is correctly executed: the FAI form selection (Design / Detailed / Assembly), the characteristic catalog (what must be measured), the report preparation workflow, and the integration with the AS9100D quality management system. It assumes the [AS9100D quality management article](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/), the [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/), and the [tolerance cost article](/blog/titanium-cnc-tolerance-cost/) as background — those cover the broader quality and tolerance landscape; here we focus on the FAI process specifically. For the supplier qualification side, the [AS9100 qualification guide](/blog/how-to-qualify-as9100-titanium-supplier/) and the [supplier selection guide](/blog/how-to-choose-titanium-cnc-machining-supplier/) are the cross-references.

- [What AS9102 is and what it is not](#what-as9102-is-and-what-it-is-not)
- [The three AS9102 forms: Design, Detailed, Assembly](#the-three-as9102-forms-design-detailed-assembly)
- [The AS9102 characteristic catalog: what must be measured](#the-as9102-characteristic-catalog-what-must-be-measured)
- [Report preparation workflow](#report-preparation-workflow)
- [Common findings and how to prevent them](#common-findings-and-how-to-prevent-them)
- [Integration with AS9100D quality management](#integration-with-as9100d-quality-management)
- [AS9102 FAI checklist](#as9102-fai-checklist)

## What AS9102 is and what it is not

AS9102 is the SAE aerospace standard titled "First Article Inspection — Aerospace Product." The standard defines the requirements for the first article inspection of aerospace products, and it is invoked by every AS9100D-certified aerospace procurement contract. The standard specifies:

- **When** the FAI is required (at the start of a new production run, after a design change, after a process change, after a tooling change, after a supplier change, after a lapse in production of more than 24 months).
- **What** must be measured (every characteristic on the print, plus material, process, and inspection method).
- **How** the FAI is documented (the three AS9102 forms, the required signatures, the retention period).
- **What** happens if the FAI fails (the part is non-conforming, the production run is held, the corrective action is documented).

The standard does NOT specify:

- **The form of the inspection report.** AS9102 allows the report to be in any format (paper or electronic) that captures the required information, with the three forms (Design, Detailed, Assembly) being the SAE-defined templates. Most AS9100D programs accept a custom electronic form that captures the same information as the SAE templates.
- **The inspection method.** AS9102 requires that the inspection method be documented for each characteristic, but the standard does not specify the method (CMM, hand gauge, optical comparator, etc.). The method is selected by the supplier based on the characteristic's tolerance, the inspection equipment available, and the buyer's quality requirements.
- **The sampling rate.** AS9102 is a 100% inspection of the first article.
- **The retention period beyond the minimum.** AS9102 specifies a minimum retention period of 7 years (for AS9100D programs); many programs require a longer retention (10 years, 25 years, or the program life).

The boundary between what AS9102 specifies and what it does not is the source of most FAI disputes between buyers and suppliers. The standard practice is to require the SAE forms (or an equivalent electronic form), the inspection methods specified by the supplier, the sample size of 1 (the first article), and a retention period of at least 7 years.

For titanium CNC parts specifically, the FAI typically covers dimensional inspection, GD&T inspection, material verification (MTR per EN 10204 3.1), process verification, and visual inspection (surface finish, edge break, burr spec).

The FAI is a comprehensive document that captures every characteristic of the part at the first article. A correctly executed FAI takes 4–16 hours of inspection and documentation time, depending on the part complexity and the FAI scope.


## The three AS9102 forms: Design, Detailed, Assembly

The AS9102 standard defines three forms that comprise the FAI report:

**Form 1 — Design Accountable.** The form that captures the design characteristics of the part. The form lists every characteristic on the print (dimensions, tolerances, GD&T callouts, material, surface treatment, notes) with a checkmark against each characteristic confirming that the part conforms. The form is typically 5–20 pages for a typical titanium CNC part, depending on the part complexity. The form is signed by the supplier's engineering team (typically the process engineer or the quality engineer) and the buyer's engineering team (typically the design engineer or the source quality engineer).

**Form 2 — Detailed Partial FAI.** The form that captures the detailed measurements of the part. The form is a table with one row per characteristic and columns for the nominal value, the tolerance, the measured value, the inspection method, the inspector, and the date. The form is typically 5–50 pages for a typical titanium CNC part, depending on the characteristic count. A part with 30 measurable characteristics on the print generates a 30-row Form 2; a part with 100 measurable characteristics generates a 100-row Form 2. The form is signed by the supplier's inspection team and the buyer's source quality team.

**Form 3 — Assembly (if applicable).** The form that captures the assembly-level FAI for parts that are part of an assembly. The form is only used when the part is an assembly component. For a single titanium CNC part that is not part of a larger assembly, Form 3 is not required.

The three forms are typically combined into a single FAI report, with the Design Accountable form at the front, the Detailed Partial FAI in the middle, and the Assembly form (if applicable) at the back. The combined report is the FAI that the buyer's quality team reviews.

A custom electronic FAI form that captures the same information as the SAE forms is acceptable for most AS9100D programs. The custom form should include a header with the part number, the part revision, the drawing revision, the material spec, the AS9100D program, the supplier, and the buyer's CAGE code; a characteristic table; a measurement table; and a signature block. The custom electronic form is faster to prepare, easier to review, and easier to retain than the paper SAE forms.

## The AS9102 characteristic catalog: what must be measured

The AS9102 standard requires that every characteristic on the print be measured and documented. The characteristic catalog is the list of every characteristic that the FAI must cover, and the catalog is the single most important deliverable of the FAI. A complete characteristic catalog has four categories:

**1. Dimensional characteristics.** Every linear dimension, angular dimension, and radius on the print. The catalog typically includes 20–100 dimensional characteristics for a typical titanium CNC part, and the inspection method is hand gauge (for tolerances above ±0.05 mm) or CMM (for tolerances at or below ±0.05 mm).

**2. GD&T characteristics.** Every datum reference frame, every position tolerance, every profile tolerance, every runout tolerance, every concentricity tolerance, every perpendicularity tolerance, every parallelism tolerance, every flatness tolerance, every circularity tolerance, and every cylindricity tolerance. The catalog typically includes 5–30 GD&T characteristics for a typical titanium CNC part. The inspection method is CMM for all GD&T characteristics, with the CMM cycle time scaled to the characteristic count and the tolerance.

**3. Material characteristics.** The material spec (per the print), the heat-treatment condition (per the print), the MTR (per EN 10204 3.1), the chemistry (verified against the spec), the mechanical properties (verified against the spec), and the grain-flow direction (if specified on the print). The catalog typically includes 5–10 material characteristics, and the inspection method is the MTR review and the laboratory test report (for mechanical properties).

**4. Process characteristics.** The process spec (per the print), the surface treatment spec (per the print), the surface finish (Ra per the print), the edge break (per the print), the burr spec (per the print), the special process certification (welding, NDT, etc., if applicable). The catalog typically includes 5–20 process characteristics.

The total characteristic count for a typical titanium CNC aerospace part is 35–160 characteristics, and the FAI report is 10–60 pages depending on the part complexity and the FAI format. A buyer who requests an FAI with fewer than 20 characteristics is under-scoping; a buyer who requests more than 200 characteristics is over-scoping.

The [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/) covers the material side of the FAI in detail, and the [tolerance cost article](/blog/titanium-cnc-tolerance-cost/) covers the dimensional side. The FAI is the integration of all four categories into a single document.


## Report preparation workflow

The FAI report preparation workflow is a four-step process, with each step producing a deliverable that the next step builds on. The four steps:

**Step 1 — Characteristic catalog generation (2–8 hours).** The supplier's engineering team reviews the print, identifies every characteristic in the four categories, and generates the characteristic catalog (Form 1). The catalog is reviewed by the buyer's engineering team to confirm that every characteristic on the print is captured. The catalog is the foundation for the FAI; a missing characteristic in the catalog is a missing characteristic in the FAI.

**Step 2 — First article machining and inspection (4–40 hours, depending on the part).** The first article is machined on the production tooling, with the production parameters and the production inspection scope. The first article is inspected against the characteristic catalog, with every characteristic measured and recorded. The inspection includes dimensional measurement (CMM and hand gauge), GD&T measurement (CMM), material verification (MTR review), and process verification (process documentation review).

**Step 3 — FAI report assembly (2–8 hours).** The supplier's quality team assembles the FAI report from the characteristic catalog, the first article measurements, the MTR, the process documentation, and the inspection method documentation. The report is signed by the supplier's engineering team and the supplier's quality team.

**Step 4 — Buyer review and approval (2–8 hours).** The buyer's source quality team reviews the FAI report, verifies the measurements against the print, and either approves the FAI (which releases the production run) or rejects the FAI (which holds the production run until the corrective action is documented and a new first article is produced).

The total workflow time is 10–64 hours, depending on the part complexity. The workflow is typically run by the supplier's process engineer or quality engineer, with the buyer's source quality engineer as the approver. A workflow that takes less than 4 hours is under-scoping the FAI; a workflow that takes more than 80 hours is over-scoping. The standard AS9100D timeline for an FAI is 5–10 business days from the first article completion to the buyer's approval.

## Common findings and how to prevent them

The most common FAI findings on titanium CNC parts fall into six categories. Each finding is preventable with the right discipline at the supplier or the buyer:

**1. Missing characteristic.** A characteristic on the print that is not in the FAI. The most common finding (roughly 30% of all FAI findings) and the most preventable. The prevention is the catalog review at Step 1, with the buyer's engineering team verifying that every characteristic is captured.

**2. Measurement out of tolerance.** A characteristic that is measured but is outside the print tolerance. The second most common finding (roughly 25%) and the most expensive to fix. The prevention is the machining discipline (warm-up, tool replacement, in-process probing) covered in the [dimensional drift article](/blog/titanium-cnc-dimensional-drift/).

**3. Inspection method not specified.** A characteristic that is measured but where the inspection method is not documented. The third most common finding (roughly 15%). The prevention is the FAI template that requires the inspection method for every row.

**4. Material certificate not matching the spec.** A material MTR that does not match the print specification (wrong grade, wrong condition, wrong heat-treatment lot). The fourth most common finding (roughly 10%). The prevention is the MTR verification at receiving inspection, before the material enters the production cycle.

**5. Process deviation not documented.** A process change between the FAI and the production run that is not documented in the FAI. The fifth most common finding (roughly 10%). The prevention is the process-change-control discipline.

**6. Datum reference frame mismatch.** A GD&T characteristic that is measured against a different datum reference frame than the print specifies. The sixth most common finding (roughly 10%). The prevention is the CMM programmer's verification that the datum alignment matches the print's datum reference frame.

The six findings together account for 95% of all AS9102 FAI findings on titanium CNC parts, and the prevention for each is a discipline that the supplier or the buyer can implement at no significant cost. The [CMM total cost of ownership article](/blog/5-year-cmm-total-cost-of-ownership-aerospace-startup/) covers the CMM-side discipline.


## Integration with AS9100D quality management

The AS9102 FAI is a single document in the broader AS9100D quality management system, and the FAI's value comes from its integration with the other AS9100D documents. The integration points are:

- **AS9100D quality manual** — the top-level document that defines the supplier's quality management system. The FAI is referenced in the quality manual as the verification of the first article.
- **Process plan / control plan** — the document that defines the production cycle. The FAI is the verification that the process plan produces a part that meets the print.
- **Inspection plan** — the document that defines the per-lot inspection scope. The FAI is the baseline for the per-lot inspection.
- **Material certification** — the MTR per EN 10204 3.1. The FAI references the MTR for the material verification.
- **Calibration records** — the documents that verify the inspection equipment is calibrated. The FAI references the calibration records for the CMM and the hand gauges used in the inspection.

The integration is the buyer's audit point. An AS9100D audit by the buyer's source quality team will verify that the FAI references the correct process plan, the correct MTR, the correct calibration records, and the correct inspection plan. A FAI that does not reference these documents is non-conforming, and the FAI is rejected.

The AS9100D audit is typically annual for established suppliers, with a re-audit every 3 years for full certification. A supplier with a 90%+ FAI acceptance rate is typically considered low-risk; a supplier with a 70–90% rate is medium-risk; a supplier with a <70% rate is high-risk and may be subject to additional audits or a contract review.

## AS9102 FAI checklist

- Generate the characteristic catalog from the print, with every dimension, GD&T callout, material, and process requirement. Verify the catalog against the print at a review meeting before machining the first article.
- Machine the first article on the production tooling, with the production parameters and the production inspection scope. Do not use prototype tooling or prototype parameters.
- Inspect the first article against the characteristic catalog, with the appropriate inspection method for each characteristic. CMM for GD&T and tight-tolerance dimensions; hand gauge for loose-tolerance dimensions; laboratory test for mechanical properties.
- Assemble the FAI report from the characteristic catalog, the first article measurements, the MTR, the process documentation, and the inspection method documentation. Sign the report by the supplier's engineering team and the supplier's quality team.
- Submit the FAI report to the buyer's source quality team for review. The buyer's review verifies the measurements against the print, the material against the spec, the process against the process plan, and the inspection method against the inspection plan.
- Approve the FAI before the production run is released. The FAI approval is the buyer's authorisation to begin the production run.
- Re-verify the FAI on a per-lot basis, with a partial FAI (typically 5–10 characteristics) on every lot and a full FAI on the first lot of any new production run.
- Retain the FAI for at least 7 years (AS9100D minimum) and longer for safety-critical parts (typically 25 years or the program life).
- Track the FAI acceptance rate and the time-to-approval, and use the data to drive process improvements.

For an AS9102 FAI review against a specific titanium program, send the print, the inspection plan, the process plan, and the MTR to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with characteristic catalog, inspection method, and FAI workflow recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium FAI against the checklist above before the buyer's submission, and the typical outcome is a review that surfaces 1–2 characteristic-coverage gaps per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the FAI characteristic catalog and the inspection method documentation are what determine whether the FAI is accepted on the first review or whether it goes to rework — and that determination is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — AS9102 FAI workflow: Flowchart from characteristic catalog generation → first article machining → inspection → FAI report assembly → buyer review → FAI approval, with the typical time at each step. Supports queries about the AS9102 FAI process timeline.
Fig 2 — FAI characteristic distribution: Pie chart showing the typical distribution of FAI characteristics by category (dimensional, GD&T, material, process) for a typical titanium CNC aerospace part. Supports queries about the scope of an AS9102 FAI.
Fig 3 — Common FAI findings: Bar chart with the six common findings (missing characteristic, out of tolerance, inspection method not specified, MTR mismatch, process deviation, datum mismatch) on the X axis and the typical occurrence rate (%) on the Y axis. Supports queries about what to watch for in an AS9102 FAI review.
-->